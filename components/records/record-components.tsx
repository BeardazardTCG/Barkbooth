import type { DogRecord, DogRecordCategory } from "@prisma/client";
import { addDogRecord, removeDogRecord, updateDogRecord } from "@/lib/dogs/actions";
import { recordCategories, recordCategoryLabels, initialRecordTypes } from "@/lib/records/catalog";
import { Card } from "@/components/ui";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";

function dateValue(date: Date | null) { return date ? date.toISOString().slice(0, 10) : ""; }
function displayDate(date: Date | null) { return date ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" }).format(date) : "Not provided"; }

function RecordFields({ record }: { record?: DogRecord }) {
  return <div className="grid gap-3 md:grid-cols-2">
    <label className="grid gap-1 text-sm font-bold text-cocoa">Category<select name="category" defaultValue={record?.category ?? "IDENTITY"} className="rounded-2xl border border-cocoa/10 bg-white p-3">{recordCategories.map((category) => <option key={category} value={category}>{recordCategoryLabels[category]}</option>)}</select></label>
    <label className="grid gap-1 text-sm font-bold text-cocoa">Record type<input name="recordType" required defaultValue={record?.recordType ?? ""} list="record-types" className="rounded-2xl border border-cocoa/10 bg-white p-3" /></label>
    <label className="grid gap-1 text-sm font-bold text-cocoa">Provider<input name="provider" defaultValue={record?.provider ?? ""} className="rounded-2xl border border-cocoa/10 bg-white p-3" /></label>
    <label className="grid gap-1 text-sm font-bold text-cocoa">Reference number<input name="referenceNumber" defaultValue={record?.referenceNumber ?? ""} className="rounded-2xl border border-cocoa/10 bg-white p-3" /></label>
    <label className="grid gap-1 text-sm font-bold text-cocoa">Owner statement<select name="status" defaultValue={record?.status ?? "HAVE_RECORD"} className="rounded-2xl border border-cocoa/10 bg-white p-3"><option value="HAVE_RECORD">I have this record</option><option value="DO_NOT_HAVE">I don't have this record</option></select></label>
    <div className="rounded-2xl bg-biscuit/40 p-3 text-sm font-bold text-charcoal/65">Verification is not owner-editable yet. New records start as Not Submitted.</div>
    <label className="grid gap-1 text-sm font-bold text-cocoa">Issue date<input type="date" name="issueDate" defaultValue={dateValue(record?.issueDate ?? null)} className="rounded-2xl border border-cocoa/10 bg-white p-3" /></label>
    <label className="grid gap-1 text-sm font-bold text-cocoa">Expiry date<input type="date" name="expiryDate" defaultValue={dateValue(record?.expiryDate ?? null)} className="rounded-2xl border border-cocoa/10 bg-white p-3" /></label>
    <label className="grid gap-1 text-sm font-bold text-cocoa md:col-span-2">Notes<textarea name="notes" defaultValue={record?.notes ?? ""} className="min-h-20 rounded-2xl border border-cocoa/10 bg-white p-3" /></label>
    <datalist id="record-types">{initialRecordTypes.map((type) => <option key={`${type.category}-${type.recordType}`} value={type.recordType} />)}</datalist>
  </div>;
}

export function AddRecordForm({ dogId }: { dogId: string }) {
  return <Card><h3 className="text-2xl font-black text-navy">Add Record</h3><p className="mt-2 text-sm font-bold text-charcoal/60">State whether a record exists. Uploads and automated verification are intentionally not part of this foundation.</p><form action={addDogRecord} className="mt-4 grid gap-4"><input type="hidden" name="dogId" value={dogId} /><RecordFields /><button className="rounded-full bg-cocoa px-5 py-3 text-sm font-black text-white" type="submit">Add Record</button></form></Card>;
}

export function RecordCard({ record, canManage }: { record: DogRecord; canManage: boolean }) {
  return <Card><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-widest text-terracotta">{recordCategoryLabels[record.category]}</p><h4 className="mt-1 text-xl font-black text-navy">{record.recordType}</h4>{record.provider && <p className="font-bold text-charcoal/60">Provider: {record.provider}</p>}</div><div className="flex flex-wrap gap-2"><StatusBadge status={record.status} label={record.status === "HAVE_RECORD" ? "I have this" : "I don't have this"} /><StatusBadge status={record.verificationStatus} /></div></div><dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2"><div className="rounded-2xl bg-lightgrey p-3"><dt className="font-black text-charcoal/45">Reference</dt><dd className="font-bold text-cocoa">{record.referenceNumber ?? "Not provided"}</dd></div><div className="rounded-2xl bg-lightgrey p-3"><dt className="font-black text-charcoal/45">Valid dates</dt><dd className="font-bold text-cocoa">{displayDate(record.issueDate)} → {displayDate(record.expiryDate)}</dd></div></dl>{record.notes && <p className="mt-3 rounded-2xl bg-biscuit/40 p-3 text-sm font-bold text-charcoal/70">{record.notes}</p>}{canManage && <details className="mt-4 rounded-2xl bg-lightgrey p-4"><summary className="cursor-pointer font-black text-cocoa">Edit Record</summary><form action={updateDogRecord} className="mt-4 grid gap-4"><input type="hidden" name="recordId" value={record.id} /><RecordFields record={record} /><button className="rounded-full bg-cocoa px-5 py-3 text-sm font-black text-white" type="submit">Save Record</button></form><form action={removeDogRecord} className="mt-3"><input type="hidden" name="recordId" value={record.id} /><button className="rounded-full bg-white px-5 py-3 text-sm font-black text-red-700" type="submit">Remove Record</button></form></details>}</Card>;
}

export function CategorySection({ category, records, canManage }: { category: DogRecordCategory; records: DogRecord[]; canManage: boolean }) {
  return <div><h3 className="text-2xl font-black text-navy">{recordCategoryLabels[category]}</h3><div className="mt-3 grid gap-4 md:grid-cols-2">{records.length ? records.map((record) => <RecordCard key={record.id} record={record} canManage={canManage} />) : <EmptyState title={`No ${recordCategoryLabels[category]} records yet`}>Owners can add statements for this category when they are ready.</EmptyState>}</div></div>;
}
