import type { DogBehaviourLifestyle, DogIdentity, DogRecord } from "@prisma/client";

export type CompletionSection = { key: string; label: string; complete: boolean; detail: string };

export function calculateDogProfileCompleteness(dog: DogIdentity & { records: DogRecord[]; behaviourLifestyle?: DogBehaviourLifestyle | null }): { percentage: number; sections: CompletionSection[] } {
  const sections: CompletionSection[] = [
    { key: "identity", label: "Identity", complete: Boolean(dog.name && dog.registryNumber && dog.breed && dog.sex), detail: "Core identity details added" },
    { key: "records", label: "Records", complete: dog.records.length > 0, detail: "At least one record statement added" },
    { key: "health", label: "Health", complete: dog.records.some((record) => record.category === "HEALTH"), detail: "Health record statement added" },
    { key: "awards", label: "Awards", complete: dog.records.some((record) => ["TITLES", "WORKING_QUALIFICATIONS", "ACTIVITIES_WORK"].includes(record.category)), detail: "Title, award or qualification statement added" },
    { key: "family", label: "Family", complete: dog.records.some((record) => record.category === "PEDIGREE"), detail: "Pedigree/family record statement added" },
    { key: "ownership", label: "Ownership", complete: true, detail: "Current ownership is recorded" },
    { key: "care", label: "Care", complete: dog.records.some((record) => record.category === "CARE"), detail: "Care record statement added" },
    { key: "behaviour", label: "Behaviour", complete: Boolean("behaviourLifestyle" in dog && dog.behaviourLifestyle), detail: "Behaviour & Lifestyle overview added" },
  ];
  return { percentage: Math.round((sections.filter((section) => section.complete).length / sections.length) * 100), sections };
}
