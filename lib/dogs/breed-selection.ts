export type BreedSelectionInput = { mixedBreed?: boolean; initialBreed?: string | null; initialBreedMix?: string | null };

export function breedSelectionFromProps({ mixedBreed = false, initialBreed = "", initialBreedMix = "" }: BreedSelectionInput) {
  return {
    isMixed: mixedBreed,
    primaryBreed: initialBreed || (mixedBreed ? "Mixed Breed" : ""),
    selected: initialBreedMix?.split(",").map((breed) => breed.trim()).filter(Boolean) ?? [],
  };
}
