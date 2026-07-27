import Link from "next/link";
import { Card, Section } from "@/components/ui";
import { FormSubmitButton, ManagedForm } from "@/components/forms/managed-form";
import { requestPasswordReset } from "@/lib/auth/actions";

export default function ForgotPasswordPage() {
  return <Section eyebrow="Account recovery" title="Reset your password"><Card className="max-w-xl">
    <p className="mb-5 text-sm leading-6 text-charcoal/70">Enter your account email. If it matches an account, we will send a single-use link that expires in 30 minutes.</p>
    <ManagedForm action={requestPasswordReset} className="grid gap-4" warnOnLeave={false} resetOnSuccess pendingMessage="Sending reset link…">
      <label className="grid gap-1 font-bold text-navy">Email<input name="email" type="email" required autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} className="rounded-2xl border border-navy/10 p-3" /></label>
      <FormSubmitButton label="Send reset link" pendingLabel="Sending…" />
    </ManagedForm>
    <p className="mt-5 text-sm font-bold"><Link href="/login" className="text-info">Back to login</Link></p>
  </Card></Section>;
}
