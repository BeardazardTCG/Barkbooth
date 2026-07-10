import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui";
import { formatRole, verifiedRoleLabels } from "@/lib/roles";
import type { ProfessionalCategory, RequestedRole, RoleApplicationStatus } from "@prisma/client";

function safePublicUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function RoleBadge({ label, verified = false }: { label: string; verified?: boolean }) {
  return <span className={`rounded-full px-4 py-2 text-sm font-bold ${verified ? "bg-emerald-100 text-emerald-800" : "bg-lightgrey text-navy"}`}>{label}</span>;
}

export function VerificationBadge({ role }: { role: RequestedRole }) {
  return <RoleBadge label={verifiedRoleLabels[role]} verified />;
}

export function ApplicationStatusBadge({ status }: { status: RoleApplicationStatus }) {
  return <StatusBadge status={status} />;
}

export function AccountRoleSummary({ ownerStatuses, applications }: { ownerStatuses: { status: string }[]; applications: { requestedRole: RequestedRole; status: RoleApplicationStatus }[] }) {
  const petOwner = ownerStatuses.some((s) => s.status === "PET_OWNER");
  const legacy = ownerStatuses.filter((s) => s.status !== "PET_OWNER");
  const approved = applications.filter((a) => a.status === "APPROVED");
  const pending = applications.filter((a) => ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "REJECTED", "SUSPENDED"].includes(a.status));
  return <div className="flex flex-wrap gap-2"><RoleBadge label="Bark Booth Member" />{petOwner && <RoleBadge label="Pet Owner" />}{approved.map((a) => <VerificationBadge key={a.requestedRole} role={a.requestedRole} />)}{legacy.map((status) => <RoleBadge key={status.status} label={`${formatRole(status.status as RequestedRole)} — legacy unverified`} />)}{pending.map((app) => <span key={`${app.requestedRole}-${app.status}`} className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900">{formatRole(app.requestedRole)} application — {app.status.toLowerCase().replace(/_/g, " ")}</span>)}</div>;
}

export function RoleApplicationCard({ app }: { app: { id: string; requestedRole: RequestedRole; status: RoleApplicationStatus; submittedAt: Date | null; rejectionReason: string | null } }) {
  return <Card><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-xl font-bold text-navy">{formatRole(app.requestedRole)} application</h3><p className="mt-1 text-sm font-bold text-charcoal/60">{app.submittedAt ? `Submitted ${app.submittedAt.toLocaleDateString("en-GB")}` : "Draft not submitted"}</p>{app.rejectionReason && <p className="mt-3 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-800">{app.rejectionReason}</p>}</div><ApplicationStatusBadge status={app.status} /></div><Link href={`/account/applications/${app.id}`} className="mt-4 inline-flex rounded-full bg-navy px-5 py-3 text-sm font-bold text-white">{app.status === "DRAFT" || app.status === "REJECTED" ? "Continue application" : "View application"}</Link></Card>;
}

export function DirectoryListingCard({ listing }: { listing: { publicDisplayName: string | null; organisationName: string | null; professionalCategory: ProfessionalCategory | null; description: string | null; serviceArea: string | null; website: string | null; email: string | null; showEmailPublicly: boolean } }) {
  const website = safePublicUrl(listing.website);
  return <Card><VerificationBadge role="PROFESSIONAL" /><h3 className="mt-3 text-2xl font-bold text-navy">{listing.publicDisplayName || listing.organisationName}</h3>{listing.professionalCategory && <p className="mt-1 font-bold text-rosette">{listing.professionalCategory.toLowerCase().replace(/_/g, " ")}</p>}<p className="mt-3 leading-7 text-charcoal/65">{listing.description}</p><div className="mt-4 grid gap-2 text-sm font-bold text-charcoal/65">{listing.serviceArea && <span>Service area: {listing.serviceArea}</span>}{website && <a className="text-rosette" href={website}>Website</a>}{listing.showEmailPublicly && listing.email && <a className="text-rosette" href={`mailto:${listing.email}`}>Contact</a>}</div></Card>;
}
