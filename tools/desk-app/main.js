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
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
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
