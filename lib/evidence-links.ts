const blockedHosts = /^(localhost|.*\.localhost)$/i;
export function validateEvidenceUrl(value: string) {
  if (value.length > 2048) throw new Error("Evidence URL is too long.");
  let url: URL; try { url = new URL(value); } catch { throw new Error("Enter a valid evidence URL."); }
  if (url.protocol !== "https:" || url.username || url.password) throw new Error("Evidence links must use HTTPS.");
  const host = url.hostname.toLowerCase();
  if (blockedHosts.test(host) || host === "0.0.0.0" || host === "::1" || host === "[::1]" || /^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)) throw new Error("Private or local network URLs are not allowed.");
  return url.toString();
}
