import { DogCard } from "@/components/dog-card";
import { ButtonLink, Card, PawAvatar, Section } from "@/components/ui";
import { requireUser } from "@/lib/auth/session";
import { contractedCareRelationships, dualOwnershipRelationships, isDogAccessCurrentlyActive } from "@/lib/dog-access";
import { prisma } from "@/lib/prisma";

export default async function MyDogsPage() {
  const user = await requireUser();
  const dogs = await prisma.dogIdentity.findMany({
    where: { ownerships: { some: { userId: user.id } } },
    include: { profilePhoto: true, accessRequests: { where: { status: "APPROVED" }, include: { requester: { include: { roleApplications: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return <Section eyebrow="Canine identities" title="My dogs">{dogs.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{dogs.map((dog) => <DogCard key={dog.id} dog={dog} dualOwnership={dog.accessRequests.some((access) => isDogAccessCurrentlyActive(access) && dualOwnershipRelationships.includes(access.requestedRelationship))} contractedCare={dog.accessRequests.some((access) => isDogAccessCurrentlyActive(access) && contractedCareRelationships.includes(access.requestedRelationship))}/>)}</div> : <Card className="border-dashed border-navy/20 bg-white"><div className="mx-auto grid max-w-lg place-items-center py-7 text-center"><PawAvatar label="No registered dogs" className="h-28 w-36 shadow-none"/><h2 className="mt-5 text-2xl font-bold text-navy">Create your first canine identity</h2><p className="mt-2 text-slate">Keep your dog’s identity, relationships and important records together under one trusted registry number.</p><div className="mt-5"><ButtonLink href="/register-dog">Register a dog</ButtonLink></div></div></Card>}</Section>;
}
