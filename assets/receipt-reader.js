// Reads Brazilian purchase documents (NFC-e, cupom fiscal, DANFE) from text
// recognized on the operator's device. Nothing here guesses: every field comes
// back as { value, status } where status is "ok" (checked), "uncertain" (read
// but not provable, the operator must look) or "missing".
//
// The 44-digit access key printed on NF-e and NFC-e documents is the reliable
// anchor. It encodes state, year/month, the issuer's CNPJ, model, series and
// number, and ends with a mod-11 check digit, so a misread digit is detected
// instead of being saved. It also identifies the document exactly, which is how
// duplicates are caught.
(function initKombuReceipt(global) {
  const UF_BY_CODE = {
    11: "RO", 12: "AC", 13: "AM", 14: "RR", 15: "PA", 16: "AP", 17: "TO", 21: "MA", 22: "PI", 23: "CE", 24: "RN", 25: "PB",
    26: "PE", 27: "AL", 28: "SE", 29: "BA", 31: "MG", 32: "ES", 33: "RJ", 35: "SP", 41: "PR", 42: "SC", 43: "RS", 50: "MS",
    51: "MT", 52: "GO", 53: "DF",
  };
  const MODELS = { 55: "NF-e", 65: "NFC-e", 59: "CF-e SAT" };

  const field = (value, status) => ({ value: status === "missing" ? "" : value, status });

  function accessKeyCheckDigit(first43) {
    let weight = 2;
    let sum = 0;
    for (let index = first43.length - 1; index >= 0; index -= 1) {
      sum += Number(first43[index]) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }

  function validCnpj(value) {
    const digits = String(value || "").replace(/\D/g, "");
    if (digits.length !== 14 || /^(\d)\1+$/.test(digits)) return false;
    const check = (length) => {
      const weights = length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      const sum = weights.reduce((total, weight, index) => total + Number(digits[index]) * weight, 0);
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };
    return check(12) === Number(digits[12]) && check(13) === Number(digits[13]);
  }

  function formatCnpj(digits) {
    return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  }

  // Returns null when the key is not 44 digits or its check digit fails.
  function parseAccessKey(raw) {
    const key = String(raw || "").replace(/\D/g, "");
    if (key.length !== 44 || accessKeyCheckDigit(key.slice(0, 43)) !== Number(key[43])) return null;
    const cnpj = key.slice(6, 20);
    return {
      key,
      uf: UF_BY_CODE[Number(key.slice(0, 2))] || "",
      year: 2000 + Number(key.slice(2, 4)),
      month: Number(key.slice(4, 6)),
      cnpj: formatCnpj(cnpj),
      cnpjValid: validCnpj(cnpj),
      model: MODELS[Number(key.slice(20, 22))] || key.slice(20, 22),
      series: Number(key.slice(22, 25)),
      number: Number(key.slice(25, 34)),
    };
  }

  // The key is printed in groups ("1325 1112 ..."); recognition can add stray
  // spaces or dots. Every run of 44 digits is tried; only a valid one is kept.
  function findAccessKey(text) {
    const runs = String(text || "").match(/(?:\d[\s.]{0,2}){44,}/g) || [];
    let sawCandidate = false;
    for (const run of runs) {
      const digits = run.replace(/\D/g, "");
      for (let start = 0; start + 44 <= digits.length; start += 1) {
        sawCandidate = true;
        const parsed = parseAccessKey(digits.slice(start, start + 44));
        if (parsed) return { parsed, status: "ok" };
      }
    }
    return { parsed: null, status: sawCandidate ? "uncertain" : "missing" };
  }

  // "1.234,56" and "1234,56" -> 1234.56. Values without cents are rejected:
  // a receipt always prints them, so their absence means a misread.
  function parseMoney(text) {
    const match = String(text || "").match(/(\d{1,3}(?:\.\d{3})+|\d+),(\d{2})(?!\d)/);
    return match ? Number(`${match[1].replace(/\./g, "")}.${match[2]}`) : null;
  }

  function moneyNear(lines, pattern) {
    for (const line of lines) {
      if (!pattern.test(line)) continue;
      const values = (line.match(/(\d{1,3}(?:\.\d{3})+|\d+),\d{2}(?!\d)/g) || []).map(parseMoney);
      if (values.length) return values[values.length - 1];
    }
    return null;
  }

  function findDate(lines) {
    const dated = lines.find((line) => /emiss[aã]o|data/i.test(line) && /\d{2}\/\d{2}\/\d{4}/.test(line)) || lines.find((line) => /\d{2}\/\d{2}\/\d{4}/.test(line));
    const match = dated?.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (!match) return null;
    const [, day, month, year] = match;
    const date = new Date(`${year}-${month}-${day}T12:00:00`);
    if (Number.isNaN(date.getTime()) || date.getDate() !== Number(day)) return null;
    return `${year}-${month}-${day}`;
  }

  // NFC-e item lines end with quantity, unit, unit price and line total, e.g.
  // "001 ACUCAR CRISTAL 1KG 2 UN X 4,99 9,98". Each item is uncertain until the
  // operator confirms it, and the sum is compared with the printed total.
  function findItems(lines) {
    const items = [];
    const pattern = /^\s*(?:\d{1,4}\s+)?(?:\d{6,14}\s+)?(.+?)\s+(\d+(?:[.,]\d{1,3})?)\s*(UN|UND|KG|G|L|ML|PC|PCT|CX|FD|DZ)\b\.?\s*(?:X|x|\*)?\s*((?:\d{1,3}(?:\.\d{3})+|\d+),\d{2})\s+((?:\d{1,3}(?:\.\d{3})+|\d+),\d{2})\s*$/i;
    lines.forEach((line) => {
      const match = line.match(pattern);
      if (!match) return;
      const qty = Number(match[2].replace(",", "."));
      const unitPrice = parseMoney(match[4]);
      const total = parseMoney(match[5]);
      const consistent = Math.abs(qty * unitPrice - total) < 0.011;
      items.push({
        description: field(match[1].trim(), "uncertain"),
        qty: field(qty, "uncertain"),
        unit: field(match[3].toUpperCase(), "uncertain"),
        unitPrice: field(unitPrice, "uncertain"),
        total: field(total, "uncertain"),
        arithmeticOk: consistent,
      });
    });
    return items;
  }

  function findSupplierName(lines, cnpjLineIndex) {
    const top = lines.slice(0, cnpjLineIndex >= 0 ? cnpjLineIndex : 3).map((line) => line.trim()).filter((line) => /[A-Za-zÀ-ú]{3}/.test(line));
    return top.length ? top[0] : "";
  }

  function readReceiptText(text) {
    const lines = String(text || "").split(/\r?\n/).map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean);
    const key = findAccessKey(text);
    const cnpjLineIndex = lines.findIndex((line) => /CNPJ/i.test(line));
    const printedCnpj = (String(text || "").match(/\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}/) || [""])[0].replace(/\D/g, "");
    const cnpjFromKey = key.parsed?.cnpj;
    const cnpj = cnpjFromKey
      ? field(cnpjFromKey, key.parsed.cnpjValid ? "ok" : "uncertain")
      : printedCnpj
        ? field(formatCnpj(printedCnpj), validCnpj(printedCnpj) ? "ok" : "uncertain")
        : field("", "missing");
    const date = findDate(lines);
    const keyMonth = key.parsed ? `${key.parsed.year}-${String(key.parsed.month).padStart(2, "0")}` : "";
    // A date that agrees with the key's year and month is checked.
    const dateStatus = date ? (keyMonth && date.startsWith(keyMonth) ? "ok" : "uncertain") : "missing";
    const total = moneyNear(lines, /valor\s+(total|a\s+pagar)|total\s+(r\$|a\s+pagar|geral)|^total\b/i);
    const discount = moneyNear(lines, /desconto/i);
    const items = findItems(lines);
    const itemsTotal = Math.round(items.reduce((sum, item) => sum + (item.total.value || 0), 0) * 100) / 100;
    const reconciles = total != null && items.length > 0 && Math.abs(itemsTotal - (discount || 0) - total) < 0.011;
    const supplier = findSupplierName(lines, cnpjLineIndex);
    return {
      accessKey: field(key.parsed?.key || "", key.status),
      model: field(key.parsed?.model || "", key.parsed ? "ok" : "missing"),
      number: field(key.parsed ? String(key.parsed.number) : "", key.parsed ? "ok" : "missing"),
      uf: field(key.parsed?.uf || "", key.parsed ? "ok" : "missing"),
      cnpj,
      supplierName: field(supplier, supplier ? "uncertain" : "missing"),
      date: field(date || "", dateStatus),
      total: field(total ?? "", total == null ? "missing" : reconciles ? "ok" : "uncertain"),
      discount: field(discount ?? "", discount == null ? "missing" : "uncertain"),
      items,
      itemsTotal,
      reconciles,
    };
  }

  // Same document already saved: the access key is exact; without one, the
  // same supplier, date and total is reported as a likely duplicate.
  function findDuplicate(reading, purchases) {
    const key = reading.accessKey.value;
    if (key) {
      const exact = purchases.find((purchase) => purchase.documentKey === key);
      if (exact) return { purchase: exact, certainty: "exact" };
    }
    const cnpj = String(reading.cnpj.value || "").replace(/\D/g, "");
    const total = Number(reading.total.value || 0);
    if (!reading.date.value || !total) return null;
    const likely = purchases.find(
      (purchase) =>
        purchase.date === reading.date.value &&
        Math.abs(Number(purchase.documentTotal ?? purchase.total ?? 0) - total) < 0.011 &&
        (!cnpj || String(purchase.supplierCnpj || "").replace(/\D/g, "") === cnpj),
    );
    return likely ? { purchase: likely, certainty: "likely" } : null;
  }

  const api = { accessKeyCheckDigit, validCnpj, parseAccessKey, findAccessKey, parseMoney, readReceiptText, findDuplicate };
  global.KombuReceipt = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
