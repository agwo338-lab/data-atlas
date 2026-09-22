// Site Atlas — provider data
//
// One entry per operator/company shown on the map. `data/sites.js` entries
// reference a provider by name (the `provider` field); this file is the
// canonical home for anything that's about the *company* rather than one
// specific site — display color, and its major partnerships/customers,
// with room to grow further as more providers get added.
//
// Schema: PROVIDERS is an array of:
//   name     string — must exactly match `provider` in data/sites.js entries
//   color    hex string — used for this provider's dashboard card, map
//            pins, table dot, and provider page. Optional — omit the field
//            (or leave the provider out of this file entirely) to fall
//            back to the next unused color in index.html's shared palette.
//   domain   the operator's own web domain, e.g. "coreweave.com". The
//            operator page shows the site icon behind that domain (fetched
//            live from Google's public favicon service) as the operator's
//            mark, so no logo files are kept in the repo. Optional — an
//            entry without one gets a lettered tile instead.
//   logo     a full image URL to use instead of the favicon, if a better
//            mark is available. Optional; wins over `domain` when set.
//   summary  2-3 sentences of plain-language orientation: who this company
//            is and what it's doing in the buildout, shown directly under
//            the headline stats on the provider page. Optional — a provider
//            without one simply shows no summary block.
//            Deliberately QUALITATIVE: no capacity figures, deal sizes or
//            dates belong here. Every hard number on this site is scored by
//            data/sources.js and carries a verdict; prose restating one
//            would launder an unscored claim past that machinery. Describe
//            the shape of the business and let the stats, partnerships and
//            headlines below carry the numbers, each with its own citation.
//   partners array of the labs/companies this provider has a disclosed
//            relationship with (compute deals, equity stakes, etc.),
//            shown on the provider page. Optional. Each item:
//              name         the partner org
//              relationship short free-text label, e.g. "Compute customer",
//                           "Equity investor", "Equity investor & compute
//                           customer"
//              detail       one-line specifics — deal size/scope
//              since        "YYYY-MM-DD" the relationship was first
//                           disclosed, if known
//              sources      array of { label, url } — same format and same
//                           sourcing bar as data/sites.js and data/news.js;
//                           don't add a partner without at least one
//              lastUpdated  "YYYY-MM-DD" — the last time this specific
//                           partner entry was re-verified (e.g. via
//                           /reconcile), not just when it was typed in.
//                           Optional but keep it current — this is what
//                           lets a future /reconcile run skip claims that
//                           were already checked recently.
//
// A provider does NOT need an entry here to appear on the map — any new
// `provider` string in data/sites.js is picked up automatically and
// auto-assigned a palette color, with an empty partnerships section.
//
// Partnerships here should trace back to something already vetted — e.g.
// a news-agent finding that's been reviewed and kept in data/news.js — not
// be added from general knowledge/memory. If you know of a real
// relationship (e.g. "CoreWeave and OpenAI have a compute deal") but it
// hasn't gone through that sourcing step yet, flag it for a news-agent run
// rather than typing it in here directly.

var PROVIDERS = [
  {
    // OpenAI's current brand identity is essentially monochrome, so there is no
    // brand hex to take. The obvious candidate is the legacy "ChatGPT green"
    // #10A37F, but a green that close to Nebius's #4CAF6D would be hard to tell
    // apart as a 10px dot on the map, which is the whole job this color does.
    // So: a teal that gestures at that legacy accent while sitting clear of
    // every other pinned color. An interpretive choice, stated as one.
    name: "OpenAI",
    domain: "openai.com",
    color: "#3EC4C0",
    summary: "The AI lab behind ChatGPT, and the largest single driver of the " +
      "current compute buildout — but almost entirely as a customer rather than " +
      "an owner. Nearly every site described in the press as \"OpenAI's\" is a " +
      "Stargate facility built and owned by a partner (Oracle, Crusoe, SB Energy, " +
      "Related Digital) with OpenAI as tenant or offtaker, or capacity rented " +
      "from Microsoft, CoreWeave, AWS and Google. Only sites OpenAI develops " +
      "itself appear here under its own name."
  },
  {
    // Skeleton entry — color pinned ahead of time, no sites/partners yet.
    // SpaceX acquired xAI (Feb 2026); xAI folded entirely into SpaceX's
    // "SpaceXAI" AI division (May 2026) rather than remaining a separate
    // company — this entry is the merged entity, not standalone xAI.
    // Unlike AWS/CoreWeave, SpaceXAI has no real chromatic brand identity
    // to derive a color from — x.ai's own site is almost entirely black
    // and white. Rather than invent a fake "sourced" hex, this is a
    // plainly interpretive choice: a distinct steel-gray, chosen so it
    // doesn't collide with AWS's orange or the auto-palette on the map,
    // not scraped from any brand asset.
    name: "SpaceXAI",
    domain: "x.ai",
    summary: "SpaceX's AI division, formed when xAI folded entirely into SpaceX rather " +
      "than continuing as a separate company. Its compute buildout is tracked here " +
      "as part of the merged entity; the atlas holds no confirmed SpaceXAI site yet.",
    color: "#9AA5B1"
  },
  {
    // Skeleton entry — color pinned ahead of time, no sites/partners yet.
    // AWS's brand orange is well-documented as #FF9900 ("Smile Orange");
    // softened here the same way CoreWeave's blue was, to sit next to this
    // site's muted palette instead of the raw saturated brand hex. Won't
    // show up anywhere in the UI (dashboard, map, provider page) until at
    // least one data/sites.js entry has provider: "AWS" — color/provider
    // assignment in index.html only considers providers that actually have
    // sites.
    name: "AWS",
    domain: "aws.amazon.com",
    summary: "Amazon's cloud arm and the largest incumbent hyperscaler — it was building " +
      "data centers at scale for a decade before the current AI cycle. Distinct from " +
      "the neoclouds here in that it designs its own accelerators and rents capacity " +
      "to AI labs rather than only reselling Nvidia hardware.",
    color: "#E0A752"
  },
  {
    name: "Nebius",
    domain: "nebius.com",
    summary: "An Amsterdam-headquartered AI cloud — the business that remained after " +
      "Yandex's Russian operations were divested. It builds and operates its own GPU " +
      "capacity and sells it on long multi-year contracts, so its disclosed pipeline " +
      "is driven by a handful of very large customer commitments rather than by broad " +
      "demand.",
    color: "#4CAF6D",
    partners: [
      {
        name: "Microsoft",
        relationship: "Compute customer",
        detail: "Up to $19.4B five-year AI infrastructure deal ($17.4B contract value + $2B option), delivered via Nebius's New Jersey data center. Secures Microsoft ~100,000 Nvidia GB300 chips.",
        since: "2025-09-08",
        sources: [
          { label: "CNBC, Sep 8, 2025", url: "https://www.cnbc.com/2025/09/08/nebius-stock-soars-on-ai-infrastructure-deal-with-microsoft-.html" },
          { label: "Data Center Dynamics, Oct 2025", url: "https://www.datacenterdynamics.com/en/news/microsoft-to-get-100000-nvidia-gb300s-under-nebius-deal-has-signed-more-than-33bn-in-capacity-agreements-with-neoclouds/" }
        ],
        lastUpdated: "2026-08-23"
      },
      {
        name: "Meta",
        relationship: "Compute customer",
        detail: "Up to $27B, five-year AI infrastructure deal — $12B dedicated capacity plus up to $15B tied to Nvidia Vera Rubin platform deployments, delivery starting early 2027.",
        since: "2026-03-16",
        sources: [
          { label: "CNBC, Mar 16, 2026", url: "https://www.cnbc.com/2026/03/16/meta-nebius-ai-infrastructure.html" },
          { label: "Nebius newsroom, Mar 2026", url: "https://nebius.com/newsroom/nebius-signs-new-ai-infrastructure-agreement-with-meta" }
        ],
        lastUpdated: "2026-08-23"
      },
      {
        name: "Reflection AI",
        relationship: "Compute customer",
        detail: "$1B+ multi-year compute supply deal through 2029, for access to Nvidia's latest chips via Nebius infrastructure.",
        since: "2026-07-14",
        sources: [
          { label: "TechCrunch, Jul 14, 2026", url: "https://techcrunch.com/2026/07/14/reflection-inks-1b-compute-deal-with-nebius/" },
          { label: "Data Center Dynamics, Aug 19, 2026", url: "https://www.datacenterdynamics.com/en/news/ai-startup-reflection-signs-1bn-capacity-agreement-with-nebius/" }
        ],
        lastUpdated: "2026-08-23"
      }
    ]
  },
  {
    name: "CoreWeave",
    domain: "coreweave.com",
    summary: "A GPU-specialist cloud, originally an Ethereum mining operation, now one of " +
      "the largest dedicated AI compute providers. It leases and fits out sites fast " +
      "rather than building slowly from the ground up, which is why its footprint here " +
      "turns over quicker — and is more exposed to local siting politics — than a " +
      "hyperscaler's.",
    color: "#4C6FE5",
    partners: [
      {
        name: "Nvidia",
        relationship: "Equity investor & infrastructure partner",
        detail: "Invested an additional $2B (Class A shares at $87.20 each), becoming CoreWeave's second-largest shareholder; CoreWeave is an early deployer of new Nvidia hardware/platforms.",
        since: "2026-01-26",
        sources: [
          { label: "CNBC, Jan 26, 2026", url: "https://www.cnbc.com/2026/01/26/3coreweave-nvidia-stock-ai-data-centers.html" },
          { label: "Nvidia Newsroom, Jan 26, 2026", url: "https://nvidianews.nvidia.com/news/nvidia-and-coreweave-strengthen-collaboration-to-accelerate-buildout-of-ai-factories" }
        ],
        lastUpdated: "2026-08-23"
      },
      {
        name: "Meta",
        relationship: "Compute customer",
        detail: "Combined $35.2B AI infrastructure commitment — a $21B expansion (announced Apr 9, 2026) added on top of a prior $14.2B agreement from Sep 2025. New capacity runs through Dec 2032, focused on inference workloads (Llama) rather than training.",
        since: "2026-04-09",
        sources: [
          { label: "CoreWeave newsroom, Apr 9, 2026", url: "https://coreweave.com/news/coreweave-and-meta-announce-21-billion-expanded-ai-infrastructure-agreement" },
          { label: "Bloomberg, Apr 9, 2026", url: "https://www.bloomberg.com/news/articles/2026-04-09/coreweave-expands-meta-deal-for-ai-computing-to-21-billion" },
          { label: "CNBC, Aug 11, 2026 (Q2 earnings recap)", url: "https://www.cnbc.com/2026/08/11/coreweave-crwv-q2-earnings-report-2026.html" }
        ],
        lastUpdated: "2026-08-23"
      },
      {
        name: "Anthropic",
        relationship: "Compute customer",
        detail: "New multi-year infrastructure agreement, announced Apr 10, 2026. Deal value undisclosed by either party.",
        since: "2026-04-10",
        sources: [
          { label: "CoreWeave newsroom, Apr 10, 2026", url: "https://www.coreweave.com/news/coreweave-announces-multi-year-agreement-with-anthropic" },
          { label: "CNBC, Apr 10, 2026", url: "https://www.cnbc.com/2026/04/10/coreweave-anthropic-claude-ai-deal.html" },
          { label: "Data Center Dynamics", url: "https://www.datacenterdynamics.com/en/news/coreweave-and-anthropic-sign-multi-year-compute-agreement/" }
        ],
        lastUpdated: "2026-08-23"
      },
      {
        name: "Jane Street",
        relationship: "Equity investor & compute customer",
        detail: "$6B AI cloud compute agreement, plus a separate $1B equity investment in CoreWeave Class A shares at $109.00/share — making Jane Street one of CoreWeave's five largest shareholders. Announced Apr 15, 2026; notable as a non-tech-sector customer (quantitative trading firm).",
        since: "2026-04-15",
        sources: [
          { label: "CoreWeave newsroom, Apr 15, 2026", url: "https://www.coreweave.com/news/jane-street-signs-6-billion-ai-cloud-agreement-with-coreweave" },
          { label: "Businesswire, Apr 15, 2026", url: "https://www.businesswire.com/news/home/20260415280149/en/Jane-Street-Signs-%246-Billion-AI-Cloud-Agreement-With-CoreWeave" },
          { label: "CNBC, Aug 11, 2026 (Q2 earnings recap)", url: "https://www.cnbc.com/2026/08/11/coreweave-crwv-q2-earnings-report-2026.html" }
        ],
        lastUpdated: "2026-08-23"
      }
    ]
  },
  {
    name: "DataBank",
    domain: "databank.com",
    color: "#E0608A",
    summary: "A US colocation and interconnection operator, and the largest single " +
      "presence in this atlas's Southern California coverage with four sites. Its " +
      "footprint here came largely by acquisition — it bought Zayo's zColo estate " +
      "for about $1.4B in 2020, which is why some of its buildings still appear in " +
      "third-party directories under older brands."
  },
  {
    name: "CoreSite",
    domain: "coresite.com",
    color: "#A97BFF",
    summary: "A colocation operator whose significance is interconnection rather " +
      "than scale: it manages the Meet-Me-Room at One Wilshire in Los Angeles, one " +
      "of the most important network exchange points on the US west coast."
  },
  {
    name: "Digital Realty",
    domain: "digitalrealty.com",
    color: "#6247AA",
    summary: "One of the largest data center REITs in the world. Only its Vernon, " +
      "California project is tracked here — this atlas does not attempt its full " +
      "global footprint, on the same scoping grounds that exclude AWS's."
  },
  {
    name: "Centersquare",
    color: "#D4A72C",
    summary: "The 2024 Brookfield rebrand of the merged Cyxtera and Evoque " +
      "colocation estates. Records for its buildings often still sit under one of " +
      "those prior names, which is worth knowing before concluding a site is " +
      "unsourced."
  },
  {
    name: "EdgeConneX",
    domain: "edgeconnex.com",
    color: "#C2703D",
    summary: "A global data center developer and operator. Appears in this atlas " +
      "twice over: as the landlord of the Cedar Creek, Texas campus CoreWeave " +
      "leases, and in its own right in San Diego."
  },
  {
    name: "ColoCrossing",
    color: "#8E9BD6",
    summary: "A US multi-market colocation provider. Tracked here on a single " +
      "PeeringDB facility record — a deliberately thin entry, kept because the " +
      "record is real and independent, not because much is known about the site."
  },
  {
    name: "Prime Data Centers",
    domain: "primedatacenters.com",
    color: "#8FBF3F",
    summary: "A wholesale data center developer. Its Vernon, California building " +
      "is a single or dual-tenant shell rather than carrier-neutral colocation, " +
      "which is why it has no PeeringDB presence despite being fully leased."
  },
  {
    name: "Imperial Valley Computer Manufacturing",
    domain: "imperialdatacenter.com",
    color: "#A8577E",
    summary: "The developer behind a proposed 330MW campus in Imperial County, " +
      "California. Everything disclosed about the project so far is the " +
      "developer's own word, including a reported anchor tenant that has never " +
      "been confirmed by the named company."
  }
];
