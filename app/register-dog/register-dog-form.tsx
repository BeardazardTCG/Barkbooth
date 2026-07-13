"use client";

import { useFormState, useFormStatus } from "react-dom";
import { BreedSelector } from "@/components/breed-selector";
import { registerDog } from "@/lib/dogs/actions";

const dogTypes = ["Companion", "Working", "Showing", "Breeding", "Rescue", "Foster", "Retired", "Memorial", "Other"];

function Submit() {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="rounded-full bg-rosette px-5 py-3 text-sm font-bold text-white shadow-soft disabled:opacity-60">{pending ? "Registering..." : "Create Bark Booth Identity"}</button>;
}

export function RegisterDogForm() {
  const [error, action] = useFormState(registerDog, null);
  return <form action={action} className="grid gap-5">
    {error && <p className="rounded-2xl bg-rosette/10 p-3 text-sm font-bold text-rosette">{error}</p>}
    <div className="grid gap-4 md:grid-cols-2">
      <label className="font-bold text-navy">Dog name<input name="name" required className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
      <label className="font-bold text-navy">Kennel Club name <span className="text-sm text-charcoal/50">optional</span><input name="kennelClubName" className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
      <label className="font-bold text-navy">Date of birth<input name="dateOfBirth" type="date" className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
      <label className="flex items-end pb-3 font-bold text-charcoal/70"><input name="estimatedDob" type="checkbox" className="mr-2" />Date of birth is estimated</label>
      <BreedSelector />
      <label className="font-bold text-navy">DNA confirmed<select name="dnaConfirmed" defaultValue="UNKNOWN" className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3"><option value="UNKNOWN">Not provided</option><option value="YES">Yes</option><option value="NO">No</option></select></label>
      <label className="font-bold text-navy">Sex<input name="sex" className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
      <label className="font-bold text-navy">Neutered / Spayed<select name="neuteredSpayed" defaultValue="UNKNOWN" className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3"><option value="UNKNOWN">Unknown</option><option value="YES">Yes</option><option value="NO">No</option></select></label>
      <label className="font-bold text-navy">Colour<input name="colour" className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
      <label className="font-bold text-navy">Country of registration<input name="countryOfRegistration" className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
      <label className="font-bold text-navy">Visibility of identity<select name="visibility" defaultValue="PUBLIC" className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3"><option value="PUBLIC">Public registry identity</option><option value="PRIVATE">Private to your account</option></select></label>
    </div>
    <fieldset className="rounded-[1.5rem] border border-cocoa/10 bg-white/70 p-4"><legend className="px-2 font-bold text-navy">Dog Type</legend><p className="text-sm font-bold text-charcoal/55">Select every type that applies.</p><div className="mt-3 flex flex-wrap gap-3">{dogTypes.map((type) => <label key={type} className="rounded-full bg-lightgrey px-4 py-2 text-sm font-bold text-navy"><input type="checkbox" name="dogTypes" value={type} className="mr-2" />{type}</label>)}</div></fieldset>
    <Submit />
  </form>;
}
