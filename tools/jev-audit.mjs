#!/usr/bin/env node
//
// jev-audit — does each citation on file actually support what it is cited for?
//
// WHY THIS EXISTS
// ---------------
// The atlas has ~200 citations and ~230 per-field evidence links. Nobody has
// ever checked, page by page, that each cited article really states the
// figure, status or location it is attached to. Doing that with a language
// model would be a full audit run per pass; with Jev (a decision model that
// returns probabilities, not text — see .claude/mcp/openrouter/jev.js) it is
// about 375k input tokens for the whole dataset (measured 2026-09-21: 191
// citations, $0.016, six minutes at concurrency 6). So this can run after
// every data change, the way tools/check.js runs before every commit. It is not wired INTO check.js
// because it needs the network and a paid key, and check.js must stay free
// and offline.
//
// WHAT IT CHECKS, per citation
//   - Jev's source class from the page content vs. the class data/sources.js
//     assigns from the host. A mismatch is a lead, not an error: an article
//     that quotes a permit is still T, but the permit should be added as R.
//   - Whether the page is about this site at all.
//   - For each scored field the citation is evidence for (per provenance, or
//     all three under the legacy fallback): does the page state that value?
//
// WHAT IT DOES NOT DO
//   - Write anything. Read-only, like tools/atlas.js. Findings are printed;
//     a person (or the caller of a research agent) decides what to chase.
//   - Treat a Jev answer as evidence. A low "supports" probability means
//     "go look," never "delete the source." A high one earns nothing.
//   - Read PDFs. Those are reported as unreadable; use pdftotext (see
//     CLAUDE.md, "The agents cannot read PDFs").
//
// Usage:
//   node tools/jev-audit.mjs [--provider X] [--site id] [--limit N]
//                            [--threshold 0.5] [--concurrency 4]
//                            [--all] [--json] [--dry-run]
//
// By default only flagged rows print. --all prints every row.
// Needs OPENROUTER_API_KEY in .env (run with `node --env-file=.env` or let
// this script read .env itself, which it does when the variable is unset).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { jevDecide } from "../.claude/mcp/openrouter/jev.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// ---- .env (only if not already in the environment) -------------------------
if (!process.env.OPENROUTER_API_KEY) {
  try {
    for (const line of fs.readFileSync(path.join(ROOT, ".env"), "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch { /* no .env; handled below */ }
}
const API_KEY = process.env.OPENROUTER_API_KEY;

// ---- data (same loader as tools/atlas.js: the browser's own files) --------
function loadData() {
  const files = ["data/sources.js", "data/sites.js", "data/providers.js"];
  const src = files.map(f => fs.readFileSync(path.join(ROOT, f), "utf8")).join("\n;\n");
  // eslint-disable-next-line no-new-func
  return new Function(src + "\n;return { SITES, PROVENANCE_FIELDS, classifySource, siteEvidenceFor };")();
}
const D = loadData();

// ---- args -----------------------------------------------------------------
const argv = process.argv.slice(2);
function flag(name, fallback) {
  const i = argv.indexOf("--" + name);
  if (i === -1) return fallback;
  const v = argv[i + 1];
  return v && !v.startsWith("--") ? v : true;
}
const OPT = {
  provider: flag("provider", null),
  site: flag("site", null),
  limit: Number(flag("limit", 0)) || 0,
  threshold: Number(flag("threshold", 0.5)),
  concurrency: Number(flag("concurrency", 4)) || 4,
  all: flag("all", false) === true,
  json: flag("json", false) === true,
  dryRun: flag("dry-run", false) === true,
};

// ---- the work list: one row per (site, source) -----------------------------
// A source is checked once, with a fan-out question per field it is cited
// for, rather than once per field. That is the whole token saving.
function workList() {
  const rows = [];
  for (const site of D.SITES) {
    if (OPT.provider && site.provider.toLowerCase() !== OPT.provider.toLowerCase()) continue;
    if (OPT.site && site.id !== OPT.site) continue;
    const perSource = new Map(); // url -> { source, fields:Set, hostClass }
    for (const field of D.PROVENANCE_FIELDS) {
      for (const ev of D.siteEvidenceFor(site, field)) {
        if (!ev.source || !ev.source.url) continue;
        const key = ev.source.url;
        if (!perSource.has(key)) perSource.set(key, { source: ev.source, fields: new Set(), hostClass: D.classifySource(ev.source, site.provider) });
        perSource.get(key).fields.add(field);
      }
    }
    for (const [, v] of perSource) rows.push({ site, ...v, fields: [...v.fields] });
  }
  return OPT.limit ? rows.slice(0, OPT.limit) : rows;
}

// ---- fetch a page as text ---------------------------------------------------
function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6]|tr|br|section|article)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, "\n").trim();
}

async function fetchText(url) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 25000);
  try {
    const res = await fetch(url, {
      signal: ctl.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (SiteAtlas jev-audit; research tool)", Accept: "text/html,application/xhtml+xml,*/*;q=0.8" },
    });
    const type = res.headers.get("content-type") || "";
    if (!res.ok) return { error: `HTTP ${res.status}` };
    if (/pdf/i.test(type) || /\.pdf(\?|$)/i.test(url)) return { error: "PDF — read it with pdftotext" };
    const body = await res.text();
    const text = /html|xml/i.test(type) ? htmlToText(body) : body;
    if (text.length < 300) return { error: `page text too short (${text.length} chars) — likely blocked or script-rendered` };
    return { text };
  } catch (e) {
    return { error: e.name === "AbortError" ? "timeout" : String(e.message || e) };
  } finally {
    clearTimeout(t);
  }
}

// ---- one row -----------------------------------------------------------------
async function checkRow(row) {
  const { site, source, fields, hostClass } = row;
  const out = { id: site.id, provider: site.provider, url: source.url, label: source.label || "", hostClass, fields, flags: [] };
  const page = await fetchText(source.url);
  if (page.error) { out.unreadable = page.error; return out; }

  const state = {
    operator: site.provider,
    site: [site.site, site.city, site.country].filter(Boolean).join(", "),
    url: source.url,
    excerpt: page.text,
  };
  if (fields.includes("capacityMW") && site.capacityMW != null) state.capacityMW = site.capacityMW;
  if (fields.includes("status")) state.status = site.status;
  if (fields.includes("location")) state.location = `${site.city}, ${site.country} (${site.lat}, ${site.lon})`;

  let data;
  try { data = await jevDecide(API_KEY, "source_check", state); }
  catch (e) { out.unreadable = `Jev: ${e.message}`; return out; }

  const a = data.answers || {};
  out.cost = data.usage?.cost ?? 0;
  out.tokens = data.usage?.input_tokens ?? 0;
  out.jevClass = a.source_class?.choice;
  out.jevClassConf = a.source_class?.confidence;
  out.independent = a.independent_of_operator?.noul;
  out.sameSite = a.same_site?.noul;
  out.supports = {};
  if (a.supports_capacity) out.supports.capacityMW = a.supports_capacity.noul;
  if (a.supports_status) out.supports.status = a.supports_status.noul;
  if (a.supports_location) out.supports.location = a.supports_location.noul;
  out.quantity = a.quantity?.choice;

  // Flags. Each one is a reason to open the page, not a verdict.
  const T = OPT.threshold;
  if (out.sameSite != null && out.sameSite < T) out.flags.push(`not about this site (${out.sameSite.toFixed(2)})`);
  for (const [f, p] of Object.entries(out.supports)) {
    if (p < T) out.flags.push(`does not state ${f} (${p.toFixed(2)})`);
  }
  if (out.jevClass && out.jevClass !== hostClass && (out.jevClassConf ?? 0) >= 0.5) {
    const indep = ["R", "N", "O"];
    const dir = indep.includes(out.jevClass) && !indep.includes(hostClass) ? "cites a record worth adding as its own source" : "class differs from host rule";
    out.flags.push(`Jev reads ${out.jevClass}, host rule says ${hostClass} — ${dir}`);
  }
  if (fields.includes("capacityMW") && out.quantity && ["utility_power", "generator"].includes(out.quantity)) {
    out.flags.push(`MW figure looks like ${out.quantity.replace("_", " ")}, not IT load`);
  }
  return out;
}

// ---- run -----------------------------------------------------------------------
async function main() {
  const rows = workList();
  if (OPT.dryRun) {
    console.log(`${rows.length} citation(s) would be checked across ${new Set(rows.map(r => r.site.id)).size} site(s).`);
    for (const r of rows) console.log(`  ${r.site.id}  [${r.hostClass}] ${r.fields.join("+")}  ${r.source.url}`);
    return;
  }
  if (!API_KEY) { console.error("OPENROUTER_API_KEY is not set (see .env.example)."); process.exit(2); }

  const results = new Array(rows.length);
  let next = 0;
  async function worker() {
    while (next < rows.length) { const i = next++; results[i] = await checkRow(rows[i]); process.stderr.write(`\r${i + 1}/${rows.length}`); }
  }
  await Promise.all(Array.from({ length: Math.min(OPT.concurrency, rows.length) }, worker));
  process.stderr.write("\n");

  if (OPT.json) { console.log(JSON.stringify(results, null, 1)); return; }

  const flagged = results.filter(r => r.flags.length);
  const unreadable = results.filter(r => r.unreadable);
  const clean = results.filter(r => !r.flags.length && !r.unreadable);
  const cost = results.reduce((s, r) => s + (r.cost || 0), 0);
  const tokens = results.reduce((s, r) => s + (r.tokens || 0), 0);

  const show = OPT.all ? results : flagged;
  for (const r of show) {
    console.log(`${r.id}  (${r.provider})`);
    console.log(`  ${r.label || r.url}`);
    console.log(`  ${r.url}`);
    if (r.unreadable) { console.log(`  unreadable: ${r.unreadable}`); console.log(); continue; }
    const sup = Object.entries(r.supports).map(([f, p]) => `${f} ${p.toFixed(2)}`).join("  ");
    console.log(`  host ${r.hostClass} · jev ${r.jevClass} (${(r.jevClassConf ?? 0).toFixed(2)}) · independent ${r.independent?.toFixed(2)} · same site ${r.sameSite?.toFixed(2)} · ${sup}`);
    for (const f of r.flags) console.log(`  ! ${f}`);
    console.log();
  }
  if (!OPT.all && unreadable.length) {
    console.log(`Unreadable (${unreadable.length}):`);
    for (const r of unreadable) console.log(`  ${r.id}  ${r.unreadable}  ${r.url}`);
    console.log();
  }
  console.log(`${results.length} citations · ${flagged.length} flagged · ${clean.length} clean · ${unreadable.length} unreadable`);
  console.log(`${tokens.toLocaleString()} Jev input tokens · $${cost.toFixed(4)}`);
  console.log(`A flag is a reason to open the page, not a verdict. A clean row earns nothing.`);
}

main().catch(e => { console.error(e); process.exit(1); });
