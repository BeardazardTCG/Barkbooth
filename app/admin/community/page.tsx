import type { Event, NewsPost } from "@prisma/client";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { Card, Section } from "@/components/ui";
import { deleteEvent, deleteNews, removeNewsImage, saveEvent, saveNews, uploadNewsImage } from "@/lib/community/actions";

const localDateTime = (date?: Date | null) => date ? new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16) : "";
const input = "rounded-xl border border-navy/10 bg-white p-3";

function NewsForm({ post }: { post?: NewsPost }) {
  return <Card><details open={!post}><summary className="cursor-pointer text-xl font-bold text-navy">{post ? `Edit ${post.title}` : "Create news"}</summary>
    <form action={saveNews} className="mt-4 grid gap-3"><input type="hidden" name="id" value={post?.id ?? ""}/>
      <label className="grid gap-1 font-bold">Title<input name="title" required defaultValue={post?.title} className={input}/></label>
      <label className="grid gap-1 font-bold">URL slug<input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" defaultValue={post?.slug} className={input}/></label>
      <label className="grid gap-1 font-bold">Short summary<input name="summary" defaultValue={post?.summary ?? ""} className={input}/></label>
      <label className="grid gap-1 font-bold">News content<textarea name="body" required defaultValue={post?.body} className={`${input} min-h-36`}/></label>
      <label className="grid gap-1 font-bold">Publication state<select name="status" defaultValue={post?.status ?? "DRAFT"} className={input}><option value="DRAFT">Draft / unpublished</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option></select></label>
      <label className="flex items-center gap-2 font-bold"><input type="checkbox" name="featured" defaultChecked={post?.featured}/> Feature this item</label>
      <button className="button-primary">{post ? "Save news changes" : "Create news"}</button>
    </form>
    {post && <div className="mt-5 border-t border-navy/10 pt-4"><h3 className="font-bold text-navy">Featured image</h3>{post.imageStorageKey && <img src={`/api/news-images/${post.id}`} alt="Current featured image" className="mt-3 h-40 w-full rounded-2xl object-cover"/>}<form action={uploadNewsImage} encType="multipart/form-data" className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]"><input type="hidden" name="id" value={post.id}/><input type="file" name="image" required accept="image/jpeg,image/png,image/webp" className={input}/><button className="button-secondary">{post.imageStorageKey ? "Replace image" : "Upload image"}</button></form>{post.imageStorageKey && <form action={removeNewsImage} className="mt-2"><input type="hidden" name="id" value={post.id}/><button className="text-sm font-bold text-red-700">Remove image</button></form>}</div>}
    {post && <form action={deleteNews} className="mt-5 border-t border-navy/10 pt-4"><input type="hidden" name="id" value={post.id}/><button className="button-secondary text-red-700">Delete news item</button></form>}
  </details></Card>;
}

function EventForm({ event }: { event?: Event }) {
  return <Card><details open={!event}><summary className="cursor-pointer text-xl font-bold text-navy">{event ? `Edit ${event.name}` : "Create event"}</summary>
    <form action={saveEvent} className="mt-4 grid gap-3"><input type="hidden" name="id" value={event?.id ?? ""}/>
      <label className="grid gap-1 font-bold">Event name<input name="name" required defaultValue={event?.name} className={input}/></label>
      <label className="grid gap-1 font-bold">Description<textarea name="description" required defaultValue={event?.description} className={`${input} min-h-28`}/></label>
      <div className="grid gap-3 sm:grid-cols-2"><label className="grid gap-1 font-bold">Starts<input type="datetime-local" name="startsAt" required defaultValue={localDateTime(event?.startsAt)} className={input}/></label><label className="grid gap-1 font-bold">Ends (optional)<input type="datetime-local" name="endsAt" defaultValue={localDateTime(event?.endsAt)} className={input}/></label></div>
      <label className="grid gap-1 font-bold">Location<input name="location" defaultValue={event?.location ?? ""} className={input}/></label><label className="grid gap-1 font-bold">Organiser<input name="organiser" defaultValue={event?.organiser ?? ""} className={input}/></label><label className="grid gap-1 font-bold">External HTTPS link<input type="url" name="externalUrl" defaultValue={event?.externalUrl ?? ""} className={input}/></label>
      <label className="grid gap-1 font-bold">Publication state<select name="status" defaultValue={event?.status ?? "DRAFT"} className={input}><option value="DRAFT">Draft / unpublished</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option></select></label>
      <label className="flex items-center gap-2 font-bold"><input type="checkbox" name="cancelled" defaultChecked={event?.cancelled}/> Event cancelled</label>
      <button className="button-primary">{event ? "Save event changes" : "Create event"}</button>
    </form>{event && <form action={deleteEvent} className="mt-5 border-t border-navy/10 pt-4"><input type="hidden" name="id" value={event.id}/><button className="button-secondary text-red-700">Delete event</button></form>}
  </details></Card>;
}

export default async function AdminCommunity({ searchParams }: { searchParams?: { updated?: string } }) { const user = await requireUser(); if (user.role !== "ADMIN") redirect("/dashboard"); const [news, events] = await Promise.all([prisma.newsPost.findMany({ orderBy: { updatedAt: "desc" } }), prisma.event.findMany({ orderBy: { startsAt: "desc" } })]); return <>{searchParams?.updated && <div className="mx-auto mt-6 max-w-7xl rounded-2xl bg-green-50 px-5 py-4 font-bold text-verified" role="status">Changes saved successfully.</div>}<Section eyebrow="Restricted administration" title="News management"><div className="grid gap-4"><NewsForm/>{news.length ? news.map(post => <NewsForm key={post.id} post={post}/>) : <Card>No existing news items. Create the first draft above.</Card>}</div></Section><Section eyebrow="Restricted administration" title="Event management"><div className="grid gap-4"><EventForm/>{events.length ? events.map(event => <EventForm key={event.id} event={event}/>) : <Card>No existing events. Create the first event above.</Card>}</div></Section></>; }
