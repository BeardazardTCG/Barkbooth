import { Card } from "@/components/ui";
import type { CompletionSection } from "@/lib/profile-completeness";

export function ProgressBar({ value }: { value: number }) {
  return <div className="h-3 overflow-hidden rounded-full bg-lightgrey"><div className="h-full rounded-full bg-info" style={{ width: `${value}%` }} /></div>;
}

export function ProfileCompletionCard({ percentage, sections }: { percentage: number; sections: CompletionSection[] }) {
  const completed = sections.filter((section) => section.complete).length;
  return <Card><div className="flex items-end justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-info">Profile completeness</p><h3 className="mt-1 text-2xl font-bold text-navy">{percentage}% complete</h3></div><span className="text-sm font-bold text-charcoal/50">{completed}/{sections.length}</span></div><div className="mt-3"><ProgressBar value={percentage} /></div><details className="mt-3"><summary className="cursor-pointer text-sm font-bold text-info">View completion details</summary><div className="mt-3 grid gap-2 sm:grid-cols-2">{sections.map((section) => <div key={section.key} className="rounded-2xl bg-lightgrey p-3"><p className="font-bold text-navy">{section.complete ? "✓" : "○"} {section.label}</p><p className="mt-1 text-xs font-bold text-charcoal/55">{section.detail}</p></div>)}</div></details></Card>;
}
