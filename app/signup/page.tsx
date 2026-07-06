import Link from "next/link";
import { Card, Section } from "@/components/ui";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return <Section eyebrow="Create account" title="Create your Bark Booth account">
    <p className="mb-5 max-w-2xl text-lg leading-8 text-charcoal/70">Create a free account so you can register dogs, manage canine identities, and build records over time.</p>
    <Card>
      <SignupForm />
      <p className="mt-5 text-sm font-bold text-charcoal/60">Already registered? <Link href="/login" className="text-pink">Log in</Link>.</p>
    </Card>
  </Section>;
}
