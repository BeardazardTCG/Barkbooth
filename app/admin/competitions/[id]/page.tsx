import { notFound, redirect } from "next/navigation";
import { CompetitionForm } from "@/components/competition-admin-form";
import { Card, Section } from "@/components/ui";
import { requireUser } from "@/lib/auth/session";
import { moderateEntry, publishResult } from "@/lib/competitions/actions";
import { prisma } from "@/lib/prisma";

export default async function ManageCompetitionPage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/dashboard");
  const competition = await prisma.competition.findUnique({
    where: { id: params.id },
    include: { entries: { include: { dog: true }, orderBy: { submittedAt: "asc" } } },
  });
  if (!competition) notFound();

  return <>
    <Section eyebrow="Restricted administration" title={`Manage ${competition.title}`}>
      <CompetitionForm competition={competition} />
    </Section>
    <Section eyebrow="Genuine database entries" title={`Review entries (${competition.entries.length})`}>
      <p className="mb-5 rounded-2xl bg-skysoft/50 p-4 text-sm font-bold leading-6 text-navy">
        Review the image first. Use Withdrawn or Disqualified only with a reason. Mark an eligible entry Finalist or Winner before publishing its result; publishing a result completes the competition.
      </p>
      {competition.entries.length === 0 ? <Card><p className="font-bold text-navy">No entries have been submitted.</p></Card> : <div className="grid gap-5 lg:grid-cols-2">
        {competition.entries.map((entry) => <Card key={entry.id}>
          <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
            <img src={`/api/competition-images/${entry.id}`} alt={`${entry.dog.name} competition entry`} className="aspect-square w-full rounded-2xl object-cover" />
            <div className="min-w-0">
              <p className="registry-label">{entry.status}</p>
              <h2 className="mt-1 break-words text-xl font-bold text-navy">{entry.dog.name}</h2>
              <p className="mt-1 break-all text-sm font-bold text-info">{entry.dog.registryNumber}</p>
              <p className="mt-2 text-sm text-charcoal/65">Submitted {entry.submittedAt.toLocaleString("en-GB")} · profile {entry.profileCompleteness}% complete</p>
              {entry.caption && <p className="mt-2 text-sm">{entry.caption}</p>}
            </div>
          </div>
          <form action={moderateEntry} className="mt-5 grid min-w-0 gap-3 rounded-2xl bg-lightgrey p-4">
            <input type="hidden" name="entryId" value={entry.id} />
            <label className="grid gap-1 font-bold text-navy">Entry decision<select name="status" defaultValue={entry.status} className="rounded-xl bg-white p-3"><option value="SUBMITTED">Submitted — no decision</option><option value="WITHDRAWN">Withdrawn</option><option value="DISQUALIFIED">Disqualified</option><option value="FINALIST">Finalist</option><option value="WINNER">Winner</option></select></label>
            <label className="grid min-w-0 gap-1 font-bold text-navy">Decision reason<input name="reason" defaultValue={entry.moderationReason ?? ""} maxLength={500} placeholder="Required for withdrawal or disqualification" className="min-w-0 rounded-xl bg-white p-3" /></label>
            <button className="button-secondary w-full sm:w-auto" type="submit">Save entry decision</button>
          </form>
          {["FINALIST", "WINNER"].includes(entry.status) && <form action={publishResult} className="mt-4 grid min-w-0 gap-3 rounded-2xl border border-navy/10 p-4">
            <h3 className="font-bold text-navy">Publish result</h3>
            <p className="text-sm text-charcoal/65">This publishes the result and marks the competition Completed.</p>
            <input type="hidden" name="competitionId" value={competition.id} />
            <input type="hidden" name="entryId" value={entry.id} />
            <label className="grid gap-1 font-bold text-navy">Placement<input name="placement" type="number" min="1" required className="rounded-xl p-3" /></label>
            <label className="grid min-w-0 gap-1 font-bold text-navy">Result title<input name="title" required maxLength={160} placeholder="For example, First place" className="min-w-0 rounded-xl p-3" /></label>
            <label className="grid min-w-0 gap-1 font-bold text-navy">Judge notes (optional)<textarea name="judgeNotes" className="min-w-0 rounded-xl p-3" /></label>
            <button className="button-primary w-full sm:w-auto" type="submit">Publish result and complete competition</button>
          </form>}
        </Card>)}
      </div>}
    </Section>
  </>;
}
