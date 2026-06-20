import Link from "next/link";

const links = [["Home", "/"], ["Classes", "/competitions"], ["Winners", "/results"], ["Dog", "/dog-profile"], ["Badges", "/rewards"]];

export function Nav() {
  return <header className="sticky top-0 z-20 border-b border-white/70 bg-cream/85 backdrop-blur"><nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3"><Link href="/" className="flex items-center gap-2 text-lg font-black text-cocoa"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-cocoa text-white">🐾</span>PupPodium</Link><div className="hidden items-center gap-1 md:flex">{links.map(([label, href]) => <Link key={href} href={href} className="rounded-full px-4 py-2 text-sm font-bold text-cocoa/75 hover:bg-white hover:text-cocoa">{label}</Link>)}</div><Link href="/upload" className="rounded-full bg-terracotta px-5 py-3 text-sm font-black text-white shadow-soft">Enter</Link></nav></header>;
}

export function MobileTabs() {
  return <div className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 rounded-[1.5rem] bg-cocoa/95 p-2 text-center text-[11px] font-bold text-white shadow-soft md:hidden"><Link href="/upload" className="rounded-2xl bg-terracotta px-1 py-2">Enter</Link>{links.slice(1).map(([label, href]) => <Link key={href} href={href} className="rounded-2xl px-1 py-2 hover:bg-white/10">{label}</Link>)}</div>;
}
