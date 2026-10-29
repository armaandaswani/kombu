export const flavors = [
  "uva",
  "goiaba",
  "maracuja",
  "rosas-cardamomo",
  "pera-alecrim",
  "hibisco-anis",
  "lavanda-limao",
  "frutas-vermelhas",
  "imunidade",
  "flor-fada-blueberry",
  "manga-jasmim",
  "maca-canela",
];
export function validate(p) {
  if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(p.id))
    throw Error("Identificador de projeto inválido.");
  if (
    !Array.isArray(p.flavors) ||
    p.flavors.length !== 3 ||
    new Set(p.flavors).size !== 3 ||
    p.flavors.some((f) => !flavors.includes(f))
  )
    throw Error("Escolha três sabores oficiais diferentes.");
  if (
    typeof p.narration !== "string" ||
    p.narration.length < 30 ||
    p.narration.length > 650
  )
    throw Error("Use uma narração entre 30 e 650 caracteres.");
  if (p.voice !== undefined && !["rayssa", "chatterbox"].includes(p.voice))
    throw Error("Voz inválida.");
  let text = [p.title, p.narration, p.caption].filter(Boolean).join(" ");
  text = text.replace(
    /(?:sabor|r[oó]tulo|komb[uú])\s+imunidade\b/gi,
    "sabor oficial",
  );
  if (p.caption) {
    const tags = p.caption.match(/#[\p{L}\p{N}_]+/gu) || [];
    if (tags.length > 5 || !tags.some((t) => t.toLowerCase() === "#manaus"))
      throw Error("A legenda deve incluir #manaus e até cinco hashtags.");
  }
  if (/R\$|\p{Extended_Pictographic}|o melhor|a melhor/u.test(text))
    throw Error("Revise preço, emoji ou superlativo não autorizado.");
  if (
    /chá\s+(verde|preto|branco|oolong|mate)|green tea|fam[ií]lia|familiar|vitalidade|detox|cura\b|previne|emagrec|probi[oó]tic|intestin|sem\s+a[çc][úu]car|fortalece|imunidade(?![\s-]*(?:é|e)\s*(?:o|um)\s*sabor)/i.test(
      text,
    )
  )
    throw Error(
      "Revise a comunicação: receita confidencial, nome de sabor ou alegação não autorizada.",
    );
  if (
    p.duration !== undefined &&
    (!Number.isFinite(p.duration) || p.duration < 12 || p.duration > 40)
  )
    throw Error("Duração permitida: 12 a 40 segundos.");
  return p;
}
