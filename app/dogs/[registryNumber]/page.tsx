import { notFound } from "next/navigation";
import type { DogBehaviourLifestyle, DogRecord, DogRecordCategory } from "@prisma/client";
import { ButtonLink, Card, PawAvatar, Section } from "@/components/ui";
import { CategorySection, AddRecordForm } from "@/components/records/record-components";
import { StatusBadge } from "@/components/status-badge";
import { ProfileCompletionCard } from "@/components/profile-completion-card";
import { getCurrentUser } from "@/lib/auth/session";
import { updateBehaviourLifestyle } from "@/lib/dogs/actions";
import { calculateDogProfileCompleteness } from "@/lib/profile-completeness";
import { allRecordCategories, recordCategoryLabels } from "@/lib/records/catalog";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date | null, estimated = false) {
  if (!date) return "Not provided";
  return new Intl.DateTimeFormat("en-GB", estimated ? { month: "long", year: "numeric", timeZone: "UTC" } : { dateStyle: "long", timeZone: "UTC" }).format(date);
}

function splitList(value: string | null) { return value?.split(",").map((item) => item.trim()).filter(Boolean) ?? []; }
function formatAnswer(value: string | null | undefined) { return value === "YES" ? "Yes" : value === "NO" ? "No" : "Unknown"; }
function breedSummary(dog: { breed: string | null; isMixedBreed: boolean; breedMix: string | null }) {
  const mix = splitList(dog.breedMix);
  if (dog.isMixedBreed || dog.breed === "Mixed Breed") return mix.length ? `Mixed Breed: ${mix.join(" / ")}` : "Mixed Breed";
  return dog.breed ?? "Not provided";
}
function primaryDogType(dog: { primaryRole: string; dogTypes: string | null }) { return dog.primaryRole || splitList(dog.dogTypes)[0] || "Other"; }

const indicatorConfig: { key: string; label: string; href: string; categories: DogRecordCategory[] }[] = [
  { key: "dna", label: "DNA", href: "#records-dna", categories: ["DNA"] },
  { key: "health", label: "Health", href: "#records-health", categories: ["HEALTH", "CARE"] },
  { key: "pedigree", label: "Pedigree", href: "#records-pedigree", categories: ["PEDIGREE"] },
  { key: "insurance", label: "Insurance", href: "#records-insurance", categories: ["INSURANCE"] },
  { key: "family", label: "Family", href: "#family", categories: ["PEDIGREE"] },
  { key: "records", label: "Records", href: "#records", categories: ["IDENTITY", "IDENTIFICATION", "OTHER"] },
  { key: "awards", label: "Awards", href: "#awards", categories: ["ACTIVITIES_WORK", "WORKING_QUALIFICATIONS", "TITLES"] },
  { key: "behaviour", label: "Behaviour", href: "#behaviour", categories: ["TEMPERAMENT_TESTS"] },
];

const behaviourQuestions: { name: keyof DogBehaviourLifestyle; label: string }[] = [
  { name: "reactive", label: "Reactive?" }, { name: "foodAggression", label: "Food aggression?" }, { name: "resourceGuarding", label: "Resource guarding?" }, { name: "separationAnxiety", label: "Separation anxiety?" },
  { name: "highPreyDrive", label: "High prey drive?" }, { name: "escapeArtist", label: "Escape artist?" }, { name: "goodWithChildren", label: "Good with children?" }, { name: "goodWithDogs", label: "Good with dogs?" },
  { name: "goodWithCats", label: "Good with cats?" }, { name: "goodWithLivestock", label: "Good with livestock?" }, { name: "friendlyWithStrangers", label: "Friendly with strangers?" }, { name: "reliableOffLead", label: "Reliable off lead?" },
  { name: "recallTrained", label: "Recall trained?" }, { name: "crateTrained", label: "Crate trained?" }, { name: "muzzleTrained", label: "Muzzle trained?" }, { name: "neuteredSpayed", label: "Neutered / Spayed?" },
];

function indicatorState(records: DogRecord[], categories: DogRecordCategory[], hasBehaviour: boolean) {
  if (categories.includes("TEMPERAMENT_TESTS") && hasBehaviour) return "owner";
  const matching = records.filter((record) => categories.includes(record.category) && record.status === "HAVE_RECORD");
  if (matching.some((record) => record.verificationStatus === "VERIFIED")) return "verified";
  if (matching.length) return "owner";
  return "inactive";
}

export default async function DogIdentityPage({ params }: { params: { registryNumber: string } }) {
  const [dog, currentUser] = await Promise.all([prisma.dogIdentity.findUnique({
    where: { registryNumber: params.registryNumber },
    include: { behaviourLifestyle: true, ownerships: { include: { user: { include: { roleApplications: true } } }, orderBy: { createdAt: "asc" } }, records: { orderBy: [{ category: "asc" }, { createdAt: "desc" }] } },
  }), getCurrentUser()]);
  if (!dog) notFound();
  const primaryOwner = dog.ownerships[0];
  const owner = primaryOwner?.user;
  const canManage = Boolean(currentUser && dog.ownerships.some((ownership) => ownership.userId === currentUser.id));
  const completeness = calculateDogProfileCompleteness(dog);
  const verifiedCount = dog.records.filter((record) => record.verificationStatus === "VERIFIED").length;
  const ownerDeclaredCount = dog.records.filter((record) => record.status === "HAVE_RECORD" && record.verificationStatus === "NOT_SUBMITTED").length + (dog.behaviourLifestyle ? 1 : 0);
  const submittedCount = dog.records.filter((record) => record.verificationStatus === "PENDING").length;
  const rescueVerified = owner?.roleApplications.some((application) => application.requestedRole === "RESCUE" && application.status === "APPROVED") ?? false;
  const behaviourTrust = dog.behaviourLifestyle?.assessmentSource === "VERIFIED_RESCUE_ASSESSED" && rescueVerified ? "Behaviour Assessed by Verified Rescue" : "Owner Declared";
  const identityDetails = [
    ["Bark Booth Registry Number", dog.registryNumber], ["Dog Name", dog.name], ["Breed", breedSummary(dog)], ["Date of Birth", formatDate(dog.dateOfBirth, dog.estimatedDob)],
    ["Sex", dog.sex ?? "Not provided"], ["Neutered / Spayed", formatAnswer(dog.neuteredSpayed)], ["Primary Dog Type", primaryDogType(dog)], ["Registry Status", "Registered"],
  ];

  return <>
    <Section eyebrow="Canine Identity Record" title={dog.name}>
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-gradient-to-br from-navy to-cocoa text-white">
          <div className="grid gap-5 sm:grid-cols-[150px_1fr] sm:items-center">
            <PawAvatar label={`${dog.name} official profile photo placeholder`} className="bg-gradient-to-br from-white via-cream to-biscuit text-6xl ring-4 ring-white/20" />
            <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-white/55">Official Bark Booth Identity</p><h1 className="mt-3 text-4xl font-bold leading-none">{dog.name}</h1><p className="mt-3 text-2xl font-bold text-biscuit">{dog.registryNumber}</p><p className="mt-2 font-bold text-white/75">{breedSummary(dog)} · {primaryDogType(dog)}</p></div>
          </div>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">{identityDetails.map(([label, value]) => <div key={label} className="rounded-2xl bg-white/10 p-3"><dt className="text-[0.65rem] font-bold uppercase tracking-widest text-white/50">{label}</dt><dd className="mt-1 font-bold text-white">{value}</dd></div>)}</dl>
          <div className="mt-5 rounded-2xl bg-white/10 p-4"><p className="text-xs font-bold uppercase tracking-widest text-white/50">Verification Summary</p><p className="mt-1 font-bold text-white">{verifiedCount} verified · {submittedCount} document submitted · {ownerDeclaredCount} owner declared</p></div>
          <div className="mt-5 grid grid-cols-4 gap-2">{indicatorConfig.map((item) => { const state = indicatorState(dog.records, item.categories, Boolean(dog.behaviourLifestyle)); return <a key={item.key} href={item.href} title={`${item.label}: ${state}`} className={`rounded-2xl px-2 py-3 text-center text-xs font-bold ${state === "verified" ? "bg-emerald-100 text-navy" : state === "owner" ? "bg-biscuit text-navy" : "bg-white/10 text-white/45"}`}>{item.label}</a>; })}</div>
          <div id="awards" className="mt-5 rounded-2xl bg-white/10 p-4"><p className="text-xs font-bold uppercase tracking-widest text-white/50">Awards Summary</p><p className="mt-1 font-bold text-white">{dog.records.filter((record) => ["ACTIVITIES_WORK", "WORKING_QUALIFICATIONS", "TITLES"].includes(record.category)).length} activities, work, or award records</p></div>
        </Card>
        <Card><h2 className="text-2xl font-bold text-navy">Full profile</h2><p className="mt-3 leading-7 text-charcoal/65">The public card stays consistent and compact. Detailed identity, ownership, records, health, family tree, awards, behaviour, and history information remains inside this full profile.</p><div className="mt-5 flex flex-wrap gap-2"><a href="#records" className="rounded-full bg-navy px-4 py-2 text-sm font-bold text-white">Records</a><a href="#behaviour" className="rounded-full bg-white px-4 py-2 text-sm font-bold text-navy">Behaviour</a><a href="#history" className="rounded-full bg-white px-4 py-2 text-sm font-bold text-navy">History</a><ButtonLink href="/dashboard">Back to Dashboard</ButtonLink></div></Card>
      </div>
    </Section>

    <Section eyebrow="Trust foundation" title={`${dog.name}'s structured records`}>
      <div id="records" className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]"><ProfileCompletionCard percentage={completeness.percentage} sections={completeness.sections} /><Card><p className="text-sm font-bold uppercase tracking-[0.2em] text-rosette">Records Overview</p><h3 className="mt-2 text-3xl font-bold text-navy">{dog.records.length} record statements</h3><div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-lightgrey p-4"><p className="text-xs font-bold uppercase tracking-widest text-charcoal/45">Verified</p><p className="mt-1 text-2xl font-bold text-navy">{verifiedCount}</p></div><div className="rounded-2xl bg-lightgrey p-4"><p className="text-xs font-bold uppercase tracking-widest text-charcoal/45">Document Submitted</p><p className="mt-1 text-2xl font-bold text-navy">{submittedCount}</p></div><div className="rounded-2xl bg-lightgrey p-4"><p className="text-xs font-bold uppercase tracking-widest text-charcoal/45">Owner Declared</p><p className="mt-1 text-2xl font-bold text-navy">{ownerDeclaredCount}</p></div></div></Card></div>
      {canManage && <div className="mt-5"><AddRecordForm dogId={dog.id} /></div>}
      <div className="mt-7 grid gap-5">{allRecordCategories.map((category) => <div id={`records-${category.toLowerCase().replace(/_/g, "-")}`} key={category}><CategorySection category={category} records={dog.records.filter((record) => record.category === category)} canManage={canManage} /></div>)}</div>
    </Section>

    <Section eyebrow="Behaviour & Lifestyle" title="Welfare and compatibility overview">
      <div id="behaviour" className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"><Card><StatusBadge status={behaviourTrust === "Owner Declared" ? "NOT_SUBMITTED" : "VERIFIED"} label={behaviourTrust} /><p className="mt-4 leading-7 text-charcoal/65">This structured information is supplied by the dog&apos;s owner unless a verified rescue assessment is recorded. It avoids private routines and uses only Yes, No, or Unknown answers.</p>{canManage && <form action={updateBehaviourLifestyle} className="mt-5 grid gap-3"><input type="hidden" name="dogId" value={dog.id} />{behaviourQuestions.map((question) => <label key={String(question.name)} className="grid gap-1 text-sm font-bold text-navy">{question.label}<select name={String(question.name)} defaultValue={String(dog.behaviourLifestyle?.[question.name] ?? "UNKNOWN")} className="rounded-2xl border border-cocoa/10 bg-white p-3"><option value="UNKNOWN">Unknown</option><option value="YES">Yes</option><option value="NO">No</option></select></label>)}<button className="rounded-full bg-navy px-5 py-3 text-sm font-bold text-white" type="submit">Save Behaviour & Lifestyle</button></form>}</Card><Card><div className="grid gap-3 sm:grid-cols-2">{behaviourQuestions.map((question) => <div key={String(question.name)} className="rounded-2xl bg-lightgrey p-3"><p className="text-xs font-bold uppercase tracking-widest text-charcoal/45">{question.label}</p><p className="mt-1 font-bold text-navy">{formatAnswer(String(dog.behaviourLifestyle?.[question.name] ?? "UNKNOWN"))}</p></div>)}</div></Card></div>
    </Section>

    <Section eyebrow="Foundation areas" title="Future-ready trust areas">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"><Card><StatusBadge status="FOUNDATION" /><h3 className="mt-3 text-2xl font-bold text-navy">Breeder</h3><p className="mt-3 leading-7 text-charcoal/65">Future litter and puppy identity cards can expose photo, DOB, breed, microchipped, vaccinated, health tested, and availability states without payment tools.</p></Card><Card><StatusBadge status="FOUNDATION" /><h3 className="mt-3 text-2xl font-bold text-navy">Rescue</h3><p className="mt-3 leading-7 text-charcoal/65">Future rescue identities can expose behaviour summary, compatibility, lifestyle suitability, and contact-rescue entry points without adoption workflows.</p></Card><div id="family"><Card><StatusBadge status="FOUNDATION" /><h3 className="mt-3 text-2xl font-bold text-navy">Family Tree</h3><p className="mt-3 leading-7 text-charcoal/65">Pedigree records are verification-aware now; the full family tree can attach later.</p></Card></div><div id="history" className="lg:col-span-4"><Card><h3 className="text-2xl font-bold text-navy">History</h3>{primaryOwner ? <div className="mt-4 rounded-2xl bg-lightgrey p-4"><p className="text-sm font-bold uppercase tracking-widest text-charcoal/45">Current owner</p><p className="mt-1 font-bold text-navy">{owner?.displayName} (@{owner?.username})</p><p className="mt-1 text-sm font-bold text-charcoal/60">Recorded {formatDate(primaryOwner.createdAt)}</p></div> : null}<p className="mt-4 leading-7 text-charcoal/65">Ownership history is a foundation area. Previous keepers, breeder, rescue, foster, and transfer records are coming soon.</p></Card></div></div>
    </Section>
  </>;
}
