import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { competitionIsPubliclyVisible } from "@/lib/competitions";
import { prisma } from "@/lib/prisma";
import { getObject } from "@/lib/storage";
export async function GET(_: Request, { params }: { params: { judgeId: string } }) { const [judge, user] = await Promise.all([prisma.competitionJudge.findUnique({ where: { id: params.judgeId }, include: { competition: true } }), getCurrentUser()]); if (!judge?.imageStorageKey || (!competitionIsPubliclyVisible(judge.competition.status) && user?.role !== "ADMIN")) return new NextResponse("Not found", { status: 404 }); const object = await getObject(judge.imageStorageKey); return new NextResponse(object.body, { headers: { "content-type": judge.imageContentType ?? "application/octet-stream", "cache-control": competitionIsPubliclyVisible(judge.competition.status) ? "public, max-age=300" : "private, no-store" } }); }
