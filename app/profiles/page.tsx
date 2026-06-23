import Link from "next/link";
import { profileCards } from "@/lib/data";
import { Card, PawAvatar, Section } from "@/components/ui";

export default function ProfilesPage() {
  return <Section eyebrow="Dog profiles" title="Browse public scrapbook profiles"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{profileCards.map(dog => <Card key={dog.name} className="flex flex-col"><PawAvatar label={`${dog.name} profile image`} className="text-5xl" /><div className="mt-4 flex-1"><h3 className="text-3xl font-black text-navy">{dog.name}</h3><p className="mt-1 font-bold text-pink">{dog.breed}</p><p className="mt-1 text-sm font-bold text-charcoal/60">📍 {dog.county}</p><div className="mt-4 grid grid-cols-2 gap-2 text-sm font-black"><span className="rounded-2xl bg-biscuit/60 p-3">🏵️ {dog.rosetteCount} rosettes</span><span className="rounded-2xl bg-lightgrey p-3">✨ {dog.latestAchievement}</span></div></div><Link href="/dog-profile" className="mt-5 rounded-full bg-cocoa px-5 py-3 text-center text-sm font-black text-white shadow-soft">View scrapbook</Link></Card>)}</div></Section>;
}
