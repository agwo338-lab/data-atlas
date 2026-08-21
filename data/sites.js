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
//   sources      array of { label, url } — every claim above should trace to one of these
//   notes        your own free-text notes — anything you want to remember
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
//    (MW, $ investment, a date) should trace to Tier 1 or Tier 2 — use two
//    independent sources if the number is large or newsworthy.
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
    lastUpdated: "2026-08-21",
    sources: [
      { label: "Nebius newsroom, Mar 2026", url: "https://nebius.com/newsroom/nebius-to-construct-310-mw-ai-factory-in-finland" },
      { label: "Finnish AI Region, Apr 2026", url: "https://www.fairedih.fi/en/2026/04/14/nebius-plans-e8-5-billion-data-centre-in-lappeenranta-cementing-finland-as-its-european-base/" },
      { label: "Polarnode newsroom, May 2026", url: "https://www.polarnode.fi/polarnode-begins-pre-construction-works-for-the-lappeenranta-data-center-project/" }
    ],
    notes: "€8.5B project; first capacity expected 2027. Polarnode (developer) began pre-construction works in the Pajarila district in May 2026, confirmed by the City of Lappeenranta's own site — status updated from \"Planned\" accordingly."
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
    lastUpdated: "2026-08-21",
    sources: [
      { label: "Data Center Dynamics — \"Nebius signs 22MW capacity agreement with Kao Data in the UK\"", url: "https://www.datacenterdynamics.com/en/news/nebius-signs-22mw-capacity-agreement-with-kao-data-in-the-uk/" },
      { label: "Kao Data newsroom", url: "https://kaodata.com/discover/news/nebius-chooses-kao-datas-harlow-campus-for-major-ai-infrastructure-deployment/" }
    ],
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
    lastUpdated: "2026-08-21",
    sources: [
      { label: "Nebius/Businesswire, Mar 2025 — \"adding up to 300 MW capacity\"", url: "https://www.businesswire.com/news/home/20250305405030/en/Nebius-accelerates-US-expansion-adding-up-to-300-MW-capacity-at-new-data-center-in-New-Jersey" },
      { label: "Data Centre Magazine", url: "https://datacentremagazine.com/articles/dataone-and-nebius-partner-for-new-300mw-ai-data-centre" },
      { label: "WHYY, Aug 2026 — Vineland planning board approves Phase 2", url: "https://whyy.org/articles/vineland-planning-board-approves-data-center-plan/" }
    ],
    notes: "300MW was the primary-source figure from the original Mar 2025 Nebius/Businesswire release; the dataset previously used a more conservative 100MW \"installed by end-2025\" milestone, but that undersold the disclosed total. Phase 1 is under construction targeting full operation in 2026; Phase 2 (~600,000 sq ft addition) was approved by the Vineland Planning Board on Aug 18, 2026. Some secondary press floats a further expansion toward 350MW — not yet confirmed by a primary Nebius source, so not used here. Site is reportedly part of fulfilling Nebius's ~$17.4B Microsoft compute deal."
  },
  {
    id: "coreweave-kristiansand",
    provider: "CoreWeave",
    site: "N01 Datacenter Campus (Bulk Infrastructure)",
    city: "Kristiansand",
    country: "Norway",
    lat: 58.1467,
    lon: 7.9956,
    status: "Under construction",
    capacityMW: 400,
    lastUpdated: "2026-08-20",
    sources: [
      { label: "Bulk Infrastructure newsroom", url: "https://bulkinfrastructure.com/newsroom/coreweave-partners-with-bulk-infrastructure" },
      { label: "Nordic Property News", url: "https://www.nordicpropertynews.com/article/10575/one-of-europes-largest-data-centers-will-be-built-in-norway" }
    ],
    notes: "One of the largest single NVIDIA AI deployments announced in Europe; site has room to expand toward 1GW. Targeted for operation by summer 2025 per the original announcement — marked as under construction here since current live status wasn't independently confirmed."
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
    lastUpdated: "2026-08-21",
    sources: [
      { label: "Core Scientific investor newsroom, Feb 2025", url: "https://investors.corescientific.com/news-events/press-releases/detail/110/core-scientific-and-coreweave-announce-1-2-billion-expansion-at-denton-tx-site" },
      { label: "Data Center Dynamics, Apr 2026", url: "https://www.datacenterdynamics.com/en/news/coreweave-deploys-16000-gpus-at-delayed-data-center-in-denton-texas/" }
    ],
    notes: "Former Core Scientific bitcoin-mining site, converted for CoreWeave (reportedly hosting OpenAI workloads) under a $6.1B conversion. 260MW is the disclosed critical IT load. Coordinates are city-center approximation (site address reported as 8171 Jim Christal Rd, Denton — not independently geocoded)."
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
    lastUpdated: "2026-08-21",
    sources: [
      { label: "Applied Digital investor newsroom, Jun 2025", url: "https://ir.applieddigital.com/news-events/press-releases/detail/123/applied-digital-announces-250mw-ai-data-center-lease-with" },
      { label: "Applied Digital investor newsroom, Aug 2025", url: "https://ir.applieddigital.com/news-events/press-releases/detail/128/applied-digital-finalizes-additional-150mw-lease-with" },
      { label: "Data Center Dynamics, Oct 2025", url: "https://www.datacenterdynamics.com/en/news/first-50mw-ready-for-service-at-applied-digital-data-center-in-ellendale-north-dakota/" }
    ],
    notes: "Applied Digital's Polaris Forge 1 campus, fully contracted to CoreWeave (400MW across 3 buildings, ~15-year leases, ~$11B total anticipated lease revenue). Building 1 (100MW) fully energized Nov 2025; Building 2 (150MW) partially live (~75MW) as of ~Jul 2026; Building 3 (150MW) targeted 2027 — status set to \"Under construction\" reflecting the incomplete buildout. Campus designed to scale to 1GW long-term, per Applied Digital — that headline figure is aspirational/not yet contracted, distinct from the 400MW CoreWeave commitment."
  }
];
