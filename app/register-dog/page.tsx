import { Card, Section } from "@/components/ui";
import { requireUser } from "@/lib/auth/session";
import { RegisterDogForm } from "./register-dog-form";

export default async function RegisterDogPage() {
  await requireUser();
  return <Section eyebrow="Register a dog" title="Create your dog’s identity">
    <p className="mb-4 max-w-2xl text-charcoal/70">Add the essentials now. Everything else can be completed later from the profile.</p>
    <Card className="bg-gradient-to-br from-white via-offwhite to-skysoft/40"><RegisterDogForm /></Card>
  </Section>;
}
