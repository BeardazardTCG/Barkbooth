import Link from "next/link";
import { AccountRoleSummary } from "@/components/roles";
import { ButtonLink, Card, PawAvatar, Section } from "@/components/ui";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

type DashboardDog = { id: string; name: string; registryNumber: string; primaryRole: string; breed: string | null };

const quickActions = [
  ["Register a Dog", "/register-dog", "Create a Bark Booth Identity for a dog."],
  ["Search Registry", "/profiles", "Find canine identities by name or number."],
  ["View Competitions", "/competitions", "Optional activities that build history."],
  ["Example Identity", "/dog-profile", "View an example Bark Booth Identity layout."],
];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(date);
}

export default async function DashboardPage() {
  const user = await requireUser();
  const account = await prisma.user.findUniqueOrThrow({ where: { id: user.id }, include: { ownerStatuses: true, roleApplications: true } });
  const dogs = await prisma.dogIdentity.findMany({
    where: { ownerships: { some: { userId: user.id } } },
    orderBy: { createdAt: "desc" },
  }) as DashboardDog[];

  return <>
    <Section eyebrow="Your account" title={`Welcome back, ${user.displayName}`}>
      <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <Card className="bg-gradient-to-br from-navy to-cocoa text-white">
          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 place-items-center rounded-3xl bg-white/15 text-4xl">👤</div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/55">Bark Booth Member</p>
              <h1 className="mt-1 text-3xl font-bold">{user.displayName}</h1>
              <p className="font-bold text-biscuit">@{user.username}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 text-sm font-bold">
            <div className="rounded-2xl bg-white/10 p-4"><span className="text-white/55">Account</span><p className="mt-1 text-lg text-white">Bark Booth Member</p></div>
            <div className="rounded-2xl bg-white/10 p-4"><span className="text-white/55">Country</span><p className="mt-1 text-lg text-white">{user.country}</p></div>
            <div className="rounded-2xl bg-white/10 p-4"><span className="text-white/55">Member since</span><p className="mt-1 text-lg text-white">{formatDate(user.createdAt)}</p></div>
          </div>
        </Card>

        <Card>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-rosette">Your account</p>
          <h2 className="mt-2 text-2xl font-bold text-navy">Community roles</h2>
          <p className="mt-2 leading-7 text-charcoal/65">Every account is a Bark Booth Member account. Pet Owner is self-declared; breeder, rescue, foster and professional labels become verified only after approval.</p>
          <div className="mt-5"><AccountRoleSummary ownerStatuses={account.ownerStatuses} applications={account.roleApplications} /></div>
          <div className="mt-5"><ButtonLink href="/account" variant="secondary">Manage roles and applications</ButtonLink></div>
        </Card>
      </div>
    </Section>

    <Section eyebrow="My dogs" title="Registered canine identities">
      {dogs.length ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{dogs.map((dog) => <Link key={dog.id} href={`/dogs/${dog.registryNumber}`} className="block"><Card><PawAvatar label={dog.name} className="h-24 w-24 text-4xl" /><h3 className="mt-4 text-2xl font-bold text-navy">{dog.name}</h3><p className="font-bold text-rosette">{dog.registryNumber}</p><p className="mt-2 text-sm font-bold text-charcoal/60">{dog.primaryRole}{dog.breed ? ` • ${dog.breed}` : ""}</p></Card></Link>)}</div> : <Card className="border-dashed border-cocoa/20 bg-white">
        <div className="grid place-items-center py-10 text-center">
          <PawAvatar label="No registered dogs" className="h-32 w-32 text-5xl" />
          <h2 className="mt-5 text-3xl font-bold text-navy">No Dogs Currently Registered</h2>
          <p className="mt-2 max-w-md text-charcoal/65">Register your first dog to create their Bark Booth Identity. The owner has the account; the dog has the identity.</p>
          <div className="mt-5"><ButtonLink href="/register-dog">+ Register a Dog</ButtonLink></div>
        </div>
      </Card>}
    </Section>

    <Section eyebrow="Quick actions" title="Manage Bark Booth records"><div id="records" />
      <div className="grid gap-4 md:grid-cols-4">{quickActions.map(([label, href, detail]) => <Card key={label}><h3 className="text-xl font-bold text-navy">{label}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-charcoal/65">{detail}</p><div className="mt-4"><ButtonLink href={href} variant="secondary">Open</ButtonLink></div></Card>)}</div>
    </Section>
  </>;
}
