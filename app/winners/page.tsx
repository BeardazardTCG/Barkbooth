import Link from "next/link";
import { galleryGroups } from "@/lib/data";
import { Card, PawAvatar, Rosette, Section } from "@/components/ui";

export default function WinnersPage() {
  return <>
    <Section eyebrow="Winners Gallery" title="A scrapbook of recent winners across every Bark Booth format">
      <div className="flex flex-wrap gap-2">{galleryGroups.map(group => <span key={group.tab} className="rounded-full bg-white px-4 py-2 text-sm font-black text-navy shadow-soft">{group.tab}</span>)}</div>
      <p className="mt-4 text-charcoal/65">Filter tabs are visual mock controls only. Dog profile links route to the sample profile page.</p>
    </Section>
    {galleryGroups.map(group => <Section key={group.tab} eyebrow={group.tab} title={group.tab}><div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">{group.items.map((w, i) => <Card key={`${group.tab}-${w.dog}-${i}`}><PawAvatar label={w.dog} /><Rosette label={w.place} className={w.ribbon} /><h3 className="mt-2 text-2xl font-black text-navy">{w.dog}</h3><p className="font-bold text-pink">{w.className}</p><p className="mt-2 text-charcoal/65">{w.note}</p><Link href="/dog-profile" className="mt-4 inline-flex rounded-full bg-cocoa px-4 py-2 text-sm font-black text-white">View dog profile</Link></Card>)}</div></Section>)}
  </>;
}
