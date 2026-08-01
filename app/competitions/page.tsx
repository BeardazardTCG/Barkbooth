import { ButtonLink, Card, Section } from "@/components/ui";
import { competitionAcceptsEntries, realEntrantCount } from "@/lib/competitions";
import { launchConfig } from "@/lib/launch-config";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";

export default async function CompetitionsPage() {
  const user = await getCurrentUser();
  const competitions = await prisma.competition.findMany({
    where: { status: { in: ["PUBLISHED", "OPEN", "CLOSED", "JUDGING", "COMPLETED"] } },
    include: { entries: { select: { status: true } } },
    orderBy: { opensAt: "desc" },
  });

  return <>
    <Section eyebrow="Free photo competitions" title="Bark Booth competitions">
      {user?.role === "ADMIN" && <div className="mb-5 flex flex-wrap gap-2"><ButtonLink href="/admin/competitions">Manage competitions</ButtonLink><ButtonLink href="/admin/competitions/new" variant="secondary">Create competition</ButtonLink></div>}<Card className="bg-gradient-to-br from-white to-skysoft/60"><p className="text-lg leading-8 text-charcoal/70">{launchConfig.copy.competition}</p></Card>
    </Section>
    <Section eyebrow="Current and completed" title="Genuine competitions">
      {competitions.length ? <div className="grid gap-5 md:grid-cols-2">{competitions.map((competition) => {
        const acceptingEntries = competitionAcceptsEntries(competition.status, competition.opensAt, competition.closesAt);
        return <Card key={competition.id}>
          <div className="flex justify-between gap-3"><div><p className="registry-label">{competition.eligibility === "UK_ONLY" ? "UK only" : "International"} · Free entry</p><h2 className="mt-2 text-2xl font-bold text-navy">{competition.title}</h2></div><span className="font-bold text-info">{realEntrantCount(competition.entries)} entries</span></div>
          <p className="mt-3 text-charcoal/70">{competition.description}</p>
          <p className="mt-3 font-bold text-navy">Prize: {competition.prizeSummary}</p>
          <p className="mt-2 text-sm">Opens {competition.opensAt.toLocaleDateString("en-GB")} · Closes {competition.closesAt.toLocaleDateString("en-GB")}</p>
          <div className="mt-5"><ButtonLink href={`/competitions/${competition.slug}`}>{acceptingEntries ? "Enter now" : "View competition"}</ButtonLink></div>
        </Card>;
      })}</div> : <Card><h2 className="text-xl font-bold text-navy">No public competitions yet</h2><p className="mt-2 text-charcoal/65">An administrator can prepare the first genuine competition in draft without publishing it.</p></Card>}
    </Section>
  </>;
}
