import { peopleChoiceCards } from "@/lib/data";
import { Card, PawAvatar, Section } from "@/components/ui";

export default function PeoplesChoicePoochPage() {
  return <>
    <Section eyebrow="People’s Choice Pooch" title="A gentle recognition badge for shortlisted profile moments">
      <div className="grid gap-4 md:grid-cols-4">{["Optional recognition after judged placements", "One calm shortlist period", "Selected entries can receive a profile badge", "No likes, followers, comments, or social spotlight in this mock"].map(item => <Card key={item}><h3 className="text-xl font-black text-navy">{item}</h3></Card>)}</div>
      <Card className="mt-4 border-terracotta/30 bg-terracotta/10"><p className="font-black text-navy">These controls are non-functional mock cards only. People’s Choice is framed as light recognition, not a popularity contest.</p></Card>
    </Section>
    <Section eyebrow="Recognition preview" title="Mock shortlisted profile moments"><div className="grid gap-4 md:grid-cols-3">{peopleChoiceCards.map(card => <Card key={card.dog}><PawAvatar label={card.dog} /><h3 className="mt-4 text-2xl font-black text-navy">{card.dog}</h3><p className="font-bold text-pink">{card.className}</p><p className="mt-2 text-charcoal/65">{card.note}</p><button type="button" className="mt-4 rounded-full bg-cocoa px-5 py-3 text-sm font-black text-white">Preview recognition badge</button></Card>)}</div></Section>
  </>;
}
