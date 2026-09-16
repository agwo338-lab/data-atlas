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

// The atlas pins a display colour per operator. Reusing it here means an
// operator is the same colour on the map and on the roster, which is the
// whole reason the desk copies the atlas's tokens in the first place.
function providerColors() {
  try {
    const src = fs.readFileSync(PROVIDERS_FILE, 'utf8');
    const list = new Function(src + NL + ';return PROVIDERS;')();
    const by = {};
    for (const p of list) if (p && p.name && p.color) by[p.name] = p.color;
    return by;
  } catch (e) { return {}; }
}

function liveTracked() {
  // Evaluated the same way tools/atlas.js does it, so one definition of the
  // data serves both. Wrapped because a syntax error in sites.js is the
  // failure this project actually fears — index.html loads that file as a
  // plain script, where a bad edit takes the map down with no message. The
  // desk saying so out loud is more useful than the desk going blank.
  try {
    const src = fs.readFileSync(SITES_FILE, 'utf8');
    const sites = new Function(src + NL + ';return SITES;')();
    const by = {};
    for (const s of sites) {
      const b = by[s.provider] || (by[s.provider] = { total: 0, operational: 0, building: 0, planned: 0 });
      b.total++;
      if (s.status === 'Operational') b.operational++;
      else if (s.status === 'Under construction') b.building++;
      else b.planned++;
    }
    return { ok: true, by: by };
  } catch (e) {
    return { ok: false, error: e.message, by: {} };
  }
}

// Markdown down to plain text. Nothing from this file is ever rendered as
// HTML — links become their label, emphasis is dropped, and the result goes
// into the DOM via textContent like everything else on the desk.
function plain(md) {
  return String(md)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/&amp;/g, '&')
    .trim();
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
      section = {
        title: title,
        kind: /high confidence/i.test(title) ? 'high'
            : /medium confidence/i.test(title) ? 'medium'
            : /watch/i.test(title) ? 'watch'
            : 'other',
        items: [],
      };
      op.sections.push(section);
      continue;
    }
    if (!section) continue;

    if ((m = raw.match(/^-\s+(?:\[([ xX])\]\s*)?(.+)$/))) {
      section.items.push({ done: String(m[1] || '').toLowerCase() === 'x', text: plain(m[2]) });
    }
  }
  return { compiled: compiled, operators: operators };
}

function readCoverage() {
  const tracked = liveTracked();
  if (!fs.existsSync(COVERAGE)) {
    return { hasFile: false, path: COVERAGE, tracked: tracked, compiled: '', operators: [] };
  }
  const parsed = parseCoverage(fs.readFileSync(COVERAGE, 'utf8'));

  // Attach the live counts, and let operators that exist in the data but have
  // never had a gap search show up as their own (empty) row rather than being
  // quietly left out. A provider with no roster is a real gap in the roster.
  const colors = providerColors();
  const seen = {};
  const operators = parsed.operators.map((op) => {
    seen[op.name] = true;
    return Object.assign({}, op, { live: tracked.by[op.name] || null, color: colors[op.name] || '' });
  });
  for (const name of Object.keys(tracked.by)) {
    if (!seen[name]) {
      operators.push({
        name: name, heading: name, listed: null, sections: [],
        live: tracked.by[name], color: colors[name] || '',
      });
    }
  }
  operators.sort((a, b) => (b.live ? b.live.total : 0) - (a.live ? a.live.total : 0));

  return {
    hasFile: true,
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
  for (const target of [COVERAGE, SITES_FILE]) {
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
