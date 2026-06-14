import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Local-filesystem image uploads (saved under public/uploads, served by Next).
 * Swap the body of `saveUpload` for Cloudflare R2 / S3 in production — the
 * signature (File -> public URL) stays the same.
 */
const MAX_BYTES = 5 * 1024 * 1024;
const EXT_BY_TYPE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

export async function saveUpload(
  file: unknown,
  scope: string,
): Promise<UploadResult> {
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "No file provided" };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "File too large (max 5MB)" };
  }
  const ext = EXT_BY_TYPE[file.type];
  if (!ext) {
    return { ok: false, error: "Unsupported image type" };
  }

  const safeScope = scope.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || "misc";
  const dir = path.join(process.cwd(), "public", "uploads", safeScope);
  await mkdir(dir, { recursive: true });

  const fileName = `${randomUUID()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, fileName), bytes);

  return { ok: true, url: `/uploads/${safeScope}/${fileName}` };
}
