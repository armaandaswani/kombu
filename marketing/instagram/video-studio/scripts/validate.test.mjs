import { test } from "node:test";
import assert from "node:assert/strict";
import { validate } from "./validate.mjs";
import { parseSrt } from "../src/vendor/opencut-srt.mjs";
const p = {
  id: "teste",
  flavors: ["uva", "goiaba", "maracuja"],
  narration:
    "A Kombú combina suavidade com sabor intenso, feita em Manaus desde 2017.",
};
test("protege identificador e sabores usados como caminhos", () => {
  assert.throws(() => validate({ ...p, id: "../../arquivo" }));
  assert.throws(() =>
    validate({ ...p, flavors: ["uva", "uva", "../segredo"] }),
  );
});
test("bloqueia receita e posicionamentos rejeitados", () => {
  for (const x of [
    "chá verde",
    "nossa família",
    "cura o intestino",
    "sem açúcar",
    "Vitalidade",
  ])
    assert.throws(() => validate({ ...p, narration: p.narration + x }));
  assert.equal(validate(p), p);
});
test("parser real do OpenCut preserva tempos e rejeita cue inválido", () => {
  const r = parseSrt({
    input:
      "1\n00:00:00,350 --> 00:00:02,000\nA Kombú combina suavidade.\n\n2\n00:00:03,000 --> 00:00:02,000\nInválida",
  });
  assert.equal(r.captions[0].startTime, 0.35);
  assert.equal(r.captions[0].duration, 1.65);
  assert.equal(r.skippedCueCount, 1);
});

import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { acquireLock, isRenderBusy } from "./lock.mjs";
test("uma geração pesada por vez, incluindo CLI e interface", () => {
  const dir = mkdtempSync(join(tmpdir(), "kombu-lock-"));
  const f = join(dir, "job.lock");
  try {
    const release = acquireLock(f);
    assert.equal(isRenderBusy(f), true);
    assert.throws(() => acquireLock(f));
    release();
    assert.equal(isRenderBusy(f), false);
    acquireLock(f)();
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("Imunidade é permitido como sabor, não como benefício", () => {
  assert.doesNotThrow(() =>
    validate({
      ...p,
      narration:
        "Conheça o sabor Imunidade da Kombú, produzido artesanalmente em Manaus.",
    }),
  );
  assert.throws(() =>
    validate({
      ...p,
      narration:
        "A Kombú vai melhorar a sua imunidade, conheça nossos sabores.",
    }),
  );
});
test("limita hashtags e mantém Manaus na legenda", () => {
  assert.throws(() => validate({ ...p, caption: "#kombu" }));
  assert.throws(() =>
    validate({ ...p, caption: "#manaus #um #dois #tres #quatro #cinco" }),
  );
  assert.doesNotThrow(() => validate({ ...p, caption: "#kombu #manaus" }));
});
