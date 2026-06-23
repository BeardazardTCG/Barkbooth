import { calendarMonths } from "@/lib/data";
import { Card, Section } from "@/components/ui";

export default function CalendarPupsPage() {
  return <>
    <Section eyebrow="Calendar Pups" title="An annual calendar concept with one winner for every month"><Card><p className="text-lg leading-8 text-charcoal/70">Owners choose the month they want to enter. Each month has one winner, and the annual set also crowns one overall Cover Star in this frontend-only preview.</p></Card></Section>
    <Section eyebrow="Choose a month" title="Twelve seasonal month cards"><div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">{calendarMonths.map(month => <Card key={month}><div className="grid h-24 place-items-center rounded-[1.5rem] bg-gradient-to-br from-skysoft to-biscuit text-4xl">📅</div><h3 className="mt-4 text-2xl font-black text-navy">{month}</h3><button type="button" className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-black text-cocoa shadow-soft">Select month mock</button></Card>)}</div></Section>
    <Section eyebrow="Prizes" title="Monthly winners, Cover Star, and runner-ups"><div className="grid gap-4 md:grid-cols-3"><Card><h3 className="text-2xl font-black text-navy">Monthly winners</h3><p className="mt-3 text-charcoal/65">Free calendar, seasonal rosette, and profile badge.</p></Card><Card><h3 className="text-2xl font-black text-navy">Cover Star</h3><p className="mt-3 text-charcoal/65">Cover feature, premium prize bundle, and special profile badge.</p></Card><Card><h3 className="text-2xl font-black text-navy">Runner-ups</h3><p className="mt-3 text-charcoal/65">Calendar discounts.</p></Card></div></Section>
  </>;
}
