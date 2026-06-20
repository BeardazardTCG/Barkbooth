import { achievements, annualAwards, competitions, winners } from "@/lib/data";
import { ButtonLink, Card, PawAvatar, Rosette, Section } from "@/components/ui";

const reasons = ["A profile that grows with every proud moment", "Digital rosettes owners can share", "Warm judging built for real dog people", "Badges and streaks that make entering a habit"];
const steps = ["Create your dog's profile", "Enter a monthly or special class", "Collect rosettes, badges, results, and community love"];

export default function HomePage() {
  const featured = competitions[0];
  return <>
    <section className="px-5 pb-8 pt-6 sm:px-8 md:grid md:grid-cols-[1fr_0.85fr] md:items-center md:gap-8 md:py-12">
      <div>
        <p className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-terracotta shadow-sm">PupPodium · The home of proud dog owners.</p>
        <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-tight text-cocoa md:text-7xl">Enter your dog, collect rosettes, build their profile, and celebrate every proud dog moment.</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-cocoa/70">A modern competition community where classes create the spark, and dog profiles, badges, results, streaks, and shared wins create the habit.</p>
        <div className="mt-7 flex flex-wrap gap-3"><ButtonLink href="/upload">Enter this month</ButtonLink><ButtonLink href="/results" variant="secondary">View winners</ButtonLink></div>
      </div>
      <Card className="mt-8 overflow-hidden bg-gradient-to-br from-white to-biscuit/50 md:mt-0">
        <div className={`rounded-[1.75rem] bg-gradient-to-br ${featured.color} p-5`}><PawAvatar label="featured dog" /><p className="mt-5 text-sm font-black uppercase tracking-widest text-cocoa/55">Featured competition</p><h2 className="mt-2 text-3xl font-black">{featured.title}</h2><p className="mt-2 text-cocoa/70">{featured.description}</p><div className="mt-5 grid grid-cols-2 gap-3 text-sm font-bold"><span className="rounded-2xl bg-white/70 p-3">🏆 {featured.prize}</span><span className="rounded-2xl bg-white/70 p-3">⏰ {featured.closes}</span></div></div>
      </Card>
    </section>
    <Section eyebrow="How it works" title="A monthly ritual for proud dog owners"><div className="grid gap-4 md:grid-cols-3">{steps.map((item, i) => <Card key={item}><span className="text-3xl font-black text-terracotta">0{i + 1}</span><p className="mt-3 text-xl font-black">{item}</p></Card>)}</div></Section>
    <Section eyebrow="Why dog owners join" title="More than a contest"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{reasons.map(item => <Card key={item}><p className="text-3xl">🐾</p><h3 className="mt-3 text-xl font-black">{item}</h3></Card>)}</div></Section>
    <Section eyebrow="Featured competitions" title="Monthly and special classes"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{competitions.map(c => <Card key={c.slug}><div className={`h-28 rounded-[1.5rem] bg-gradient-to-br ${c.color}`} /><p className="mt-4 text-xs font-black uppercase tracking-widest text-terracotta">{c.classType}</p><h3 className="mt-1 text-2xl font-black">{c.title}</h3><p className="mt-2 text-sm text-cocoa/65">{c.entries} entries · {c.price}</p><ButtonLink href={`/competitions/${c.slug}`}>Enter class</ButtonLink></Card>)}</div></Section>
    <Section eyebrow="Winner spotlight" title="Every result becomes part of the profile"><div className="grid gap-4 md:grid-cols-3">{winners.map(w => <Card key={w.dog}><Rosette label={w.place} className={w.ribbon} /><h3 className="mt-4 text-2xl font-black">{w.dog}</h3><p className="font-bold text-terracotta">{w.className}</p><p className="mt-2 text-cocoa/65">{w.note}</p></Card>)}</div></Section>
    <Section eyebrow="Digital rosettes & badges" title="Collectable milestones for every kind of dog"><div className="flex flex-wrap gap-3">{achievements.map(b => <span key={b} className="rounded-full bg-white px-4 py-3 text-sm font-black shadow-soft">🏅 {b}</span>)}</div></Section>
    <Section eyebrow="Fair judging" title="Real dogs, real owners, real moments"><Card><p className="text-lg leading-8 text-cocoa/70">PupPodium is designed around human judging, no AI-generated entries, and no professional studio-photo advantage. The goal is a warm, fair space where phone photos and everyday proud moments can shine.</p></Card></Section>
    <Section eyebrow="Community first" title="The competition is the activity. The community is the habit."><div className="grid gap-4 md:grid-cols-5">{annualAwards.map(a => <Card key={a}><h3 className="text-xl font-black">{a}</h3><p className="mt-2 text-sm text-cocoa/65">Annual award concept</p></Card>)}</div></Section>
  </>;
}
