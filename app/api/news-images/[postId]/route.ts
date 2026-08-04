import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { getObject } from "@/lib/storage";
export async function GET(_: Request, { params }: { params: { postId: string } }) { const [post, user] = await Promise.all([prisma.newsPost.findUnique({ where: { id: params.postId } }), getCurrentUser()]); if (!post?.imageStorageKey || (post.status !== "PUBLISHED" && user?.role !== "ADMIN")) return new NextResponse("Not found", { status: 404 }); const object = await getObject(post.imageStorageKey); return new NextResponse(object.body, { headers: { "content-type": post.imageContentType ?? "application/octet-stream", "cache-control": post.status === "PUBLISHED" ? "public, max-age=300" : "private, no-store" } }); }
