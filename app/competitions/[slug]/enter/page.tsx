import { notFound } from "next/navigation";
import { FileField, FormSubmitButton, ManagedForm } from "@/components/forms/managed-form";
import { ProfileReadinessStrip } from "@/components/profile-readiness-strip";
import { Card, Section } from "@/components/ui";
import { requireUser } from "@/lib/auth/session";
import { competitionAcceptsEntries, competitionCountryEligibility } from "@/lib/competitions";
import { enterCompetition } from "@/lib/competitions/actions";
import { prisma } from "@/lib/prisma";

export default async function CompetitionEntryPage({ params }: { params: { slug: string } }) {
  const user = await requireUser();
  const [competition, dogs] = await Promise.all([
    prisma.competition.findUnique({ where: { slug: params.slug } }),
    prisma.dogIdentity.findMany({
      where: { ownerships: { some: { userId: user.id } } },
      include: { records: true, behaviourLifestyle: true, profilePhoto: true },
      orderBy: { name: "asc" },
    }),
  ]);
  if (!competition) notFound();
  const adminDraft = user.role === "ADMIN" && competition.status === "DRAFT";
  if (!adminDraft && !competitionAcceptsEntries(competition.status, competition.opensAt, competition.closesAt)) notFound();
  const eligible = competitionCountryEligibility(competition.eligibility, user.country);

  return <Section eyebrow="Competition entry" title={`Enter ${competition.title}`}><a href={`/competitions/${competition.slug}`} className="mb-4 inline-block font-bold text-info">← Back to competition</a><div className="mb-5 flex items-center gap-4 rounded-2xl bg-navy p-4 text-white">{competition.heroStorageKey&&<img src={`/api/competition-hero/${competition.id}`} alt="Competition artwork thumbnail" className={`h-20 w-28 rounded-xl bg-white/10 ${competition.heroImageType === "PHOTOGRAPH" ? "object-cover" : "object-contain"}`}/>}<div><strong className="block text-lg">{competition.title}</strong><span className="text-sm">Closes {competition.closesAt.toLocaleString("en-GB",{day:"numeric",month:"short",year:"numeric",hour:"numeric",minute:"2-digit",hour12:true})}</span></div></div>
    <div className="mb-5 grid gap-3">{dogs.map((dog) => <ProfileReadinessStrip key={dog.id} dog={dog} />)}</div>
    <Card>
      <p className={`mb-5 rounded-2xl p-4 font-bold leading-6 ${eligible ? "bg-skysoft/50 text-navy" : "bg-amber-50 text-amber-900"}`}>
        {eligible ? "Your account location meets this competition’s country eligibility." : "Initial physical-prize competitions are UK-only. Bark Booth profiles are international, and you may still add profile details and external evidence."}
      </p>
      {dogs.length === 0 ? <p className="font-bold text-navy">Register a dog before entering this competition.</p> : <ManagedForm action={enterCompetition} encType="multipart/form-data" className="grid min-w-0 gap-4">
        <input type="hidden" name="competitionId" value={competition.id} />
        <label className="grid gap-1 font-bold text-navy">Your registered dog<select name="dogId" required className="rounded-2xl p-3"><option value="">Choose your dog</option>{dogs.map((dog) => <option key={dog.id} value={dog.id}>{dog.name} · {dog.registryNumber}</option>)}</select></label>
        <FileField name="photo" label="Competition photograph" accept="image/jpeg,image/png,image/webp" maxBytes={5 * 1024 * 1024} required />
        <label className="grid min-w-0 gap-1 font-bold text-navy">Caption (optional)<textarea name="caption" maxLength={300} className="min-w-0 rounded-2xl p-3" /></label>
        <fieldset className="grid gap-3 rounded-2xl bg-lightgrey p-4"><legend className="px-2 font-bold text-navy">Required confirmations</legend>
          <label className="flex items-start gap-3"><input className="mt-1" type="checkbox" name="photoCompliance" required /><span>I confirm this genuine photograph follows the photo guidelines, matches the theme and is not AI-generated, AI-enhanced or heavily manipulated.</span></label>
          <label className="flex items-start gap-3"><input className="mt-1" type="checkbox" name="rulesAccepted" required /><span>I accept competition rules version {competition.rulesVersion}.</span></label>
          <label className="flex items-start gap-3"><input className="mt-1" type="checkbox" name="imageConsent" required /><span>I have the right to submit this image and consent to its competition display.</span></label>
        </fieldset>
        <FormSubmitButton label="Submit free competition entry" pendingLabel="Submitting entry…" requireDirty={false} className="w-full sm:w-auto" />
      </ManagedForm>}
    </Card>
  </Section>;
}
