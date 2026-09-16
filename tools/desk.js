#!/usr/bin/env node
'use strict';

// The research desk — a local, gitignored record of what the research
// subagents actually found, kept in their own words.
//
// Subagent work is otherwise invisible: an agent runs, a report scrolls
// past, findings land in data/, and the only durable trace is a commit
// message written by the process that decided what to apply. Since the
// human review gate was removed (see CLAUDE.md) nothing else records what
// an agent thought, as opposed to what it concluded.
//
// Two layers, on purpose:
//
//   notes/   The desk note: a short paragraph the agent writes in its own
//            voice at the end of every report, plus one line from the
//            caller saying what was actually done with it. This is the
//            layer meant to be read.
//   runs/    The agent full final message, verbatim, filed automatically by
//            the SubagentStop hook. The backstop — consulted when a note
//            raises a question, not browsed.
//
//   file            read a complete note on stdin, validate it, file it
//   list [n]        the most recent notes, newest first
//   show <slug>     print one note in full
//   json            every note as JSON, for the viewer
//   capture         (hook) archive a subagent verbatim report to runs/
//   backfill        recover past runs from .claude/agent-trace.jsonl
//
// Everything lands in research-log/, which is gitignored.

const fs = require('fs');
const path = require('path');

const NL = String.fromCharCode(10);
const ROOT = path.resolve(__dirname, '..');
const DESK = path.join(ROOT, 'research-log');
const NOTES = path.join(DESK, 'notes');
const RUNS = path.join(DESK, 'runs');

// Only the research agents get a desk entry. Explore and general-purpose
// runs are plumbing and would bury the signal.
const WATCHED = new Set(['research-agent', 'news-agent']);

// Required on every note. `applied` is the caller line, and the reason the
// note is worth keeping: it is the only place an agent impression sits next
// to what was actually done about it.
const REQUIRED = ['date', 'agent', 'topic', 'asked', 'applied'];

function warn(msg) {
  process.stderr.write('[desk] ' + msg + NL);
}

function die(msg) {
  warn(msg);
  process.exit(1);
}

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'untitled';

// Deliberately minimal: flat `key: value` pairs between two `---` fences.
// No nesting, no YAML library, no dependency. If a value needs a colon it
// can be quoted, and that is the whole grammar.
function parseFrontmatter(text) {
  const lines = text.split(NL);
  if (lines[0].trim() !== '---') return null;
  const end = lines.indexOf('---', 1);
  if (end === -1) return null;
  const meta = {};
  for (const line of lines.slice(1, end)) {
    if (!line.trim()) continue;
    const i = line.indexOf(':');
    if (i === -1) continue;
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

// Newest first: declared research date, then actual filing time within a day.
function byNewestFirst(a, b) {
  const d = String(b.meta.date || '').localeCompare(String(a.meta.date || ''));
  return d !== 0 ? d : (b.filed || 0) - (a.filed || 0);
}

function readNotes() {
  if (!fs.existsSync(NOTES)) return [];
  return fs
    .readdirSync(NOTES)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const parsed = parseFrontmatter(fs.readFileSync(path.join(NOTES, f), 'utf8'));
      if (!parsed) {
        warn('skipping ' + f + ': no readable frontmatter');
        return null;
      }
      return {
        slug: f.replace(/\.md$/, ''),
        file: f,
        // When the note was actually filed. `date` is the day the research
        // happened and several runs share one, so on its own it leaves
        // same-day notes in readdir order — which is alphabetical, not
        // chronological. mtime breaks the tie the way a desk does: the thing
        // you put down last is on top.
        filed: fs.statSync(path.join(NOTES, f)).mtimeMs,
        ...parsed,
      };
    })
    .filter(Boolean)
    .sort(byNewestFirst);
}

function fileNote(raw) {
  const parsed = parseFrontmatter(raw);
  if (!parsed) die('note needs a --- frontmatter block at the top');

  const missing = REQUIRED.filter((k) => !parsed.meta[k]);
  if (missing.length) die('note is missing required field(s): ' + missing.join(', '));
  if (!parsed.body.trim()) die('note has frontmatter but no body, and the body is the point');

  // The one check worth enforcing: the body should be the agent prose, not a
  // pasted report. A wall of headings means the wrong thing got copied.
  const headings = parsed.body.split(NL).filter((l) => l.trim().startsWith('#')).length;
  if (headings > 2) {
    warn('body has ' + headings + ' headings; did a full report get pasted instead of the desk note?');
  }

  fs.mkdirSync(NOTES, { recursive: true });
  const slug = parsed.meta.date + '-' + slugify(parsed.meta.topic);
  const out = path.join(NOTES, slug + '.md');
  const existed = fs.existsSync(out);
  fs.writeFileSync(out, raw.trim() + NL);
  console.log((existed ? 'Updated' : 'Filed') + ' research-log/notes/' + slug + '.md');
  return slug;
}

function list(n) {
  const notes = readNotes();
  if (!notes.length) {
    console.log('Desk is empty. No notes filed yet.');
    return;
  }
  const shown = notes.slice(0, n);
  console.log('research desk — ' + shown.length + ' of ' + notes.length + ' notes' + NL);
  for (const note of shown) {
    const m = note.meta;
    console.log(m.date + '  ' + m.topic);
    console.log('  asked:   ' + m.asked);
    console.log('  applied: ' + m.applied);
    const first = note.body.split(NL).find((l) => l.trim());
    if (first) console.log('  ' + (first.length > 92 ? first.slice(0, 89) + '...' : first));
    console.log('  (' + m.agent + ' · node tools/desk.js show ' + note.slug + ')' + NL);
  }
}

function show(slug) {
  if (!slug) die('usage: node tools/desk.js show <slug>');
  const notes = readNotes();
  const note = notes.find((x) => x.slug === slug) || notes.find((x) => x.slug.includes(slug));
  if (!note) die('no note matching ' + slug + ' (try: node tools/desk.js list)');
  console.log(fs.readFileSync(path.join(NOTES, note.file), 'utf8'));
}

// Everything the viewer needs, so the UI never has to re-implement the
// frontmatter grammar or go hunting through the filesystem itself.
function json() {
  const notes = readNotes().map((n) => ({
    slug: n.slug,
    date: n.meta.date,
    agent: n.meta.agent,
    topic: n.meta.topic,
    asked: n.meta.asked,
    applied: n.meta.applied,
    commit: n.meta.commit || null,
    run: n.meta.run || null,
    body: n.body,
  }));
  console.log(JSON.stringify({ deskPath: DESK, notes }, null, 2));
}

// --- the verbatim backstop, written by the SubagentStop hook -------------

function archive(entry) {
  fs.mkdirSync(RUNS, { recursive: true });
  const stamp = entry.ts.replace(/[:.]/g, '-').replace(/-[0-9]{3}Z$/, 'Z');
  const name = stamp + '-' + entry.agent + '.md';
  fs.writeFileSync(
    path.join(RUNS, name),
    '# ' + entry.agent + ' — ' + entry.ts + NL + NL +
      '- agent id: `' + (entry.agentId || 'unknown') + '`' + NL +
      '- session: `' + (entry.sessionId || 'unknown') + '`' + NL + NL +
      'The agent final message, verbatim. The readable version of this run' + NL +
      'lives in ../notes/; this copy exists so that note can be checked' + NL +
      'against what the agent actually said.' + NL + NL +
      '---' + NL + NL + entry.report + NL
  );
  return name;
}

function capture(raw) {
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (e) {
    // A silent desk is the worst failure mode here: an empty log reads as
    // "no research ran" rather than "the log broke." Hooks capture stderr,
    // so complain — but still exit 0 so an agent run is never affected.
    warn('could not parse the hook payload: ' + e.message);
    return;
  }
  const agent = payload.agent_type || '';
  if (!WATCHED.has(agent)) return; // not research; nothing to file, not an error
  const report = payload.last_assistant_message || '';
  if (!report.trim()) {
    warn(agent + ' finished with an empty final message; nothing archived');
    return;
  }
  const name = archive({
    ts: payload.ts || new Date().toISOString(),
    agent,
    agentId: payload.agent_id,
    sessionId: payload.session_id,
    report,
  });
  if (!report.includes('## Desk note')) {
    warn(agent + ' returned no "## Desk note" section (archived as ' + name + ')');
  }
}

function backfill() {
  const trace = path.join(ROOT, '.claude', 'agent-trace.jsonl');
  if (!fs.existsSync(trace)) {
    console.log('No .claude/agent-trace.jsonl to backfill from.');
    return;
  }
  const rows = fs
    .readFileSync(trace, 'utf8')
    .trim()
    .split(NL)
    .map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return null;
      }
    })
    .filter((o) => o && o.hook_event_name === 'SubagentStop' && WATCHED.has(o.agent_type || ''))
    .sort((a, b) => String(a.ts).localeCompare(String(b.ts)));

  let n = 0;
  for (const r of rows) {
    if (!(r.last_assistant_message || '').trim()) continue;
    archive({
      ts: r.ts,
      agent: r.agent_type,
      agentId: r.agent_id,
      sessionId: r.session_id,
      report: r.last_assistant_message,
    });
    n++;
  }
  console.log('Archived ' + n + ' past run(s) to research-log/runs/.');
  if (n) console.log('These predate the note format, so they have no desk note.');
}

function readStdin(then) {
  let buf = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (d) => (buf += d));
  process.stdin.on('error', (e) => warn('stdin error: ' + e.message));
  process.stdin.on('end', () => then(buf));
}

const cmd = process.argv[2];
if (cmd === 'capture') {
  readStdin((buf) => {
    if (!buf.trim()) return warn('no hook payload arrived on stdin');
    try {
      capture(buf);
    } catch (e) {
      warn('failed to archive a run: ' + (e && e.stack ? e.stack : e));
    }
  });
} else if (cmd === 'file') {
  readStdin((buf) => {
    if (!buf.trim()) die('no note arrived on stdin');
    fileNote(buf);
  });
} else if (cmd === 'list') {
  list(parseInt(process.argv[3], 10) || 10);
} else if (cmd === 'show') {
  show(process.argv[3]);
} else if (cmd === 'json') {
  json();
} else if (cmd === 'backfill') {
  backfill();
} else {
  console.log('usage: node tools/desk.js <file|list [n]|show SLUG|json|capture|backfill>');
}
