"use client";

import { FormSubmitButton, ManagedForm } from "@/components/forms/managed-form";
import { login } from "@/lib/auth/actions";
import { PasswordField } from "@/components/forms/password-field";

export function LoginForm() {
  return <ManagedForm action={login} className="grid gap-4" warnOnLeave={false} pendingMessage="Logging in…">
    <label className="font-bold text-navy">Email<input name="email" type="email" required autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3" /></label>
    <PasswordField name="password" label="Password" autoComplete="current-password" className="rounded-2xl border border-navy/10 px-4 py-3" />
    <label className="inline-flex items-center gap-2 text-sm font-bold text-charcoal/70"><input type="checkbox" name="remember" /> Remember me for 30 days</label>
    <FormSubmitButton label="Log in" pendingLabel="Logging in…" />
  </ManagedForm>;
}
