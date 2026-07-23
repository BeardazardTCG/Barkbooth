import { notFound } from "next/navigation";
import type { DogBehaviourLifestyle, DogRecord, DogRecordCategory } from "@prisma/client";
import { BarkBoothLogo } from "@/components/nav";
import { ButtonLink, Card, DogProfileImage, Section } from "@/components/ui";
import { CategorySection, AddRecordForm } from "@/components/records/record-components";
import { StatusBadge } from "@/components/status-badge";
import { ProfileCompletionCard } from "@/components/profile-completion-card";
import { getCurrentUser } from "@/lib/auth/session";
import { removeDogProfilePhoto, updateBehaviourLifestyle, updateOwnerEssentials, uploadDogProfilePhoto } from "@/lib/dogs/actions";
import { calculateDogProfileCompleteness } from "@/lib/profile-completeness";
import { allRecordCategories, recordCategoryLabels } from "@/lib/records/catalog";
import { prisma } from "@/lib/prisma";
import { isDogAccessCurrentlyActive } from "@/lib/dog-access";
import { FileField, FormSubmitButton, ManagedForm } from "@/components/forms/managed-form";
import { updatePetDetails } from "@/lib/dogs/actions";
import { BreedSelector } from "@/components/breed-selector";
import { dogTypes, sexOptions } from "@/lib/dogs/profile-options";

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

const indicatorConfig: { key: string; label: string; href: string; categories?: DogRecordCategory[] }[] = [
  { key: "dna", label: "DNA", href: "#records-dna", categories: ["DNA"] },
  { key: "health", label: "Health", href: "#records-health", categories: ["HEALTH", "CARE"] },
  { key: "pedigree", label: "Pedigree", href: "#records-pedigree", categories: ["PEDIGREE"] },
  { key: "insurance", label: "Insurance", href: "#records-insurance", categories: ["INSURANCE"] },
  { key: "family", label: "Family", href: "#records-pedigree", categories: ["PEDIGREE"] },
  { key: "records", label: "Records", href: "#records", categories: ["OTHER"] },
  { key: "activities", label: "Activities", href: "#records-activities-work", categories: ["ACTIVITIES_WORK", "WORKING_QUALIFICATIONS", "TITLES"] },
  { key: "behaviour", label: "Behaviour", href: "#behaviour" },
];

const behaviourQuestions: { name: keyof DogBehaviourLifestyle; label: string }[] = [
  { name: "reactive", label: "Reactive?" }, { name: "foodAggression", label: "Food aggression?" }, { name: "resourceGuarding", label: "Resource guarding?" }, { name: "separationAnxiety", label: "Separation anxiety?" },
  { name: "highPreyDrive", label: "High prey drive?" }, { name: "escapeArtist", label: "Escape artist?" }, { name: "goodWithChildren", label: "Good with children?" }, { name: "goodWithDogs", label: "Good with dogs?" },
  { name: "goodWithCats", label: "Good with cats?" }, { name: "goodWithLivestock", label: "Good with livestock?" }, { name: "friendlyWithStrangers", label: "Friendly with strangers?" }, { name: "reliableOffLead", label: "Reliable off lead?" },
  { name: "recallTrained", label: "Recall trained?" }, { name: "crateTrained", label: "Crate trained?" }, { name: "muzzleTrained", label: "Muzzle trained?" }, { name: "neuteredSpayed", label: "Neutered / Spayed?" },
];

function behaviourIndicatorState(behaviourLifestyle: Pick<DogBehaviourLifestyle, "assessmentSource"> | null | undefined, rescueVerified: boolean) {
  if (!behaviourLifestyle) return "inactive";
  return behaviourLifestyle.assessmentSource === "VERIFIED_RESCUE_ASSESSED" && rescueVerified ? "verified" : "owner";
}

function indicatorState(records: DogRecord[], categories: DogRecordCategory[] | undefined, behaviourState: string) {
  if (!categories) return behaviourState;
  const matching = records.filter((record) => categories.includes(record.category) && record.status === "HAVE_RECORD");
  if (matching.some((record) => record.verificationStatus === "VERIFIED")) return "verified";
  if (matching.length) return "owner";
  return "inactive";
}

export default async function DogIdentityPage({ params }: { params: { registryNumber: string } }) {
  const [dog, currentUser] = await Promise.all([prisma.dogIdentity.findUnique({
    where: { registryNumber: params.registryNumber },
    include: { profilePhoto: true, behaviourLifestyle: true, accessRequests: { where: { status: "APPROVED" }, include: { requester: { include: { roleApplications: true } } } }, ownerships: { include: { user: { include: { roleApplications: true } } }, orderBy: { createdAt: "asc" } }, records: { include: { documents: { orderBy: { createdAt: "desc" } } }, orderBy: [{ category: "asc" }, { createdAt: "desc" }] } },
  }), getCurrentUser()]);
  if (!dog) notFound();
  const canManage = Boolean(currentUser && dog.ownerships.some((ownership) => ownership.userId === currentUser.id));
  const hasSharedView = Boolean(currentUser && dog.accessRequests.some((access) => access.requesterUserId === currentUser.id && isDogAccessCurrentlyActive(access)));
  const canViewPrivateDetails = canManage || hasSharedView;
  if (dog.visibility !== "PUBLIC" && !canManage && !hasSharedView) notFound();

  const primaryOwner = dog.ownerships[0];
  const owner = primaryOwner?.user;
  const rescueVerified = owner?.roleApplications.some((application) => application.requestedRole === "RESCUE" && application.status === "APPROVED") ?? false;
  const behaviourState = behaviourIndicatorState(dog.behaviourLifestyle, rescueVerified);
  const behaviourVerifiedCount = behaviourState === "verified" ? 1 : 0;
  const behaviourOwnerDeclaredCount = behaviourState === "owner" ? 1 : 0;
  const completeness = calculateDogProfileCompleteness(dog);
  const verifiedCount = dog.records.filter((record) => record.verificationStatus === "VERIFIED").length + behaviourVerifiedCount;
  const ownerDeclaredCount = dog.records.filter((record) => record.status === "HAVE_RECORD" && record.verificationStatus === "NOT_SUBMITTED").length + behaviourOwnerDeclaredCount;
  const submittedCount = dog.records.filter((record) => record.verificationStatus === "PENDING").length;
  const behaviourTrust = behaviourState === "verified" ? "Behaviour Assessed by Verified Rescue" : behaviourState === "owner" ? "Owner Declared" : "Not provided";
  const behaviourTrustStatus = behaviourState === "verified" ? "VERIFIED" : behaviourState === "owner" ? "NOT_SUBMITTED" : "LEGACY";
  const identityDetails = [
    ["Bark Booth Registry Number", dog.registryNumber], ["Dog Name", dog.name], ["Breed", breedSummary(dog)], ["Date of Birth", formatDate(dog.dateOfBirth, dog.estimatedDob)],
    ["Sex", dog.sex ?? "Not provided"], ["Neutered / Spayed", formatAnswer(dog.neuteredSpayed)], ["Primary Dog Type", primaryDogType(dog)],
  ];

  if (!canViewPrivateDetails) return <Section eyebrow="Public canine identity" title={dog.name}>
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="bg-gradient-to-br from-navy to-cocoa text-white">
        <div className="mb-5 rounded-2xl bg-white/95 p-3"><BarkBoothLogo /></div>
        <div className="grid gap-5 sm:grid-cols-[150px_1fr] sm:items-center"><DogProfileImage dogId={dog.id} label={dog.name} hasPhoto={Boolean(dog.profilePhoto)} version={dog.profilePhoto?.updatedAt.toISOString()} className="bg-gradient-to-br from-white via-offwhite to-skysoft ring-4 ring-white/20" /><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-white/55">Bark Booth identity</p><h1 className="mt-3 text-4xl font-bold">{dog.name}</h1><p className="mt-3 text-2xl font-bold text-skysoft">{dog.registryNumber}</p><p className="mt-2 font-bold text-white/75">{breedSummary(dog)} · {primaryDogType(dog)}</p></div></div>
        <dl className="mt-6 grid gap-3 sm:grid-cols-2">{[["Registry number", dog.registryNumber], ["Dog name", dog.name], ["Breed", breedSummary(dog)], ["Primary dog type", primaryDogType(dog)]].map(([label, value]) => <div key={label} className="rounded-2xl bg-white/10 p-3"><dt className="text-[0.65rem] font-bold uppercase tracking-widest text-white/50">{label}</dt><dd className="mt-1 font-bold text-white">{value}</dd></div>)}</dl>
      </Card>
      <Card><h2 className="text-2xl font-bold text-navy">About this identity</h2><p className="mt-3 leading-7 text-charcoal/65">Core identity information is supplied by the account holder unless specifically marked as verified.</p><p className="mt-5 rounded-2xl bg-skysoft/50 p-4 text-sm font-bold text-navy">Detailed records, behaviour information and ownership details are private and available only to authorised viewers.</p><div className="mt-5"><ButtonLink href="/profiles" variant="secondary">Back to registry search</ButtonLink></div></Card>
    </div>
  </Section>;

  return <><div id="top" />
    <Section eyebrow="Canine Identity Record" title={dog.name}>
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-gradient-to-br from-navy to-cocoa text-white">
          <div className="mb-5 rounded-2xl bg-white/95 p-3"><BarkBoothLogo /></div>
          <div className="grid gap-5 sm:grid-cols-[150px_1fr] sm:items-center">
            <DogProfileImage dogId={dog.id} label={`${dog.name} profile`} hasPhoto={Boolean(dog.profilePhoto)} version={dog.profilePhoto?.updatedAt.toISOString()} className="bg-gradient-to-br from-white via-offwhite to-skysoft text-6xl ring-4 ring-white/20" />
            <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-white/55">Bark Booth Identity</p><h1 className="mt-3 text-4xl font-bold leading-none">{dog.name}</h1><p className="mt-3 text-2xl font-bold text-skysoft">{dog.registryNumber}</p><p className="mt-2 font-bold text-white/75">{breedSummary(dog)} · {primaryDogType(dog)}</p></div>
          </div>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">{identityDetails.map(([label, value]) => <div key={label} className="rounded-2xl bg-white/10 p-3"><dt className="text-[0.65rem] font-bold uppercase tracking-widest text-white/50">{label}</dt><dd className="mt-1 font-bold text-white">{value}</dd></div>)}</dl>
          <p className="mt-4 rounded-2xl bg-white/10 p-3 text-sm font-bold text-white/75">Core identity information is owner-declared unless marked as verified.</p>
          <div className="mt-5 rounded-2xl bg-white/10 p-4"><p className="text-xs font-bold uppercase tracking-widest text-white/50">Verification Summary</p><p className="mt-1 font-bold text-white">{verifiedCount} verified · {submittedCount} document submitted · {ownerDeclaredCount} owner declared</p></div>
          <div className="mt-5 grid grid-cols-4 gap-2">{indicatorConfig.map((item) => { const state = indicatorState(dog.records, item.categories, behaviourState); return <a key={item.key} href={item.href} title={`${item.label}: ${state}`} className={`rounded-2xl px-2 py-3 text-center text-xs font-bold ${state === "verified" ? "bg-verified/10 text-navy" : state === "owner" ? "bg-skysoft text-navy" : "bg-white/10 text-white/45"}`}>{item.label}</a>; })}</div>
        </Card>
        <Card><h2 className="text-2xl font-bold text-navy">Full profile</h2><p className="mt-3 leading-7 text-charcoal/65">Each editable section saves only when you press its labelled button.</p><div className="mt-5 rounded-2xl bg-lightgrey p-4"><p className="text-sm font-bold text-navy">Profile photo</p>{canManage && <><ManagedForm action={uploadDogProfilePhoto} pendingMessage="Uploading…" encType="multipart/form-data" resetOnSuccess className="mt-3 grid min-w-0 gap-3"><input type="hidden" name="dogId" value={dog.id} /><input type="hidden" name="replacing" value={String(Boolean(dog.profilePhoto))} /><FileField name="photo" label="Choose profile photo" required accept="image/jpeg,image/png,image/webp" maxBytes={5 * 1024 * 1024} /><FormSubmitButton label={dog.profilePhoto ? "Replace photo" : "Upload photo"} pendingLabel="Uploading…" /></ManagedForm>{dog.profilePhoto && <ManagedForm action={removeDogProfilePhoto} pendingMessage="Removing…" warnOnLeave={false} className="mt-3 grid gap-2"><input type="hidden" name="dogId" value={dog.id} /><FormSubmitButton label="Remove photo" pendingLabel="Removing…" requireDirty={false} confirmMessage="Remove this profile photo? This cannot be undone." className="bg-white text-red-700" /></ManagedForm>}</>}</div><div className="mt-5 flex flex-wrap gap-2"><a href="#pet-details" className="rounded-full bg-navy px-4 py-2 text-sm font-bold text-white">Pet details</a><a href="#records" className="rounded-full bg-white px-4 py-2 text-sm font-bold text-navy">Records</a><a href="#behaviour" className="rounded-full bg-white px-4 py-2 text-sm font-bold text-navy">Behaviour</a><ButtonLink href="/dogs">Back to My Dogs</ButtonLink></div></Card>
      </div>
    </Section>

    {canManage && <Section eyebrow="Pet profile" title="Edit pet details"><Card>
      <ManagedForm action={updatePetDetails} className="grid gap-4">
        <input type="hidden" name="dogId" value={dog.id} />
        <div id="pet-details" className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 font-bold text-navy">Dog name<input name="name" required defaultValue={dog.name} className="rounded-2xl p-3" /></label>
          <label className="grid gap-2 font-bold text-navy">Kennel Club name<input name="kennelClubName" defaultValue={dog.kennelClubName ?? ""} className="rounded-2xl p-3" /></label>
          <BreedSelector mixedBreed={dog.isMixedBreed} initialBreed={dog.breed} initialBreedMix={dog.breedMix} />
          <label className="grid gap-2 font-bold text-navy">DNA confirmed<select name="dnaConfirmed" defaultValue={dog.dnaConfirmed ?? "UNKNOWN"} className="rounded-2xl p-3"><option value="UNKNOWN">Not provided</option><option value="YES">Yes</option><option value="NO">No</option></select></label>
          <label className="grid gap-2 font-bold text-navy">Date of birth<input type="date" name="dateOfBirth" defaultValue={dog.dateOfBirth?.toISOString().slice(0, 10) ?? ""} className="rounded-2xl p-3" /></label>
          <input type="hidden" name="estimatedDobPresent" value="true" />
          <label className="flex items-center gap-2 font-bold text-navy"><input type="checkbox" name="estimatedDob" defaultChecked={dog.estimatedDob} />Date of birth is estimated</label>
          <label className="grid gap-2 font-bold text-navy">Sex<select name="sex" defaultValue={dog.sex ?? ""} className="rounded-2xl p-3"><option value="">Not provided</option>{sexOptions.map((sex) => <option key={sex} value={sex}>{sex}</option>)}{dog.sex && !sexOptions.includes(dog.sex as (typeof sexOptions)[number]) && <option value={dog.sex}>{dog.sex}</option>}</select></label>
          <label className="grid gap-2 font-bold text-navy">Colour<input name="colour" defaultValue={dog.colour ?? ""} className="rounded-2xl p-3" /></label>
          <label className="grid gap-2 font-bold text-navy">Country of registration<input name="countryOfRegistration" defaultValue={dog.countryOfRegistration ?? ""} className="rounded-2xl p-3" /></label>
          <label className="grid gap-2 font-bold text-navy">Visibility<select name="visibility" defaultValue={dog.visibility} className="rounded-2xl p-3"><option value="PUBLIC">Public registry identity</option><option value="PRIVATE">Private to your account</option><option value="LINK_ONLY">Link only</option></select></label>
        </div>
        <fieldset className="rounded-[1.5rem] border border-navy/10 p-4"><legend className="px-2 font-bold text-navy">Dog type</legend><input type="hidden" name="dogTypesPresent" value="true" /><div className="flex flex-wrap gap-3">{dogTypes.map((type) => <label key={type} className="rounded-full bg-lightgrey px-4 py-2 font-bold text-navy"><input type="checkbox" name="dogTypes" value={type} defaultChecked={splitList(dog.dogTypes).includes(type)} className="mr-2" />{type}</label>)}</div></fieldset>
        <FormSubmitButton label="Save pet details" />
      </ManagedForm>
    </Card></Section>}

    <Section eyebrow="Owner essentials" title="Identification & vaccinations">
      <div id="identification" className="grid gap-5 lg:grid-cols-2"><Card><h3 className="text-2xl font-bold text-navy">Identification</h3><p className="mt-2 text-charcoal/65">These permanent details do not expire.</p><dl className="mt-4 grid gap-3"><div className="rounded-2xl bg-lightgrey p-3"><dt>Microchip number</dt><dd className="mt-1 font-bold">{dog.microchipNumber ?? "Not provided"}</dd></div><div className="rounded-2xl bg-lightgrey p-3"><dt>Breed</dt><dd className="mt-1 font-bold">{breedSummary(dog)}</dd></div><div className="rounded-2xl bg-lightgrey p-3"><dt>Colour / markings</dt><dd className="mt-1 font-bold">{dog.colour ?? "Not provided"}</dd></div></dl></Card><Card><h3 className="text-2xl font-bold text-navy">Practical health information</h3><p className="mt-2 text-charcoal/65">A simple owner summary, not a full veterinary record.</p>{canManage && <ManagedForm action={updateOwnerEssentials} className="mt-4 grid gap-3"><input type="hidden" name="dogId" value={dog.id} /><label className="grid gap-1 font-bold">Microchip number<input name="microchipNumber" defaultValue={dog.microchipNumber ?? ""} className="rounded-2xl p-3" /></label><label className="grid gap-1 font-bold">Vaccinated<select name="vaccinated" defaultValue={dog.vaccinated} className="rounded-2xl p-3"><option value="UNKNOWN">Not provided</option><option value="YES">Yes</option><option value="NO">No</option></select></label><label className="grid gap-1 font-bold">Last vaccination date<input type="date" name="lastVaccinationDate" defaultValue={dog.lastVaccinationDate?.toISOString().slice(0, 10) ?? ""} className="rounded-2xl p-3" /></label><FormSubmitButton label="Save identification and vaccination details" /></ManagedForm>}</Card></div>
    </Section>

    <Section eyebrow="Trust foundation" title={`${dog.name}'s structured records`}>
      <div id="records" className="grid gap-5 lg:grid-cols-[1fr_auto]"><ProfileCompletionCard percentage={completeness.percentage} sections={completeness.sections} /><Card className="lg:min-w-64"><p className="text-sm font-bold uppercase tracking-[0.2em] text-info">Records Overview</p><p className="mt-2 text-2xl font-bold text-navy">{dog.records.length} records</p><p className="mt-2 text-sm text-charcoal/60">{verifiedCount} verified · {submittedCount} submitted · {ownerDeclaredCount} owner declared</p></Card></div>
      {canManage && <div className="mt-5"><AddRecordForm dogId={dog.id} /></div>}
      <div className="mt-7 grid gap-5">{allRecordCategories.map((category) => <div id={`records-${category.toLowerCase().replace(/_/g, "-")}`} key={category}><CategorySection category={category} records={dog.records.filter((record) => record.category === category)} canManage={canManage} /></div>)}</div>
    </Section>

    <Section eyebrow="Behaviour & Lifestyle" title="Welfare and compatibility overview">
      <div id="behaviour" className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"><Card><StatusBadge status={behaviourTrustStatus} label={behaviourTrust} /><p className="mt-4 leading-7 text-charcoal/65">Complete this section, then press Save behaviour and lifestyle.</p>{canManage && <ManagedForm action={updateBehaviourLifestyle} className="mt-5 grid gap-3"><input type="hidden" name="dogId" value={dog.id} />{behaviourQuestions.map((question) => <label key={String(question.name)} className="grid gap-1 text-sm font-bold text-navy">{question.label}<select name={String(question.name)} defaultValue={String(dog.behaviourLifestyle?.[question.name] ?? "UNKNOWN")} className="rounded-2xl border border-navy/10 bg-white p-3"><option value="UNKNOWN">Unknown</option><option value="YES">Yes</option><option value="NO">No</option></select></label>)}<FormSubmitButton label="Save behaviour and lifestyle" /></ManagedForm>}</Card><Card><div className="grid gap-3 sm:grid-cols-2">{behaviourQuestions.map((question) => <div key={String(question.name)} className="rounded-2xl bg-lightgrey p-3"><p className="text-xs font-bold uppercase tracking-widest text-charcoal/45">{question.label}</p><p className="mt-1 font-bold text-navy">{formatAnswer(String(dog.behaviourLifestyle?.[question.name] ?? "UNKNOWN"))}</p></div>)}</div></Card></div>
    </Section>

    <Section eyebrow="Identity history" title="Ownership record">
      <div id="history"><Card><h3 className="text-2xl font-bold text-navy">Ownership</h3>{primaryOwner ? <div className="mt-4 rounded-2xl bg-lightgrey p-4"><p className="text-sm font-bold uppercase tracking-widest text-charcoal/45">Current owner</p><p className="mt-1 font-bold text-navy">{owner?.displayName} (@{owner?.username})</p><p className="mt-1 text-sm font-bold text-charcoal/60">Recorded {formatDate(primaryOwner.createdAt)}</p></div> : <p className="mt-3 text-charcoal/65">No ownership record is available.</p>}</Card></div>
    </Section>

    <nav aria-label="Page navigation" className="fixed bottom-24 right-4 z-20 flex gap-2 lg:bottom-6"><a href="#records" className="rounded-full bg-white px-4 py-3 text-sm font-bold text-navy shadow-lg ring-1 ring-navy/10">Back to records</a><a href="#top" aria-label="Scroll to top" className="rounded-full bg-navy px-4 py-3 text-sm font-bold text-white shadow-lg">↑ Top</a></nav>
  </>;
}
