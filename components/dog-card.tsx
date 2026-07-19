import Link from "next/link";
import { PawAvatar } from "./ui";

type DogCardProps = { dog: { name: string; registryNumber: string; breed?: string | null; primaryRole?: string | null; imageUrl?: string | null }; dualOwnership?: boolean; contractedCare?: boolean; relationship?: string; verified?: boolean; compact?: boolean };

export function DogCard({ dog, dualOwnership, contractedCare, relationship, verified, compact }: DogCardProps) {
  return <article className={`group overflow-hidden rounded-registry border border-navy/10 bg-white shadow-registry ${compact ? "grid grid-cols-[7rem_1fr]" : ""}`}>
    {/* TODO: DogIdentity currently has no image field. Pass imageUrl here when the existing schema gains one. */}
    {dog.imageUrl ? <img src={dog.imageUrl} alt={`${dog.name} registry portrait`} className={`${compact ? "aspect-square" : "aspect-[16/9]"} h-full w-full object-cover`}/> : <PawAvatar label={dog.name} className={compact ? "!aspect-square rounded-none border-0 shadow-none" : "!aspect-[16/9] rounded-none border-0 shadow-none"}/>}
    <div className="p-5">
      <div className="flex flex-wrap items-center gap-2"><span className="registry-label !text-info">{dog.registryNumber}</span>{verified && <span className="identity-chip !bg-verified/10 !text-verified">Verified</span>}</div>
      <h3 className="mt-2 text-2xl font-extrabold text-navy">{dog.name}</h3>
      <p className="mt-1 text-sm font-semibold text-slate">{dog.breed || "Breed not recorded"}{dog.primaryRole ? ` · ${dog.primaryRole}` : ""}</p>
      <div className="mt-3 flex flex-wrap gap-2">{relationship && <span className="identity-chip">{relationship}</span>}{dualOwnership && <span className="identity-chip">Dual ownership</span>}{contractedCare && <span className="identity-chip">Contracted care</span>}</div>
      <Link href={`/dogs/${dog.registryNumber}`} className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-info hover:text-navy">View identity <span aria-hidden="true">→</span></Link>
    </div>
  </article>;
}
