import { spawn } from "node:child_process";
import { readFile, writeFile, mkdir, copyFile, access } from "node:fs/promises";
import { resolve, join } from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { root, prepare } from "./prepare.mjs";
import { acquireLock } from "./lock.mjs";
import { validate } from "./validate.mjs";
import { parseSrt } from "../src/vendor/opencut-srt.mjs";
const release = acquireLock(join(root, "output/production.lock"));
process.on("exit", release);
const source = resolve(
  process.argv[2] || join(root, "projects/primeiro-reel.json"),
);
const p = validate(JSON.parse(await readFile(source, "utf8")));
const out = join(root, "output", p.id);
await mkdir(out, { recursive: true });
async function status(step) {
  console.log(step);
  await writeFile(
    join(out, "status.json"),
    JSON.stringify({ step, at: new Date().toISOString() }),
  );
}
function run(cmd, args) {
  return new Promise((res, rej) => {
    let c = spawn(cmd, args, {
      cwd: root,
      stdio: "inherit",
      env: {
        ...process.env,
        PATH: "/opt/homebrew/bin:" + process.env.PATH,
        PYTORCH_ENABLE_MPS_FALLBACK: "1",
      },
    });
    c.on("error", rej);
    c.on("exit", (code) =>
      code === 0 ? res() : rej(Error(cmd + " terminou com código " + code)),
    );
  });
}
async function exists(f) {
  try {
    await access(f);
    return true;
  } catch {
    return false;
  }
}
try {
  const previous = await readFile(join(out, "render-input.json"), "utf8").catch(
    () => null,
  );
  const input = JSON.stringify(p);
  const reuse = previous === input;
  if (!reuse || !(await exists(join(out, "voice.wav")))) {
    await status("Gerando voz em português");
    if (p.voice === "rayssa")
      await run(process.execPath, [
        "--env-file=/Users/armaandaswani/Desktop/Xtras/rea-main/humanvoice/data/integration.env",
        "scripts/humanvoice.mjs",
        source,
        join(out, "voice.wav"),
      ]);
    else
      await run(join(root, "../.render/video-tools/python/bin/python"), [
        "scripts/voice.py",
        source,
        join(out, "voice.wav"),
      ]);
  }
  await status("Preparando áudio");
  await run("/opt/homebrew/bin/ffmpeg", [
    "-y",
    "-i",
    join(out, "voice.wav"),
    "-af",
    "adelay=350|350,loudnorm=I=-16:TP=-1.5:LRA=7",
    "-ar",
    "48000",
    join(out, "voice-master.wav"),
  ]);
  const { execFileSync } = await import("node:child_process");
  const seconds = Number(
    execFileSync(
      "/opt/homebrew/bin/ffprobe",
      [
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "csv=p=0",
        join(out, "voice-master.wav"),
      ],
      { encoding: "utf8" },
    ),
  );
  p.duration = Math.max(12, Math.ceil((seconds + 0.25) * 30) / 30);
  if (p.duration > 40)
    throw Error(
      "A narração ficou longa. Reduza o roteiro para até 40 segundos.",
    );
  await writeFile(join(out, "narration.txt"), p.narration);
  await status("Transcrevendo e sincronizando legendas");
  await run(join(root, "../.render/video-tools/python/bin/python"), [
    "scripts/transcribe.py",
    join(out, "voice.wav"),
    join(out, "captions.json"),
    join(out, "captions.srt"),
    join(out, "narration.txt"),
  ]);
  const parsed = parseSrt({
    input: await readFile(join(out, "captions.srt"), "utf8"),
  });
  if (parsed.skippedCueCount || !parsed.captions.length)
    throw Error("OpenCut rejeitou as legendas.");
  await writeFile(
    join(out, "opencut-captions.json"),
    JSON.stringify(parsed, null, 2),
  );
  await status("Construindo cenário e animação");
  await prepare(p, join(out, "film"));
  await status("Renderizando imagem com HyperFrames");
  await run(join(root, "node_modules/.bin/hyperframes"), [
    "render",
    join(out, "film"),
    "--output",
    join(out, "base.mp4"),
    "--fps",
    "30",
    "--quality",
    "delivery",
    "--workers",
    "1",
    "--low-memory-mode",
  ]);
  const pub = join(root, "public/generated", p.id);
  await mkdir(join(pub, "assets"), { recursive: true });
  for (const f of ["base.mp4", "voice-master.wav"])
    await copyFile(join(out, f), join(pub, f));
  await copyFile(
    join(out, "film/assets/sans.woff2"),
    join(pub, "assets/sans.woff2"),
  );
  const { cues } = JSON.parse(
    await readFile(join(out, "captions.json"), "utf8"),
  );
  const props = { id: p.id, cues, duration: p.duration };
  await status("Finalizando com Remotion");
  const serveUrl = await bundle({
    entryPoint: join(root, "src/index.jsx"),
    publicDir: join(root, "public"),
  });
  const options = {
    serveUrl,
    inputProps: props,
    browserExecutable:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    chromiumOptions: { gl: "angle" },
  };
  const composition = await selectComposition({ ...options, id: "KombuReel" });
  await renderMedia({
    ...options,
    composition,
    codec: "h264",
    colorSpace: "bt709",
    pixelFormat: "yuv420p",
    audioCodec: "aac",
    crf: 18,
    concurrency: 1,
    outputLocation: join(out, "remotion-master.mp4"),
  });
  await status("Preparando MP4 para revisão");
  await run("/opt/homebrew/bin/ffmpeg", [
    "-y",
    "-i",
    join(out, "remotion-master.mp4"),
    "-c:v",
    "copy",
    "-c:a",
    "copy",
    "-movflags",
    "+faststart",
    join(out, "Kombu-Reel.mp4"),
  ]);
  if (p.voice === "rayssa") {
    p.releaseScope = "private-noncommercial-preview";
    await writeFile(
      join(out, "USO-DA-VOZ.txt"),
      "Prévia privada com Rayssa original. O HumanVoice instalado usa pesos OmniVoice CC-BY-NC. Este arquivo não está liberado para publicação comercial. A voz não foi substituída silenciosamente.\n",
    );
  }
  await writeFile(join(out, "project.json"), JSON.stringify(p, null, 2));
  await writeFile(join(out, "render-input.json"), input);
  await writeFile(join(out, "legenda.txt"), p.caption + "\n");
  const pack = join(out, "OpenCut");
  await mkdir(pack, { recursive: true });
  for (const [a, b] of [
    ["base.mp4", "video-sem-legendas.mp4"],
    ["voice-master.wav", "narracao.wav"],
    ["captions.srt", "legendas.srt"],
    ["Kombu-Reel.mp4", "reel-final.mp4"],
  ])
    await copyFile(join(out, a), join(pack, b));
  if (p.voice === "rayssa")
    await copyFile(join(out, "USO-DA-VOZ.txt"), join(pack, "USO-DA-VOZ.txt"));
  await writeFile(
    join(pack, "LEIA-ME.txt"),
    "OpenCut Classic: crie um projeto vertical 1080 × 1920, 30 fps. Importe video-sem-legendas.mp4 e narracao.wav em faixas separadas, ambos no início. Em Legendas > Importar, selecione legendas.srt. Os tempos já incluem a margem inicial. Não importe reel-final.mp4 junto com a narração: ele já contém áudio e legendas. Este pacote contém mídias e SRT; não é um projeto nativo do OpenCut.\n",
  );
  await run("/usr/bin/zip", [
    "-r",
    "-q",
    join(out, "Kombu-OpenCut.zip"),
    "output/" + p.id + "/OpenCut",
  ]);
  await status("Pronto para revisar");
} catch (e) {
  await status("Falha: " + e.message);
  process.exitCode = 1;
}
