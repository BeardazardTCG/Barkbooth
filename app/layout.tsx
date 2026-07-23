import type { Metadata } from "next";
import "./globals.css";
import { SiteChrome } from "@/components/nav";
import { getCurrentUser } from "@/lib/auth/session";
import { FormFeedbackProvider } from "@/components/forms/form-feedback-provider";

export const metadata: Metadata = { title: "Bark Booth", description: "Create a lifelong Bark Booth Identity for your dog with a unique registry number and structured canine record." };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  const viewer = user ? { displayName: user.displayName, username: user.username } : null;
  return <html lang="en"><body className="font-sans text-charcoal"><FormFeedbackProvider><SiteChrome viewer={viewer}>{children}</SiteChrome></FormFeedbackProvider></body></html>;
}
