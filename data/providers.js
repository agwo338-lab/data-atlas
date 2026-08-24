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
    name: "Nebius",
    color: "#4CAF6D",
    partners: [
      {
        name: "Microsoft",
        relationship: "Compute customer",
        detail: "Up to $19.4B five-year AI infrastructure deal ($17.4B contract value + $2B option), delivered via Nebius's New Jersey data center.",
        since: "2025-09-08",
        sources: [
          { label: "CNBC, Sep 8, 2025", url: "https://www.cnbc.com/2025/09/08/nebius-stock-soars-on-ai-infrastructure-deal-with-microsoft-.html" }
        ]
      },
      {
        name: "Meta",
        relationship: "Compute customer",
        detail: "Up to $27B, five-year AI infrastructure deal — $12B dedicated capacity plus up to $15B tied to Nvidia Vera Rubin platform deployments, delivery starting early 2027.",
        since: "2026-03-16",
        sources: [
          { label: "CNBC, Mar 16, 2026", url: "https://www.cnbc.com/2026/03/16/meta-nebius-ai-infrastructure.html" },
          { label: "Nebius newsroom, Mar 2026", url: "https://nebius.com/newsroom/nebius-signs-new-ai-infrastructure-agreement-with-meta" }
        ]
      },
      {
        name: "Reflection AI",
        relationship: "Compute customer",
        detail: "$1B+ multi-year compute supply deal through 2029, for access to Nvidia's latest chips via Nebius infrastructure.",
        since: "2026-07-14",
        sources: [
          { label: "TechCrunch, Jul 14, 2026", url: "https://techcrunch.com/2026/07/14/reflection-inks-1b-compute-deal-with-nebius/" }
        ]
      }
    ]
  },
  {
    name: "CoreWeave",
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
        ]
      },
      {
        name: "Meta",
        relationship: "Compute customer",
        detail: "Added $21B to its existing spend commitment, disclosed Aug 2026 alongside CoreWeave's Q2 earnings.",
        since: "2026-08-11",
        sources: [
          { label: "CNBC, Aug 11, 2026", url: "https://www.cnbc.com/2026/08/11/coreweave-crwv-q2-earnings-report-2026.html" }
        ]
      },
      {
        name: "Anthropic",
        relationship: "Compute customer",
        detail: "New multi-year infrastructure agreement, disclosed Aug 2026 alongside CoreWeave's Q2 earnings.",
        since: "2026-08-11",
        sources: [
          { label: "CNBC, Aug 11, 2026", url: "https://www.cnbc.com/2026/08/11/coreweave-crwv-q2-earnings-report-2026.html" }
        ]
      },
      {
        name: "Jane Street",
        relationship: "Compute customer",
        detail: "$6B commitment — notable as a non-tech-sector customer (quantitative trading firm), disclosed Aug 2026 alongside CoreWeave's Q2 earnings.",
        since: "2026-08-11",
        sources: [
          { label: "CNBC, Aug 11, 2026", url: "https://www.cnbc.com/2026/08/11/coreweave-crwv-q2-earnings-report-2026.html" }
        ]
      }
    ]
  }
];
