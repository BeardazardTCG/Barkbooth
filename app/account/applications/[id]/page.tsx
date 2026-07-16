import { notFound } from "next/navigation";
import { ApplicationStatusBadge } from "@/components/roles";
import { Card, Section } from "@/components/ui";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { submitApplication, updateApplicationDraft, withdrawApplication } from "@/lib/role-applications/actions";
import { formatRole } from "@/lib/roles";

const withdrawableStatuses = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "REJECTED"];

export default async function ApplicationPage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const app = await prisma.roleApplication.findFirst({ where: { id: params.id, userId: user.id } });
  if (!app) notFound();

  const editable = ["DRAFT", "REJECTED"].includes(app.status);
  const canWithdraw = withdrawableStatuses.includes(app.status);

  return <Section eyebrow="Role application" title={`${formatRole(app.requestedRole)} application`}>
    <Card>
      <div className="mb-5 flex justify-between gap-3">
        <ApplicationStatusBadge status={app.status} />
        <p className="text-sm font-bold text-charcoal/60">Only you and Bark Booth reviewers can see this application.</p>
      </div>

      <form action={updateApplicationDraft} className="grid gap-4">
        <input type="hidden" name="applicationId" value={app.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-bold text-navy">Organisation or business name<input name="organisationName" defaultValue={app.organisationName ?? ""} disabled={!editable} className="rounded-2xl border border-navy/10 p-3" /></label>
          <label className="grid gap-1 text-sm font-bold text-navy">Public display name<input name="publicDisplayName" defaultValue={app.publicDisplayName ?? ""} disabled={!editable} className="rounded-2xl border border-navy/10 p-3" /></label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-bold text-navy">Website or social link<input name="website" defaultValue={app.website ?? ""} disabled={!editable} className="rounded-2xl border border-navy/10 p-3" /></label>
          <label className="grid gap-1 text-sm font-bold text-navy">Private contact email<input name="email" type="email" defaultValue={app.email ?? ""} disabled={!editable} className="rounded-2xl border border-navy/10 p-3" /></label>
        </div>
        <label className="flex gap-2 text-sm font-bold text-charcoal/70"><input type="checkbox" name="showEmailPublicly" defaultChecked={app.showEmailPublicly} disabled={!editable} /> Show this email publicly if this application is approved.</label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-bold text-navy">Phone optional<input name="phone" defaultValue={app.phone ?? ""} disabled={!editable} className="rounded-2xl border border-navy/10 p-3" /></label>
          <label className="grid gap-1 text-sm font-bold text-navy">Service area or location<input name="serviceArea" defaultValue={app.serviceArea ?? ""} disabled={!editable} className="rounded-2xl border border-navy/10 p-3" /></label>
        </div>
        {app.requestedRole === "PROFESSIONAL" && <label className="grid gap-1 text-sm font-bold text-navy">Professional category<select name="professionalCategory" defaultValue={app.professionalCategory ?? ""} disabled={!editable} className="rounded-2xl border border-navy/10 p-3"><option value="">Select a category</option><option value="TRAINER">Trainer</option><option value="GROOMER">Groomer</option><option value="DOG_WALKER">Dog Walker</option><option value="BEHAVIOURIST">Behaviourist</option><option value="PHOTOGRAPHER">Photographer</option><option value="VETERINARY_CARE">Veterinary/Care</option><option value="OTHER">Other</option></select></label>}
        {app.requestedRole === "BREEDER" && <label className="grid gap-1 text-sm font-bold text-navy">Breed(s)<input name="breeds" defaultValue={app.breeds ?? ""} disabled={!editable} className="rounded-2xl border border-navy/10 p-3" /></label>}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-bold text-navy">Registration details<input name="registrationNumber" defaultValue={app.registrationNumber ?? ""} disabled={!editable} className="rounded-2xl border border-navy/10 p-3" /></label>
          <label className="grid gap-1 text-sm font-bold text-navy">Charity number<input name="charityNumber" defaultValue={app.charityNumber ?? ""} disabled={!editable} className="rounded-2xl border border-navy/10 p-3" /></label>
        </div>
        <label className="grid gap-1 text-sm font-bold text-navy">Qualifications<textarea name="qualifications" defaultValue={app.qualifications ?? ""} disabled={!editable} className="min-h-24 rounded-2xl border border-navy/10 p-3" /></label>
        <label className="grid gap-1 text-sm font-bold text-navy">Insurance details<textarea name="insuranceDetails" defaultValue={app.insuranceDetails ?? ""} disabled={!editable} className="min-h-24 rounded-2xl border border-navy/10 p-3" /></label>
        <label className="grid gap-1 text-sm font-bold text-navy">Description<textarea name="description" defaultValue={app.description ?? ""} disabled={!editable} className="min-h-28 rounded-2xl border border-navy/10 p-3" /></label>
        <label className="grid gap-1 text-sm font-bold text-navy">Evidence or verification notes<textarea name="evidenceNotes" defaultValue={app.evidenceNotes ?? ""} disabled={!editable} className="min-h-28 rounded-2xl border border-navy/10 p-3" /></label>
        {editable && <button className="rounded-full bg-navy px-5 py-3 text-sm font-bold text-white" type="submit">Save draft</button>}
      </form>

      {editable && <form action={submitApplication} className="mt-3"><input type="hidden" name="applicationId" value={app.id} /><button className="rounded-full bg-info px-5 py-3 text-sm font-bold text-white">Submit for Bark Booth review</button></form>}
      {canWithdraw && <form action={withdrawApplication} className="mt-3"><input type="hidden" name="applicationId" value={app.id} /><button className="rounded-full bg-white px-5 py-3 text-sm font-bold text-navy">Withdraw application</button></form>}
    </Card>
  </Section>;
}
