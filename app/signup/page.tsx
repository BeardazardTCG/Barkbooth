import Link from "next/link";
import { BarkBoothLogo } from "@/components/nav";
import { Card, Section } from "@/components/ui";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return <Section eyebrow="Create account" title="Create your Bark Booth account">
    <p className="mb-4 max-w-2xl text-charcoal/70">Create a free account to register and manage your dogs.</p>
    <Card className="max-w-3xl">
      <div className="mb-4 border-b border-navy/10 pb-4"><BarkBoothLogo /></div>
      <SignupForm />
      <p className="mt-5 text-sm font-bold text-charcoal/60">Already registered? <Link href="/login" className="text-info">Log in</Link>.</p>
    </Card>
  </Section>;
}
