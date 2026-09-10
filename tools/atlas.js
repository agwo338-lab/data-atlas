#!/usr/bin/env node
//
// atlas — a small read-only CLI over the Site Atlas data files.
//
// WHY THIS EXISTS
// ---------------
// Both research agents used to open with "read data/sites.js before doing
// anything." At 41 sites that file is ~17k tokens, of which roughly 63% is
// `notes` prose and source URLs. At 500 sites it would be ~210k tokens — per
// invocation, paid again by every agent in a sharded audit. That is the one
// thing in this project that balloons superlinearly, and it is a habit rather
// than a requirement: an agent deciding *which* entries to look at does not
// need any of the prose.
//
// So: `index` prints one terse line per site (~20x smaller), and `show` pulls
// the full detail for only the entries actually in scope. `due` answers the
// other half of the problem — never audit everything; audit what has gone
// stale or was never independently verified in the first place.
//
// It is read-only by design. Like the agents, it has no way to write to a
// data file. It also has no dependencies and no build step: it evaluates the
// same data files the browser loads, so the scoring rules here and the scores
// on the page can never disagree.
//
// Usage:
//   node tools/atlas.js index [--provider X] [--country X] [--status X]
//   node tools/atlas.js due [--limit N] [--kind stale|unverified]
//   node tools/atlas.js show <site-id> [<site-id> ...]
//   node tools/atlas.js stats
//   node tools/atlas.js sources           # the channel catalog, by class

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TODAY = new Date().toISOString().slice(0, 10);

// Evaluate the browser's own data files in this process. Same rules, one
// definition — if data/sources.js changes, this CLI changes with it.
function loadData() {
  const scope = {};
  const files = ["data/sources.js", "data/sites.js", "data/providers.js"];
  const src = files.map(f => fs.readFileSync(path.join(ROOT, f), "utf8")).join("\n;\n");
  // eslint-disable-next-line no-new-func
  const fn = new Function(src + "\n;return { SITES, PROVIDERS, SOURCE_CLASSES, SOURCE_CLASS_ORDER, SOURCE_CHANNELS, CONFIDENCE_LEVELS, PROVENANCE_FIELDS, FIELD_LABELS, VERDICTS, CLASS_ROLES, BASIS_LABELS, classifySource, scoreSite, scoreSiteField, siteEvidenceFor, siteFieldBasis, siteFieldHasProvenance, verdictFor, liftAdvice, derivativeHint, stalenessWindow, hostOf };");
  return Object.assign(scope, fn());
}

const D = loadData();

// ---- arg parsing ----------------------------------------------------------
const argv = process.argv.slice(2);
const cmd = argv[0];
const positional = argv.slice(1).filter(a => !a.startsWith("--"));
function flag(name, fallback) {
  const i = argv.indexOf("--" + name);
  return i === -1 ? fallback : (argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : true);
}

function verdictCode(site, field) {
  const v = D.verdictFor(D.scoreSiteField(site, field, TODAY));
  return v.key === "independent" ? "IND" : v.key === "operator" ? "OPR" : "---";
}

function scoredFields(site) {
  return D.PROVENANCE_FIELDS.filter(f => !(f === "capacityMW" && site.capacityMW == null));
}

// ---- index ----------------------------------------------------------------
// One line per site, no prose, no URLs. Enough to decide what to look at.
// Columns: id | provider | city, country | status | MW | verified | verdicts
function cmdIndex() {
  let sites = D.SITES;
  const fp = flag("provider"), fc = flag("country"), fs_ = flag("status");
  if (typeof fp === "string") sites = sites.filter(s => s.provider.toLowerCase().includes(fp.toLowerCase()));
  if (typeof fc === "string") sites = sites.filter(s => s.country.toLowerCase().includes(fc.toLowerCase()));
  if (typeof fs_ === "string") sites = sites.filter(s => s.status.toLowerCase().includes(fs_.toLowerCase()));

  console.log("# id | provider | location | status | MW | verified | cap/status/loc verdict");
  console.log("# verdict: IND = an independent source backs it, OPR = operator's word only, --- = unsourced");
  for (const s of sites) {
    const v = ["capacityMW", "status", "location"]
      .map(f => (f === "capacityMW" && s.capacityMW == null) ? "n/a" : verdictCode(s, f))
      .join("/");
    console.log([
      s.id,
      s.provider,
      s.city + ", " + s.country,
      s.status,
      s.capacityMW == null ? "-" : s.capacityMW,
      s.lastUpdated || "-",
      v
    ].join(" | "));
  }
  console.log("\n" + sites.length + " sites. Use `show <id>` for full detail on the ones you need.");
}

// ---- due ------------------------------------------------------------------
// The audit queue. Two distinct kinds of work, deliberately not merged:
//   stale       — evidence exists but has aged past this field's window.
//                 A re-check job. Bounded, recurring, and the set shrinks
//                 as you work it.
//   unverified  — nothing independent has ever backed this field. A
//                 sourcing job, not a re-check; more press will not fix it.
// Auditing everything is what makes cost scale with N. Auditing this list
// makes it scale with drift.
function cmdDue() {
  const limit = parseInt(flag("limit", "40"), 10);
  const kind = flag("kind", "all");
  const stale = [], unverified = [];

  for (const site of D.SITES) {
    for (const field of scoredFields(site)) {
      const score = D.scoreSiteField(site, field, TODAY);
      const label = D.FIELD_LABELS[field];
      if (score.stale) {
        stale.push({
          site, field, label,
          over: score.ageDays == null ? Infinity : score.ageDays - score.window,
          age: score.ageDays, win: score.window
        });
      } else if (!score.hasIndependent) {
        unverified.push({ site, field, label, classes: score.classes.join("+") });
      }
    }
  }

  // Overdue by the most days first: the further past its window, the more
  // likely the recorded value has actually moved.
  stale.sort((a, b) => b.over - a.over);
  // Planned and under-construction entries change fastest, so they are the
  // ones worth sourcing properly first.
  const churn = { "Planned": 0, "Under construction": 1, "Operational": 2 };
  unverified.sort((a, b) => (churn[a.site.status] ?? 9) - (churn[b.site.status] ?? 9));

  if (kind === "all" || kind === "stale") {
    console.log("## Overdue re-checks (" + stale.length + ")");
    console.log("# evidence has aged past this field's window — value may have moved\n");
    if (!stale.length) console.log("  nothing overdue.\n");
    for (const r of stale.slice(0, limit)) {
      console.log("  " + r.site.id + " · " + r.label +
        " — " + (r.age == null ? "undated" : r.age + "d old, limit " + r.win + "d") +
        " · " + r.site.status);
    }
    if (stale.length > limit) console.log("  … " + (stale.length - limit) + " more");
    console.log("");
  }

  if (kind === "all" || kind === "unverified") {
    console.log("## Never independently verified (" + unverified.length + ")");
    console.log("# operator's word only — needs a regulatory, network or observed source,");
    console.log("# not more press. Ordered by how fast the site type changes.\n");
    if (!unverified.length) console.log("  nothing outstanding.\n");
    for (const r of unverified.slice(0, limit)) {
      console.log("  " + r.site.id + " · " + r.label + " — " + r.classes +
        " · " + r.site.status + " · " + r.site.country);
    }
    if (unverified.length > limit) console.log("  … " + (unverified.length - limit) + " more");
    console.log("");
  }

  console.log("Work the list, not the dataset. `show <id>` for detail.");
}

// ---- show -----------------------------------------------------------------
function cmdShow() {
  if (!positional.length) { console.log("usage: node tools/atlas.js show <site-id> [...]"); process.exit(1); }
  for (const id of positional) {
    const site = D.SITES.find(s => s.id === id);
    if (!site) { console.log("!! no site with id: " + id + "\n"); continue; }

    const overall = D.scoreSite(site, TODAY);
    console.log("=".repeat(72));
    console.log(site.provider + " — " + (site.site || site.city) + "  [" + site.id + "]");
    console.log("=".repeat(72));
    console.log("  location    " + site.city + ", " + site.country + "  (" + site.lat + ", " + site.lon + ")");
    console.log("  status      " + site.status);
    console.log("  capacity    " + (site.capacityMW == null ? "not disclosed" : site.capacityMW + " MW"));
    console.log("  verified    " + (site.lastUpdated || "-"));
    console.log("  confidence  " + D.CONFIDENCE_LEVELS[overall.level].label + " (weakest field)");
    console.log("  provenance  " + (scoredFields(site).some(f => D.siteFieldHasProvenance(site, f))
      ? "per-field evidence recorded"
      : "NONE — every source counts toward every field (scores likely optimistic)"));

    for (const field of scoredFields(site)) {
      const score = D.scoreSiteField(site, field, TODAY);
      const v = D.verdictFor(score);
      console.log("\n  --- " + D.FIELD_LABELS[field].toUpperCase() + " ---");
      console.log("  verdict: " + v.label.toUpperCase() + "   basis: " + D.siteFieldBasis(site, field) +
        "   confidence: " + D.CONFIDENCE_LEVELS[score.level].label);
      for (const ev of D.siteEvidenceFor(site, field)) {
        const src = ev.source || {};
        console.log("    [" + ev.cls + "] " + (src.label || "unlabelled") + "  (" + (ev.asOf || "undated") + ")");
        console.log("        " + (D.CLASS_ROLES[ev.cls] || ""));
        if (src.url) console.log("        " + src.url);
        if (ev.note) console.log("        note: " + ev.note);
      }
      console.log("  to verify: " + D.liftAdvice(score, field, site.status));
      const hint = D.derivativeHint(score);
      if (hint) console.log("  hint: " + hint);
    }

    if (site.notes) console.log("\n  NOTES\n  " + site.notes.replace(/(.{88}\s)/g, "$1\n  "));
    console.log("");
  }
}

// ---- stats ----------------------------------------------------------------
function cmdStats() {
  const lvl = {}, verd = {}, cls = {};
  for (const site of D.SITES) {
    const l = D.scoreSite(site, TODAY).level;
    lvl[l] = (lvl[l] || 0) + 1;
    for (const f of scoredFields(site)) {
      const k = D.verdictFor(D.scoreSiteField(site, f, TODAY)).key;
      verd[k] = (verd[k] || 0) + 1;
    }
    for (const s of site.sources || []) {
      const c = D.classifySource(s, site.provider);
      cls[c] = (cls[c] || 0) + 1;
    }
  }
  console.log("sites: " + D.SITES.length);
  console.log("\nby confidence:");
  for (const k of ["high", "medium", "low", "unverified"]) console.log("  " + k.padEnd(11) + (lvl[k] || 0));
  console.log("\nfields by verdict:");
  for (const k of ["independent", "operator", "unsourced"]) console.log("  " + k.padEnd(13) + (verd[k] || 0));
  console.log("\ncitations by class:");
  for (const c of D.SOURCE_CLASS_ORDER) if (cls[c]) console.log("  " + c + "  " + String(cls[c]).padStart(3) + "  " + D.SOURCE_CLASSES[c].label);
}

// ---- sources --------------------------------------------------------------
function cmdSources() {
  for (const c of D.SOURCE_CLASS_ORDER) {
    const chans = D.SOURCE_CHANNELS.filter(ch => ch.cls === c);
    if (!chans.length) continue;
    const k = D.SOURCE_CLASSES[c];
    console.log("\n[" + c + "] " + k.label + (k.independent ? "  (independent)" : ""));
    for (const ch of chans) {
      console.log("  " + ch.name);
      console.log("    " + ch.scope + " · " + ch.cadence + " · " + ch.access);
      if (ch.url) console.log("    " + ch.url);
    }
  }
}

const COMMANDS = { index: cmdIndex, due: cmdDue, show: cmdShow, stats: cmdStats, sources: cmdSources };

if (!cmd || !COMMANDS[cmd]) {
  console.log([
    "atlas — read-only CLI over the Site Atlas data files.",
    "",
    "  node tools/atlas.js index [--provider X] [--country X] [--status X]",
    "      One terse line per site. Use this instead of reading data/sites.js:",
    "      ~20x smaller, and it carries the verdict per field.",
    "",
    "  node tools/atlas.js due [--limit N] [--kind stale|unverified]",
    "      The audit queue — what has aged out, and what has never had an",
    "      independent source. Work this, not the whole dataset.",
    "",
    "  node tools/atlas.js show <site-id> [...]",
    "      Full detail for specific entries, including every piece of",
    "      evidence and what would verify it independently.",
    "",
    "  node tools/atlas.js stats",
    "  node tools/atlas.js sources"
  ].join("\n"));
  process.exit(cmd ? 1 : 0);
}

COMMANDS[cmd]();
