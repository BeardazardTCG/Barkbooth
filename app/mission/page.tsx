import { ButtonLink, Card, PawAvatar, Section } from "@/components/ui";

const dogJourney = [
  ["Puppy", "A first tiny pawprint in the story."],
  ["First profile", "A public Bark Booth number and identity card."],
  ["Training milestones", "Kind progress, confidence, and teamwork."],
  ["Competitions", "Judged classes become saved achievements."],
  ["People's Choice", "Community favourites add warmth to the record."],
  ["Calendar Pup", "Seasonal highlights become keepsake moments."],
  ["Family additions", "Future connections can sit beside the story."],
  ["Senior years", "Grey muzzles, gentle wins, and loved routines."],
  ["Rainbow Bridge Memorial", "The timeline remains available for remembrance."]
];

const futureFeatures = [
  ["🛂", "Dog Passport", "A lifelong public profile for milestones, identity notes, achievements, and memories."],
  ["🌳", "Family Trees", "Community-maintained relationship cards for relatives and future litters."],
  ["📜", "Breeder Records", "Placeholder record pages for breeder context and early puppy history."],
  ["🏡", "Rescue Profiles", "A compassionate way to preserve each chapter of a rescue dog's journey."],
  ["🤝", "Ownership Transfers", "A future concept for safely continuing a profile across life changes."],
  ["🩺", "Private Health Records", "A private mock module for care notes, vaccinations, and wellness reminders."],
  ["📍", "Missing Dog Alerts", "Optional community awareness concepts for nearby members."],
  ["🌈", "Memorial Pages", "Calm memorial profiles where photos, rosettes, and timelines remain visible."]
];

const rescueJourney = ["Rescue", "Foster", "Available for Adoption", "Adopted", "Lifetime Bark Booth Profile"];
const familyRows = [
  { label: "Grandparents", dogs: ["Willow", "Bear", "Honey", "Scout"] },
  { label: "Parents", dogs: ["Mabel", "Otis"] },
  { label: "Current Dog", dogs: ["Luna"] },
  { label: "Future Puppies", dogs: ["Puppy A", "Puppy B", "Puppy C"] }
];

export default function MissionPage() {
  return <>
    <section className="px-5 pb-8 pt-8 sm:px-8 md:grid md:grid-cols-[1fr_0.82fr] md:items-center md:gap-8 md:py-14">
      <div>
        <p className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-info shadow-sm">Bark Booth vision</p>
        <h1 className="mt-5 max-w-4xl text-5xl font-bold leading-[0.95] tracking-tight text-navy md:text-7xl">Every dog deserves a history.</h1>
        <p className="mt-6 max-w-2xl whitespace-pre-line text-xl leading-9 text-charcoal/75">Celebrate every dog.{"\n"}Preserve every story.{"\n"}{"Build a lifelong digital record that grows alongside every stage of a dog's life."}</p>
        <div className="mt-8 flex flex-wrap gap-3"><ButtonLink href="/dog-profile">View Example Profile</ButtonLink><ButtonLink href="/profiles" variant="secondary">Explore Dog Passports</ButtonLink></div>
      </div>
      <Card className="mt-8 overflow-hidden bg-gradient-to-br from-white via-offwhite to-skysoft/70 md:mt-0">
        <div className="grid gap-4 rounded-[1.75rem] bg-gradient-to-br from-skysoft/60 via-white to-offwhite p-5">
          <PawAvatar label="mission dog" className="min-h-[260px] text-7xl" />
          <div className="grid gap-3 sm:grid-cols-3"><span className="rounded-2xl bg-white/80 p-3 font-bold text-navy">🏵️ Rosettes</span><span className="rounded-2xl bg-white/80 p-3 font-bold text-navy">📅 Memories</span><span className="rounded-2xl bg-white/80 p-3 font-bold text-navy">🌈 Legacy</span></div>
        </div>
      </Card>
    </section>

    <Section eyebrow="Why Bark Booth exists" title="More than a chip, more than a file">
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <Card><h3 className="text-2xl font-bold text-navy">Many dogs only have</h3><div className="mt-4 grid gap-3"><span className="rounded-2xl bg-lightgrey p-4 font-bold text-navy">• a microchip</span><span className="rounded-2xl bg-lightgrey p-4 font-bold text-navy">• veterinary records</span></div></Card>
        <Card className="bg-gradient-to-br from-white to-skysoft/60"><p className="text-lg leading-8 text-charcoal/70">Those records matter, but they rarely capture achievements, family history, rescue journeys, favourite memories, or the personality that makes a dog unforgettable. Bark Booth exists to preserve these stories in a warm public scrapbook where competitions are only one chapter in a much longer life.</p></Card>
      </div>
    </Section>

    <Section eyebrow="The Dog Journey" title="A lifetime record, one proud chapter at a time">
      <div className="relative grid gap-4 md:grid-cols-3">
        {dogJourney.map(([title, detail], index) => <Card key={title} className="relative bg-gradient-to-br from-white to-offwhite"><span className="inline-grid h-10 w-10 place-items-center rounded-full bg-info font-bold text-white">{index + 1}</span><h3 className="mt-3 text-xl font-bold text-navy">{title}</h3><p className="mt-2 text-sm leading-6 text-charcoal/65">{detail}</p>{index < dogJourney.length - 1 && <p className="mt-3 text-2xl text-info">↓</p>}</Card>)}
      </div>
    </Section>

    <Section eyebrow="Future platform preview" title="Concepts for the Bark Booth world ahead">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{futureFeatures.map(([icon, title, description]) => <Card key={title}><div className="flex items-start justify-between gap-3"><span className="text-4xl">{icon}</span><span className="rounded-full bg-skysoft px-3 py-1 text-xs font-bold uppercase tracking-widest text-navy">Future feature</span></div><h3 className="mt-4 text-xl font-bold text-navy">{title}</h3><p className="mt-2 text-sm leading-6 text-charcoal/65">{description}</p></Card>)}</div>
    </Section>

    <Section eyebrow="Family Tree Preview" title="Community-maintained connections, not official pedigree registration">
      <Card className="bg-gradient-to-br from-white via-offwhite to-skysoft/60"><div className="grid gap-5">{familyRows.map(row => <div key={row.label}><p className="text-sm font-bold uppercase tracking-[0.2em] text-info">{row.label}</p><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{row.dogs.map(dog => <div key={dog} className="rounded-2xl bg-white/85 p-4 text-center shadow-sm"><div className="text-3xl">🐾</div><p className="mt-2 font-bold text-navy">{dog}</p><p className="text-xs font-bold text-charcoal/55">Placeholder card</p></div>)}</div><p className="mt-3 text-center text-2xl text-info">↓</p></div>)}</div></Card>
    </Section>

    <Section eyebrow="Missing Dog Concept" title="A careful future idea for community awareness">
      <Card className="grid gap-5 bg-gradient-to-br from-white to-skysoft/60 md:grid-cols-[0.9fr_1.1fr]"><div><span className="rounded-full bg-red-100 px-4 py-2 font-bold text-red-700">Status: Missing</span><h3 className="mt-4 text-3xl font-bold text-navy">Optional nearby member awareness</h3><p className="mt-3 leading-7 text-charcoal/70">Nearby Bark Booth members could receive optional notifications in a future version. This is a static concept only — no real alerts, maps, location tracking, or notifications are active.</p></div><div className="grid min-h-[240px] place-items-center rounded-[1.75rem] bg-white/80 text-center text-5xl shadow-inner">🗺️<p className="mt-3 text-base font-bold text-navy">Mock map illustration placeholder</p></div></Card>
    </Section>

    <Section eyebrow="Rescue Journey" title="The story continues rather than starting over">
      <div className="grid gap-4 md:grid-cols-5">{rescueJourney.map((stage, index) => <Card key={stage} className="text-center"><span className="text-4xl">🏡</span><h3 className="mt-3 text-lg font-bold text-navy">{stage}</h3>{index < rescueJourney.length - 1 && <p className="mt-3 text-2xl text-info">↓</p>}</Card>)}</div>
      <Card className="mt-4"><p className="text-lg leading-8 text-charcoal/70">A rescue dog may have many chapters before adoption. {"Bark Booth's future concept keeps those chapters visible with care, so a lifetime profile can honour the rescue, foster, adoption, achievements, and settled family life together."}</p></Card>
    </Section>

    <Section eyebrow="Rainbow Bridge" title="A calm memorial where love and achievements remain">
      <Card className="grid gap-5 bg-gradient-to-br from-white via-offwhite to-skysoft/60 md:grid-cols-[0.8fr_1.2fr]"><div className="rounded-[1.75rem] bg-white/80 p-5 text-center shadow-sm"><div className="text-6xl">🌈</div><h3 className="mt-3 text-2xl font-bold text-navy">{"Daisy's Memorial Profile"}</h3><p className="mt-2 text-sm text-charcoal/60">Selected photos · senior sweetheart · calendar pup</p></div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-white/80 p-4"><h4 className="font-bold text-navy">Achievements preserved</h4><p className="mt-2 text-sm text-charcoal/65">Rosettes, badges, calendar moments, and {"People's Choice memories remain part of the record."}</p></div><div className="rounded-2xl bg-white/80 p-4"><h4 className="font-bold text-navy">Timeline remains available</h4><p className="mt-2 text-sm text-charcoal/65">Family can revisit favourite chapters with warmth, gratitude, and remembrance.</p></div></div></Card>
    </Section>
  </>;
}
