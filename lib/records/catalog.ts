import type { DogRecordCategory } from "@prisma/client";

export type RecordDefinition = { category: DogRecordCategory; recordType: string; provider?: string };

export const recordCategoryLabels: Record<DogRecordCategory, string> = {
  IDENTITY: "Identity",
  DNA: "DNA",
  HEALTH: "Health",
  CARE: "Care",
  IDENTIFICATION: "Identification",
  INSURANCE: "Insurance",
  PEDIGREE: "Pedigree",
  TITLES: "Titles",
  WORKING_QUALIFICATIONS: "Working Qualifications",
  TEMPERAMENT_TESTS: "Temperament Tests",
  BREEDING_APPROVALS: "Breeding Approvals",
  OTHER: "Other",
};

export const initialRecordTypes: RecordDefinition[] = [
  { category: "IDENTITY", recordType: "Kennel Club", provider: "Kennel Club" },
  { category: "IDENTITY", recordType: "IKC", provider: "IKC" },
  { category: "IDENTITY", recordType: "FCI", provider: "FCI" },
  { category: "IDENTITY", recordType: "Other Registry" },
  { category: "DNA", recordType: "Embark", provider: "Embark" },
  { category: "DNA", recordType: "Wisdom Panel", provider: "Wisdom Panel" },
  { category: "DNA", recordType: "Other DNA" },
  { category: "HEALTH", recordType: "Hip Score" },
  { category: "HEALTH", recordType: "Elbow Score" },
  { category: "HEALTH", recordType: "Eye Test" },
  { category: "HEALTH", recordType: "Heart Test" },
  { category: "HEALTH", recordType: "BAER" },
  { category: "HEALTH", recordType: "Patella" },
  { category: "HEALTH", recordType: "Other Health Test" },
  { category: "CARE", recordType: "Vaccinations" },
  { category: "CARE", recordType: "Flea Treatment" },
  { category: "CARE", recordType: "Worm Treatment" },
  { category: "CARE", recordType: "Tick Treatment" },
  { category: "IDENTIFICATION", recordType: "Microchip" },
  { category: "INSURANCE", recordType: "Insurance" },
  { category: "PEDIGREE", recordType: "Pedigree" },
  { category: "TITLES", recordType: "Titles" },
  { category: "WORKING_QUALIFICATIONS", recordType: "Working Qualifications" },
  { category: "TEMPERAMENT_TESTS", recordType: "Temperament Tests" },
  { category: "BREEDING_APPROVALS", recordType: "Breeding Approvals" },
  { category: "OTHER", recordType: "Other" },
];

export const recordCategories = Object.keys(recordCategoryLabels) as DogRecordCategory[];
