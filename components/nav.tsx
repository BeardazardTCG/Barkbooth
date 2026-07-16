import Link from "next/link";
import { logout } from "@/lib/auth/actions";
import { getCurrentUser } from "@/lib/auth/session";

const loggedOutLinks = [["Registry", "/profiles"], ["Activities", "/competitions"], ["Log in", "/login"], ["Sign up", "/signup"]];
const loggedInLinks = [["Dashboard", "/dashboard"], ["Registry", "/profiles"], ["Register Dog", "/register-dog"], ["Records", "/dashboard#records"], ["Activities", "/competitions"], ["Directory", "/directory"], ["Account", "/account"]];
const footerLinks = [["Terms and Conditions", "/legal/terms-and-conditions"], ["Privacy Policy", "/legal/privacy-policy"], ["Cookie Policy", "/legal/cookie-policy"], ["Image Usage Consent", "/legal/image-usage-consent"], ["Refund Policy", "/legal/refund-policy"], ["Prize Fulfilment Policy", "/legal/prize-fulfilment-policy"]];

export function BarkBoothLogo({ iconOnly = false }: { iconOnly?: boolean }) {
  return <span className="inline-flex items-center gap-3" aria-label="Bark Booth Canine Registry"><span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border border-navy/15 bg-white p-1 shadow-registry"><img src="/barkboothlogo.webp" alt="" className="h-full w-full object-contain" /></span>{!iconOnly && <span><span className="block font-heading text-xl font-extrabold tracking-tight text-navy">Bark Booth</span><span className="registry-label block text-[0.58rem]">Canine Registry</span></span>}</span>;
}

function LogoutButton({ className }: { className: string }) {
  return <form action={logout}><button type="submit" className={className}>Log out</button></form>;
}

const navLinkClass = "whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold text-slate hover:bg-skysoft/60 hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info";
const ctaClass = "rounded-full border border-navy bg-navy px-5 py-3 text-sm font-bold text-white shadow-soft hover:bg-registry-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info";

export async function Nav() {
  const user = await getCurrentUser();
  const links = user ? loggedInLinks : loggedOutLinks.filter(([label]) => label !== "Sign up");
  return <header className="sticky top-0 z-20 border-b border-navy/10 bg-offwhite/[0.94] backdrop-blur"><nav className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-4 py-3"><Link href="/" className="flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-info"><BarkBoothLogo /></Link><div className="hidden items-center gap-2 overflow-x-auto md:flex">{links.map(([label, href]) => <Link key={`${label}-${href}`} href={href} className={navLinkClass}>{label}</Link>)}{user && <LogoutButton className={navLinkClass} />}</div>{user ? <Link href="/account" className={ctaClass}>Account</Link> : <Link href="/signup" className={ctaClass}>Sign up</Link>}</nav></header>;
}

export function SiteFooter() {
  return <footer className="border-t border-navy/10 bg-white/80 px-5 pb-28 pt-8 md:pb-8"><div className="mx-auto max-w-6xl"><BarkBoothLogo /><p className="mt-4 max-w-3xl text-sm leading-6 text-slate">Bark Booth is a lifelong canine identity and registry platform. The owner has the account; the dog has the identity. Optional competitions can add history, while structured records and owner-controlled information stay central.</p><div className="mt-5 flex flex-wrap gap-2">{footerLinks.map(([label, href]) => <Link key={`${label}-${href}`} href={href} className="rounded-full border border-navy/10 bg-offwhite px-3 py-2 text-xs font-bold text-navy hover:bg-skysoft/50">{label}</Link>)}</div></div></footer>;
}

export async function MobileTabs() {
  const user = await getCurrentUser();
  const links = user ? loggedInLinks : loggedOutLinks;
  return <div className="fixed inset-x-3 bottom-3 z-30 grid rounded-[1.5rem] border border-white/10 bg-navy/95 p-2 text-center text-[11px] font-bold text-white shadow-soft md:hidden" style={{ gridTemplateColumns: `repeat(${links.length + (user ? 1 : 0)}, minmax(0, 1fr))` }}>{links.map(([label, href]) => <Link key={`${label}-${href}`} href={href} className={`rounded-2xl px-1 py-2 hover:bg-white/10 ${label === "Register Dog" || label === "Sign up" ? "bg-info/80" : ""}`}>{label === "Register Dog" ? "Register" : label}</Link>)}{user && <LogoutButton className="w-full rounded-2xl px-1 py-2 text-[11px] font-bold text-white hover:bg-white/10" />}</div>;
}
