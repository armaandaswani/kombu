import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export async function prepare(p, out) {
  await mkdir(resolve(out, "assets"), { recursive: true });
  for (const f of p.flavors)
    await copyFile(
      resolve(root, "../assets/bottles", f + ".webp"),
      resolve(out, "assets", f + ".webp"),
    );
  await copyFile(
    resolve(root, "../assets/partners/kombu-k-logo.png"),
    resolve(out, "assets/logo.png"),
  );
  for (const [name, file] of Object.entries({
    sans: "LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko20yygg_vb.woff2",
    serif: "nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgEM86xQ.woff2",
  }))
    await copyFile(
      resolve(root, "../fonts", file),
      resolve(out, "assets", name + ".woff2"),
    );
  if(p.sceneMode==='created-pour')await copyFile(resolve(root,'assets/generated/veranda-v3.png'),resolve(out,'assets/veranda.png'));
  await writeFile(resolve(out, "project.json"), JSON.stringify(p, null, 2));
  await build({
    entryPoints: [resolve(root,p.sceneMode==='created-pour'?"src/pour-scene.js":"src/scene.js")],
    bundle: true,
    outfile: resolve(out, "scene.js"),
    format: "iife",
    minify: true,
  });
  let html = await readFile(resolve(root, "src/film.html"), "utf8");
  const d = p.duration || 20;
  html = html
    .replaceAll("__DURATION__", String(d))
    .replaceAll("__INTRO__", String(d * 0.3))
    .replaceAll("__MID__", String(d * 0.35))
    .replaceAll("__CLOSE__", String(d * 0.78));
  html = html.replace(
    '<script src="scene.js"></script>',
    '<script>window.__timelines=window.__timelines||{};</script><script src="scene.js"></script>',
  );
  if(p.sceneMode==='created-pour')html=html.replace('</style>', 'body{background-image:url(assets/veranda.png);background-size:cover;background-position:center} #origin{display:none} #closing{top:265px;font-size:54px;line-height:1.12}</style>');
  await writeFile(resolve(out, "index.html"), html);
  await writeFile(
    resolve(out, "events.json"),
    JSON.stringify(p.sceneMode==='created-pour'?[2.3,4.6,10.5].map(t=>({type:"cut",t})):[
      { type: "cut", t: d * 0.35 },
      { type: "cut", t: d * 0.78 },
    ]),
  );
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let p = JSON.parse(await readFile(process.argv[2], "utf8"));
  await prepare(p, resolve(process.argv[3]));
}
