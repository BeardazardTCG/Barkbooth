"use client";
import { useState } from "react";
import { useFormStatus } from "react-dom";

function Submit({label,pendingLabel,secondary=false}:{label:string;pendingLabel:string;secondary?:boolean}) {
  const {pending}=useFormStatus();
  return <button disabled={pending} aria-disabled={pending} className={`${secondary?"button-secondary":"button-primary"} disabled:cursor-wait disabled:opacity-60`}>{pending?pendingLabel:label}</button>;
}
export function PendingForm({action,children,label,pendingLabel="Saving…",secondary=false,className=""}:{action:(data:FormData)=>void|Promise<void>;children:React.ReactNode;label:string;pendingLabel?:string;secondary?:boolean;className?:string}) {
  return <form action={action} className={className} aria-live="polite">{children}<Submit label={label} pendingLabel={pendingLabel} secondary={secondary}/></form>;
}
export function HeroUploadForm({action,id,hasHero}:{action:(data:FormData)=>void|Promise<void>;id:string;hasHero:boolean}) {
  const [file,setFile]=useState("");
  return <PendingForm action={action} label={hasHero?"Replace image":"Upload image"} pendingLabel="Uploading image…" className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"><input type="hidden" name="competitionId" value={id}/><label className="grid gap-1 font-bold">Choose hero image<input type="file" name="hero" required accept="image/jpeg,image/png,image/webp" onChange={e=>setFile(e.target.files?.[0]?.name??"")}/><span className="text-xs font-normal normal-case" role="status">{file?`Selected: ${file}`:"JPEG, PNG or WebP"}</span></label></PendingForm>;
}
