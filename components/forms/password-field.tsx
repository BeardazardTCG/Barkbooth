"use client";

import { useState } from "react";

export function PasswordField({ name, label, autoComplete, minLength, className = "rounded-2xl border border-navy/10 p-3" }: { name: string; label: string; autoComplete: "current-password" | "new-password"; minLength?: number; className?: string }) {
  const [visible, setVisible] = useState(false);
  return <label className="grid gap-1 text-sm font-bold text-navy">
    {label}
    <span className="relative">
      <input name={name} type={visible ? "text" : "password"} required minLength={minLength} maxLength={128} autoComplete={autoComplete} className={`${className} w-full pr-20`} />
      <button type="button" aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`} aria-pressed={visible} onClick={() => setVisible((value) => !value)} className="absolute inset-y-1 right-1 rounded-xl px-3 text-xs font-bold text-info">{visible ? "Hide" : "Show"}</button>
    </span>
  </label>;
}
