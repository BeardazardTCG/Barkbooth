"use client";

import { FormSubmitButton, ManagedForm } from "@/components/forms/managed-form";
import { login } from "@/lib/auth/actions";

export function LoginForm() {
  return <ManagedForm action={login} className="grid gap-4" warnOnLeave={false} pendingMessage="Logging in…">
    <label className="font-bold text-navy">Email<input name="email" type="email" required autoComplete="email" className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3" /></label>
    <label className="font-bold text-navy">Password<input name="password" type="password" required autoComplete="current-password" className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3" /></label>
    <FormSubmitButton label="Log in" pendingLabel="Logging in…" />
  </ManagedForm>;
}
