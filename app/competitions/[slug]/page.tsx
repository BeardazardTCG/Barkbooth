import { notFound } from "next/navigation";
import { competitions } from "@/lib/data";
import { ButtonLink, Card, Section } from "@/components/ui";

export default function CompetitionDetailPage({ params }: { params: { slug: string } }) {
  const comp = competitions.find(c => c.slug === params.slug);
  if (!comp) notFound();
  return <><section className={`mx-5 mt-6 rounded-[2.5rem] bg-gradient-to-br ${comp.color} p-7 sm:mx-8 md:p-12`}><p className="text-sm font-black uppercase tracking-widest text-cocoa/60">{comp.classType} · {comp.month}</p><h1 className="mt-2 text-5xl font-black tracking-tight">{comp.title}</h1><p className="mt-4 max-w-2xl text-lg text-cocoa/70">{comp.description}</p><div className="mt-5 grid gap-3 text-sm font-bold sm:grid-cols-4"><span className="rounded-2xl bg-white/70 p-3">{comp.price}</span><span className="rounded-2xl bg-white/70 p-3">Closes {comp.closes}</span><span className="rounded-2xl bg-white/70 p-3">{comp.entries} entries</span><span className="rounded-2xl bg-white/70 p-3">{comp.prize}</span></div><div className="mt-6 flex flex-wrap gap-3"><ButtonLink href="/upload">Enter class</ButtonLink><ButtonLink href="/results" variant="secondary">View winners</ButtonLink></div></section><Section eyebrow="Pick your class" title="Competition classes"><div className="grid gap-4 md:grid-cols-4">{comp.classes.map(cls => <Card key={cls}><h3 className="text-xl font-black">{cls}</h3><p className="mt-2 text-sm text-cocoa/65">Includes finalist badge, digital rosette eligibility, and profile history.</p><div className="mt-4"><ButtonLink href="/upload">Enter class</ButtonLink></div></Card>)}</div></Section></>;
}
