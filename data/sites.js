// Site Atlas — data file
//
// This is the only file you should need to edit to keep your map up to date.
// Each entry is one facility. Fields:
//   id           unique short slug, no spaces (used internally, never shown)
//   provider     company/operator name — new names are picked up automatically,
//                no other file needs to change when you add a new one
//   site         the facility's own name/label, if it has one (else leave "")
//   city, country
//   lat, lon     decimal degrees
//   status       "Operational" | "Under construction" | "Planned"
//   capacityMW   disclosed power capacity in megawatts, or null if not public
//   lastUpdated  "YYYY-MM-DD" — the last time you checked this entry was still accurate
//   sources      array of { label, url } — every claim above should trace to one
//                of these. A source may optionally carry
//                cls: "R"|"N"|"O"|"P"|"T"|"G"|"D"|"U" to pin its source class;
//                without one, data/sources.js infers the class from the host.
//   notes        your own free-text notes — anything you want to remember
//   provenance   OPTIONAL. Per-field evidence — see PER-FIELD PROVENANCE below.
//
// ---------------------------------------------------------------------------
// PER-FIELD PROVENANCE (added Sep 2026)
//
// The `sources` array above is per-ENTRY: it says "these are the citations
// for this site" without saying which citation backs which fact. That hides
// the thing you actually want to know — an entry can have a rock-solid
// address and a completely speculative capacity figure, and a flat array
// makes those two look identical.
//
// The optional `provenance` block fixes that by attaching evidence to
// individual fields:
//
//   provenance: {
//     capacityMW: {
//       basis: "disclosed",        // disclosed | derived | observed | estimated
//       asOf: "2026-08-23",        // when this field was last verified
//       evidence: [
//         { source: 0, cls: "G", note: "why this source supports this field" },
//         { source: 1, cls: "T" }
//       ],
//       conflicting: false         // true when sources genuinely disagree
//     },
//     status: { ... },
//     location: { ... }
//   }
//
// `source: 0` is an index into this entry's own `sources` array, so a URL is
// never repeated. `cls` may be omitted and will be inferred. The three fields
// scored are `capacityMW`, `status`, and `location` (lat/lon).
//
// `basis` matters: a capacity figure worked out from an air permit's diesel
// generator nameplate is a legitimate number, but it is NOT a disclosed one,
// and the map labels it accordingly. Never mark a derived figure "disclosed".
//
// The block is OPTIONAL and entries without one still work — data/sources.js
// falls back to treating every source on the entry as evidence for every
// field, which is the assumption the atlas ran on implicitly anyway. Add a
// real provenance block whenever an entry gets researched or re-verified.
// See `aws-santaclara` below for a worked example.
//
// HOW CONFIDENCE IS COMPUTED — and why the bar moved.
//
// The old rule was "2+ independent Tier 1/Tier 2 sources agree." That rule
// was broken, because trade press is not independent of the operator: DCD
// and Data Center Frontier writing up the same press release is one source
// counted twice. Corroboration is now measured across SOURCE CLASSES:
//
//   R regulatory record    permits, grid queues, SEC filings, planning dockets
//   N network telemetry    PeeringDB, cloud region metadata, BGP, OSM
//   O direct observation   satellite imagery, site-specific hiring signals
//   P primary corporate    the operator's own newsroom / investor relations
//   T trade press          DCD, DCF, Datacentre Magazine
//   G general press        business, financial, local outlets
//   D directory            Baxtel, datacenters.com, Wikipedia — never a number
//   U unattributed         never a basis for anything
//
// R, N and O are "independent" — produced by someone with no stake in the
// announcement. P, T and G are promotional or derivative of it. High
// confidence now requires two distinct classes AND at least one independent
// class AND recency. data/sources.js holds the exact rules and the per-field
// staleness windows.
//
// Expect most existing entries to read Medium rather than High under this.
// That is accurate, not a regression: the atlas is currently built almost
// entirely on trade press restating operator announcements.
//
// ---------------------------------------------------------------------------
// SOURCING STANDARDS — the checklist to follow every time a site is added
// or re-verified. Keeping this next to the data (not in a separate doc)
// means it's the first thing either of us sees when editing an entry.
//
// 1. Prefer sources in this order, and note which tier you used:
//      Tier 1 — primary: the operator's own newsroom, press release,
//               regulatory filing, or investor disclosure.
//      Tier 2 — named trade press with a byline and date (e.g. Data Center
//               Dynamics, Data Center Frontier) — the industry-standard beat.
//      Tier 3 — directories/aggregators (e.g. Baxtel, datacenters.com) —
//               fine for basic facts (a site exists, its city) but should
//               not be the *only* source for a specific hard number.
//      Avoid  — unattributed blogs, forums, social posts, anything without
//               a clear author, publication, and date.
// 2. Every entry needs at least one source. Any disclosed hard number
//    (MW, $ investment, a date) should trace to Tier 1 or Tier 2. For
//    "independent," use the source-class test above, not the tier: two
//    outlets covering the same press release are one source, not two.
// 3. Set lastUpdated to the day you actually verified the fact, not just
//    when you typed the entry.
// 4. "Planned" and "Under construction" entries change fastest — re-check
//    those roughly every 6 months, or sooner if you see it referenced
//    elsewhere with different numbers.
// 5. If a claim can't be sourced, leave the field null/empty rather than
//    guessing — "Not disclosed" is honest, a fabricated number isn't.
// ---------------------------------------------------------------------------

var SITES = [
  {
    id: "nebius-mantsala-i",
    provider: "Nebius",
    site: "Mäntsälä I",
    city: "Mäntsälä",
    country: "Finland",
    lat: 60.6317,
    lon: 25.3200,
    status: "Operational",
    capacityMW: 75,
    lastUpdated: "2026-08-21",
    sources: [
      { label: "Nebius newsroom, Oct 2024", url: "https://nebius.com/newsroom/nebius-to-triple-capacity-at-finland-data-center-to-75-mw" },
      { label: "Data Center Dynamics, Aug 2026", url: "https://www.datacenterdynamics.com/en/news/nebius-expands-european-presence-announces-deployment-in-estonia-and-second-data-center-in-m%C3%A4nts%C3%A4l%C3%A4-finland/" }
    ],
    notes: "Nebius's original flagship European site (inherited from Yandex). Capacity figure is the tripling target announced Oct 2024 (25MW → 75MW) — not independently reconfirmed as fully complete. See nebius-mantsala-ii for the separate, newly-announced second facility on the same campus."
  },
  {
    id: "nebius-mantsala-ii",
    provider: "Nebius",
    site: "Mäntsälä II",
    city: "Mäntsälä",
    country: "Finland",
    lat: 60.6317,
    lon: 25.3200,
    status: "Planned",
    capacityMW: 70,
    lastUpdated: "2026-08-21",
    sources: [
      { label: "Data Center Dynamics, Aug 2026", url: "https://www.datacenterdynamics.com/en/news/nebius-expands-european-presence-announces-deployment-in-estonia-and-second-data-center-in-m%C3%A4nts%C3%A4l%C3%A4-finland/" }
    ],
    notes: "Newly announced second facility on the Mäntsälä campus, distinct from Mäntsälä I; up to 70MW, first capacity targeted 2027. Together with Mäntsälä I (75MW) and Lappeenranta (310MW), brings Nebius's disclosed Finland total to 455MW."
  },
  {
    id: "nebius-lappeenranta",
    provider: "Nebius",
    site: "Lappeenranta AI Factory",
    city: "Lappeenranta",
    country: "Finland",
    lat: 61.0587,
    lon: 28.1887,
    status: "Under construction",
    capacityMW: 310,
    lastUpdated: "2026-09-15",
    sources: [
      { label: "Nebius newsroom, Mar 2026", url: "https://nebius.com/newsroom/nebius-to-construct-310-mw-ai-factory-in-finland" },
      { label: "Finnish AI Region, Apr 2026", url: "https://www.fairedih.fi/en/2026/04/14/nebius-plans-e8-5-billion-data-centre-in-lappeenranta-cementing-finland-as-its-european-base/" },
      { label: "Polarnode newsroom, May 2026", url: "https://www.polarnode.fi/polarnode-begins-pre-construction-works-for-the-lappeenranta-data-center-project/", cls: "P" },
      { label: "City of Lappeenranta — Pajarila data center (project page)", url: "https://lappeenranta.fi/en/decision-making-and-administration/pajarila-data-center", cls: "R" },
      { label: "City of Lappeenranta — Pajarila data center FAQ", url: "https://lappeenranta.fi/en/decision-making-and-administration/pajarila-data-center/frequently-asked-questions", cls: "R" },
      { label: "Yle — building permit granted, covers 60MW, Jan 2026", url: "https://yle.fi/a/74-20206812", cls: "T" },
      { label: "Yle — second permit needed to exceed 300MW", url: "https://yle.fi/a/74-20206370", cls: "T" },
      { label: "Etelä-Saimaa — site clearing underway, Mar 2026", url: "https://www.esaimaa.fi/paikalliset/9342174", cls: "G" }
    ],
    provenance: {
      capacityMW: {
        basis: "disclosed",
        asOf: "2026-05-01",
        evidence: [
          { source: 0, cls: "P", note: "Nebius newsroom announces the 310MW target." },
          { source: 1, cls: "G", note: "Repeats the €8.5B / 310MW figures." },
          { source: 5, cls: "T", note: "Reports the granted building permit covers only 60MW — so 310MW is a stated multi-phase ambition, not a permitted figure." }
        ]
      },
      status: {
        basis: "disclosed",
        asOf: "2026-04-14",
        evidence: [
          { source: 3, cls: "R", note: "City of Lappeenranta's own project page: 60-year land lease over two plots (41ha) to Polarnode, permit granted, construction beginning spring 2026." },
          { source: 4, cls: "R", note: "City FAQ states Polarnode is project developer and Nebius operates the facility — settles who builds versus who runs it." },
          { source: 5, cls: "T", note: "Building committee granted the construction permit 2026-01-28." },
          { source: 7, cls: "G", note: "Site clearing underway as of Mar 2026." }
        ]
      },
      location: {
        basis: "estimated",
        asOf: "2026-09-15",
        evidence: [
          { source: 3, cls: "R", note: "City page places the site on Kettukuja in the Pajarila district, south of Highway 6, inside the confirmed Pajarilanväylä vaihe 1 / Pajarilan teollisuusalue zoning plans. The stored lat/lon is still Lappeenranta city centre, ~5km off — basis stays 'estimated' until a parcel-level fix is pulled from kartta.lappeenranta.fi or the asemakaava PDF." }
        ]
      }
    },
    notes: "Re-verified 2026-09-15. The \"confirmed by the City of Lappeenranta's own site\" claim that previously sat in these notes with no citation behind it checks out — the city runs a project page and an FAQ for this site, and both are now cited as R-class records. They also settle the roles: Polarnode is developer and landholder (60-year lease from the city, signed 2025), Nebius operates. CAPACITY CAVEAT: the building permit granted by Lappeenranta's rakennuslautakunta on 2026-01-28 covers only 60MW; Polarnode has stated intent to seek a second permit to exceed 300MW, but that permit is not yet granted as of Sep 2026. So 310MW is a multi-phase target, not an approved figure — trade coverage does not draw this distinction. LOCATION: the stored pin is Lappeenranta city centre/harbour; every source places the site in Pajarila, roughly 5km south. Not corrected here because the only coordinate found for Pajarila was a Wikipedia district centroid (D-class), which is not good enough to overwrite a pin with. Searched without result: EDGAR full-text for \"Lappeenranta\" and \"Nebius Finland\" (no hits); PeeringDB (no facility — site is pre-operational); Fingrid's connection queue for a signed capacity figure (only secondary press discussion found). Not chased: YTJ/Finnish Trade Register for the Polarnode entity. Reclassified polarnode.fi from G to P — it is the developer's own newsroom, not press."
  },
  {
    id: "nebius-bethune",
    provider: "Nebius",
    site: "",
    city: "Béthune",
    country: "France",
    lat: 50.5300,
    lon: 2.6400,
    status: "Under construction",
    capacityMW: 240,
    lastUpdated: "2026-08-21",
    sources: [
      { label: "Data Center Dynamics — \"Nebius plans 240MW data center in Béthune, France\"", url: "https://www.datacenterdynamics.com/en/news/nebius-plans-240mw-data-center-in-b%C3%A9thune-france/" }
    ],
    notes: "Former Bridgestone tire-plant site; ~€1.5B investment. 240MW is the disclosed full-buildout target (2027/28), phased from an initial ~27MW ramping to ~120MW in 2026. Previous source citation (a Mäntsälä/Estonia roundup article that never mentions Béthune) was a copy-paste error — corrected."
  },
  {
    id: "nebius-london",
    provider: "Nebius",
    site: "Ark DC — Longcross Park",
    city: "Longcross",
    country: "United Kingdom",
    lat: 51.3818,
    lon: -0.5928,
    status: "Operational",
    capacityMW: 16,
    lastUpdated: "2026-08-21",
    sources: [
      { label: "Ark Data Centres newsroom", url: "https://www.ark-d-c.com/insights/ark-data-centres-collaborates-with-nebius" },
      { label: "Data Center Dynamics", url: "https://www.datacenterdynamics.com/en/news/nebius-launches-nvidia-gpu-cluster-in-london-uk/" },
      { label: "Data Center Dynamics, Jun 2026 — Ark expansion", url: "https://www.datacenterdynamics.com/en/news/ark-dc-to-add-new-building-to-longcross-data-center-campus-outside-london-uk/" }
    ],
    notes: "Colocated at Ark's Longcross Park campus in Surrey (commonly described as \"London\" in press, but the campus itself is ~25km outside the city). 16MW live initially, with expansion toward 65MW targeted by 2027 — confirmed by Ark's Jun 2026 announcement of a new building on the campus to support that growth."
  },
  {
    id: "nebius-harlow",
    provider: "Nebius",
    site: "Kao Data Harlow",
    city: "Harlow",
    country: "United Kingdom",
    lat: 51.7724,
    lon: 0.0917,
    status: "Under construction",
    capacityMW: 22,
    lastUpdated: "2026-09-09",
    sources: [
      { label: "Data Center Dynamics — \"Nebius signs 22MW capacity agreement with Kao Data in the UK\"", url: "https://www.datacenterdynamics.com/en/news/nebius-signs-22mw-capacity-agreement-with-kao-data-in-the-uk/" },
      { label: "Kao Data newsroom", url: "https://kaodata.com/discover/news/nebius-chooses-kao-datas-harlow-campus-for-major-ai-infrastructure-deployment/" },
      { label: "PeeringDB facility 7042 — Kao Data Campus, London Road, Harlow", url: "https://www.peeringdb.com/fac/7042", cls: "N" }
    ],
    provenance: {
      // PeeringDB independently records the campus and its street address, so
      // location no longer rests on the operators' own descriptions. It says
      // nothing about power, so the 22MW figure is unaffected.
      capacityMW: {
        basis: "disclosed",
        asOf: "2026-09-09",
        evidence: [
          { source: 0, cls: "T", asOf: "2026-08-21", note: "22MW capacity agreement, as announced." },
          { source: 1, cls: "G", asOf: "2026-08-21", note: "Kao Data's own announcement of the same deal — the counterparty, not an independent check." }
        ]
      },
      status: {
        basis: "disclosed",
        asOf: "2026-09-09",
        evidence: [
          { source: 0, cls: "T", asOf: "2026-08-21" },
          { source: 1, cls: "G", asOf: "2026-08-21" }
        ]
      },
      location: {
        basis: "disclosed",
        asOf: "2026-09-09",
        evidence: [
          { source: 2, cls: "N", asOf: "2026-09-09", note: "PeeringDB facility 7042, \"Kao Data Campus\", London Road, Harlow, GB — an independent industry record of the campus. PeeringDB holds no coordinates for it, so the stored lat/lon is still uncorroborated at parcel precision." },
          { source: 1, cls: "G", asOf: "2026-08-21" }
        ]
      }
    },
    notes: "22MW, 10-year deal, part of a wider £1.7B UK investment pledge, alongside new Nvidia infrastructure deployments. Previous source citation (a Mäntsälä/Estonia roundup article that never mentions Harlow or Kao Data) was a copy-paste error — corrected."
  },
  {
    id: "nebius-huuru",
    provider: "Nebius",
    site: "Greenergy Data Centers",
    city: "Hüüru",
    country: "Estonia",
    lat: 59.3803,
    lon: 24.5397,
    status: "Under construction",
    capacityMW: 22,
    lastUpdated: "2026-08-21",
    sources: [
      { label: "Data Center Dynamics, Aug 2026", url: "https://www.datacenterdynamics.com/en/news/nebius-expands-european-presence-announces-deployment-in-estonia-and-second-data-center-in-m%C3%A4nts%C3%A4l%C3%A4-finland/" },
      { label: "Wikipedia — Hüüru (location reference)", url: "https://en.wikipedia.org/wiki/H%C3%BC%C3%BCru" }
    ],
    notes: "Near Tallinn. Agreement with Greenergy Data Centers; first phase expected operational later in 2026 — once fully live, expected to be Nebius's largest deployment in the Baltics."
  },
  {
    id: "nebius-vineland",
    provider: "Nebius",
    site: "DataOne",
    city: "Vineland, NJ",
    country: "United States",
    lat: 39.4864,
    lon: -75.0257,
    status: "Under construction",
    capacityMW: 300,
    lastUpdated: "2026-09-09",
    sources: [
      { label: "Nebius/Businesswire, Mar 2025 — \"adding up to 300 MW capacity\"", url: "https://www.businesswire.com/news/home/20250305405030/en/Nebius-accelerates-US-expansion-adding-up-to-300-MW-capacity-at-new-data-center-in-New-Jersey" },
      { label: "Data Centre Magazine", url: "https://datacentremagazine.com/articles/dataone-and-nebius-partner-for-new-300mw-ai-data-centre" },
      { label: "WHYY, Aug 2026 — Vineland planning board approves Phase 2", url: "https://whyy.org/articles/vineland-planning-board-approves-data-center-plan/" },
      { label: "Nebius Group SEC Form 6-K, 8 Sep 2025 — Microsoft GPU capacity agreement", url: "https://www.sec.gov/Archives/edgar/data/1513845/000110465925088312/tm2525580d1_6k.htm", cls: "R" }
    ],
    provenance: {
      // The SEC filing is the first source on this entry that isn't Nebius or
      // someone reporting Nebius. It names the site — it does NOT state a
      // megawatt figure, so it lifts location and status and deliberately
      // leaves capacity where it was.
      capacityMW: {
        basis: "disclosed",
        asOf: "2026-09-09",
        evidence: [
          { source: 0, cls: "P", asOf: "2025-03-05", note: "The 300MW figure originates here, in Nebius's own release. No independent record has confirmed it." },
          { source: 1, cls: "T", asOf: "2026-08-21", note: "Restates the same 300MW figure." }
        ]
      },
      status: {
        basis: "disclosed",
        asOf: "2026-09-09",
        evidence: [
          { source: 3, cls: "R", asOf: "2025-09-08", note: "Form 6-K describes Vineland as \"its new data center\" and commits it to a five-year Microsoft agreement worth about $17.4bn through 2031 — a filed, legally consequential statement that the project is real and proceeding." },
          { source: 2, cls: "G", asOf: "2026-08-18", note: "Planning board approval of Phase 2, reported locally." },
          { source: 0, cls: "P", asOf: "2025-03-05" }
        ]
      },
      location: {
        basis: "disclosed",
        asOf: "2026-09-09",
        evidence: [
          { source: 3, cls: "R", asOf: "2025-09-08", note: "Names Vineland, New Jersey in an SEC filing. Confirms the municipality, not the parcel — the stored coordinates are still uncorroborated at that precision." },
          { source: 0, cls: "P", asOf: "2025-03-05" }
        ]
      }
    },
    notes: "300MW was the primary-source figure from the original Mar 2025 Nebius/Businesswire release; the dataset previously used a more conservative 100MW \"installed by end-2025\" milestone, but that undersold the disclosed total. Phase 1 is under construction targeting full operation in 2026; Phase 2 (~600,000 sq ft addition) was approved by the Vineland Planning Board on Aug 18, 2026. Some secondary press floats a further expansion toward 350MW — not yet confirmed by a primary Nebius source, so not used here. Site is reportedly part of fulfilling Nebius's ~$17.4B Microsoft compute deal."
  },
  {
    id: "coreweave-kristiansand",
    provider: "CoreWeave",
    site: "N01 Datacenter Campus (Bulk Infrastructure)",
    city: "Øvrebø, Vennesla",
    country: "Norway",
    lat: 58.257573,
    lon: 7.889861,
    status: "Under construction",
    capacityMW: 400,
    lastUpdated: "2026-09-15",
    sources: [
      { label: "Bulk Infrastructure newsroom", url: "https://bulkinfrastructure.com/newsroom/coreweave-partners-with-bulk-infrastructure" },
      { label: "Nordic Property News", url: "https://www.nordicpropertynews.com/article/10575/one-of-europes-largest-data-centers-will-be-built-in-norway" },
      { label: "PeeringDB — Bulk Norway Data Center Campus N01 (fac/5520)", url: "https://www.peeringdb.com/fac/5520", cls: "N" },
      { label: "CoreWeave/Bulk joint release (PRNewswire), Mar 2025", url: "https://www.prnewswire.com/news-releases/coreweave-partners-with-bulk-infrastructure-for-one-of-the-largest-nvidia-ai-deployments-in-europe-302401685.html", cls: "P" },
      { label: "Vennesla kommune — \"Imponert over Bulks utvikling\", Aug 2024", url: "https://www.vennesla.kommune.no/nyheter-aktuelt/imponert-over-bulks-utvikling.6361.aspx", cls: "G" },
      { label: "Bulk Infrastructure — €410M financing for N01 expansion, Nov 2025", url: "https://bulkinfrastructure.com/newsroom/bulk-infrastructure-secures-410-million-for-n01-data-center-campus-expansion", cls: "P" },
      { label: "CoreWeave Inc. FY2025 10-K, Exhibit 21.1 (subsidiaries)", url: "https://www.sec.gov/Archives/edgar/data/1769628/000176962826000104/ex211-coreweaveincx10xk.htm" }
    ],
    provenance: {
      capacityMW: {
        basis: "disclosed",
        asOf: "2025-11-03",
        evidence: [
          { source: 3, cls: "P", note: "Joint release states \"Bulk has secured 400 MW at the site with potential up to 1GW\" — this is Bulk's site-level grid reservation for the whole campus, NOT a CoreWeave-specific contracted load." },
          { source: 5, cls: "P", note: "Nov 2025 financing release repeats the same 400MW/1GW figure ~8 months on, unchanged — consistent retelling rather than a drifting number." },
          { source: 0, cls: "G", note: "Developer's own newsroom announcement, the original basis for this figure." }
        ]
      },
      status: {
        basis: "disclosed",
        asOf: "2025-11-03",
        evidence: [
          { source: 4, cls: "G", note: "Vennesla municipality describes a third facility under construction at Støleheia (~NOK 3bn) as of Aug 2024 — already incomplete before the original summer-2025 target." },
          { source: 5, cls: "P", note: "Nov 2025 financing proceeds earmarked for \"continued expansion at the site\" — funding a build, not an operating asset." },
          { source: 6, cls: "R", note: "CoreWeave FY2025 10-K lists CoreWeave Norway AS as an active subsidiary — confirms the relationship is live, but says nothing about build progress." }
        ]
      },
      location: {
        basis: "disclosed",
        asOf: "2025-09-26",
        evidence: [
          { source: 2, cls: "N", note: "PeeringDB facility record: Stølevegen 39, Øvrebø 4715, coords 58.257573/7.889861, 7 networks + 1 exchange present. First N-class citation this entry has ever carried." },
          { source: 3, cls: "P", note: "Joint release names \"the N01 Datacenter Campus, Vennesla, Norway\" — administratively Vennesla, not Kristiansand." },
          { source: 4, cls: "G", note: "Municipality places the build at Støleheia in Vennesla, agreeing with the PeeringDB address." }
        ]
      }
    },
    notes: "Re-verified 2026-09-15. LOCATION CORRECTED: previously pinned at Kristiansand city centre (58.1467, 7.9956); PeeringDB's facility record gives a real street address ~13km north at Stølevegen 39, Øvrebø, which sits in Vennesla municipality (not Kristiansand — Øvrebø is a former municipality now inside Vennesla). The operator's own joint release and Vennesla kommune both agree. Entry id keeps the \"kristiansand\" shorthand since that is how the site is publicly known. CAPACITY CAVEAT: the 400MW figure is Bulk Infrastructure's disclosed site-level grid capacity reservation for the entire N01 campus (with headroom to 1GW), NOT a CoreWeave-specific contracted figure — no source found distinguishes CoreWeave's own MW commitment from the campus total, and that gap looks structural rather than a research failure. STATUS: the original announcement targeted operation by summer 2025; 14 months past that, nothing found claims the site is live, while a Nov 2025 financing round for \"continued expansion\" and a 2024 municipal item both indicate an ongoing build. Not checked this pass: Brønnøysundregistrene for the N01 operating entity, and Vennesla kommune's own planinnsyn/byggesak portal for a building permit (only its news page was reached). Searched without result: Statnett/NVE grid-reservation registers for a site-specific MW figure; EDGAR full-text for \"Kristiansand\" (no hits)."
  },
  {
    id: "coreweave-lancaster",
    provider: "CoreWeave",
    site: "",
    city: "Lancaster, PA",
    country: "United States",
    lat: 40.0379,
    lon: -76.3055,
    status: "Planned",
    capacityMW: 100,
    lastUpdated: "2026-08-20",
    sources: [
      { label: "Data Center Dynamics, Jul 2026", url: "https://www.datacenterdynamics.com/en/news/coreweave-plans-6bn-data-center-in-lancaster-pennsylvania/" },
      { label: "Yahoo Finance, Jul 2026", url: "https://finance.yahoo.com/news/coreweave-crwv-plans-6-billion-143703771.html" }
    ],
    notes: "$6B project; phase one is 100MW with potential to expand to 300MW."
  },
  {
    id: "coreweave-denton",
    provider: "CoreWeave",
    site: "Core Scientific Denton",
    city: "Denton",
    country: "United States",
    lat: 33.2148,
    lon: -97.1331,
    status: "Operational",
    capacityMW: 260,
    lastUpdated: "2026-09-15",
    sources: [
      { label: "Core Scientific investor newsroom, Feb 2025", url: "https://investors.corescientific.com/news-events/press-releases/detail/110/core-scientific-and-coreweave-announce-1-2-billion-expansion-at-denton-tx-site" },
      { label: "Data Center Dynamics, Apr 2026", url: "https://www.datacenterdynamics.com/en/news/coreweave-deploys-16000-gpus-at-delayed-data-center-in-denton-texas/" },
      { label: "TX TDLR — TABS project 2025005706, Core Scientific Denton", url: "https://www.tdlr.texas.gov/TABS/Search/Print/TABS2025005706" },
      { label: "TX TDLR — TABS project 2022003099, south-parcel tech building", url: "https://www.tdlr.texas.gov/TABS/Search/Print/TABS2022003099" },
      { label: "Core Scientific Q2 FY26 earnings deck (8-K exhibit), Jul 2026", url: "https://www.sec.gov/Archives/edgar/data/1839341/000183934126000012/q2fy26earningsdeck728am.htm", cls: "P" },
      { label: "Core Scientific Q3 2025 earnings deck (8-K exhibit), Oct 2025", url: "https://www.sec.gov/Archives/edgar/data/1839341/000114036125039864/ef20057996_ex99-1.htm", cls: "P" },
      { label: "Core Scientific 8-K exhibit — original Denton facility announcement, Mar 2022", url: "https://www.sec.gov/Archives/edgar/data/1839341/000119312522067245/d279212dex991.htm", cls: "P" }
    ],
    provenance: {
      capacityMW: {
        basis: "disclosed",
        asOf: "2026-07-28",
        evidence: [
          { source: 4, cls: "P", note: "Q2 FY26 deck lists Denton at ~260MW leased and ~260MW billing as of mid-Jul 2026. Classed P, not R: an investor deck filed as an 8-K exhibit is still the operator describing its own site." },
          { source: 0, cls: "P" },
          { source: 1, cls: "T" }
        ]
      },
      status: {
        basis: "disclosed",
        asOf: "2026-07-28",
        evidence: [
          { source: 4, cls: "P", note: "Q2 FY26 deck marks Denton 'substantially complete' and billing ~260MW — the basis for calling this Operational." },
          { source: 5, cls: "P", note: "Q3 2025 deck shows only ~120+MW energized across Denton and Marble combined, so the site was materially less than fully live as recently as late 2025." },
          { source: 1, cls: "T", note: "Apr 2026: 16,000 GPUs deployed at a 'delayed' facility — consistent with partial energization well under what 260MW would host." }
        ]
      },
      location: {
        basis: "estimated",
        asOf: "2026-09-15",
        evidence: [
          { source: 2, cls: "R", note: "Texas TDLR accessibility-project registration names 8171 Jim Christal Road, Denton, TX 76207, owner Core Scientific, $635M project cost, completion target 2025-12-29 — a state filing made before construction, independent of any press cycle." },
          { source: 3, cls: "R", note: "Companion record at 8161 Jim Christal Rd lists the City of Denton as owner of record, corroborating that part of the campus sits on city-leased land." },
          { source: 0, cls: "P", note: "Stored lat/lon is still a Denton city-centre approximation, not geocoded to the confirmed address — hence basis 'estimated'." }
        ]
      }
    },
    notes: "Re-verified 2026-09-15. ADDRESS CONFIRMED independently: Texas TDLR accessibility-project registration TABS2025005706 names 8171 Jim Christal Road, Denton, TX 76207 with Core Scientific as owner, a $635M project cost and a Dec 2025 completion target — a state filing made ahead of construction, independent of any announcement. A companion record at 8161 Jim Christal Rd lists the City of Denton as owner, corroborating that part of the campus sits on city-leased land. The pin itself is still a city-centre approximation and was NOT updated — no geocode-grade source for the parcel was found (Denton Central Appraisal District only returned its ArcGIS portal shell). STATUS REFINED: 'Operational' is right as of Jul 2026, but the site ramped rather than arriving — Core Scientific's own SEC-filed decks show only ~120+MW energized across Denton and Marble combined in Oct 2025, the Apr 2026 trade report describes a delayed facility with 16,000 GPUs deployed, and only by the Jul 2026 deck is Denton 'substantially complete' and billing ~260MW. Do not read 260MW as having been live since the 2025 announcement. Former Core Scientific bitcoin-mining site converted for CoreWeave under a $6.1B conversion; 260MW is the disclosed critical IT load, now cross-confirmed across five separate Core Scientific filings (all P-class, so the extra citations add reliability but not independence). Note the site's original 2022 build target was 300MW TOTAL ELECTRICAL capacity for the mining-era structures — a different metric from the 260MW critical IT load cited now; do not merge the two. REMOVED: an earlier note said this facility 'reportedly' hosts OpenAI workloads. No sourcing for that was found anywhere — not in the 2022 or 2025 press releases, the earnings decks, or trade coverage — so it has been dropped rather than left hedged. Searched without result: PeeringDB (nothing under CoreWeave, Core Scientific or Denton — expected, this is GPU compute rather than carrier-neutral colo, so the miss is uninformative); EPA ECHO under NAICS 518210 and 2211 for Denton city and county (full 7,784-facility TX scan, coverage complete); ERCOT and Denton Municipal Electric records (no usable public endpoint found)."
  },
  {
    id: "coreweave-muskogee",
    provider: "CoreWeave",
    site: "Port of Muskogee HPC Data Center (Core Scientific)",
    city: "Muskogee",
    country: "United States",
    lat: 35.7479,
    lon: -95.3697,
    status: "Operational",
    capacityMW: 100,
    lastUpdated: "2026-08-21",
    sources: [
      { label: "Businesswire (Core Scientific/Port Muskogee), Nov 2024", url: "https://www.businesswire.com/news/home/20241118256980/en/Core-Scientific-and-Port-Muskogee-Break-Ground-on-100-MW-HPC-Data-Center" },
      { label: "Data Center Dynamics, Nov 2024", url: "https://www.datacenterdynamics.com/en/news/coreweave-and-core-scientific-break-ground-on-100mw-data-center-in-muskogee-oklahoma/" }
    ],
    notes: "100MW total (70MW critical IT + 30MW ancillary), leased to CoreWeave for Nvidia GPUs. Broke ground Nov 2024; described as energized/delivered to CoreWeave around Q2 2026 per Core Scientific earnings-call commentary (not yet independently confirmed by a dedicated trade-press piece — re-check next audit). Distinct from Core Scientific's much larger adjacent Polaris DS acquisition (up to 1.5GW), which is not confirmed as CoreWeave-contracted capacity."
  },
  {
    id: "coreweave-marble",
    provider: "CoreWeave",
    site: "Core Scientific Marble",
    city: "Marble",
    country: "United States",
    lat: 35.1401,
    lon: -83.9515,
    status: "Operational",
    capacityMW: 65,
    lastUpdated: "2026-08-21",
    sources: [
      { label: "Core Scientific SEC 8-K, Exhibit 99.1, Oct 2025", url: "https://investors.corescientific.com/sec-filings/all-sec-filings/content/0001140361-25-039864/ef20057996_ex99-1.htm" }
    ],
    notes: "Former Core Scientific crypto-mining site in Cherokee County, NC, converted for CoreWeave; ~65MW contracted/energized per Oct 2025 SEC filing. A directory listing (datacentermap.com) cites 105-117MW total facility capacity — likely total site build vs. the CoreWeave-specific allocation; unresolved discrepancy, not corroborated by a Tier 1/2 source, so 65MW is used here. No dedicated trade-press article found on this site specifically."
  },
  {
    id: "coreweave-dalton",
    provider: "CoreWeave",
    site: "Core Scientific Dalton",
    city: "Dalton",
    country: "United States",
    lat: 34.7698,
    lon: -84.9702,
    status: "Under construction",
    capacityMW: 175,
    lastUpdated: "2026-08-21",
    sources: [
      { label: "Core Scientific SEC 8-K, Exhibit 99.1, Oct 2025", url: "https://investors.corescientific.com/sec-filings/all-sec-filings/content/0001140361-25-039864/ef20057996_ex99-1.htm" }
    ],
    notes: "~175MW total contracted to CoreWeave per Oct 2025 SEC filing. Phased buildout: an initial ~30MW reported handed over around Q2 2026, remaining ~145MW under construction, full completion targeted early 2027 per Core Scientific earnings-call commentary (not yet corroborated by dedicated trade press — re-check next audit, Planned/UC entries move fast). Single-source-family (all Core Scientific primary disclosures); no independent trade-press corroboration found yet."
  },
  {
    id: "coreweave-ellendale",
    provider: "CoreWeave",
    site: "Polaris Forge 1 (Applied Digital)",
    city: "Ellendale",
    country: "United States",
    lat: 46.0011,
    lon: -98.5326,
    status: "Under construction",
    capacityMW: 400,
    lastUpdated: "2026-09-15",
    sources: [
      { label: "Applied Digital investor newsroom, Jun 2025", url: "https://ir.applieddigital.com/news-events/press-releases/detail/123/applied-digital-announces-250mw-ai-data-center-lease-with" },
      { label: "Applied Digital investor newsroom, Aug 2025", url: "https://ir.applieddigital.com/news-events/press-releases/detail/128/applied-digital-finalizes-additional-150mw-lease-with" },
      { label: "Data Center Dynamics, Oct 2025", url: "https://www.datacenterdynamics.com/en/news/first-50mw-ready-for-service-at-applied-digital-data-center-in-ellendale-north-dakota/" },
      { label: "Applied Digital FY2026 10-K (period ended 2026-05-31), filed 2026-07-29", url: "https://www.sec.gov/Archives/edgar/data/1144879/000114487926000048/apld-20260531.htm" },
      { label: "Applied Digital 8-K exhibit — investor presentation, Apr 2026", url: "https://www.sec.gov/Archives/edgar/data/1144879/000114487926000036/apld_invxinvestorpresent.htm", cls: "P" },
      { label: "Applied Digital 8-K exhibit — Q4 FY26 earnings release, Jul 2026", url: "https://www.sec.gov/Archives/edgar/data/1144879/000114487926000044/apldq426earningsreleaseasf.htm", cls: "P" }
    ],
    provenance: {
      capacityMW: {
        basis: "disclosed",
        asOf: "2026-07-29",
        evidence: [
          { source: 3, cls: "R", note: "FY2026 10-K: the Building 4 Lease added 150MW, bringing total contracted capacity at Polaris Forge 1 under the CoreWeave leases to 400MW — the same number as the press releases, but stated as a legal disclosure." },
          { source: 4, cls: "P", note: "Apr 2026 investor-presentation exhibit labels the 400MW explicitly as Contracted Critical IT Load, confirming it matches the atlas's critical-IT convention rather than being gross power." },
          { source: 0, cls: "P" },
          { source: 1, cls: "P" },
          { source: 2, cls: "T" }
        ]
      },
      status: {
        basis: "disclosed",
        asOf: "2026-07-27",
        evidence: [
          { source: 3, cls: "R", note: "10-K: Building 1 operational since Oct 2025, Building 2 partially operational, Building 3 still under construction targeting RFS CY2027." },
          { source: 5, cls: "P", note: "Q4 FY26 earnings release: Building 2 Phase 1 (75MW) delivered 2026-06-30, taking total live capacity to 175MW of the 400MW contracted." },
          { source: 0, cls: "P" },
          { source: 2, cls: "T" }
        ]
      },
      location: {
        basis: "estimated",
        asOf: "2026-08-21",
        evidence: [
          { source: 0, cls: "P" },
          { source: 2, cls: "T", note: "No independent record found for the pin: EPA ECHO shows no NAICS 518210 or 2211 facility in Dickey County (full-state scan, coverage complete) and PeeringDB has no record. Coordinates remain unverified." }
        ]
      }
    },
    notes: "Re-verified 2026-09-15 — capacity and status both now carry SEC-filed corroboration. The 400MW is confirmed as contracted CRITICAL IT LOAD (not gross power) by Applied Digital's FY2026 10-K and an Apr 2026 investor-presentation exhibit. Build state as of the FY26 10-K and the Jul 2026 earnings release: Building 1 (100MW) operational since Oct 2025; Building 2 (150MW) partially live — Phase 1 (75MW) delivered 2026-06-30, taking the campus to 175MW of 400MW; Building 3 (150MW) under construction, targeting RFS CY2027. Naming wrinkle worth knowing: the lease documents number the three CoreWeave leases Building 2/3/4 while investor materials call the physical structures Building 1/2/3 — the MW arithmetic (100+150+150=400) is consistent across both, so this is inconsistent internal naming, not a size discrepancy. Campus is designed to scale to 1GW long-term per Applied Digital; that headline figure remains aspirational and is distinct from the 400MW CoreWeave commitment. LOCATION still unverified against any independent record — EPA ECHO returned no facility in Dickey County under NAICS 518210 or 2211 (full-state scan of 1,887 ND air facilities, coverage complete, so a real negative) and PeeringDB has nothing. Next places to look: Dickey County parcel records or an ND PSC siting docket. The 10-K quotation was cross-checked against a second model family with live search, which reached the identical sentence via the SEC's own XBRL note pages — not a fabricated quote."
  },
  {
    id: "coreweave-barcelona",
    provider: "CoreWeave",
    site: "MERLIN Edged — Port of Barcelona",
    city: "Barcelona",
    country: "Spain",
    lat: 41.3512,
    lon: 2.1637,
    status: "Operational",
    capacityMW: 15,
    lastUpdated: "2026-08-23",
    sources: [
      { label: "CoreWeave investor newsroom, May 2025", url: "https://investors.coreweave.com/news/news-details/2025/The-Mayor-of-Barcelona-Jaume-Collboni-Inaugurates-Data-Center-Hosting-CoreWeaves-Leading-AI-Cloud-Platform-in-Partnership-with-MERLIN-Edged/default.aspx" },
      { label: "Data Center Dynamics, May 2025 — \"Merlin Edged launches Barcelona data center, CoreWeave to take 15MW\"", url: "https://www.datacenterdynamics.com/en/news/merlin-edged-launches-barcelona-data-center-coreweave-to-take-15mw/" }
    ],
    notes: "Inaugurated May 2025; first phase 10,224 Nvidia H200 GPUs over InfiniBand, 100% renewable power. Part of a stated $2.2B CoreWeave European investment. Coordinates are a Port of Barcelona approximation — not independently geocoded to the exact facility address. No later capacity-expansion figure found — check for growth at next audit."
  },
  {
    id: "coreweave-stockholm",
    provider: "CoreWeave",
    site: "Conapto — Stockholm 4 South",
    city: "Stockholm",
    country: "Sweden",
    lat: 59.3293,
    lon: 18.0686,
    status: "Operational",
    capacityMW: null,
    lastUpdated: "2026-08-23",
    sources: [
      { label: "CoreWeave newsroom, Jun 2026", url: "https://www.coreweave.com/news/coreweave-partners-with-conapto-to-expand-ai-cloud-capacity-in-sweden-powered-by-renewable-energy" },
      { label: "Data Center Dynamics, Jun 2026", url: "https://www.datacenterdynamics.com/en/news/coreweave-signs-colocation-agreement-with-conapto-in-sweden/" }
    ],
    notes: "Colocation deal covers two Conapto campuses in Stockholm; only \"Stockholm 4 South\" is named and has initial capacity live as of Jun 2026. Second campus unnamed, timeline undisclosed. No MW figure disclosed by either party — left null rather than guessed. 100% renewable power; waste heat recovered into Stockholm Exergi's district heating network. Coordinates are a Stockholm city-center approximation, not the exact campus address."
  },
  {
    id: "coreweave-jakarta",
    provider: "CoreWeave",
    site: "",
    city: "Jakarta",
    country: "Indonesia",
    lat: -6.2088,
    lon: 106.8456,
    status: "Planned",
    capacityMW: 360,
    lastUpdated: "2026-08-23",
    sources: [
      { label: "CoreWeave newsroom, Aug 2026", url: "https://www.coreweave.com/news/coreweave-expands-cloud-ai-platform-to-indonesia-marking-first-move-into-asia-pacific-region" },
      { label: "Data Center Dynamics, Aug 2026", url: "https://www.datacenterdynamics.com/en/news/coreweave-plans-to-launch-360mw-of-data-center-capacity-in-indonesia/" },
      { label: "Bloomberg, Aug 2026", url: "https://www.bloomberg.com/news/articles/2026-08-04/coreweave-to-enter-asian-market-with-indonesian-data-centers" }
    ],
    notes: "CoreWeave's first Asia-Pacific presence; 3 company-owned-and-operated facilities totaling 360MW contracted IT power, expected online 2028 per the Aug 4 2026 announcement — that's \"expected,\" not a firm delivery commitment, and 2 years out, so re-check well before then. Individual facility names/addresses not yet public; coordinates are a Jakarta city-center placeholder. Consider splitting into per-facility entries once sites are named."
  },
  {
    id: "coreweave-helios-texas",
    provider: "CoreWeave",
    site: "Helios Data Center Campus (Galaxy Digital)",
    city: "Dickens County, TX",
    country: "United States",
    lat: 33.6187,
    lon: -100.7551,
    status: "Under construction",
    capacityMW: 526,
    lastUpdated: "2026-09-15",
    sources: [
      { label: "Galaxy Digital (PRNewswire) — Phase I completion", url: "https://www.prnewswire.com/news-releases/galaxy-completes-phase-i-of-its-helios-data-center-campus-delivering-133-megawatts-of-critical-it-load-to-coreweave-302818664.html" },
      { label: "Data Center Dynamics — \"CoreWeave leases another 260MW capacity from Galaxy in Texas\"", url: "https://www.datacenterdynamics.com/en/news/coreweave-leases-another-260mw-capacity-from-galaxy-in-texas/" },
      { label: "Blockspace — Galaxy delivers Helios to CoreWeave", url: "https://blockspace.media/insight/galaxy-delivers-helios-to-coreweave/" },
      { label: "Data Center Dynamics — Galaxy closes $1.4bn debt facility for Helios", url: "https://www.datacenterdynamics.com/en/news/galaxy-digital-closes-14bn-debt-facility-for-helios-data-center-campus-in-texas/" },
      { label: "TCEQ Form PI-1S air-permit registration — Galaxy Helios I LLC (RN111537775), filed 2025-01-30", url: "https://www.tceq.texas.gov/", cls: "R" }
    ],
    provenance: {
      capacityMW: {
        basis: "disclosed",
        asOf: "2026-08-05",
        evidence: [
          { source: 0, cls: "P", note: "Galaxy's own Q2 2026 disclosure breaks the 526MW out as Phase I 133MW + Phase II 260MW + Phase III 133MW — the atlas's figure matches that stated breakdown exactly rather than being derived or rounded here." },
          { source: 1, cls: "T" },
          { source: 2, cls: "T" },
          { source: 3, cls: "T" }
        ]
      },
      status: {
        basis: "disclosed",
        asOf: "2026-09-08",
        evidence: [
          { source: 4, cls: "R", note: "TCEQ air-permit registration (Standard Permit 6005, electric generating units) filed by a named Galaxy executive, projecting construction start Mar 2025 — regulatory proof the project is real and was genuinely being built, not an announcement." },
          { source: 0, cls: "P", note: "Phase I (133MW) delivered Q2 2026; Phase II (260MW) targeting Q2 2027 rent commencement." },
          { source: 1, cls: "T" }
        ]
      },
      location: {
        basis: "estimated",
        asOf: "2026-09-15",
        evidence: [
          { source: 4, cls: "R", note: "Registration gives the site address as 984 County Road 112, Afton, Dickens County, TX 79220 — an independent confirmation of the place. The stored lat/lon remains a county-level approximation, not geocoded to that address, hence basis 'estimated'." },
          { source: 0, cls: "P", note: "Galaxy's own filing describes the campus as in Dickens County, West Texas, ~60 miles from Lubbock." }
        ]
      }
    },
    notes: "Re-verified 2026-09-15. ADDRESS CONFIRMED independently: a TCEQ air-permit registration (Form PI-1S, Registered Entity RN111537775, filed 2025-01-30 by Galaxy Helios I LLC and signed by a named Galaxy executive) gives the site as 984 County Road 112, Afton, Dickens County, TX 79220, with construction start projected Mar 2025. That is genuine regulatory corroboration the project exists and was being built. The map pin is still a county-level approximation and was NOT updated: a precise lat/long (33.7814, -100.8791) circulates on directory/wiki sites but neither cites how it was derived (D-class), so it was not written in. CAPACITY remains operator-sourced: the 526MW critical-IT figure traces to Galaxy's own investor materials (133 + 260 + 133 across three phases), republished via PRNewswire, refiled as an SEC exhibit and written up by trade press — the arithmetic checks out against Galaxy's stated breakdown, but no regulatory, network or observed source confirms the number itself. GROSS CAPACITY HAS MOVED: ERCOT-approved grid capacity at the campus is now ~1,630MW gross (Helios I 800MW + Helios II 830MW) per Galaxy's Jan 2026 and Sep 2026 disclosures, up from the 800MW previously noted here. That is interconnection capacity, distinct from and much larger than the 526MW critical IT leased to CoreWeave — do not conflate them. Galaxy itself describes the ERCOT Batch Zero classifications as still subject to an ongoing audit, and ERCOT is not publishing Batch Zero results, so those grid figures are sponsor-disclosed rather than independently confirmable. DROPPED CLAIM: a search summary asserted a specific TCEQ document showed 120 diesel generators at this site; the cited document was fetched and turned out to cover an unrelated LNG facility in Jefferson County — misattributed, and not applied. Searched without result: EPA ECHO (zero NAICS 518210 facilities in Dickens County; full 7,784-facility TX scan, coverage complete, though data-centre gensets may simply not be registered under that code); PeeringDB (no record, expected for a single-tenant campus); Chapter 312 abatement records (the Dickens County reinvestment-zone record found states no investment or MW figure)."
  },
  {
    id: "coreweave-plano",
    provider: "CoreWeave",
    site: "Lincoln Rackhouse — 1000 Coit Rd",
    city: "Plano, TX",
    country: "United States",
    lat: 33.0198,
    lon: -96.6989,
    status: "Operational",
    capacityMW: 30,
    lastUpdated: "2026-08-23",
    sources: [
      { label: "Data Center Dynamics — \"CoreWeave plans $1.6bn AI cloud data center in Plano, Texas\"", url: "https://www.datacenterdynamics.com/en/news/coreweave-plans-16bn-ai-cloud-data-center-in-plano-texas/" },
      { label: "Dallas Innovates — \"$1.6B CoreWeave Data Center in North Texas\"", url: "https://dallasinnovates.com/coreweave-to-open-1-6b-data-center-in-plano-expanding-access-to-high-performance-gpus/" },
      { label: "Community Impact, Jul 2023", url: "https://communityimpact.com/dallas-fort-worth/plano-south/development/2023/07/26/coreweave-to-open-16b-data-center-in-plano/" }
    ],
    notes: "CoreWeave's original flagship Texas facility, distinct from the later Core Scientific/Galaxy/Applied Digital deals; 454,421 sq ft on a 23.8-acre campus, operational since late 2023, $1.6B total investment. 6-year Master Services Agreement (not a lease) with Lincoln Property Company, $75/kW/month, two 2-year renewal options. 30MW critical IT capacity in 4 data halls, plus 50,000 sq ft of powered shell space for future expansion (30MW figure corroborated by a directory listing, datacentermap.com, matching the trade-press description). No Tier 1 CoreWeave press release located for this site — worth a search at next audit. Coordinates are a Plano city-center approximation, not geocoded to 1000 Coit Rd."
  },
  {
    id: "coreweave-austin",
    provider: "CoreWeave",
    site: "Core Scientific Austin",
    city: "Austin, TX",
    country: "United States",
    lat: 30.2672,
    lon: -97.7431,
    status: "Operational",
    capacityMW: 20,
    lastUpdated: "2026-09-02",
    sources: [
      { label: "Core Scientific investor newsroom, Mar 2024", url: "https://investors.corescientific.com/news-events/press-releases/detail/9/core-scientific-to-provide-coreweave-up-to-16-mw-of-data-center-infrastructure-to-support-ai-and-hpc-workloads-in-long-term-hosting-contract-with-potential-revenue-of-more-than-100-million" },
      { label: "Data Center Dynamics — \"CoreWeave to lease 16MW of data center space from cryptominer Core Scientific\"", url: "https://www.datacenterdynamics.com/en/news/coreweave-to-lease-16mw-of-data-center-space-from-cryptominer-core-scientific/" }
    ],
    notes: "CoreWeave's first Core Scientific hosting deal, signed Mar 2024 — predates the later Denton/Muskogee/Marble/Dalton deals. Former HPE hosting/HPC facility at 3301 Hibbetts Rd, 118,000 sq ft, 8-year contract, >$100M potential revenue ($97.8M in lease payments). Originally disclosed at 16MW; Core Scientific's Q4 2025 and Q1 2026 investor disclosures both list this site at 20MW as part of the company's named 590MW/5-site CoreWeave portfolio (Denton/Dalton/Muskogee/Marble/Austin) — updated to 20MW on the strength of that repeated primary-source figure, though independent trade-press confirmation is still pending. Coordinates are an Austin city-center approximation."
  },
  {
    id: "coreweave-cedarcreek",
    provider: "CoreWeave",
    site: "EdgeConneX — Cedar Creek Campus",
    city: "Cedar Creek, TX",
    country: "United States",
    lat: 30.0836,
    lon: -97.3286,
    status: "Under construction",
    capacityMW: null,
    lastUpdated: "2026-09-02",
    sources: [
      { label: "Data Center Dynamics — \"CoreWeave to lease capacity from EdgeConneX at data center campus in Cedar Creek, Texas\"", url: "https://www.datacenterdynamics.com/en/news/coreweave-to-lease-capacity-from-edgeconnex-at-data-center-campus-in-cedar-creek-texas/" },
      { label: "Community Impact, Jul 2026 — \"AI cloud company CoreWeave to fill $440M Cedar Creek data center\"", url: "https://communityimpact.com/bastrop-cedar-creek/development/ai-cloud-company-coreweave-to-fill-440m-cedar-creek-data-center/" },
      { label: "Community Impact — \"EdgeConneX plans second data center campus in Bastrop County\"", url: "https://communityimpact.com/austin/bastrop-cedar-creek/government/2026/03/31/edgeconnex-plans-second-data-center-campus-in-bastrop-county/" }
    ],
    notes: "CoreWeave named as qualifying tenant for EdgeConneX's Campus 1 at this Bastrop County site — 4 buildings, ~2.8M sq ft, ~$1.4B — confirmed via the county's Dec 2024 10-year/75% property tax abatement and a Jul 2025 Texas Comptroller large-data-center-project certification. First building ($440M) under construction as of Jul 2026, expected to open mid-to-late 2026 (local press varies between Jun and Aug 2026). Correction: the earlier \"up to 19 potential buildings\" figure conflated Campus 1 with two separate, later-announced EdgeConneX campuses (up to 9 buildings each) elsewhere in the county — those are distinct developments with no confirmed CoreWeave involvement as of this update. No MW figure disclosed by CoreWeave or EdgeConneX for Campus 1 in any source found — left null rather than guessed. Coordinates are a Cedar Creek/Bastrop County approximation."
  },
  {
    id: "coreweave-kenilworth",
    provider: "CoreWeave",
    site: "NEST11 — NEST Campus",
    city: "Kenilworth, NJ",
    country: "United States",
    lat: 40.6787,
    lon: -74.2907,
    status: "Under construction",
    capacityMW: null,
    lastUpdated: "2026-08-23",
    sources: [
      { label: "Data Center Dynamics — \"CoreWeave acquires NEST data center for $322m\"", url: "https://www.datacenterdynamics.com/en/news/coreweave-acquires-nest-data-center-for-322m-at-life-sciences-campus-in-new-jersey/" },
      { label: "REBusinessOnline — \"CoreWeave to invest $1.2B for new data center facility at NEST campus\"", url: "https://rebusinessonline.com/coreweave-to-invest-1-2b-for-new-data-center-facility-at-nest-campus-in-kenilworth-new-jersey/" },
      { label: "News 12 NJ — construction/resident reaction", url: "https://newjersey.news12.com/ai-data-center-under-construction-in-kenilworth-draws-mixed-reactions-from-residents" }
    ],
    notes: "CoreWeave acquired the NEST11 building (280,000 sq ft) and a 27-acre parcel at the former Merck HQ / Northeast Science & Technology campus for $322M, with $1.2B total investment to convert to a data center; site has a 50MW substation, but that's a facility spec, not a confirmed CoreWeave-contracted MW figure — left null rather than guessed. Under construction per local news coverage as of 2026. Coordinates are a Kenilworth city-center approximation, not geocoded to the exact campus address."
  },
  {
    id: "coreweave-chester",
    provider: "CoreWeave",
    site: "CTP-01 (Chirisa Technology Parks)",
    city: "Chester, VA",
    country: "United States",
    lat: 37.3401,
    lon: -77.4419,
    status: "Operational",
    capacityMW: 18.6,
    lastUpdated: "2026-08-23",
    sources: [
      { label: "Data Center Frontier — \"CoreWeave Continues Growth With Major Collaborative Effort\"", url: "https://www.datacenterfrontier.com/site-selection/article/55140492/coreweave-continues-growth-with-major-collaborative-effort-on-new-ai-data-center-project" },
      { label: "Data Center Dynamics — \"Blue Owl, Chirisa and PowerHouse announce $5bn data center JV for CoreWeave\"", url: "https://www.datacenterdynamics.com/en/news/blue-owl-chirisa-and-powerhouse-announce-5bn-data-center-jv-for-coreweave/" }
    ],
    notes: "1401 Meadowville Technology Parkway, Chesterfield County. Operational since ~Aug 2024; 12-year license with two 5-year extension options, initially ~18.6MW at $115/kW/month. Owned/operated by Chirisa Technology Parks, part of a $5B Blue Owl/Chirisa/PowerHouse JV for CoreWeave capacity. Secondary/directory sources (Epoch AI, Baxtel, morethanjustparks.com) describe scaling toward 28MW, and separately float much larger figures (82–113MW) tied to a $3–4B multi-phase buildout — those larger numbers aren't corroborated by named trade press or a primary release, so 18.6MW (the figure agreed by Tier 2 sources) is used here; re-check for a confirmed expansion. Coordinates are a Chester, VA approximation, not geocoded to the Meadowville Technology Parkway address."
  },
  {
    id: "coreweave-hammond",
    provider: "CoreWeave",
    site: "Digital Crossroads — 301 Digital Crossroads Dr",
    city: "Hammond, IN",
    country: "United States",
    lat: 41.5834,
    lon: -87.5000,
    status: "Planned",
    capacityMW: 180,
    lastUpdated: "2026-08-23",
    sources: [
      { label: "Data Center Dynamics — \"CoreWeave to develop 180MW data center at Digital Crossroads campus\"", url: "https://www.datacenterdynamics.com/en/news/coreweave-to-develop-180mw-data-center-at-digital-crossroads-campus-in-hammond-indiana/" },
      { label: "City of Hammond, Indiana — official approval notice", url: "https://www.gohammond.com/hammond-approves-development-agreement-for-new-data-center/" }
    ],
    notes: "New 180MW, 450,000 sq ft building (301 Digital Crossroads Drive) on the former State Line Generating Plant coal site, developed by Decennial Group under a 20-year CoreWeave lease, approved by Hammond City Council Jun 9, 2025, targeted operational 2027 — contingent on a NIPSCO power agreement, so kept as \"Planned\" rather than \"Under construction\" pending confirmation groundbreaking has started. CoreWeave separately already occupies a smaller, existing Digital Crossroads facility on the same campus (100 Digital Crossroads Drive, ~105,000 sq ft) — no MW figure or start date found for that one; not enough to log as its own entry yet. Coordinates are a Hammond city-center approximation, not geocoded to the campus address."
  },
  {
    id: "coreweave-cheyenne",
    provider: "CoreWeave",
    site: "Related Digital Cheyenne Campus",
    city: "Cheyenne, WY",
    country: "United States",
    lat: 41.1400,
    lon: -104.8202,
    status: "Under construction",
    capacityMW: 88,
    lastUpdated: "2026-08-23",
    sources: [
      { label: "Data Center Dynamics — \"Related Digital breaks ground on $1.2bn data center in Cheyenne, Wyoming, will host CoreWeave servers\"", url: "https://www.datacenterdynamics.com/en/news/related-digital-breaks-ground-on-12bn-data-center-in-cheyenne-wyoming-will-host-coreweave-servers/" },
      { label: "Related Digital newsroom — \"Related Digital Breaks Ground on 302 MW Data Center Campus in Cheyenne, Wyoming\"", url: "https://www.related-digital.com/news/related-digital-breaks-ground-on-302-mw-data-center-campus-in-cheyenne-wyoming" }
    ],
    notes: "Related Digital broke ground Oct 2025 on a 115-acre, up-to-302MW critical IT campus; CoreWeave is the anchor tenant on a long-term lease for the first building (184,000 sq ft, 88MW critical IT, air-cooled), targeted complete late 2026, part of a $1.2B total investment. 88MW is CoreWeave's confirmed first-building commitment — the 302MW figure is the campus's full build-out ceiling, not all contracted to CoreWeave yet. Coordinates are a Cheyenne city-center approximation, not geocoded to the campus address."
  },
  {
    id: "coreweave-cambridge-on",
    provider: "CoreWeave",
    site: "Cohere / Related Digital facility",
    city: "Cambridge, ON",
    country: "Canada",
    lat: 43.3616,
    lon: -80.3144,
    status: "Planned",
    capacityMW: 54,
    lastUpdated: "2026-09-02",
    sources: [
      { label: "Data Center Dynamics — \"AI startup Cohere and CoreWeave plan multibillion-dollar data center in Canada\"", url: "https://www.datacenterdynamics.com/en/news/ai-startup-cohere-and-coreweave-plan-multibillion-dollar-data-center-in-canada/" },
      { label: "The Globe and Mail — CoreWeave/Cohere Cambridge, Ontario data centre", url: "https://www.theglobeandmail.com/business/article-coreweave-ai-data-centre-cambridge-ontario-cohere/" },
      { label: "CPP Investments newsroom — \"CPP Investments Commits to $225 Million in Construction Financing for Ontario Data Centre\"", url: "https://www.cppinvestments.com/newsroom/cpp-investments-commits-to-225-million-in-construction-financing-for-ontario-data-centre/" }
    ],
    notes: "CoreWeave will operate a data center in Cambridge, Ontario with Cohere as anchor tenant; Cohere received $240M in Canadian federal funding toward a $725M facility, part of Canada's $2B Sovereign AI Compute Strategy. CPP Investments announced (Jul 31, 2025) a C$225M construction-loan commitment (50% of a $450M facility, Deutsche Bank as lead lender) to expand this site from ~6MW to 54MW of hyperscale capacity, per CPP Investments' own newsroom and Globe and Mail reporting — capacity updated to 54MW on that basis. The JV developing the site is Related Digital + Ascent + TowerBrook Capital Partners: \"Ascent\" is a co-developer of this specific facility, not the unrelated \"Ascent TOR1\" facility elsewhere in the Cambridge/Kitchener-Waterloo corridor (operated separately by Ascent Data Centers) — the two remain distinct sites, but the JV-partner overlap is worth noting. Coordinates are a Cambridge, ON city-center approximation."
  },
  {
    id: "coreweave-northlanarkshire",
    provider: "CoreWeave",
    site: "DataVita — DV1 & DV3",
    city: "North Lanarkshire",
    country: "United Kingdom",
    lat: 55.7803,
    lon: -3.9917,
    status: "Under construction",
    capacityMW: 80,
    lastUpdated: "2026-09-02",
    sources: [
      { label: "Data Center Dynamics — \"DataVita secures £300m debt facility to expand North Lanarkshire data center campus\"", url: "https://www.datacenterdynamics.com/en/news/datavita-secures-300m-debt-facility-to-expand-north-lanarkshire-data-center-campus/" },
      { label: "Data Centre Magazine — \"Behind DataVita's £300m AI Data Centre Expansion in Scotland\"", url: "https://datacentremagazine.com/news/inside-datavitas-300m-ai-data-centre-expansion-in-scotland" },
      { label: "Scottish Construction Now — \"DataVita secures £300m backing for North Lanarkshire data centre projects\"", url: "https://www.scottishconstructionnow.com/articles/datavita-secures-ps300m-backing-for-north-lanarkshire-data-centre-projects" },
      { label: "Dataconomy — \"DataVita secures $300 million AI expansion, Lanarkshire\"", url: "https://dataconomy.com/2026/08/19/datavita-secures-300-million-ai-expansion-lanarkshire/" }
    ],
    notes: "CoreWeave has contracted capacity at both DataVita's DV1 (existing facility, being expanded, 40MW) and DV3 (new-build, 40MW) under a 15-year lease, backed by a £300M debt facility (ING, ABN AMRO, Santander, SNIB, Siemens Financial Services) plus a £202M UK National Wealth Fund guarantee, part of North Lanarkshire's AI Growth Zone. Combined 80MW CoreWeave-specific figure confirmed Aug 2026 across four independent trade outlets. Coordinates are a North Lanarkshire regional approximation (council HQ, Motherwell; DataVita's campus is in Airdrie) — DataVita's exact site address wasn't confirmed in research; re-geocode once located."
  },
  {
    id: "coreweave-hillsboro",
    provider: "CoreWeave",
    site: "Flexential Hillsboro",
    city: "Hillsboro, OR",
    country: "United States",
    lat: 45.5229,
    lon: -122.9898,
    status: "Operational",
    capacityMW: null,
    lastUpdated: "2026-08-23",
    sources: [
      { label: "Data Center Dynamics — \"CoreWeave to lease Flexential data centers in Oregon and Georgia\"", url: "https://www.datacenterdynamics.com/en/news/coreweave-to-lease-flexential-data-centers-in-oregon-and-georgia/" },
      { label: "Data Center Frontier — \"Inside the Flexential-CoreWeave Alliance\"", url: "https://www.datacenterfrontier.com/colocation/article/55291596/inside-the-flexential-coreweave-alliance-scaling-ai-infrastructure-with-high-density-data-centers" }
    ],
    notes: "CoreWeave leased colocation capacity from Flexential across two existing, operational campuses — this one and Douglasville, GA (see coreweave-douglasville) — totaling 18MW combined, per CoreWeave's own CTO. No confirmed per-site split disclosed (described only as \"roughly evenly split\"), so left null here rather than guessing a per-facility number; see the Douglasville entry for the same combined total. Flexential separately has up to 72MW contiguous space available across both campuses, of which CoreWeave's 18MW is a subset. Coordinates are a Hillsboro city-center approximation."
  },
  {
    id: "coreweave-douglasville",
    provider: "CoreWeave",
    site: "Flexential Douglasville",
    city: "Douglasville, GA",
    country: "United States",
    lat: 33.7515,
    lon: -84.7477,
    status: "Operational",
    capacityMW: null,
    lastUpdated: "2026-08-23",
    sources: [
      { label: "Data Center Dynamics — \"CoreWeave to lease Flexential data centers in Oregon and Georgia\"", url: "https://www.datacenterdynamics.com/en/news/coreweave-to-lease-flexential-data-centers-in-oregon-and-georgia/" },
      { label: "Data Center Frontier — \"Inside the Flexential-CoreWeave Alliance\"", url: "https://www.datacenterfrontier.com/colocation/article/55291596/inside-the-flexential-coreweave-alliance-scaling-ai-infrastructure-with-high-density-data-centers" }
    ],
    notes: "Paired with Hillsboro, OR (see coreweave-hillsboro) under the same Flexential colocation lease — 18MW combined across both sites, no confirmed per-site split disclosed, so left null here rather than guessing. Coordinates are a Douglasville city-center approximation."
  },
  {
    id: "coreweave-lasvegas",
    provider: "CoreWeave",
    site: "LAS1 — Switch Core Campus",
    city: "Las Vegas, NV",
    country: "United States",
    lat: 36.0839,
    lon: -115.2350,
    status: "Operational",
    capacityMW: null,
    lastUpdated: "2026-08-23",
    sources: [
      { label: "CoreWeave newsroom — \"CoreWeave Opens New Data Center in Las Vegas\"", url: "https://www.coreweave.com/blog/coreweave-opens-new-data-center-in-las-vegas-opening-specialized-cloud-capabilities-for-west-coast-firms" },
      { label: "Data Center Frontier — \"Switch Hosts CoreWeave's Landmark NVIDIA GB300 Deployment\"", url: "https://www.datacenterfrontier.com/machine-learning/article/55305429/ai-at-scale-switch-hosts-coreweaves-landmark-nvidia-gb300-deployment" }
    ],
    notes: "One of CoreWeave's original three named cloud-region facilities (\"LAS1\"), hosted at Switch's Core Campus (Decatur Blvd / Badura Ave area); confirmed operational via CoreWeave's own blog, and reported hosting CoreWeave's launch deployment of Nvidia's GB300 NVL72 platform. No CoreWeave-specific MW carve-out disclosed — Switch's total campus build-out is up to 495MW, but that's the whole campus, not CoreWeave's allocation, so left null rather than guessed. Coordinates are a southwest Las Vegas valley approximation (Decatur/Badura area), not geocoded to the exact campus address."
  },
  {
    id: "coreweave-weehawken",
    provider: "CoreWeave",
    site: "LGA1",
    city: "Weehawken, NJ",
    country: "United States",
    lat: 40.7695,
    lon: -74.0201,
    status: "Operational",
    capacityMW: null,
    lastUpdated: "2026-08-23",
    sources: [
      { label: "CoreWeave newsroom — \"Introducing LGA1: CoreWeave's Cutting-Edge Data Center in NYC\"", url: "https://www.coreweave.com/blog/lga1-coreweaves-cutting-edge-data-center-in-nyc" }
    ],
    notes: "One of CoreWeave's original three named cloud-region facilities (\"LGA1\"), at the mouth of the Lincoln Tunnel in Weehawken, NJ, serving the NYC metro with sub-1ms latency to Manhattan. Confirmed live via CoreWeave's own blog (Tier 1) but no independent trade-press corroboration or MW figure found yet — worth a search at next audit. Distinct from the Kenilworth, NJ NEST campus (coreweave-kenilworth), ~20 miles away — not a duplicate. Coordinates are a Weehawken town-center approximation, not geocoded to the exact facility address."
  },
  {
    id: "aws-gilroy",
    provider: "AWS",
    site: "Gilroy Data Center",
    city: "Gilroy, CA",
    country: "United States",
    lat: 37.0175,
    lon: -121.5592,
    status: "Under construction",
    capacityMW: null,
    lastUpdated: "2026-09-14",
    sources: [
      { label: "City of Gilroy — official project page, \"Gilroy Data Center (by Amazon Web Services)\"", url: "https://www.cityofgilroy.org/1019/Gilroy-Data-Center-by-AWS", cls: "R" },
      { label: "Data Center Dynamics — \"Amazon Data Services gains approval for data center on 56 acres in Gilroy, California\"", url: "https://www.datacenterdynamics.com/en/news/amazon-data-services-gains-approval-for-data-center-on-56-acres-in-gilroy-california/" },
      { label: "CEQAnet (California state environmental review database) — \"Gilroy Data Center\" filing 2022110127", url: "https://ceqanet.lci.ca.gov/2022110127/2", cls: "R" }
    ],
    provenance: {
      location: {
        basis: "disclosed",
        asOf: "2026-09-14",
        evidence: [
          { source: 0, cls: "R", note: "City of Gilroy project page: APN 841-69-044, permit timeline (entitlement approved Jul 3, 2025; grading/utility permits issued Dec 11, 2025; building permit issued Mar 19, 2026)." },
          { source: 2, cls: "R", note: "CEQAnet state environmental review filing 2022110127 gives parcel coordinates 37.0175, -121.5592, replacing the prior city-center approximation." }
        ]
      }
    },
    notes: "56-acre site at 8050 Camino Arroyo, APN 841-69-044; two ~218,000 sq ft buildings (438,500 sq ft total) plus a security building. Approved administratively by Gilroy's Community Development Director on Jul 3, 2025, without a City Council public hearing — drew local controversy over the lack of public process. Grading/utility permits issued Dec 11, 2025; building permit issued Mar 19, 2026 (per the city's own project page). First phase requires a 49MW PG&E interconnection (a utility/facility spec, not a confirmed nameplate IT-capacity figure) plus 25 x 2.5MW emergency generators — left capacityMW null rather than treating the interconnection number as equivalent, same treatment as other entries with only a substation spec on file. A third-party figure of 98MW total capacity surfaced in a search-result summary but could not be traced to the city or to AWS — not used. Total investment reported at ~$2B, but that traces to press estimation, not an AWS-disclosed figure — treat as approximate. Coordinates now geocoded to the parcel via a CEQAnet state filing (2026-09-14), replacing the prior city-center approximation. No EPA ECHO record yet — site not yet operational."
  },
  {
    id: "aws-santaclara",
    provider: "AWS",
    site: "Mission College Data Center",
    city: "Santa Clara, CA",
    country: "United States",
    lat: 37.3860,
    lon: -121.9622,
    status: "Under construction",
    capacityMW: 20,
    lastUpdated: "2026-09-14",
    sources: [
      { label: "Silicon Valley Voice — \"SVP Makes Deal with Amazon to Power Data Center\"", url: "https://www.svvoice.com/svp-makes-deal-with-amazon-to-power-data-center/" },
      { label: "Data Center Dynamics — Silicon Valley Power to build 60kV substation for AWS Santa Clara", url: "https://www.datacenterdynamics.com/en/news/silicon-valley-power-to-build-60kv-substation-for-amazon-web-services-data-center-in-santa-clara/" },
      { label: "California Energy Commission — Mission College Data Center backup generation filing", url: "https://www.energy.ca.gov/powerplant/backup-generating-system/mission-college-data-center" }
    ],
    // WORKED EXAMPLE of the per-field provenance block documented at the top
    // of this file. This entry is a good one to learn from because its three
    // facts have genuinely different evidentiary strength, which the flat
    // `sources` array above cannot express.
    provenance: {
      capacityMW: {
        basis: "disclosed",
        asOf: "2026-08-23",
        evidence: [
          { source: 0, cls: "G", note: "Reports the 15-year SVP power agreement securing 20MW of contracted grid capacity — the basis for this figure." },
          { source: 1, cls: "T", note: "Trade-press coverage of the same utility deal and the 60kV substation built for it." }
        ]
      },
      status: {
        basis: "disclosed",
        asOf: "2026-08-23",
        evidence: [
          { source: 2, cls: "R", note: "CEC backup-generation filing — a regulatory record confirming an active, permitted build rather than an announced intention." },
          { source: 1, cls: "T", note: "Substation still under construction as of mid-2026." }
        ]
      },
      location: {
        basis: "estimated",
        asOf: "2026-08-23",
        evidence: [
          { source: 2, cls: "R", note: "Filing names the Mission College Blvd address, but the stored lat/lon is a block-level approximation, not geocoded to the parcel — hence basis 'estimated'. Replace with an OSM or PeeringDB footprint (class N) to lift this." }
        ]
      }
    },
    notes: "2305 Mission College Blvd (independently confirmed via CA state CEQAnet filings 2018032008/2020040254 — same class as the CEC filing already cited, so no new corroboration, but a consistent second state record). Checked again 2026-09-14 for a PeeringDB or OSM footprint that would geocode the exact parcel; still none found — the facility isn't peered/live yet, so location basis stays 'estimated' pending that check at a future audit. Silicon Valley Power (the city's municipal utility) signed a 15-year power agreement with AWS in Jul 2024 securing 20MW of contracted grid capacity for this site (with SVP authorized to secure up to 80MW more for other customers) — 20MW used here as the disclosed contracted-capacity figure. A separate California Energy Commission filing discloses 78.1MW of on-site backup diesel generation (43 x 2.5MW + 2 x 600kW gensets) — that's backup power, not IT load, so not used as capacityMW. SVP is building a new 60kV \"Freedom Circle Junction\" substation specifically for this site ($5.39M cost billed to Amazon, ~26-month build), still under construction as of mid-2026; developer of record is Oppidan Investment Company, building on AWS's behalf. Originally acquired for $101.4M in Dec 2019 (former PGIM Real Estate property); industry sources describe this as anchoring AWS's us-west-1 (N. California) region, though that specific framing is inferred, not AWS-confirmed. Coordinates are a Mission College Blvd-area approximation, not geocoded to the exact parcel."
  },
  {
    id: "aws-wallawalla",
    provider: "AWS",
    site: "Advance Phase LLC — Port of Walla Walla Site",
    city: "Walla Walla County, WA",
    country: "United States",
    lat: 46.0968,
    lon: -118.9088,
    status: "Planned",
    capacityMW: null,
    lastUpdated: "2026-09-14",
    sources: [
      { label: "Walla Walla County — official Amazon Data Center FAQ page", url: "https://www.wwcowa.gov/government/community_development/amazon_data_center_faqs.php" },
      { label: "Data Center Dynamics — \"AWS likely behind $4.8bn data center in Walla Walla, Washington\"", url: "https://www.datacenterdynamics.com/en/news/aws-likely-behind-48bn-data-center-in-walla-walla-washington/" }
    ],
    notes: "Port of Walla Walla sold ~554 acres to Amazon Data Services (via project entity \"Advance Phase LLC\") on Feb 12, 2026, in the Wallula/Burbank area east of US-12 near the Columbia River — more specifically the Wallula Gap Business Park along Sundance Road, ~1.4 miles east of Highway 12, between Dodd and Worden roads (still not a geocoded parcel). Reported as a ~$4.8-5B project. Initial application (Phase 1) covers 134 acres for 3 data center buildings (~218,000-220,000 sq ft each); the full master plan spans up to 16 buildings across 4 phases on the full 554 acres. The Aug 24, 2026 Traffic Impact Analysis deadline was met — Walla Walla County's Community Development Department deemed the land-use application \"complete\" in early Sep 2026 (per local reporting, single outlet, not yet independently corroborated), which moves it into substantive review but is not a permit grant — status stays Planned. No MW figure disclosed anywhere — left null rather than guessed. Re-check once the county's substantive review produces a decision. Coordinates are a Wallula/Burbank-area approximation, not geocoded to the exact parcel."
  },
  {
    id: "aws-shreveport",
    provider: "AWS",
    site: "Resilient Technology Park (STACK Infrastructure)",
    city: "Shreveport, LA",
    country: "United States",
    lat: 32.4474,
    lon: -93.9054,
    status: "Planned",
    capacityMW: null,
    lastUpdated: "2026-09-14",
    sources: [
      { label: "Data Center Dynamics — \"AWS pledges $6bn investment in data center campus in Shreveport, Louisiana\"", url: "https://www.datacenterdynamics.com/en/news/aws-pledges-6bn-investment-in-data-center-campus-in-shreveport-louisiana/" },
      { label: "KSLA — \"Amazon Web Services announces a third data center campus is coming to Shreveport\"", url: "https://www.ksla.com/2026/08/18/amazon-web-services-announces-third-data-center-campus-is-coming-shreveport/" },
      { label: "Hoodline — \"Judge Backs Amazon Data Hub in West Shreveport Showdown\" (Caddo Parish District Court ruling, Apr 20, 2026)", url: "https://hoodline.com/2026/04/judge-backs-amazon-data-hub-in-west-shreveport-showdown/", cls: "R", note: "Reports directly on the Caddo Parish District Court judgment upholding the site's special-use permit — the underlying record is the judgment itself." }
    ],
    provenance: {
      status: {
        basis: "disclosed",
        asOf: "2026-04-20",
        evidence: [
          { source: 2, cls: "R", note: "Caddo Parish District Court (Judge Ramon Lafitte) upheld the special-use permit for this site on Apr 20, 2026, dismissing a citizen/Sierra Club challenge to the City Council's permit approval — a judicial record, independent of AWS/STACK." },
          { source: 0, cls: "T" },
          { source: 1, cls: "G" }
        ]
      },
      location: {
        basis: "estimated",
        asOf: "2026-09-14",
        evidence: [
          { source: 0, cls: "T" },
          { source: 1, cls: "G", note: "Coordinates for 7340 Greenwood Road independently re-geocoded and match the stored point, but still sourced only via a commercial real-estate listing (class D), not a filing — no R/N-class source for location yet." }
        ]
      }
    },
    notes: "Third AWS/STACK Infrastructure campus in the Caddo-Bossier area, announced Aug 18, 2026 ($6B, part of an $18B total across 3 LA campuses). Distinct from the earlier two-campus, $12B Feb 2026 announcement (Louisiana Economic Development). This site's special-use permit had already been through a legal challenge predating the Aug 2026 announcement: the Shreveport City Council's approval was challenged by a citizen/Sierra Club-backed suit, and on Apr 20, 2026 the Caddo Parish District Court (Judge Ramon Lafitte) upheld the permit, dismissing the challenge — plaintiffs' attorney said they were considering an appeal, not confirmed filed as of this check. Coordinates (7340 Greenwood Road) independently geocoded to the same point already on file — the commercial-listing approximation checks out. No LDEQ air permit or MISO interconnection queue entry found for this site yet; no capacity (MW) disclosed. No confirmation vertical construction has started as of Sep 2026; re-check in ~6 months per 'Planned' cadence."
  },
  {
    id: "aws-boling",
    provider: "AWS",
    site: "Project Eagle",
    city: "Boling, TX",
    country: "United States",
    lat: 29.2583,
    lon: -95.9436,
    status: "Planned",
    capacityMW: null,
    lastUpdated: "2026-09-14",
    sources: [
      { label: "Texas Department of Licensing and Regulation — TDLR Project TABS2026027114 (\"Project Eagle,\" Amazon Data Services, Inc.)", url: "https://www.tdlr.texas.gov/TABS/Search/Print/TABS2026027114" },
      { label: "Data Center Dynamics — \"AWS files for $1.2bn data center campus outside Houston, Texas\"", url: "https://www.datacenterdynamics.com/en/news/aws-files-for-12bn-data-center-campus-outside-houston-texas/" },
      { label: "Wharton Post — \"New Filings Expand Project Eagle Plans Near Boling\"", url: "https://whartonpost.com/2026/08/06/project-eagle-expands-10-data-centers-boling/" }
    ],
    notes: "Amazon Data Services, Inc. is the registered TDLR owner. Expanded from 4 to 10 registered data-center buildings (plus 1 auxiliary water building) as of Aug 2026 filings; TDLR-registered construction cost ~$3B, broader press estimates ~$10B all-in (land+equipment). ~2,700-3,000-acre site near FM 1301/FM 442, address confirmed via TDLR filing as 234 Eaglewood Rd, Boling, TX 77420 — independently re-geocoded coordinates land within ~0.001° of the stored point, so the existing approximation checks out. Checked ERCOT's large-load queue for a matching interconnection request; the only \"Boling\" entry found (queue ID 24INR0576) is an unrelated 400MW gas-generation project with no AWS/Amazon reference — does not corroborate the single-sourced Houston Chronicle figure of 'up to 75MW at peak', which stays excluded from capacityMW pending a second source. Site prep underway but project still needs additional county permits — a groundwater district tabled two large water-well permits in Jun 2026 over community concerns; as of Sep 2026 those two permits remain tabled/unresolved (two smaller construction wells were approved in May 2026). Construction has not been confirmed to have actually started. Re-check within ~3 months given fast-moving permitting situation."
  },
  {
    id: "aws-vicksburg",
    provider: "AWS",
    site: "Warren County Data Center Campus",
    city: "Vicksburg, MS",
    country: "United States",
    lat: 32.3527,
    lon: -90.8779,
    status: "Under construction",
    capacityMW: null,
    lastUpdated: "2026-09-14",
    sources: [
      { label: "About Amazon — \"Amazon plans to invest at least $3 billion in Warren County, Mississippi, for next-generation data center campus\"", url: "https://www.aboutamazon.com/news/company-news/amazon-3-billion-mississippi-data-center-investment" },
      { label: "Office of Governor Tate Reeves — official announcement", url: "https://governorreeves.ms.gov/governor-tate-reeves-announces-amazon-plans-to-invest-3-billion-in-vicksburg/" },
      { label: "Data Center Dynamics — \"Amazon to build $3bn data center campus in Vicksburg, Mississippi\"", url: "https://www.datacenterdynamics.com/en/news/amazon-to-build-3bn-data-center-campus-in-vicksburg-mississippi/" },
      { label: "Vicksburg Post — \"Prime site: AWS announces U.S. 61 site for Vicksburg data center\"", url: "https://www.vicksburgpost.com/news/aws-announces-us-61-site-for-vicksburg-data-center-e70c02b7" }
    ],
    notes: "$3B investment, largest private investment in Warren County history; ~200 direct jobs. Site is described only at road level — along U.S. Highway 61 South, entrance road off Old Cain Ridge Rd, near the Port of Vicksburg — no parcel address published, so lat/lon here is Vicksburg's city-center coordinate, NOT the actual site; treat as approximate pending a precise address. Checked 2026-09-14 for a Warren County Board of Supervisors record (right-of-way approval, loan agreement) that would give a real parcel — only secondhand news coverage of those votes was found, not the underlying agenda/minutes; the county's own agenda portal is the next channel to try. Status upgraded from Planned to Under construction based on Apr-Jun 2026 local reporting describing entrance-road construction / site mobilization; most recent available reporting (Jun 2026) still describes only site-prep activity, no vertical building construction confirmed. No MW capacity disclosed. Re-check within 3-6 months — both the exact location and status are likely to firm up."
  },
  {
    id: "spacexai-colossus1",
    provider: "SpaceXAI",
    site: "Colossus 1",
    city: "Memphis, TN",
    country: "United States",
    lat: 35.0454,
    lon: -90.0715,
    status: "Operational",
    capacityMW: null,
    lastUpdated: "2026-08-23",
    sources: [
      { label: "NVIDIA Newsroom — \"NVIDIA Ethernet Networking Accelerates World's Largest AI Supercomputer, Built by xAI\"", url: "https://nvidianews.nvidia.com/news/spectrum-x-ethernet-networking-xai-colossus" },
      { label: "Data Center Dynamics — \"xAI targets one million GPUs for Colossus supercomputer in Memphis\"", url: "https://www.datacenterdynamics.com/en/news/xai-elon-musk-memphis-colossus-gpu/" }
    ],
    notes: "Former Electrolux manufacturing plant, 3231 Paul R. Lowry Road, South Memphis — built and made operational in a widely-reported \"122 days\" starting mid-2024, originally under the xAI name (xAI folded into SpaceX's \"SpaceXAI\" division May 2026 after the Feb 2026 SpaceX/xAI merger — see data/providers.js). GPU/power figures are contested and keep moving: reported at ~100,000 GPUs at 2024 launch, later ~230,000 (150k H100 + 50k H200 + 30k GB200), and a Jan 2026 Musk claim of 555,000 GPUs / 2GW / $18B tied to a third building on the campus — that largest figure traces mainly to Musk's own statements and vendor/newsletter blogs (Introl, SemiAnalysis), not independently verified trade press, so capacityMW is left null rather than picking one contested number. In May 2026, xAI/SpaceXAI reportedly signed a 4-year deal giving Anthropic most of this facility's compute (~220,000 GPUs, ~300MW) for ~$1.25B/month, tied to SpaceX's IPO-related SEC disclosures (TechCrunch, The Verge, Data Center Dynamics) — that's a compute lease figure, not necessarily the site's full built capacity. Coordinates are a South Memphis-area approximation, not geocoded to the exact parcel."
  },
  {
    id: "spacexai-southaven",
    provider: "SpaceXAI",
    site: "Colossus 3 (\"Macrohardrr\")",
    city: "Southaven, MS",
    country: "United States",
    lat: 34.9889,
    lon: -90.0126,
    status: "Under construction",
    capacityMW: null,
    lastUpdated: "2026-08-23",
    sources: [
      { label: "Office of Mississippi Governor Tate Reeves — official announcement", url: "https://governorreeves.ms.gov/tech-leader-xai-investing-more-than-20-billion-in-southaven/" },
      { label: "Data Center Dynamics — \"xAI confirms new data center in Mississippi, Elon Musk pledges $20bn investment in state\"", url: "https://www.datacenterdynamics.com/en/news/xai-confirms-new-data-center-in-mississippi-elon-musk-pledges-20bn-investment-in-state/" }
    ],
    notes: "2400 Stateline Road West, Southaven, MS (DeSoto County) — announced Jan 8, 2026 via the Mississippi Governor's office: >$20B investment in a data center plus adjacent power plant, described as SpaceXAI's (then xAI's) third Memphis-metro facility. Stated goal on completion is to bring the combined Memphis-metro cluster to \"nearly 2GW\" — that's an announced target, not a confirmed built figure, so capacityMW is left null. Site currently runs 69 temporary gas turbines for on-site power, under an agreed regulatory order to remove them by Jul 2027 and replace them with a permitted 1.2GW/41-turbine permanent plant. Subject of active federal litigation as of Apr 2026 (NAACP, via the Southern Environmental Law Center and Earthjustice) alleging Clean Air Act violations from the unpermitted turbines in a majority-Black community, with the U.S. DOJ moving to intervene on xAI's side in Jun 2026 citing national security — a live regulatory/reputational risk worth tracking, not routine controversy. Operations were targeted to begin Feb 2026. Coordinates are a Southaven-area approximation, not geocoded to the exact parcel."
  },
  {
    id: "spacexai-colossus2",
    provider: "SpaceXAI",
    site: "Colossus 2",
    city: "Memphis, TN",
    country: "United States",
    lat: 35.0189,
    lon: -90.0645,
    status: "Operational",
    capacityMW: null,
    lastUpdated: "2026-08-23",
    sources: [
      { label: "Data Center Dynamics — \"Elon Musk's xAI buys 1 million sq ft site for second Memphis data center\"", url: "https://www.datacenterdynamics.com/en/news/elon-musks-xai-buys-one-million-sq-ft-site-for-second-memphis-data-center/" },
      { label: "WREG — \"Residents react after xAI says second supercomputer to power up soon\"", url: "https://wreg.com/news/local/xai-memphis/residents-react-after-xai-says-second-supercomputer-to-power-up-soon/" },
      { label: "WREG — \"The ongoing development of xAI's 'Colossus 2' supercomputer\"", url: "https://wreg.com/news-3-at-3/the-ongoing-development-of-xais-colossus-2-supercomputer/" }
    ],
    notes: "5420 Tulane Road, Whitehaven, Memphis — a 1M sq ft site (existing warehouse + two adjacent parcels, ~100 acres total), ~$80M acquisition, ~Feb/Mar 2025. Only one of these sources (Data Center Dynamics) is trade press proper; the rest of this site's extensive coverage (WREG's ongoing local reporting, Bloomberg via Kurt Wagner, Yahoo, Climate and Capital Media) is general/regional press rather than industry-specialist trade press, so strictly it falls just short of this project's usual \"2 independent trade/primary-grade sources\" bar for auto-adding — logged anyway given how many independent, named, dated outlets converge on the same facts over months; that's a case where source-type grading undersells real-world confidence. First cluster reported online ~Jan 2026 (~110,000 GB200-class GPUs, ~210MW); by mid-2026 multiple outlets converge on a 300,000-350,000+ GPU range as more defensible than the higher-end figures floating around. A separate, single-sourced claim (vendor blog Introl, plus a SemiAnalysis newsletter piece) of 555,000 GPUs/$18B/2GW is NOT used here — that figure is more properly tied to the campus's later third building (see spacexai-colossus1's notes) and reads as a forward target rather than this site's built capacity. In Jun 2026, Google reportedly agreed to pay ~$920M/month (Oct 2026-Jun 2029, ~$30B total) for ~110,000 GPUs of capacity somewhere on the Memphis campus — the specific facility wasn't identified in any source found, so not attributed here. Coordinates are a Whitehaven-area approximation, not geocoded to the exact parcel."
  }
];
