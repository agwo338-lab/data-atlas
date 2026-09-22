// Jev (TypeSafe's "System One" decision model) via OpenRouter.
//
// WHAT THIS IS
// ------------
// Jev is not a language model. It takes a `state` blob and a fixed set of typed
// questions and returns typed answers with probabilities: a `noul` (0–1, "is
// this statement true of the state"), a `choice` (one option from a list, with
// a probability per option and a confidence), or a `score` on a rubric. It
// generates no text, so it cannot invent a citation or a figure. It also gives
// no reasoning, so it cannot be cited as a source — it is a filter that can
// knock a claim down, never evidence that raises one.
//
// On OpenRouter it is NOT on chat/completions. It has its own alpha route,
// POST /api/alpha/decisions, same bearer key. The request body is
// { model, state, questions } and the response is { answers, usage, model }.
// Reference: https://docs.typesafe.ai and https://openrouter.ai/typesafe.
//
// WHY THE QUESTIONS ARE BAKED IN
// ------------------------------
// The agents that call this read untrusted web pages. If they could author
// Jev questions freely, a page could steer what gets asked. So the caller
// picks a named QUESTION SET and supplies only the state; the questions
// themselves live here, in the repo, under review. The same sets drive
// tools/jev-audit.mjs so the audit and the agents ask identical questions.
//
// Probed 2026-09-21: 754 input tokens, 347 ms, $0.00003. Context cap 32k.

export const JEV_ENDPOINT = "https://openrouter.ai/api/alpha/decisions";
export const JEV_MODEL = process.env.JEV_MODEL || "typesafe/jev-1.13";

// Roughly 5k tokens. Jev's cap is 32k for the whole request; the questions
// and the rest of the state take a few hundred, so this leaves wide margin.
export const MAX_EXCERPT_CHARS = 20000;

const CLASS_CRITERIA = {
  R: "Regulatory record: air permit, SEC filing, planning docket, utility or ISO interconnection record, government register",
  N: "Network telemetry: PeeringDB facility record, cloud region or IP-range metadata, BGP/whois, OpenStreetMap footprint",
  O: "Direct observation: satellite imagery, site photos, a site visit, site-specific hiring signals",
  P: "Primary corporate: the operator's own newsroom, website, investor material, earnings call, or a named executive quote",
  T: "Trade press: a specialist data-center outlet (Data Center Dynamics, Data Center Frontier, etc.) with a byline and date",
  G: "General press: business, financial, tech or local news with no data-center specialism",
  D: "Directory listing: Baxtel, datacenters.com, Cloudscene, Wikipedia or similar aggregator page",
};

const ORIGIN_CRITERIA = {
  operator_statement: "The text attributes the information to the operator: a press release, announcement, spokesperson, executive, or the operator's own site",
  regulatory_record: "The text cites or reproduces a permit, filing, docket, planning application, or other government or utility record",
  reporter_observation: "The reporter or author states something they saw, measured, or obtained themselves, not attributed to the operator",
  third_party: "The text attributes the information to a customer, partner, analyst, or other named third party",
  unattributed: "The information is stated without saying where it came from",
};

const QUANTITY_CRITERIA = {
  it_load: "IT or critical load (what the racks can draw)",
  utility_power: "Utility or grid connection capacity",
  generator: "Generator or backup nameplate capacity",
  unspecified: "A megawatt figure is given but the text does not say which quantity it is",
  no_figure: "The text gives no megawatt figure for this site",
};

// Each set is a function of the state so a question can be dropped when the
// field it concerns is not in play (e.g. the quantity question only matters
// for capacityMW). Every set is documented where it is used.
export const QUESTION_SETS = {
  // The adversarial second pass (research-agent.md). State:
  //   { claim, field, site, operator, source_url, excerpt }
  // where `excerpt` is the full text of the cited page as the agent fetched
  // it, and `claim` is the exact sentence being tested.
  claim_check: {
    describe: "Test one specific claim against the full text of the page cited for it. The adversarial second pass.",
    required: ["claim", "excerpt"],
    questions(state) {
      const q = {
        supported: {
          type: "noul",
          instructions: "Does the excerpt explicitly state the claim — the same figure, status or location, for the same site? Judge only from the excerpt. A related or approximate statement does not count.",
        },
        same_site: {
          type: "noul",
          instructions: "Is the excerpt about the same physical site the claim refers to (same operator and same city or campus), rather than a different site of the same operator or a company-wide figure?",
        },
        origin: {
          type: "choice",
          instructions: "According to the excerpt itself, where did the information behind the claim come from?",
          criteria: ORIGIN_CRITERIA,
        },
      };
      if (!state.field || state.field === "capacityMW") {
        q.quantity = {
          type: "choice",
          instructions: "If the excerpt gives a megawatt figure for this site, which quantity is it?",
          criteria: QUANTITY_CRITERIA,
        };
      }
      return q;
    },
  },

  // Classing and support check for one citation already on file
  // (tools/jev-audit.mjs, and agents grading a source). State:
  //   { operator, site, url, excerpt, capacityMW, status, location }
  source_check: {
    describe: "For one cited page: which source class it is, whether it is independent of the operator, and which of the site's three scored fields it actually supports.",
    required: ["excerpt"],
    questions(state) {
      const q = {
        source_class: {
          type: "choice",
          instructions: "Which source class best describes this page, judged by what it is and who wrote it?",
          criteria: CLASS_CRITERIA,
        },
        independent_of_operator: {
          type: "noul",
          instructions: "Does this page supply evidence that did not originate with the operator itself — a permit, filing, network record, or the author's own observation — rather than restating an operator announcement?",
        },
        same_site: {
          type: "noul",
          instructions: "Is this page about the specific site named in the state (same operator, same city or campus), rather than another site or the company in general?",
        },
      };
      if (state.capacityMW !== undefined && state.capacityMW !== null) {
        q.supports_capacity = {
          type: "noul",
          instructions: "Does the page explicitly state the capacity figure given in the state, in megawatts, for this site?",
        };
        q.quantity = {
          type: "choice",
          instructions: "If the page gives a megawatt figure for this site, which quantity is it?",
          criteria: QUANTITY_CRITERIA,
        };
      }
      if (state.status) {
        q.supports_status = {
          type: "noul",
          instructions: "Does the page support the build status given in the state (for example that the site is operational, under construction, or planned) as of the page's date?",
        };
      }
      if (state.location) {
        q.supports_location = {
          type: "noul",
          instructions: "Does the page place the site at the location given in the state — the same city, campus, or street address?",
        };
      }
      return q;
    },
  },

  // Headline triage for news-agent. State: { provider, headline, summary, url }
  triage: {
    describe: "Sort a candidate headline for the provider newsfeed: is it about this provider, is it company-level, and what kind of story is it?",
    required: ["headline"],
    questions() {
      return {
        about_provider: {
          type: "noul",
          instructions: "Is the story primarily about the provider named in the state, rather than mentioning it in passing?",
        },
        company_level: {
          type: "noul",
          instructions: "Is this a company-level development (funding, strategy, major contract, leadership, controversy) rather than a routine single-site update?",
        },
        kind: {
          type: "choice",
          instructions: "What kind of story is this?",
          criteria: {
            funding: "Financing, debt, equity, valuation, IPO",
            expansion: "New markets, campuses, or a stated growth strategy",
            contract: "A major customer, lease, or partnership",
            leadership: "Executive appointments or departures",
            controversy: "Regulatory action, litigation, community opposition, outages, safety",
            routine: "Incremental site news, awards, minor product notes",
          },
        },
      };
    },
  },
};

export function truncateExcerpt(text) {
  const s = String(text || "");
  return s.length > MAX_EXCERPT_CHARS ? s.slice(0, MAX_EXCERPT_CHARS) + "\n[…truncated]" : s;
}

// One call. Throws on transport or API error with a readable message.
export async function jevDecide(apiKey, setName, state, { model, fetchImpl } = {}) {
  const set = QUESTION_SETS[setName];
  if (!set) throw new Error(`Unknown question set "${setName}". Known: ${Object.keys(QUESTION_SETS).join(", ")}`);
  const missing = set.required.filter(k => state[k] === undefined || state[k] === null || state[k] === "");
  if (missing.length) throw new Error(`Question set "${setName}" needs state fields: ${missing.join(", ")}`);

  const cleanState = { ...state };
  if (cleanState.excerpt) cleanState.excerpt = truncateExcerpt(cleanState.excerpt);

  const body = { model: model || JEV_MODEL, state: cleanState, questions: set.questions(cleanState) };
  const doFetch = fetchImpl || fetch;
  const res = await doFetch(JEV_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`OpenRouter decisions error (${res.status}): ${data.error?.message || res.statusText}`);
  return data;
}

// Render an answers object as terse text an agent can read at a glance.
export function renderAnswers(data) {
  const lines = [];
  for (const [name, a] of Object.entries(data.answers || {})) {
    if (a.type === "noul") {
      lines.push(`${name}: ${a.noul.toFixed(2)} ${a.noul >= 0.8 ? "(yes)" : a.noul <= 0.2 ? "(no)" : "(unsure)"}`);
    } else if (a.type === "choice") {
      const probs = Object.entries(a.probabilities || {}).sort((x, y) => y[1] - x[1])
        .filter(([, p]) => p >= 0.05).map(([k, p]) => `${k} ${p.toFixed(2)}`).join(", ");
      lines.push(`${name}: ${a.choice} (confidence ${a.confidence.toFixed(2)}; ${probs})`);
    } else if (a.type === "score") {
      lines.push(`${name}: ${a.score} (confidence ${(a.confidence ?? 0).toFixed(2)})`);
    }
  }
  const u = data.usage || {};
  lines.push(`— ${data.model || JEV_MODEL} · ${u.input_tokens ?? "?"} in · $${(u.cost ?? 0).toFixed(6)}`);
  return lines.join("\n");
}
