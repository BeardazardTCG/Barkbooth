import type { Competition } from "@prisma/client";
import { Card } from "@/components/ui";
import { saveCompetition } from "@/lib/competitions/actions";
import { launchPhotoGuidelines } from "@/lib/launch-config";

function local(date: Date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

export function CompetitionForm({ competition }: { competition?: Competition }) {
  const suggestedOpening = new Date();
  suggestedOpening.setMinutes(0, 0, 0);
  suggestedOpening.setHours(suggestedOpening.getHours() + 1);
  const suggestedClosing = new Date(suggestedOpening);
  suggestedClosing.setDate(suggestedClosing.getDate() + 14);

  return <Card>
    <p className="mb-5 rounded-2xl bg-skysoft/50 p-4 text-sm font-bold leading-6 text-navy">
      Save as Draft while prizes, dates and entries are being checked. Published is visible before opening; Open accepts public entries. Closed, Judging, Completed and Cancelled do not accept entries.
    </p>
    <form action={saveCompetition} className="grid min-w-0 gap-4">
      <input type="hidden" name="id" value={competition?.id ?? ""} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid min-w-0 gap-1 font-bold">Title<input required maxLength={160} name="title" defaultValue={competition?.title ?? ""} className="min-w-0 rounded-2xl p-3" /></label>
        <label className="grid min-w-0 gap-1 font-bold">URL slug<input required maxLength={120} name="slug" defaultValue={competition?.slug ?? ""} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" className="min-w-0 rounded-2xl p-3" /><span className="text-xs font-normal text-charcoal/60">Lowercase letters, numbers and hyphens only.</span></label>
      </div>
      <label className="grid min-w-0 gap-1 font-bold">Theme<input required maxLength={160} name="theme" defaultValue={competition?.theme ?? ""} className="min-w-0 rounded-2xl p-3" /></label>
      <label className="grid min-w-0 gap-1 font-bold">Description<textarea required name="description" defaultValue={competition?.description ?? ""} className="min-h-28 min-w-0 rounded-2xl p-3" /></label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid min-w-0 gap-1 font-bold">Opens<input type="datetime-local" required name="opensAt" defaultValue={local(competition?.opensAt ?? suggestedOpening)} className="min-w-0 rounded-2xl p-3" /></label>
        <label className="grid min-w-0 gap-1 font-bold">Closes<input type="datetime-local" required name="closesAt" defaultValue={local(competition?.closesAt ?? suggestedClosing)} className="min-w-0 rounded-2xl p-3" /><span className="text-xs font-normal text-charcoal/60">New competitions default to a 14-day opening period.</span></label>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-1 font-bold">Competition status<select name="status" defaultValue={competition?.status ?? "DRAFT"} className="rounded-2xl p-3"><option value="DRAFT">Draft — private</option><option value="PUBLISHED">Published — visible, not open</option><option value="OPEN">Open — accepting entries</option><option value="CLOSED">Closed</option><option value="JUDGING">Judging</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option></select></label>
        <label className="grid gap-1 font-bold">Country eligibility<select name="eligibility" defaultValue={competition?.eligibility ?? "UK_ONLY"} className="rounded-2xl p-3"><option value="UK_ONLY">UK only</option><option value="INTERNATIONAL">International</option></select></label>
        <label className="grid gap-1 font-bold">Maximum entries per dog<input type="number" min="1" max="20" name="maxEntriesPerDog" defaultValue={competition?.maxEntriesPerDog ?? 1} className="rounded-2xl p-3" /></label>
      </div>
      <label className="grid min-w-0 gap-1 font-bold">Prize summary<textarea required name="prizeSummary" defaultValue={competition?.prizeSummary ?? ""} className="min-h-24 min-w-0 rounded-2xl p-3" /></label>
      <label className="grid max-w-xs gap-1 font-bold">Rules version<input required maxLength={40} name="rulesVersion" defaultValue={competition?.rulesVersion ?? "1"} className="rounded-2xl p-3" /></label>
      <label className="grid min-w-0 gap-1 font-bold">Competition rules<textarea required name="rules" defaultValue={competition?.rules ?? ""} className="min-h-36 min-w-0 rounded-2xl p-3" /></label>
      <label className="grid min-w-0 gap-1 font-bold">Image guidelines<textarea required name="imageGuidelines" defaultValue={competition?.imageGuidelines ?? launchPhotoGuidelines} className="min-h-36 min-w-0 rounded-2xl p-3" /></label>
      <button className="button-primary w-full sm:w-auto" type="submit">Save competition settings</button>
    </form>
  </Card>;
}
