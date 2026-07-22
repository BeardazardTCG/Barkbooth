import type { DogRecord, DogRecordCategory, DogRecordDocument } from "@prisma/client";
import { addDogRecord, removeDogRecord, removeRecordDocument, updateDogRecord, uploadRecordDocument } from "@/lib/dogs/actions";
import { recordCategories, recordCategoryLabels, initialRecordTypes } from "@/lib/records/catalog";
import { Card } from "@/components/ui";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { FileField, FormSubmitButton, ManagedForm } from "@/components/forms/managed-form";

function dateValue(date: Date | null) { return date ? date.toISOString().slice(0, 10) : ""; }
function displayDate(date: Date | null) { return date ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" }).format(date) : "Not provided"; }

function RecordFields({ record }: { record?: DogRecord }) {
  return <div className="grid gap-3 md:grid-cols-2">
    <label className="grid gap-1 text-sm font-bold text-navy">Category<select name="category" defaultValue={record?.category ?? "IDENTITY"} className="rounded-2xl border border-navy/10 bg-white p-3">{recordCategories.map((category) => <option key={category} value={category}>{recordCategoryLabels[category]}</option>)}</select></label>
    <label className="grid gap-1 text-sm font-bold text-navy">Record type<input name="recordType" required defaultValue={record?.recordType ?? ""} list="record-types" className="rounded-2xl border border-navy/10 bg-white p-3" /></label>
    <label className="grid gap-1 text-sm font-bold text-navy">Provider<input name="provider" defaultValue={record?.provider ?? ""} className="rounded-2xl border border-navy/10 bg-white p-3" /></label>
    <label className="grid gap-1 text-sm font-bold text-navy">Reference number<input name="referenceNumber" defaultValue={record?.referenceNumber ?? ""} className="rounded-2xl border border-navy/10 bg-white p-3" /></label>
    <label className="grid gap-1 text-sm font-bold text-navy">Owner statement<select name="status" defaultValue={record?.status ?? "HAVE_RECORD"} className="rounded-2xl border border-navy/10 bg-white p-3"><option value="HAVE_RECORD">I have this record</option><option value="DO_NOT_HAVE">I don&apos;t have this record</option></select></label>
    <div className="rounded-2xl bg-skysoft/50 p-3 text-sm font-bold text-charcoal/65">Verification is not owner-editable yet. New records start as Not Submitted.</div>
    <label className="grid gap-1 text-sm font-bold text-navy">Issue date<input type="date" name="issueDate" defaultValue={dateValue(record?.issueDate ?? null)} className="rounded-2xl border border-navy/10 bg-white p-3" /></label>
    <label className="grid gap-1 text-sm font-bold text-navy">Expiry date<input type="date" name="expiryDate" defaultValue={dateValue(record?.expiryDate ?? null)} className="rounded-2xl border border-navy/10 bg-white p-3" /></label>
    <label className="grid gap-1 text-sm font-bold text-navy md:col-span-2">Notes<textarea name="notes" defaultValue={record?.notes ?? ""} className="min-h-20 rounded-2xl border border-navy/10 bg-white p-3" /></label>
    <datalist id="record-types">{initialRecordTypes.map((type) => <option key={`${type.category}-${type.recordType}`} value={type.recordType} />)}</datalist>
  </div>;
}

export function AddRecordForm({ dogId }: { dogId: string }) {
  return <Card><h3 className="text-2xl font-bold text-navy">Add Record</h3><p className="mt-2 text-sm font-bold text-charcoal/60">Complete this section, then press Add record. Documents can be attached afterward.</p><ManagedForm action={addDogRecord} resetOnSuccess className="mt-4 grid gap-4"><input type="hidden" name="dogId" value={dogId} /><RecordFields /><FormSubmitButton label="Add record" pendingLabel="Adding…" /></ManagedForm></Card>;
}

type RecordWithDocuments = DogRecord & { documents: DogRecordDocument[] };

function formatBytes(bytes: number) { return bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`; }

export function RecordCard({ record, canManage }: { record: RecordWithDocuments; canManage: boolean }) {
  return <Card><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-info">{recordCategoryLabels[record.category]}</p><h4 className="mt-1 text-xl font-bold text-navy">{record.recordType}</h4>{record.provider && <p className="font-bold text-charcoal/60">Provider: {record.provider}</p>}</div><div className="flex flex-wrap gap-2"><StatusBadge status={record.status} label={record.status === "HAVE_RECORD" ? "I have this" : "I don’t have this"} /><StatusBadge status={record.verificationStatus} /></div></div><dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2"><div className="rounded-2xl bg-lightgrey p-3"><dt className="font-bold text-charcoal/45">Reference</dt><dd className="font-bold text-navy">{record.referenceNumber ?? "Not provided"}</dd></div><div className="rounded-2xl bg-lightgrey p-3"><dt className="font-bold text-charcoal/45">Valid dates</dt><dd className="font-bold text-navy">{displayDate(record.issueDate)} → {displayDate(record.expiryDate)}</dd></div></dl>{record.notes && <p className="mt-3 rounded-2xl bg-skysoft/50 p-3 text-sm font-bold text-charcoal/70">{record.notes}</p>}<div className="mt-4 rounded-2xl border border-navy/10 p-4"><p className="text-sm font-bold text-navy">Documents ({record.documents.length})</p>{record.documents.length ? <ul className="mt-2 grid gap-2">{record.documents.map((document) => <li key={document.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-lightgrey p-3 text-sm"><a href={`/api/record-documents/${document.id}`} target="_blank" rel="noreferrer" className="min-w-0 break-all font-bold text-info hover:text-navy">{document.fileName} ({formatBytes(document.sizeBytes)})</a>{canManage && <ManagedForm action={removeRecordDocument} warnOnLeave={false} className="grid gap-2"><input type="hidden" name="documentId" value={document.id} /><FormSubmitButton label="Remove document" pendingLabel="Removing…" requireDirty={false} confirmMessage={`Remove ${document.fileName}? This cannot be undone.`} className="bg-white text-red-700" /></ManagedForm>}</li>)}</ul> : <p className="mt-2 text-sm text-charcoal/60">No documents attached.</p>}{canManage && <ManagedForm action={uploadRecordDocument} encType="multipart/form-data" resetOnSuccess className="mt-3 grid min-w-0 gap-3"><input type="hidden" name="recordId" value={record.id} /><FileField name="document" label="Choose document" required accept="application/pdf,image/jpeg,image/png,image/webp" maxBytes={10 * 1024 * 1024} /><FormSubmitButton label="Upload document" pendingLabel="Uploading…" /></ManagedForm>}</div>{canManage && <details className="mt-4 rounded-2xl bg-lightgrey p-4"><summary className="cursor-pointer font-bold text-navy">Edit record</summary><ManagedForm action={updateDogRecord} className="mt-4 grid gap-4"><input type="hidden" name="recordId" value={record.id} /><RecordFields record={record} /><FormSubmitButton label="Save record" /></ManagedForm><ManagedForm action={removeDogRecord} warnOnLeave={false} className="mt-3 grid gap-2"><input type="hidden" name="recordId" value={record.id} /><FormSubmitButton label="Remove record" pendingLabel="Removing…" requireDirty={false} confirmMessage={`Remove this record and its ${record.documents.length} attached document${record.documents.length === 1 ? "" : "s"}? This cannot be undone.`} className="bg-white text-red-700" /></ManagedForm></details>}</Card>;
}

export function CategorySection({ category, records, canManage }: { category: DogRecordCategory; records: RecordWithDocuments[]; canManage: boolean }) {
  return <div><h3 className="text-2xl font-bold text-navy">{recordCategoryLabels[category]}</h3><div className="mt-3 grid gap-4 md:grid-cols-2">{records.length ? records.map((record) => <RecordCard key={record.id} record={record} canManage={canManage} />) : <EmptyState title={`No ${recordCategoryLabels[category]} records yet`}>Owners can add statements for this category when they are ready.</EmptyState>}</div></div>;
}
