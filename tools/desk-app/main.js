'use strict';

// Electron shell for the research desk. It does exactly two things: read the
// note files off disk and hand them to the renderer, and re-read them when
// they change on disk so a note filed mid-session shows up without a restart.
//
// Node integration is off and context isolation is on. That is not
// boilerplate caution: the notes are written by agents that read arbitrary
// web pages, so their prose is untrusted input. The renderer never gets a
// require(), and note bodies are rendered as text, never as HTML.

const { app, BrowserWindow, ipcMain, shell } = require('electron');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const DESK = path.join(ROOT, 'research-log');
const NOTES = path.join(DESK, 'notes');
const RUNS = path.join(DESK, 'runs');
const COVERAGE = path.join(ROOT, 'COVERAGE.md');
const SITES_FILE = path.join(ROOT, 'data', 'sites.js');
const SOURCES_FILE = path.join(ROOT, 'data', 'sources.js');
const PROVIDERS_FILE = path.join(ROOT, 'data', 'providers.js');

const NL = String.fromCharCode(10);

// Same grammar as tools/desk.js: flat key: value pairs between --- fences.
function parseFrontmatter(text) {
  const lines = text.split(NL);
  if (lines[0].trim() !== '---') return null;
  const end = lines.indexOf('---', 1);
  if (end === -1) return null;
  const meta = {};
  for (const line of lines.slice(1, end)) {
    const i = line.indexOf(':');
    if (i === -1 || !line.trim()) continue;
    const key = line.slice(0, i).trim();
    let val = line.slice(i + 1).trim();
    const quoted =
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"));
    if (quoted && val.length > 1) val = val.slice(1, -1);
    meta[key] = val;
  }
  return { meta, body: lines.slice(end + 1).join(NL).trim() };
}

function readNotes() {
  if (!fs.existsSync(NOTES)) return [];
  return fs
    .readdirSync(NOTES)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      let parsed = null;
      try {
        parsed = parseFrontmatter(fs.readFileSync(path.join(NOTES, f), 'utf8'));
      } catch (e) {
        return { slug: f, broken: e.message };
      }
      if (!parsed) return { slug: f, broken: 'no readable frontmatter' };
      const m = parsed.meta;
      return {
        slug: f.replace(/\.md$/, ''),
        file: f,
        // When the note was actually filed. `date` is the day the research
        // happened and several runs routinely share one, so on its own it
        // leaves same-day notes in readdir order — alphabetical, not
        // chronological. mtime breaks the tie the way a desk does: the thing
        // put down last sits on top.
        filed: statMs(path.join(NOTES, f)),
        date: m.date || '',
        agent: m.agent || 'unknown',
        topic: m.topic || f,
        asked: m.asked || '',
        applied: m.applied || '',
        commit: m.commit || '',
        run: m.run || '',
        body: parsed.body,
      };
    })
    .sort((a, b) => {
      const d = String(b.date || '').localeCompare(String(a.date || ''));
      return d !== 0 ? d : (b.filed || 0) - (a.filed || 0);
    });
}

function statMs(file) {
  try { return fs.statSync(file).mtimeMs; } catch (e) { return 0; }
}

// ── The coverage roster ────────────────────────────────────────────────
//
// The desk answers "what did we look at"; this answers "what is left". It
// has two halves that are deliberately sourced differently.
//
// The TRACKED half is computed live from data/sites.js every time this is
// called, so it cannot drift from what the map actually shows. The heading
// counts written into COVERAGE.md by hand are kept too, but only so a
// disagreement between the two is visible rather than silently resolved —
// a stale roster is worth knowing about.
//
// The MISSING half is the hand-maintained gap list in COVERAGE.md: leads
// that are publicly reported to exist but have not been vetted or added.
// None of it has been fact-checked to the atlas's sourcing standard, which
// is exactly why it lives here as a worklist and not in data/sites.js.

// Evaluate the browser's own data files in this process, exactly the way
// tools/atlas.js does — one definition of the data and one definition of the
// confidence rules, so a rating shown on the roster cannot disagree with the
// same rating on the map. Wrapped because a syntax error in sites.js is the
// failure this project actually fears: index.html loads that file as a plain
// script, where a bad edit takes the map down with no message. The desk
// saying so out loud is more useful than the desk going blank.
function loadAtlas() {
  try {
    const src = [SOURCES_FILE, SITES_FILE, PROVIDERS_FILE]
      .map((f) => fs.readFileSync(f, 'utf8'))
      .join(NL + ';' + NL);
    const fn = new Function(
      src + NL +
      ';return { SITES: SITES, PROVIDERS: PROVIDERS, PROVENANCE_FIELDS: PROVENANCE_FIELDS,' +
      ' FIELD_LABELS: FIELD_LABELS, CONFIDENCE_LEVELS: CONFIDENCE_LEVELS, VERDICTS: VERDICTS,' +
      ' scoreSiteField: scoreSiteField, verdictFor: verdictFor, siteFieldBasis: siteFieldBasis };'
    );
    return Object.assign({ ok: true }, fn());
  } catch (e) {
    return { ok: false, error: e.message, SITES: [], PROVIDERS: [] };
  }
}

// The atlas pins a display colour per operator. Reusing it here means an
// operator is the same colour on the map and on the roster, which is the
// whole reason the desk copies the atlas's tokens in the first place.
function providerColors(D) {
  const by = {};
  for (const p of D.PROVIDERS || []) if (p && p.name && p.color) by[p.name] = p.color;
  return by;
}

function liveTracked(D) {
  if (!D.ok) return { ok: false, error: D.error, by: {} };
  const by = {};
  for (const s of D.SITES) {
    const b = by[s.provider] || (by[s.provider] = { total: 0, operational: 0, building: 0, planned: 0 });
    b.total++;
    if (s.status === 'Operational') b.operational++;
    else if (s.status === 'Under construction') b.building++;
    else b.planned++;
  }
  return { ok: true, by: by };
}

// ── One tracked site, as a table row ───────────────────────────────────
//
// The atlas's own rule is that a site scores as its weakest field, and that
// the verdict — in words — leads, with the graded level demoted to a dot.
// The roster follows both, because a coverage table that quietly reported
// the *best* field would be exactly the flattering summary the confidence
// engine exists to prevent.
const VERDICT_RANK = { unsourced: 0, operator: 1, independent: 2 };

function trackedRow(D, site, today, refFor) {
  const fields = (D.PROVENANCE_FIELDS || [])
    .filter((f) => !(f === 'capacityMW' && site.capacityMW == null))
    .map((f) => {
      const score = D.scoreSiteField(site, f, today);
      const verdict = D.verdictFor(score);
      const level = D.CONFIDENCE_LEVELS[score.level] || { label: score.level, color: '' };
      return {
        label: D.FIELD_LABELS[f] || f,
        verdict: verdict.label,
        verdictKey: verdict.key,
        level: level.label,
        color: level.color,
        rank: level.rank == null ? 0 : level.rank,
        stale: !!score.stale,
        reason: score.reason || '',
      };
    });

  const weakestLevel = fields.slice().sort((a, b) => a.rank - b.rank)[0] || null;
  const weakestVerdict = fields
    .slice()
    .sort((a, b) => VERDICT_RANK[a.verdictKey] - VERDICT_RANK[b.verdictKey])[0] || null;

  const derived = site.capacityMW != null && D.siteFieldBasis(site, 'capacityMW') === 'derived';

  return {
    kind: 'tracked',
    id: site.id,
    name: site.site || site.city,
    place: [site.city, site.country].filter(Boolean).join(', '),
    status: site.status || '',
    capacity: site.capacityMW == null ? '' : site.capacityMW + ' MW',
    derived: derived,
    updated: site.lastUpdated || '',
    verdict: weakestVerdict ? weakestVerdict.verdict : 'Unsourced',
    verdictKey: weakestVerdict ? weakestVerdict.verdictKey : 'unsourced',
    level: weakestLevel ? weakestLevel.level : 'Unverified',
    color: weakestLevel ? weakestLevel.color : '',
    fields: fields,
    refs: (site.sources || []).map((s) => refFor(s && s.label, s && s.url)).filter(Boolean),
  };
}

// Markdown down to plain text. Nothing from this file is ever rendered as
// HTML — emphasis is dropped and the result goes into the DOM via
// textContent like everything else on the desk. Links are pulled out
// separately by lead() first; anything still bracketed here becomes its
// label.
function plain(md) {
  return String(md)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/\s*·\s*$/, '')
    .trim();
}

// ── One roster lead, as a table row ────────────────────────────────────
//
// A lead is written as a single markdown bullet: a bold site name, then
// prose, then the citations. Split it into the same shape as a tracked row
// so both can sit in one table — with the crucial difference that a lead's
// "confidence" is the roster's own hand-written grading of how likely the
// site is to be real, NOT a score from data/sources.js. Nothing here has
// been vetted, and the table has to keep saying so.
function lead(text, kind, done, refFor) {
  const refs = [];
  let rest = String(text).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, label, url) => {
    const n = refFor(label, url);
    if (n) refs.push(n);
    return '';
  });

  let name = '';
  const bold = rest.match(/\*\*([^*]+)\*\*/);
  if (bold) {
    name = plain(bold[1]);
    rest = rest.replace(bold[0], '');
  } else {
    const split = rest.split(/\s+—\s+/);
    name = plain(split[0]);
    rest = split.slice(1).join(' — ');
  }

  const detail = plain(rest).replace(/^[\s—·-]+/, '').trim();

  // Leads carry their headline facts in prose, so the status and capacity
  // columns are sniffed out of that prose rather than being fields. The
  // renderer shows them in a lighter weight for exactly that reason — they
  // are a reading of the sentence below them, not a recorded value.
  const st = detail.match(/\b(operational|under construction|commissioning|planned|approved|announced)\b/i);
  const mw = detail.match(/\b(\d[\d,.]*)\s*(MW|GW)\b/i);

  return {
    kind: kind === 'watch' ? 'watch' : 'lead',
    grade: kind,
    done: done,
    name: name,
    place: '',
    status: st ? st[1][0].toUpperCase() + st[1].slice(1).toLowerCase() : '',
    capacity: mw ? mw[1] + ' ' + mw[2].toUpperCase() : '',
    detail: detail,
    refs: refs,
  };
}

function parseCoverage(text) {
  const compiled = (text.match(/Last compiled:\s*(\d{4}-\d{2}-\d{2})/) || [])[1] || '';
  const operators = [];
  let op = null;
  let section = null;

  for (const raw of text.split(NL)) {
    let m;
    // "## CoreWeave — 24 tracked" opens an operator; any other H2 closes one.
    if ((m = raw.match(/^##\s+(.+?)\s+—\s+(\d+)\s+tracked\s*$/))) {
      // Headings carry a parenthetical alias ("SpaceXAI (xAI/Colossus)");
      // the bare name is what data/sites.js uses.
      const heading = m[1].trim();
      op = {
        name: heading.replace(/\s*\(.*$/, '').trim(),
        heading: heading,
        listed: Number(m[2]),
        sections: [],
      };
      operators.push(op);
      section = null;
      continue;
    }
    if (/^##\s/.test(raw)) { op = null; section = null; continue; }
    if (!op) continue;

    if ((m = raw.match(/^###\s+(.+?)\s*$/))) {
      const title = m[1].trim();
      const kind = /high confidence/i.test(title) ? 'high'
                 : /medium confidence/i.test(title) ? 'medium'
                 : /watch/i.test(title) ? 'watch'
                 : 'other';
      // An operator's section can also be prose about the state of the audit
      // rather than a list of sites — and prose carries bullets. Those are not
      // claimed sites, so they must not become table rows or count toward the
      // tab's total. Dropping the section entirely is deliberate: the table
      // knows four groups, and a fifth would render commentary as if it were
      // a facility. A new *site* section just needs its heading to say high
      // confidence, medium confidence, or watch.
      if (kind === 'other') { section = null; continue; }
      section = { title: title, kind: kind, items: [] };
      op.sections.push(section);
      continue;
    }
    if (!section) continue;

    // Checkbox bullets only; a "- **Name** — ..." bullet without a box is a
    // watch-only item, which has no box by convention. Both are kept raw here
    // and split into columns later, once there is a per-operator footnote
    // numbering to hang the citations off.
    if ((m = raw.match(/^-\s+(?:\[([ xX])\]\s*)?(.+)$/))) {
      section.items.push({ done: String(m[1] || '').toLowerCase() === 'x', raw: m[2] });
    }
  }
  return { compiled: compiled, operators: operators };
}

// Citations are numbered per operator, not per row: the same DCD article
// routinely backs three leads, and renumbering it each time would make the
// footnote list longer than the table it annotates. Returns a closure that
// hands out (and deduplicates by URL) the superscript numbers for one tab.
function refCounter() {
  const list = [];
  const byUrl = {};
  return {
    list: list,
    ref: function (label, url) {
      const clean = /^https?:\/\//i.test(String(url || '')) ? String(url) : '';
      const key = clean || 'label:' + label;
      if (byUrl[key]) return byUrl[key];
      const n = list.length + 1;
      byUrl[key] = n;
      list.push({ n: n, label: plain(label || '') || host(clean) || 'source', url: clean, host: host(clean) });
      return n;
    },
  };
}

function host(url) {
  const m = String(url || '').match(/^https?:\/\/([^/]+)/i);
  return m ? m[1].replace(/^www\./, '') : '';
}

function buildOperator(D, op, sites, today, colors, trackedBy) {
  const refs = refCounter();
  const rows = sites.map((s) => trackedRow(D, s, today, refs.ref));

  const leads = [];
  for (const sec of op.sections || []) {
    for (const item of sec.items) {
      leads.push(lead(item.raw, sec.kind, item.done, refs.ref));
    }
  }

  return Object.assign({}, op, {
    live: trackedBy[op.name] || null,
    color: colors[op.name] || '',
    rows: rows,
    leads: leads,
    sources: refs.list,
  });
}

function readCoverage() {
  const D = loadAtlas();
  const tracked = liveTracked(D);
  const today = new Date().toISOString().slice(0, 10);
  const colors = providerColors(D);

  const byProvider = {};
  for (const s of D.SITES || []) (byProvider[s.provider] || (byProvider[s.provider] = [])).push(s);

  const parsed = fs.existsSync(COVERAGE)
    ? parseCoverage(fs.readFileSync(COVERAGE, 'utf8'))
    : { compiled: '', operators: [] };

  // Attach the live sites and the leads, and let operators that exist in the
  // data but have never had a gap search show up as their own tab rather than
  // being quietly left out. A provider with no roster is a real gap in the
  // roster, and an absent roster must look like an absent roster.
  const seen = {};
  const operators = parsed.operators.map((op) => {
    seen[op.name] = true;
    return buildOperator(D, op, byProvider[op.name] || [], today, colors, tracked.by);
  });
  for (const name of Object.keys(tracked.by)) {
    if (seen[name]) continue;
    operators.push(buildOperator(
      D, { name: name, heading: name, listed: null, sections: [] },
      byProvider[name] || [], today, colors, tracked.by
    ));
  }
  operators.sort((a, b) => (b.live ? b.live.total : 0) - (a.live ? a.live.total : 0));

  return {
    hasFile: fs.existsSync(COVERAGE),
    path: COVERAGE,
    compiled: parsed.compiled,
    tracked: tracked,
    operators: operators,
  };
}

function readRun(name) {
  // Only ever open a file inside runs/, by basename. The name comes from a
  // note written by an agent, so it is untrusted and must not be able to
  // walk out of the directory.
  const safe = path.basename(String(name || ''));
  const full = path.join(RUNS, safe);
  if (!safe.endsWith('.md') || !full.startsWith(RUNS) || !fs.existsSync(full)) {
    return null;
  }
  return fs.readFileSync(full, 'utf8');
}

let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1100,
    height: 760,
    minWidth: 680,
    backgroundColor: '#14161a',
    title: 'Site Atlas — research desk',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.loadFile(path.join(__dirname, 'index.html'));

  // External links open in the real browser, never inside the app window.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  // The roster is edited by hand and by research runs; reflect it live too.
  for (const target of [COVERAGE, SITES_FILE, SOURCES_FILE]) {
    if (!fs.existsSync(target)) continue;
    try {
      let p = null;
      fs.watch(target, () => {
        clearTimeout(p);
        p = setTimeout(() => {
          if (win && !win.isDestroyed()) win.webContents.send('desk:changed');
        }, 150);
      });
    } catch (e) { /* a watch we can't set is not worth failing the window over */ }
  }

  // A note filed while the app is open should just appear.
  if (fs.existsSync(NOTES)) {
    let pending = null;
    fs.watch(NOTES, () => {
      clearTimeout(pending);
      pending = setTimeout(() => {
        if (win && !win.isDestroyed()) win.webContents.send('desk:changed');
      }, 150);
    });
  }
}

ipcMain.handle('desk:notes', () => ({
  deskPath: DESK,
  hasDesk: fs.existsSync(NOTES),
  notes: readNotes(),
  runCount: fs.existsSync(RUNS) ? fs.readdirSync(RUNS).filter((f) => f.endsWith('.md')).length : 0,
}));

ipcMain.handle('desk:run', (_e, name) => readRun(name));

ipcMain.handle('desk:coverage', () => readCoverage());

ipcMain.handle('desk:reveal', (_e, slug) => {
  const safe = path.basename(String(slug || '')) + '.md';
  const full = path.join(NOTES, safe);
  if (fs.existsSync(full)) shell.showItemInFolder(full);
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
