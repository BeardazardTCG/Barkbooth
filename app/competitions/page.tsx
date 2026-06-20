import { competitions } from "@/lib/data";
import { ButtonLink, Card, Section } from "@/components/ui";

export default function CompetitionsPage() {
  return <Section eyebrow="Live classes" title="Choose this month's proud moment"><div className="grid gap-4 md:grid-cols-2">{competitions.map(c => <Card key={c.slug} className="h-full transition hover:-translate-y-1"><div className={`grid h-36 place-items-center rounded-[1.5rem] bg-gradient-to-br ${c.color} text-5xl`}>🐕</div><p className="mt-4 text-sm font-black uppercase tracking-widest text-terracotta">{c.classType} · {c.month}</p><h3 className="mt-1 text-2xl font-black">{c.title}</h3><p className="mt-2 text-cocoa/65">{c.theme}</p><div className="mt-4 grid grid-cols-2 gap-2 text-sm font-bold"><span>Price: {c.price}</span><span>Closes: {c.closes}</span><span>Prize: {c.prize}</span><span>{c.entries} entries</span></div><div className="mt-4"><ButtonLink href={`/competitions/${c.slug}`}>Enter class</ButtonLink></div></Card>)}</div></Section>;
}
