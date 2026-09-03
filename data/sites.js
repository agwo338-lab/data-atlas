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
    lastUpdated: "2026-08-23",
    sources: [
      { label: "Galaxy Digital (PRNewswire) — Phase I completion", url: "https://www.prnewswire.com/news-releases/galaxy-completes-phase-i-of-its-helios-data-center-campus-delivering-133-megawatts-of-critical-it-load-to-coreweave-302818664.html" },
      { label: "Data Center Dynamics — \"CoreWeave leases another 260MW capacity from Galaxy in Texas\"", url: "https://www.datacenterdynamics.com/en/news/coreweave-leases-another-260mw-capacity-from-galaxy-in-texas/" },
      { label: "Blockspace — Galaxy delivers Helios to CoreWeave", url: "https://blockspace.media/insight/galaxy-delivers-helios-to-coreweave/" },
      { label: "Data Center Dynamics — Galaxy closes $1.4bn debt facility for Helios", url: "https://www.datacenterdynamics.com/en/news/galaxy-digital-closes-14bn-debt-facility-for-helios-data-center-campus-in-texas/" }
    ],
    notes: "15-year lease near Afton, TX, with two 5-year extension options; Galaxy expects >$1B avg annual revenue from CoreWeave over the term. Phase I (133MW critical IT / ~200MW gross) delivered, rent commencing Q2 2026. Phase II (260MW) under construction, targeting H1 2027. CoreWeave has committed to the \"full 800MW of gross power currently approved and contracted\" (≈526MW critical IT total across all phases) — 526MW used here as the critical-IT figure, consistent with how other entries report critical IT load rather than gross power. Campus's long-term scale-up target of up to 3.6GW is Galaxy's own aspirational ceiling, not a contracted figure. Coordinates are a Dickens, TX approximation, not independently geocoded to the exact campus address."
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
    capacityMW: 16,
    lastUpdated: "2026-08-23",
    sources: [
      { label: "Core Scientific investor newsroom, Mar 2024", url: "https://investors.corescientific.com/news-events/press-releases/detail/9/core-scientific-to-provide-coreweave-up-to-16-mw-of-data-center-infrastructure-to-support-ai-and-hpc-workloads-in-long-term-hosting-contract-with-potential-revenue-of-more-than-100-million" },
      { label: "Data Center Dynamics — \"CoreWeave to lease 16MW of data center space from cryptominer Core Scientific\"", url: "https://www.datacenterdynamics.com/en/news/coreweave-to-lease-16mw-of-data-center-space-from-cryptominer-core-scientific/" }
    ],
    notes: "CoreWeave's first Core Scientific hosting deal, signed Mar 2024 — predates the later Denton/Muskogee/Marble/Dalton deals. Former HPE hosting/HPC facility at 3301 Hibbetts Rd, 118,000 sq ft, 8-year contract, >$100M potential revenue ($97.8M in lease payments). A Q1 2026 Core Scientific investor summary lists this site at ~20MW as part of the company's ~590MW total CoreWeave portfolio — that figure isn't yet corroborated by a dedicated primary/trade-press source, so the original disclosed 16MW is used here; re-check for a confirmed expansion. Coordinates are an Austin city-center approximation."
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
    lastUpdated: "2026-08-23",
    sources: [
      { label: "Data Center Dynamics — \"CoreWeave to lease capacity from EdgeConneX at data center campus in Cedar Creek, Texas\"", url: "https://www.datacenterdynamics.com/en/news/coreweave-to-lease-capacity-from-edgeconnex-at-data-center-campus-in-cedar-creek-texas/" },
      { label: "Community Impact, Jul 2026 — \"AI cloud company CoreWeave to fill $440M Cedar Creek data center\"", url: "https://communityimpact.com/bastrop-cedar-creek/development/ai-cloud-company-coreweave-to-fill-440m-cedar-creek-data-center/" }
    ],
    notes: "CoreWeave named as qualifying tenant for the first of up to 19 potential EdgeConneX buildings planned at this Bastrop County campus; confirmed via the county's Dec 2024 10-year/75% property tax abatement and a Jul 2025 Texas Comptroller large-data-center-project certification. First building ($440M) under construction as of Jul 2026, expected to open ~Aug 2026. No MW figure disclosed by CoreWeave or EdgeConneX in any source found — left null rather than guessed. Re-check status soon; opening date is essentially now. Coordinates are a Cedar Creek/Bastrop County approximation."
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
    capacityMW: null,
    lastUpdated: "2026-08-23",
    sources: [
      { label: "Data Center Dynamics — \"AI startup Cohere and CoreWeave plan multibillion-dollar data center in Canada\"", url: "https://www.datacenterdynamics.com/en/news/ai-startup-cohere-and-coreweave-plan-multibillion-dollar-data-center-in-canada/" },
      { label: "The Globe and Mail — CoreWeave/Cohere Cambridge, Ontario data centre", url: "https://www.theglobeandmail.com/business/article-coreweave-ai-data-centre-cambridge-ontario-cohere/" }
    ],
    notes: "CoreWeave will operate a data center in Cambridge, Ontario with Cohere as anchor tenant; Cohere received $240M in Canadian federal funding toward a $725M facility, part of Canada's $2B Sovereign AI Compute Strategy. Property tied to TowerBrook Capital Partners, partnered with Related Digital. A \"64MW\" figure surfaced in early searches but couldn't be confirmed as specific to this site (may belong to a different, unrelated Related Digital Ontario project) — left null rather than guessed. Note: a separate, unrelated facility (\"Ascent TOR1\") also sits in the Cambridge/Kitchener-Waterloo corridor but is operated by Ascent Data Centers, with no CoreWeave connection — do not conflate the two. Coordinates are a Cambridge, ON city-center approximation."
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
    lat: 37.0058,
    lon: -121.5683,
    status: "Under construction",
    capacityMW: null,
    lastUpdated: "2026-08-23",
    sources: [
      { label: "City of Gilroy — official project page, \"Gilroy Data Center (by Amazon Web Services)\"", url: "https://www.cityofgilroy.org/1019/Gilroy-Data-Center-by-AWS" },
      { label: "Data Center Dynamics — \"Amazon Data Services gains approval for data center on 56 acres in Gilroy, California\"", url: "https://www.datacenterdynamics.com/en/news/amazon-data-services-gains-approval-for-data-center-on-56-acres-in-gilroy-california/" }
    ],
    notes: "56-acre site at 8050 Camino Arroyo; two ~218,000 sq ft buildings (438,500 sq ft total) plus a security building. Approved administratively by Gilroy's Community Development Director on Jul 3, 2025, without a City Council public hearing — drew local controversy over the lack of public process. First phase requires a 49MW PG&E interconnection (a utility/facility spec, not a confirmed nameplate IT-capacity figure) plus 25 x 2.5MW emergency generators — left capacityMW null rather than treating the interconnection number as equivalent, same treatment as other entries with only a substation spec on file. Total investment reported at ~$2B, but that traces to press estimation, not an AWS-disclosed figure — treat as approximate. The Data Center Dynamics source was read via a search-result summary (direct fetch was blocked) rather than the full article — worth a direct re-read at next audit. Coordinates are a Gilroy city-center approximation, not geocoded to 8050 Camino Arroyo."
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
    lastUpdated: "2026-08-23",
    sources: [
      { label: "Silicon Valley Voice — \"SVP Makes Deal with Amazon to Power Data Center\"", url: "https://www.svvoice.com/svp-makes-deal-with-amazon-to-power-data-center/" },
      { label: "Data Center Dynamics — Silicon Valley Power to build 60kV substation for AWS Santa Clara", url: "https://www.datacenterdynamics.com/en/news/silicon-valley-power-to-build-60kv-substation-for-amazon-web-services-data-center-in-santa-clara/" },
      { label: "California Energy Commission — Mission College Data Center backup generation filing", url: "https://www.energy.ca.gov/powerplant/backup-generating-system/mission-college-data-center" }
    ],
    notes: "2305 Mission College Blvd. Silicon Valley Power (the city's municipal utility) signed a 15-year power agreement with AWS in Jul 2024 securing 20MW of contracted grid capacity for this site (with SVP authorized to secure up to 80MW more for other customers) — 20MW used here as the disclosed contracted-capacity figure. A separate California Energy Commission filing discloses 78.1MW of on-site backup diesel generation (43 x 2.5MW + 2 x 600kW gensets) — that's backup power, not IT load, so not used as capacityMW. SVP is building a new 60kV \"Freedom Circle Junction\" substation specifically for this site ($5.39M cost billed to Amazon, ~26-month build), still under construction as of mid-2026; developer of record is Oppidan Investment Company, building on AWS's behalf. Originally acquired for $101.4M in Dec 2019 (former PGIM Real Estate property); industry sources describe this as anchoring AWS's us-west-1 (N. California) region, though that specific framing is inferred, not AWS-confirmed. Coordinates are a Mission College Blvd-area approximation, not geocoded to the exact parcel."
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
    lastUpdated: "2026-08-23",
    sources: [
      { label: "Walla Walla County — official Amazon Data Center FAQ page", url: "https://www.wwcowa.gov/government/community_development/amazon_data_center_faqs.php" },
      { label: "Data Center Dynamics — \"AWS likely behind $4.8bn data center in Walla Walla, Washington\"", url: "https://www.datacenterdynamics.com/en/news/aws-likely-behind-48bn-data-center-in-walla-walla-washington/" }
    ],
    notes: "Port of Walla Walla sold ~554 acres to Amazon Data Services (via project entity \"Advance Phase LLC\") on Feb 12, 2026, in the Wallula/Burbank area east of US-12 near the Columbia River. Reported as a ~$4.8-5B project. Initial application (Phase 1) covers 134 acres for 3 data center buildings (~218,000-220,000 sq ft each); the full master plan spans up to 16 buildings across 4 phases on the full 554 acres. As of Aug 11, 2026 (most recent check), permitting remained incomplete — a Traffic Impact Analysis was due Aug 24, 2026, and the county's own site states no application had yet been received as of its Jun 24, 2026 update. No MW figure disclosed anywhere — left null rather than guessed. Re-check status after the Aug 24, 2026 permitting deadline. Coordinates are a Wallula/Burbank-area approximation, not geocoded to the exact parcel."
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
    lastUpdated: "2026-09-01",
    sources: [
      { label: "Data Center Dynamics — \"AWS pledges $6bn investment in data center campus in Shreveport, Louisiana\"", url: "https://www.datacenterdynamics.com/en/news/aws-pledges-6bn-investment-in-data-center-campus-in-shreveport-louisiana/" },
      { label: "KSLA — \"Amazon Web Services announces a third data center campus is coming to Shreveport\"", url: "https://www.ksla.com/2026/08/18/amazon-web-services-announces-third-data-center-campus-is-coming-shreveport/" }
    ],
    notes: "Third AWS/STACK Infrastructure campus in the Caddo-Bossier area, announced Aug 18, 2026 ($6B, part of an $18B total across 3 LA campuses). Distinct from the earlier two-campus, $12B Feb 2026 announcement (Louisiana Economic Development). Coordinates approximate, from a commercial real-estate listing for the 7340 Greenwood Road parcel, not an official filing — no capacity (MW) disclosed. No confirmation construction has started on this specific campus as of Sep 2026; re-check in ~6 months per 'Planned' cadence."
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
    lastUpdated: "2026-09-01",
    sources: [
      { label: "Texas Department of Licensing and Regulation — TDLR Project TABS2026027114 (\"Project Eagle,\" Amazon Data Services, Inc.)", url: "https://www.tdlr.texas.gov/TABS/Search/Print/TABS2026027114" },
      { label: "Data Center Dynamics — \"AWS files for $1.2bn data center campus outside Houston, Texas\"", url: "https://www.datacenterdynamics.com/en/news/aws-files-for-12bn-data-center-campus-outside-houston-texas/" },
      { label: "Wharton Post — \"New Filings Expand Project Eagle Plans Near Boling\"", url: "https://whartonpost.com/2026/08/06/project-eagle-expands-10-data-centers-boling/" }
    ],
    notes: "Amazon Data Services, Inc. is the registered TDLR owner. Expanded from 4 to 10 registered data-center buildings (plus 1 auxiliary water building) as of Aug 2026 filings; TDLR-registered construction cost ~$3B, broader press estimates ~$10B all-in (land+equipment). ~2,700-3,000-acre site near FM 1301/FM 442, addresses on Eaglewood Rd. Site prep underway but project still needs additional county permits (a groundwater district tabled two large water-well permits in Jun 2026 over community concerns) — construction has not been confirmed to have actually started. One source (Houston Chronicle investigation, recirculated elsewhere) cites 'up to 75MW at peak' but this is single-sourced and not independently corroborated — left out of capacityMW pending a second source. Coordinates are Boling town-center approximation; exact parcel address (e.g. 270 Eaglewood Rd) not geocoded. Re-check within ~3 months given fast-moving permitting situation."
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
    lastUpdated: "2026-09-01",
    sources: [
      { label: "About Amazon — \"Amazon plans to invest at least $3 billion in Warren County, Mississippi, for next-generation data center campus\"", url: "https://www.aboutamazon.com/news/company-news/amazon-3-billion-mississippi-data-center-investment" },
      { label: "Office of Governor Tate Reeves — official announcement", url: "https://governorreeves.ms.gov/governor-tate-reeves-announces-amazon-plans-to-invest-3-billion-in-vicksburg/" },
      { label: "Data Center Dynamics — \"Amazon to build $3bn data center campus in Vicksburg, Mississippi\"", url: "https://www.datacenterdynamics.com/en/news/amazon-to-build-3bn-data-center-campus-in-vicksburg-mississippi/" },
      { label: "Vicksburg Post — \"Prime site: AWS announces U.S. 61 site for Vicksburg data center\"", url: "https://www.vicksburgpost.com/news/aws-announces-us-61-site-for-vicksburg-data-center-e70c02b7" }
    ],
    notes: "$3B investment, largest private investment in Warren County history; ~200 direct jobs. Site is described only at road level — along U.S. Highway 61 South, entrance road off Old Cain Ridge Rd, near the Port of Vicksburg — no parcel address published, so lat/lon here is Vicksburg's city-center coordinate, NOT the actual site; treat as approximate pending a precise address. Status upgraded from Planned to Under construction based on Apr-Jun 2026 local reporting describing entrance-road construction / site mobilization (no confirmation of vertical building construction yet). No MW capacity disclosed. Re-check within 3-6 months — both the exact location and status are likely to firm up."
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
