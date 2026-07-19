"use client";
import Link from "next/link";
import { useFormState } from "react-dom";
import { signup } from "@/lib/auth/actions";
import { supportedLocations } from "@/lib/locations";
export function SignupForm() {
  const [error, action] = useFormState(signup, null);
  return <form action={action} className="grid gap-4 rounded-[2rem] bg-white/85 p-6 shadow-soft">
    <div className="rounded-2xl bg-skysoft/50 p-4 text-sm font-bold leading-6 text-navy">Everyone joins as a Bark Booth Member. You can apply for additional verified roles from your account after signing up.</div>
    <label className="grid gap-1 text-sm font-bold text-navy">Email<input name="email" type="email" required className="rounded-2xl border border-navy/10 p-3" /></label>
    <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-1 text-sm font-bold text-navy">Password<input name="password" type="password" required minLength={8} className="rounded-2xl border border-navy/10 p-3" /></label><label className="grid gap-1 text-sm font-bold text-navy">Confirm password<input name="passwordConfirm" type="password" required minLength={8} className="rounded-2xl border border-navy/10 p-3" /></label></div>
    <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-1 text-sm font-bold text-navy">Display name<input name="displayName" required className="rounded-2xl border border-navy/10 p-3" /></label><label className="grid gap-1 text-sm font-bold text-navy">Username<input name="username" required className="rounded-2xl border border-navy/10 p-3" /></label></div>
    <label className="grid gap-1 text-sm font-bold text-navy">Location<select name="country" required defaultValue="" className="rounded-2xl border border-navy/10 p-3"><option value="" disabled>Choose your location</option>{supportedLocations.map((location) => <option key={location} value={location}>{location}</option>)}</select></label>
    <fieldset><legend className="font-bold text-navy">Optional self-declared role</legend><label className="mt-2 inline-flex rounded-full bg-lightgrey px-4 py-2 text-sm font-bold text-navy"><input type="checkbox" name="ownerStatuses" value="PET_OWNER" className="mr-2" />Pet Owner</label></fieldset>
    <label className="flex gap-2 text-sm font-bold text-charcoal/70"><input type="checkbox" name="over16" required /> I confirm I am over 16 and agree to the <Link href="/legal/terms-and-conditions" className="text-info">terms</Link>.</label>
    {error && <p className="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
    <button className="rounded-full bg-info px-5 py-3 text-sm font-bold text-white" type="submit">Create my free account</button>
  </form>;
}
