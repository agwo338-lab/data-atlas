---
description: Re-verify existing Site Atlas claims against current public sources via research-agent, to catch drift/staleness. High-confidence findings are applied and pushed automatically; anything less needs the user's call.
argument-hint: [scope] — e.g. "partnerships", "CoreWeave partnerships", "sites", a provider name. Defaults to every partner entry in data/providers.js.
---

Reconcile: this project's data doesn't know when the real-world facts it
records have moved on. This command re-checks claims *already recorded*
in the data files against current public sources, to catch anything
that's changed, been superseded, or quietly gone stale — as opposed to
`research-agent`'s more common use of vetting something new. Distinct
from `news-agent`, which looks for *new* developments — this looks
backward at what's already written down and asks "is this still true."

## Scope

Argument passed: $ARGUMENTS

- Empty → default scope is every partner entry across every provider in
  `data/providers.js`.
- A provider name (e.g. "CoreWeave") → that provider's partner entries
  only (still from `data/providers.js`).
- "partnerships" → same as the empty default, stated explicitly.
- "sites" → every entry in `data/sites.js` instead (a full re-audit —
  same territory research-agent already covers for that file; use this
  when asked to reconcile sites specifically, not by default).
- Anything else → interpret it as best fits (e.g. a specific site id, a
  specific claim) and scope accordingly; when genuinely ambiguous, ask
  rather than guessing the scope.

## Steps

1. Gather the exact existing claims to check — current value,
   `since`/`lastUpdated` date, and the sources already on file for each.

   For site scopes, use the CLI rather than reading `data/sites.js` whole:

   - `node tools/atlas.js due` — the audit queue, split into **overdue
     re-checks** (evidence aged past its window) and **never independently
     verified** (operator's word only, which more press will never fix).
     Default to working this list rather than the whole dataset: auditing
     everything is what makes cost scale with the site count instead of
     with actual drift.
   - `node tools/atlas.js index [--provider X]` — one terse line per site
     with a per-field verdict, for settling what's in scope.
   - `node tools/atlas.js show <id> …` — full detail, every piece of
     evidence, for just the entries you settled on.

   Pass the relevant slice of that output to `research-agent` in its prompt.
   It has no Bash tool and cannot run the CLI itself — deliberately, since a
   shell would give it a write path — so it depends on you for the index.

   For `data/providers.js` partner scopes, read that file directly; it's
   small.
2. Dispatch to the `research-agent` subagent (not `news-agent` — this is
   per-claim fact verification against research-agent's tiered-sourcing
   and corroboration methodology, not headline curation). Hand it the
   concrete list of existing claims to re-check, phrased as one
   verification target per item (e.g. "Verify whether the Nebius–Microsoft
   compute deal disclosed 2025-09-08 — up to $19.4B — is still accurate;
   check for restructuring, cancellation, expansion, or updated figures
   since.").
3. research-agent reports back per claim: confirmed / changed / could not
   verify / conflicting sources, with confidence and sources, same format
   it already uses.
4. Split the findings by confidence (per CLAUDE.md's auto-apply policy):
   - **High confidence** (confirmed or changed) → apply directly: edit
     `data/providers.js` (or `data/sites.js`), update `lastUpdated`/
     `since` and `sources` to reflect the re-verification, commit with a
     message describing what changed and why, and push — no pause to ask
     first.
   - **Medium, Low, conflicting, or unverifiable** → do not touch the
     data file. Present these to the user plainly and wait for their call
     on which (if any) to apply.
5. Summarize what happened either way: what was auto-applied and pushed,
   and what's still waiting on a decision.
