import Link from "next/link";
import { Card, Section } from "@/components/ui";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return <Section eyebrow="Welcome back" title="Log in to Bark Booth">
    <Card>
      <LoginForm />
      <p className="mt-5 text-sm font-bold text-charcoal/60">Need an account? <Link href="/signup" className="text-pink">Sign up</Link>.</p>
    </Card>
  </Section>;
}
