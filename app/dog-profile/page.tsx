import { profileDog } from "@/lib/data";
import { Card, PawAvatar, Rosette, Section } from "@/components/ui";

const statStyles = ["bg-amber-100", "bg-pink-100", "bg-skysoft", "bg-emerald-100", "bg-violet-100", "bg-orange-100"];

export default function DogProfilePage() {
  const dog = profileDog;

  return <>
    <Section eyebrow="Public dog scrapbook" title={`${dog.name}'s digital scrapbook`}>
      <Card className="overflow-hidden bg-gradient-to-br from-white via-cream to-biscuit/60">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative">
            <PawAvatar label={`${dog.name} profile photo`} className="min-h-[320px] text-7xl" />
            <div className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-sm font-black text-cocoa shadow-soft">📸 Profile photo placeholder</div>
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-pink">{dog.breed}</p>
            <h1 className="mt-2 text-5xl font-black tracking-tight text-navy md:text-7xl">{dog.name}</h1>
            <div className="mt-4 flex flex-wrap gap-2 text-sm font-black text-cocoa">
              <span className="rounded-full bg-white px-4 py-2 shadow-sm">🎂 {dog.age}</span>
              <span className="rounded-full bg-white px-4 py-2 shadow-sm">📍 {dog.county}</span>
              <span className="rounded-full bg-white px-4 py-2 shadow-sm">@{dog.ownerUsername}</span>
            </div>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-charcoal/75">{dog.bio}</p>
            <button type="button" className="mt-6 rounded-full bg-cocoa px-6 py-3 font-black text-white shadow-soft">Share profile</button>
          </div>
        </div>
      </Card>
    </Section>

    <Section eyebrow="Achievement summary" title="Proud moments at a glance">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{dog.stats.map((stat, index) => <Card key={stat.label} className={statStyles[index]}><p className="text-4xl font-black text-navy">{stat.value}</p><p className="mt-2 text-sm font-black uppercase tracking-widest text-cocoa/65">{stat.label}</p></Card>)}</div>
    </Section>

    <Section eyebrow="Scrapbook timeline" title="The journey, one milestone at a time">
      <div className="relative space-y-4 before:absolute before:left-7 before:top-4 before:h-[calc(100%-2rem)] before:w-1 before:rounded-full before:bg-biscuit md:before:left-1/2">
        {dog.timeline.map((item, index) => <div key={item.title} className={`relative grid gap-4 md:grid-cols-2 ${index % 2 ? "md:[&>div]:col-start-2" : ""}`}>
          <Card className="ml-16 md:ml-0">
            <span className="absolute left-2 top-5 grid h-12 w-12 place-items-center rounded-full bg-white text-2xl shadow-soft ring-4 ring-cream md:left-1/2 md:-translate-x-1/2">{item.icon}</span>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-pink">{item.date} · {item.type}</p>
            <h3 className="mt-2 text-2xl font-black text-navy">{item.title}</h3>
            <p className="mt-2 leading-7 text-charcoal/70">{item.story}</p>
          </Card>
        </div>)}
      </div>
    </Section>

    <Section eyebrow="Gallery" title="Photo cards for every chapter">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{dog.gallery.map(photo => <Card key={photo.title} className="p-3"><div className="grid aspect-[4/5] place-items-center rounded-[1.5rem] bg-gradient-to-br from-lightgrey to-biscuit text-center text-4xl">📷</div><h3 className="mt-3 text-lg font-black text-navy">{photo.title}</h3><p className="text-sm text-charcoal/60">{photo.caption}</p></Card>)}</div>
    </Section>

    <Section eyebrow="Collectibles" title="Badges and rosettes feel earned">
      <div className="grid gap-5 lg:grid-cols-2">
        <Card><p className="text-sm font-black uppercase tracking-widest text-terracotta">Rosettes</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{dog.rosettes.map((rosette, index) => <div key={rosette.label} className="flex items-center gap-3 rounded-[1.5rem] bg-biscuit/50 p-3"><Rosette label={rosette.place} className={index === 0 ? "bg-amber-300" : index === 1 ? "bg-orange-300" : "bg-skysoft"} /><div><p className="font-black text-navy">{rosette.label}</p><p className="text-sm text-charcoal/60">{rosette.date}</p></div></div>)}</div></Card>
        <Card><p className="text-sm font-black uppercase tracking-widest text-terracotta">Badges</p><div className="mt-4 flex flex-wrap gap-3">{dog.badges.map(badge => <span key={badge} className="rounded-full border-2 border-white bg-gradient-to-br from-pink to-terracotta px-4 py-3 text-sm font-black text-white shadow-soft">🏅 {badge}</span>)}</div></Card>
      </div>
    </Section>

    <Section eyebrow="Competition history" title="Every class adds to the scrapbook">
      <div className="grid gap-3">{dog.history.map(entry => <Card key={`${entry.competition}-${entry.date}`} className="grid gap-3 md:grid-cols-[1.2fr_0.8fr_0.7fr_0.7fr_1fr] md:items-center"><h3 className="text-xl font-black text-navy">{entry.competition}</h3><p className="font-bold text-charcoal/70">{entry.className}</p><p className="font-black text-pink">{entry.placement}</p><p className="text-sm font-bold text-charcoal/60">{entry.date}</p><p className="rounded-full bg-lightgrey px-4 py-2 text-sm font-black text-cocoa">{entry.result}</p></Card>)}</div>
    </Section>
  </>;
}
