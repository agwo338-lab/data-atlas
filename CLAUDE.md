# Site Atlas

A personal, interactive world-map reference for tracking data center sites —
who operates them, where they are, their build status, and disclosed
capacity. Built as a single static site with no backend and no build step.

## Stack

- `index.html` — the entire app: markup, CSS, and JS in one file. Renders a
  world map (D3 + real coastline data, fetched from a public CDN at load
  time), a detail panel, a site table, and a Sources tab.
- `data/sites.js` — all site data, loaded by `index.html` as a plain script.
  This is the only file that should need regular edits. Its header comment
  documents the field schema and the sourcing standard (how sources are
  tiered, what needs verification, when to recheck). Follow that standard
  whenever adding or updating an entry.
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
  code anyway. This doesn't relax the research-findings review step below:
  for `data/sites.js`, still get the user's call on *which* findings to
  apply before editing — but once applied, push those immediately too.

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
research-only and can't edit files, so findings still need to be reviewed
and applied deliberately.

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
