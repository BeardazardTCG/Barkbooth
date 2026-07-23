export const dogTypes = ["Companion", "Working", "Showing", "Breeding", "Rescue", "Foster", "Retired", "Memorial", "Other"] as const;
export const sexOptions = ["Male", "Female", "Unknown"] as const;

export function selectedDogTypes(values: FormDataEntryValue[]) {
  const submitted = values.map((value) => typeof value === "string" ? value.trim() : value);
  const invalid = submitted.find((value) => value !== "" && (typeof value !== "string" || !dogTypes.includes(value as (typeof dogTypes)[number])));
  if (invalid !== undefined) throw new Error("Select only supported dog types.");
  const selected = Array.from(new Set(submitted.filter((value): value is (typeof dogTypes)[number] => typeof value === "string" && dogTypes.includes(value as (typeof dogTypes)[number]))));
  if (!selected.length) throw new Error("Select at least one dog type.");
  return selected;
}

export function selectedSex(value: FormDataEntryValue | null, existing?: string | null) {
  const sex = typeof value === "string" ? value.trim() : "";
  if (!sex) return null;
  if (sexOptions.includes(sex as (typeof sexOptions)[number]) || sex === existing) return sex;
  throw new Error("Select a supported sex option.");
}
