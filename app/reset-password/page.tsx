import Link from "next/link";
import { Card, Section } from "@/components/ui";
import { ResetPasswordForm } from "./reset-password-form";

export default function ResetPasswordPage({ searchParams }: { searchParams?: { token?: string } }) {
  const token = searchParams?.token ?? "";
  return <Section eyebrow="Account recovery" title="Choose a new password"><Card className="max-w-xl">
    {token ? <ResetPasswordForm token={token} /> : <p role="alert" className="rounded-2xl bg-red-50 p-4 font-bold text-red-800">This reset link is invalid. Request a new one.</p>}
    <p className="mt-5 text-sm font-bold"><Link href="/forgot-password" className="text-info">Request a new reset link</Link></p>
  </Card></Section>;
}
