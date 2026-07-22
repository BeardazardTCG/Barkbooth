"use client";

import { useMemo, useState } from "react";
import { dogBreeds } from "@/lib/dog-breeds";


type BreedSelectorProps = { mixedBreed?: boolean; initialBreed?: string | null; initialBreedMix?: string | null };

export function BreedSelector({ mixedBreed = false, initialBreed = "", initialBreedMix = "" }: BreedSelectorProps) {
  const [isMixed, setIsMixed] = useState(mixedBreed);
  const [primaryBreed, setPrimaryBreed] = useState(initialBreed || (mixedBreed ? "Mixed Breed" : ""));
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>(initialBreedMix?.split(",").map((breed) => breed.trim()).filter(Boolean) ?? []);
  const mixOptions = useMemo(() => dogBreeds.filter((breed) => !["Mixed Breed", "Other"].includes(breed) && breed.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())), [query]);

  function toggleBreed(breed: string) {
    setSelected((current) => current.includes(breed) ? current.filter((item) => item !== breed) : [...current, breed]);
  }

  return <div className="grid gap-4 rounded-[1.5rem] border border-navy/10 bg-white/70 p-4 md:col-span-2">
    <input type="hidden" name="breedFieldsPresent" value="true" />
    <div>
      <label className="font-bold text-navy" htmlFor="breed">Primary breed</label>
      <input id="breed" name="breed" list="dog-breed-options" required value={primaryBreed} onChange={(event) => { setPrimaryBreed(event.target.value); if (event.target.value === "Mixed Breed") setIsMixed(true); }} placeholder="Start typing to search breeds…" className="mt-2 w-full rounded-2xl border border-navy/10 bg-white px-4 py-3" />
      <datalist id="dog-breed-options">{dogBreeds.map((breed) => <option key={breed} value={breed} />)}</datalist>
      <p className="mt-2 text-sm font-bold text-charcoal/55">Search the full alphabetised breed list, or choose Mixed Breed or Other.</p>
    </div>
    <label className="font-bold text-charcoal/70"><input name="isMixedBreed" type="checkbox" checked={isMixed} onChange={(event) => setIsMixed(event.target.checked)} className="mr-2" />Mixed Breed / crossbreed</label>
    {isMixed && <fieldset className="min-w-0">
      <legend className="font-bold text-navy">Breed mix details <span className="text-sm text-charcoal/50">optional</span></legend>
      <label className="sr-only" htmlFor="breed-mix-search">Search breeds in the mix</label>
      <input id="breed-mix-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search breeds in the mix…" className="mt-2 w-full rounded-2xl border border-navy/10 bg-white px-4 py-3" />
      {selected.length > 0 && <div className="mt-3 flex flex-wrap gap-2" aria-label="Selected breeds">{selected.map((breed) => <button key={breed} type="button" onClick={() => toggleBreed(breed)} className="rounded-full bg-info/10 px-3 py-2 text-sm font-bold text-navy" aria-label={`Remove ${breed}`}>{breed} <span aria-hidden="true">×</span></button>)}</div>}
      <div className="mt-3 max-h-64 overflow-y-auto rounded-2xl border border-navy/10 bg-white p-2">
        {mixOptions.length ? mixOptions.map((breed) => <label key={breed} className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 font-semibold text-charcoal hover:bg-lightgrey"><input type="checkbox" name="breedMix" value={breed} checked={selected.includes(breed)} onChange={() => toggleBreed(breed)} />{breed}</label>) : <p className="p-3 text-sm font-bold text-charcoal/55">No breeds match that search.</p>}
      </div>
      <p className="mt-2 text-sm font-bold text-charcoal/55">Select every known breed in the mix. You can search and choose more than one.</p>
    </fieldset>}
  </div>;
}
