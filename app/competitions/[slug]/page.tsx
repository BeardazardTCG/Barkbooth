import { EmptyState } from "@/components/empty-state";
import { ButtonLink, Section } from "@/components/ui";

export default function CompetitionDetailPage() {
  return <Section eyebrow="Competitions" title="Competition unavailable"><EmptyState title="This competition is not open">Only published, operational competitions can be shown. Return to the competition list for current opportunities.<span className="mt-5 block"><ButtonLink href="/competitions">View competitions</ButtonLink></span></EmptyState></Section>;
}
