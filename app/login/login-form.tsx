"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login } from "@/lib/auth/actions";

function Submit() {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="rounded-full bg-pink px-5 py-3 text-sm font-black text-white shadow-soft disabled:opacity-60">{pending ? "Logging in..." : "Log in"}</button>;
}

export function LoginForm() {
  const [error, action] = useFormState(login, null);
  return <form action={action} className="grid gap-4">
    {error && <p className="rounded-2xl bg-pink/10 p-3 text-sm font-black text-pink">{error}</p>}
    <label className="font-black text-navy">Email<input name="email" type="email" required className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
    <label className="font-black text-navy">Password<input name="password" type="password" required className="mt-2 w-full rounded-2xl border border-cocoa/10 px-4 py-3" /></label>
    <Submit />
  </form>;
}
