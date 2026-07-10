const badgeStyles: Record<string, string> = {
  VERIFIED: "border-verified/25 bg-verified/10 text-verified",
  APPROVED: "border-verified/25 bg-verified/10 text-verified",
  PENDING: "border-award/30 bg-award/10 text-award",
  SUBMITTED: "border-award/30 bg-award/10 text-award",
  UNDER_REVIEW: "border-info/25 bg-info/10 text-info",
  DRAFT: "border-muted bg-muted/70 text-slate",
  NOT_SUBMITTED: "border-muted bg-muted/70 text-slate",
  REJECTED: "border-danger/25 bg-danger/10 text-danger",
  SUSPENDED: "border-danger/25 bg-danger/10 text-danger",
  HAVE_RECORD: "border-info/25 bg-info/10 text-info",
  DO_NOT_HAVE: "border-muted bg-white text-slate",
  COMING_SOON: "border-muted bg-muted/70 text-slate",
  FOUNDATION: "border-sand bg-sand/25 text-navy",
  PREVIEW: "border-rosette/25 bg-rosette/10 text-rosette",
  AWARD: "border-award/30 bg-award/10 text-award",
  CHAMPION: "border-award/30 bg-award/10 text-award",
  LEGACY: "border-muted bg-muted/70 text-slate",
};

export function humanizeStatus(value: string) {
  return value.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] ${badgeStyles[status] ?? "border-muted bg-muted/70 text-navy"}`}>{label ?? humanizeStatus(status)}</span>;
}
