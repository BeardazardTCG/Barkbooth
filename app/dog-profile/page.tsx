import { profileDog } from "@/lib/data";
import { Card, PawAvatar, Rosette, Section } from "@/components/ui";

const dogRole = "Pet";
const visibility = "Public profile";
const attributionLabel = "Guardian";
const attributionValue = `@${profileDog.ownerUsername}`;
const emptyMessage = "Nothing added yet—you can build this over time.";

const identityRows = [
  ["Bark Booth Registry Number", profileDog.barkBoothNumber],
  ["Role", dogRole],
  ["Breed / type", profileDog.breed || "Mixed Breed / Unknown"],
  ["Profile status", profileDog.status],
  ["Visibility", visibility],
  [attributionLabel, attributionValue]
];

const overviewRows = [
  ["Age", profileDog.age],
  ["Date of birth", profileDog.dateOfBirth],
  ["Gotcha day", profileDog.gotchaDay],
  ["County", profileDog.county],
  ["Joined Bark Booth", profileDog.joinedBarkBooth],
  ["Microchip", profileDog.microchip]
];

const aboutRows = [
  ["Personality", profileDog.about.personality],
  ["Favourite toy", profileDog.about.favouriteToy],
  ["Favourite food", profileDog.about.favouriteFood],
  ["Favourite activities", profileDog.about.favouriteActivities],
  ["Tricks known", profileDog.about.tricksKnown],
  ["House trained", profileDog.about.houseTrained]
];

const documentRows = [
  ["Kennel Club", profileDog.kennelClub],
  ["DNA summary", profileDog.dnaTested],
  ["Health testing", profileDog.healthTested]
];

function EmptyState({ title = "Nothing added yet" }: { title?: string }) {
  return <div className="rounded-[1.5rem] border border-dashed border-cocoa/20 bg-cream/70 p-5 text-center"><p className="font-black text-navy">{title}</p><p className="mt-2 text-sm leading-6 text-charcoal/65">{emptyMessage}</p></div>;
}

export default function DogProfilePage() {
  const dog = profileDog;

  return <>
    <Section eyebrow="Bark Booth identity" title="Who is this dog?">
      <Card className="overflow-hidden bg-gradient-to-br from-white via-cream to-biscuit/60">
        <div className="grid gap-7 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="relative">
            <PawAvatar label={`${dog.name} official profile photo`} className="min-h-[340px] text-7xl" />
            <div className="absolute left-5 top-5 rounded-full bg-cocoa px-4 py-2 text-sm font-black text-white shadow-soft">Official profile photo</div>
            <div className="absolute bottom-5 left-5 rounded-full bg-white/95 px-4 py-2 text-sm font-black text-cocoa shadow-soft">{dog.barkBoothNumber}</div>
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-cocoa">● {dog.status}</span>
              <span className="rounded-full bg-skysoft px-4 py-2 text-sm font-black text-cocoa">{visibility}</span>
              <span className="rounded-full bg-pink px-4 py-2 text-sm font-black text-white">{dogRole}</span>
            </div>
            <h1 className="mt-4 text-6xl font-black tracking-tight text-navy md:text-8xl">{dog.name}</h1>
            <p className="mt-3 text-2xl font-black text-cocoa">{dog.breed || "Mixed Breed / Unknown"}</p>
            <p className="mt-2 text-base font-bold text-charcoal/65">{attributionLabel}: {attributionValue} · {dog.county}</p>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-charcoal/75">{dog.bio}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {identityRows.map(([label, value]) => <div key={label} className="rounded-2xl bg-white/85 p-4 shadow-sm"><p className="text-xs font-black uppercase tracking-widest text-pink">{label}</p><p className="mt-1 font-black text-navy">{value}</p></div>)}
            </div>
          </div>
        </div>
      </Card>
    </Section>

    <Section eyebrow="1. Overview" title="The permanent identity record">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-gradient-to-br from-navy to-cocoa text-white"><p className="text-sm font-black uppercase tracking-[0.25em] text-white/60">Bark Booth Registry</p><h3 className="mt-3 text-4xl font-black">{dog.name}</h3><p className="mt-2 text-2xl font-black text-biscuit">{dog.barkBoothNumber}</p><p className="mt-5 leading-7 text-white/75">A stable public profile for identity, history, care notes, memories, and optional achievements—not a temporary competition entry.</p></Card>
        <Card><h3 className="text-2xl font-black text-navy">About {dog.name}</h3><div className="mt-4 grid gap-3 sm:grid-cols-2">{overviewRows.map(([label, value]) => <div key={label} className="rounded-2xl bg-lightgrey p-4"><p className="text-xs font-black uppercase tracking-widest text-pink">{label}</p><p className="mt-1 font-bold text-charcoal/75">{value}</p></div>)}</div></Card>
      </div>
      <Card className="mt-5"><h3 className="text-2xl font-black text-navy">Personality and daily life</h3><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{aboutRows.map(([label, value]) => <div key={label} className="rounded-2xl bg-lightgrey p-4"><p className="text-xs font-black uppercase tracking-widest text-pink">{label}</p><p className="mt-1 font-bold text-charcoal/75">{value}</p></div>)}</div></Card>
    </Section>

    <Section eyebrow="2. Life Journey" title="A timeline that can grow for life">
      <div className="relative space-y-4 before:absolute before:left-7 before:top-4 before:h-[calc(100%-2rem)] before:w-1 before:rounded-full before:bg-biscuit md:before:left-1/2">
        {dog.timeline.map((item, index) => <div key={item.title} className={`relative grid gap-4 md:grid-cols-2 ${index % 2 ? "md:[&>div]:col-start-2" : ""}`}><Card className="ml-16 md:ml-0"><span className="absolute left-2 top-5 grid h-12 w-12 place-items-center rounded-full bg-white text-2xl shadow-soft ring-4 ring-cream md:left-1/2 md:-translate-x-1/2">{item.icon}</span><p className="text-xs font-black uppercase tracking-[0.2em] text-pink">{item.date} · {item.type}</p><h3 className="mt-2 text-2xl font-black text-navy">{item.title}</h3><p className="mt-2 leading-7 text-charcoal/70">{item.story}</p></Card></div>)}
      </div>
    </Section>

    <Section eyebrow="3. Achievements" title="Awards are part of the story, not the whole story"><div className="grid gap-5 lg:grid-cols-[1fr_1fr]"><Card><h3 className="text-2xl font-black text-navy">Badges and rosettes</h3><div className="mt-4 flex flex-wrap gap-3">{dog.achievements.length ? dog.achievements.map(item => <span key={item} className="rounded-full bg-gradient-to-br from-pink to-terracotta px-4 py-3 text-sm font-black text-white shadow-soft">🏅 {item}</span>) : <EmptyState />}</div></Card><Card><h3 className="text-2xl font-black text-navy">Milestones</h3><div className="mt-4 grid gap-3 sm:grid-cols-2">{dog.milestones.map((milestone, index) => <div key={milestone} className="rounded-2xl bg-biscuit/60 p-4"><Rosette label={`${index + 1}`} className={index < 3 ? "bg-amber-300" : "bg-skysoft"} /><p className="mt-3 font-black text-navy">{milestone}</p></div>)}</div></Card></div></Section>

    <Section eyebrow="4. Competitions" title="Competition history"><div className="grid gap-3">{dog.history.length ? dog.history.map(entry => <Card key={`${entry.competition}-${entry.date}`} className="grid gap-3 md:grid-cols-[1.1fr_0.8fr_0.6fr_0.6fr_0.7fr_0.8fr] md:items-center"><h3 className="text-xl font-black text-navy">{entry.competition}</h3><p className="font-bold text-charcoal/70">{entry.className}</p><p className="font-black text-pink">{entry.placement}</p><p className="text-sm font-bold text-charcoal/60">{entry.date}</p><p className="font-black text-cocoa">{entry.points}</p><p className="rounded-full bg-lightgrey px-4 py-2 text-sm font-black text-cocoa">{entry.result}</p></Card>) : <EmptyState />}</div></Section>

    <Section eyebrow="5. Health & Care" title="Care notes and wellness placeholders"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{dog.healthSummary.map(item => <Card key={item.label}><p className="text-sm font-black uppercase tracking-widest text-terracotta">{item.label}</p><h3 className="mt-2 text-2xl font-black text-navy">{item.value}</h3><p className="mt-2 text-sm text-charcoal/65">{item.detail}</p></Card>)}</div></Section>

    <Section eyebrow="6. Documents" title="Linked records and reference notes"><div className="grid gap-4 md:grid-cols-3">{documentRows.map(([label, value]) => <Card key={label}><p className="text-sm font-black uppercase tracking-widest text-terracotta">{label}</p><h3 className="mt-2 text-xl font-black text-navy">{value}</h3><p className="mt-2 text-sm text-charcoal/65">Mock profile data only. No live verification is connected.</p></Card>)}</div></Section>

    <Section eyebrow="7. Family" title="Guardian, breeder, rescue, and family links"><div className="grid gap-4 md:grid-cols-3"><Card><p className="text-sm font-black uppercase tracking-widest text-terracotta">Guardian</p><h3 className="mt-2 text-2xl font-black text-navy">{attributionValue}</h3><p className="mt-2 text-sm text-charcoal/65">Attribution currently comes from the existing mock owner username.</p></Card><Card><p className="text-sm font-black uppercase tracking-widest text-terracotta">Breeder / rescue</p><EmptyState /></Card><Card><p className="text-sm font-black uppercase tracking-widest text-terracotta">Family tree</p><EmptyState /></Card></div></Section>

    <Section eyebrow="8. Memories" title="Photos and moments worth keeping"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{dog.gallery.length ? dog.gallery.map(photo => <Card key={photo.title} className="p-3"><div className="grid aspect-[4/5] place-items-center rounded-[1.5rem] bg-gradient-to-br from-lightgrey to-biscuit text-center text-4xl">📷</div><h3 className="mt-3 text-lg font-black text-navy">{photo.title}</h3><p className="text-sm text-charcoal/60">{photo.caption}</p></Card>) : <EmptyState />}</div></Section>
  </>;
}
