const {
  PUBLIC_MEDIA_BUCKET,
  json,
  readBody,
  requireAdmin,
  supabaseFetch,
} = require("../_lib/kombu-backend");

function parseDataUrl(dataUrl = "") {
  const match = String(dataUrl).match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return {
    contentType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

function safeFileName(name = "imagem.png") {
  const parts = String(name).split(".");
  const extension = (parts.pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
  const base = parts.join(".").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "imagem";
  return `${base}.${extension}`;
}

module.exports = async function handler(req, res) {
  const session = requireAdmin(req, res);
  if (!session) return;

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }

  const body = await readBody(req);
  const parsed = parseDataUrl(body.dataUrl);
  if (!parsed) return json(res, 400, { ok: false, error: "invalid_image_data" });

  const kind = String(body.kind || "cms").replace(/[^a-z0-9-]/gi, "").toLowerCase() || "cms";
  const key = String(body.key || "image").replace(/[^a-z0-9-]/gi, "").toLowerCase() || "image";
  const path = `${kind}/${key}/${Date.now()}-${safeFileName(body.fileName)}`;

  await supabaseFetch(`/storage/v1/object/${PUBLIC_MEDIA_BUCKET}/${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": parsed.contentType,
      "x-upsert": "true",
    },
    body: parsed.buffer,
  });

  const publicUrl = `${process.env.SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/${PUBLIC_MEDIA_BUCKET}/${path}`;
  return json(res, 200, { ok: true, url: publicUrl, path });
};
