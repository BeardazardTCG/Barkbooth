import type { ProfessionalProfileType } from "@prisma/client";
export const professionalTypeLabels: Record<ProfessionalProfileType,string> = { VET:"Vet", GROOMER:"Groomer", TRAINER:"Trainer", BEHAVIOURIST:"Behaviourist", DOG_WALKER:"Dog Walker", PET_SITTER:"Pet Sitter", DAY_CARE:"Day Care", BOARDING_KENNELS:"Boarding Kennels", HYDROTHERAPY:"Hydrotherapy", PHYSIOTHERAPIST:"Physiotherapist", BREEDER:"Breeder", RESCUE:"Rescue", PHOTOGRAPHER:"Photographer", OTHER:"Other" };
export const professionalTypes = Object.keys(professionalTypeLabels) as ProfessionalProfileType[];
const base = ["Consultation", "Home visit", "Online support"];
export const servicesByType: Record<ProfessionalProfileType,string[]> = {
 VET:["Routine consultation","Vaccinations","Dental care","Surgery","Emergency care","Health certificate",...base],
 GROOMER:["Full groom","Bath and brush","Nail trimming","Puppy introduction","Hand stripping","De-shedding","Mobile grooming"],
 TRAINER:["Puppy training","Obedience","Recall","Reactivity support","One-to-one sessions","Group classes","Online sessions"],
 BEHAVIOURIST:["Behaviour assessment","Reactivity plan","Separation anxiety support","Resource guarding support","Veterinary referral support",...base],
 DOG_WALKER:["Group walks","Solo walks","Puppy visits","Senior-dog walks","Adventure walks","Home visits"],
 PET_SITTER:["Day visits","Overnight sitting","Puppy visits","Medication support","Holiday cover"],
 DAY_CARE:["Full day care","Half day care","Puppy day care","Structured play","Rest breaks"],
 BOARDING_KENNELS:["Overnight boarding","Long-stay boarding","Individual kennel","Medication support","Exercise sessions"],
 HYDROTHERAPY:["Pool session","Underwater treadmill","Rehabilitation plan","Fitness swim","Veterinary referral support"],
 PHYSIOTHERAPIST:["Physiotherapy assessment","Rehabilitation plan","Mobility support","Post-operative support","Senior dog support"],
 BREEDER:["Breed advice","Puppy enquiries","Stud dog enquiries","Puppy socialisation","Lifetime support"],
 RESCUE:["Adoption","Fostering","Home checks","Behaviour assessment","Post-adoption support"],
 PHOTOGRAPHER:["Studio session","Outdoor session","Event photography","Puppy shoot","Fine art prints"],
 OTHER:base
};
export function validateServices(type: ProfessionalProfileType, values: string[]) { const allowed = new Set(servicesByType[type]); return values.filter(v => allowed.has(v)); }
export function slugify(value:string){return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,120)||"professional-profile";}
