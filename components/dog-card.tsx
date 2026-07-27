import Link from "next/link";
import { PawAvatar } from "./ui";

type DogCardProps = { dog: { id: string; name: string; registryNumber: string; breed?: string | null; primaryRole?: string | null; profilePhoto?: { updatedAt: Date } | null }; dualOwnership?: boolean; contractedCare?: boolean; relationship?: string; verified?: boolean; compact?: boolean };

export function DogCard({ dog, dualOwnership, contractedCare, relationship, verified, compact }: DogCardProps) {
  const href = `/dogs/${dog.registryNumber}`;
  return <article className={`group relative overflow-hidden rounded-registry border border-navy/10 bg-white shadow-registry transition hover:-translate-y-0.5 hover:shadow-soft ${compact ? "grid grid-cols-[7rem_minmax(0,1fr)]" : ""}`}>
    <Link href={href} aria-label={`Manage ${dog.name}`} className="absolute inset-0 z-10 rounded-registry focus:outline-none focus-visible:ring-4 focus-visible:ring-info/35" />
    <div className={`relative min-w-0 overflow-hidden bg-skysoft ${compact ? "aspect-square h-28 w-28" : "aspect-[16/9] w-full"}`}>
      {dog.profilePhoto ? <img src={`/api/dogs/${dog.id}/profile-photo?v=${encodeURIComponent(dog.profilePhoto.updatedAt.toISOString())}`} alt={`${dog.name} registry portrait`} className="h-full w-full object-cover"/> : <PawAvatar label={dog.name} className="!h-full !w-full rounded-none border-0 shadow-none"/>}
    </div>
    <div className={`${compact ? "p-4" : "p-5"} relative min-w-0`}>
      <div className="flex min-w-0 flex-wrap items-center gap-2"><span className="registry-label max-w-full break-all !text-info">{dog.registryNumber}</span>{verified && <span className="identity-chip !bg-verified/10 !text-verified">Verified</span>}</div>
      <h3 className={`${compact ? "text-xl" : "text-2xl"} mt-2 break-words font-extrabold text-navy`}>{dog.name}</h3>
      <p className="mt-1 text-sm font-semibold text-slate">{dog.breed || "Breed not recorded"}{dog.primaryRole ? ` · ${dog.primaryRole}` : ""}</p>
      <div className="mt-3 flex flex-wrap gap-2">{relationship && <span className="identity-chip">{relationship}</span>}{dualOwnership && <span className="identity-chip">Dual ownership</span>}{contractedCare && <span className="identity-chip">Contracted care</span>}</div>
      <Link href={href} className="relative z-20 mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-info px-4 py-2 text-sm font-extrabold text-white hover:bg-navy">Manage dog <span aria-hidden="true">→</span></Link>
    </div>
  </article>;
}
