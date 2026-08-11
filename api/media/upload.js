const {
  PUBLIC_MEDIA_BUCKET,
  json,
  readBody,
  requireAdmin,
  supabaseFetch,
} = require("../_lib/kombu-backend");

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const IMAGE_TYPES = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

function parseDataUrl(dataUrl = "") {
  const match = String(dataUrl).match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return {
    contentType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

// The declared data-URL type was taken on trust, so the stored object's
// Content-Type came from the caller rather than from the bytes. The bucket is
// public, so verify the file really is the image type it claims to be.
function sniffImageType(buffer) {
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "image/png";
  }
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  if (buffer.length >= 6 && buffer.subarray(0, 6).toString("ascii").match(/^GIF8[79]a$/)) return "image/gif";
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  return "";
}

function safeFileName(name = "imagem.png", extension = "png") {
  const parts = String(name).split(".");
  parts.pop();
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

  let body;
  try {
    body = await readBody(req, { maxBytes: 6 * 1024 * 1024 });
  } catch (error) {
    return json(res, error.status || 400, { ok: false, error: error.code || "invalid_request" });
  }
  const parsed = parseDataUrl(body.dataUrl);
  if (!parsed) return json(res, 400, { ok: false, error: "invalid_image_data" });
  if (!parsed.buffer.length || parsed.buffer.length > MAX_IMAGE_BYTES) {
    return json(res, 413, { ok: false, error: "image_too_large", maxBytes: MAX_IMAGE_BYTES });
  }
  // Trust the bytes, not the label.
  const detectedType = sniffImageType(parsed.buffer);
  const extension = IMAGE_TYPES.get(detectedType);
  if (!extension) return json(res, 415, { ok: false, error: "unsupported_image_type" });
  if (detectedType !== parsed.contentType.toLowerCase()) {
    return json(res, 415, { ok: false, error: "image_type_mismatch", declared: parsed.contentType, detected: detectedType });
  }

  const kind = String(body.kind || "cms").replace(/[^a-z0-9-]/gi, "").toLowerCase() || "cms";
  const key = String(body.key || "image").replace(/[^a-z0-9-]/gi, "").toLowerCase() || "image";
  const path = `${kind}/${key}/${Date.now()}-${safeFileName(body.fileName, extension)}`;

  const baseUrl = String(process.env.SUPABASE_URL || "").replace(/\/$/, "");
  if (!baseUrl) return json(res, 503, { ok: false, error: "missing_supabase_env" });

  try {
    await supabaseFetch(`/storage/v1/object/${PUBLIC_MEDIA_BUCKET}/${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": detectedType,
        "x-upsert": "true",
      },
      body: parsed.buffer,
    });
  } catch (error) {
    return json(res, error.status === 413 ? 413 : 502, {
      ok: false,
      error: "upload_failed",
      detail: typeof error.detail === "string" ? error.detail : error.detail?.message || error.code || "",
    });
  }

  const publicUrl = `${baseUrl}/storage/v1/object/public/${PUBLIC_MEDIA_BUCKET}/${path}`;
  return json(res, 200, { ok: true, url: publicUrl, path });
};
