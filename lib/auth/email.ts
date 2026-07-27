export type PasswordResetEmailConfiguration = { appUrl: string; apiKey: string; from: string };

export function passwordResetEmailConfiguration(): PasswordResetEmailConfiguration | null {
  const appUrl = process.env.APP_URL?.replace(/\/$/, "");
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_EMAIL_FROM;
  if (!appUrl || !apiKey?.startsWith("re_") || !from) return null;
  try {
    const url = new URL(appUrl);
    if (url.protocol !== "https:" || url.pathname !== "/" || url.search || url.hash || !/^\S+@\S+\.\S+$/.test(from)) return null;
  } catch {
    return null;
  }
  return { appUrl, apiKey, from };
}

export async function sendPasswordResetEmail(configuration: PasswordResetEmailConfiguration, email: string, resetUrl: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${configuration.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: configuration.from, to: [email], subject: "Reset your Bark Booth password", html: `<p>A password reset was requested for your Bark Booth account.</p><p><a href="${resetUrl}">Reset your password</a></p><p>This link expires in 30 minutes and can only be used once. If you did not request it, ignore this email.</p>` }),
  });
  if (!response.ok) throw new Error(`Password reset email provider failed with status ${response.status}.`);
}
