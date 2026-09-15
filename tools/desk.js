#!/usr/bin/env node
'use strict';

// The research desk: a local, gitignored record of what the research
// subagents actually reported, written by a SubagentStop hook rather than
// by the model that dispatched them.
//
// Why a hook: research-agent and news-agent have no Write/Edit/Bash tool
// on purpose (see CLAUDE.md — they read arbitrary web pages, and a write
// path from there into data/sites.js is a prompt-injection path into a
// file index.html loads as a plain script). They therefore cannot keep
// this log themselves. The caller could, but a caller-written log is a
// self-report: the same process that decided what to apply also decides
// what to record about it. The harness runs this on agent completion, so
// the report is captured verbatim whether or not anyone wants it captured.
//
//   capture    read a SubagentStop hook payload on stdin, file a brief
//   list [n]   print the most recent n briefs (default 10)
//   backfill   recover past runs from .claude/agent-trace.jsonl
//
// Everything it writes lands in research-log/, which is gitignored.

const fs = require('fs');
const path = require('path');

const NL = String.fromCharCode(10);
const ROOT = path.resolve(__dirname, '..');
const DESK = path.join(ROOT, 'research-log');
const RUNS = path.join(DESK, 'runs');
const INDEX = path.join(DESK, 'INDEX.md');

// Only the research agents get a desk entry. Explore/general-purpose runs
// are plumbing, not research, and would bury the signal.
const WATCHED = new Set(['research-agent', 'news-agent']);

const INDEX_HEADER = `# Research desk

Auto-filed by \`tools/desk.js\` from a SubagentStop hook. Newest first.
Each line links the agent's full verbatim report in \`runs/\`.

Not in git. Read it with \`node tools/desk.js list\`.

---
`;

function warn(msg) {
  process.stderr.write('[desk] ' + msg + String.fromCharCode(10));
}

function tally(text, re) {
  const out = {};
  let m;
  while ((m = re.exec(text)) !== null) {
    const k = m[1].toUpperCase();
    out[k] = (out[k] || 0) + 1;
  }
  return out;
}

// Verdict lines are meant to be a short enum, but older reports (and any
// future drift) put prose there, which would otherwise blow the one-line
// brief out to several hundred characters. Clip hard; the full text is one
// click away in runs/.
const clip = (k) => (k.length > 22 ? k.slice(0, 21).trimEnd() + '…' : k);

const fmtTally = (t, max = 4) => {
  const e = Object.entries(t).sort((a, b) => b[1] - a[1]);
  const shown = e.slice(0, max).map(([k, n]) => `${n} ${clip(k)}`);
  if (e.length > max) shown.push(`+${e.length - max} more`);
  return shown.join(', ');
};

// The hook has no model, so the brief has to be derived mechanically from
// the report's documented shape (Verdict: / Confidence: / Apply: lines).
// If an agent drifts from that format the counts read 0 — which is itself
// worth seeing, so it is not papered over with a fallback guess.
function summarize(report) {
  const lines = report.split('\n');
  const heading = lines.find((l) => /^#{1,3}\s+\S/.test(l));
  const firstProse = lines.find((l) => l.trim() && !/^[#*_\-=\s]*$/.test(l));
  let topic = (heading || firstProse || 'untitled')
    .replace(/^#+\s*/, '')
    .replace(/\*\*/g, '')
    .trim();
  if (topic.length > 90) topic = topic.slice(0, 87) + '...';

  return {
    topic,
    verdicts: tally(report, /(?:^|\n)\s*(?:[-*]\s*)?(?:\*\*)?Verdict(?:\*\*)?:\s*(?:\*\*)?\s*([^\n*]+?)\s*(?:\*\*)?\s*(?:\n|$)/g),
    confidence: tally(report, /(?:\*\*)?Confidence(?:\*\*)?:\s*(?:\*\*)?\s*(High|Medium|Low|Unverifiable)/gi),
    apply: tally(report, /(?:\*\*)?Apply(?:\*\*)?:\s*(?:\*\*)?\s*(APPLY-IF-EMPTY|APPLY|NO-VALUE|NONE)/g),
  };
}

function file(entry) {
  const { ts, agent, agentId, report, sessionId, transcript } = entry;
  fs.mkdirSync(RUNS, { recursive: true });

  const stamp = ts.replace(/[:.]/g, '-').replace(/-\d{3}Z$/, 'Z');
  const name = `${stamp}-${agent}.md`;
  const s = summarize(report);

  const bits = [];
  if (Object.keys(s.apply).length) bits.push(`apply ${fmtTally(s.apply)}`);
  if (Object.keys(s.confidence).length) bits.push(`confidence ${fmtTally(s.confidence)}`);
  if (Object.keys(s.verdicts).length) bits.push(`verdicts ${fmtTally(s.verdicts)}`);
  const detail = bits.length ? bits.join(' · ') : 'no per-field lines found in report';

  fs.writeFileSync(
    path.join(RUNS, name),
    `# ${agent} — ${ts}\n\n` +
      `- agent id: \`${agentId || 'unknown'}\`\n` +
      `- session: \`${sessionId || 'unknown'}\`\n` +
      `- agent transcript: \`${transcript || 'unknown'}\`\n\n` +
      `Report below is the agent's final message, verbatim and unedited.\n` +
      `Compare it against what actually landed in \`data/\` — that diff is\n` +
      `the point of keeping this.\n\n---\n\n${report}\n`
  );

  const line = `- **${ts.slice(0, 16).replace('T', ' ')}** · ${agent} · ${s.topic}\n  ${detail} · [full report](runs/${name})\n`;

  let existing = '';
  if (fs.existsSync(INDEX)) {
    const cur = fs.readFileSync(INDEX, 'utf8');
    const cut = cur.indexOf('---' + NL);
    existing = cut === -1 ? cur : cur.slice(cut + 4);
    // Filing the same run twice (a re-run of backfill, a replayed hook
    // payload) should refresh that run in place rather than stack a
    // duplicate line on top of it.
    existing = existing
      .split(new RegExp(NL + '(?=- \\*\\*)'))
      .filter((e) => e.trim() && !e.includes('(runs/' + name + ')'))
      .join(NL);
    if (existing) existing += NL;
  }
  fs.writeFileSync(INDEX, INDEX_HEADER + '\n' + line + existing.replace(/^\n+/, ''));
  return name;
}

function capture(raw) {
  let p;
  try {
    p = JSON.parse(raw);
  } catch (e) {
    // A silent desk is the worst failure mode this thing has: an empty log
    // reads as "no research ran" rather than "the log broke." Hooks capture
    // stderr, so complain loudly and still exit 0 so the agent run is
    // unaffected.
    warn('could not parse the hook payload: ' + e.message);
    return;
  }
  const agent = p.agent_type || '';
  if (!WATCHED.has(agent)) return; // not research; nothing to file, not an error
  const report = p.last_assistant_message || '';
  if (!report.trim()) {
    warn(agent + ' finished with an empty final message; nothing filed');
    return;
  }
  file({
    ts: p.ts || new Date().toISOString(),
    agent,
    agentId: p.agent_id,
    sessionId: p.session_id,
    transcript: p.agent_transcript_path,
    report,
  });
}

function list(n) {
  if (!fs.existsSync(INDEX)) {
    console.log('Desk is empty — no research runs filed yet.');
    return;
  }
  const body = fs.readFileSync(INDEX, 'utf8').split('---\n').slice(1).join('---\n').trim();
  if (!body) {
    console.log('Desk is empty — no research runs filed yet.');
    return;
  }
  const entries = body.split(/\n(?=- \*\*)/).slice(0, n);
  console.log(`research desk — ${entries.length} most recent\n`);
  console.log(entries.join('\n'));
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
    .split('\n')
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
    file({
      ts: r.ts,
      agent: r.agent_type,
      agentId: r.agent_id,
      sessionId: r.session_id,
      transcript: r.agent_transcript_path,
      report: r.last_assistant_message,
    });
    n++;
  }
  console.log(`Backfilled ${n} run(s) from the old trace.`);
}

const cmd = process.argv[2];
if (cmd === 'capture') {
  let buf = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (d) => (buf += d));
  process.stdin.on('error', (e) => warn('stdin error: ' + e.message));
  process.stdin.on('end', () => {
    if (!buf.trim()) {
      warn('no hook payload arrived on stdin');
      return;
    }
    try {
      capture(buf);
    } catch (e) {
      // A broken desk must never break an agent run, but it must say so.
      warn('failed to file a brief: ' + (e && e.stack ? e.stack : e));
    }
  });
} else if (cmd === 'list') {
  list(parseInt(process.argv[3], 10) || 10);
} else if (cmd === 'backfill') {
  backfill();
} else {
  console.log('usage: node tools/desk.js <capture|list [n]|backfill>');
}
