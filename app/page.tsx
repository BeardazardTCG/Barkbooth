import { BarkBoothLogo } from "@/components/nav";
import { ButtonLink, Card, Section } from "@/components/ui";

const identityAreas = [
  ["Permanent identity", "A Bark Booth registry number anchors your dog’s identity for life."],
  ["Ownership and access", "Keep ownership clear and grant controlled access to co-owners, fosters and trusted professionals."],
  ["Records and behaviour", "Manage identity, health, care and behaviour information with privacy controls."],
  ["Achievements", "Real activities, competition results, badges and rosettes can become part of the same lasting profile."],
];

const journeys = [
  ["Family", "Keep the identity of a much-loved companion organised through every life stage."],
  ["Rescue and foster", "Carry important context across rescue, foster, adoption and settled-life chapters."],
  ["Breeding and working", "Connect breeder, pedigree, qualification and working records where they apply."],
  ["Memorial", "Preserve a dog’s identity and meaningful history beyond their lifetime."],
];

export default function HomePage() {
  return <>
    <section className="px-5 pb-8 pt-8 sm:px-8 md:grid md:grid-cols-[1fr_0.85fr] md:items-center md:gap-8 md:py-14">
      <div>
        <p className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-bold text-info shadow-sm"><BarkBoothLogo iconOnly /> Bark Booth · Canine Identity</p>
        <h1 className="mt-5 text-5xl font-bold leading-[0.95] tracking-tight text-navy md:text-7xl">Create a lifelong identity for your dog.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-charcoal/75">Register your dog, receive a permanent Bark Booth registry number and manage the information that follows them through life. One identity can bring together ownership, records, behaviour, privacy, achievements and the people trusted to help care for them.</p>
        <div className="mt-7 flex flex-wrap gap-3"><ButtonLink href="/signup">Create account</ButtonLink><ButtonLink href="/register-dog" variant="secondary">Register a dog</ButtonLink><ButtonLink href="/profiles" variant="secondary">Search registry</ButtonLink><ButtonLink href="/competitions" variant="secondary">View competitions</ButtonLink></div>
      </div>
      <Card className="mt-8 bg-gradient-to-br from-white via-offwhite to-skysoft/70 md:mt-0"><p className="registry-label">One identity, for life</p><ol className="mt-5 grid gap-4">{["Create your Bark Booth account.", "Register your dog and receive their permanent registry number.", "Choose what is public and who has authorised access.", "Add genuine records, relationships and achievements as their story grows."].map((step, index) => <li key={step} className="flex gap-4 rounded-2xl bg-white/80 p-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-info font-bold text-white">{index + 1}</span><span className="font-bold leading-7 text-navy">{step}</span></li>)}</ol></Card>
    </section>
    <Section eyebrow="The lifelong record" title="Everything important stays connected"><div className="grid gap-4 md:grid-cols-4">{identityAreas.map(([title, detail]) => <Card key={title}><h2 className="text-xl font-bold text-navy">{title}</h2><p className="mt-2 leading-7 text-charcoal/65">{detail}</p></Card>)}</div></Section>
    <Section eyebrow="Every dog’s journey" title="Built for the many people and chapters in a dog’s life"><div className="grid gap-4 md:grid-cols-4">{journeys.map(([title, detail]) => <Card key={title}><h2 className="text-xl font-bold text-navy">{title}</h2><p className="mt-2 leading-7 text-charcoal/65">{detail}</p></Card>)}</div></Section>
    <Section eyebrow="Activities and competitions" title="Grow the identity through genuine achievements"><Card className="bg-gradient-to-br from-white to-skysoft/60"><p className="text-lg leading-8 text-charcoal/70">Bark Booth competitions and activities connect to registered dog identities. When live events open, genuine entries, results, badges and rosettes will attach to the participating dog’s profile—never to an invented profile or result.</p><div className="mt-5"><ButtonLink href="/competitions">Explore competitions</ButtonLink></div></Card></Section>
    <Section eyebrow="Roles and trusted care" title="Support for breeders, rescues, fosters and professionals"><Card><p className="text-lg leading-8 text-charcoal/70">Members can apply for supported roles, and approved dog professionals can appear in the public directory. Controlled sharing lets owners give the right level of access to people involved in a dog’s care without making private information public.</p><div className="mt-5 flex flex-wrap gap-3"><ButtonLink href="/directory">Explore the directory</ButtonLink><ButtonLink href="/about" variant="secondary">How Bark Booth works</ButtonLink></div></Card></Section>
  </>;
}
