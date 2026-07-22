import "server-only";
import { createHash, createHmac } from "crypto";

type StorageConfig = { endpoint: URL; region: string; bucket: string; accessKeyId: string; secretAccessKey: string };

function config(): StorageConfig {
  const endpoint = process.env.S3_ENDPOINT;
  const bucket = process.env.S3_BUCKET;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) throw new Error("Object storage is not configured.");
  return { endpoint: new URL(endpoint), region: process.env.S3_REGION || "auto", bucket, accessKeyId, secretAccessKey };
}

function hash(value: string | Uint8Array) { return createHash("sha256").update(value).digest("hex"); }
function hmac(key: string | Buffer, value: string) { return createHmac("sha256", key).update(value).digest(); }
function encodedPath(value: string) { return value.split("/").map(encodeURIComponent).join("/"); }

async function storageRequest(method: "GET" | "PUT" | "DELETE", key: string, body?: Uint8Array, contentType?: string) {
  const cfg = config();
  const path = `${cfg.endpoint.pathname.replace(/\/$/, "")}/${encodeURIComponent(cfg.bucket)}/${encodedPath(key)}`.replace(/^([^/])/, "/$1");
  const url = new URL(path, cfg.endpoint);
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const date = amzDate.slice(0, 8);
  const payloadHash = hash(body ?? "");
  const headers: Record<string, string> = { host: url.host, "x-amz-content-sha256": payloadHash, "x-amz-date": amzDate };
  if (contentType) headers["content-type"] = contentType;
  const signedHeaders = Object.keys(headers).sort().join(";");
  const canonicalHeaders = Object.keys(headers).sort().map((name) => `${name}:${headers[name].trim()}\n`).join("");
  const canonicalRequest = [method, url.pathname, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");
  const scope = `${date}/${cfg.region}/s3/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, scope, hash(canonicalRequest)].join("\n");
  const signingKey = hmac(hmac(hmac(hmac(`AWS4${cfg.secretAccessKey}`, date), cfg.region), "s3"), "aws4_request");
  headers.authorization = `AWS4-HMAC-SHA256 Credential=${cfg.accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${createHmac("sha256", signingKey).update(stringToSign).digest("hex")}`;
  const response = await fetch(url, { method, headers, body: body as BodyInit | undefined, cache: "no-store" });
  if (!response.ok && !(method === "DELETE" && response.status === 404)) throw new Error(`Object storage ${method} failed (${response.status}).`);
  return response;
}

export async function putObject(key: string, bytes: Uint8Array, contentType: string) { await storageRequest("PUT", key, bytes, contentType); }
export async function deleteObject(key: string) { await storageRequest("DELETE", key); }
export async function getObject(key: string) { return storageRequest("GET", key); }
