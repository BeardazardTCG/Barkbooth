import Link from "next/link";
import { profileCards } from "@/lib/data";
import { ButtonLink, Card, PawAvatar, Section } from "@/components/ui";

const filters = ["All roles", "Active", "Rescue", "Retired", "Memorial", "Available for Adoption"];

export default function ProfilesPage() {
  const memorialDog = profileCards.find(dog => dog.status === "Rainbow Bridge");

  return <>
    <Section eyebrow="Bark Booth Registry" title="Search the Bark Booth Registry.">
      <Card className="bg-gradient-to-br from-white via-offwhite to-skysoft/60">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-lg leading-8 text-charcoal/70">This early registry view shows example canine identities. Live public registry search will expand as more Bark Booth Identities are registered.</p>
            <label className="mt-5 block text-sm font-bold text-navy">Dog name or Bark Booth number<input placeholder="Try Mabel or BB-000001" className="mt-2 w-full rounded-2xl border border-navy/10 bg-white px-4 py-3 font-bold text-charcoal" /></label>
            <p className="mt-2 text-sm font-bold text-charcoal/55">Search and filters are shown as a registry preview while live public search grows over time.</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end"><ButtonLink href="/register-dog">Register Your Dog</ButtonLink><ButtonLink href="/dog-profile" variant="secondary">View Example Identity</ButtonLink></div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">{filters.map(filter => <span key={filter} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-navy shadow-sm">{filter}</span>)}</div>
      </Card>
    </Section>

    <Section eyebrow="Public identity cards" title="Every card starts with identity, status, and latest record">
      <Card className="mb-5"><p className="text-sm leading-6 text-charcoal/70">Information and documents shown on Bark Booth may be supplied by the account holder unless specifically marked as verified. Private documents are not publicly exposed.</p></Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{profileCards.map(dog => <Card key={dog.profileNumber} className={`flex flex-col ${dog.status === "Rainbow Bridge" ? "bg-gradient-to-br from-white to-skysoft/40" : ""}`}>
        <PawAvatar label={`${dog.name} profile image`} className="text-5xl" />
        <div className="mt-4 flex-1">
          <div className="flex flex-wrap gap-2"><span className="rounded-full bg-lightgrey px-3 py-2 text-xs font-bold text-navy">{dog.profileNumber}</span><span className="rounded-full bg-skysoft px-3 py-2 text-xs font-bold text-navy">{dog.status}</span>{dog.rescueBadge && <span className="rounded-full bg-verified/10 px-3 py-2 text-xs font-bold text-navy">{dog.rescueBadge}</span>}{dog.memorial && <span className="rounded-full bg-skysoft px-3 py-2 text-xs font-bold text-navy">Memorial</span>}</div>
          <h3 className="mt-3 text-3xl font-bold text-navy">{dog.name}</h3>
          <p className="mt-1 font-bold text-info">{dog.breed}</p>{dog.kennelClubName && <p className="mt-1 text-sm font-bold text-charcoal/60">KC name: {dog.kennelClubName}</p>}<div className="mt-2 flex flex-wrap gap-2">{dog.dogTypes?.map((type) => <span key={type} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-navy">{type}</span>)}</div>
          <p className="mt-1 text-sm font-bold text-charcoal/60">📍 {dog.county}</p>
          {dog.rescueName && <p className="mt-3 rounded-2xl bg-verified/10 p-3 text-sm font-bold text-charcoal/70">Rescue: {dog.rescueName}</p>}
          {dog.memorial && <div className="mt-3 rounded-2xl bg-white/70 p-4"><p className="font-bold text-navy">{dog.memorial.heading}</p><p className="mt-1 text-sm text-charcoal/65">{dog.memorial.birthDate} – {dog.memorial.passingDate}</p><p className="mt-2 text-sm leading-6 text-charcoal/70">{dog.memorial.message}</p></div>}
          <div className="mt-4 rounded-2xl bg-lightgrey p-3 text-sm font-bold text-navy">Latest identity record: {dog.latestAchievement}</div>
          <p className="mt-2 text-xs font-bold text-charcoal/55">Rosettes: {dog.rosetteCount} · shown as one optional achievement type, not the whole identity.</p>
        </div>
        {dog.adoptionCta ? <button type="button" className="mt-5 rounded-full bg-verified px-5 py-3 text-center text-sm font-bold text-white shadow-soft">{dog.adoptionCta}</button> : <Link href="/dog-profile" className="mt-5 rounded-full bg-navy px-5 py-3 text-center text-sm font-bold text-white shadow-soft">View example identity</Link>}
      </Card>)}</div>
    </Section>

    <Section eyebrow="Memorial example" title="Rainbow Bridge profiles stay calm and respectful">
      <Card className="bg-gradient-to-br from-white to-skysoft/50">
        <div className="grid gap-5 md:grid-cols-[180px_1fr]"><PawAvatar label="Daisy memorial photos" /><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-info">In Loving Memory</p><h3 className="mt-2 text-4xl font-bold text-navy">Daisy · BB-000042</h3><p className="mt-2 font-bold text-charcoal/65">3 March 2012 – 18 November 2025</p><p className="mt-4 leading-8 text-charcoal/70">A peaceful memorial passport with selected achievements, selected photos, and one family message — never a social feed.</p><div className="mt-4 flex flex-wrap gap-2">{memorialDog?.memorial?.achievements.map(achievement => <span key={achievement} className="rounded-full bg-white px-3 py-2 text-sm font-bold text-navy">{achievement}</span>)}</div><div className="mt-4 grid gap-2 sm:grid-cols-3">{memorialDog?.memorial?.photos.map(photo => <span key={photo} className="rounded-2xl bg-white/70 p-3 text-sm font-bold text-navy">📷 {photo}</span>)}</div></div></div>
      </Card>
    </Section>
  </>;
}
