import { calendarMonths } from "@/lib/data";
import { Card, Section } from "@/components/ui";

export default function CalendarPupsPage() {
  return <>
    <Section eyebrow="Calendar Pups activity module" title="A seasonal memory that can become a profile chapter"><Card><p className="text-lg leading-8 text-charcoal/70">Calendar Pups is an optional frontend-only activity preview. Owners could choose a month that suits their dog’s story, then save a seasonal badge or calendar memory to the dog’s Bark Booth profile later.</p><p className="mt-3 font-bold text-navy">No real uploads, judging, purchases, or calendar fulfilment are active.</p></Card></Section>
    <Section eyebrow="Choose a month" title="Twelve seasonal profile-memory cards"><div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">{calendarMonths.map(month => <Card key={month}><div className="grid h-24 place-items-center rounded-[1.5rem] bg-gradient-to-br from-skysoft to-white text-4xl">📅</div><h3 className="mt-4 text-2xl font-bold text-navy">{month}</h3><p className="mt-2 text-sm text-charcoal/65">Optional calendar activity for a profile memory.</p><button type="button" className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-bold text-navy shadow-soft">Select month mock</button></Card>)}</div></Section>
    <Section eyebrow="Profile records" title="Possible badges and calendar memories"><div className="grid gap-4 md:grid-cols-3"><Card><h3 className="text-2xl font-bold text-navy">Monthly memory</h3><p className="mt-3 text-charcoal/65">Seasonal profile chapter and optional badge.</p></Card><Card><h3 className="text-2xl font-bold text-navy">Cover Star</h3><p className="mt-3 text-charcoal/65">Special profile record for the annual mock cover selection.</p></Card><Card><h3 className="text-2xl font-bold text-navy">Shortlist</h3><p className="mt-3 text-charcoal/65">A gentle finalist note that can sit in the dog’s timeline.</p></Card></div></Section>
  </>;
}
