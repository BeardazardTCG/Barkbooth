import Link from "next/link";
import { Card, Section } from "@/components/ui";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return <Section eyebrow="Create account" title="Sign up for Bark Booth testing">
    <Card>
      <SignupForm />
      <p className="mt-5 text-sm font-bold text-charcoal/60">Already registered? <Link href="/login" className="text-pink">Log in</Link>.</p>
    </Card>
  </Section>;
}
