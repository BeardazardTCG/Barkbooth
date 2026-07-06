"use client";

import { useFormState, useFormStatus } from "react-dom";
import { registerDog } from "@/lib/dogs/actions";

const roles = ["Pet", "Breeding", "Show", "Working", "Rescue", "Foster", "Retired", "Memorial", "Other"];

function Submit() {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="rounded-full bg-pink px-5 py-3 text-sm font-black text-white shadow-soft disabled:opacity-60">{pending ? "Registering..." : "Create Bark Booth Identity"}</button>;
}

export function RegisterDogForm() {
  const [error, action] = useFormState(registerDog, null);
  return <form action={action} className="grid gap-5">
    {error && <p className="rounded-2xl bg-pink/10 p-3 text-sm font-black text-pink">{error}</p>}
    <div className="grid gap-4 md:grid-cols-2">
      <label className="font-black text-navy">Dog name<input name="name" required className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
      <label className="font-black text-navy">Primary dog role<select name="primaryRole" required defaultValue="" className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3"><option value="" disabled>Select the dog’s primary role</option>{roles.map((role) => <option key={role}>{role}</option>)}</select></label>
      <label className="font-black text-navy">Breed/type<input name="breed" className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
      <label className="font-black text-navy">Date of birth<input name="dateOfBirth" type="date" className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
      <label className="font-black text-navy">Sex<input name="sex" className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
      <label className="font-black text-navy">Colour<input name="colour" className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
      <label className="font-black text-navy">Country of registration<input name="countryOfRegistration" className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
      <label className="font-black text-navy">Visibility of identity<select name="visibility" defaultValue="PUBLIC" className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3"><option value="PUBLIC">Public registry identity</option><option value="PRIVATE">Private to your account</option><option value="LINK_ONLY">Visible only with a shared link</option></select></label>
    </div>
    <label className="font-bold text-charcoal/70"><input name="estimatedDob" type="checkbox" className="mr-2" />Date of birth is estimated</label>
    <Submit />
  </form>;
}
