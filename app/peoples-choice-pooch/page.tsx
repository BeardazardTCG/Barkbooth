import { peopleChoiceCards } from "@/lib/data";
import { Card, PawAvatar, Section } from "@/components/ui";

export default function PeoplesChoicePoochPage() {
  return <>
    <Section eyebrow="People’s Choice Pooch" title="A mock community voting preview after judged placements">
      <div className="grid gap-4 md:grid-cols-4">{["Voting opens Days 26–29", "Users can vote twice per day", "Placed entries move into the People’s Choice gallery", "Prize: homepage feature, badge, and social media spotlight"].map(item => <Card key={item}><h3 className="text-xl font-black text-navy">{item}</h3></Card>)}</div>
      <Card className="mt-4 border-terracotta/30 bg-terracotta/10"><p className="font-black text-navy">No physical prize is awarded for People’s Choice Pooch. These controls are non-functional mock cards only.</p></Card>
    </Section>
    <Section eyebrow="Voting preview" title="Mock voting cards"><div className="grid gap-4 md:grid-cols-3">{peopleChoiceCards.map(card => <Card key={card.dog}><PawAvatar label={card.dog} /><h3 className="mt-4 text-2xl font-black text-navy">{card.dog}</h3><p className="font-bold text-pink">{card.className}</p><p className="mt-2 text-charcoal/65">{card.note}</p><button type="button" className="mt-4 rounded-full bg-cocoa px-5 py-3 text-sm font-black text-white">Vote mock</button></Card>)}</div></Section>
  </>;
}
