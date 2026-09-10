// Site Atlas — source classes, channel catalog, and the confidence engine
//
// WHY THIS FILE EXISTS
// -------------------
// The original sourcing standard (see data/sites.js) graded sources by
// publisher quality: primary > trade press > directory. That is a reasonable
// *quality* scale, but it silently answered the wrong question. "Two
// independent A/B sources agree" was the bar for High confidence — except
// when Data Center Dynamics and Data Center Frontier both write up the same
// operator press release, that is ONE source wearing two hats. The claim got
// two ticks and neither tick was independent of the company making the claim.
//
// So this file replaces publisher-grade independence with SOURCE-CLASS
// independence. Two pieces of evidence only corroborate each other if they
// come from different classes below — because different classes are produced
// by different actors, for different reasons, with different incentives to
// shade the truth.
//
// Nothing here is a build step. This is a plain script tag like every other
// data file; index.html reads it directly.
//
// ---------------------------------------------------------------------------

// ---- Source classes -------------------------------------------------------
//
// `weight` is only used for tie-breaking and display ordering. The confidence
// rules below care about class *diversity* and about whether at least one
// piece of evidence is NON-PROMOTIONAL (`independent: true`), not about
// adding weights up.
var SOURCE_CLASSES = {
  R: {
    code: "R",
    label: "Regulatory record",
    short: "Regulatory",
    color: "#4ADE80",
    weight: 3,
    independent: true,
    blurb: "Permits, grid interconnection queues, securities filings, planning dockets, government registers.",
    why: "Filed under legal obligation, with consequences for misstatement, and usually filed before any announcement. The earliest and hardest signal available."
  },
  N: {
    code: "N",
    label: "Network telemetry",
    short: "Network",
    color: "#5B9BE0",
    weight: 2,
    independent: true,
    blurb: "PeeringDB facility records, cloud region and IP-range metadata, BGP and whois, OpenStreetMap footprints.",
    why: "Reflects infrastructure that is actually running and reachable. A press release can describe a site that does not exist; a routed prefix cannot."
  },
  O: {
    code: "O",
    label: "Direct observation",
    short: "Observed",
    color: "#C97AD1",
    weight: 2,
    independent: true,
    blurb: "Satellite imagery (Sentinel-2 and similar), imagery-derived footprints, site-specific hiring signals.",
    why: "Answers the one question no document answers: is the thing physically there yet. The main antidote to press-release optimism on Planned and Under-construction entries."
  },
  P: {
    code: "P",
    label: "Primary corporate",
    short: "Corporate",
    color: "#E39149",
    weight: 2,
    independent: false,
    blurb: "The operator's own newsroom, investor relations, earnings call, or a named executive quote.",
    why: "Authoritative about intent and the best source for what a company has committed to — but it is the interested party. Rounds up, blurs 'targeting' into 'planned', and never volunteers a slipped date."
  },
  T: {
    code: "T",
    label: "Trade press",
    short: "Trade",
    color: "#D9C24E",
    weight: 1,
    independent: false,
    blurb: "Named, dated industry press with a specialist beat — Data Center Dynamics, Data Center Frontier, Datacentre Magazine.",
    why: "Good at spotting and contextualising a story. But for a specific hard number it is usually restating a press release, so by default it does not corroborate the corporate source it is reporting on."
  },
  G: {
    code: "G",
    label: "General press",
    short: "General",
    color: "#E0708A",
    weight: 1,
    independent: false,
    blurb: "Business, financial, and local news without a data center specialism — Reuters, Bloomberg, regional outlets.",
    why: "Useful for local colour a trade outlet misses (opposition, council votes, land deals). Weak on precise capacity or power figures. Also usually derivative."
  },
  D: {
    code: "D",
    label: "Directory",
    short: "Directory",
    color: "#8FA39C",
    weight: 0,
    independent: false,
    blurb: "Aggregators and reference listings — Baxtel, datacenters.com, Cloudscene, Wikipedia.",
    why: "Fine for 'this facility exists, roughly here'. Never sufficient on its own for any hard number, and never counts toward corroboration of one."
  },
  U: {
    code: "U",
    label: "Unattributed",
    short: "Unattributed",
    color: "#6B7C76",
    weight: 0,
    independent: false,
    blurb: "No named author, publisher, or date — blogs, forums, social posts, scraped content farms.",
    why: "Never a basis for a claim. May be recorded as a lead worth chasing; may not be cited as evidence."
  }
};

// Display order for legends and chips.
var SOURCE_CLASS_ORDER = ["R", "N", "O", "P", "T", "G", "D", "U"];

// ---- Channel catalog ------------------------------------------------------
//
// Concrete places evidence can come from. This is the working shopping list
// for research: what exists, what class it counts as, how current it is, and
// how hard it is to pull. `access` is deliberately honest about effort —
// "JSON API" and "PDF docket search" are very different afternoons.
var SOURCE_CHANNELS = [
  // --- Class R: regulatory ---
  {
    id: "epa-echo",
    name: "EPA ECHO / Facility Registry Service",
    cls: "R",
    scope: "United States",
    gives: "Nationwide list of permitted facilities under NAICS 518210 (data processing and hosting): coordinates, operator of record (often the shell LLC), air permit IDs, water discharge permits.",
    cadence: "Continuous",
    access: "Free REST/JSON, no key",
    url: "https://echo.epa.gov/tools/web-services"
  },
  {
    id: "state-air-permits",
    name: "State air quality permits (VA DEQ, TCEQ, GA EPD, AZ ADEQ)",
    cls: "R",
    scope: "United States, per state",
    gives: "Backup generator count and nameplate kW — the best capacity proxy available before a site is announced. Filed by the developer, under oath, often years early.",
    cadence: "Continuous",
    access: "Per-state docket search, mostly HTML and PDF",
    url: "https://www.deq.virginia.gov/permits-regulations/permits/air"
  },
  {
    id: "ercot-large-load",
    name: "ERCOT large load interconnection queue",
    cls: "R",
    scope: "Texas",
    gives: "Requested MW, county, and target energization date for large loads. As of April 2026 ERCOT reported roughly 410 GW of large load in the queue, about 87% of it data centers.",
    cadence: "Monthly",
    access: "Published XLSX",
    url: "https://www.ercot.com/services/rq/large-load-integration"
  },
  {
    id: "iso-queues",
    name: "PJM / MISO / CAISO / NYISO / ISO-NE service queues",
    cls: "R",
    scope: "United States, per market",
    gives: "Generation and large-load interconnection requests with MW and in-service dates. PJM's Data Miner 2 exposes a real API; the others vary.",
    cadence: "Monthly to quarterly",
    access: "Mixed — PJM has an API, others publish spreadsheets",
    url: "https://dataminer2.pjm.com/list"
  },
  {
    id: "sec-edgar",
    name: "SEC EDGAR full-text search",
    cls: "R",
    scope: "US-listed operators and REITs",
    gives: "10-K, 10-Q and 8-K disclosures: leased and booked MW, development backlog, capex, and occasionally site-level lease terms. Legally binding language, unlike a newsroom post.",
    cadence: "Quarterly, plus event-driven 8-Ks",
    access: "Free JSON API (efts.sec.gov)",
    url: "https://www.sec.gov/edgar/search/"
  },
  {
    id: "county-planning",
    name: "County and municipal planning records",
    cls: "R",
    scope: "United States, per jurisdiction",
    gives: "Rezoning applications, site plans, conditional use permits, board agendas — building square footage, parcel boundaries, and the real timeline including delays.",
    cadence: "Per meeting cycle",
    access: "Per-county portals; some expose ArcGIS REST",
    url: "https://www.loudoun.gov/1069/Land-Development-Applications"
  },
  {
    id: "eu-grid-registers",
    name: "TSO connection registers — National Grid TEC, Fingrid, Statnett, EirGrid",
    cls: "R",
    scope: "United Kingdom, Nordics, Ireland",
    gives: "Contracted transmission capacity and connection dates. The UK TEC register in particular is a straightforward public list of who holds grid capacity and when it energises.",
    cadence: "Monthly to quarterly",
    access: "Published XLSX and open data portals",
    url: "https://www.neso.energy/data-portal"
  },
  {
    id: "eu-eed-database",
    name: "EU Energy Efficiency Directive Art. 12 data centre database",
    cls: "R",
    scope: "European Union",
    gives: "Reporting obligation for facilities at or above 500 kW IT load. Caveat: the European database publishes EU- and country-level aggregates, not per-facility rows — treat it as context, not as a site source. Some national implementations publish more granular registers; verify per country before citing.",
    cadence: "Annual",
    access: "Commission portal; national registers vary",
    url: "https://energy.ec.europa.eu/topics/energy-efficiency/energy-efficient-products/data-centres_en"
  },

  // --- Class N: network ---
  {
    id: "peeringdb",
    name: "PeeringDB",
    cls: "N",
    scope: "Global",
    gives: "Facility records with street address, operator, and exchange presence. Ground truth for whether a facility exists and where it actually is — useful for correcting coordinates taken from press coverage.",
    cadence: "Continuous",
    access: "Free JSON API",
    url: "https://www.peeringdb.com/apidocs/"
  },
  {
    id: "cloud-region-metadata",
    name: "Cloud provider region and IP-range metadata",
    cls: "N",
    scope: "Hyperscalers",
    gives: "Published region and availability-zone lists, plus Azure's weekly per-region IP range JSON — hyperscaler footprint and expansion without waiting for an announcement.",
    cadence: "Weekly",
    access: "Free JSON",
    url: "https://www.microsoft.com/en-us/download/details.aspx?id=56519"
  },
  {
    id: "osm-overpass",
    name: "OpenStreetMap / Overpass API",
    cls: "N",
    scope: "Global",
    gives: "Building footprints tagged telecom=data_center, with geometry. Good for verifying and tightening coordinates and for estimating physical scale.",
    cadence: "Continuous",
    access: "Free Overpass API",
    url: "https://overpass-api.de/"
  },

  // --- Class O: observation ---
  {
    id: "sentinel2",
    name: "Sentinel-2 optical imagery (Copernicus)",
    cls: "O",
    scope: "Global",
    gives: "Roughly 10 m resolution on a ~5-day revisit, free. Enough to tell whether a 'targeting 2027' campus has a poured slab, a steel frame, or an empty field.",
    cadence: "About every 5 days",
    access: "Free via Copernicus Data Space",
    url: "https://dataspace.copernicus.eu/"
  },
  {
    id: "hiring-signals",
    name: "Site-specific hiring signals",
    cls: "O",
    scope: "Global",
    gives: "A critical facilities technician or data center operations req tied to a named location is a reliable leading indicator that a site is being brought into service, typically months ahead of any launch announcement.",
    cadence: "Continuous",
    access: "Operator career pages",
    url: ""
  },

  // --- Class P/T/G/D: what the atlas already runs on ---
  {
    id: "operator-newsroom",
    name: "Operator newsroom and investor relations",
    cls: "P",
    scope: "Global",
    gives: "Announcements, capacity targets, campus plans, earnings commentary. Authoritative on intent, interested on facts.",
    cadence: "Event-driven",
    access: "Web",
    url: ""
  },
  {
    id: "trade-press",
    name: "Data Center Dynamics, Data Center Frontier, Datacentre Magazine",
    cls: "T",
    scope: "Global",
    gives: "The industry beat. Best single channel for discovering that something happened at all.",
    cadence: "Daily",
    access: "Web",
    url: "https://www.datacenterdynamics.com/"
  },
  {
    id: "general-press",
    name: "Business, financial, and local press",
    cls: "G",
    scope: "Global",
    gives: "Local council fights, land transactions, community opposition, and market context that the trade press does not cover.",
    cadence: "Daily",
    access: "Web",
    url: ""
  },
  {
    id: "directories",
    name: "Baxtel, datacenters.com, Cloudscene, Wikipedia",
    cls: "D",
    scope: "Global",
    gives: "Existence and rough location. Never a hard number.",
    cadence: "Irregular",
    access: "Web",
    url: "https://baxtel.com/"
  }
];

// ---- Host-to-class mapping ------------------------------------------------
//
// Every source already recorded in data/sites.js is a {label, url} pair with
// no class on it. Rather than hand-migrate roughly 90 citations, classify them
// from the URL host. An entry may still override this by declaring a class
// explicitly on the source object (cls: "R"), which always wins.
//
// Order matters: the first matching rule applies. Matches are on hostname.
var HOST_CLASS_RULES = [
  // Regulatory / government — matched first so a .gov never falls through.
  { match: /(^|\.)sec\.gov$/,                     cls: "R" },
  { match: /(^|\.)ercot\.com$/,                   cls: "R" },
  { match: /(^|\.)pjm\.com$/,                     cls: "R" },
  { match: /(^|\.)epa\.gov$/,                     cls: "R" },
  { match: /\.gov$/,                              cls: "R" },
  { match: /\.gov\.uk$/,                          cls: "R" },
  { match: /(^|\.)europa\.eu$/,                   cls: "R" },
  { match: /(^|\.)fingrid\.fi$/,                  cls: "R" },
  { match: /(^|\.)neso\.energy$/,                 cls: "R" },
  { match: /(^|\.)nationalgrideso\.com$/,         cls: "R" },

  // Network telemetry.
  { match: /(^|\.)peeringdb\.com$/,               cls: "N" },
  { match: /(^|\.)openstreetmap\.org$/,           cls: "N" },
  { match: /(^|\.)overpass-api\.de$/,             cls: "N" },

  // Observation.
  { match: /(^|\.)copernicus\.eu$/,               cls: "O" },

  // Primary corporate — investor-relations and newsroom subdomains, plus the
  // wire services companies use to publish their own statements.
  { match: /^(investors?|ir)\./,                  cls: "P" },
  { match: /(^|\.)businesswire\.com$/,            cls: "P" },
  { match: /(^|\.)prnewswire\.com$/,              cls: "P" },
  { match: /(^|\.)globenewswire\.com$/,           cls: "P" },
  { match: /(^|\.)nvidianews\.nvidia\.com$/,      cls: "P" },
  { match: /(^|\.)aboutamazon\.com$/,             cls: "P" },

  // Trade press.
  { match: /(^|\.)datacenterdynamics\.com$/,      cls: "T" },
  { match: /(^|\.)datacenterfrontier\.com$/,      cls: "T" },
  { match: /(^|\.)datacentremagazine\.com$/,      cls: "T" },
  { match: /(^|\.)datacenterknowledge\.com$/,     cls: "T" },
  { match: /(^|\.)dataconomy\.com$/,              cls: "T" },
  { match: /(^|\.)blockspace\.media$/,            cls: "T" },

  // Directories and reference.
  { match: /(^|\.)wikipedia\.org$/,               cls: "D" },
  { match: /(^|\.)baxtel\.com$/,                  cls: "D" },
  { match: /(^|\.)datacenters\.com$/,             cls: "D" },
  { match: /(^|\.)cloudscene\.com$/,              cls: "D" },

  // General / financial press.
  { match: /(^|\.)reuters\.com$/,                 cls: "G" },
  { match: /(^|\.)bloomberg\.com$/,               cls: "G" },
  { match: /(^|\.)wsj\.com$/,                     cls: "G" },
  { match: /(^|\.)ft\.com$/,                      cls: "G" },
  { match: /(^|\.)theglobeandmail\.com$/,         cls: "G" },
  { match: /(^|\.)yahoo\.com$/,                   cls: "G" },
  { match: /(^|\.)cnbc\.com$/,                    cls: "G" }
];

// Matches the way an SEC filing is normally labelled in a citation:
// "SEC 8-K", "Form 10-K", "10-Q", "S-1", "Exhibit 99.1", "proxy statement".
var SEC_FILING_LABEL = /\b(SEC\b|8-K|10-K|10-Q|20-F|S-1|424B|DEF 14A|Exhibit 99)/i;

function hostOf(url){
  var m = String(url || "").match(/^https?:\/\/([^\/?#]+)/i);
  return m ? m[1].toLowerCase().replace(/:\d+$/, "") : "";
}

// A crude but effective operator-domain test: strip the provider name to
// letters and digits and see whether it appears in the hostname. "Nebius" ->
// nebius.com, "CoreWeave" -> coreweave.com, "Applied Digital" ->
// applieddigital.com. Deliberately conservative; a miss falls through to the
// generic rules and lands on G, which is the safe direction to be wrong in.
function looksLikeOperatorDomain(host, provider){
  if (!host || !provider) return false;
  var slug = String(provider).toLowerCase().replace(/[^a-z0-9]/g, "");
  if (slug.length < 4) return false;
  return host.replace(/[^a-z0-9]/g, "").indexOf(slug) !== -1;
}

// Returns a class code for one {label, url, cls?} source object.
// `provider` is optional and only used for the operator-domain check.
function classifySource(source, provider){
  if (!source) return "U";
  if (source.cls && SOURCE_CLASSES[source.cls]) return source.cls;

  var host = hostOf(source.url);
  if (!host) return "U";

  var matched = null;
  for (var i = 0; i < HOST_CLASS_RULES.length; i++) {
    if (HOST_CLASS_RULES[i].match.test(host)) { matched = HOST_CLASS_RULES[i].cls; break; }
  }
  if (matched === null && looksLikeOperatorDomain(host, provider)) matched = "P";

  // A securities filing is a regulatory record wherever it is mirrored — the
  // legal-obligation property belongs to the document, not to the web server.
  // Companies routinely host their own 8-Ks and 10-Ks on an investor-relations
  // subdomain, which the host rules above would otherwise read as PR.
  // Deliberately narrow: only upgrades something already classified as the
  // operator's own channel, so a trade article merely *about* a filing (which
  // classifies as T or G) is not swept up by it.
  if (matched === "P" && SEC_FILING_LABEL.test(String(source.label || ""))) return "R";
  if (matched !== null) return matched;

  // Everything left is a named outlet not specifically catalogued: local
  // news, regional business journals, niche publications. Class G is the
  // honest default — a real publisher with no data center specialism, which
  // does not corroborate a corporate claim on its own.
  return "G";
}

// ---- Staleness ------------------------------------------------------------
//
// How fast a fact decays depends on both the field and the site's status. A
// planned project's capacity target ages in months; a building's coordinates
// do not age at all. Values are days.
var STALENESS_DAYS = {
  capacityMW: { Planned: 180, "Under construction": 180, Operational: 540, _default: 365 },
  status:     { Planned: 180, "Under construction": 180, Operational: 730, _default: 365 },
  location:   { _default: 3650 },
  _default:   { _default: 365 }
};

function stalenessWindow(field, status){
  var byField = STALENESS_DAYS[field] || STALENESS_DAYS._default;
  return byField[status] != null ? byField[status] : byField._default;
}

function daysBetween(isoA, isoB){
  var a = Date.parse(isoA), b = Date.parse(isoB);
  if (isNaN(a) || isNaN(b)) return null;
  return Math.round((b - a) / 86400000);
}

// ---- The confidence engine ------------------------------------------------
//
// This is the part that actually changed. Old rule: count A/B sources. New
// rule: count DISTINCT CLASSES, and require at least one of them to be
// non-promotional — produced by someone other than the operator, or someone
// restating the operator.
//
//   High        2+ distinct classes, at least one independent (R/N/O),
//               and the freshest evidence within the staleness window.
//   Medium      2+ distinct classes but all promotional or derivative
//               (P/T/G), or a single regulatory-class source on its own.
//   Low         one class only, or every source outside the staleness
//               window, or sources known to conflict.
//   Unverified  nothing usable — no evidence, or only D/U class.
//
// CONSEQUENCE, stated plainly: under this rule most existing entries drop
// from "High" to "Medium", because the atlas is currently built almost
// entirely on trade press restating operator announcements. That is not a
// regression in the data; it is the data being described accurately for the
// first time. It also tightens the auto-apply gate in CLAUDE.md, since that
// gate keys off High.
var CONFIDENCE_LEVELS = {
  high:       { key: "high",       label: "High",       color: "#4ADE80", rank: 3 },
  medium:     { key: "medium",     label: "Medium",     color: "#FBBF24", rank: 2 },
  low:        { key: "low",        label: "Low",        color: "#E0708A", rank: 1 },
  unverified: { key: "unverified", label: "Unverified", color: "#8FA39C", rank: 0 }
};

// evidence: array of { cls, asOf }, already classified.
// opts: { field, status, asOfToday, conflicting }
function scoreEvidence(evidence, opts){
  opts = opts || {};
  var today = opts.asOfToday || new Date().toISOString().slice(0, 10);
  var list = (evidence || []).filter(function(e){ return e && e.cls && SOURCE_CLASSES[e.cls]; });

  // D and U never count toward corroboration. They stay on the entry so the
  // citation is not lost, but they cannot lift a claim.
  var counting = list.filter(function(e){ return SOURCE_CLASSES[e.cls].weight > 0; });

  var classes = [];
  counting.forEach(function(e){ if (classes.indexOf(e.cls) === -1) classes.push(e.cls); });

  var hasIndependent = classes.some(function(c){ return SOURCE_CLASSES[c].independent; });
  var hasRegulatory  = classes.indexOf("R") !== -1;

  var dates = counting.map(function(e){ return e.asOf; }).filter(Boolean).sort();
  var freshest = dates.length ? dates[dates.length - 1] : null;
  var win = stalenessWindow(opts.field, opts.status);
  var age = freshest ? daysBetween(freshest, today) : null;
  var stale = age != null ? age > win : true;

  var level;
  if (classes.length === 0) {
    level = "unverified";
  } else if (opts.conflicting) {
    level = "low";
  } else if (classes.length >= 2 && hasIndependent && !stale) {
    level = "high";
  } else if (classes.length >= 2 || hasRegulatory) {
    level = stale ? "low" : "medium";
  } else {
    level = "low";
  }

  return {
    level: level,
    classes: classes,
    hasIndependent: hasIndependent,
    freshest: freshest,
    ageDays: age,
    window: win,
    stale: stale,
    counted: counting.length,
    discounted: list.length - counting.length,
    // A short, honest sentence about why it landed where it did. This is what
    // the UI shows, and it is the whole point of the exercise.
    reason: explainScore(classes, hasIndependent, hasRegulatory, stale, opts)
  };
}

function explainScore(classes, hasIndependent, hasRegulatory, stale, opts){
  if (opts.conflicting) return "Sources conflict on this field — flagged for a human call rather than silently resolved.";
  if (!classes.length) return "No usable evidence recorded — nothing above directory or unattributed grade.";
  var names = classes.map(function(c){ return SOURCE_CLASSES[c].short.toLowerCase(); }).join(" + ");
  if (classes.length >= 2 && hasIndependent && !stale) {
    return "Corroborated across " + classes.length + " independent source classes (" + names + "), at least one non-promotional, and current.";
  }
  if (stale) {
    return "Evidence exists (" + names + ") but the freshest piece is older than this field's re-check window, so it is not treated as current.";
  }
  if (classes.length >= 2) {
    return "Two or more classes agree (" + names + "), but all of them are the operator or outlets restating the operator — no independent confirmation.";
  }
  if (hasRegulatory) {
    return "Single regulatory-record source. Strong, but uncorroborated — one filing, no second class.";
  }
  return "Single source class (" + names + "). Not corroborated by anything independent of it.";
}

// ---- Scoring a site entry -------------------------------------------------
//
// Works from either an explicit `provenance` block or, when there isn't one,
// the legacy flat `sources` array. See data/sites.js for the schema.
var PROVENANCE_FIELDS = ["capacityMW", "status", "location"];

var FIELD_LABELS = {
  capacityMW: "Capacity",
  status: "Status",
  location: "Location"
};

function siteEvidenceFor(site, field){
  var prov = site.provenance && site.provenance[field];

  // Explicit provenance: the research agents fill this in per field, so the
  // capacity figure and the coordinates can carry genuinely different
  // evidence and genuinely different confidence.
  if (prov && prov.evidence && prov.evidence.length) {
    return prov.evidence.map(function(ev){
      // Evidence may either inline a source object or point at an index into
      // the site's own `sources` array, which keeps entries from repeating
      // the same URL twice.
      var src = typeof ev.source === "number" ? (site.sources || [])[ev.source] : ev.source;
      return {
        cls: ev.cls || classifySource(src, site.provider),
        asOf: ev.asOf || prov.asOf || site.lastUpdated,
        source: src,
        note: ev.note || ""
      };
    });
  }

  // Legacy fallback: no per-field provenance yet, so every source on the
  // entry counts as evidence for every field. This is generous — it is the
  // assumption the atlas has been running on implicitly all along — and it
  // means the badge works for all existing entries immediately rather than
  // waiting on a full re-research pass.
  return (site.sources || []).map(function(src){
    return {
      cls: classifySource(src, site.provider),
      asOf: site.lastUpdated,
      source: src,
      note: ""
    };
  });
}

function siteFieldBasis(site, field){
  var prov = site.provenance && site.provenance[field];
  return (prov && prov.basis) || "disclosed";
}

function siteFieldHasProvenance(site, field){
  var prov = site.provenance && site.provenance[field];
  return !!(prov && prov.evidence && prov.evidence.length);
}

function scoreSiteField(site, field, today){
  var prov = site.provenance && site.provenance[field];
  return scoreEvidence(siteEvidenceFor(site, field), {
    field: field,
    status: site.status,
    asOfToday: today,
    conflicting: !!(prov && prov.conflicting)
  });
}

// A site's headline confidence is its weakest scored field — a pin with a
// trustworthy location and a made-up capacity figure is not a trustworthy
// pin, so weakest-link is the honest aggregation.
function scoreSite(site, today){
  var perField = {};
  var lowest = null;
  PROVENANCE_FIELDS.forEach(function(f){
    // Don't penalise an entry for having no capacity evidence when it
    // honestly reports capacity as undisclosed — there is no claim to verify.
    if (f === "capacityMW" && site.capacityMW == null) return;
    var s = scoreSiteField(site, f, today);
    perField[f] = s;
    if (lowest === null || CONFIDENCE_LEVELS[s.level].rank < CONFIDENCE_LEVELS[lowest].rank) lowest = s.level;
  });
  return { level: lowest || "unverified", fields: perField };
}

// `basis` distinguishes a number the operator published from one worked out
// here (e.g. generator nameplate kW from an air permit, derated). A derived
// figure is legitimate; rendering it as though it were disclosed is not, so
// the UI labels it.
var BASIS_LABELS = {
  disclosed: "Disclosed",
  derived:   "Derived",
  observed:  "Observed",
  estimated: "Estimated"
};
