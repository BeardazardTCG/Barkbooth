import { EmptyState } from "@/components/empty-state";
import { ButtonLink, Card, Section } from "@/components/ui";

export default function CompetitionsPage() {
  return <>
    <Section eyebrow="Competitions" title="Achievements connected to a lifelong identity"><Card><p className="text-lg leading-8 text-charcoal/70">Competitions are part of the wider Bark Booth platform. Each participating dog uses their permanent identity, so genuine entries, results, badges and rosettes can become trusted chapters in that dog’s profile.</p><div className="mt-5 flex flex-wrap gap-3"><ButtonLink href="/register-dog">Register a dog</ButtonLink><ButtonLink href="/profiles" variant="secondary">Search registry</ButtonLink></div></Card></Section>
    <Section eyebrow="Open competitions" title="Current opportunities"><EmptyState title="No competitions are open">Published competitions will appear here when entry details, rules and fulfilment are ready. There are currently no entries, closing dates, fees, prizes or results to display.</EmptyState></Section>
    <Section eyebrow="How it connects" title="One record from entry to achievement"><div className="grid gap-4 md:grid-cols-3"><Card><h2 className="text-xl font-bold text-navy">Registered participants</h2><p className="mt-2 text-charcoal/65">Every entry will be associated with a real registered dog.</p></Card><Card><h2 className="text-xl font-bold text-navy">Published outcomes</h2><p className="mt-2 text-charcoal/65">Results will be shown only after an actual competition has been judged.</p></Card><Card><h2 className="text-xl font-bold text-navy">Lasting achievements</h2><p className="mt-2 text-charcoal/65">Earned badges and rosettes will remain connected to the canonical dog profile.</p></Card></div></Section>
  </>;
}
