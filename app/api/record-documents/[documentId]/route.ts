import { getCurrentUser } from "@/lib/auth/session";
import { isDogAccessCurrentlyActive } from "@/lib/dog-access";
import { prisma } from "@/lib/prisma";
import { getObject } from "@/lib/storage";

export async function GET(_request: Request, { params }: { params: { documentId: string } }) {
  const user = await getCurrentUser();
  if (!user) return new Response("Not found", { status: 404 });
  const document = await prisma.dogRecordDocument.findUnique({ where: { id: params.documentId }, include: { record: { include: { dog: { include: { ownerships: true, accessRequests: { where: { status: "APPROVED" }, include: { requester: { include: { roleApplications: true } } } } } } } } } });
  if (!document) return new Response("Not found", { status: 404 });
  const dog = document.record.dog;
  const owner = dog.ownerships.some((item) => item.userId === user.id);
  const shared = dog.accessRequests.some((item) => item.requesterUserId === user.id && isDogAccessCurrentlyActive(item));
  if (!owner && !shared) return new Response("Not found", { status: 404 });
  const object = await getObject(document.storageKey);
  const safeName = document.fileName.replace(/["\\\r\n]/g, "_");
  return new Response(object.body, { headers: { "Content-Type": document.contentType, "Content-Length": String(document.sizeBytes), "Content-Disposition": `inline; filename="${safeName}"`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}
