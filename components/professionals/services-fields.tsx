"use client";

import { useMemo, useState } from "react";
import type { ProfessionalProfileType } from "@prisma/client";
import { professionalTypeLabels, servicesByType } from "@/lib/professionals/catalog";

const input = "rounded-2xl border border-navy/10 p-3";

type Props = { initialType: ProfessionalProfileType; initialCustomType?: string | null; initialServices: string[] };

export function ProfessionalServicesFields({ initialType, initialCustomType, initialServices }: Props) {
  const [type, setType] = useState<ProfessionalProfileType>(initialType);
  const [selected, setSelected] = useState(() => new Set(initialServices));
  const [removed, setRemoved] = useState<string[]>([]);
  const visibleServices = servicesByType[type];
  const invalidSelected = useMemo(() => [...selected].filter((service) => !visibleServices.includes(service)), [selected, visibleServices]);

  function changeType(next: ProfessionalProfileType) {
    const nextAllowed = new Set(servicesByType[next]);
    const removedNow = [...selected].filter((service) => !nextAllowed.has(service));
    if (removedNow.length && !window.confirm(`Changing type will remove incompatible services: ${removedNow.join(", ")}. Continue?`)) return;
    setType(next);
    setRemoved(removedNow);
    setSelected(new Set([...selected].filter((service) => nextAllowed.has(service))));
  }

  function toggle(service: string) {
    const copy = new Set(selected);
    if (copy.has(service)) copy.delete(service); else copy.add(service);
    setSelected(copy);
  }

  return <>
    <label className="grid gap-1 font-bold">Professional type<select name="type" value={type} onChange={(event) => changeType(event.target.value as ProfessionalProfileType)} className={input}>{Object.entries(professionalTypeLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><span className="text-xs font-normal">Services update immediately when you change type.</span></label>
    {type === "OTHER" && <label className="grid gap-1 font-bold">Describe Other type<input name="customType" required defaultValue={initialCustomType ?? ""} className={input}/></label>}
    {removed.length > 0 && <p className="rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-900" role="status">Removed incompatible services: {removed.join(", ")}.</p>}
    {invalidSelected.length > 0 && <p className="rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-900" role="alert">Some saved services are not valid for this type and will not be submitted: {invalidSelected.join(", ")}.</p>}
    <fieldset className="rounded-2xl border p-4"><legend className="font-bold">Services</legend><div className="mt-2 grid gap-2 md:grid-cols-2">{visibleServices.map((service) => <label key={service} className="text-sm font-bold"><input type="checkbox" name="services" value={service} checked={selected.has(service)} onChange={() => toggle(service)}/> {service}</label>)}</div><label className="mt-3 grid gap-1 font-bold">Other service<input name="otherService" className={input}/></label></fieldset>
  </>;
}
