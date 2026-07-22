import { getCurrentUser } from "@/lib/auth/session";
import { isDogAccessCurrentlyActive } from "@/lib/dog-access";
import { prisma } from "@/lib/prisma";
import { getObject } from "@/lib/storage";

export async function GET(_request: Request, { params }: { params: { dogId: string } }) {
  const [dog, user] = await Promise.all([
    prisma.dogIdentity.findUnique({ where: { id: params.dogId }, include: { profilePhoto: true, ownerships: true, accessRequests: { where: { status: "APPROVED" }, include: { requester: { include: { roleApplications: true } } } } } }),
    getCurrentUser(),
  ]);
  if (!dog?.profilePhoto) return new Response("Not found", { status: 404 });
  const owner = Boolean(user && dog.ownerships.some((item) => item.userId === user.id));
  const shared = Boolean(user && dog.accessRequests.some((item) => item.requesterUserId === user.id && isDogAccessCurrentlyActive(item)));
  if (dog.visibility !== "PUBLIC" && !owner && !shared) return new Response("Not found", { status: 404 });
  const object = await getObject(dog.profilePhoto.storageKey);
  return new Response(object.body, { headers: { "Content-Type": dog.profilePhoto.contentType, "Content-Length": String(dog.profilePhoto.sizeBytes), "Cache-Control": dog.visibility === "PUBLIC" ? "public, max-age=3600" : "private, no-store", "X-Content-Type-Options": "nosniff" } });
}
