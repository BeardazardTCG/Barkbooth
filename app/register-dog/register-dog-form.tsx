"use client";

import { BreedSelector } from "@/components/breed-selector";
import { FileField, FormSubmitButton, ManagedForm } from "@/components/forms/managed-form";
import { registerDog } from "@/lib/dogs/actions";
import { dogTypes, sexOptions } from "@/lib/dogs/profile-options";

const control = "mt-1.5 w-full rounded-2xl border border-navy/10 px-4 py-3";

export function RegisterDogForm() {
  return <ManagedForm action={registerDog} pendingMessage="Creating…" encType="multipart/form-data" className="grid gap-4">
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="font-bold text-navy">Dog name<input name="name" required autoFocus autoComplete="off" className={control} /></label>
      <label className="font-bold text-navy">Sex <span className="normal-case tracking-normal text-charcoal/45">(optional)</span><select name="sex" defaultValue="" className={control}><option value="">Not provided</option>{sexOptions.map((sex) => <option key={sex} value={sex}>{sex}</option>)}</select></label>
      <BreedSelector compact />
    </div>

    <fieldset className="rounded-2xl border border-navy/10 bg-white/70 p-3"><legend className="px-2 font-bold text-navy">Dog type</legend><p className="text-sm text-charcoal/55">Companion is selected for you. Choose another only if it fits better.</p><div className="mt-2 flex flex-wrap gap-2">{dogTypes.map((type) => <label key={type} className="rounded-full bg-lightgrey px-3 py-2 text-sm font-bold text-navy"><input type="checkbox" name="dogTypes" value={type} defaultChecked={type === "Companion"} className="mr-2" />{type}</label>)}</div></fieldset>

    <details className="rounded-2xl border border-navy/10 bg-white/60 p-3"><summary className="cursor-pointer font-bold text-navy">Optional details <span className="font-normal text-charcoal/55">— add now or later</span></summary><div className="mt-4 grid gap-4 sm:grid-cols-2">
      <label className="font-bold text-navy">Date of birth<input name="dateOfBirth" type="date" className={control} /></label>
      <label className="flex items-center gap-2 self-end rounded-2xl bg-lightgrey p-3 font-bold text-charcoal/70"><input name="estimatedDob" type="checkbox" />Date is estimated</label>
      <label className="font-bold text-navy">Colour / markings<input name="colour" className={control} /></label>
      <label className="font-bold text-navy">Neutered / spayed<select name="neuteredSpayed" defaultValue="UNKNOWN" className={control}><option value="UNKNOWN">Not provided</option><option value="YES">Yes</option><option value="NO">No</option></select></label>
      <label className="font-bold text-navy">Kennel Club name<input name="kennelClubName" className={control} /></label>
      <label className="font-bold text-navy">Country of registration<input name="countryOfRegistration" autoComplete="country-name" className={control} /></label>
      <label className="font-bold text-navy">DNA confirmed<select name="dnaConfirmed" defaultValue="UNKNOWN" className={control}><option value="UNKNOWN">Not provided</option><option value="YES">Yes</option><option value="NO">No</option></select></label>
      <label className="font-bold text-navy">Profile visibility<select name="visibility" defaultValue="PUBLIC" className={control}><option value="PUBLIC">Public registry identity</option><option value="PRIVATE">Private to your account</option><option value="LINK_ONLY">Link only</option></select></label>
      <div className="sm:col-span-2"><FileField name="photo" label="Profile photo (optional)" accept="image/jpeg,image/png,image/webp" maxBytes={5 * 1024 * 1024} /></div>
    </div></details>
    <div className="sticky bottom-[4.5rem] z-10 -mx-2 rounded-2xl border border-navy/10 bg-white/95 p-2 shadow-soft backdrop-blur lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none"><FormSubmitButton label="Create pet profile" pendingLabel="Creating…" /></div>
  </ManagedForm>;
}
