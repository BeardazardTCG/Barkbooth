import Link from "next/link";
import type { ReactNode } from "react";

export function Section({ eyebrow, title, children }: { eyebrow?: string; title: string; children: ReactNode }) {
  return <section className="px-5 py-8 sm:px-8 md:py-12">{eyebrow && <p className="registry-label text-rosette">{eyebrow}</p>}<h2 className="mt-2 max-w-3xl font-heading text-3xl font-bold tracking-tight text-navy md:text-5xl">{title}</h2><div className="mt-6">{children}</div></section>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`registry-card rounded-registry p-5 backdrop-blur ${className}`}>{children}</div>;
}

type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "ghost";

export const buttonStyles: Record<ButtonVariant, string> = {
  primary: "border border-navy bg-navy text-white shadow-soft hover:bg-registry-soft",
  secondary: "border border-navy/20 bg-white/80 text-navy hover:border-navy/40 hover:bg-cream",
  danger: "border border-danger bg-danger text-white hover:bg-danger/90",
  success: "border border-verified bg-verified text-white hover:bg-verified/90",
  ghost: "border border-transparent bg-transparent text-navy hover:bg-muted/60",
};

export function ButtonLink({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: ButtonVariant }) {
  return <Link href={href} className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold ${buttonStyles[variant]}`}>{children}</Link>;
}

export function PawAvatar({ label, className = "" }: { label: string; className?: string }) {
  return <div className={`grid aspect-[4/3] place-items-center rounded-registry border border-navy/10 bg-gradient-to-br from-cream via-white to-sand/55 text-5xl shadow-registry ${className}`} aria-label={label}><span aria-hidden="true">🐾</span></div>;
}

export function Rosette({ label, className = "bg-award" }: { label: string; className?: string }) {
  return <span className={`inline-grid h-16 w-16 place-items-center rounded-full border border-award/30 ${className} text-sm font-extrabold text-navy shadow-registry ring-4 ring-white`} aria-label={`Award ${label}`}>{label}</span>;
}

export function MetaBlock({ label, value }: { label: string; value: ReactNode }) {
  return <div className="rounded-2xl border border-navy/10 bg-offwhite/80 p-4"><dt className="registry-label">{label}</dt><dd className="mt-1 font-bold text-navy">{value}</dd></div>;
}
