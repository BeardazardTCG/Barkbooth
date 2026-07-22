"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { removeDogProfilePhoto, uploadDogProfilePhoto } from "@/lib/dogs/actions";

function UploadButton({ hasPhoto }: { hasPhoto: boolean }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="w-full rounded-full bg-navy px-4 py-3 text-sm font-bold text-white disabled:opacity-60 sm:w-auto">{pending ? (hasPhoto ? "Replacing photo..." : "Uploading photo...") : (hasPhoto ? "Replace photo" : "Upload photo")}</button>;
}

function RemoveButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="text-sm font-bold text-red-700 disabled:opacity-60">{pending ? "Removing photo..." : "Remove photo"}</button>;
}

export function DogProfilePhotoManager({ dogId, hasPhoto }: { dogId: string; hasPhoto: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");

  return <div aria-live="polite">
    <form action={uploadDogProfilePhoto} className="mt-3 grid gap-3" encType="multipart/form-data">
      <input type="hidden" name="dogId" value={dogId} />
      <input ref={inputRef} type="file" name="photo" required accept="image/jpeg,image/png,image/webp" onChange={(event) => setFileName(event.currentTarget.files?.[0]?.name ?? "")} className="block w-full rounded-2xl border border-navy/10 bg-white px-3 py-3 text-sm text-charcoal file:mr-3 file:rounded-full file:border-0 file:bg-lightgrey file:px-4 file:py-2 file:font-bold file:text-navy" />
      {fileName ? <p className="rounded-2xl bg-skysoft/60 p-3 text-sm font-bold text-navy">Photo selected: {fileName}. Tap {hasPhoto ? "Replace photo" : "Upload photo"} to save it.</p> : <p className="text-sm font-bold text-charcoal/55">Choose a photo, then use the button below to save it.</p>}
      <UploadButton hasPhoto={hasPhoto} />
    </form>
    {hasPhoto && <form action={removeDogProfilePhoto} className="mt-3"><input type="hidden" name="dogId" value={dogId} /><RemoveButton /></form>}
  </div>;
}
