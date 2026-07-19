"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth/actions";
import type { ReactNode } from "react";
import { isNavigationRouteActive, isOwnerWorkspaceRoute } from "@/lib/app-routes";

type Viewer = { displayName: string; username: string } | null;
const publicLinks = [["Registry", "/profiles"], ["Activities", "/competitions"], ["Directory", "/directory"], ["How it works", "/about"]];
const appLinks = [["Dashboard", "/dashboard", "home"], ["My Dogs", "/dogs", "dogs"], ["Register Dog", "/register-dog", "plus"], ["Registry", "/profiles", "search"], ["Activities", "/competitions", "award"], ["Directory", "/directory", "directory"]];
const mobileLinks = [["Home", "/dashboard", "home"], ["My Dogs", "/dogs", "dogs"], ["Register", "/register-dog", "plus"], ["Registry", "/profiles", "search"], ["Account", "/account", "person"]];
const footerLinks = [["Terms", "/legal/terms-and-conditions"], ["Privacy", "/legal/privacy-policy"], ["Cookies", "/legal/cookie-policy"], ["Image consent", "/legal/image-usage-consent"], ["Refunds", "/legal/refund-policy"], ["Prize fulfilment", "/legal/prize-fulfilment-policy"]];

function Icon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>,
    dogs: <><circle cx="8" cy="8" r="2"/><circle cx="16" cy="8" r="2"/><circle cx="5" cy="13" r="2"/><circle cx="19" cy="13" r="2"/><path d="M8 18c0-3 2-5 4-5s4 2 4 5c0 2-2 3-4 3s-4-1-4-3Z"/></>,
    plus: <><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></>, search: <><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></>,
    award: <><circle cx="12" cy="9" r="6"/><path d="m8 14-2 7 6-3 6 3-2-7"/></>, directory: <><path d="M4 21V5l8-3 8 3v16M8 8h1m6 0h1M8 12h1m6 0h1M8 16h8"/></>,
    person: <><circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 4-7 8-7s7 2 8 7"/></>, logout: <><path d="M10 4H4v16h6M14 8l4 4-4 4m4-4H9"/></>
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export function BarkBoothLogo({ iconOnly = false, inverse = false }: { iconOnly?: boolean; inverse?: boolean }) {
  return <span className="inline-flex items-center gap-3" aria-label="Bark Booth Canine Registry"><span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-navy/15 bg-white p-1"><img src="/barkboothlogo.webp" alt="" className="h-full w-full object-contain" /></span>{!iconOnly && <span><span className={`block font-heading text-lg font-extrabold tracking-tight ${inverse ? "text-white" : "text-navy"}`}>Bark Booth</span><span className={`registry-label block text-[0.55rem] ${inverse ? "!text-skysoft/70" : ""}`}>Canine Registry</span></span>}</span>;
}

function Initials({ viewer }: { viewer: NonNullable<Viewer> }) { const value = viewer.displayName.split(/\s+/).map(n => n[0]).join("").slice(0, 2).toUpperCase() || "BB"; return <span className="grid h-9 w-9 place-items-center rounded-full bg-skysoft text-xs font-extrabold text-navy" aria-hidden="true">{value}</span>; }

function PublicHeader({ viewer }: { viewer: Viewer }) {
  return <header className="sticky top-0 z-30 border-b border-navy/10 bg-cream/95 backdrop-blur"><nav aria-label="Primary navigation" className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3 lg:px-8"><Link href="/"><BarkBoothLogo /></Link><div className="hidden items-center gap-1 md:flex">{publicLinks.map(([label, href]) => <Link key={href} href={href} className="nav-link">{label}</Link>)}</div><div className="flex items-center gap-2">{viewer ? <Link href="/dashboard" aria-label="Open dashboard" className="button-secondary !px-4"><Initials viewer={viewer} /><span className="hidden sm:inline">Dashboard</span></Link> : <><Link href="/login" className="nav-link hidden sm:inline-flex">Log in</Link><Link href="/signup" className="button-primary">Create account</Link></>}</div></nav><div className="flex gap-1 overflow-x-auto border-t border-navy/5 px-4 py-2 md:hidden">{publicLinks.slice(0, 3).map(([label, href]) => <Link key={href} href={href} className="nav-link flex-1 justify-center">{label}</Link>)}</div></header>;
}

function AppSidebar({ viewer, pathname }: { viewer: NonNullable<Viewer>; pathname: string }) {
  return <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-navy px-4 py-5 text-white lg:flex"><Link href="/dashboard" className="px-2"><BarkBoothLogo inverse /></Link><nav aria-label="Owner workspace" className="mt-9 grid gap-1">{appLinks.map(([label, href, icon]) => { const active = isNavigationRouteActive(pathname, href); return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`app-nav-link ${active ? "bg-white/[0.12] text-white" : "text-skysoft/75 hover:bg-white/[0.08] hover:text-white"}`}><Icon name={icon}/>{label}</Link>; })}</nav><div className="mt-auto border-t border-white/10 pt-4"><Link href="/account" aria-current={pathname.startsWith("/account") ? "page" : undefined} className={`app-nav-link ${pathname.startsWith("/account") ? "bg-white/[0.12]" : ""}`}><Initials viewer={viewer}/><span className="min-w-0"><span className="block truncate text-sm font-bold">{viewer.displayName}</span><span className="block truncate text-xs text-skysoft/60">Account & settings</span></span></Link><form action={logout}><button className="app-nav-link mt-1 w-full text-skysoft/70"><Icon name="logout"/>Log out</button></form></div></aside>;
}

function MobileAppNav({ pathname }: { pathname: string }) { return <nav aria-label="Mobile owner navigation" className="mobile-app-nav lg:hidden">{mobileLinks.map(([label, href, icon]) => { const active = isNavigationRouteActive(pathname, href); return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`mobile-app-link ${active ? "text-navy" : "text-slate"}`}><Icon name={icon}/><span>{label}</span></Link>; })}</nav>; }

function PublicFooter() { return <footer className="border-t border-navy/10 bg-navy px-5 py-10 text-white"><div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_1.5fr]"><div><BarkBoothLogo inverse/><p className="mt-4 max-w-md text-sm leading-6 text-skysoft/70">A trusted lifelong identity for every dog, with owner-controlled details and records that grow with their story.</p></div><div className="flex flex-wrap content-start gap-x-6 gap-y-3 md:justify-end">{footerLinks.map(([label, href]) => <Link key={href} href={href} className="text-sm font-semibold text-skysoft/75 hover:text-white">{label}</Link>)}</div></div></footer>; }

export function SiteChrome({ viewer, children }: { viewer: Viewer; children: ReactNode }) {
  const pathname = usePathname();
  const isApp = !!viewer && isOwnerWorkspaceRoute(pathname);
  if (isApp) return <><AppSidebar viewer={viewer} pathname={pathname}/><div className="min-h-screen lg:pl-64"><header className="flex h-16 items-center border-b border-navy/10 bg-white px-5 lg:hidden"><Link href="/dashboard"><BarkBoothLogo /></Link></header><main className="app-main">{children}</main><footer className="app-footer">Bark Booth Canine Registry · <Link href="/legal/privacy-policy">Privacy</Link> · <Link href="/legal/terms-and-conditions">Terms</Link></footer></div><MobileAppNav pathname={pathname}/></>;
  return <><PublicHeader viewer={viewer}/><main className="public-main">{children}</main><PublicFooter/></>;
}
