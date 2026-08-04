import { notFound } from "next/navigation";
import { ButtonLink, Card, Section } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth/session";
import { competitionAcceptsEntries, competitionIsPubliclyVisible, publicEntryStatus, realEntrantCount } from "@/lib/competitions";
import { prisma } from "@/lib/prisma";

export default async function CompetitionPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  const competition = await prisma.competition.findUnique({
    where: { slug: params.slug },
    include: {
      judges: { orderBy: { displayOrder: "asc" } },
      entries: { where: { status: { in: ["SUBMITTED", "FINALIST", "WINNER"] } }, include: { dog: { select: { name: true, registryNumber: true } } }, orderBy: { submittedAt: "asc" } },
      results: { include: { entry: { include: { dog: { select: { name: true, registryNumber: true } } } } }, orderBy: { placement: "asc" } },
    },
  });
  if (!competition || competition.status === "CANCELLED" || (competition.status === "DRAFT" && user?.role !== "ADMIN")) notFound();

  const acceptingEntries = competitionAcceptsEntries(competition.status, competition.opensAt, competition.closesAt);
  const publicGalleryEntries = competitionIsPubliclyVisible(competition.status)
    ? competition.entries.filter((entry) => publicEntryStatus(entry.status) && Boolean(entry.imageUseConsentAt))
    : [];

  return <>
    <Section eyebrow={`${competition.eligibility === "UK_ONLY" ? "UK only" : "International"} · Free entry`} title={competition.title}>
      {user?.role === "ADMIN" && <div className="mb-5 flex flex-wrap gap-2"><ButtonLink href={`/admin/competitions/${competition.id}`}>Edit competition</ButtonLink><ButtonLink href={`/admin/competitions/${competition.id}`} variant="secondary">Review entries · Change lifecycle state</ButtonLink></div>}{competition.heroStorageKey ? <img src={`/api/competition-hero/${competition.id}`} alt={`${competition.title} featured image`} className="mb-5 max-h-96 w-full rounded-[2rem] object-cover"/> : <div className="mb-5 rounded-2xl bg-skysoft/50 p-4 font-bold text-navy">{competition.theme}</div>}<div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <Card><p className="registry-label">Theme: {competition.theme}</p><p className="mt-4 text-lg leading-8">{competition.description}</p><h2 className="mt-5 text-xl font-bold text-navy">Prize</h2><p className="mt-2">{competition.prizeSummary}</p><p className="mt-4 font-bold">{realEntrantCount(competition.entries)} entrants · Status: {competition.status.toLowerCase()}</p><p className="mt-2 text-sm">Opens {competition.opensAt.toLocaleString("en-GB")} · Closes {competition.closesAt.toLocaleString("en-GB")}</p><p className="mt-2 font-bold text-info">{competition.closesAt > new Date() ? `${Math.max(1,Math.ceil((+competition.closesAt-Date.now())/86400000))} days remaining` : "Entries closed"}</p>{acceptingEntries && <div className="mt-5"><ButtonLink href={`/competitions/${competition.slug}/enter`}>Enter now</ButtonLink></div>}</Card>
        <Card><h2 className="text-xl font-bold text-navy">Photo rules</h2><p className="mt-3 whitespace-pre-line text-sm leading-6">{competition.imageGuidelines}</p><h3 className="mt-5 font-bold text-navy">Competition rules</h3><p className="mt-2 whitespace-pre-line text-sm leading-6">{competition.rules}</p></Card>
      </div>
    </Section>
    {competition.judges.length > 0 && <Section eyebrow="Competition panel" title="Meet the judges"><div className="grid gap-4 md:grid-cols-2">{competition.judges.map(judge=><Card key={judge.id}>{judge.imageStorageKey&&<img src={`/api/judge-images/${judge.id}`} alt={`${judge.name} profile`} className="mb-4 h-28 w-28 rounded-full object-cover"/>}<p className="registry-label">{judge.guestJudge?"Guest judge":judge.roleTitle||"Judge"}</p><h2 className="mt-2 text-2xl font-bold text-navy">{judge.name}</h2>{judge.organisation&&<p className="font-bold text-info">{judge.organisation}</p>}{judge.biography&&<p className="mt-3">{judge.biography}</p>}{judge.profession&&<p className="mt-3"><strong>Professional work:</strong> {judge.profession}</p>}{judge.judgingFocus&&<p className="mt-3"><strong>Judging focus:</strong> {judge.judgingFocus}</p>}</Card>)}</div></Section>}
    {publicGalleryEntries.length > 0 && <Section eyebrow="Consented gallery" title="Entries"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{publicGalleryEntries.map((entry) => <Card key={entry.id}><img src={`/api/competition-images/${entry.id}`} alt={`${entry.dog.name} competition entry`} className="aspect-square w-full rounded-2xl object-cover" /><h2 className="mt-3 text-xl font-bold text-navy">{entry.dog.name}</h2><a className="text-sm font-bold text-info" href={`/dogs/${entry.dog.registryNumber}`}>{entry.dog.registryNumber}</a>{entry.caption && <p className="mt-2">{entry.caption}</p>}</Card>)}</div></Section>}
    {competition.results.some((result) => result.publishedAt) && <Section eyebrow="Published results" title="Results">{competition.results.filter((result) => result.publishedAt).map((result) => <Card key={result.id}><p className="font-bold text-info">{result.placement}. {result.title}</p><p className="text-xl font-bold text-navy">{result.entry.dog.name}</p>{result.judgeNotes && <p>{result.judgeNotes}</p>}</Card>)}</Section>}
  </>;
}
