import { profileDog } from "@/lib/data";
import { Card, PawAvatar, Rosette, Section } from "@/components/ui";

const statStyles = ["bg-amber-100", "bg-pink-100", "bg-skysoft", "bg-emerald-100", "bg-violet-100", "bg-orange-100"];
const passportRows = [
  ["Bark Booth No.", profileDog.barkBoothNumber],
  ["Breed", profileDog.breed],
  ["DOB", profileDog.dateOfBirth],
  ["Gotcha Day", profileDog.gotchaDay],
  ["Microchip", profileDog.microchip],
  ["Kennel Club", profileDog.kennelClub],
  ["DNA Tested", profileDog.dnaTested],
  ["Health Tested", profileDog.healthTested]
];
const aboutRows = [
  ["Personality", profileDog.about.personality],
  ["Favourite toy", profileDog.about.favouriteToy],
  ["Favourite food", profileDog.about.favouriteFood],
  ["Favourite activities", profileDog.about.favouriteActivities],
  ["Tricks known", profileDog.about.tricksKnown],
  ["House trained", profileDog.about.houseTrained]
];

export default function DogProfilePage() {
  const dog = profileDog;

  return <>
    <Section eyebrow="Dog Passport" title={`${dog.name}'s lifetime Bark Booth profile`}>
      <Card className="overflow-hidden bg-gradient-to-br from-white via-cream to-biscuit/60">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative">
            <PawAvatar label={`${dog.name} profile photo`} className="min-h-[320px] text-7xl" />
            <div className="absolute left-5 top-5 rounded-full bg-cocoa px-4 py-2 text-sm font-black text-white shadow-soft">{dog.barkBoothNumber}</div>
            <div className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-sm font-black text-cocoa shadow-soft">📸 Official profile photo</div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-cocoa">● {dog.status}</span>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-pink shadow-sm">{dog.breed}</span>
            </div>
            <h1 className="mt-3 text-5xl font-black tracking-tight text-navy md:text-7xl">{dog.name}</h1>
            <div className="mt-4 grid gap-2 text-sm font-black text-cocoa sm:grid-cols-2">
              <span className="rounded-full bg-white px-4 py-2 shadow-sm">🎂 {dog.age}</span>
              <span className="rounded-full bg-white px-4 py-2 shadow-sm">📍 {dog.county}</span>
              <span className="rounded-full bg-white px-4 py-2 shadow-sm">👤 @{dog.ownerUsername}</span>
              <span className="rounded-full bg-white px-4 py-2 shadow-sm">🗓️ Joined {dog.joinedBarkBooth}</span>
            </div>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-charcoal/75">{dog.bio}</p>
            <button type="button" className="mt-6 rounded-full bg-cocoa px-6 py-3 font-black text-white shadow-soft">Share Profile</button>
          </div>
        </div>
      </Card>
    </Section>

    <Section eyebrow="Premium record" title="Dog Passport card">
      <Card className="bg-gradient-to-br from-navy to-cocoa text-white">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/20 pb-5"><div><p className="text-sm font-black uppercase tracking-[0.25em] text-white/60">Bark Booth Passport</p><h3 className="mt-2 text-4xl font-black">{dog.name}</h3></div><span className="rounded-2xl bg-white px-4 py-3 font-black text-cocoa">{dog.barkBoothNumber}</span></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{passportRows.map(([label, value]) => <div key={label} className="rounded-2xl bg-white/10 p-4"><p className="text-xs font-black uppercase tracking-widest text-white/50">{label}</p><p className="mt-1 font-bold">{value}</p></div>)}</div>
      </Card>
    </Section>

    <Section eyebrow="Public modules" title="A lifelong profile, not a social feed">
      <div className="grid gap-5 lg:grid-cols-2">
        <Card><h3 className="text-2xl font-black text-navy">About My Dog</h3><div className="mt-4 grid gap-3">{aboutRows.map(([label, value]) => <div key={label} className="rounded-2xl bg-lightgrey p-4"><p className="text-xs font-black uppercase tracking-widest text-pink">{label}</p><p className="mt-1 font-bold text-charcoal/75">{value}</p></div>)}</div></Card>
        <Card><h3 className="text-2xl font-black text-navy">Achievements</h3><div className="mt-4 flex flex-wrap gap-3">{dog.achievements.map(item => <span key={item} className="rounded-full bg-gradient-to-br from-pink to-terracotta px-4 py-3 text-sm font-black text-white shadow-soft">🏅 {item}</span>)}</div><div className="mt-5 grid grid-cols-2 gap-3">{dog.stats.map((stat, index) => <div key={stat.label} className={`rounded-2xl p-4 ${statStyles[index]}`}><p className="text-3xl font-black text-navy">{stat.value}</p><p className="text-xs font-black uppercase tracking-widest text-cocoa/65">{stat.label}</p></div>)}</div></Card>
      </div>
    </Section>

    <Section eyebrow="Health Summary" title="Care notes and wellness placeholders"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{dog.healthSummary.map(item => <Card key={item.label}><p className="text-sm font-black uppercase tracking-widest text-terracotta">{item.label}</p><h3 className="mt-2 text-2xl font-black text-navy">{item.value}</h3><p className="mt-2 text-sm text-charcoal/65">{item.detail}</p></Card>)}</div></Section>

    <Section eyebrow="Memory Book" title="The journey, one milestone at a time">
      <div className="relative space-y-4 before:absolute before:left-7 before:top-4 before:h-[calc(100%-2rem)] before:w-1 before:rounded-full before:bg-biscuit md:before:left-1/2">
        {dog.timeline.map((item, index) => <div key={item.title} className={`relative grid gap-4 md:grid-cols-2 ${index % 2 ? "md:[&>div]:col-start-2" : ""}`}><Card className="ml-16 md:ml-0"><span className="absolute left-2 top-5 grid h-12 w-12 place-items-center rounded-full bg-white text-2xl shadow-soft ring-4 ring-cream md:left-1/2 md:-translate-x-1/2">{item.icon}</span><p className="text-xs font-black uppercase tracking-[0.2em] text-pink">{item.date} · {item.type}</p><h3 className="mt-2 text-2xl font-black text-navy">{item.title}</h3><p className="mt-2 leading-7 text-charcoal/70">{item.story}</p></Card></div>)}
      </div>
    </Section>

    <Section eyebrow="Gallery" title="Profile photo and three showcase photos"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{dog.gallery.map(photo => <Card key={photo.title} className="p-3"><div className="grid aspect-[4/5] place-items-center rounded-[1.5rem] bg-gradient-to-br from-lightgrey to-biscuit text-center text-4xl">📷</div><h3 className="mt-3 text-lg font-black text-navy">{photo.title}</h3><p className="text-sm text-charcoal/60">{photo.caption}</p></Card>)}</div></Section>

    <Section eyebrow="Competition Record" title="Every class adds to the official record"><div className="grid gap-3">{dog.history.map(entry => <Card key={`${entry.competition}-${entry.date}`} className="grid gap-3 md:grid-cols-[1.1fr_0.8fr_0.6fr_0.6fr_0.7fr_0.8fr] md:items-center"><h3 className="text-xl font-black text-navy">{entry.competition}</h3><p className="font-bold text-charcoal/70">{entry.className}</p><p className="font-black text-pink">{entry.placement}</p><p className="text-sm font-bold text-charcoal/60">{entry.date}</p><p className="font-black text-cocoa">{entry.points}</p><p className="rounded-full bg-lightgrey px-4 py-2 text-sm font-black text-cocoa">{entry.result}</p></Card>)}</div></Section>

    <Section eyebrow="Profile Milestones" title="A collection of firsts and proud moments"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{dog.milestones.map((milestone, index) => <Card key={milestone} className="bg-gradient-to-br from-white to-biscuit/60"><Rosette label={`${index + 1}`} className={index < 3 ? "bg-amber-300" : "bg-skysoft"} /><h3 className="mt-4 text-2xl font-black text-navy">{milestone}</h3></Card>)}</div></Section>
  </>;
}
