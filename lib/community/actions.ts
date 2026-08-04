"use server";

import type { PublicationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { validateEvidenceUrl } from "@/lib/evidence-links";
import { deleteObject, putObject } from "@/lib/storage";
import { imageContentTypes, MAX_PROFILE_PHOTO_BYTES, storageKey, validateUpload } from "@/lib/uploads";

const publicationStatuses = new Set<PublicationStatus>(["DRAFT", "PUBLISHED", "ARCHIVED"]);
const field = (form: FormData, name: string) => String(form.get(name) ?? "").trim();
async function requireAdmin() { const user = await requireUser(); if (user.role !== "ADMIN") throw new Error("Administrator access required."); return user; }
function status(form: FormData) { const next = field(form, "status") as PublicationStatus; if (!publicationStatuses.has(next)) throw new Error("Choose a valid publication status."); return next; }
function refreshCommunity() { revalidatePath("/news"); revalidatePath("/events"); revalidatePath("/admin/community"); }
async function cleanup(key: string | null, operation: string) { if (!key) return; await deleteObject(key).catch((error) => console.error("Community image cleanup failed", { operation, error })); }

export async function saveNews(form: FormData) {
  const user = await requireAdmin(); const id = field(form, "id"); const nextStatus = status(form);
  const title = field(form, "title"), slug = field(form, "slug"), body = field(form, "body");
  if (!title || !slug || !body || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Title, a valid slug and body are required.");
  const existing = id ? await prisma.newsPost.findUnique({ where: { id } }) : null;
  if (id && !existing) throw new Error("News item not found.");
  const data = { title, slug, summary: field(form, "summary") || null, body, status: nextStatus, featured: form.get("featured") === "on", publishedAt: nextStatus === "PUBLISHED" ? existing?.publishedAt ?? new Date() : null };
  if (existing) await prisma.newsPost.update({ where: { id }, data }); else await prisma.newsPost.create({ data: { ...data, authorId: user.id } });
  refreshCommunity(); redirect("/admin/community?updated=news");
}
export async function deleteNews(form: FormData) { await requireAdmin(); const post = await prisma.newsPost.delete({ where: { id: field(form, "id") } }); await cleanup(post.imageStorageKey, "deleteNews"); refreshCommunity(); redirect("/admin/community?updated=news-deleted"); }
export async function uploadNewsImage(form: FormData) {
  await requireAdmin(); const id = field(form, "id"); const post = await prisma.newsPost.findUnique({ where: { id } }); if (!post) throw new Error("News item not found.");
  const { file, bytes } = await validateUpload(form.get("image"), imageContentTypes, MAX_PROFILE_PHOTO_BYTES); const key = storageKey(`news/${id}`, file.type); await putObject(key, bytes, file.type);
  try { await prisma.newsPost.update({ where: { id }, data: { imageStorageKey: key, imageFileName: file.name, imageContentType: file.type, imageSizeBytes: file.size } }); } catch (error) { await cleanup(key, "rollbackNewsImage"); throw error; }
  await cleanup(post.imageStorageKey, "replaceNewsImage"); refreshCommunity(); redirect("/admin/community?updated=news-image");
}
export async function removeNewsImage(form: FormData) { await requireAdmin(); const id = field(form, "id"); const post = await prisma.newsPost.findUnique({ where: { id } }); if (!post) throw new Error("News item not found."); await prisma.newsPost.update({ where: { id }, data: { imageStorageKey: null, imageFileName: null, imageContentType: null, imageSizeBytes: null } }); await cleanup(post.imageStorageKey, "removeNewsImage"); refreshCommunity(); redirect("/admin/community?updated=news-image"); }

export async function saveEvent(form: FormData) {
  const user = await requireAdmin(); const id = field(form, "id"), startsAt = new Date(field(form, "startsAt")), endsAt = field(form, "endsAt") ? new Date(field(form, "endsAt")) : null, externalUrl = field(form, "externalUrl");
  const name = field(form, "name"), description = field(form, "description"); if (!name || !description || Number.isNaN(+startsAt) || (endsAt && endsAt < startsAt)) throw new Error("Valid event details and dates are required.");
  const existing = id ? await prisma.event.findUnique({ where: { id } }) : null; if (id && !existing) throw new Error("Event not found.");
  const data = { name, description, location: field(form, "location") || null, startsAt, endsAt, externalUrl: externalUrl ? validateEvidenceUrl(externalUrl) : null, organiser: field(form, "organiser") || null, status: status(form), cancelled: form.get("cancelled") === "on" };
  if (existing) await prisma.event.update({ where: { id }, data }); else await prisma.event.create({ data: { ...data, authorId: user.id } }); refreshCommunity(); redirect("/admin/community?updated=event");
}
export async function deleteEvent(form: FormData) { await requireAdmin(); await prisma.event.delete({ where: { id: field(form, "id") } }); refreshCommunity(); redirect("/admin/community?updated=event-deleted"); }
