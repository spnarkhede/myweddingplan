// Validates the data and the scripts before every build and deploy.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "./build.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const fail = (m) => errors.push(m);

// 1. tasks.json parses and ids are unique
let tasks;
try { tasks = JSON.parse(readFileSync(join(root, "public/tasks.json"), "utf8")); }
catch (e) { fail("public/tasks.json is not valid JSON: " + e.message); }
if (tasks) {
  const ids = new Map();
  const seen = (id, where) => { if (ids.has(id)) fail(`Duplicate id "${id}" in ${where} and ${ids.get(id)}`); else ids.set(id, where); };
  for (const w of tasks.workstreams || []) {
    if (!w.id || !w.title) fail("Workstream without id or title");
    for (const s of w.sections || []) for (const i of s.items || []) { if (!i.id || !i.t) fail(`Item without id or text in ${w.id}`); seen(i.id, w.id); }
  }
  for (const c of tasks.docs?.cats || []) for (const i of c.items) { if (!["Groom","Bride","Both","Witnesses"].includes(i.who)) fail(`Document ${i.id} has unknown owner "${i.who}"`); seen(i.id, "docs/" + c.id); }
  for (const o of tasks.nameChange?.options || []) for (const s of o.steps) seen(s.id, "nameChange/" + o.id);
  // 2. dates are relative to the wedding date (W-30, W+5), never fixed, so the template stays personal-data free
  const walk = (v, path) => {
    if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)) fail(`Fixed date ${v} at ${path}; use a relative date like W-30`);
    else if (Array.isArray(v)) v.forEach((x, i) => walk(x, path + "[" + i + "]"));
    else if (v && typeof v === "object") for (const k in v) walk(v[k], path + "." + k);
  };
  walk(tasks, "tasks");
}

// 3. the built page has valid script syntax
const html = build();
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
if (!scripts.length) fail("No inline script found in the built page");
scripts.forEach((s, i) => { try { new Function(s); } catch (e) { fail(`Script ${i + 1} has a syntax error: ${e.message}`); } });

// 4. optional personal terms, kept outside the repository: PERSONAL_TERMS="name1,name2"
for (const term of (process.env.PERSONAL_TERMS || "").split(",").map((t) => t.trim()).filter(Boolean)) {
  if (html.toLowerCase().includes(term.toLowerCase())) fail(`Personal term "${term}" found in the built page`);
}

if (errors.length) { console.error(errors.map((e) => "  x " + e).join("\n")); process.exit(1); }
console.log("All checks passed.");
