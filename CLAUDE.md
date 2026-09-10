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
  code anyway. This extends to research findings too, with one condition:
  see the auto-apply policy in Data quality below — High-confidence
  findings from research-agent, news-agent, or `/reconcile` get applied
  and pushed automatically; anything less than High confidence still
  needs the user's call before it's touched.

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
hover-revealed dot beside it. As of Sep 2026, 92 of 108 scored fields across
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

**Auto-apply policy (added Aug 2026):** all three of the above are
research-only — none of them can edit a file themselves, by design (no
Write/Edit tool). What changed is what happens to their report next: a
**High-confidence** finding (the source-class scale in Data quality above —
2+ distinct classes, at least one of them independent, and current, which
as of Sep 2026 is a materially harder bar than the A/B-source rule this
policy was originally written against) gets applied to the relevant
data file and pushed automatically, no pause to ask first. Anything
Medium confidence, Low confidence, conflicting, or unverifiable still gets
surfaced for the user's own call before it's touched — that half of the
review gate stays in place, specifically because it's what caught two
fabricated/overstated claims in the `openrouter_ask` incident below. When
auto-applying, still update `lastUpdated`/`since` and `sources` to reflect
the re-verification, and write a commit message describing what changed
and why, same as any other data edit.

## Research cost

`.mcp.json` registers a small local MCP server (`.claude/mcp/openrouter/`)
that exposes an `openrouter_ask` tool, letting research delegate its
token-heavy legwork to a cheap model via OpenRouter instead of running
everything on the main model. Needs an `OPENROUTER_API_KEY` in a local
`.env` (see `.env.example`) — never commit that key. Adding or changing
this MCP server requires restarting the Claude Code session before it
takes effect. `openrouter_ask` supports a `search` param (OpenRouter's web
plugin) for live lookups, not just reasoning over text handed to it.

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

- **Stage 2 — the zero-friction feeds.** Wire in the three sources that
  need no scraping and no key: SEC EDGAR full-text search, EPA ECHO/FRS
  under NAICS 518210, and PeeringDB. Each of these alone can move entries
  from Medium to High, because each is a class the atlas currently has
  almost none of.
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
