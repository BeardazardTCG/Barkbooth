const badgeStyles: Record<string, string> = {
  VERIFIED: "bg-emerald-100 text-emerald-800",
  PENDING: "bg-amber-100 text-amber-800",
  NOT_SUBMITTED: "bg-lightgrey text-charcoal/70",
  REJECTED: "bg-red-100 text-red-800",
  HAVE_RECORD: "bg-blue-100 text-blue-800",
  DO_NOT_HAVE: "bg-white text-charcoal/60 border border-cocoa/10",
  COMING_SOON: "bg-purple-100 text-purple-800",
  FOUNDATION: "bg-biscuit text-cocoa",
  PREVIEW: "bg-pink/10 text-pink",
};

export function humanizeStatus(value: string) {
  return value.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${badgeStyles[status] ?? "bg-lightgrey text-cocoa"}`}>{label ?? humanizeStatus(status)}</span>;
}
