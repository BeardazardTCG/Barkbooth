import Link from "next/link";
import { profileCards } from "@/lib/data";
import { ButtonLink, Card, PawAvatar, Section } from "@/components/ui";

const filters = ["All roles", "Active", "Rescue", "Retired", "Memorial", "Available for Adoption"];

export default function ProfilesPage() {
  const memorialDog = profileCards.find(dog => dog.status === "Rainbow Bridge");

  return <>
    <Section eyebrow="Bark Booth Registry" title="Search the Bark Booth Registry.">
      <Card className="bg-gradient-to-br from-white via-cream to-skysoft/50">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-lg leading-8 text-charcoal/70">This is a public profile registry preview using static mock data. It shows how owners could look up a dog by name or Bark Booth number while keeping the dog’s permanent profile as the foundation.</p>
            <label className="mt-5 block text-sm font-black text-navy">Dog name or Bark Booth number<input placeholder="Try Mabel or BB-000001" className="mt-2 w-full rounded-2xl border border-cocoa/10 bg-white px-4 py-3 font-bold text-charcoal" /></label>
            <p className="mt-2 text-sm font-bold text-charcoal/55">Search and filters are frontend preview controls only; no live registry lookup is connected.</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end"><ButtonLink href="/register-dog">Register Your Dog</ButtonLink><ButtonLink href="/dog-profile" variant="secondary">View Example Profile</ButtonLink></div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">{filters.map(filter => <span key={filter} className="rounded-full bg-white px-4 py-2 text-sm font-black text-cocoa shadow-sm">{filter}</span>)}</div>
      </Card>
    </Section>

    <Section eyebrow="Public profile cards" title="Every card starts with identity, status, and latest chapter">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{profileCards.map(dog => <Card key={dog.profileNumber} className={`flex flex-col ${dog.status === "Rainbow Bridge" ? "bg-gradient-to-br from-white to-skysoft/40" : ""}`}>
        <PawAvatar label={`${dog.name} profile image`} className="text-5xl" />
        <div className="mt-4 flex-1">
          <div className="flex flex-wrap gap-2"><span className="rounded-full bg-lightgrey px-3 py-2 text-xs font-black text-cocoa">{dog.profileNumber}</span><span className="rounded-full bg-biscuit px-3 py-2 text-xs font-black text-cocoa">{dog.status}</span>{dog.rescueBadge && <span className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-black text-cocoa">🐾 {dog.rescueBadge}</span>}{dog.memorial && <span className="rounded-full bg-skysoft px-3 py-2 text-xs font-black text-cocoa">🌈 Memorial</span>}</div>
          <h3 className="mt-3 text-3xl font-black text-navy">{dog.name}</h3>
          <p className="mt-1 font-bold text-pink">{dog.breed}</p>
          <p className="mt-1 text-sm font-bold text-charcoal/60">📍 {dog.county}</p>
          {dog.rescueName && <p className="mt-3 rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-charcoal/70">Rescue: {dog.rescueName}</p>}
          {dog.memorial && <div className="mt-3 rounded-2xl bg-white/70 p-4"><p className="font-black text-navy">{dog.memorial.heading}</p><p className="mt-1 text-sm text-charcoal/65">{dog.memorial.birthDate} – {dog.memorial.passingDate}</p><p className="mt-2 text-sm leading-6 text-charcoal/70">{dog.memorial.message}</p></div>}
          <div className="mt-4 rounded-2xl bg-lightgrey p-3 text-sm font-black text-cocoa">Latest profile chapter: {dog.latestAchievement}</div>
          <p className="mt-2 text-xs font-bold text-charcoal/55">Rosettes: {dog.rosetteCount} · shown as one optional achievement type, not the whole profile.</p>
        </div>
        {dog.adoptionCta ? <button type="button" className="mt-5 rounded-full bg-emerald-600 px-5 py-3 text-center text-sm font-black text-white shadow-soft">{dog.adoptionCta} mock</button> : <Link href="/dog-profile" className="mt-5 rounded-full bg-cocoa px-5 py-3 text-center text-sm font-black text-white shadow-soft">View example profile</Link>}
      </Card>)}</div>
    </Section>

    <Section eyebrow="Memorial example" title="Rainbow Bridge profiles stay calm and respectful">
      <Card className="bg-gradient-to-br from-white to-skysoft/50">
        <div className="grid gap-5 md:grid-cols-[180px_1fr]"><PawAvatar label="Daisy memorial photos" /><div><p className="text-sm font-black uppercase tracking-[0.2em] text-terracotta">In Loving Memory</p><h3 className="mt-2 text-4xl font-black text-navy">Daisy · BB-000042</h3><p className="mt-2 font-bold text-charcoal/65">3 March 2012 – 18 November 2025</p><p className="mt-4 leading-8 text-charcoal/70">A peaceful memorial passport with selected achievements, selected photos, and one family message — never a social feed.</p><div className="mt-4 flex flex-wrap gap-2">{memorialDog?.memorial?.achievements.map(achievement => <span key={achievement} className="rounded-full bg-white px-3 py-2 text-sm font-black text-cocoa">{achievement}</span>)}</div><div className="mt-4 grid gap-2 sm:grid-cols-3">{memorialDog?.memorial?.photos.map(photo => <span key={photo} className="rounded-2xl bg-white/70 p-3 text-sm font-black text-cocoa">📷 {photo}</span>)}</div></div></div>
      </Card>
    </Section>
  </>;
}
