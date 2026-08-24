// Site Atlas — provider news data
//
// Company-level headlines shown on a provider's dedicated page (opened by
// clicking its card on the dashboard). This is deliberately separate from
// each site's `sources` field in data/sites.js: `sources` exists to back
// up specific facts about one facility (its capacity, its status); this
// file is "what's newsworthy about the company" — funding, expansion
// strategy, major customer deals, leadership, regulatory action,
// controversies — curated by the `news-agent` subagent
// (.claude/agents/news-agent.md), not derived from site data.
//
// Schema: NEWS is an object keyed by provider name (must match `provider`
// in data/sites.js exactly). Each value is an array of headline items,
// most recent first:
//   date       "YYYY-MM-DD" — when the development happened/was reported
//   headline   one-line description of the development
//   why        one sentence on why it matters to an investor/enthusiast
//   category   "funding" | "expansion" | "partnership" | "leadership" |
//              "regulatory" | "controversy" | "other"
//   sources    array of { label, url } — same citation format as sites.js
//
// A provider with no entry here (or an empty array) falls back to the
// provider page showing citations pulled from its sites' own `sources`
// fields instead — see renderProviderPage() in index.html.
//
// Standard: run news-agent, review its findings, then hand-transcribe the
// ones worth keeping here — same "findings need a human call before they
// land in a data file" rule as data/sites.js. Re-run periodically (news
// goes stale fast); no fixed cadence yet.
//
// First populated 2026-08-23 from a news-agent run covering Nebius and
// CoreWeave. One source was dropped from the list news-agent returned: a
// CNBC link cited for a Nebius Q2 earnings item had a URL slug that
// referenced "coreweave-q2-earnings" instead of Nebius — looked like a
// citation mix-up rather than a real Nebius source, so it was left out
// rather than trusted.

var NEWS = {
  "Nebius": [
    {
      date: "2026-08-19",
      headline: "Priced upsized $5B convertible note offering to fund AI data-center buildout",
      why: "A major, market-tested capital raise signals aggressive scaling but adds real debt load and dilution risk.",
      category: "funding",
      sources: [
        { label: "Bloomberg, Aug 19, 2026", url: "https://www.bloomberg.com/news/articles/2026-08-19/ai-cloud-firm-nebius-offers-4-5-billion-of-convertible-bonds" },
        { label: "TipRanks, Aug 2026", url: "https://www.tipranks.com/news/company-announcements/nebius-group-prices-upsized-5-billion-convertible-notes-to-fuel-ai-cloud-expansion" }
      ]
    },
    {
      date: "2026-08-12",
      headline: "Q2 2026 earnings blowout: revenue up 454% YoY, guidance raised to 5GW contracted power",
      why: "Confirms Nebius is converting AI infrastructure demand into real, profitable growth at scale, not just announcements.",
      category: "other",
      sources: [
        { label: "Nebius newsroom, Aug 12, 2026", url: "https://nebius.com/newsroom/nebius-reports-second-quarter-2026-financial-results" }
      ]
    },
    {
      date: "2026-07-14",
      headline: "Signed $1B+ multi-year compute supply deal with Reflection AI through 2029",
      why: "Shows Nebius landing well-funded AI-lab customers beyond its anchor hyperscaler deals, diversifying its customer base.",
      category: "partnership",
      sources: [
        { label: "TechCrunch, Jul 14, 2026", url: "https://techcrunch.com/2026/07/14/reflection-inks-1b-compute-deal-with-nebius/" }
      ]
    },
    {
      date: "2026-03-16",
      headline: "Signed up-to-$27B, five-year AI infrastructure deal with Meta",
      why: "One of the largest disclosed customer commitments in Nebius's history, cementing it as a serious hyperscaler-scale supplier.",
      category: "partnership",
      sources: [
        { label: "CNBC, Mar 16, 2026", url: "https://www.cnbc.com/2026/03/16/meta-nebius-ai-infrastructure.html" },
        { label: "Nebius newsroom, Mar 2026", url: "https://nebius.com/newsroom/nebius-signs-new-ai-infrastructure-agreement-with-meta" }
      ]
    },
    {
      date: "2025-09-08",
      headline: "Announced up-to-$19.4B multi-year AI infrastructure deal with Microsoft",
      why: "The deal that established Nebius as a credible hyperscaler-grade AI infrastructure vendor — kept despite predating the last 12 months since it's foundational context.",
      category: "partnership",
      sources: [
        { label: "CNBC, Sep 8, 2025", url: "https://www.cnbc.com/2025/09/08/nebius-stock-soars-on-ai-infrastructure-deal-with-microsoft-.html" }
      ]
    }
  ],
  "CoreWeave": [
    {
      date: "2026-08-11",
      headline: "Q2 2026 earnings: revenue doubles to $2.58B, backlog hits $104B, guidance raised",
      why: "Confirms explosive top-line growth and demand visibility, but a widening net loss and $35B+ debt load underline that profitability is still distant.",
      category: "other",
      sources: [
        { label: "CNBC, Aug 11, 2026", url: "https://www.cnbc.com/2026/08/11/coreweave-crwv-q2-earnings-report-2026.html" },
        { label: "Fortune, Aug 11, 2026", url: "https://fortune.com/2026/08/11/coreweave-ceo-michael-intrator-cites-sold-out-capacity-as-revenue-more-than-doubles-and-backlog-swells-to-104-billion/" }
      ]
    },
    {
      date: "2026-08-11",
      headline: "New mega-commitments disclosed alongside earnings: Meta +$21B, new Anthropic deal, Jane Street $6B",
      why: "Broadens CoreWeave's customer base beyond AI labs into finance, and Meta's incremental spend is one of the largest single commitments disclosed this year.",
      category: "partnership",
      sources: [
        { label: "CNBC, Aug 11, 2026", url: "https://www.cnbc.com/2026/08/11/coreweave-crwv-q2-earnings-report-2026.html" }
      ]
    },
    {
      date: "2026-01-26",
      headline: "Nvidia invests additional $2B, becomes CoreWeave's second-largest shareholder",
      why: "A direct equity stake from its primary chip supplier is a strong vote of confidence and deepens strategic alignment (and dependency) between the two companies.",
      category: "funding",
      sources: [
        { label: "CNBC, Jan 26, 2026", url: "https://www.cnbc.com/2026/01/26/3coreweave-nvidia-stock-ai-data-centers.html" },
        { label: "Nvidia Newsroom, Jan 26, 2026", url: "https://nvidianews.nvidia.com/news/nvidia-and-coreweave-strengthen-collaboration-to-accelerate-buildout-of-ai-factories" }
      ]
    },
    {
      date: "2026-07-14",
      headline: "New York enacts first-in-nation data center moratorium; CoreWeave says it will shift, not shrink, its buildout",
      why: "First statewide moratorium of its kind in the US — a regulatory headwind worth tracking as more states consider similar action against large-load data centers.",
      category: "regulatory",
      sources: [
        { label: "Yahoo Finance/Benzinga, Aug 12, 2026", url: "https://finance.yahoo.com/technology/ai/articles/coreweave-says-data-center-moratoriums-043729174.html" },
        { label: "Carter Ledyard & Milburn LLP legal summary", url: "https://www.clm.com/new-yorks-data-center-moratorium-a-practical-roadmap-through-the-one-year-pause/" }
      ]
    },
    {
      date: "2026-08-04",
      headline: "First Asia-Pacific expansion announced: Indonesia, 360MW across 3 facilities",
      why: "Marks a strategic geographic pivot beyond the US/Europe base (also reflected at the site level as coreweave-jakarta in sites.js).",
      category: "expansion",
      sources: [
        { label: "Reuters, Aug 4, 2026", url: "https://www.reuters.com/world/asia-pacific/coreweave-expands-into-indonesia-announces-first-data-center-asia-pacific-2026-08-04/" },
        { label: "CoreWeave newsroom, Aug 4, 2026", url: "https://www.coreweave.com/news/coreweave-expands-cloud-ai-platform-to-indonesia-marking-first-move-into-asia-pacific-region" }
      ]
    }
  ]
};
