import { notFound } from "next/navigation";
import { ButtonLink, Card, Section } from "@/components/ui";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date | null) {
  return date ? new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(date) : "Not provided";
}

export default async function DogIdentityPage({ params }: { params: { registryNumber: string } }) {
  const dog = await prisma.dogIdentity.findUnique({ where: { registryNumber: params.registryNumber }, include: { ownerships: { include: { user: true } } } });
  if (!dog) notFound();
  const primaryOwner = dog.ownerships[0]?.user;

  return <Section eyebrow="Bark Booth Identity" title={dog.name}>
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <Card className="bg-gradient-to-br from-navy to-cocoa text-white">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-white/55">Canine Identity Card</p>
        <h1 className="mt-3 text-5xl font-black">{dog.name}</h1>
        <p className="mt-2 text-2xl font-black text-biscuit">{dog.registryNumber}</p>
        <div className="mt-5 grid gap-3 text-sm font-bold sm:grid-cols-2">
          <span>Role: {dog.primaryRole}</span><span>Breed: {dog.breed ?? "Not provided"}</span><span>DOB: {formatDate(dog.dateOfBirth)}</span><span>Estimated DOB: {dog.estimatedDob ? "Yes" : "No"}</span><span>Sex: {dog.sex ?? "Not provided"}</span><span>Colour: {dog.colour ?? "Not provided"}</span>
        </div>
      </Card>
      <Card>
        <h2 className="text-2xl font-black text-navy">Identity details</h2>
        <dl className="mt-4 grid gap-3 text-sm font-bold text-charcoal/70">
          <div><dt className="text-charcoal/45">Country of registration</dt><dd>{dog.countryOfRegistration ?? "Not provided"}</dd></div>
          <div><dt className="text-charcoal/45">Visibility</dt><dd>{dog.visibility}</dd></div>
          <div><dt className="text-charcoal/45">Registered owner account</dt><dd>{primaryOwner ? `${primaryOwner.displayName} (@${primaryOwner.username})` : "Not attached"}</dd></div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-3"><ButtonLink href="/dashboard">Back to Dashboard</ButtonLink><ButtonLink href="/dog-profile" variant="secondary">Static Demo</ButtonLink></div>
      </Card>
    </div>
  </Section>;
}
