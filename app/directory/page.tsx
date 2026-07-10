import Link from "next/link";
import { DirectoryListingCard } from "@/components/roles";
import { EmptyState } from "@/components/empty-state";
import { ButtonLink, Card, Section } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
export default async function DirectoryPage() {
  const user = await getCurrentUser();
  const listings = await prisma.roleApplication.findMany({ where: { requestedRole: "PROFESSIONAL", status: "APPROVED" }, orderBy: [{ isFeatured: "desc" }, { reviewedAt: "desc" }] });
  return <><Section eyebrow="Directory" title="Verified professional directory"><Card><p className="text-lg leading-8 text-charcoal/70">Bark Booth professionals can apply for free verification. Approved listings show public business details only; private application evidence stays private.</p><div className="mt-5 flex flex-wrap gap-3">{user ? <ButtonLink href="/account">Apply or manage roles</ButtonLink> : <ButtonLink href="/signup">Create a free account</ButtonLink>}<ButtonLink href="/profiles" variant="secondary">Search dog registry</ButtonLink></div></Card></Section><Section eyebrow="Professionals" title="Approved listings">{listings.length ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{listings.map((listing) => <DirectoryListingCard key={listing.id} listing={listing} />)}</div> : <EmptyState title="No approved professionals listed yet">Verified Professional listings will appear here after Bark Booth approval. There are no fake listings and no paid placement active.</EmptyState>}</Section><Section eyebrow="Categories" title="Category-ready structure"><div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">{["Trainer", "Groomer", "Dog Walker", "Behaviourist", "Photographer", "Veterinary/Care"].map((c) => <Link key={c} href="/directory" className="rounded-2xl bg-white p-4 text-center text-sm font-black text-cocoa shadow-soft">{c}</Link>)}</div></Section></>;
}
