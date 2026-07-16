const commonBreeds = [
  "Mixed Breed",
  "Labrador Retriever",
  "French Bulldog",
  "Cocker Spaniel",
  "Golden Retriever",
  "German Shepherd Dog",
  "Dachshund",
  "Poodle",
  "Cockapoo",
  "Cavapoo",
  "Border Collie",
  "Staffordshire Bull Terrier",
  "Beagle",
  "Boxer",
  "Chihuahua",
  "Shih Tzu",
  "Siberian Husky",
  "Rottweiler",
  "Jack Russell Terrier",
  "Lurcher",
  "Greyhound",
  "Whippet",
  "English Springer Spaniel",
  "Cavalier King Charles Spaniel",
  "West Highland White Terrier",
  "Yorkshire Terrier",
  "Bichon Frise",
  "Bernese Mountain Dog",
  "Australian Shepherd",
  "Other"
];

export const breedOptions = commonBreeds;

type BreedSelectorProps = {
  mixedBreed?: boolean;
};

export function BreedSelector({ mixedBreed = false }: BreedSelectorProps) {
  return <div className="grid gap-3 rounded-[1.5rem] border border-navy/10 bg-white/70 p-4 md:col-span-2">
    <div>
      <label className="font-bold text-navy" htmlFor="breed">Breed</label>
      <select id="breed" name="breed" required defaultValue="" className="mt-2 w-full rounded-2xl border border-navy/10 bg-white px-4 py-3">
        <option value="" disabled>Select primary breed or Mixed Breed</option>
        {breedOptions.map((breed) => <option key={breed} value={breed}>{breed}</option>)}
      </select>
      <p className="mt-2 text-sm font-bold text-charcoal/55">Foundation selector: common breeds now, full searchable breed autocomplete can be added later without changing the registration flow.</p>
    </div>
    <label className="font-bold text-charcoal/70"><input name="isMixedBreed" type="checkbox" defaultChecked={mixedBreed} className="mr-2" />Mixed Breed / crossbreed</label>
    <label className="font-bold text-navy">Breed mix details <select name="breedMix" multiple size={5} className="mt-2 w-full rounded-2xl border border-navy/10 bg-white px-4 py-3">
      {breedOptions.filter((breed) => breed !== "Mixed Breed").map((breed) => <option key={breed} value={breed}>{breed}</option>)}
    </select><span className="mt-2 block text-sm font-bold text-charcoal/55">If Mixed Breed is selected, choose any known breeds. Hold Ctrl/Cmd to select more than one.</span></label>
  </div>;
}
