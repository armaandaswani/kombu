import {
  mkdirSync,
  openSync,
  writeFileSync,
  readFileSync,
  closeSync,
  unlinkSync,
} from "node:fs";
import { dirname } from "node:path";
export function isRenderBusy(file) {
  try {
    const pid = JSON.parse(readFileSync(file, "utf8")).pid;
    if (!Number.isInteger(pid) || pid < 1) return true;
    try {
      process.kill(pid, 0);
      return true;
    } catch (e) {
      return e.code !== "ESRCH";
    }
  } catch (e) {
    return e.code === "ENOENT" ? false : true;
  }
}
export function acquireLock(file) {
  mkdirSync(dirname(file), { recursive: true });
  let fd;
  try {
    fd = openSync(file, "wx");
  } catch (e) {
    if (e.code !== "EEXIST") throw e;
    if (isRenderBusy(file))
      throw Error("Há outra produção em andamento. Aguarde a conclusão.");
    unlinkSync(file);
    fd = openSync(file, "wx");
  }
  writeFileSync(fd, JSON.stringify({ pid: process.pid }));
  closeSync(fd);
  let released = false;
  return () => {
    if (!released) {
      released = true;
      try {
        if (JSON.parse(readFileSync(file, "utf8")).pid === process.pid)
          unlinkSync(file);
      } catch {}
    }
  };
}
