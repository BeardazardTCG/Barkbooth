import { tricksClasses, tricksCriteria } from "@/lib/data";
import { Card, Section } from "@/components/ui";

export default function TricksAndTailsPage() {
  return <>
    <Section eyebrow="Tricks & Tails" title="Short video competitions for kind training wins"><div className="grid gap-4 md:grid-cols-2"><Card><h3 className="text-2xl font-black text-navy">Max video length: 20 seconds</h3><p className="mt-2 text-charcoal/65">Mock upload journey only; no real videos are submitted or stored.</p></Card><Card><h3 className="text-2xl font-black text-navy">Positive reinforcement only</h3><p className="mt-2 text-charcoal/65">Confidence, comfort, and enthusiasm matter as much as the finished trick.</p></Card></div><Card className="mt-4 border-pink/40 bg-pink/10"><h3 className="text-2xl font-black text-navy">Welfare rule</h3><p className="mt-2 text-lg font-black text-charcoal/75">Unsafe practices or aversive methods are disqualified.</p></Card></Section>
    <Section eyebrow="Example classes" title="From simple skills to freestyle"><div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">{tricksClasses.map(className => <Card key={className}><p className="text-3xl">🎥</p><h3 className="mt-3 text-2xl font-black text-navy">{className}</h3><button type="button" className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-black text-cocoa shadow-soft">Entry preview</button></Card>)}</div></Section>
    <Section eyebrow="Judging" title="Welfare-first video criteria"><div className="grid gap-4 md:grid-cols-4">{tricksCriteria.map(item => <Card key={item.label}><p className="text-3xl font-black text-pink">{item.value}</p><h3 className="mt-2 font-black text-navy">{item.label}</h3></Card>)}</div></Section>
  </>;
}
