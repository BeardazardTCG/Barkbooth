import { competitions, coreValues, featuredProfiles, profileCards, winners } from "@/lib/data";
import { BarkBoothLogo } from "@/components/nav";
import { ButtonLink, Card, PawAvatar, Rosette, Section } from "@/components/ui";

const profileIncludes = [
  ["Identity", "Bark Booth number, profile status, breed or mix, life stage, county, and public profile photo.", "🛂"],
  ["Life moments", "Birthdays, gotcha days, training milestones, favourite memories, and everyday proud moments.", "📖"],
  ["Care notes", "Public-friendly wellness placeholders for vaccinations, weight, health testing, and owner-managed notes.", "🩺"],
  ["Achievements", "Optional competition entries, rosettes, calendar moments, and badges saved back to the dog’s story.", "🏅"]
];

const registryReasons = [
  ["A profile for every dog", "Pedigree, crossbreed, rescue, senior, puppy, active, retired, or remembered — every dog can have a place."],
  ["A lasting identity", "Give your dog a Bark Booth number and a public profile that can grow from first memories to later-life chapters."],
  ["Not social media", "Profiles are structured records, not feeds — built around the dog’s identity, milestones, care notes, and achievements."],
  ["Competitions are optional", "Entering a class can add a badge, rosette, or result, but the profile still matters even if your dog never competes."]
];

export default function HomePage() {
  const featuredRegistryDogs = featuredProfiles.slice(0, 3);
  const rescueDogs = profileCards.filter(dog => dog.rescueBadge || dog.rescueName || dog.status === "Available for Adoption");

  return <>
    <section className="px-5 pb-8 pt-8 sm:px-8 md:grid md:grid-cols-[1fr_0.85fr] md:items-center md:gap-8 md:py-14">
      <div>
        <p className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-black text-pink shadow-sm"><BarkBoothLogo iconOnly /> Bark Booth · Canine Identity</p>
        <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-tight text-navy md:text-7xl">Every dog deserves a Bark Booth Identity.</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-charcoal/75">Create a lifelong digital identity for your dog with a unique Bark Booth Registry Number. Your dog’s identity stays with them for life and can grow alongside them, whether they’re a beloved family pet, breeding dog, rescue, working dog or show dog.</p>
        <p className="mt-3 max-w-xl text-base leading-7 text-charcoal/65">Bark Booth is an inclusive platform built for everyone who loves dogs. Whether you’re looking for a dog, already own one, run a breeding programme, work with a rescue or simply enjoy taking part in competitions, you’re welcome here.</p>
        <div className="mt-7 flex flex-wrap gap-3"><ButtonLink href="/register-dog">Register Your Dog</ButtonLink><ButtonLink href="/profiles" variant="secondary">Search Registry</ButtonLink></div>
      </div>
      <Card className="mt-8 overflow-hidden bg-gradient-to-br from-white via-cream to-biscuit/60 md:mt-0">
        <div className="rounded-[1.75rem] bg-gradient-to-br from-pink-100 via-white to-skysoft p-5">
          <PawAvatar label="Bark Booth dog profile" />
          <p className="mt-5 text-sm font-black uppercase tracking-widest text-navy/55">Example Canine Identity</p>
          <h2 className="mt-2 text-3xl font-black text-navy">Mabel · BB-000001</h2>
          <p className="mt-2 text-charcoal/70">A Bark Booth Identity can hold permanent details first, then grow with health records, documents, history and optional achievements in one calm record.</p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm font-bold"><span className="rounded-2xl bg-white/75 p-3">🛂 Registry Number</span><span className="rounded-2xl bg-white/75 p-3">📖 Lifelong identity</span></div>
        </div>
      </Card>
    </section>

    <Section eyebrow="Why Register Your Dog?" title="A lasting profile for the dog at the centre of your life"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{registryReasons.map(([title, detail]) => <Card key={title}><h3 className="text-xl font-black text-navy">{title}</h3><p className="mt-2 text-sm leading-6 text-charcoal/65">{detail}</p></Card>)}</div></Section>

    <Section eyebrow="What a Bark Booth Profile Can Include" title="Identity, memories, care notes, and optional achievements"><div className="grid gap-4 md:grid-cols-4">{profileIncludes.map(([title, detail, icon]) => <Card key={title} className="bg-gradient-to-br from-white to-cream"><p className="text-4xl">{icon}</p><h3 className="mt-3 text-xl font-black text-navy">{title}</h3><p className="mt-2 text-sm leading-6 text-charcoal/65">{detail}</p></Card>)}</div></Section>

    <Section eyebrow="Search the Registry" title="Search canine identities"><Card className="bg-gradient-to-br from-white via-cream to-skysoft/50"><div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center"><div><p className="text-lg leading-8 text-charcoal/70">Look up public Bark Booth identities by dog name, registry number, life stage, rescue status, or memorial status. This early registry view uses example identities while live public search grows over time.</p><div className="mt-4 grid gap-3 sm:grid-cols-3"><span className="rounded-2xl bg-white/80 p-3 text-sm font-black text-cocoa">BB-000001</span><span className="rounded-2xl bg-white/80 p-3 text-sm font-black text-cocoa">Rescue profiles</span><span className="rounded-2xl bg-white/80 p-3 text-sm font-black text-cocoa">Rainbow Bridge</span></div></div><ButtonLink href="/profiles" variant="secondary">Search Registry</ButtonLink></div></Card></Section>

    <Section eyebrow="Optional Activities" title="Optional activities that add achievements to a dog’s profile"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{competitions.map(c => <Card key={c.slug}><div className={`h-28 rounded-[1.5rem] bg-gradient-to-br ${c.color}`} /><p className="mt-4 text-xs font-black uppercase tracking-widest text-pink">Optional profile achievement</p><h3 className="mt-1 text-2xl font-black text-navy">{c.title}</h3><p className="mt-2 text-sm text-charcoal/65">{c.classType} · {c.entries} entries · {c.price}</p><p className="mt-2 text-sm leading-6 text-charcoal/65">Entries can add rosettes, badges, and results to a dog’s Bark Booth record.</p><ButtonLink href={`/competitions/${c.slug}`}>View activity</ButtonLink></Card>)}</div></Section>

    <Section eyebrow="Featured Dogs" title="Profiles that grow with every chapter"><div className="grid gap-4 md:grid-cols-3">{featuredRegistryDogs.map(profile => <Card key={profile.name}><PawAvatar label={profile.name} /><h3 className="mt-4 text-2xl font-black text-navy">{profile.name}</h3><p className="mt-2 text-charcoal/65">{profile.note}</p><span className="mt-4 inline-flex rounded-full bg-pink px-3 py-2 text-sm font-black text-white">🏅 {profile.badge}</span></Card>)}</div></Section>

    <Section eyebrow="Rescue Dogs" title="Preserve rescue, foster, adoption, and settled-life chapters"><div className="grid gap-4 md:grid-cols-2">{rescueDogs.map(dog => <Card key={dog.profileNumber} className="bg-gradient-to-br from-white to-emerald-50"><div className="grid gap-5 md:grid-cols-[120px_1fr]"><PawAvatar label={`${dog.name} rescue profile`} /><div><div className="flex flex-wrap gap-2"><span className="rounded-full bg-white px-3 py-2 text-xs font-black text-cocoa">{dog.profileNumber}</span><span className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-black text-cocoa">{dog.status}</span></div><h3 className="mt-3 text-3xl font-black text-navy">{dog.name}</h3><p className="mt-1 font-bold text-pink">{dog.breed}</p>{dog.rescueName && <p className="mt-3 text-sm font-bold text-charcoal/70">Rescue: {dog.rescueName}</p>}<p className="mt-2 text-sm leading-6 text-charcoal/65">A Bark Booth profile can keep rescue context visible with care while the dog’s life story continues.</p></div></div></Card>)}</div></Section>

    <Section eyebrow="Latest Winners" title="Optional activity results become profile achievements"><div className="grid gap-4 md:grid-cols-3">{winners.map(w => <Card key={w.dog}><Rosette label={w.place} className={w.ribbon} /><h3 className="mt-4 text-2xl font-black text-navy">{w.dog}</h3><p className="font-bold text-pink">{w.className}</p><p className="mt-2 text-charcoal/65">{w.note}</p><p className="mt-3 rounded-2xl bg-lightgrey p-3 text-sm font-black text-cocoa">Saved as a profile achievement</p></Card>)}</div></Section>

    <Section eyebrow="Founding Paws" title="Built around every dog, not just podium moments"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{coreValues.map(value => <Card key={value.title}><h3 className="text-xl font-black text-navy">{value.title}</h3><p className="mt-2 text-charcoal/65">{value.detail}</p></Card>)}</div></Section>
  </>;
}
