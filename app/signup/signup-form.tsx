"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { signup } from "@/lib/auth/actions";

const statuses = [["PET_OWNER", "Pet Owner"], ["BREEDER", "Breeder"], ["RESCUE", "Rescue"], ["FOSTER", "Foster"], ["PROFESSIONAL", "Professional"]];

function Submit() {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="rounded-full bg-pink px-5 py-3 text-sm font-black text-white shadow-soft disabled:opacity-60">{pending ? "Creating..." : "Create account"}</button>;
}

export function SignupForm() {
  const [error, action] = useFormState(signup, null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordMismatch = Boolean(confirmPassword) && password !== confirmPassword;

  return <form action={action} onSubmit={(event) => {
    if (password !== confirmPassword) {
      event.preventDefault();
      event.currentTarget.reportValidity();
    }
  }} className="grid gap-4">
    {error && <p className="rounded-2xl bg-pink/10 p-3 text-sm font-black text-pink">{error}</p>}
    {passwordMismatch && <p className="rounded-2xl bg-pink/10 p-3 text-sm font-black text-pink">Passwords do not match yet.</p>}
    <div className="grid gap-4 md:grid-cols-2">
      <label className="font-black text-navy">Email<input name="email" type="email" required className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
      <label className="font-black text-navy">Password<input name="password" type={showPassword ? "text" : "password"} minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
      <label className="font-black text-navy">Confirm password<input name="passwordConfirm" type={showPassword ? "text" : "password"} minLength={8} required value={confirmPassword} onChange={(event) => { setConfirmPassword(event.target.value); event.target.setCustomValidity(password !== event.target.value ? "Passwords do not match." : ""); }} onBlur={(event) => event.target.setCustomValidity(password !== confirmPassword ? "Passwords do not match." : "")} className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
      <label className="flex items-end pb-3 font-bold text-charcoal/70"><input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} className="mr-2" />Show password</label>
      <label className="font-black text-navy">Display name<input name="displayName" required className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
      <label className="font-black text-navy">Username<input name="username" required className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
      <label className="font-black text-navy">Country<input name="country" required className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
    </div>
    <fieldset><legend className="font-black text-navy">Optional owner statuses</legend><div className="mt-2 flex flex-wrap gap-3">{statuses.map(([value, label]) => <label key={value} className="rounded-full bg-lightgrey px-4 py-2 text-sm font-black text-cocoa"><input type="checkbox" name="ownerStatuses" value={value} className="mr-2" />{label}</label>)}</div></fieldset>
    <label className="font-bold text-charcoal/70"><input name="over16" type="checkbox" required className="mr-2" />I confirm I am over 16.</label>
    <Submit />
  </form>;
}
