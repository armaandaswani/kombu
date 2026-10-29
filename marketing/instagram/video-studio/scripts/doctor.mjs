import { readFile, access } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { root } from "./prepare.mjs";
const p = JSON.parse(await readFile(join(root, "package.json")));
for (const name of ["hyperframes", "remotion", "three", "animejs"])
  console.log(name, p.dependencies[name]);
console.log(
  "OpenCut: parser SRT incorporado (MIT) e pacote de mídias editáveis. Editor gráfico externo: OpenCut Classic.",
);
const python = join(root, "../.render/video-tools/python/bin/python");
const r = spawnSync(
  python,
  [
    "-c",
    'import torch, chatterbox, faster_whisper, perth; assert perth.PerthImplicitWatermarker is not None; print("Chatterbox + faster-whisper importados; MPS:", torch.backends.mps.is_available())',
  ],
  { encoding: "utf8" },
);
console.log(r.stdout || r.stderr);
if (r.status) process.exitCode = 1;
for (const f of [
  "/opt/homebrew/bin/ffmpeg",
  "/opt/homebrew/bin/ffprobe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
])
  try {
    await access(f);
    console.log("OK", f);
  } catch {
    console.log("FALTA", f);
    process.exitCode = 1;
  }
