import { DirectoryListingCard } from "@/components/roles";
import { EmptyState } from "@/components/empty-state";
import { ButtonLink, Card, Section } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { isActiveProfessionalPromotion } from "@/lib/roles";
export default async function DirectoryPage() {
  const user = await getCurrentUser();
  const rawListings = await prisma.roleApplication.findMany({ where: { requestedRole: "PROFESSIONAL", status: "APPROVED" } });
  const now = new Date();
  const listings = rawListings.sort((a, b) => Number(isActiveProfessionalPromotion(b, now)) - Number(isActiveProfessionalPromotion(a, now)) || (a.publicDisplayName || a.organisationName || "").localeCompare(b.publicDisplayName || b.organisationName || ""));
  return <><Section eyebrow="Directory" title="Verified professional directory"><Card><p className="text-lg leading-8 text-charcoal/70">Bark Booth professionals can apply for free verification and a basic directory presence. Featured treatment is separate optional promotion and never changes the Verified Professional label. Bark Booth does not charge people simply to belong; charges may apply when additional registration, promotional or commercial value is provided. Approved listings show public business details only; private application evidence stays private.</p><div className="mt-5 flex flex-wrap gap-3">{user ? <ButtonLink href="/account">Apply or manage roles</ButtonLink> : <ButtonLink href="/signup">Create a free account</ButtonLink>}<ButtonLink href="/profiles" variant="secondary">Search dog registry</ButtonLink></div></Card></Section><Section eyebrow="Professionals" title="Approved listings">{listings.length ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{listings.map((listing) => <DirectoryListingCard key={listing.id} listing={listing} />)}</div> : <EmptyState title="No approved professionals listed yet">Verified Professional listings will appear here as members are approved.</EmptyState>}</Section><Section eyebrow="Categories" title="Professional categories"><div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">{["Trainer", "Groomer", "Dog Walker", "Behaviourist", "Photographer", "Veterinary/Care"].map((c) => <span key={c} className="rounded-2xl bg-white p-4 text-center text-sm font-bold text-navy shadow-soft">{c}</span>)}</div></Section></>;
}
