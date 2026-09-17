# Site Atlas

A personal, interactive world-map reference for tracking data center sites —
who operates them, where they are, their build status, and disclosed
capacity. Built as a single static site with no backend and no build step.

## Stack

- `index.html` — the entire app: markup, CSS, and JS in one file. Renders a
  world map (MapLibre GL JS + CARTO's Dark Matter vector basemap, both from
  a public CDN, no API key currently required), a provider dashboard, a
  detail panel, a site table, a Sources tab, and a Method tab (the evidence
  pipeline diagram and the live confidence tally). Site markers are plain DOM
  elements handed to MapLibre — it repositions them on pan/zoom itself, so
  there's no custom per-frame transform code to maintain. (Previously a
  hand-rolled D3 + SVG + topojson map; replaced because SVG's per-frame
  re-rasterization of complex coastline geometry made pan/zoom sluggish in
  a way that survived several rounds of targeted optimization — a GPU-vector
  tile basemap solves that class of problem architecturally instead.)
- `data/sites.js` — all site data, loaded by `index.html` as a plain script.
  This is the file that needs the most regular edits. Its header comment
  documents the field schema, the optional per-field `provenance` block, and
  the sourcing standard (how sources are classed, what needs verification,
  when to recheck). Follow that standard whenever adding or updating an
  entry. See `aws-santaclara` for a worked provenance example.
- `data/sources.js` — the source-class registry, the channel catalog, and
  the confidence engine. Defines the eight source classes (R regulatory,
  N network, O observed, P corporate, T trade, G general, D directory,
  U unattributed), maps a citation's URL host to a class, holds the
  per-field staleness windows, and computes each entry's confidence. A plain
  script tag like the other data files — no build step. The Method tab
  renders its class cards, channel table, and tally directly from this file,
  so the published explanation of the rules cannot drift from the rules.
- `data/providers.js` — one entry per operator, for anything that's about
  the *company* rather than one specific site: a pinned display color
  (dashboard card, map pins, table dot, provider page) and its disclosed
  partnerships/customers (shown as a "Partnerships" section on the
  provider page). A provider doesn't need an entry here to show up on the
  map; any new `provider` string in `sites.js` is auto-assigned a color
  from a shared palette and shows an empty partnerships section. Partner
  entries should trace back to something already vetted (e.g. a
  `news-agent` finding kept in `data/news.js`), not be typed in from
  general knowledge — see the file's own header comment.
- `data/news.js` — curated company-level headlines shown on each provider's
  dedicated page (opened by clicking its card on the dashboard), keyed by
  provider name. Deliberately separate from `sites.js`'s per-site `sources`
  field — see its own header comment for the schema and how it relates to
  `news-agent` below. A provider with no entry here falls back to a list
  built from its sites' `sources` instead.
- `tools/atlas.js` — a read-only CLI over the data files, for research runs.
  No dependencies; it evaluates the same `data/sources.js` the browser loads,
  so its scores can't drift from the page's.
    - `index` — one terse line per site with a per-field verdict. **Use this
      instead of reading `data/sites.js`**: the full file is ~17k tokens at
      41 sites and would be ~210k at 500, roughly 63% of it `notes` prose and
      URLs that are irrelevant to deciding what to look at. The index is
      about 20× smaller.
    - `due` — the audit queue, split into overdue re-checks and fields never
      independently verified.
    - `show <id>` — full detail for named entries only.
    - `stats`, `sources` — dataset tally and the channel catalog.
  Neither subagent has a Bash tool, so neither can run this; the caller runs
  it and passes the relevant slice into the agent's prompt. That is
  deliberate — a shell would hand them a write path through redirection and
  quietly undo the guarantee that research can't modify a data file. Don't
  add Bash to those agents to make the CLI more convenient.
- The site itself (`index.html`, `data/sites.js`) has no package manager, no
  build step, no framework — keep it that way. The two exceptions are
  `.claude/mcp/openrouter/` and `tools/`, both internal tooling rather than
  part of the deployed site.

## Workflow

- Live site: deployed on Vercel, connected to this repo's `main` branch.
  Pushing to `main` auto-deploys — no manual deploy step.
- To preview locally before pushing, serve the folder with any static file
  server (e.g. `npx serve .`) rather than opening `index.html` directly via
  `file://`, since the map fetches data over HTTP.
- Commit messages are the project's changelog — write them to actually
  describe what changed, since there's no separate log kept anywhere else.
- The user isn't a coder and reviews work by checking the live deployed
  result, not by reading a diff. So once a change to `index.html` is
  complete and locally verified (served and checked, not just written),
  commit and push to `main` immediately rather than pausing to ask "should
  I push?" — that question isn't useful to someone who can't evaluate the
  code anyway. This extends to research findings without exception as of
  Sep 2026: findings from research-agent, news-agent, or `/reconcile` are
  applied and pushed automatically, graded by the confidence they carry
  rather than routed past the user for approval. See the auto-apply policy
  in Data quality below for how each confidence level is applied — and for
  why a review gate the user cannot actually evaluate was worse than none.

## Data quality

**Source-class independence (Sep 2026, Stage 1).** The old bar for High
confidence was "2+ independent Tier 1/Tier 2 sources agree." That test was
broken: trade press is not independent of the operator, so an operator's
press release written up by DCD and Data Center Frontier scored as two
confirmations when it was one claim republished twice. Corroboration is now
counted across **source classes**, and High additionally requires at least
one *independent* class — R (regulatory), N (network telemetry), or
O (direct observation) — plus recency inside the field's staleness window.
P (corporate), T (trade) and G (general press) are promotional or
derivative and can never, on their own, produce a High.

Two consequences worth knowing before anything looks alarming:

1. **Most existing entries now read Medium, and several read Low.** As of
   the migration: 4 High, 29 Medium, 8 Low out of 41. Nothing about the data
   got worse — the atlas is built almost entirely on trade press restating
   operator announcements, and it now says so. The Sources tab sorts
   weakest-first precisely so this is a worklist.
2. **The auto-apply gate therefore tightened.** It still keys off High, but
   High is harder to reach, so more findings route to the review path. That
   is intended: the gate was previously reachable by a single press release
   with extra steps.

**Lead with the verdict, not the arithmetic.** The four-level scale is a
useful sort key, but the thing a reader actually needs is close to binary:
does this figure trace back to anyone other than the company announcing it?
So every field carries a **verdict** — *Independently verified*, *Operator's
word*, or *Unsourced* — stated in words, with the graded level demoted to a
hover-revealed dot beside it. As of Sep 2026, 86 of 108 scored fields across
the dataset are "operator's word." That single number is the state of the
atlas, and it is the one worth watching.

Related: trade and general press are classed as derivative *by default*
because that is usually what they are. But a reporter who sat in a planning
meeting or read a permit did independent work, and the record they used is
the thing worth citing. In that case add the underlying record as its own
source with `cls: "R"` — do not upgrade the article.

Confidence is computed **per field** (`capacityMW`, `status`, `location`)
and a site scores as its weakest field — a trustworthy address does not
rescue a fabricated capacity number. Entries can carry an optional
`provenance` block attaching evidence to individual fields; entries without
one fall back to treating every source as evidence for every field, which is
what the atlas implicitly assumed before. Fill in a real block whenever an
entry gets researched.

`basis` separates a number the operator disclosed from one derived here
(e.g. from an air permit's generator nameplate). A derived figure is a
legitimate finding; presenting it as disclosed is not, and the map labels
the difference.

Some entries are marked for periodic re-verification rather than treated as
permanently accurate — check individual entries' `notes` in `data/sites.js`
for anything flagged that way before relying on a number. When adding a new
operator or site, follow the sourcing standard already documented at the
top of that file rather than re-deriving one.

A `research-agent` subagent (`.claude/agents/research-agent.md`) handles
research on request — vetting a new candidate, re-checking one entry or
provider, or auditing the whole dataset — against a rigorous sourcing
methodology (source classing, cross-class corroboration, conflict handling).
It's research-only and can't edit files itself. It reports confidence per
field and hands back a pasteable `provenance` block, and it's expected to
reach for a regulatory or network source — EPA ECHO, a state air permit
docket, an ISO interconnection queue, EDGAR, PeeringDB — before concluding
that something is unverifiable. Running the whole job on news search is the
failure mode this stage exists to fix.

A separate `news-agent` subagent (`.claude/agents/news-agent.md`) curates
provider-level headlines (funding, expansion, partnerships, leadership,
controversies) for the provider dashboard page's newsfeed — deliberately
kept apart from `research-agent` since it's a different job: recency and
notability rather than per-field fact verification. Also research-only.
The provider page prefers `data/news.js` for a given provider when it has
an entry, and falls back to a `sources`-derived list (from
`data/sites.js`) otherwise.

A `/reconcile` slash command (`.claude/commands/reconcile.md`) codifies a
third research task, distinct from both agents above: re-checking claims
*already recorded* in the data (by default, every partner entry in
`data/providers.js`) against current public sources to catch drift —
"is this still true," not "vet something new" (research-agent's usual
job) or "what's new" (news-agent's job). It dispatches to research-agent
under the hood.

**Auto-apply policy (rewritten Sep 2026 — no human review gate).**

The old policy auto-applied High findings and routed everything else to
the user. That gate is gone. The reason it's gone is worth stating, since
it reads like a loosening and isn't: the user has no independent access to
the evidence, so asking them to adjudicate a Medium finding or a
model-vs-model disagreement produced a coin flip with a delay in front of
it, not a review. A gate where the reviewer cannot evaluate the thing is
theater, and theater that slows the work down.

What replaces it is the confidence system doing the job it was built for.
The old gate dates from when a value was either in the file or not, so a
human had to decide. Stage 1 removed that constraint — every field now
carries a verdict the site renders honestly. **Doubt goes into the data,
not into the user's inbox.**

Apply findings mechanically, by what the evidence supports:

- **High** → write the value. Verdict renders *Independently verified*.
- **Medium** → write the value. Verdict renders *Operator's word*. This is
  the big change from the old policy, and it covers most findings. The
  label already tells the truth about them; publishing one is the system
  working, not a risk being taken.
- **Low** → write the value **only if the field is currently empty**.
  Otherwise leave the existing value alone and record the lead in `notes`.
- **Conflicting** → **write no value at all.** Record both claims with
  dates and sources in `notes`, leave the field untouched. Do not pick a
  winner. "We don't know" is the honest state and the only resolution that
  requires no judgment.
- **Unverifiable** → write nothing. Record what was searched in `notes`,
  so it isn't re-searched from scratch next time.

Nobody adjudicates anywhere in that list. Conflicts resolve by declining
to claim.

**The one hard guard: a finding may never lower a field's verdict.** The
real failure mode here is not conflict, it's silent regression — a weakly
sourced finding overwriting a well-sourced value with nobody watching. So
upgrades apply freely; if incoming evidence is *weaker* than what's on
file, the field does not move and the new claim goes in `notes` as
contested. This is mechanical, not a judgment call.

**Who may write.** The agents remain research-only and keep no Write,
Edit or Bash tool — that has not changed and should not. They read
arbitrary web pages, and an agent that both reads untrusted content and
writes to `data/sites.js` is a prompt-injection path straight into a file
`index.html` loads as a plain script, where a syntax error takes the whole
map down silently in production. The *caller* applies the finding. That
gives up nothing: the user is equally out of the loop either way, because
the gate being removed is the user's, not the agent's.

When applying: update `lastUpdated`/`since` and `sources` to reflect the
re-verification, fill in a real `provenance` block, run
`node tools/atlas.js index` to confirm the file still parses and the
verdict moved as expected, and write a commit message describing what
changed and why. Everything lands in git with the changelog in the commit
message, so a bad auto-apply is one `git revert` away — a better safety
property than an approval from someone who couldn't evaluate it.

**What this gives up, plainly.** The old gate is credited below with
catching two fabricated claims in the `openrouter_ask` incident. Removing
it removes that catch. The replacements are earlier and better targeted —
the adversarial second pass in `research-agent.md` kills fabrications
before they reach a report, and the structured feeds check claims against
records rather than against plausibility — but this is a real change in
posture, not a free upgrade. The user's remaining oversight is aggregate,
not per-item: `node tools/atlas.js due` and the Sources tab show the shape
of the dataset without reviewing anything case by case.

## The research desk

Subagent work is invisible to the user — an agent runs, a report scrolls
past, findings land in `data/`, and the only durable trace is a commit
message written by the same process that decided what to apply. Since the
review gate was removed there is no other record of what an agent *thought*,
as opposed to what it concluded.

`research-log/` is that record. It is **gitignored on purpose** — a local
desk, not a published artifact. Two layers:

- **`research-log/notes/`** — the layer meant to be read. One short note per
  run, written by the agent *in its own voice* (see the `## Desk note`
  section both agent files end with: what it was asked, roughly what it
  looked at, whether anything conflicted, and its actual impression —
  whether the evidence felt thin, whether one claim was doing all the work,
  what it would chase next). The caller adds one line, `applied:`, saying
  what was actually done with it. That pairing is the whole point: an
  agent's impression sitting next to the action taken on it.
- **`research-log/runs/`** — the agent's full final message, verbatim, filed
  automatically by a `SubagentStop` hook (`.claude/settings.json`). The
  backstop, not the reading layer. It exists so a note can be checked
  against what the agent actually said.

Filing a note is part of applying a finding, not a separate chore:

```
node tools/desk.js file < note.md     # validates frontmatter, files it
node tools/desk.js list               # the desk, newest first
node tools/desk.js show <slug>        # one note in full
```

Frontmatter is flat `key: value` between `---` fences; `date`, `agent`,
`topic`, `asked` and `applied` are required and `file` refuses a note
missing any of them. The body is the agent's prose, pasted unedited — do
not summarize it, and do not paste the whole report in its place (`file`
warns when the body looks like a pasted report).

**Why the agent writes the note and the caller writes only the `applied:`
line.** The agents have no Write/Edit/Bash tool and must not get one — that
separation is the prompt-injection guard described above, and a logging
convenience is not worth reopening it. But the *impression* has to be the
agent's, because the caller did not do the research and a caller-written
summary of someone else's judgment is just a second-hand paraphrase. So the
agent writes it into its report, the hook archives the report verbatim, and
the caller copies the note across and appends what it did.

**The viewer.** `tools/desk-app/` is a small Electron app with two views.
**Notes** sifts the pile — search across topics, impressions and
dispositions, with the archived report one click away, newest first (by
`date`, then by filing time, since several runs routinely share a date).
**Coverage** is the roster of what is tracked versus what is publicly
reported to exist: one tab per operator, and inside it one table of every
site claimed to exist under that name — the tracked ones and the roster's
unvetted leads in the same table, each row carrying a confidence rating with
its citations as superscript numbers footnoted under the table. The two
ratings are deliberately not the same measure, and the group headings say
so: a tracked row is scored by `data/sources.js` from the evidence on file
(so it cannot disagree with the map), while a lead's high/medium grade is
only the roster compiler's read on whether the site is real at all. A lead's
status and capacity are sniffed out of its prose rather than recorded, and
are set in a lighter weight for that reason. Note the split in where the
numbers come from: the tracked counts are recomputed live from
`data/sites.js` on every read, so they cannot drift from the map, while the
leads are the hand-kept list and are explicitly *not* vetted. When the counts written into `COVERAGE.md`
disagree with the live ones the view says so rather than picking a winner,
and an operator that has never had a gap search gets its own row saying that
— an absent roster should look like an absent roster, not like zero work
outstanding.

It reuses the atlas's Nocturne tokens so the two read as one product; that
palette is a *copy*, not an import, so a change to `index.html`'s tokens
needs mirroring there.

```
cd tools/desk-app && npm install && npm start
```

For a desktop launcher, `npm run shortcut` puts a "Research Desk"
shortcut on the Desktop pointing straight at the bundled `electron.exe` (no
console window). It breaks if `node_modules` is reinstalled; re-run it then.

Electron is a dev dependency of that folder only — the deployed site still
has no package manager and no build step, and this does not change that.
`tools/desk-app/` can also be served as a plain static folder to check the
layout without booting Electron; `dev-preview.js` supplies obviously-labelled
sample notes in that case and does nothing at all inside the app.

The hook complains on stderr rather than failing quietly, including when an
agent returns no `## Desk note` section. An empty desk must never be
ambiguous between "no research ran" and "the log broke."

## Research cost

`.mcp.json` registers a small local MCP server (`.claude/mcp/openrouter/`)
holding two different kinds of research tool. Adding or changing this
server requires restarting the Claude Code session before it takes effect.

**`openrouter_ask`** delegates token-heavy legwork to a cheap model via
OpenRouter instead of running everything on the main model. Needs an
`OPENROUTER_API_KEY` in a local `.env` (see `.env.example`) — never commit
that key. It supports a `search` param (OpenRouter's web plugin) for live
lookups, not just reasoning over text handed to it. Model selection has
three levels: the per-call `model` param, then `OPENROUTER_DEFAULT_MODEL`
in `.env`, then a hardcoded fallback. Note that nothing currently passes
the per-call param, so the adversarial second pass described under Open
concerns is at present re-asking *the same model that made the error* —
pass a different `model` explicitly when re-checking a hard number, and
prefer a different model *family*, since two revisions of one model tend
to share their blind spots.

**Pin a specific model; never a floating alias.** The default was
`deepseek/deepseek-chat` for a long time, which is an alias that follows
whatever DeepSeek's current chat model is — OpenRouter's logs showed it
resolving to v2.5 on some runs and v3 on others. A research run that
can't say which model produced a claim can't be reproduced or blamed,
which matters here more than usual given the fabrication incident below.
Anything ending `-latest` floats the same way by design. As of Sep 2026
the default is `deepseek/deepseek-v4.1-flash`. Live pricing and exact
slugs come from `https://openrouter.ai/api/v1/models` (public, keyless) —
check it rather than going from memory, since the model list turns over
faster than any note written here.

**The structured feeds** (`edgar_search`, `peeringdb_facility`,
`epa_echo_facilities`) are the opposite kind of tool: no model is involved
at all, so a figure sourced through them cannot be fabricated. All three
are public, keyless, and read live — nothing is cached or stored. Prefer
them over `openrouter_ask` for anything a public record can settle. SEC
asks automated callers to identify themselves; set `SEC_USER_AGENT` in
`.env` to a real name and email.

Two behaviours of EPA ECHO worth knowing, both found by testing rather
than from their docs: its `p_naics` filter is effectively ignored
server-side (a 518210 query for North Dakota returns all 1,887 air
facilities in the state, so the tool filters again client-side), and
`get_qid` caps a page at 5,000 rows — Virginia has 10,268, so an
unpaginated call silently drops 39% of the state. The tool paginates and
states its coverage in the output; if that line says INCOMPLETE, treat a
negative result as inconclusive rather than as absence.

## Open concerns

- **`openrouter_ask` reliability**: in its first real research run (the
  CoreWeave site audit, Aug 2026), the cheap delegate model fabricated or
  overstated specifics with confident-sounding phrasing on its first pass
  for a couple of leads (a DataBank Chicago MW figure with no real basis,
  and a T5 Atlanta lease that a follow-up search couldn't substantiate at
  all). A second, more skeptical/adversarial `openrouter_ask` call
  correctly walked both claims back once asked to re-verify. Net: it's
  useful for casting a wide net and drafting cited claims fast, but every
  hard number or "is this real" claim still needs a second, skeptical pass
  before being trusted — treat its output as a draft, never as a finding,
  same as `research-agent.md` already instructs. Don't loosen that
  discipline just because delegation is now wired up.

## Sourcing roadmap

Stage 1 (Sep 2026) is done: source classes, per-field provenance, the
confidence engine, and the Method tab. The remaining stages, in the order
they're worth doing:

- **Stage 2 — the zero-friction feeds. Wired in Sep 2026, not yet used.**
  SEC EDGAR full-text search, EPA ECHO under NAICS 518210, and PeeringDB
  are now MCP tools (see Research cost above). Each alone can move entries
  from Medium to High, because each is a class the atlas has almost none
  of — as of this writing R=11, N=1, O=0 against T=44, G=26, P=16.
  The remaining work is the audit itself: 86 fields sit in
  `atlas.js due` under "never independently verified," and these tools are
  what that queue was waiting on. Note the agents can only reach them once
  their `tools:` frontmatter lists them.
- **Stage 3 — queues and permits.** ERCOT and the other ISO
  interconnection queues, state air permit dockets, county planning
  portals, and the European TSO connection registers. This is per-
  jurisdiction grind, so do it where the sites actually are rather than
  trying for coverage.
- **Stage 4 — observation.** Sentinel-2 checks on Planned and
  Under-construction entries. The cheapest possible answer to "is this real
  yet," and the only class that can contradict an operator outright.
- **`monitor-agent`.** The structural payoff of stages 2 and 3: an agent
  that diffs the structured feeds against `data/sites.js` and reports
  deltas unprompted, rather than waiting to be asked what's new. It is
  drawn on the Method tab's pipeline diagram as not-yet-built; remove the
  dashed styling there when it lands.
