"use client";

import { FormSubmitButton, ManagedForm } from "@/components/forms/managed-form";
import { PasswordField } from "@/components/forms/password-field";
import { resetPassword } from "@/lib/auth/actions";

export function ResetPasswordForm({ token }: { token: string }) {
  return <ManagedForm action={resetPassword} className="grid gap-4" warnOnLeave={false} pendingMessage="Resetting password…">
    <input type="hidden" name="token" value={token} />
    <PasswordField name="password" label="New password" autoComplete="new-password" minLength={8} />
    <PasswordField name="passwordConfirm" label="Confirm new password" autoComplete="new-password" minLength={8} />
    <FormSubmitButton label="Reset password" pendingLabel="Resetting…" />
  </ManagedForm>;
}
