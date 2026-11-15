// Receipt reading never invents a value: checked fields are "ok", readable but
// unprovable ones "uncertain", absent ones "missing". The texts below are what
// on-device recognition returns for a clean NFC-e, a misread one and a blurry one.
const assert = require("node:assert/strict");
const { accessKeyCheckDigit, validCnpj, parseAccessKey, findAccessKey, parseMoney, readReceiptText, findDuplicate } = require("../assets/receipt-reader");

// A valid key: AM (13), November 2025, CNPJ 11.222.333/0001-81, NFC-e (65),
// series 1, number 12345.
const first43 = `13${"2511"}11222333000181${"65"}001${"000012345"}1${"12345678"}`;
const key = `${first43}${accessKeyCheckDigit(first43)}`;
const grouped = key.match(/.{1,4}/g).join(" ");

assert.ok(validCnpj("11.222.333/0001-81"));
assert.ok(!validCnpj("11.222.333/0001-82"));
assert.deepEqual(
  (({ uf, year, month, cnpj, cnpjValid, model, series, number }) => ({ uf, year, month, cnpj, cnpjValid, model, series, number }))(parseAccessKey(key)),
  { uf: "AM", year: 2025, month: 11, cnpj: "11.222.333/0001-81", cnpjValid: true, model: "NFC-e", series: 1, number: 12345 },
);
const misread = `${key.slice(0, 30)}${(Number(key[30]) + 1) % 10}${key.slice(31)}`;
assert.equal(parseAccessKey(misread), null, "one wrong digit fails the check digit");
assert.equal(findAccessKey(`CHAVE DE ACESSO\n${grouped}`).parsed.key, key, "grouped digits are read");
assert.equal(parseMoney("Total 1.234,56"), 1234.56);
assert.equal(parseMoney("Total 1234"), null, "amounts without cents are rejected");

const receipt = (accessKey) => `MERCADO BOA COMPRA LTDA
CNPJ: 11.222.333/0001-81 IE 053123456
Av. Djalma Batista 1000 Manaus AM
DOCUMENTO AUXILIAR DA NOTA FISCAL DE CONSUMIDOR ELETRONICA
001 ACUCAR CRISTAL 1KG 2 UN X 4,99 9,98
002 GENGIBRE KG 0,500 KG X 25,90 12,95
Qtd. total de itens 2
Valor total R$ 22,93
Desconto R$ 0,00
Valor a pagar R$ 22,93
FORMA PAGAMENTO PIX 22,93
NFC-e n 000012345 Serie 001 Emissao 14/11/2025 10:32:11
Consulte pela Chave de Acesso em
${accessKey}`;

// Clean read: key, CNPJ, number and date are checked; the total is checked
// because the items add up to it; items await confirmation.
{
  const reading = readReceiptText(receipt(grouped));
  assert.equal(reading.accessKey.status, "ok");
  assert.equal(reading.cnpj.value, "11.222.333/0001-81");
  assert.equal(reading.cnpj.status, "ok");
  assert.equal(reading.number.value, "12345");
  assert.equal(reading.date.value, "2025-11-14");
  assert.equal(reading.date.status, "ok", "the date agrees with the key's month");
  assert.equal(reading.total.value, 22.93);
  assert.equal(reading.total.status, "ok");
  assert.equal(reading.items.length, 2);
  assert.deepEqual(reading.items.map((item) => [item.description.value, item.qty.value, item.unit.value, item.total.value]), [["ACUCAR CRISTAL 1KG", 2, "UN", 9.98], ["GENGIBRE KG", 0.5, "KG", 12.95]]);
  assert.ok(reading.items.every((item) => item.description.status === "uncertain"));
  assert.equal(reading.supplierName.value, "MERCADO BOA COMPRA LTDA");
  assert.equal(reading.supplierName.status, "uncertain");
}

// One key digit misread: the key is not trusted, the date can no longer be
// confirmed against it, and the printed CNPJ is used only because its own
// check digits pass.
{
  const reading = readReceiptText(receipt(misread.match(/.{1,4}/g).join(" ")));
  assert.equal(reading.accessKey.status, "uncertain");
  assert.equal(reading.accessKey.value, "");
  assert.equal(reading.number.status, "missing");
  assert.equal(reading.date.status, "uncertain");
  assert.equal(reading.cnpj.status, "ok");
}

// Blurry read: nothing is filled in that was not read.
{
  const reading = readReceiptText("MERC BOA C0MPRA\nACUC CRIST 2 9,9\nVal tot");
  assert.equal(reading.accessKey.status, "missing");
  assert.equal(reading.total.status, "missing");
  assert.equal(reading.total.value, "");
  assert.equal(reading.date.status, "missing");
  assert.equal(reading.items.length, 0);
  assert.equal(reading.reconciles, false);
}

// An impossible date is not accepted.
{
  const reading = readReceiptText("Emissao 31/02/2025\nValor total R$ 10,00");
  assert.equal(reading.date.status, "missing");
  assert.equal(reading.total.status, "uncertain", "a total with no items to check it against stays uncertain");
}

// Duplicates: exact by access key, likely by supplier, date and total.
{
  const reading = readReceiptText(receipt(grouped));
  assert.equal(findDuplicate(reading, [{ id: "p1", documentKey: key }]).certainty, "exact");
  assert.equal(findDuplicate(reading, [{ id: "p2", date: "2025-11-14", documentTotal: 22.93, supplierCnpj: "11222333000181" }]).certainty, "likely");
  assert.equal(findDuplicate(reading, [{ id: "p3", date: "2025-11-14", documentTotal: 30, supplierCnpj: "11222333000181" }]), null);
}

console.log("Receipt reading: access key and CNPJ check digits, grouped keys, cents-only money, clean/misread/blurry receipts, impossible dates and duplicate detection passed.");
