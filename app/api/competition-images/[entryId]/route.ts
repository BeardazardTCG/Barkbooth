import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getObject } from "@/lib/storage";
import { getCurrentUser } from "@/lib/auth/session";
import { competitionIsPubliclyVisible, publicEntryStatus } from "@/lib/competitions";
export async function GET(_:Request,{params}:{params:{entryId:string}}){ const [entry,user]=await Promise.all([prisma.competitionEntry.findUnique({where:{id:params.entryId},include:{competition:true}}),getCurrentUser()]); if(!entry)return new NextResponse("Not found",{status:404}); const publicAllowed=publicEntryStatus(entry.status)&&competitionIsPubliclyVisible(entry.competition.status)&&Boolean(entry.imageUseConsentAt); const privateAllowed=user&&(user.role==="ADMIN"||user.id===entry.submittedById); if(!publicAllowed&&!privateAllowed)return new NextResponse("Not found",{status:404}); const object=await getObject(entry.storageKey); return new NextResponse(object.body,{headers:{"content-type":entry.contentType,"cache-control":publicAllowed?"public, max-age=300":"private, no-store"}}); }
