import { notFound } from "next/navigation";
import { ButtonLink, Card, PawAvatar, Section } from "@/components/ui";
import { CategorySection, AddRecordForm } from "@/components/records/record-components";
import { StatusBadge } from "@/components/status-badge";
import { ProfileCompletionCard } from "@/components/profile-completion-card";
import { getCurrentUser } from "@/lib/auth/session";
import { calculateDogProfileCompleteness } from "@/lib/profile-completeness";
import { recordCategories } from "@/lib/records/catalog";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date | null, estimated = false) {
  if (!date) return "Not provided";
  return new Intl.DateTimeFormat("en-GB", estimated ? { month: "long", year: "numeric", timeZone: "UTC" } : { dateStyle: "long", timeZone: "UTC" }).format(date);
}

function formatDob(date: Date | null, estimated: boolean) {
  if (!date) return "DOB: Not provided";
  return `${estimated ? "Estimated DOB" : "DOB"}: ${formatDate(date, estimated)}`;
}

function splitList(value: string | null) {
  return value?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];
}

function formatVisibility(visibility: string) {
  return visibility.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function breedSummary(dog: { breed: string | null; isMixedBreed: boolean; breedMix: string | null }) {
  const mix = splitList(dog.breedMix);
  if (dog.isMixedBreed || dog.breed === "Mixed Breed") return mix.length ? `Mixed Breed: ${mix.join(" / ")}` : "Mixed Breed";
  return dog.breed ?? "Not provided";
}

const foundationSections = [
  ["Health", "Coming Soon", "Health records are structured now; longitudinal health tracking can attach later."],
  ["Family", "Foundation", "Pedigree records can be stored now without building the family tree yet."],
  ["Ownership", "Foundation", "Current ownership is recorded now. Transfers and ownership history can plug in later."],
  ["Awards", "Preview", "Titles and working qualifications can be stored as records before competitions connect."],
];

export default async function DogIdentityPage({ params }: { params: { registryNumber: string } }) {
  const [dog, currentUser] = await Promise.all([prisma.dogIdentity.findUnique({
    where: { registryNumber: params.registryNumber },
    include: { ownerships: { include: { user: true }, orderBy: { createdAt: "asc" } }, records: { orderBy: [{ category: "asc" }, { createdAt: "desc" }] } },
  }), getCurrentUser()]);
  if (!dog) notFound();
  const primaryOwner = dog.ownerships[0];
  const owner = primaryOwner?.user;

  const canManage = Boolean(currentUser && dog.ownerships.some((ownership) => ownership.userId === currentUser.id));
  const completeness = calculateDogProfileCompleteness(dog);
  const dogTypeTags = splitList(dog.dogTypes);
  const identityDetails = [
    ["Bark Booth Registry Number", dog.registryNumber],
    ["Identity status", "Registered"],
    ["Identity created date", formatDate(dog.createdAt)],
    ["Kennel Club name", dog.kennelClubName ?? "Not provided"],
    ["Breed", breedSummary(dog)],
    ["DNA confirmed", dog.dnaConfirmed && dog.dnaConfirmed !== "UNKNOWN" ? dog.dnaConfirmed.toLowerCase().replace(/^./, (c) => c.toUpperCase()) : "Not provided"],
    ["Date of birth", formatDob(dog.dateOfBirth, dog.estimatedDob)],
    ["Sex", dog.sex ?? "Not provided"],
    ["Primary dog type", dog.primaryRole],
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
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/55">Official Bark Booth Identity</p>
              <h1 className="mt-3 text-5xl font-bold leading-none">{dog.name}</h1>
              <p className="mt-3 text-2xl font-bold text-biscuit">{dog.registryNumber}</p>{dog.kennelClubName && <p className="mt-2 text-lg font-bold text-white/75">KC name: {dog.kennelClubName}</p>}<p className="mt-2 font-bold text-white/75">{breedSummary(dog)} · {formatDob(dog.dateOfBirth, dog.estimatedDob)}</p>
              <div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-navy">Registered</span><span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white">Created {formatDate(dog.createdAt)}</span>{dogTypeTags.map((type) => <span key={type} className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white">{type}</span>)}<span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white">{completeness.percentage}% complete</span></div>
            </div>
          </div>
          <p className="mt-6 leading-7 text-white/75">A Bark Booth Identity keeps the dog’s core details at the centre, with optional records and history able to grow over time.</p>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold text-navy">Identity details</h2>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            {identityDetails.map(([label, value]) => <div key={label} className="rounded-2xl bg-lightgrey p-4"><dt className="text-xs font-bold uppercase tracking-widest text-charcoal/45">{label}</dt><dd className="mt-1 font-bold text-navy">{value}</dd></div>)}
          </dl>
          <div className="mt-5 flex flex-wrap gap-3"><ButtonLink href="/dashboard">Back to Dashboard</ButtonLink></div>
        </Card>
      </div>
    </Section>

    <Section eyebrow="Profile navigation" title="Dog profile foundations">
      <div className="flex flex-wrap gap-2"><a href="#records" className="rounded-full bg-navy px-4 py-2 text-sm font-bold text-white">Records</a><a href="#completion" className="rounded-full bg-white px-4 py-2 text-sm font-bold text-navy">Completeness</a><a href="#history" className="rounded-full bg-white px-4 py-2 text-sm font-bold text-navy">Ownership History</a></div>
    </Section>

    <Section eyebrow="Trust foundation" title={`${dog.name}'s structured records`}>
      <div id="completion" className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <ProfileCompletionCard percentage={completeness.percentage} sections={completeness.sections} />
        <div id="records"><Card><p className="text-sm font-bold uppercase tracking-[0.2em] text-rosette">Records Overview</p><h3 className="mt-2 text-3xl font-bold text-navy">{dog.records.length} record statements</h3><div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-lightgrey p-4"><p className="text-xs font-bold uppercase tracking-widest text-charcoal/45">Verified Records</p><p className="mt-1 text-2xl font-bold text-navy">{dog.records.filter((record) => record.verificationStatus === "VERIFIED").length}</p></div><div className="rounded-2xl bg-lightgrey p-4"><p className="text-xs font-bold uppercase tracking-widest text-charcoal/45">Pending Records</p><p className="mt-1 text-2xl font-bold text-navy">{dog.records.filter((record) => record.verificationStatus === "PENDING").length}</p></div><div className="rounded-2xl bg-lightgrey p-4"><p className="text-xs font-bold uppercase tracking-widest text-charcoal/45">Not Submitted</p><p className="mt-1 text-2xl font-bold text-navy">{dog.records.filter((record) => record.verificationStatus === "NOT_SUBMITTED").length}</p></div></div><div className="mt-5 flex flex-wrap gap-2"><StatusBadge status="FOUNDATION" /><StatusBadge status="COMING_SOON" label="Uploads Coming Soon" /><StatusBadge status="PREVIEW" label="Verification Preview" /></div></Card></div>
      </div>
      {canManage && <div className="mt-5"><AddRecordForm dogId={dog.id} /></div>}
      <div className="mt-7 grid gap-5">{recordCategories.map((category) => <CategorySection key={category} category={category} records={dog.records.filter((record) => record.category === category)} canManage={canManage} />)}</div>
    </Section>

    <Section eyebrow="Foundation areas" title="Future-ready trust areas">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {foundationSections.map(([section, status, detail]) => <Card key={section}><StatusBadge status={status.toUpperCase().replace(/ /g, "_")} label={status} /><h3 className="mt-3 text-2xl font-bold text-navy">{section}</h3><p className="mt-3 leading-7 text-charcoal/65">{detail}</p></Card>)}
        <div id="history" className="lg:col-span-4"><Card>
          <h3 className="text-2xl font-bold text-navy">History</h3>
          {primaryOwner ? <div className="mt-4 rounded-2xl bg-lightgrey p-4"><p className="text-sm font-bold uppercase tracking-widest text-charcoal/45">Current owner</p><p className="mt-1 font-bold text-navy">{owner?.displayName} (@{owner?.username})</p><p className="mt-1 text-sm font-bold text-charcoal/60">Recorded {formatDate(primaryOwner.createdAt)}</p></div> : null}
          <p className="mt-4 leading-7 text-charcoal/65">Ownership history is a foundation area. Previous keepers, breeder, rescue, foster, and transfer records are coming soon.</p>
        </Card></div>
      </div>
    </Section>
  </>;
}
