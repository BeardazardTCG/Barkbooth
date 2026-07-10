import { tricksClasses, tricksCriteria } from "@/lib/data";
import { Card, Section } from "@/components/ui";

export default function TricksAndTailsPage() {
  return <>
    <Section eyebrow="Tricks & Tails activity module" title="Kind training moments for a dog’s profile"><div className="grid gap-4 md:grid-cols-2"><Card><h3 className="text-2xl font-bold text-navy">Profile-first training records</h3><p className="mt-2 text-charcoal/65">Short clips can become optional training chapters, not pressure to perform.</p></Card><Card><h3 className="text-2xl font-bold text-navy">Positive reinforcement only</h3><p className="mt-2 text-charcoal/65">Confidence, comfort, and enthusiasm matter as much as the finished trick.</p></Card></div><Card className="mt-4 border-pink/40 bg-rosette/10"><h3 className="text-2xl font-bold text-navy">Welfare rule</h3><p className="mt-2 text-lg font-bold text-charcoal/75">Unsafe practices or aversive methods are not welcome. Mock upload journey only; no real videos are submitted or stored.</p></Card></Section>
    <Section eyebrow="Example classes" title="From simple skills to freestyle profile chapters"><div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">{tricksClasses.map(className => <Card key={className}><p className="text-3xl">🎥</p><h3 className="mt-3 text-2xl font-bold text-navy">{className}</h3><p className="mt-2 text-sm text-charcoal/65">Optional training activity for the dog’s profile timeline.</p><button type="button" className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-bold text-navy shadow-soft">Activity preview</button></Card>)}</div></Section>
    <Section eyebrow="Judging" title="Welfare-first video criteria"><div className="grid gap-4 md:grid-cols-4">{tricksCriteria.map(item => <Card key={item.label}><p className="text-3xl font-bold text-rosette">{item.value}</p><h3 className="mt-2 font-bold text-navy">{item.label}</h3></Card>)}</div></Section>
  </>;
}
