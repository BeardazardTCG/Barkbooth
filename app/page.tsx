import { calendarPups, competitions, coreValues, featuredProfiles, tricksAndTails, winners } from "@/lib/data";
import { BarkBoothLogo } from "@/components/nav";
import { ButtonLink, Card, PawAvatar, Rosette, Section } from "@/components/ui";

export default function HomePage() {
  const featured = competitions[0];
  const peopleChoice = competitions.find(c => c.slug === "community-favourites") ?? competitions[0];

  return <>
    <section className="px-5 pb-8 pt-8 sm:px-8 md:grid md:grid-cols-[1fr_0.85fr] md:items-center md:gap-8 md:py-14">
      <div>
        <p className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-black text-pink shadow-sm"><BarkBoothLogo iconOnly /> Bark Booth · Celebrate every milestone.</p>
        <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-tight text-navy md:text-7xl">Celebrate every milestone.</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-charcoal/75">Create your dog’s profile, earn badges, win prizes, and celebrate every achievement.</p>
        <p className="mt-3 max-w-xl text-base leading-7 text-charcoal/65">A playful UK dog community that feels like a digital scrapbook of proud moments, fair competitions, rosettes, welfare-first wins, and positive owner-dog experiences.</p>
        <div className="mt-7 flex flex-wrap gap-3"><ButtonLink href="/competitions">Enter Competitions</ButtonLink><ButtonLink href="/dog-profile" variant="secondary">Create Dog Profile</ButtonLink></div>
      </div>
      <Card className="mt-8 overflow-hidden bg-gradient-to-br from-white to-lightgrey md:mt-0">
        <div className={`rounded-[1.75rem] bg-gradient-to-br ${featured.color} p-5`}><PawAvatar label="featured dog" /><p className="mt-5 text-sm font-black uppercase tracking-widest text-navy/55">Current competition</p><h2 className="mt-2 text-3xl font-black text-navy">{featured.title}</h2><p className="mt-2 text-charcoal/70">{featured.description}</p><div className="mt-5 grid grid-cols-2 gap-3 text-sm font-bold"><span className="rounded-2xl bg-white/75 p-3">🏆 {featured.prize}</span><span className="rounded-2xl bg-white/75 p-3">⏰ {featured.closes}</span></div></div>
      </Card>
    </section>

    <Section eyebrow="Current competitions" title="Playful classes for real-life dog moments"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{competitions.map(c => <Card key={c.slug}><div className={`h-28 rounded-[1.5rem] bg-gradient-to-br ${c.color}`} /><p className="mt-4 text-xs font-black uppercase tracking-widest text-pink">{c.classType}</p><h3 className="mt-1 text-2xl font-black text-navy">{c.title}</h3><p className="mt-2 text-sm text-charcoal/65">{c.entries} entries · {c.price}</p><ButtonLink href={`/competitions/${c.slug}`}>Enter class</ButtonLink></Card>)}</div></Section>
    <Section eyebrow="People’s Choice Pooch" title="Community love for everyday favourites"><Card><div className="grid gap-5 md:grid-cols-[120px_1fr]"><PawAvatar label="People's Choice Pooch" /><div><h3 className="text-3xl font-black text-navy">{peopleChoice.title}</h3><p className="mt-2 text-charcoal/70">Friendly reactions, member votes, and cheerful owner stories help dogs collect community badges without pressure.</p></div></div></Card></Section>
    <Section eyebrow="Recent winners" title="Every result becomes part of the scrapbook"><div className="grid gap-4 md:grid-cols-3">{winners.map(w => <Card key={w.dog}><Rosette label={w.place} className={w.ribbon} /><h3 className="mt-4 text-2xl font-black text-navy">{w.dog}</h3><p className="font-bold text-pink">{w.className}</p><p className="mt-2 text-charcoal/65">{w.note}</p></Card>)}</div></Section>
    <Section eyebrow="Featured dog profiles" title="Profiles that grow with every achievement"><div className="grid gap-4 md:grid-cols-3">{featuredProfiles.map(profile => <Card key={profile.name}><PawAvatar label={profile.name} /><h3 className="mt-4 text-2xl font-black text-navy">{profile.name}</h3><p className="mt-2 text-charcoal/65">{profile.note}</p><span className="mt-4 inline-flex rounded-full bg-pink px-3 py-2 text-sm font-black text-white">🏅 {profile.badge}</span></Card>)}</div></Section>
    <Section eyebrow="Why Dog Profiles Matter" title="A lifetime journey for the dog at the centre"><Card className="bg-gradient-to-br from-white via-cream to-biscuit/60"><p className="text-lg leading-8 text-charcoal/70">Bark Booth profiles are designed as Dog Passports: a lasting record of identity, care notes, competition history, milestones, achievements, and favourite memories. The dog is the product — each entry, rosette, rescue chapter, calendar moment, and memorial note helps tell a fuller lifetime story than a single competition upload ever could.</p></Card></Section>
    <Section eyebrow="Calendar Pups" title="A year of milestone prompts"><div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">{calendarPups.map(item => <Card key={item}><h3 className="text-xl font-black text-navy">{item}</h3><p className="mt-2 text-sm text-charcoal/65">Seasonal scrapbook theme</p></Card>)}</div></Section>
    <Section eyebrow="Tricks & Tails preview" title="Tiny training wins, big celebration energy"><div className="grid gap-4 md:grid-cols-3">{tricksAndTails.map(item => <Card key={item}><p className="text-3xl">✨</p><h3 className="mt-3 text-xl font-black text-navy">{item}</h3></Card>)}</div></Section>
    <Section eyebrow="Why Bark Booth exists" title="A positive place for proud dog owners"><Card><p className="text-lg leading-8 text-charcoal/70">Bark Booth turns competitions into a joyful record of progress: not just who wins, but what each dog learned, tried, and enjoyed along the way.</p></Card></Section>
    <Section eyebrow="Core values" title="Built around Amy’s welfare-first vision"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{coreValues.map(value => <Card key={value.title}><h3 className="text-xl font-black text-navy">{value.title}</h3><p className="mt-2 text-charcoal/65">{value.detail}</p></Card>)}</div></Section>
    <Section eyebrow="Fair judging and dog welfare" title="Kind, clear, and fair by design"><Card><p className="text-lg leading-8 text-charcoal/70">Bark Booth is designed around fair human judging, clear mock classes, no AI-generated entries, no studio-photo advantage, and welfare-first guidance that keeps dogs comfortable.</p></Card></Section>
    <Section eyebrow="Newsletter signup mock" title="Get monthly prompts, winners, and badge ideas"><Card><form className="grid gap-3 md:grid-cols-[1fr_auto]"><input aria-label="Email address" placeholder="owner@example.co.uk" className="rounded-full border border-navy/10 bg-lightgrey px-5 py-3 font-bold" /><button type="button" className="rounded-full bg-pink px-6 py-3 font-black text-white">Join the mock list</button></form><p className="mt-3 text-sm text-charcoal/60">Frontend-only preview — no email is submitted or stored.</p></Card></Section>
  </>;
}
