"use client";

import { createContext, type FormEvent, type ReactNode, useContext, useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { confirmDestructiveAction, initialActionResult, visibleActionResult, type ActionResult } from "@/lib/forms/action-result";
import { useFormFeedback } from "@/components/forms/form-feedback-provider";

type ContextValue = { dirty: boolean; resetVersion: number };
const ManagedFormContext = createContext<ContextValue>({ dirty: false, resetVersion: 0 });

export function ManagedForm({ action, children, className = "", encType, warnOnLeave = true, resetOnSuccess = false, focusSuccess = false, pendingMessage = "Saving…" }: {
  action: (previous: ActionResult, data: FormData) => Promise<ActionResult>;
  children: ReactNode;
  className?: string;
  encType?: "multipart/form-data";
  warnOnLeave?: boolean;
  resetOnSuccess?: boolean;
  focusSuccess?: boolean;
  pendingMessage?: string;
}) {
  const [state, formAction] = useFormState(action, initialActionResult);
  const [dirty, setDirty] = useState(false);
  const [editedAfterSuccess, setEditedAfterSuccess] = useState(false);
  const [resetVersion, setResetVersion] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { dismiss, notify } = useFormFeedback();

  useEffect(() => {
    if (!warnOnLeave || !dirty) return;
    const preventLeave = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", preventLeave);
    return () => window.removeEventListener("beforeunload", preventLeave);
  }, [dirty, warnOnLeave]);

  useEffect(() => {
    if (state.status === "idle") return;
    setEditedAfterSuccess(false);
    if (state.status === "error" || (state.status === "success" && focusSuccess)) statusRef.current?.focus();
    if (state.status === "success") {
      setDirty(false);
      if (state.message) notify(state.message);
      if (resetOnSuccess || state.reset) {
        formRef.current?.reset();
        setResetVersion((version) => version + 1);
      }
      if (state.redirectTo) router.push(state.redirectTo);
      else router.refresh();
    }
  }, [focusSuccess, notify, resetOnSuccess, router, state]);

  const markDirty = (event: FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLInputElement;
    if (target.type !== "hidden") {
      setDirty(true);
      if (state.status === "success") {
        setEditedAfterSuccess(true);
        dismiss();
      }
    }
  };

  return <ManagedFormContext.Provider value={{ dirty, resetVersion }}>
    <form ref={formRef} action={formAction} encType={encType} className={className} onInput={markDirty} onChange={markDirty}>
      {children}
      <FormStatusMessage state={visibleActionResult(state, editedAfterSuccess)} statusRef={statusRef} pendingMessage={pendingMessage} />
    </form>
  </ManagedFormContext.Provider>;
}

export function FormSubmitButton({ label, pendingLabel = "Saving…", requireDirty = true, className = "", confirmMessage }: { label: string; pendingLabel?: string; requireDirty?: boolean; className?: string; confirmMessage?: string }) {
  const { pending } = useFormStatus();
  const { dirty } = useContext(ManagedFormContext);
  return <button type="submit" disabled={pending || (requireDirty && !dirty)} aria-disabled={pending || (requireDirty && !dirty)} onClick={(event) => { if (!confirmDestructiveAction(confirmMessage, window.confirm)) event.preventDefault(); }} className={`min-h-11 rounded-full bg-navy px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>
    {pending ? pendingLabel : label}
  </button>;
}

function FormStatusMessage({ state, statusRef, pendingMessage }: { state: ActionResult; statusRef: React.RefObject<HTMLDivElement>; pendingMessage: string }) {
  const { pending } = useFormStatus();
  const { dirty } = useContext(ManagedFormContext);
  const message = pending ? pendingMessage : state.message || (dirty ? "Unsaved changes" : "No unsaved changes");
  const isError = state.status === "error";
  return <div ref={statusRef} tabIndex={isError ? -1 : undefined} role={isError ? "alert" : "status"} aria-live={isError ? "assertive" : "polite"} aria-atomic="true" className={`rounded-2xl px-4 py-3 text-sm font-bold ${isError ? "bg-red-50 text-red-800" : state.status === "success" ? "bg-green-50 text-green-800" : dirty || pending ? "bg-amber-50 text-amber-900" : "text-charcoal/60"}`}>
    {message}
  </div>;
}

export function FileField({ name, label, accept, maxBytes, required = false }: { name: string; label: string; accept: string; maxBytes: number; required?: boolean }) {
  const [filename, setFilename] = useState("No file selected");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { resetVersion } = useContext(ManagedFormContext);
  useEffect(() => {
    setFilename("No file selected");
    setError("");
    inputRef.current?.setCustomValidity("");
  }, [resetVersion]);
  return <label className="grid min-w-0 gap-2 font-bold text-navy">{label}
    <input ref={inputRef} type="file" name={name} accept={accept} required={required} className="block w-full min-w-0 text-sm text-charcoal file:mr-3 file:min-h-11 file:rounded-full file:border-0 file:bg-skysoft file:px-4 file:font-bold file:text-navy" aria-describedby={`${name}-selection ${name}-error`} onChange={(event) => {
      const file = event.currentTarget.files?.[0];
      setFilename(file?.name || "No file selected");
      // Browsers may omit or vary File.type, so only size is enforced here.
      // The server remains authoritative for MIME type and file signatures.
      const nextError = file && file.size > maxBytes ? `File must be smaller than ${Math.round(maxBytes / 1024 / 1024)} MB.` : "";
      setError(nextError);
      event.currentTarget.setCustomValidity(nextError);
    }} />
    <span id={`${name}-selection`} className="break-all text-xs normal-case tracking-normal text-charcoal/65">Selected: {filename}</span>
    {error && <span id={`${name}-error`} role="alert" aria-live="assertive" className="text-xs normal-case tracking-normal text-red-700">{error}</span>}
  </label>;
}
