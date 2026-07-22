import { ButtonLink, Card, Section } from "@/components/ui";

const steps = [
  ["Create your account", "Your account lets you register and manage the dogs in your care."],
  ["Register your dog", "Add the core identity details and receive a unique Bark Booth registry number."],
  ["Build their record", "Keep identity, ownership and owner-declared records together throughout your dog’s life."],
];

const principles = [
  ["One lifelong identity", "A stable registry number gives each dog one clear record that can grow over time."],
  ["Owner controlled", "You choose whether an identity is public or private. Detailed records are reserved for authorised viewers."],
  ["Clear trust labels", "Owner-declared information is identified as such and is never presented as independently verified."],
  ["Every dog belongs", "Family pets, working dogs, rescues, crossbreeds, pedigrees and memorial identities are welcome."],
];

export default function HomePage() {
  return <>
    <section className="px-5 py-12 sm:px-8 md:py-20"><div className="mx-auto max-w-4xl text-center"><p className="registry-label text-info">Bark Booth Canine Registry</p><h1 className="mt-4 font-heading text-5xl font-extrabold leading-tight tracking-tight text-navy md:text-7xl">A lifelong identity for your dog.</h1><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-charcoal/70">Register your dog, receive a unique Bark Booth registry number and keep their identity and important records together in one owner-managed profile.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><ButtonLink href="/signup">Create free account</ButtonLink><ButtonLink href="/profiles" variant="secondary">Search the registry</ButtonLink></div></div></section>
    <Section eyebrow="How it works" title="A clear record from the beginning"><div className="grid gap-4 md:grid-cols-3">{steps.map(([title, detail], index) => <Card key={title}><p className="registry-label text-info">Step {index + 1}</p><h2 className="mt-2 text-xl font-bold text-navy">{title}</h2><p className="mt-2 leading-7 text-charcoal/65">{detail}</p></Card>)}</div></Section>
    <Section eyebrow="Built for trust" title="The dog has the identity. You control the record."><div className="grid gap-4 md:grid-cols-2">{principles.map(([title, detail]) => <Card key={title}><h2 className="text-xl font-bold text-navy">{title}</h2><p className="mt-2 leading-7 text-charcoal/65">{detail}</p></Card>)}</div></Section>
    <Section eyebrow="Public registry" title="Find a public Bark Booth identity"><Card className="bg-gradient-to-br from-white to-skysoft/50"><p className="max-w-2xl text-lg leading-8 text-charcoal/70">Search real public identities by dog name or exact registry number. Private identities and detailed record information do not appear in public search.</p><div className="mt-5"><ButtonLink href="/profiles" variant="secondary">Search the registry</ButtonLink></div></Card></Section>
  </>;
}
