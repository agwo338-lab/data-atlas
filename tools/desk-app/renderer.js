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
// One tab per operator, and inside it one table listing every site claimed
// to exist under that name — the ones already in data/sites.js and the ones
// that are still only a lead, in the same table, because "what is claimed to
// exist" is the question and the split between those two halves is an answer
// to it rather than a reason to keep two separate lists.
//
// Every row carries a confidence rating with its citations attached as
// superscript numbers, footnoted per tab. Putting the rating on the row
// rather than in a summary is what stops the roster reading as a list of
// facts: a tracked row rates what data/sources.js computed from the evidence
// on file, while a lead row rates only how likely the roster's compiler
// thought the site was to be real. Those are different claims, and the table
// has to say which one it is making.
//
// Everything user-visible goes in via textContent, same rule as note bodies:
// the roster's prose comes out of research runs, so it is untrusted text and
// is never parsed as HTML or markdown. The only nodes built from the file's
// own structure are anchors, and main.js has already checked their href is
// http(s) before it gets here.

const GROUP = {
  tracked: {
    title: 'In the atlas',
    note: 'Rated by data/sources.js from the evidence on file — the same score the map shows.',
  },
  high: {
    title: 'Reported to exist, not yet added — high confidence',
    note: 'Unvetted. The rating is how likely the site is to be real, not how well sourced its figures are.',
  },
  medium: {
    title: 'Reported to exist, not yet added — medium confidence',
    note: 'Unvetted, and thinner than the above — often one outlet, or a parcel nobody has confirmed.',
  },
  watch: {
    title: 'Watch-only — looked at, not currently actionable',
    note: 'Investigated and deliberately not pursued. Kept so it is not re-discovered from scratch.',
  },
};

let activeOp = null;

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

// Superscript citation numbers. The number is a link down to the footnote
// list under the table, which is where the source actually opens from — so a
// row stays readable at a glance and the URLs live in one place per tab.
function refSup(refs) {
  const sup = el('sup', 'refs');
  refs.forEach((n, i) => {
    if (i) sup.append(el('span', 'ref-sep', ','));
    const a = el('a', 'ref', String(n));
    a.href = '#src-' + n;
    a.title = 'Source ' + n + ', listed under the table';
    sup.append(a);
  });
  return sup;
}

function leadRating(row) {
  if (row.kind === 'watch') return 'Watch-only';
  if (row.done) return 'Lead · since added';
  return 'Unvetted lead · ' + (row.grade === 'high' ? 'high' : 'medium') + ' confidence';
}

function coverageRow(row) {
  const tr = el('tr', row.kind === 'tracked' ? 'is-tracked' : 'is-lead');
  if (row.done) tr.classList.add('is-done');

  const site = el('td', 'c-site');
  site.append(el('span', 'site-name', row.name || '(unnamed)'));
  const sub = row.place || row.detail;
  if (sub) site.append(el('span', 'site-sub', sub));
  tr.append(site);

  // A lead's status and capacity are read out of its prose rather than
  // recorded as fields, so they are set in a lighter weight — the sentence
  // under the name is the actual claim, these two are a reading of it.
  const guessed = row.kind !== 'tracked';
  tr.append(el('td', 'c-status' + (guessed ? ' is-guessed' : ''), row.status || '—'));

  const cap = el('td', 'c-cap' + (guessed ? ' is-guessed' : ''), row.capacity || '—');
  if (row.derived) {
    cap.append(el('span', 'derived', 'derived'));
    cap.title = 'Derived here from a public record, not disclosed by the operator.';
  }
  tr.append(cap);

  const conf = el('td', 'c-conf');
  const dot = el('span', 'conf-dot');
  if (row.kind === 'tracked') {
    dot.style.background = row.color || 'var(--color-neutral-600)';
    dot.title = row.level + ' confidence · ' +
      row.fields.map((f) => f.label + ': ' + f.verdict + ' (' + f.level + ')').join(' · ');
    conf.append(dot, el('span', 'conf-word', row.verdict));
  } else {
    dot.classList.add('is-lead');
    dot.title = 'Not vetted to the atlas’s sourcing standard.';
    conf.append(dot, el('span', 'conf-word is-lead', leadRating(row)));
  }
  if (row.refs && row.refs.length) conf.append(refSup(row.refs));
  else conf.append(el('span', 'no-ref', 'no citation'));
  tr.append(conf);

  return tr;
}

function groupHeader(kind, count) {
  const g = GROUP[kind] || { title: kind, note: '' };
  const tr = el('tr', 'grp');
  const th = el('th');
  th.colSpan = 4;
  th.append(el('span', 'grp-title', g.title + ' (' + count + ')'));
  if (g.note) th.append(el('span', 'grp-note', g.note));
  tr.append(th);
  return tr;
}

function renderTable(op) {
  const groups = [
    { kind: 'tracked', rows: op.rows },
    { kind: 'high', rows: op.leads.filter((l) => l.kind === 'lead' && l.grade === 'high') },
    { kind: 'medium', rows: op.leads.filter((l) => l.kind === 'lead' && l.grade === 'medium') },
    { kind: 'watch', rows: op.leads.filter((l) => l.kind === 'watch') },
  ].filter((g) => g.rows.length);

  const table = el('table', 'cov');
  const head = el('thead');
  const hr = el('tr');
  ['Site', 'Status', 'Capacity', 'Confidence'].forEach((h) => hr.append(el('th', null, h)));
  head.append(hr);
  table.append(head);

  for (const g of groups) {
    const body = el('tbody', 'grp-' + g.kind);
    body.append(groupHeader(g.kind, g.rows.length));
    for (const row of g.rows) body.append(coverageRow(row));
    table.append(body);
  }
  return table;
}

function renderSources(op) {
  const wrap = el('div', 'srcs');
  wrap.append(el('div', 'eyebrow', 'Sources'));
  const ol = el('ol', 'src-list');
  for (const s of op.sources) {
    const li = el('li');
    li.id = 'src-' + s.n;
    if (s.url) {
      const a = el('a', 'src-link', s.label);
      a.href = s.url;
      a.target = '_blank';
      a.rel = 'noreferrer';
      li.append(a);
      if (s.host) li.append(el('span', 'src-host', s.host));
    } else {
      li.append(el('span', 'src-link is-dead', s.label));
    }
    ol.append(li);
  }
  wrap.append(ol);
  return wrap;
}

function renderOperator(op) {
  const card = el('section', 'op');

  const head = el('div', 'op-head');
  const dot = el('span', 'op-dot');
  if (op.color) dot.style.background = op.color;
  head.append(dot, el('span', 'op-name', op.heading || op.name));

  // The heading count in COVERAGE.md is written by hand; the live one is
  // computed from data/sites.js. If they disagree the roster is stale, and
  // saying so is more useful than silently preferring one.
  const tracked = op.live ? op.live.total : 0;
  if (op.listed != null && op.listed !== tracked) {
    head.append(el('span', 'op-drift', 'roster says ' + op.listed + ', data says ' + tracked + ' — recompile'));
  }
  card.append(head);

  const open = op.leads.filter((l) => l.kind === 'lead' && !l.done);
  const high = open.filter((l) => l.grade === 'high').length;
  const medium = open.filter((l) => l.grade === 'medium').length;
  const watch = op.leads.filter((l) => l.kind === 'watch').length;

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
  if (op.live) nums.append(num(op.live.operational, 'of those, live', !op.live.operational));

  // "Independently verified" is the number this project actually watches, so
  // the roster states it rather than leaving it to be counted down the
  // confidence column.
  const ind = op.rows.filter((r) => r.verdictKey === 'independent').length;
  if (op.rows.length) nums.append(num(ind, 'independently verified', !ind));
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
  if (!op.leads.length) {
    card.append(el('p', 'op-empty',
      'No gap search has been run for this operator yet, so the table below is ' +
      'only what is already tracked — there is no list of what it might be ' +
      'missing. Point research-agent at it and add a section to COVERAGE.md.'));
  }

  if (op.rows.length || op.leads.length) card.append(renderTable(op));
  if (op.sources.length) card.append(renderSources(op));
  return card;
}

function renderTabs() {
  const strip = $('op-tabs');
  strip.textContent = '';
  for (const op of coverage.operators) {
    const b = el('button', 'op-tab');
    b.type = 'button';
    b.setAttribute('aria-pressed', String(op.name === activeOp));
    const dot = el('span', 'op-dot');
    if (op.color) dot.style.background = op.color;
    const claimed = (op.live ? op.live.total : 0) +
      op.leads.filter((l) => l.kind === 'lead' && !l.done).length;
    b.append(dot, el('span', 'op-tab-name', op.name), el('span', 'op-tab-n', String(claimed)));
    b.title = claimed + ' sites currently claimed to exist under this operator';
    b.addEventListener('click', () => {
      activeOp = op.name;
      renderCoverage();
    });
    strip.append(b);
  }
}

function renderCoverage() {
  const box = $('coverage-list');
  box.textContent = '';
  if (!coverage) return;

  $('coverage-sub').textContent = coverage.hasFile
    ? 'COVERAGE.md · compiled ' + (coverage.compiled || 'date not recorded')
    : 'No COVERAGE.md found';

  $('coverage-lede').textContent = coverage.hasFile
    ? 'One tab per operator. Each table lists every site claimed to exist under ' +
      'that name: the ones already in the atlas, rated by the same confidence ' +
      'engine the map uses, and the ones only reported to exist, which have not ' +
      'been vetted to the atlas’s sourcing standard at all. The number beside a ' +
      'rating points at the source it rests on, listed under the table.'
    : 'The roster lives in COVERAGE.md at the repo root. It is missing, so the ' +
      'tables below show tracked sites only, with no list of what is outstanding.';

  const warn = $('coverage-warn');
  if (coverage.tracked && !coverage.tracked.ok) {
    warn.textContent =
      'data/sites.js could not be parsed, so every table below is empty. ' +
      'That same error would take the live map down silently. ' + coverage.tracked.error;
    warn.hidden = false;
  } else {
    warn.hidden = true;
  }

  if (!coverage.operators.length) {
    $('op-tabs').textContent = '';
    box.append(el('p', 'op-empty', 'No operators to show.'));
    return;
  }
  if (!coverage.operators.some((o) => o.name === activeOp)) {
    activeOp = coverage.operators[0].name;
  }
  renderTabs();
  box.appendChild(renderOperator(coverage.operators.find((o) => o.name === activeOp)));
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
