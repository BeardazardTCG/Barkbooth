import { Card } from "@/components/ui";
import type { CompletionSection } from "@/lib/profile-completeness";

export function ProgressBar({ value }: { value: number }) {
  return <div className="h-3 overflow-hidden rounded-full bg-lightgrey"><div className="h-full rounded-full bg-info" style={{ width: `${value}%` }} /></div>;
}

export function ProfileCompletionCard({ percentage, sections }: { percentage: number; sections: CompletionSection[] }) {
  return <Card><p className="text-sm font-bold uppercase tracking-[0.2em] text-info">Profile completeness</p><div className="mt-2 flex items-end justify-between gap-3"><h3 className="text-3xl font-bold text-navy">{percentage}% Complete</h3><span className="text-sm font-bold text-charcoal/50">{sections.filter((section) => section.complete).length}/{sections.length}</span></div><div className="mt-4"><ProgressBar value={percentage} /></div><div className="mt-5 grid gap-2 sm:grid-cols-2">{sections.map((section) => <div key={section.key} className="rounded-2xl bg-lightgrey p-3"><p className="font-bold text-navy">{section.complete ? "✓" : "○"} {section.label}</p><p className="mt-1 text-xs font-bold text-charcoal/55">{section.detail}</p></div>)}</div></Card>;
}
