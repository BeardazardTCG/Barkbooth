import type { ReactNode } from "react";

export function EmptyState({ title, children }: { title: string; children: ReactNode }) {
  return <div className="rounded-[2rem] border border-dashed border-cocoa/20 bg-white/70 p-8 text-center"><div className="text-5xl">📋</div><h3 className="mt-3 text-2xl font-black text-navy">{title}</h3><p className="mx-auto mt-2 max-w-xl leading-7 text-charcoal/65">{children}</p></div>;
}
