import type { Metadata } from "next";
import "./globals.css";
import { MobileTabs, Nav, SiteFooter } from "@/components/nav";

export const metadata: Metadata = { title: "Bark Booth", description: "Celebrate every milestone with a UK dog community for competitions, badges, prizes, profiles, and positive owner-dog achievements." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="font-sans text-charcoal"><Nav /><main className="mx-auto max-w-6xl pb-10">{children}</main><SiteFooter /><MobileTabs /></body></html>;
}
