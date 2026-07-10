import { faqs } from "@/lib/data";
import { Card, Section } from "@/components/ui";

export default function FAQPage() { return <Section eyebrow="Help" title="Frequently asked questions"><div className="grid gap-4">{faqs.map(([q, a]) => <Card key={q}><h3 className="text-xl font-bold">{q}</h3><p className="mt-2 text-navy/65">{a}</p></Card>)}</div></Section>; }
