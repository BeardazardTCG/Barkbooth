import type { RequestedRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function verifiedUsersForRole(role: RequestedRole) {
  return prisma.roleApplication.findMany({ where: { requestedRole: role, status: "APPROVED" } });
}
