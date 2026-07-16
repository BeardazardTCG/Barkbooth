import Link from "next/link";
import { galleryGroups } from "@/lib/data";
import { Card, PawAvatar, Rosette, Section } from "@/components/ui";

export default function WinnersPage() {
  return <>
    <Section eyebrow="Profile achievements" title="Recent achievements added to Bark Booth profiles">
      <Card><p className="text-lg leading-8 text-charcoal/70">This gallery is a static preview of optional activity outcomes. Each result is framed as a badge, rosette, memory, or record that can sit on a dog’s permanent profile.</p><p className="mt-3 text-sm font-bold text-charcoal/55">Filter tabs are visual mock controls only. Dog profile links route to the sample profile page.</p></Card>
      <div className="mt-4 flex flex-wrap gap-2">{galleryGroups.map(group => <span key={group.tab} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-navy shadow-soft">{group.tab}</span>)}</div>
    </Section>
    {galleryGroups.map(group => <Section key={group.tab} eyebrow={group.tab} title={`${group.tab} as profile records`}><div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">{group.items.map((w, i) => <Card key={`${group.tab}-${w.dog}-${i}`}><PawAvatar label={w.dog} /><Rosette label={w.place} className={w.ribbon} /><h3 className="mt-2 text-2xl font-bold text-navy">{w.dog}</h3><p className="font-bold text-info">{w.className}</p><p className="mt-2 text-charcoal/65">{w.note}</p><p className="mt-3 rounded-2xl bg-lightgrey p-3 text-sm font-bold text-navy">Saved as an optional profile achievement</p><Link href="/dog-profile" className="mt-4 inline-flex rounded-full bg-navy px-4 py-2 text-sm font-bold text-white">View dog profile</Link></Card>)}</div></Section>)}
  </>;
}
