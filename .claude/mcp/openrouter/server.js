// A small, self-contained MCP server for Site Atlas research tooling.
//
// Two kinds of tool live here:
//   - openrouter_ask: put a question to a cheap model on OpenRouter, to keep
//     token-heavy legwork off the main session.
//   - the structured feeds (edgar_search, peeringdb_facility,
//     epa_echo_facilities): fetch public records directly, with no model in
//     the loop at all.
//
// Deliberately minimal — no third-party wrapper packages, just direct fetch()
// calls to public REST APIs, so it's easy to read top to bottom.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_KEY = process.env.OPENROUTER_API_KEY;
const DEFAULT_MODEL = process.env.OPENROUTER_DEFAULT_MODEL || "deepseek/deepseek-chat";

const server = new McpServer({ name: "openrouter-research", version: "1.1.0" });

server.tool(
  "openrouter_ask",
  "Send a prompt to a model on OpenRouter (defaults to a cheap capable model) and return its response. Use this to offload research/summarization legwork to a low-cost model instead of doing it in the main session.",
  {
    prompt: z.string().describe("The full prompt/question to send to the model."),
    model: z.string().optional().describe("OpenRouter model id to use, e.g. 'deepseek/deepseek-chat'. Defaults to OPENROUTER_DEFAULT_MODEL."),
    search: z.boolean().optional().describe("If true, gives the model live web search (via OpenRouter's web plugin) before it answers."),
  },
  async ({ prompt, model, search }) => {
    if (!API_KEY) {
      return {
        isError: true,
        content: [{ type: "text", text: "OPENROUTER_API_KEY is not set. Create a .env file in the project root (see .env.example) and restart Claude Code." }],
      };
    }

    const body = {
      model: model || DEFAULT_MODEL,
      messages: [{ role: "user", content: prompt }],
    };

    if (search) {
      body.plugins = [{ id: "web", max_results: 5 }];
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        isError: true,
        content: [{ type: "text", text: `OpenRouter error (${res.status}): ${data.error?.message || res.statusText}` }],
      };
    }

    const text = data.choices?.[0]?.message?.content;
    const usedModel = data.model || model || DEFAULT_MODEL;
    const annotations = data.choices?.[0]?.message?.annotations;
    const citations = annotations
      ?.filter(a => a.type === "url_citation")
      .map(a => `- ${a.url_citation.title}: ${a.url_citation.url}`)
      .join("\n");
    const fullText = citations ? `${text}\n\nSources:\n${citations}` : text;

    return {
      content: [{ type: "text", text: fullText || "(model returned no content)" }],
      _meta: { model: usedModel, usage: data.usage },
    };
  }
);

// ---------------------------------------------------------------------------
// Structured-feed tools (Stage 2 of the sourcing roadmap).
//
// These exist to supply the source classes the atlas is starving for: R
// (regulatory) and N (network). Unlike openrouter_ask, no model is involved —
// the record either comes back or it doesn't, so a figure sourced here cannot
// be fabricated. All three are public, keyless, and read at call time; nothing
// is cached or stored anywhere.
// ---------------------------------------------------------------------------

// The SEC asks automated callers to identify themselves with a real contact.
// Set SEC_USER_AGENT in .env to your own name and email; default is generic.
const SEC_UA = process.env.SEC_USER_AGENT || "SiteAtlas research tool (contact unset)";

const ok = (text) => ({ content: [{ type: "text", text }] });
const fail = (text) => ({ isError: true, content: [{ type: "text", text }] });

// --- R class: SEC EDGAR full-text search ------------------------------------
// Full text of filings since 2001. A 10-K naming a site is filed under legal
// obligation with securities-fraud liability attached — the strongest routine
// evidence available for a US-listed operator, and it usually predates any
// press announcement.
server.tool(
  "edgar_search",
  "Search the full text of SEC filings (EDGAR) for a term — a site name, town, or operator. Returns matching filings with company, form type, date, and a direct link. Source class R (regulatory).",
  {
    query: z.string().describe("Term to search for, e.g. 'Ellendale'. Searched as an exact phrase."),
    forms: z.string().optional().describe("Comma-separated form types to limit to, e.g. '10-K,10-Q,8-K'. Omit for all forms."),
    limit: z.number().optional().describe("Max filings to return (default 10)."),
  },
  async ({ query, forms, limit }) => {
    const url = new URL("https://efts.sec.gov/LATEST/search-index");
    url.searchParams.set("q", `"${query}"`);
    if (forms) url.searchParams.set("forms", forms);

    const res = await fetch(url, { headers: { "User-Agent": SEC_UA } });
    if (!res.ok) return fail(`EDGAR error (${res.status}): ${res.statusText}`);

    const data = await res.json();
    const hits = data.hits?.hits || [];
    const total = data.hits?.total?.value ?? 0;
    if (!hits.length) return ok(`EDGAR: no filings mention "${query}".`);

    const lines = hits.slice(0, limit || 10).map(h => {
      const s = h._source || {};
      // _id is "<accession>:<document filename>". The archive path needs the
      // accession with dashes stripped and the CIK without leading zeros.
      const [adsh, file] = String(h._id).split(":");
      const cik = (s.ciks?.[0] || "").replace(/^0+/, "");
      const link = cik && adsh
        ? `https://www.sec.gov/Archives/edgar/data/${cik}/${adsh.replace(/-/g, "")}/${file}`
        : "(link unavailable)";
      const period = s.period_ending ? ` (period ${s.period_ending})` : "";
      return `- ${s.display_names?.[0] || "unknown filer"}\n  ${s.form || "?"} filed ${s.file_date || "?"}${period}\n  ${link}`;
    });

    return ok(`EDGAR full-text: ${total} filing(s) mention "${query}". Showing ${lines.length}:\n\n${lines.join("\n")}`);
  }
);

// --- N class: PeeringDB facility lookup -------------------------------------
// Operator-maintained but externally visible network infrastructure: a real
// street address and coordinates for a facility that actually carries traffic.
// Good evidence a site EXISTS and is live; never a capacity figure.
server.tool(
  "peeringdb_facility",
  "Look up data center facilities in PeeringDB by name, city, or country. Returns operator, street address, coordinates, and how many networks/exchanges are present. Source class N (network telemetry). Good for existence and location; never for capacity.",
  {
    name: z.string().optional().describe("Partial facility or operator name, e.g. 'Ellendale' or 'EdgeConneX'."),
    city: z.string().optional().describe("City name, e.g. 'Santa Clara'."),
    country: z.string().optional().describe("Two-letter country code, e.g. 'US', 'NO', 'FI'."),
    limit: z.number().optional().describe("Max facilities to return (default 10)."),
  },
  async ({ name, city, country, limit }) => {
    if (!name && !city && !country) {
      return fail("peeringdb_facility needs at least one of: name, city, country.");
    }

    const url = new URL("https://www.peeringdb.com/api/fac");
    if (name) url.searchParams.set("name__contains", name);
    if (city) url.searchParams.set("city", city);
    if (country) url.searchParams.set("country", country);
    url.searchParams.set("limit", String(limit || 10));

    const res = await fetch(url);
    if (!res.ok) return fail(`PeeringDB error (${res.status}): ${res.statusText}`);

    const rows = (await res.json()).data || [];
    if (!rows.length) return ok("PeeringDB: no matching facilities.");

    const lines = rows.map(f => {
      const operator = f.org_name && f.org_name !== f.name ? ` — operator: ${f.org_name}` : "";
      const addr = [f.address1, f.city, f.state, f.zipcode, f.country].filter(Boolean).join(", ");
      return `- ${f.name}${operator}\n` +
        `  ${addr}\n` +
        `  coords ${f.latitude ?? "?"}, ${f.longitude ?? "?"} · ${f.net_count ?? 0} networks, ${f.ix_count ?? 0} exchanges · record updated ${(f.updated || "?").slice(0, 10)}\n` +
        `  https://www.peeringdb.com/fac/${f.id}`;
    });

    return ok(`PeeringDB: ${rows.length} facility(ies).\n\n${lines.join("\n")}`);
  }
);

// --- R class: EPA ECHO air-permit facilities --------------------------------
// Two-step by design on EPA's side: the first call registers a query and
// returns a QueryID, the second pages the rows.
//
// Two gotchas, both found by testing rather than documentation:
//   1. p_naics is effectively ignored server-side — a NAICS 518210 query for
//      North Dakota returns all 1,887 air facilities in the state. The real
//      filtering has to happen here, on the prefix the caller asked for.
//   2. get_qid caps a page at 5,000 rows regardless of responseset. Virginia
//      has 10,268, so a single page silently drops half the state. Hence the
//      pagination loop below, and the explicit coverage note in the output.
// QueryIDs are also recycled on EPA's side, so each call must run its own
// step 1 rather than reusing an id it saw earlier.
server.tool(
  "epa_echo_facilities",
  "Find EPA-regulated air-permit facilities by US state and NAICS code (518210 = data processing/hosting). Returns facility name, address, coordinates, permit programs and operating status. Source class R (regulatory) — an air permit's generator nameplate is the best pre-announcement capacity proxy that exists.",
  {
    state: z.string().describe("Two-letter US state code, e.g. 'ND', 'TX', 'VA'."),
    naics: z.string().optional().describe("NAICS prefix to filter on (default '518210', data processing & hosting)."),
    city: z.string().optional().describe("Optional city filter, matched case-insensitively."),
    county: z.string().optional().describe("Optional county filter, matched case-insensitively."),
    limit: z.number().optional().describe("Max facilities to return (default 15)."),
  },
  async ({ state, naics, city, county, limit }) => {
    const code = naics || "518210";
    const st = state.toUpperCase();

    const q = new URL("https://echodata.epa.gov/echo/air_rest_services.get_facilities");
    q.searchParams.set("output", "JSON");
    q.searchParams.set("p_naics", code);
    q.searchParams.set("p_st", st);

    const qRes = await fetch(q);
    if (!qRes.ok) return fail(`EPA ECHO error (${qRes.status}): ${qRes.statusText}`);
    const meta = (await qRes.json()).Results || {};
    const qid = meta.QueryID;
    if (!qid) return fail("EPA ECHO returned no QueryID — the query may have matched nothing.");
    const totalRows = Number(meta.QueryRows || 0);

    const PAGE = 5000;   // EPA's hard cap per page
    const MAX_PAGES = 6; // 30k rows — enough for the largest states, bounded latency
    let scanned = 0;
    let fac = [];

    for (let page = 1; page <= MAX_PAGES; page++) {
      const r = new URL("https://echodata.epa.gov/echo/air_rest_services.get_qid");
      r.searchParams.set("qid", qid);
      r.searchParams.set("output", "JSON");
      r.searchParams.set("pageno", String(page));
      r.searchParams.set("responseset", String(PAGE));

      const rRes = await fetch(r);
      if (!rRes.ok) return fail(`EPA ECHO paging error (${rRes.status}): ${rRes.statusText}`);

      const rows = (await rRes.json()).Results?.Facilities || [];
      if (!rows.length) break;
      fac.push(...rows);
      scanned += rows.length;
      if (rows.length < PAGE || scanned >= totalRows) break;
    }

    const truncated = totalRows > 0 && scanned < totalRows;

    // EPA's own NAICS filter is loose — enforce the caller's prefix here.
    fac = fac.filter(f => String(f.AIRNAICS || "").startsWith(code));
    if (city) fac = fac.filter(f => String(f.AIRCity || "").toLowerCase().includes(city.toLowerCase()));
    if (county) fac = fac.filter(f => String(f.AIRCounty || "").toLowerCase().includes(county.toLowerCase()));

    const coverage = truncated
      ? `Scanned ${scanned.toLocaleString()} of ${totalRows.toLocaleString()} air facilities in ${st} — INCOMPLETE, treat a negative result as inconclusive.`
      : `Scanned all ${scanned.toLocaleString()} air facilities in ${st}.`;

    if (!fac.length) {
      const where = `${city ? ` in ${city}` : ""}${county ? ` in ${county} County` : ""}`;
      return ok(`EPA ECHO: no facilities in ${st} matched NAICS ${code}${where}.\n${coverage}`);
    }

    const lines = fac.slice(0, limit || 15).map(f => {
      const addr = [f.AIRStreet, f.AIRCity, f.AIRState, f.AIRZip].filter(Boolean).join(", ");
      const county = f.AIRCounty ? ` (${f.AIRCounty} County)` : "";
      return `- ${f.AIRName}\n` +
        `  ${addr}${county}\n` +
        `  NAICS ${f.AIRNAICS || "?"} · status ${f.AIRStatus || "?"} · programs ${f.AIRPrograms || "none listed"}\n` +
        `  coords ${f.FacLat ?? "?"}, ${f.FacLong ?? "?"} · EPA registry ID ${f.RegistryID || "?"}\n` +
        `  https://echo.epa.gov/detailed-facility-report?fid=${f.RegistryID || ""}`;
    });

    return ok(`EPA ECHO: ${fac.length} facility(ies) in ${st} under NAICS ${code}. Showing ${lines.length}.\n${coverage}\n\n${lines.join("\n")}`);
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
