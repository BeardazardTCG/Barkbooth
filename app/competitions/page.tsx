import { competitionPricing, competitions, competitionTimeline, judgingCriteria, prizeStructure } from "@/lib/data";
import { ButtonLink, Card, Section } from "@/components/ui";

export default function CompetitionsPage() {
  return <>
    <Section eyebrow="Optional profile activities" title="Competitions can add achievements to a dog’s Bark Booth profile">
      <Card className="bg-gradient-to-br from-white via-cream to-skysoft/50"><p className="text-lg leading-8 text-charcoal/70">Bark Booth profiles come first. Monthly judged activities are optional ways to add memories, badges, rosettes, and results to that permanent profile record.</p><p className="mt-3 font-black text-navy">Frontend-only preview: no payments, uploads, or real entries are active.</p></Card>
      <div className="mt-4 grid gap-4 md:grid-cols-4">{competitionTimeline.map(item => <Card key={item.label}><p className="text-sm font-black uppercase tracking-widest text-pink">{item.detail}</p><h3 className="mt-2 text-xl font-black text-navy">{item.label}</h3></Card>)}</div>
    </Section>

    <Section eyebrow="Themes" title="Choose an activity module for a profile chapter"><div className="grid gap-4 md:grid-cols-2">{competitions.map(c => <Card key={c.slug} className="h-full transition hover:-translate-y-1"><div className={`grid h-36 place-items-center rounded-[1.5rem] bg-gradient-to-br ${c.color} text-5xl`}>🐕</div><p className="mt-4 text-sm font-black uppercase tracking-widest text-terracotta">{c.classType} · {c.month}</p><h3 className="mt-1 text-2xl font-black text-navy">{c.title}</h3><p className="mt-2 text-cocoa/65">{c.theme}</p><p className="mt-3 text-sm text-charcoal/65">{c.description}</p><div className="mt-4 grid grid-cols-2 gap-2 text-sm font-bold"><span>Profile activity</span><span>Closes: {c.closes}</span><span>{c.entries} mock entries</span><span>{c.price} preview</span></div><div className="mt-4 flex flex-wrap gap-2">{c.classes.map(className => <span key={className} className="rounded-full bg-lightgrey px-3 py-2 text-xs font-black text-navy">{className}</span>)}</div><div className="mt-4"><ButtonLink href={`/competitions/${c.slug}`}>View activity</ButtonLink></div></Card>)}</div></Section>

    <Section eyebrow="Judging" title="How themed photo activities are assessed"><div className="grid gap-4 md:grid-cols-4">{judgingCriteria.map(item => <Card key={item.label}><p className="text-3xl font-black text-pink">{item.value}</p><h3 className="mt-2 font-black text-navy">{item.label}</h3></Card>)}</div></Section>

    <Section eyebrow="Optional costs and rewards" title="Mock pricing and prizes sit behind the profile activity"><div className="grid gap-4 md:grid-cols-3">{competitionPricing.map(plan => <Card key={plan.label}><p className="text-4xl font-black text-navy">{plan.price}</p><h3 className="mt-2 text-xl font-black text-cocoa">{plan.label}</h3><p className="mt-2 text-sm text-charcoal/65">Frontend-only pricing preview; no payments are active.</p></Card>)}</div><div className="mt-4 grid gap-4 md:grid-cols-3">{prizeStructure.map(tier => <Card key={tier.place}><h3 className="text-3xl font-black text-navy">{tier.place}</h3><ul className="mt-4 space-y-2 text-sm font-bold text-charcoal/75">{tier.prizes.map(prize => <li key={prize}>• {prize}</li>)}</ul></Card>)}</div></Section>
  </>;
}
