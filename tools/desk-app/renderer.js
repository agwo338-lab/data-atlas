'use strict';

// Renderer for the research desk. No framework, matching the rest of the
// project. Everything user-visible goes in via textContent: note bodies are
// written by agents that read arbitrary web pages, so they are untrusted
// input and must never be parsed as HTML or markdown.

const $ = (id) => document.getElementById(id);

let notes = [];
let selected = null;

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

window.desk.onChange(load);
load();
