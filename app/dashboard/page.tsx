import { ButtonLink, Card, PawAvatar, Section } from "@/components/ui";

const ownerStatuses = [
  ["Pet Owner", "Primary account status"],
  ["Breeder", "Shown as an additional owner status"],
  ["Rescue", "Available for organisations"],
  ["Foster", "For temporary care roles"],
];

const professionalExamples = ["Dog Groomer", "Trainer", "Walker", "Behaviourist", "Nutritionist", "Photographer", "Pet Sitter"];
const quickActions = [
  ["Register a Dog", "/register-dog", "Create a Bark Booth Identity for a dog."],
  ["Search Registry", "/profiles", "Find canine identities by name or number."],
  ["View Competitions", "/competitions", "Optional activities that build history."],
  ["Manage Documents", "/dog-profile", "Mock document area for future records."],
];

export default function DashboardPage() {
  return <>
    <Section eyebrow="User dashboard" title="Welcome back, Amy Crosdale">
      <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <Card className="bg-gradient-to-br from-navy to-cocoa text-white">
          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 place-items-center rounded-3xl bg-white/15 text-4xl">👤</div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-white/55">Mock logged-in user</p>
              <h1 className="mt-1 text-3xl font-black">Amy Crosdale</h1>
              <p className="font-bold text-biscuit">@amycrosdale</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 text-sm font-bold">
            <div className="rounded-2xl bg-white/10 p-4"><span className="text-white/55">Country</span><p className="mt-1 text-lg text-white">United Kingdom</p></div>
            <div className="rounded-2xl bg-white/10 p-4"><span className="text-white/55">Member since</span><p className="mt-1 text-lg text-white">May 2024</p></div>
          </div>
        </Card>

        <Card>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-terracotta">Owner Status, not Dog Role</p>
          <h2 className="mt-2 text-2xl font-black text-navy">Account statuses</h2>
          <p className="mt-2 leading-7 text-charcoal/65">People can have one or more owner statuses. Dogs separately have identities and dog roles such as Pet, Breeding, Show, Working or Rescue.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ownerStatuses.map(([status, detail]) => <div key={status} className="rounded-2xl border border-cocoa/10 bg-lightgrey p-4"><p className="text-lg font-black text-navy">{status}</p><p className="mt-1 text-sm text-charcoal/60">{detail}</p></div>)}
          </div>
          <div className="mt-4 rounded-2xl border border-pink/15 bg-pink/5 p-4">
            <p className="font-black text-navy">Professional</p>
            <p className="mt-1 text-sm text-charcoal/65">Parent category examples:</p>
            <div className="mt-3 flex flex-wrap gap-2">{professionalExamples.map(example => <span key={example} className="rounded-full bg-white px-3 py-2 text-xs font-black text-cocoa shadow-sm">{example}</span>)}</div>
          </div>
        </Card>
      </div>
    </Section>

    <Section eyebrow="My dogs" title="Registered canine identities">
      <Card className="border-dashed border-cocoa/20 bg-white">
        <div className="grid place-items-center py-10 text-center">
          <PawAvatar label="No registered dogs" className="h-32 w-32 text-5xl" />
          <h2 className="mt-5 text-3xl font-black text-navy">No Dogs Currently Registered</h2>
          <p className="mt-2 max-w-md text-charcoal/65">Register your first dog to create their Bark Booth Identity. The owner has the account; the dog has the identity.</p>
          <div className="mt-5"><ButtonLink href="/register-dog">+ Register a Dog</ButtonLink></div>
        </div>
      </Card>
    </Section>

    <Section eyebrow="Quick actions" title="Manage Bark Booth identity records">
      <div className="grid gap-4 md:grid-cols-4">{quickActions.map(([label, href, detail]) => <Card key={label}><h3 className="text-xl font-black text-navy">{label}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-charcoal/65">{detail}</p><div className="mt-4"><ButtonLink href={href} variant="secondary">Open</ButtonLink></div></Card>)}</div>
    </Section>
  </>;
}
