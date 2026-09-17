# Coverage gaps

What's in `data/sites.js` for each of the atlas's operators, versus what's
publicly reported to exist. A worklist, not a data file — nothing here is
loaded by `index.html`. Check items off (`- [x]`) as they get researched
(via `research-agent`) and added to `data/sites.js`; re-run the gap search
periodically, since new campuses get announced faster than this list gets
updated.

This file is also the **Coverage** view in the research desk app
(`tools/desk-app/`), which is the easiest way to read it. The desk recomputes
the "tracked" column live from `data/sites.js` rather than trusting the
counts written below, and says so out loud when the two disagree — so a
stale roster shows up as a warning instead of as a wrong number.

Last compiled: 2026-09-14, via four parallel `research-agent` passes (one
per operator), each handed the exact tracked list below and asked to find
real, distinct, currently-missing facilities — not to re-verify what's
already tracked. Every candidate below is a discovery lead, not a vetted
entry: **none of it has been fact-checked to the atlas's sourcing standard
yet, and every single one currently sits on P/T/G evidence only** (the
operator's own announcement plus trade/general press repeating it) — under
`data/sources.js`'s confidence engine, that caps out at **Medium**, same as
most of the atlas. Each item notes the specific regulatory/network channel
that would lift it further. Treat this file as "where to point
research-agent next," not as ready-to-paste facts.

**Scope note on AWS:** AWS/Amazon Web Services operates 100+ data center
facilities globally across 30+ cloud regions. That entire footprint is
deliberately out of scope here — comparing against it would swamp this
list with routine AZ infrastructure and isn't what this atlas curates. AWS
gaps below are scoped the same way the nine tracked AWS entries already
are: individually newsworthy, large new-build campus announcements (a
named location, a disclosed multi-billion-dollar investment, its own press
cycle) — not the full global region footprint. As of 2026-09-16 this is a
decision made against a known alternative rather than an assumption: the
footprint *can* now be enumerated cheaply, and that was weighed and
declined. See "The enumeration question" under AWS below.

## Summary

| Operator | Tracked | Missing (high conf.) | Missing (medium conf.) | Watch-only / not actionable |
|---|---|---|---|---|
| CoreWeave | 24 | 3 | 5 | 4 |
| Nebius | 17 | 0 | 0 | 2 |
| AWS | 9 | 4 | 1 | 2 |
| SpaceXAI (xAI) | 3 | 1 | 1 | 2 |
| OpenAI | 1 | — | — | — |

---

## CoreWeave — 24 tracked

<details><summary>Currently tracked (click to expand)</summary>

Kristiansand NO (Bulk/N01) · Lancaster PA · Denton TX (Core Scientific) ·
Muskogee OK (Core Scientific) · Marble NC (Core Scientific) · Dalton GA
(Core Scientific) · Ellendale ND (Applied Digital/Polaris Forge 1) ·
Barcelona ES (MERLIN Edged) · Stockholm SE (Conapto) · Jakarta ID ·
Dickens County TX (Galaxy Digital/Helios) · Plano TX (Lincoln Rackhouse) ·
Austin TX (Core Scientific) · Cedar Creek TX (EdgeConneX) · Kenilworth NJ
(NEST) · Chester VA (Chirisa/CTP-01) · Hammond IN (Digital Crossroads) ·
Cheyenne WY (Related Digital) · Cambridge ON (Cohere/Related Digital) ·
North Lanarkshire UK (DataVita) · Hillsboro OR (Flexential) · Douglasville
GA (Flexential) · Las Vegas NV (Switch) · Weehawken NJ (LGA1)

</details>

### Missing — high confidence

- [ ] **Crawley, UK** (Digital Realty) — Operational since Oct 2024, CoreWeave's first UK site. [CoreWeave newsroom](https://www.coreweave.com/news/coreweave-announces-two-initial-data-centers-in-the-uk-are-now-operational) · [DCD](https://www.datacenterdynamics.com/en/news/coreweave-launches-first-two-uk-data-center-locations/)
- [ ] **London Docklands, UK** (Global Switch) — Operational since Dec 2024, CoreWeave's second UK site. Same source pair as Crawley.
- [ ] **Elk Grove Village, IL** (Prime Data Centers) — Under construction. 15-year lease, ~$2.2B lease revenue, tied to an $850M bond sale (Jun 2026). [Bloomberg](https://www.bloomberg.com/news/articles/2026-06-01/coreweave-tied-data-center-s-junk-bond-sale-seeks-850-million) · [Crain's Chicago Business](https://www.chicagobusiness.com/news/ccb-coreweave-bond-sale-elk-grove-20260602/)

### Missing — medium confidence

- [ ] **Calgary region (Rocky View County), AB, Canada** (eStruxture CAL-3) — Under construction, targeting H2 2026, 90MW Tier III. [eStruxture](https://www.estruxture.com/press-releases/estruxture-announces-coreweave-as-anchor-tenant-for-cal-3-its-landmark-ai-ready-facility-in-alberta) · [DCD](https://www.datacenterdynamics.com/en/news/coreweave-signs-on-as-tenant-of-estruxture-data-center-in-calgary-canada/)
- [ ] **Regina, SK, Canada** (Bell/BCE) — Planned, first phase H1 2027, CoreWeave securing 140MW of a 300MW campus. [Bloomberg](https://www.bloomberg.com/news/articles/2026-03-16/coreweave-bce-to-back-large-data-center-in-western-canada) · [Data Center Frontier](https://www.datacenterfrontier.com/machine-learning/article/55365248/coreweave-and-bell-canada-reset-ai-data-center-scale)
- [ ] **Volo, IL** (Chirisa Technology Parks) — Operational/commissioning ~Q3 2025, 14MW, Bloom Energy fuel cells. [Bloom Energy](https://www.bloomenergy.com/news/bloom-energy-and-coreweave-partner-to-revolutionize-ai-data-center-power-solutions/) · [Data Center Frontier](https://www.datacenterfrontier.com/energy/article/55127752/coreweave-chirisa-illinois-data-center-project-taps-bloom-energy-for-fuel-cell-power-leans-into-microgrids)
- [ ] **Falun, Sweden** (EcoDataCenter) — Operational since early 2025, NVIDIA Blackwell cluster. [DCD](https://www.datacenterdynamics.com/en/news/coreweave-to-deploy-nvidia-blackwell-gpu-clusters-at-ecodatacenter-in-sweden/)
- [ ] **Auburn, AL** ("AUBix", Core Scientific) — status unclear, ~16MW lease reported. Both citations found are DCD (same class) — confirm the Auburn/16MW link via a Core Scientific SEC 8-K before adding.

### Watch-only — investigated, not currently actionable

- **Calvert City, KY** (Core Scientific) — only appears in an aggregate facility-count list, no standalone CoreWeave-specific citation found.
- **Pecos, TX** (Core Scientific) — large campus, but current tenant unclear after a hyperscaler-exclusivity agreement reportedly expired; do not attribute to CoreWeave without a direct citation.
- **"DataBank" as a CoreWeave host** — asserted by a delegated draft pass, could not independently verify; treat as unconfirmed.
- **"CoreWeave US Central ORD1"** — a single directory (Baxtel) listing near Chicago, ambiguous vs. Elk Grove Village/Volo; needs a P/T source before it's a candidate.

---

## Nebius — 17 tracked

<details><summary>Currently tracked (click to expand)</summary>

Mäntsälä I &amp; II FI · Lappeenranta FI · Béthune FR · Longcross UK (Ark
DC) · Harlow UK (Kao Data) · Hüüru EE (Greenergy) · Vineland NJ (DataOne) ·
Modi'in IL (Mega DC) · Masmiyya IL (Mega DC) · Beit Shemesh IL (Mega DC) ·
Independence MO · Butler Twp/Highridge PA · Kansas City MO (Patmos KC2) ·
Keflavík IS (Verne) · Saint-Denis FR (Equinix PA10) · Newport GB (Vantage CWL1)

</details>

### Audit state (2026-09-16) — this operator's gap list is closed, its fields are not

The discovery side is done: no untracked Nebius facility turned up in this
pass. What remains is per-field verification, and it is uneven. Twelve
entries carry worked provenance blocks from the 2026-09-15 pass. Four do
not and are still unverified on every field — **Mäntsälä I, Mäntsälä II,
Longcross and Hüüru** — with PeeringDB searches for all four coming back
empty or matching a different operator entirely. That is the next Nebius
job, and it is a sourcing job, not a re-check.

Two standing re-checks, both flagged twice now without being closed:

- **Masmiyya and Beit Shemesh** — the Q3 2026 delivery window named in the
  Jan 2026 announcement has arrived and lapsed in silence. No follow-up
  reporting either way. The TASE/Maya immediate report is the lever that
  would settle it; a Hebrew-language pass is the cheapest route.
- **Béthune** — upgraded to Medium on 2026-09-16 with G-class
  corroboration, but a Géorisques query by commune, or an RTE
  connection-register entry, is what would make it High and give it a real
  parcel instead of a town-level coordinate.

### Missing — high confidence

- [x] **Independence, MO** ("Nebius Independence Campus") — Approved Mar 2026 (Chapter 100 incentive), ~400 acres up to 4 buildings, ~800MW power via a new dedicated plant. [Nebius](https://nebius.com/independencemo) · [DCD](https://www.datacenterdynamics.com/en/news/nebius-plans-800mw-data-center-campus-in-kansas-city-missouri/) · [City of Independence FAQ](https://www.independencemo.gov/data-center-faqs) *(quasi-regulatory, municipal page — worth checking if it counts as R)*
- [x] **Schuylkill County (Butler Twp), PA** ("Highridge Business Park AI Factory") — Land closed May 2026 ($187.5M), ~600 acres, 1.2GW full buildout, phase 1 (260MW) targeting Oct 2027. [Nebius factsheet (PDF)](https://assets.nebius.com/assets/6fdfadaf-20c9-4a67-a7c0-df1a5795ec90/Nebius%20Schuylkill%20County,%20PA%20Factsheet.pdf) · [DCD](https://www.datacenterdynamics.com/en/news/nebius-details-plans-for-12gw-data-center-campus-in-pennsylvania/)
- [x] **Kansas City, MO** (Patmos, former KC Star printing plant) — Operational since Q1 2025, Nebius's first US GPU cluster, 5MW expandable to 40MW. [Businesswire](https://www.businesswire.com/news/home/20241119926895/en/Patmos-Announces-Nebius-as-First-Tenant-in-New-Kansas-City-Data-Center) · [DCD](https://www.datacenterdynamics.com/en/news/nebius-to-deploy-5mw-nvidia-h200-cluster-at-patmos-data-center-in-kansas-city-missouri/)
- [x] **Modi'in, Israel** (Mega Or/Mega DC) — Operational since Oct 2025, 8MW, $300M facility. [Nebius newsroom](https://nebius.com/newsroom/nebius-brings-nvidia-blackwell-to-israel-with-one-of-the-country-s-first-ai-infrastructure-deployments) · [DCD](https://www.datacenterdynamics.com/en/news/first-phase-of-israels-nvidia-b200-powered-national-ai-supercomputer-goes-live/)
- [x] **Keflavik, Iceland** (Verne Global) — Operational since ~Mar 2025, 10MW within Verne's 140MW campus. [DCD](https://www.datacenterdynamics.com/en/news/nebius-to-build-300mw-data-center-in-new-jersey-will-launch-icelandic-colocation-deployment-in-q2-2025/) · [Verne Global](https://www.businesswire.com/news/home/20250311595160/en/Verne-Strikes-10MW-Deal-with-Nebius-to-Further-Expand-Europes-AI-Capacity)
- [x] **Paris (Saint-Denis), France** (Equinix PA10) — Live since Nov 2024. Distinct from the tracked Béthune greenfield campus. [Nebius blog](https://nebius.com/blog/posts/nebius-launches-gpu-cluster-in-paris-france) · [DCD](https://www.datacenterdynamics.com/en/news/nebius-deploys-ai-cluster-at-equinix-data-center-in-paris/)

- [x] **Newport, South Wales, UK** (Vantage Data Centers CWL1) — **new lead, found 2026-09-15 mid-sweep, not from the original gap search.** Vantage's own release names Nebius and ties the capacity to the Jun 2026 £1.7B UK commitment; deployment size explicitly undisclosed, built on Nvidia's DSX reference design. Dispatched to research-agent for vetting 2026-09-15.

### Missing — medium confidence

- [x] **Masmiyya, Israel** (Mega Or/Mega DC) — 22MW initial, delivery targeted Q3 2026; part of an $880M/80MW combined deal with Beit Shemesh below. [DCD](https://www.datacenterdynamics.com/en/news/nebius-signs-80mw-data-center-lease-with-mega-or-in-israel/)
- [x] **Beit Shemesh, Israel** (Mega Or/Mega DC) — 58MW initial, delivery staged Q3 2026–Q1 2027. Same deal as Masmiyya.

### Watch-only — investigated, not currently actionable

- **UK "three new NVIDIA deployments"** (Jun 2026, £1.7B/65MW across four UK sites total) — **two of three now identified** (2026-09-15): Harlow/Kao Data, already tracked, tied to the £1.7B figure by Kao's own release and local coverage; and Newport/Vantage CWL1, the new lead above. The THIRD remains genuinely unnamed. An anonymous X account asserts it is Green Mountain's LON-East campus in Romford, but DCD's own reporting on that same Green Mountain deal calls the customer an "unnamed neocloud operator" — that is U-class and unusable. Do not close this gap by inference from the 65MW arithmetic.
- **Meta $27B deal ($12B dedicated capacity)** — no specific facility named; likely draws on Independence MO/Highridge PA rather than being its own site.

---

## AWS — 9 tracked

<details><summary>Currently tracked (click to expand)</summary>

Gilroy CA · Santa Clara CA (Mission College) · Walla Walla County WA
(Advance Phase LLC) · Shreveport LA (Resilient Technology Park/STACK) ·
Boling TX (Project Eagle) · Vicksburg MS (Warren County) · New Carlisle IN
(Project Rainier) · Fairless Hills PA (PNE100) · Canton MS (Madison Mega
Site)

</details>

### The enumeration question — answered 2026-09-16

A scoping run asked whether any source *lists* AWS's facilities rather than
reporting them one announcement at a time. One does, and it was already
wired up and unused: **EPA ECHO under NAICS 518210, queried state by
state.** It returns facilities named `AMAZON DATA SERVICES INC <code>` with
street address, coordinates and an operating-status field — R-class, filed
under legal obligation. Virginia alone returned 30+ named Amazon buildings
carrying AWS's own internal facility codes (`IAD-nnn`).

Two limits worth knowing before trusting a negative: it only catches a site
once an air permit exists, so genuinely early projects are invisible and
their absence means nothing; and some campuses don't carry "Amazon" in the
permittee name at all — Ohio's New Albany cluster files as `CMH050`,
`CMH051`, etc. A full sweep needs a dictionary of AWS's site-code prefixes
(`IAD`, `ATL`, `CMH`, `PNE`, `SAT`…) matched against permittee strings.

Everything else was dry for this operator: PeeringDB is near-silent (owned
campuses run private backbone, not public peering — which is itself a weak
negative signal for a single-tenant site), EDGAR has no site-level property
disclosures from Amazon, AWS's own infrastructure pages are logical-only
with no addresses, and the directories claiming 353–477 "AWS data centers"
are counting colocation cages with no ownership-vs-tenancy flag.

**Scope decision (2026-09-16): the named-campus line stays.** A full 50-state
sweep would surface most of the US footprint — realistically 50–150
address-level records, about a day of scripted queries — and was
deliberately declined, because it would fill the atlas with Ashburn-style
AZ buildings that have no announcement, no name and no capacity figure, and
would make AWS dominate the map. ECHO is instead used here as a
*verification* channel: a way to lift existing entries from the operator's
word to independently verified, which is what the three additions above
are. If that line is ever revisited, the scoping run proposed a mechanical
test to replace the editorial one: does this site have its own regulatory
or utility record distinct from the region's routine buildout, plus its own
named investment figure.

### Missing — high confidence

- [ ] **Montgomery County (New Florence), MO** ("Project Green") — Planned, announced Jun 2026, $10B, 1,000 acres / 8 buildings phase 1. **ECHO searched 2026-09-16: not found.** Complete statewide scan, 7 MO facilities under NAICS 518210, no INCOMPLETE flag, all Kansas City-area and none named Amazon — consistent with no permit filed yet for an announcement this recent. [PR Newswire](https://www.prnewswire.com/news-releases/amazon-selects-missouri-for-10-billion-data-center-campus-302800859.html) · [DCD](https://www.datacenterdynamics.com/en/news/amazon-commits-10bn-to-data-center-campus-in-montgomery-city-missouri/)
- [ ] **Salem Township, Luzerne County, PA** ("Salem Township Innovation Campus") — Planned, announced Jun 2025, part of a $20B PA commitment, sited beside the Susquehanna nuclear plant. Note: a FERC ruling blocked a proposed co-location power deal here (Apr 2025) — that docket is a genuine R-class record worth pulling directly. **ECHO searched 2026-09-16: not found.** Complete statewide scan, 17 PA facilities under NAICS 518210, no INCOMPLETE flag, nothing in Luzerne County — consistent with no air permit filed yet, which is what an early-stage project looks like. Not evidence against the project. [aboutamazon.com](https://www.aboutamazon.com/news/aws/amazon-pennsylvania-investment-cloud-infrastructure-ai-innovation) · [DCD](https://www.datacenterdynamics.com/en/news/amazon-to-invest-20bn-in-data-centers-in-pennsylvania/)
- [x] **Falls Township, Bucks County, PA** — **added 2026-09-16 as `aws-fairlesshills`**, off an EPA ECHO record (`AMAZON DATA SVCS INC PNE100`, 600 Ben Fairless Dr, status Operating). One caveat carried into the entry's notes rather than resolved: the record says Operating while this lead said Planned, and ECHO carries no permit date, so whether this is the announced campus matured or a distinct earlier AWS building in the same park is undetermined. Fetching the Jun 2025 announcement to check for a second address or PNE code would settle it. [Philadelphia Inquirer](https://www.inquirer.com/business/amazon-data-centers-pennsylvania-20250609.html)
- [x] **Madison County, MS** — **added 2026-09-16 as `aws-madison-ms`** (Madison Mega Site, 1978 Highway 22, Canton), off an EPA ECHO record that is the *only* source connecting Amazon to that parcel. The citations below plausibly describe it but were not verified against it, so they are not carried on the entry. A "Project Rainier's second campus" framing that surfaced during research was retracted as a search-synthesis artefact — do not reinstate it without a source someone has read. [DCD](https://www.datacenterdynamics.com/en/news/aws-scales-up-investment-commitment-for-mississippi-data-centers-to-25bn/) · [governor's office](https://governorreeves.ms.gov/amazon-continues-mississippi-expansion-announcing-plans-to-invest-a-total-of-25-billion-across-the-magnolia-state/)
- [ ] **Blanchard (Caddo Parish), LA** — Planned, part of a $12B northwest-LA announcement (Feb 2026) explicitly separate from the already-tracked Shreveport/Resilient Tech Park campus — three total NW Louisiana campuses, only one tracked. No branded project name found, sited at Blanchard Latex Rd &amp; State Line Rd. **ECHO searched 2026-09-16: not found**, and this one is a genuine complete-coverage negative — all 13,842 Louisiana air facilities scanned, zero under NAICS 518210 statewide, no INCOMPLETE flag. Local coverage (KSLA) across seven months says the project is real and active, with the Caddo Parish Commission still debating a construction pause as of Sep 2026, so read this as 'not yet permitted', not 'not real'. [aboutamazon.com](https://www.aboutamazon.com/news/company-news/amazon-data-center-louisiana-new-jobs) · [KSLA](https://www.ksla.com/2026/02/24/campuses-newly-announced-amazon-data-center-spanning-bossier-caddo-parishes-confirmed/)
- [ ] **Benton (Bossier Parish), LA** — Planned, second site in the same NW Louisiana announcement, west side of Hwy 3 ~5mi north of Benton. Same sourcing as Blanchard, and covered by the same complete-coverage ECHO negative — see above.

### Missing — medium confidence

- [ ] **Hinds County, MS** (former Delphi plant conversion) — Planned, $1B, part of the same Jun 2026 $25B MS rollup as Madison County — thinner sourcing (P + one T only, no independent local coverage found), needs its own search pass before treating as settled. [aboutamazon.com](https://www.aboutamazon.com/news/company-news/amazon-25-billion-mississippi-data-centers)

### Needs re-verification (not a new site)

- **`aws-vicksburg`** — a Nov 2025 Mississippi Today / aboutamazon story cites "$3 billion... Warren County... next-generation data center campus," which looks like the same tracked site but should be diffed against what's currently on file (investment figure, framing) rather than assumed identical.

### Watch-only — investigated, not in scope as stated

- **AWS European Sovereign Cloud (Brandenburg, Germany)** — a multi-AZ regional program (€7.8B→€8.8B), not a single named campus; same category the AWS scope note above excludes. Flagging as a scope question, not a sourcing gap.
- **AWS Saudi Arabia cloud region** ($5.3B, targeted 2026) — no named campus/site found, just "a cloud region in Saudi Arabia" — doesn't meet the named-location bar.

---

## SpaceXAI (xAI/Colossus) — 3 tracked

<details><summary>Currently tracked (click to expand)</summary>

Colossus 1, Memphis TN · Colossus 2, Memphis TN · Colossus 3
("Macrohardrr"), Southaven MS

</details>

### Missing — high confidence

- [ ] **Colossus 4 / "Minihard", Memphis TN** (5414 Tulane Road) — Under construction, $659.3M building permit filed Mar 2026 (Shelby County), 312,000 sq ft, 4 stories. Distinct from the tracked Southaven/Macrohardrr building. [DCD](https://www.datacenterdynamics.com/en/news/musk-confirms-fourth-spacexai-data-center-in-memphis-company-starts-removing-illegal-gas-turbines/) · [Action News 5 (cites the county permit filing)](https://www.actionnews5.com/2026/03/03/xai-files-permit-659m-expansion-colossus-2-site/)

### Missing — medium confidence

- [ ] **Saudi Arabia (xAI/HUMAIN partnership)** — Planned/announced framework (~Nov 2025), 500MW+, exact site (Riyadh/Dammam candidates) not yet disclosed. An independent July 2026 audit of 13 Saudi/UAE AI data center projects found **zero MW confirmed energized with public documentation** — treat as aspirational, not built. [NBC News](https://www.nbcnews.com/tech/tech-news/elon-musk-announces-massive-xai-data-center-saudi-arabia-x-rcna244804) · [DCD](https://www.datacenterdynamics.com/en/news/xai-humain-data-center-elon-musk/)

### Watch-only — investigated, not currently actionable

- **Texas gigawatt-scale campus** — reported by The Information (paywalled), scouting stage only; job listings in Austin/Bastrop/Conroe but no site, permit, or ERCOT filing found. Re-check the ERCOT large-load queue in ~60–90 days.
- **UAE (G42 contact)** — a single vague mention of "exploring" data center opportunities with G42; no location, partner agreement, or capacity figure. Not a candidate, noted only so it isn't re-discovered from scratch.

---

## OpenAI — 1 tracked

<details><summary>Currently tracked (click to expand)</summary>

Effingham County GA (Project Camellia)

</details>

**No gap search has been run for this operator yet.** OpenAI was added on
2026-09-15 off a single-site vetting run, not the four-provider sweep that
produced everything above, so the missing/watch sections below every other
operator simply don't exist here. That is a real hole in the roster, not an
indication that OpenAI has nothing outstanding.

Two things make the sweep unusually worth doing, and unusually easy to get
wrong:

- Almost every facility publicly described as "OpenAI's" is owned by
  somebody else — Oracle, Crusoe, SB Energy, Vantage, Related Digital — with
  OpenAI as tenant or offtaker. Those belong in this atlas under the owner's
  name, if at all, with OpenAI named as a customer in `notes`. A gap search
  that takes headlines at face value will produce a list of sites that are
  not OpenAI's.
- The one genuinely self-developed campus found so far (Project Camellia) is
  built through an affiliate, Octans GA LLC, not under the OpenAI name. Other
  self-builds would likely be structured the same way, so searching for
  "OpenAI" alone will miss them — search the affiliate-style project names
  and the county economic-development records too.

### Missing — high confidence

_(none identified — no sweep run)_

---

## How to use this

1. Pick an unchecked item.
2. Hand it to `research-agent` for proper vetting (source classing,
   cross-class corroboration, a pasteable `provenance` block) — everything
   above is a discovery lead, not vetted evidence.
2. Add it to `data/sites.js` following the sourcing standard in that
   file's header comment, check the box here, and update the Summary table.
3. Re-run the per-provider gap search every month or two — new campuses
   get announced faster than this file gets updated by hand.
