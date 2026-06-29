import type { Metadata } from "next";
import "./globals.css";
import { MobileTabs, Nav, SiteFooter } from "@/components/nav";

export const metadata: Metadata = { title: "Bark Booth", description: "Create a lifelong Bark Booth profile for your dog, with a registry-style identity, milestones, care notes, memories, and optional competition achievements." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="font-sans text-charcoal"><Nav /><main className="mx-auto max-w-6xl pb-10">{children}</main><SiteFooter /><MobileTabs /></body></html>;
}
