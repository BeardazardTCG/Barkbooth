import type { DogRecordCategory } from "@prisma/client";

export type RecordDefinition = { category: DogRecordCategory; recordType: string; verificationAware?: boolean };

export const recordCategoryLabels: Record<DogRecordCategory, string> = {
  IDENTITY: "Identity (legacy)", DNA: "DNA & genetic testing", HEALTH: "Health screening", CARE: "Everyday care",
  IDENTIFICATION: "Identification (legacy)", INSURANCE: "Insurance", PEDIGREE: "Pedigree", TITLES: "Awards (legacy)",
  WORKING_QUALIFICATIONS: "Activities & Work (legacy)", ACTIVITIES_WORK: "Activities & Work",
  TEMPERAMENT_TESTS: "Behaviour (legacy)", BREEDING_APPROVALS: "Breeding (legacy)", OTHER: "Other",
};

export const deprecatedRecordCategories: DogRecordCategory[] = ["IDENTITY", "IDENTIFICATION", "TITLES", "WORKING_QUALIFICATIONS", "TEMPERAMENT_TESTS", "BREEDING_APPROVALS"];

const definitions = (category: DogRecordCategory, names: string[]): RecordDefinition[] => names.map((recordType) => ({ category, recordType, verificationAware: true }));

export const initialRecordTypes: RecordDefinition[] = [
  ...definitions("ACTIVITIES_WORK", [
    "The Kennel Club – Agility", "The Kennel Club – Bloodhound Trials", "The Kennel Club – Canicross", "The Kennel Club – Dog Showing", "The Kennel Club – Flyball",
    "The Kennel Club – Gundog Working Tests", "The Kennel Club – Field Trials", "The Kennel Club – Heelwork to Music", "The Kennel Club – Obedience", "The Kennel Club – Rally",
    "The Kennel Club – Scentwork", "The Kennel Club – Working Trials", "Tracking", "Search and Rescue", "Assistance Dog work", "Therapy Dog work", "Detection Dog work",
    "Police Dog work", "Military Working Dog", "Sheepdog Trials", "Canicross", "Sled Dog sport", "British Flyball Association", "British Association for Shooting and Conservation",
    "International Sheep Dog Society", "British Sleddog Sports Federation", "Breed club activity", "Sporting organisation activity", "Other recognised UK organisation or activity",
  ]),
  ...definitions("HEALTH", [
    "The Kennel Club Health Standard / Health Test Results Finder", "Kennel Club/BVA Hip Dysplasia Scheme", "Kennel Club/BVA Elbow Dysplasia Scheme",
    "Kennel Club/BVA/ISDS Eye Scheme", "Official eye examination", "Hip score", "Elbow score", "Kennel Club DNA Testing Services", "Breed-specific DNA health scheme",
    "Canine Health Schemes (CHS)", "Embark DNA health test", "Wisdom Panel health test", "LABOKLIN genetic test", "Animal Genetics UK test", "Other recognised UK health provider or scheme",
  ]),
  ...definitions("DNA", ["Embark DNA test", "Wisdom Panel DNA test", "LABOKLIN DNA test", "Animal Genetics UK DNA test", "Kennel Club DNA test", "Breed-specific DNA test", "Other DNA test"]),
  ...definitions("INSURANCE", ["Pet insurance policy"]),
  ...definitions("PEDIGREE", ["Kennel Club pedigree certificate", "Breed registry pedigree"]),
  ...definitions("OTHER", ["Breeding licence", "Breeding history", "Other record"]),
];

export const recordCategories = (Object.keys(recordCategoryLabels) as DogRecordCategory[]).filter((category) => !deprecatedRecordCategories.includes(category) && category !== "CARE");
export const allRecordCategories = recordCategories;
