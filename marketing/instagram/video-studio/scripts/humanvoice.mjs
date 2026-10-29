// Backend only. Credentials are loaded by Node's --env-file, never returned to the studio.
import { readFile, writeFile } from "node:fs/promises";
import { HumanVoiceClient } from "/Users/armaandaswani/Desktop/Xtras/rea-main/humanvoice/integrations/humanvoice-client.mjs";
const client = HumanVoiceClient.fromEnv(process.env);
if (process.argv[2] === "--probe") {
  const health = await client.health();
  const catalog = await client.voices();
  console.log(
    JSON.stringify(
      {
        health,
        voices: catalog.voices?.map(({ id, key, name, language }) => ({
          id,
          key,
          name,
          language,
        })),
      },
      null,
      2,
    ),
  );
} else {
  const p = JSON.parse(await readFile(process.argv[2], "utf8"));
  const out = process.argv[3];
  const record = out + ".humanvoice.json";
  const catalog = await client.voices();
  const v = catalog.voices.find((v) => v.key === "rayssa");
  if (!v)
    throw Error(
      "Rayssa original não está disponível no HumanVoice. Nenhuma outra voz foi usada.",
    );
  let saved = JSON.parse(await readFile(record, "utf8").catch(() => "null"));
  if (saved && (saved.text !== p.narration || saved.voice !== v.key))
    throw Error("Esta prévia pertence a outro roteiro. Use outro projeto.");
  if (!saved) {
    const job = await client.createSpeech({
      text: p.narration,
      voice: "rayssa",
      language: "pt-BR",
      title: "Kombú — prévia privada: " + p.title,
      seed: 42,
    });
    saved = {
      id: job.id,
      voice: v.key,
      text: p.narration,
      usage: "private-preview",
      engineLicense:
        "Installed OmniVoice weights: CC-BY-NC. Commercial release requires compatible rights.",
    };
    await writeFile(record, JSON.stringify(saved, null, 2));
    console.log("HumanVoice: prévia privada na fila, Rayssa original.");
  }
  const job = await client.waitForSpeech(saved.id, {
    timeoutMs: 1200000,
    pollMs: 3500,
  });
  const response = await client.downloadSpeech(saved.id, "wav");
  await writeFile(out, Buffer.from(await response.arrayBuffer()));
  await writeFile(
    record,
    JSON.stringify(
      { ...saved, status: job.status, duration: job.duration },
      null,
      2,
    ),
  );
  console.log("HumanVoice: narração concluída.");
}
