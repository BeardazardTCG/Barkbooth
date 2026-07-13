import type { DogRecordCategory } from "@prisma/client";

export type RecordDefinition = { category: DogRecordCategory; recordType: string; provider?: string; verificationAware?: boolean };

export const recordCategoryLabels: Record<DogRecordCategory, string> = {
  IDENTITY: "Identity",
  DNA: "DNA",
  HEALTH: "Health",
  CARE: "Care",
  IDENTIFICATION: "Identification",
  INSURANCE: "Insurance",
  PEDIGREE: "Pedigree",
  TITLES: "Awards (legacy)",
  WORKING_QUALIFICATIONS: "Activities & Work",
  ACTIVITIES_WORK: "Activities & Work",
  TEMPERAMENT_TESTS: "Behaviour (legacy)",
  BREEDING_APPROVALS: "Breeding (legacy)",
  OTHER: "Other",
};

export const deprecatedRecordCategories: DogRecordCategory[] = ["TITLES", "TEMPERAMENT_TESTS", "BREEDING_APPROVALS"];

export const initialRecordTypes: RecordDefinition[] = [
  { category: "IDENTITY", recordType: "Kennel Club registration", provider: "Kennel Club", verificationAware: true },
  { category: "IDENTITY", recordType: "Breed Club membership", verificationAware: true },
  { category: "IDENTITY", recordType: "IKC", provider: "IKC", verificationAware: true },
  { category: "IDENTITY", recordType: "FCI", provider: "FCI", verificationAware: true },
  { category: "IDENTITY", recordType: "Other Registry", verificationAware: true },
  { category: "DNA", recordType: "DNA Test", verificationAware: true },
  { category: "DNA", recordType: "Genetic Testing", verificationAware: true },
  { category: "DNA", recordType: "Embark", provider: "Embark", verificationAware: true },
  { category: "DNA", recordType: "Wisdom Panel", provider: "Wisdom Panel", verificationAware: true },
  { category: "HEALTH", recordType: "Veterinary Treatments", verificationAware: true },
  { category: "HEALTH", recordType: "Health Screening", verificationAware: true },
  { category: "HEALTH", recordType: "Hip Score", verificationAware: true },
  { category: "HEALTH", recordType: "Elbow Score", verificationAware: true },
  { category: "HEALTH", recordType: "Eye Test", verificationAware: true },
  { category: "HEALTH", recordType: "Heart Test", verificationAware: true },
  { category: "CARE", recordType: "Vaccination Records", verificationAware: true },
  { category: "CARE", recordType: "Flea Treatment" },
  { category: "CARE", recordType: "Worm Treatment" },
  { category: "IDENTIFICATION", recordType: "Microchip" },
  { category: "INSURANCE", recordType: "Insurance", verificationAware: true },
  { category: "PEDIGREE", recordType: "Pedigree Certificate", verificationAware: true },
  { category: "ACTIVITIES_WORK", recordType: "Competition Titles", verificationAware: true },
  { category: "ACTIVITIES_WORK", recordType: "Professional Qualifications", verificationAware: true },
  { category: "ACTIVITIES_WORK", recordType: "Activities & Work" },
  { category: "OTHER", recordType: "Breeding Licence", verificationAware: true },
  { category: "OTHER", recordType: "Breeding History", verificationAware: true },
  { category: "OTHER", recordType: "Other" },
];

export const recordCategories = (Object.keys(recordCategoryLabels) as DogRecordCategory[]).filter((category) => !deprecatedRecordCategories.includes(category));
export const allRecordCategories = Object.keys(recordCategoryLabels) as DogRecordCategory[];
