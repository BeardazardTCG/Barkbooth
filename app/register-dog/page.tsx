import { ButtonLink, Card, PawAvatar, Section } from "@/components/ui";

const roles = ["Pet", "Breeding", "Show", "Working", "Rescue", "Foster", "Retired", "Memorial", "Other"];
const visibility = ["Public", "Private", "Shared by link"];

function Field({ label, value }: { label: string; value: string }) {
  return <label className="block text-sm font-black text-navy">{label}<input defaultValue={value} readOnly className="mt-2 w-full rounded-2xl border border-cocoa/10 bg-cream px-4 py-3 font-bold text-charcoal" /></label>;
}

export default function RegisterDogPage() {
  return <>
    <Section eyebrow="Register a dog" title="Create a Bark Booth Identity">
      <Card className="bg-gradient-to-br from-white via-cream to-skysoft/40">
        <p className="max-w-3xl text-lg leading-8 text-charcoal/70">This frontend-only flow starts a lifelong canine identity record for the dog. It does not ask for detailed owner data, health records, family tree, documents or competition entries. Those optional sections can grow over time.</p>
        <p className="mt-3 font-black text-navy">The owner has the account. The dog has the identity.</p>
      </Card>
    </Section>

    <Section eyebrow="Step 1 of 3" title="Basic Information">
      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Dog name" value="Mabel" />
          <Field label="Date of birth" value="12 May 2023" />
          <Field label="Breed/type" value="Golden Retriever" />
          <Field label="Sex" value="Female" />
        </div>
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-lightgrey p-4"><span className="font-black text-navy">Estimated DOB</span><span className="rounded-full bg-white px-4 py-2 text-sm font-black text-cocoa">Toggle preview: Off</span></div>
        <div className="mt-5">
          <p className="text-sm font-black text-navy">Primary Dog Role</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-9">{roles.map(role => <span key={role} className={`rounded-2xl px-3 py-3 text-center text-sm font-black ${role === "Pet" ? "bg-pink text-white" : "bg-lightgrey text-cocoa"}`}>{role}</span>)}</div>
          <p className="mt-3 text-sm font-bold text-charcoal/55">Dog Role is separate from the owner’s account status.</p>
        </div>
      </Card>
    </Section>

    <Section eyebrow="Step 2 of 3" title="Optional Details">
      <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
        <Card><PawAvatar label="Official profile photo placeholder" /><p className="mt-4 text-center text-sm font-black text-navy">Official profile photo placeholder</p><p className="mt-2 text-center text-xs text-charcoal/55">No upload is connected in this frontend preview.</p></Card>
        <Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Colour" value="Golden" />
            <Field label="Country of registration" value="United Kingdom" />
          </div>
          <div className="mt-5">
            <p className="text-sm font-black text-navy">Visibility</p>
            <div className="mt-3 flex flex-wrap gap-2">{visibility.map(option => <span key={option} className={`rounded-full px-4 py-2 text-sm font-black ${option === "Public" ? "bg-cocoa text-white" : "bg-lightgrey text-cocoa"}`}>{option}</span>)}</div>
          </div>
        </Card>
      </div>
    </Section>

    <Section eyebrow="Step 3 of 3" title="Review & Confirm">
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="bg-gradient-to-br from-navy to-cocoa text-white"><p className="text-sm font-black uppercase tracking-[0.2em] text-white/55">Canine Identity Card Preview</p><h2 className="mt-3 text-5xl font-black">Mabel</h2><p className="mt-2 text-2xl font-black text-biscuit">BB-00012345</p><div className="mt-5 grid gap-3 text-sm font-bold sm:grid-cols-2"><span>Breed: Golden Retriever</span><span>DOB: 12 May 2023</span><span>Sex: Female</span><span>Role: Pet</span><span>Colour: Golden</span><span>Country: United Kingdom</span></div></Card>
        <Card><h3 className="text-2xl font-black text-navy">Frontend-only confirmation</h3><p className="mt-3 leading-7 text-charcoal/70">This mock page does not create a real record yet. No backend, account persistence, payment, upload, verification or document storage is connected.</p><p className="mt-3 leading-7 text-charcoal/70">When connected in future, the Bark Booth Identity would belong to the dog and stay with them for life, even if ownership changes.</p><div className="mt-5 flex flex-wrap gap-3"><ButtonLink href="/dog-profile">View Example Identity</ButtonLink><ButtonLink href="/dashboard" variant="secondary">Back to Dashboard</ButtonLink></div></Card>
      </div>
    </Section>
  </>;
}
