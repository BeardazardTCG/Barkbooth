import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const read=p=>fs.readFileSync(p,"utf8");
test("premium detail has structured accessible event sections and controlled images",()=>{const s=read("app/competitions/[slug]/page.tsx");for(const text of ["Prize showcase","How to enter","Recent entries","Meet the judges","Judging criteria","Rules and important dates","Meet the winners"])assert.match(s,new RegExp(text));assert.match(s,/object-cover/);assert.match(s,/heroAltText/);assert.match(s,/<details>/);assert.match(s,/<h1/)});
test("listing separates lifecycle stages and avoids zero entrant claims",()=>{const s=read("app/competitions/page.tsx");for(const text of ["Open now","Coming soon","Judging","Recently completed / winners","Entries are now open"])assert.match(s,new RegExp(text));assert.doesNotMatch(s,/\{count\} entrants/)});
test("paid entry and lifecycle are guarded without fake checkout",()=>{const s=read("lib/competitions/actions.ts");assert.match(s,/Paid entries are not available yet/);assert.match(s,/Paid competitions cannot open/)});
test("hero upload and organiser saves expose pending and duplicate prevention",()=>{const s=read("components/competition-action-form.tsx")+read("components/competition-admin-form.tsx");assert.match(s,/Uploading image…/);assert.match(s,/Selected:/);assert.match(s,/disabled=\{pending\}/);assert.match(s,/aria-live/)});
test("migration is additive and preserves legacy prize summary",()=>{const sql=read("prisma/migrations/20260807120000_premium_competition_experience/migration.sql");assert.match(sql,/ADD COLUMN/);assert.doesNotMatch(sql,/DROP|DELETE FROM/);assert.match(read("prisma/schema.prisma"),/prizeSummary\s+String/)});
