'use strict';

// Renderer for the research desk. No framework, matching the rest of the
// project. Everything user-visible goes in via textContent: note bodies are
// written by agents that read arbitrary web pages, so they are untrusted
// input and must never be parsed as HTML or markdown.

const $ = (id) => document.getElementById(id);

let notes = [];
let selected = null;
let coverage = null;

// Same palette the atlas uses for provider pins, so the two agents read as
// two "operators" here in the way providers do there.
const AGENT_COLOR = {
  'research-agent': '#9184d9',
  'news-agent': '#75798c',
};

function gist(note) {
  const first = (note.body || '').split(String.fromCharCode(10)).find((l) => l.trim());
  return first || '(no note body)';
}

function matches(note, q) {
  if (!q) return true;
  const hay = [note.topic, note.asked, note.applied, note.body, note.agent, note.date]
    .join(' ')
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => hay.includes(term));
}

function renderList() {
  const q = $('search').value.trim();
  const shown = notes.filter((n) => matches(n, q));
  const list = $('list');
  list.textContent = '';

  $('count').textContent = q
    ? shown.length + ' of ' + notes.length + ' notes'
    : notes.length + (notes.length === 1 ? ' note' : ' notes');

  for (const note of shown) {
    const item = document.createElement('button');
    item.className = 'item';
    item.type = 'button';
    if (selected && note.slug === selected.slug) item.setAttribute('aria-current', 'true');

    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.style.background = AGENT_COLOR[note.agent] || '#75798c';

    const topic = document.createElement('span');
    topic.className = 'topic';
    topic.textContent = note.topic;

    const when = document.createElement('span');
    when.className = 'when';
    when.textContent = note.date + ' · ' + note.agent;

    const g = document.createElement('span');
    g.className = 'gist';
    g.textContent = gist(note);

    item.append(dot, topic, when, g);
    item.addEventListener('click', () => select(note));
    list.appendChild(item);
  }

  if (!shown.length && notes.length) {
    const none = document.createElement('div');
    none.className = 'empty';
    none.textContent = 'No note matches that.';
    list.appendChild(none);
  }
}

function select(note) {
  selected = note;
  $('welcome').hidden = true;
  $('note').hidden = false;

  $('topic').textContent = note.topic;
  $('sub').textContent =
    note.date + ' · ' + note.agent + (note.commit ? ' · commit ' + note.commit : '');
  $('asked').textContent = note.asked ? '"' + note.asked + '"' : '(not recorded)';
  $('applied').textContent = note.applied || '(not recorded)';
  $('body').textContent = note.body || '(no note body)';

  // The verbatim report is the backstop: it is what the note can be checked
  // against, so it is one click away rather than always on screen.
  $('run').hidden = true;
  $('run').textContent = '';
  $('run-wrap').hidden = !note.run;
  $('run-btn').textContent = "Show the agent's full report";

  $('detail').scrollTop = 0;
  renderList();
}

$('run-btn').addEventListener('click', async () => {
  const run = $('run');
  if (!run.hidden) {
    run.hidden = true;
    $('run-btn').textContent = "Show the agent's full report";
    return;
  }
  const text = await window.desk.run(selected.run);
  run.textContent =
    text || 'That archived report is missing from research-log/runs/ (' + selected.run + ').';
  run.hidden = false;
  $('run-btn').textContent = 'Hide the full report';
});

$('search').addEventListener('input', renderList);

// ════════════════════════════════════════════════════════════════════
// Coverage — the roster of what is known to exist versus what is tracked
// ════════════════════════════════════════════════════════════════════
// The notes view answers "what have we looked at". This answers "what is
// left", which is the thing that was previously only visible by opening
// COVERAGE.md in an editor.
//
// Everything here goes in via textContent, same rule as note bodies: the
// roster's prose comes out of research runs, so it is treated as untrusted
// text and never parsed as HTML or markdown.

const SECTION_LABEL = {
  high: 'Known to exist, not yet added — high confidence',
  medium: 'Known to exist, not yet added — medium confidence',
  watch: 'Watch-only — looked at, not currently actionable',
};

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function countOf(op, kind) {
  return op.sections
    .filter((sec) => sec.kind === kind)
    .reduce((t, sec) => t + sec.items.filter((i) => !i.done).length, 0);
}

function renderOperator(op) {
  const card = el('section', 'op');

  const head = el('div', 'op-head');
  const dot = el('span', 'op-dot');
  if (op.color) dot.style.background = op.color;
  head.append(dot, el('span', 'op-name', op.name));

  // The heading count in COVERAGE.md is written by hand; the live one is
  // computed from data/sites.js. If they disagree the roster is stale, and
  // saying so is more useful than silently preferring one.
  const tracked = op.live ? op.live.total : 0;
  if (op.listed != null && op.listed !== tracked) {
    head.append(el('span', 'op-drift', 'roster says ' + op.listed + ', data says ' + tracked + ' — recompile'));
  }
  card.append(head);

  const high = countOf(op, 'high');
  const medium = countOf(op, 'medium');
  const watch = countOf(op, 'watch');

  const nums = el('div', 'op-nums');
  const num = (value, label, muted) => {
    const d = el('div', 'op-num' + (muted ? ' is-muted' : ''));
    d.append(el('b', null, String(value)), el('span', null, label));
    return d;
  };
  nums.append(
    num(tracked, 'tracked'),
    num(high, 'leads · high conf.', !high),
    num(medium, 'leads · medium', !medium),
    num(watch, 'watch-only', !watch)
  );
  if (op.live) {
    nums.append(num(op.live.operational, 'of those, live', !op.live.operational));
  }
  card.append(nums);

  const leads = high + medium;
  const known = tracked + leads;
  if (known) {
    const meter = el('div', 'op-meter');
    const a = el('i');
    a.style.width = Math.round((tracked / known) * 100) + '%';
    a.style.background = op.color || 'var(--color-accent)';
    const b = el('i', 'lead');
    b.style.width = Math.round((leads / known) * 100) + '%';
    meter.append(a, b);
    card.append(meter);
    card.append(el('div', 'op-ratio',
      tracked + ' of ' + known + ' currently-known sites are in the atlas' +
      (leads ? ' · ' + leads + ' still only a lead' : ' · nothing outstanding')));
  }

  // Judged on items, not on section count: a roster can carry an empty
  // '### Missing' heading as a placeholder, and that is still no worklist.
  const hasItems = op.sections.some((sec) => sec.items.length);
  if (!hasItems) {
    card.append(el('p', 'op-empty',
      'No gap search has been run for this operator yet, so there is no list of ' +
      'what it might be missing — only what is already tracked. Point research-agent ' +
      'at it and add a section to COVERAGE.md.'));
    return card;
  }

  for (const sec of op.sections) {
    if (!sec.items.length) continue;
    const d = el('details', 'sec');
    const open = sec.kind === 'high';
    if (open) d.open = true;
    const label = SECTION_LABEL[sec.kind] || sec.title;
    d.append(el('summary', null, label + ' (' + sec.items.length + ')'));

    const ul = el('ul', 'sec-list');
    for (const item of sec.items) {
      const li = el('li', item.done ? 'done' : '');
      li.append(el('i', null, item.done ? '✓' : '○'), el('span', null, item.text));
      ul.appendChild(li);
    }
    d.appendChild(ul);
    card.appendChild(d);
  }
  return card;
}

function renderCoverage() {
  const box = $('coverage-list');
  box.textContent = '';
  if (!coverage) return;

  $('coverage-sub').textContent = coverage.hasFile
    ? 'COVERAGE.md · compiled ' + (coverage.compiled || 'date not recorded')
    : 'No COVERAGE.md found';

  $('coverage-lede').textContent = coverage.hasFile
    ? 'Tracked counts are read live from data/sites.js, so they are always what ' +
      'the map actually shows. The leads below are not: they are a hand-kept list ' +
      'of sites reported to exist that have not been vetted to the atlas’s ' +
      'sourcing standard yet. Treat them as where to point research-agent next, ' +
      'not as facts.'
    : 'The roster lives in COVERAGE.md at the repo root. It is missing, so there ' +
      'is nothing to show but the live tracked counts.';

  const warn = $('coverage-warn');
  if (coverage.tracked && !coverage.tracked.ok) {
    warn.textContent =
      'data/sites.js could not be parsed, so every tracked count below is 0. ' +
      'That same error would take the live map down silently. ' + coverage.tracked.error;
    warn.hidden = false;
  } else {
    warn.hidden = true;
  }

  for (const op of coverage.operators) box.appendChild(renderOperator(op));
}

function setView(view) {
  const onCoverage = view === 'coverage';
  $('main').classList.toggle('on-coverage', onCoverage);
  $('rail').hidden = onCoverage;
  $('detail').hidden = onCoverage;
  $('coverage').hidden = !onCoverage;
  for (const b of $('viewSeg').querySelectorAll('button')) {
    b.setAttribute('aria-pressed', String(b.dataset.view === view));
  }
  if (onCoverage) loadCoverage();
}

async function loadCoverage() {
  coverage = await window.desk.coverage();
  renderCoverage();
}

$('viewSeg').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-view]');
  if (btn) setView(btn.dataset.view);
});

function renderWelcome(data) {
  $('welcome-title').textContent = notes.length
    ? 'No note selected'
    : 'Nothing on the desk yet';

  const box = $('welcome-body');
  box.textContent = '';

  const lines = notes.length
    ? ['Pick a note on the left.']
    : [
        'Desk notes are filed when a research run is applied. The next time ' +
          'research-agent or news-agent runs, its note lands here.',
        data.runCount
          ? data.runCount +
            ' agent report(s) are already archived in research-log/runs/, but they ' +
            'predate the note format, so they have no readable note.'
          : 'Nothing is archived yet either.',
      ];

  for (const line of lines) {
    const p = document.createElement('p');
    p.textContent = line;
    box.appendChild(p);
  }
}

async function load() {
  const data = await window.desk.notes();
  notes = data.notes.filter((n) => !n.broken);

  const broken = data.notes.filter((n) => n.broken);
  $('meta-runs').textContent =
    notes.length + ' notes · ' + data.runCount + ' archived reports' +
    (broken.length ? ' · ' + broken.length + ' unreadable' : '');
  $('meta-path').textContent = data.deskPath;

  // Keep the open note open across a reload triggered by the file watcher.
  const keep = selected && notes.find((n) => n.slug === selected.slug);
  if (keep) {
    select(keep);
  } else {
    selected = null;
    $('note').hidden = true;
    $('welcome').hidden = false;
    renderWelcome(data);
    renderList();
  }
}

window.desk.onChange(() => {
  load();
  // The watcher also fires for COVERAGE.md and data/sites.js, so refresh the
  // roster if it's the thing on screen.
  if (!$('coverage').hidden) loadCoverage();
});
load();
