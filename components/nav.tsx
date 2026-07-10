import Link from "next/link";
import { logout } from "@/lib/auth/actions";
import { getCurrentUser } from "@/lib/auth/session";

const loggedOutLinks = [["Registry", "/profiles"], ["Activities", "/competitions"], ["Log in", "/login"], ["Sign up", "/signup"]];
const loggedInLinks = [["Dashboard", "/dashboard"], ["Registry", "/profiles"], ["Register Dog", "/register-dog"], ["Records", "/dashboard#records"], ["Activities", "/competitions"], ["Directory", "/directory"], ["Account", "/account"]];
const footerLinks = [["Terms and Conditions", "/legal/terms-and-conditions"], ["Privacy Policy", "/legal/privacy-policy"], ["Cookie Policy", "/legal/cookie-policy"], ["Image Usage Consent", "/legal/image-usage-consent"], ["Refund Policy", "/legal/refund-policy"], ["Prize Fulfilment Policy", "/legal/prize-fulfilment-policy"]];

export function BarkBoothLogo({ iconOnly = false }: { iconOnly?: boolean }) {
  return <span className="inline-flex items-center gap-3" aria-label="Bark Booth official registry mark"><span className="relative grid h-12 w-12 place-items-center rounded-2xl border border-navy/20 bg-offwhite shadow-registry"><span className="absolute inset-x-2 top-2 h-px bg-navy/20" /><span className="text-xl leading-none text-navy">BB</span></span>{!iconOnly && <span><span className="block font-heading text-xl font-bold tracking-tight text-navy">Bark Booth</span><span className="registry-label block text-[0.58rem]">Canine Registry</span></span>}</span>;
}

function LogoutButton({ className }: { className: string }) {
  return <form action={logout}><button type="submit" className={className}>Log out</button></form>;
}

export async function Nav() {
  const user = await getCurrentUser();
  const links = user ? loggedInLinks : loggedOutLinks.filter(([label]) => label !== "Sign up");
  return <header className="sticky top-0 z-20 border-b border-navy/10 bg-offwhite/92 backdrop-blur"><nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4"><Link href="/" className="flex items-center gap-2"><BarkBoothLogo /></Link><div className="hidden items-center gap-1 overflow-x-auto md:flex">{links.map(([label, href]) => <Link key={`${label}-${href}`} href={href} className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-bold text-slate hover:bg-muted/60 hover:text-navy">{label}</Link>)}{user && <LogoutButton className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-bold text-slate hover:bg-muted/60 hover:text-navy" />}</div>{user ? <Link href="/account" className="rounded-full border border-navy bg-navy px-5 py-3 text-sm font-bold text-white shadow-soft">Account</Link> : <Link href="/signup" className="rounded-full border border-navy bg-navy px-5 py-3 text-sm font-bold text-white shadow-soft">Sign up</Link>}</nav></header>;
}

export function SiteFooter() {
  return <footer className="border-t border-navy/10 bg-white/70 px-5 pb-28 pt-8 md:pb-8"><div className="mx-auto max-w-6xl"><BarkBoothLogo /><p className="mt-4 max-w-3xl text-sm leading-6 text-slate">Bark Booth is a lifelong canine identity and registry platform. The owner has the account; the dog has the identity. Optional competitions can add history, while structured records and owner-controlled information stay central.</p><div className="mt-5 flex flex-wrap gap-2">{footerLinks.map(([label, href]) => <Link key={`${label}-${href}`} href={href} className="rounded-full border border-navy/10 bg-offwhite px-3 py-2 text-xs font-bold text-navy">{label}</Link>)}</div></div></footer>;
}

export async function MobileTabs() {
  const user = await getCurrentUser();
  const links = user ? loggedInLinks : loggedOutLinks;
  return <div className="fixed inset-x-3 bottom-3 z-30 grid rounded-[1.5rem] bg-navy/95 p-2 text-center text-[11px] font-bold text-white shadow-soft md:hidden" style={{ gridTemplateColumns: `repeat(${links.length + (user ? 1 : 0)}, minmax(0, 1fr))` }}>{links.map(([label, href]) => <Link key={`${label}-${href}`} href={href} className={`rounded-2xl px-1 py-2 hover:bg-white/10 ${label === "Register Dog" || label === "Sign up" ? "bg-rosette" : ""}`}>{label === "Register Dog" ? "Register" : label}</Link>)}{user && <LogoutButton className="w-full rounded-2xl px-1 py-2 text-[11px] font-bold text-white hover:bg-white/10" />}</div>;
}
