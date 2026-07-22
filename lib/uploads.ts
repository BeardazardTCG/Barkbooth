import "server-only";
import { randomUUID } from "crypto";

export const MAX_PROFILE_PHOTO_BYTES = 5 * 1024 * 1024;
export const MAX_RECORD_DOCUMENT_BYTES = 10 * 1024 * 1024;
export const imageContentTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
export const documentContentTypes = new Set([...imageContentTypes, "application/pdf"]);

const signatures: Record<string, (bytes: Uint8Array) => boolean> = {
  "image/jpeg": (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  "image/png": (b) => [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((v, i) => b[i] === v),
  "image/webp": (b) => String.fromCharCode(...b.slice(0, 4)) === "RIFF" && String.fromCharCode(...b.slice(8, 12)) === "WEBP",
  "application/pdf": (b) => String.fromCharCode(...b.slice(0, 5)) === "%PDF-",
};

export async function validateUpload(value: FormDataEntryValue | null, allowed: Set<string>, maxBytes: number) {
  if (!(value instanceof File) || !value.name || value.size === 0) throw new Error("Choose a file to upload.");
  if (!allowed.has(value.type)) throw new Error("Unsupported file type.");
  if (value.size > maxBytes) throw new Error(`File exceeds the ${Math.floor(maxBytes / 1024 / 1024)} MB limit.`);
  const bytes = new Uint8Array(await value.arrayBuffer());
  if (!signatures[value.type]?.(bytes)) throw new Error("The file contents do not match its declared type.");
  return { file: value, bytes };
}

export function storageKey(folder: string, contentType: string) {
  const extension = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "application/pdf": "pdf" }[contentType];
  return `${folder}/${randomUUID()}.${extension}`;
}
