const blockedHosts = /^(localhost|.*\.localhost)$/i;
export function validateEvidenceUrl(value: string) {
  if (value.length > 2048) throw new Error("Evidence URL is too long.");
  let url: URL; try { url = new URL(value); } catch { throw new Error("Enter a valid evidence URL."); }
  if (url.protocol !== "https:" || url.username || url.password) throw new Error("Evidence links must use HTTPS.");
  const host = url.hostname.toLowerCase();
  const privateIpv4 = /^(0\.|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host);
  const bracketless = host.replace(/^\[|\]$/g, "");
  const privateIpv6 = bracketless === "::1" || /^(f[cd]|fe[89ab])/i.test(bracketless) || /^::ffff:(0\.|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(bracketless);
  if (blockedHosts.test(host) || privateIpv4 || privateIpv6) throw new Error("Private or local network URLs are not allowed.");
  return url.toString();
}
