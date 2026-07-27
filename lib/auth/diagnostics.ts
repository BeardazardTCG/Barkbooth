import { randomUUID } from "crypto";
import { headers } from "next/headers";

type AuthOperation = "login" | "signup" | "password_reset_request" | "password_reset" | "logout" | "session_validation";

function clientCategory(userAgent: string) {
  const browser = /Edg\//.test(userAgent) ? "edge" : /Firefox\//.test(userAgent) ? "firefox" : /CriOS\//.test(userAgent) ? "chrome_ios" : /Chrome\//.test(userAgent) ? "chrome" : /Safari\//.test(userAgent) ? "safari" : "other";
  const platform = /Android/.test(userAgent) ? "android" : /iPhone|iPad|iPod/.test(userAgent) ? "ios" : /Windows/.test(userAgent) ? "windows" : /Macintosh|Mac OS X/.test(userAgent) ? "macos" : /Linux/.test(userAgent) ? "linux" : "other";
  return { browser, platform };
}

export function logAuthDiagnostic(operation: AuthOperation, reason: string, error?: unknown) {
  const requestHeaders = headers();
  const userAgent = requestHeaders.get("user-agent") ?? "";
  const suppliedRequestId = requestHeaders.get("x-request-id");
  const requestId = suppliedRequestId && /^[a-zA-Z0-9_-]{8,128}$/.test(suppliedRequestId) ? suppliedRequestId : randomUUID();
  const errorCode = typeof error === "object" && error !== null && "code" in error && typeof error.code === "string" ? error.code : undefined;
  console.error("Authentication operation failed", {
    operation,
    reason,
    requestId,
    timestamp: new Date().toISOString(),
    buildId: process.env.RENDER_GIT_COMMIT ?? process.env.NEXT_PUBLIC_RENDER_GIT_COMMIT ?? "unknown",
    ...clientCategory(userAgent),
    ...(errorCode ? { errorCode } : {}),
  });
}
