import { EmptyState } from "@/components/empty-state";
import { ButtonLink, Section } from "@/components/ui";

export default function WinnersPage() { return <Section eyebrow="Competition results" title="Published achievements"><EmptyState title="No results have been published">Winners, results, badges and rosettes will appear only after a real Bark Booth competition has been completed.<span className="mt-5 block"><ButtonLink href="/competitions">View competitions</ButtonLink></span></EmptyState></Section>; }
