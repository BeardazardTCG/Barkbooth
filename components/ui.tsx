import Link from "next/link";
import type { ReactNode } from "react";

export function Section({ eyebrow, title, children }: { eyebrow?: string; title: string; children: ReactNode }) {
  return <section className="px-4 py-5 sm:px-6 md:px-8 md:py-7">{eyebrow && <p className="registry-label text-info">{eyebrow}</p>}<h2 className="mt-1.5 max-w-4xl font-heading text-2xl font-extrabold tracking-tight text-navy sm:text-3xl md:text-4xl">{title}</h2><div className="mt-4">{children}</div></section>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`registry-card rounded-registry p-4 backdrop-blur sm:p-5 ${className}`}>{children}</div>;
}

type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "ghost";

export const buttonStyles: Record<ButtonVariant, string> = {
  primary: "border border-navy bg-navy text-white shadow-soft hover:bg-registry-soft",
  secondary: "border border-navy/20 bg-white/90 text-navy hover:border-navy/40 hover:bg-skysoft/50",
  danger: "border border-danger bg-danger text-white hover:bg-danger/90",
  success: "border border-verified bg-verified text-white hover:bg-verified/90",
  ghost: "border border-transparent bg-transparent text-navy hover:bg-skysoft/50",
};

export function ButtonLink({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: ButtonVariant }) {
  return <Link href={href} className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info ${buttonStyles[variant]}`}>{children}</Link>;
}

export function PawAvatar({ label, className = "" }: { label: string; className?: string }) {
  return <div className={`grid aspect-[4/3] place-items-center overflow-hidden rounded-registry border border-navy/10 bg-skysoft/55 text-navy shadow-registry ${className}`} role="img" aria-label={`${label}: dog identity icon`}><svg aria-hidden="true" viewBox="0 0 160 120" className="h-full w-full"><circle cx="80" cy="61" r="34" fill="#fff" opacity=".72"/><path d="M58 52 43 30c-4-6-11-2-10 5l4 31c1 8 5 13 12 16l12 5c5 2 8 6 8 11h22c0-7 3-12 9-16 8-5 13-14 13-24V38c0-7-7-10-11-4L91 49c-9-5-23-4-33 3Z" fill="currentColor" opacity=".82"/><circle cx="68" cy="61" r="2.5" fill="#fff"/><circle cx="92" cy="61" r="2.5" fill="#fff"/><path d="M75 72c3 3 7 3 10 0" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"/><path d="M47 103h66" stroke="currentColor" opacity=".25" strokeWidth="2"/></svg></div>;
}

export function DogProfileImage({ dogId, label, hasPhoto, version, className = "" }: { dogId: string; label: string; hasPhoto: boolean; version?: string; className?: string }) {
  return hasPhoto ? <img src={`/api/dogs/${dogId}/profile-photo${version ? `?v=${encodeURIComponent(version)}` : ""}`} alt={`${label}: dog profile photo`} className={`aspect-[4/3] overflow-hidden rounded-registry border border-navy/10 object-cover shadow-registry ${className}`} /> : <PawAvatar label={label} className={className} />;
}
