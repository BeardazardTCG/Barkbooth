import { ButtonLink, Card, PawAvatar, Section } from "@/components/ui";

const basics = [
  "Dog name and a profile photo placeholder",
  "Dog role such as family companion, rescue, working, show, foster, retired, or memorial",
  "Breed, crossbreed, type, or unknown background — all optional and owner-controlled",
  "Visibility choice: public, private, or shared by link",
];

export default function RegisterDogPage() {
  return <>
    <Section eyebrow="Register your dog" title="Create your dog’s Bark Booth profile">
      <div className="grid gap-5 md:grid-cols-[1fr_0.9fr] md:items-start">
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-white via-cream to-skysoft/50">
            <p className="text-lg leading-8 text-charcoal/70">Start with only the basics and build the profile over time. Bark Booth is designed as a lifelong registry and identity record for every dog, not a competition requirement.</p>
            <p className="mt-3 text-lg leading-8 text-charcoal/70">Advanced information is not required. Optional competitions, calendar moments, tricks, badges, and memories can be added later as profile chapters.</p>
          </Card>
          <div className="grid gap-3 sm:grid-cols-2">
            {basics.map(item => <Card key={item}><p className="font-bold leading-7 text-charcoal/70">{item}</p></Card>)}
          </div>
          <div className="flex flex-wrap gap-3"><ButtonLink href="/dog-profile">View Example Profile</ButtonLink><ButtonLink href="/profiles" variant="secondary">Search Registry</ButtonLink></div>
        </div>
        <Card className="bg-white">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-terracotta">Mock registration preview</p>
          <PawAvatar label="Profile photo placeholder" className="mt-4" />
          <div className="mt-5 space-y-3">
            <label className="block text-sm font-black text-navy">Dog name<input defaultValue="Mabel" className="mt-2 w-full rounded-2xl border border-cocoa/10 bg-cream px-4 py-3 font-bold text-charcoal" readOnly /></label>
            <label className="block text-sm font-black text-navy">Dog role<input defaultValue="Family companion" className="mt-2 w-full rounded-2xl border border-cocoa/10 bg-cream px-4 py-3 font-bold text-charcoal" readOnly /></label>
            <label className="block text-sm font-black text-navy">Breed/type optional<input defaultValue="Cocker Spaniel mix" className="mt-2 w-full rounded-2xl border border-cocoa/10 bg-cream px-4 py-3 font-bold text-charcoal" readOnly /></label>
          </div>
          <div className="mt-4">
            <p className="text-sm font-black text-navy">Visibility options</p>
            <div className="mt-2 flex flex-wrap gap-2">{["Public", "Private", "Shared by link"].map(option => <span key={option} className="rounded-full bg-lightgrey px-3 py-2 text-xs font-black text-cocoa">{option}</span>)}</div>
          </div>
          <div className="mt-5 rounded-2xl bg-pink/10 p-4">
            <p className="text-xs font-black uppercase tracking-widest text-pink">Preview/mock only</p>
            <p className="mt-1 text-2xl font-black text-navy">BB-000123</p>
            <p className="mt-1 text-sm text-charcoal/65">Example Bark Booth Registry Number. No real registration is created on this frontend-only page.</p>
          </div>
        </Card>
      </div>
    </Section>
  </>;
}
