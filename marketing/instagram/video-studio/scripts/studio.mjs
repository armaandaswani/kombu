import { isRenderBusy } from "./lock.mjs";
import { readFileSync } from "node:fs";
import http from "node:http";
import { readFile, writeFile, mkdir, stat, open } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { resolve, join, extname, sep } from "node:path";
import { spawn } from "node:child_process";
import { root } from "./prepare.mjs";
import { validate, flavors } from "./validate.mjs";
const port = 4317;
let current = "primeiro-reel",
  busy = false;
try {
  const saved = JSON.parse(
    readFileSync(join(root, "output/studio.json"), "utf8"),
  );
  if (/^[a-z0-9-]+$/.test(saved.current)) current = saved.current;
} catch {}
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".json": "application/json",
  ".mp4": "video/mp4",
  ".wav": "audio/wav",
  ".webp": "image/webp",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".zip": "application/zip",
  ".srt": "text/plain; charset=utf-8",
  ".vtt": "text/vtt; charset=utf-8",
};
function json(res, value, code = 200) {
  res.writeHead(code, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(value));
}
async function body(req) {
  let chunks = [],
    bytes = 0;
  for await (const c of req) {
    bytes += c.length;
    if (bytes > 16000) throw Error("Roteiro muito longo.");
    chunks.push(c);
  }
  return JSON.parse(Buffer.concat(chunks).toString());
}
const server = http.createServer(async (req, res) => {
  try {
    if (
      !["127.0.0.1:" + port, "localhost:" + port].includes(req.headers.host)
    ) {
      res.writeHead(403);
      return res.end();
    }
    const url = new URL(req.url, "http://127.0.0.1:" + port);
    if (
      req.headers.origin &&
      !["http://127.0.0.1:" + port, "http://localhost:" + port].includes(
        req.headers.origin,
      )
    ) {
      res.writeHead(403);
      return res.end();
    }
    if (url.pathname === "/api/state" && req.method === "GET") {
      const status = JSON.parse(
        await readFile(
          join(root, "output", current, "status.json"),
          "utf8",
        ).catch(() => "{}"),
      );
      return json(res, {
        id: current,
        busy: busy || isRenderBusy(join(root, "output/production.lock")),
        flavors,
        status,
        project: JSON.parse(
          await readFile(
            join(root, "projects", current + ".json"),
            "utf8",
          ).catch(() =>
            readFile(join(root, "projects/primeiro-reel.json"), "utf8"),
          ),
        ),
      });
    }
    if (url.pathname === "/api/render" && req.method === "POST") {
      if (busy || isRenderBusy(join(root, "output/production.lock")))
        return json(res, { error: "Já há um vídeo sendo gerado." }, 409);
      if (!req.headers["content-type"]?.includes("application/json"))
        return json(res, { error: "Formato inválido." }, 415);
      const input = await body(req);
      const id = "reel-" + Date.now();
      const p = validate({ ...input, id, approved: false });
      await mkdir(join(root, "projects"), { recursive: true });
      await writeFile(
        join(root, "projects", id + ".json"),
        JSON.stringify(p, null, 2),
      );
      current = id;
      busy = true;
      await writeFile(
        join(root, "output/studio.json"),
        JSON.stringify({ current: id }),
      );
      const log = await open(join(root, "output-render.log"), "a");
      const child = spawn(
        process.execPath,
        ["scripts/render.mjs", join(root, "projects", id + ".json")],
        { cwd: root, stdio: ["ignore", log.fd, log.fd] },
      );
      child.on("exit", () => {
        busy = false;
        log.close();
      });
      child.on("error", () => {
        busy = false;
        log.close();
      });
      return json(res, { id }, 202);
    }
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405);
      return res.end();
    }
    let base, file;
    if (url.pathname === "/") {
      base = root;
      file = join(root, "src/studio.html");
    } else if (url.pathname.startsWith("/output/")) {
      base = join(root, "output");
      file = resolve(base, decodeURIComponent(url.pathname.slice(8)));
    } else if (url.pathname.startsWith("/assets/")) {
      base = resolve(root, "../assets");
      file = resolve(base, decodeURIComponent(url.pathname.slice(8)));
    } else {
      res.writeHead(404);
      return res.end();
    }
    if (file !== base && !file.startsWith(base + sep)) {
      res.writeHead(403);
      return res.end();
    }
    const st = await stat(file);
    if (!st.isFile()) {
      res.writeHead(404);
      return res.end();
    }
    let start = 0,
      end = st.size - 1;
    const range = req.headers.range;
    let code = 200;
    if (range) {
      const match = /^bytes=(\d+)-(\d*)$/.exec(range);
      if (!match) {
        res.writeHead(416);
        return res.end();
      }
      start = +match[1];
      end = match[2] ? Math.min(+match[2], end) : end;
      if (start > end) {
        res.writeHead(416);
        return res.end();
      }
      code = 206;
      res.setHeader("Content-Range", `bytes ${start}-${end}/${st.size}`);
    }
    res.writeHead(code, {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      "Content-Length": end - start + 1,
      "Accept-Ranges": "bytes",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-cache",
    });
    if (req.method === "HEAD") return res.end();
    createReadStream(file, { start, end }).pipe(res);
  } catch (e) {
    if (!res.headersSent)
      json(
        res,
        {
          error:
            e.code === "ENOENT" ? "Arquivo ainda não disponível." : e.message,
        },
        e.code === "ENOENT" ? 404 : 400,
      );
    else res.end();
  }
});
server.listen(port, "127.0.0.1", () =>
  console.log(`Kombú Vídeo Studio: http://127.0.0.1:${port}`),
);
