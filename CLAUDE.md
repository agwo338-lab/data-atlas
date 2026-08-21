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
- No package manager, no build step, no framework. Anyone editing this
  should keep it that way unless there's a real reason to add tooling.

## Workflow

- Live site: deployed on Vercel, connected to this repo's `main` branch.
  Pushing to `main` auto-deploys — no manual deploy step.
- To preview locally before pushing, serve the folder with any static file
  server (e.g. `npx serve .`) rather than opening `index.html` directly via
  `file://`, since the map fetches data over HTTP.
- Commit messages are the project's changelog — write them to actually
  describe what changed, since there's no separate log kept anywhere else.

## Data quality

Some entries are marked for periodic re-verification rather than treated as
permanently accurate — check individual entries' `notes` in `data/sites.js`
for anything flagged that way before relying on a number. When adding a new
operator or site, follow the sourcing standard already documented at the
top of that file rather than re-deriving one.
