"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signup } from "@/lib/auth/actions";

const statuses = [["PET_OWNER", "Pet Owner"], ["BREEDER", "Breeder"], ["RESCUE", "Rescue"], ["FOSTER", "Foster"], ["PROFESSIONAL", "Professional"]];

function Submit() {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="rounded-full bg-pink px-5 py-3 text-sm font-black text-white shadow-soft disabled:opacity-60">{pending ? "Creating..." : "Create account"}</button>;
}

export function SignupForm() {
  const [error, action] = useFormState(signup, null);
  return <form action={action} className="grid gap-4">
    {error && <p className="rounded-2xl bg-pink/10 p-3 text-sm font-black text-pink">{error}</p>}
    <div className="grid gap-4 md:grid-cols-2">
      <label className="font-black text-navy">Email<input name="email" type="email" required className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
      <label className="font-black text-navy">Password<input name="password" type="password" minLength={8} required className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
      <label className="font-black text-navy">Display name<input name="displayName" required className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
      <label className="font-black text-navy">Username<input name="username" required className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
      <label className="font-black text-navy">Country<input name="country" required className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
    </div>
    <fieldset><legend className="font-black text-navy">Optional owner statuses</legend><div className="mt-2 flex flex-wrap gap-3">{statuses.map(([value, label]) => <label key={value} className="rounded-full bg-lightgrey px-4 py-2 text-sm font-black text-cocoa"><input type="checkbox" name="ownerStatuses" value={value} className="mr-2" />{label}</label>)}</div></fieldset>
    <label className="font-bold text-charcoal/70"><input name="over16" type="checkbox" required className="mr-2" />I confirm I am over 16.</label>
    <Submit />
  </form>;
}
