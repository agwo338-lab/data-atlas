# Site Atlas

A personal, interactive world-map reference for tracking data center sites —
who operates them, where they are, their build status, and disclosed
capacity. Built as a single static site with no backend and no build step.

## Stack

- `index.html` — the entire app: markup, CSS, and JS in one file. Renders a
  world map (MapLibre GL JS + CARTO's Dark Matter vector basemap, both from
  a public CDN, no API key currently required), a provider dashboard, a
  detail panel, a site table, and a Sources tab. Site markers are plain DOM
  elements handed to MapLibre — it repositions them on pan/zoom itself, so
  there's no custom per-frame transform code to maintain. (Previously a
  hand-rolled D3 + SVG + topojson map; replaced because SVG's per-frame
  re-rasterization of complex coastline geometry made pan/zoom sluggish in
  a way that survived several rounds of targeted optimization — a GPU-vector
  tile basemap solves that class of problem architecturally instead.)
- `data/sites.js` — all site data, loaded by `index.html` as a plain script.
  This is the file that needs the most regular edits. Its header comment
  documents the field schema and the sourcing standard (how sources are
  tiered, what needs verification, when to recheck). Follow that standard
  whenever adding or updating an entry.
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
- The site itself (`index.html`, `data/sites.js`) has no package manager, no
  build step, no framework — keep it that way. The one exception is
  `.claude/mcp/openrouter/`, a small local tool with its own `package.json`;
  that's internal tooling, not part of the deployed site.

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

Some entries are marked for periodic re-verification rather than treated as
permanently accurate — check individual entries' `notes` in `data/sites.js`
for anything flagged that way before relying on a number. When adding a new
operator or site, follow the sourcing standard already documented at the
top of that file rather than re-deriving one.

A `research-agent` subagent (`.claude/agents/research-agent.md`) handles
research on request — vetting a new candidate, re-checking one entry or
provider, or auditing the whole dataset — against a rigorous sourcing
methodology (source grading, corroboration rules, conflict handling). It's
research-only and can't edit files itself.

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
**High-confidence** finding (research-agent's own scale — 2+ independent
A/B sources agreeing, at least one recent) gets applied to the relevant
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
