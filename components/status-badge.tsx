const badgeStyles: Record<string, string> = {
  VERIFIED: "border-verified/30 bg-verified/10 text-verified",
  APPROVED: "border-verified/30 bg-verified/10 text-verified",
  PENDING: "border-award/25 bg-award/10 text-award",
  SUBMITTED: "border-award/25 bg-award/10 text-award",
  UNDER_REVIEW: "border-info/25 bg-info/10 text-info",
  DRAFT: "border-muted bg-lightgrey text-slate",
  NOT_SUBMITTED: "border-muted bg-lightgrey text-slate",
  REJECTED: "border-danger/25 bg-danger/10 text-danger",
  SUSPENDED: "border-danger/25 bg-danger/10 text-danger",
  HAVE_RECORD: "border-info/25 bg-info/10 text-info",
  DO_NOT_HAVE: "border-muted bg-white text-slate",
  COMING_SOON: "border-muted bg-lightgrey text-slate",
  FOUNDATION: "border-skysoft bg-skysoft/50 text-navy",
  AWARD: "border-award/25 bg-award/10 text-award",
  CHAMPION: "border-award/25 bg-award/10 text-award",
  LEGACY: "border-muted bg-lightgrey text-slate",
};

export function humanizeStatus(value: string) {
  return value.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] ${badgeStyles[status] ?? "border-muted bg-lightgrey text-navy"}`}>{label ?? humanizeStatus(status)}</span>;
}
