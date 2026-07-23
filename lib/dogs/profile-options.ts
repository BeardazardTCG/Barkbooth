export const dogTypes = ["Companion", "Working", "Showing", "Breeding", "Rescue", "Foster", "Retired", "Memorial", "Other"] as const;
export const sexOptions = ["Male", "Female", "Unknown"] as const;

export function selectedDogTypes(values: FormDataEntryValue[]) {
  const selected = Array.from(new Set(values.map((value) => typeof value === "string" ? value.trim() : "").filter(Boolean)));
  if (!selected.length) throw new Error("Select at least one dog type.");
  return selected;
}
