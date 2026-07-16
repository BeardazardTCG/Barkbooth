import Link from "next/link";
import { BarkBoothLogo } from "@/components/nav";
import { Card, Section } from "@/components/ui";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return <Section eyebrow="Welcome back" title="Log in to Bark Booth">
    <Card>
      <div className="mb-6 border-b border-navy/10 pb-5"><BarkBoothLogo /></div>
      <LoginForm />
      <p className="mt-5 text-sm font-bold text-charcoal/60">Need an account? <Link href="/signup" className="text-info">Sign up</Link>.</p>
    </Card>
  </Section>;
}
