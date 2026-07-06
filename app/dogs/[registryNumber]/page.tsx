import { notFound } from "next/navigation";
import { ButtonLink, Card, PawAvatar, Section } from "@/components/ui";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date | null) {
  return date ? new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "UTC" }).format(date) : "Not provided";
}

function formatVisibility(visibility: string) {
  return visibility.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const recordSections = ["Health", "Family Tree", "Competitions", "Badges & Awards", "Verified Documents"];

export default async function DogIdentityPage({ params }: { params: { registryNumber: string } }) {
  const dog = await prisma.dogIdentity.findUnique({
    where: { registryNumber: params.registryNumber },
    include: { ownerships: { include: { user: true }, orderBy: { createdAt: "asc" } } },
  });
  if (!dog) notFound();
  const primaryOwner = dog.ownerships[0];
  const owner = primaryOwner?.user;

  const identityDetails = [
    ["Bark Booth Registry Number", dog.registryNumber],
    ["Identity status", "Registered"],
    ["Identity created date", formatDate(dog.createdAt)],
    ["Breed/type", dog.breed ?? "Not provided"],
    ["Date of birth", formatDate(dog.dateOfBirth)],
    ["Estimated DOB", dog.estimatedDob ? "Yes" : "No"],
    ["Sex", dog.sex ?? "Not provided"],
    ["Primary dog role", dog.primaryRole],
    ["Colour", dog.colour ?? "Not provided"],
    ["Country of registration", dog.countryOfRegistration ?? "Not provided"],
    ["Visibility", formatVisibility(dog.visibility)],
    ["Registered owner", owner ? `${owner.displayName} (@${owner.username})` : "Not attached"],
  ];

  return <>
    <Section eyebrow="Canine Identity Record" title={dog.name}>
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="bg-gradient-to-br from-navy to-cocoa text-white">
          <div className="grid gap-5 sm:grid-cols-[180px_1fr] sm:items-center">
            <PawAvatar label={`${dog.name} official profile photo placeholder`} className="bg-gradient-to-br from-white via-cream to-biscuit text-6xl ring-4 ring-white/20" />
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-white/55">Official Bark Booth Identity</p>
              <h1 className="mt-3 text-5xl font-black leading-none">{dog.name}</h1>
              <p className="mt-3 text-2xl font-black text-biscuit">{dog.registryNumber}</p>
              <div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-cocoa">Registered</span><span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white">Created {formatDate(dog.createdAt)}</span></div>
            </div>
          </div>
          <p className="mt-6 leading-7 text-white/75">A Bark Booth Identity keeps the dog’s core details at the centre, with optional records and history able to grow over time.</p>
        </Card>

        <Card>
          <h2 className="text-2xl font-black text-navy">Identity details</h2>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            {identityDetails.map(([label, value]) => <div key={label} className="rounded-2xl bg-lightgrey p-4"><dt className="text-xs font-black uppercase tracking-widest text-charcoal/45">{label}</dt><dd className="mt-1 font-black text-cocoa">{value}</dd></div>)}
          </dl>
          <div className="mt-5 flex flex-wrap gap-3"><ButtonLink href="/dashboard">Back to Dashboard</ButtonLink></div>
        </Card>
      </div>
    </Section>

    <Section eyebrow="Record areas" title="Records that can grow with this identity">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recordSections.map((section) => <Card key={section}><h3 className="text-2xl font-black text-navy">{section}</h3><p className="mt-3 leading-7 text-charcoal/65">No records added yet. This section will grow as records are added.</p></Card>)}
        <Card className="lg:col-span-3">
          <h3 className="text-2xl font-black text-navy">History</h3>
          {primaryOwner ? <div className="mt-4 rounded-2xl bg-lightgrey p-4"><p className="text-sm font-black uppercase tracking-widest text-charcoal/45">Current owner</p><p className="mt-1 font-black text-cocoa">{owner?.displayName} (@{owner?.username})</p><p className="mt-1 text-sm font-bold text-charcoal/60">Recorded {formatDate(primaryOwner.createdAt)}</p></div> : null}
          <p className="mt-4 leading-7 text-charcoal/65">Ownership history will appear here as the identity grows.</p>
        </Card>
      </div>
    </Section>
  </>;
}
