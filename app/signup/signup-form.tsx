"use client";
import Link from "next/link";
import { useFormState } from "react-dom";
import { signup } from "@/lib/auth/actions";
export function SignupForm() {
  const [error, action] = useFormState(signup, null);
  return <form action={action} className="grid gap-4 rounded-[2rem] bg-white/85 p-6 shadow-soft">
    <div className="rounded-2xl bg-biscuit/50 p-4 text-sm font-bold leading-6 text-cocoa">Everyone joins as a Bark Booth Member. You can apply for additional verified roles from your account after signing up.</div>
    <label className="grid gap-1 text-sm font-bold text-cocoa">Email<input name="email" type="email" required className="rounded-2xl border border-cocoa/10 p-3" /></label>
    <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-1 text-sm font-bold text-cocoa">Password<input name="password" type="password" required minLength={8} className="rounded-2xl border border-cocoa/10 p-3" /></label><label className="grid gap-1 text-sm font-bold text-cocoa">Confirm password<input name="passwordConfirm" type="password" required minLength={8} className="rounded-2xl border border-cocoa/10 p-3" /></label></div>
    <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-1 text-sm font-bold text-cocoa">Display name<input name="displayName" required className="rounded-2xl border border-cocoa/10 p-3" /></label><label className="grid gap-1 text-sm font-bold text-cocoa">Username<input name="username" required className="rounded-2xl border border-cocoa/10 p-3" /></label></div>
    <label className="grid gap-1 text-sm font-bold text-cocoa">Country<input name="country" required className="rounded-2xl border border-cocoa/10 p-3" /></label>
    <fieldset><legend className="font-black text-navy">Optional self-declared role</legend><label className="mt-2 inline-flex rounded-full bg-lightgrey px-4 py-2 text-sm font-black text-cocoa"><input type="checkbox" name="ownerStatuses" value="PET_OWNER" className="mr-2" />Pet Owner</label></fieldset>
    <label className="flex gap-2 text-sm font-bold text-charcoal/70"><input type="checkbox" name="over16" required /> I confirm I am over 16 and agree to the <Link href="/legal/terms-and-conditions" className="text-pink">terms</Link>.</label>
    {error && <p className="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
    <button className="rounded-full bg-pink px-5 py-3 text-sm font-black text-white" type="submit">Create my free account</button>
  </form>;
}
