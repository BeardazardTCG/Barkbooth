import { achievements, dogs } from "@/lib/data";
import { Card, Section } from "@/components/ui";

export default function RewardsPage() { return <Section eyebrow="Achievements" title="Rosettes, badges, and streaks"><div className="grid gap-4 md:grid-cols-3"><Card><p className="text-sm font-bold uppercase tracking-widest text-rosette">Profile momentum</p><p className="mt-2 text-5xl font-bold">{dogs[0].points}</p><p className="mt-2 text-navy/65">Mock points earned through entries, placements, streaks, and community participation.</p></Card>{achievements.map(item => <Card key={item}><h3 className="text-xl font-bold">🏅 {item}</h3><p className="mt-2 text-navy/65">A collectible achievement that makes every proud dog moment feel part of a bigger story.</p></Card>)}</div></Section>; }
