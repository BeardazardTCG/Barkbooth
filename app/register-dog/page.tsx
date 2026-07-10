import { Card, Section } from "@/components/ui";
import { requireUser } from "@/lib/auth/session";
import { RegisterDogForm } from "./register-dog-form";

export default async function RegisterDogPage() {
  await requireUser();
  return <>
    <Section eyebrow="Register a dog" title="Create a Bark Booth Identity">
      <Card className="bg-gradient-to-br from-white via-cream to-skysoft/40">
        <p className="max-w-3xl text-lg leading-8 text-charcoal/70">Start your dog’s lifelong Bark Booth Identity with the basic details. You can add more records, documents, achievements, and history later.</p>
        <p className="mt-3 font-bold text-navy">The owner has the account. The dog has the identity.</p>
      </Card>
    </Section>
    <Section eyebrow="Dog identity" title="Basic registration details">
      <Card><RegisterDogForm /></Card>
    </Section>
  </>;
}
