import Link from "next/link";

const links = [["Registry", "/profiles"], ["Register Dog", "/register-dog"], ["Competitions", "/competitions"], ["Winners", "/winners"], ["Mission", "/mission"]];
const footerLinks = [["Terms and Conditions", "/legal/terms-and-conditions"], ["Privacy Policy", "/legal/privacy-policy"], ["Cookie Policy", "/legal/cookie-policy"], ["Image Usage Consent", "/legal/image-usage-consent"], ["Refund Policy", "/legal/refund-policy"], ["Prize Fulfilment Policy", "/legal/prize-fulfilment-policy"]];

export function BarkBoothLogo({ iconOnly = false }: { iconOnly?: boolean }) {
  return <span className="inline-flex items-center gap-2" aria-label="Bark Booth logo"><span className="relative grid h-11 w-11 place-items-center rounded-[1rem] border-2 border-navy bg-cream shadow-soft"><span className="absolute -right-1 -top-1 h-3 w-5 rounded-t-lg bg-pink" /><span className="absolute left-2 top-1 h-2 w-3 rounded-t-md bg-navy" /><span className="text-xl leading-none">🐾</span></span>{!iconOnly && <span className="text-lg font-black tracking-tight text-navy">Bark Booth</span>}</span>;
}

export function Nav() {
  return <header className="sticky top-0 z-20 border-b border-navy/10 bg-cream/90 backdrop-blur"><nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3"><Link href="/" className="flex items-center gap-2"><BarkBoothLogo /></Link><div className="hidden items-center gap-1 overflow-x-auto md:flex">{links.map(([label, href]) => <Link key={href} href={href} className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-bold text-navy/75 hover:bg-lightgrey hover:text-navy">{label}</Link>)}</div><Link href="/register-dog" className="rounded-full bg-pink px-5 py-3 text-sm font-black text-white shadow-soft">Register Dog</Link></nav></header>;
}

export function SiteFooter() {
  return <footer className="border-t border-navy/10 bg-white/70 px-5 pb-28 pt-8 md:pb-8"><div className="mx-auto max-w-6xl"><p className="font-black text-navy">Bark Booth trust placeholders</p><p className="mt-2 text-sm text-charcoal/65">Bark Booth is a registry-style dog profile platform for identity, milestones, care notes, and memories. Optional competitions can add achievements, while welfare-first principles and owner-controlled information stay central.</p><div className="mt-4 flex flex-wrap gap-2">{footerLinks.map(([label, href]) => <Link key={href} href={href} className="rounded-full bg-lightgrey px-3 py-2 text-xs font-black text-navy">{label}</Link>)}</div></div></footer>;
}

export function MobileTabs() {
  return <div className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 rounded-[1.5rem] bg-navy/95 p-2 text-center text-[11px] font-bold text-white shadow-soft md:hidden">{[["Register", "/register-dog"], ["Registry", "/profiles"], ["Comps", "/competitions"], ["Winners", "/winners"], ["Mission", "/mission"]].map(([label, href], index) => <Link key={href} href={href} className={`rounded-2xl px-1 py-2 hover:bg-white/10 ${index === 0 ? "bg-pink" : ""}`}>{label}</Link>)}</div>;
}
