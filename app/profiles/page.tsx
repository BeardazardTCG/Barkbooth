import { DogCard } from "@/components/dog-card";
import { EmptyState } from "@/components/empty-state";
import { ButtonLink, Card, Section } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProfilesPage({ searchParams }: { searchParams?: { q?: string } }) {
  const query = searchParams?.q?.trim() ?? "";
  const dogs = query ? await prisma.dogIdentity.findMany({ where: { visibility: "PUBLIC", OR: [{ registryNumber: { equals: query.toUpperCase() } }, { name: { contains: query, mode: "insensitive" } }] }, include: { profilePhoto: true }, orderBy: { createdAt: "desc" }, take: 24 }) : [];
  return <>
    <Section eyebrow="Bark Booth Registry" title="Search public canine identities"><Card className="bg-gradient-to-br from-white to-skysoft/50"><form method="get" className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end"><label className="block text-sm font-bold text-navy">Dog name or exact registry number<input name="q" type="search" defaultValue={query} placeholder="Dog name or registry number" className="mt-2 w-full rounded-2xl border border-navy/10 bg-white px-4 py-3 text-charcoal" /></label><button className="rounded-full border border-navy bg-navy px-5 py-3 text-sm font-bold text-white" type="submit">Search registry</button></form><p className="mt-3 text-sm leading-6 text-charcoal/60">Only public identities are searchable. Profile information is supplied by the account holder unless specifically marked as verified.</p></Card></Section>
    {query && <Section eyebrow="Search results" title={dogs.length ? `${dogs.length} ${dogs.length === 1 ? "identity" : "identities"} found` : "No public identities found"}>{dogs.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{dogs.map((dog) => <DogCard key={dog.id} dog={dog} />)}</div> : <EmptyState title="Try another search">Check the registry number or try the dog’s name. Private identities are not included in results.</EmptyState>}</Section>}
    {!query && <Section eyebrow="Start a search" title="Look up a registered dog"><Card><p className="leading-7 text-charcoal/65">Enter a dog’s name or Bark Booth registry number above. We do not publish a browsable list of every dog.</p><div className="mt-5"><ButtonLink href="/register-dog">Register your dog</ButtonLink></div></Card></Section>}
  </>;
}
