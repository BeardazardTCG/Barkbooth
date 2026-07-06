import { profileDog } from "@/lib/data";
import { Card, PawAvatar, Section } from "@/components/ui";

const identity = {
  registryNumber: "BB-000001",
  breed: "Golden Retriever",
  dateOfBirth: "12 May 2023",
  sex: "Female",
  role: "Pet",
  colour: "Golden",
  country: "United Kingdom",
  status: "Active",
  created: "01 June 2024",
};

const recordSections = [
  ["Health", "3 Records", "Vaccinations, health checks, tests and medical notes."],
  ["Family Tree", "4 Entries", "Parents, siblings and offspring information."],
  ["Competitions", "12 Entries", "Optional activities, results and achievements."],
  ["Badges & Awards", "8 Earned", "Training, activity and community badges."],
  ["Verified Documents", "5 Verified", "KC registration, DNA tests and certificates."],
];

const history = [
  ["Current Owner", "Amy Crosdale", "Since 01 June 2024", "Current"],
  ["Previous Owner", "Private", "15 November 2023 – 01 June 2024", "2nd Owner"],
  ["Breeder", "Sunrise Retrievers", "12 May 2023 – 15 November 2023", "Breeder"],
  ["Rescue / Foster", "Happy Tails Rescue", "01 February 2023 – 12 May 2023", "Foster"],
];

export default function DogProfilePage() {
  const dog = profileDog;

  return <>
    <Section eyebrow="Canine Identity" title="Bark Booth Identity Record">
      <Card className="overflow-hidden bg-white">
        <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <PawAvatar label="Official Profile Photograph" className="min-h-[320px] text-7xl" />
            <div className="mt-3 rounded-2xl border border-cocoa/10 bg-white p-3 text-center text-sm font-black text-cocoa">Official Profile Photograph</div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-cocoa">{identity.status}</span><span className="rounded-full bg-lightgrey px-4 py-2 text-sm font-black text-cocoa">Identity created {identity.created}</span></div>
            <h1 className="mt-4 text-6xl font-black tracking-tight text-navy md:text-8xl">{dog.name}</h1>
            <p className="mt-2 text-3xl font-black text-cocoa">{identity.registryNumber}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Breed", identity.breed],
                ["Date of Birth", identity.dateOfBirth],
                ["Sex", identity.sex],
                ["Primary Role", identity.role],
                ["Colour", identity.colour],
                ["Country of Registration", identity.country],
                ["Identity status", identity.status],
                ["Identity created date", identity.created],
              ].map(([label, value]) => <div key={label} className="rounded-2xl bg-lightgrey p-4"><p className="text-xs font-black uppercase tracking-widest text-pink">{label}</p><p className="mt-1 font-black text-navy">{value}</p></div>)}
            </div>
          </div>
        </div>
      </Card>
    </Section>

    <Section eyebrow="Identity record areas" title="Structured records that can grow over time">
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {[...recordSections, ["History", "6 Entries", "Ownership, breeder, rescue and foster continuity."]].map(([title, count, detail]) => <Card key={title}><p className="text-sm font-black uppercase tracking-widest text-terracotta">{count}</p><h3 className="mt-2 text-xl font-black text-navy">{title}</h3><p className="mt-2 text-sm leading-6 text-charcoal/65">{detail}</p></Card>)}
      </div>
    </Section>

    <Section eyebrow="Expandable sections" title="Mock canine record modules">
      <div className="space-y-3">
        {recordSections.map(([title, count, detail]) => <details key={title} className="rounded-[1.5rem] border border-white/70 bg-white/85 p-5 shadow-soft" open={title === "Health"}>
          <summary className="cursor-pointer list-none"><span className="text-xl font-black text-navy">{title}</span><span className="float-right rounded-full bg-lightgrey px-3 py-1 text-sm font-black text-cocoa">{count}</span></summary>
          <p className="mt-3 text-charcoal/65">{detail} Mock data only; no live verification or uploads are connected.</p>
        </details>)}
        <details className="rounded-[1.5rem] border border-white/70 bg-white/85 p-5 shadow-soft" open>
          <summary className="cursor-pointer list-none"><span className="text-xl font-black text-navy">History</span><span className="float-right rounded-full bg-lightgrey px-3 py-1 text-sm font-black text-cocoa">6 Entries</span></summary>
          <p className="mt-3 text-charcoal/65">History demonstrates identity continuity when ownership or care changes.</p>
          <div className="mt-4 space-y-3">{history.map(([role, name, date, tag]) => <div key={role} className="grid gap-2 rounded-2xl bg-lightgrey p-4 md:grid-cols-[0.8fr_1fr_1fr_auto] md:items-center"><p className="font-black text-navy">{role}</p><p className="font-bold text-charcoal/75">{name}</p><p className="text-sm font-bold text-charcoal/55">{date}</p><span className="rounded-full bg-white px-3 py-2 text-xs font-black text-cocoa">{tag}</span></div>)}</div>
        </details>
      </div>
    </Section>

    <Section eyebrow="Registry note" title="A stable identity, not a social feed">
      <Card><p className="leading-7 text-charcoal/70">This Bark Booth Identity keeps permanent structured information at the top and moves changeable health, document, family, competition and ownership history into clear record areas. Likes, comments, followers and messaging are intentionally not part of this page.</p></Card>
    </Section>
  </>;
}
