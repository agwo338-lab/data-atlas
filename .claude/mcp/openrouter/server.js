// A small, self-contained MCP server exposing one tool: ask a question via
// OpenRouter, on whatever model you choose (defaults to OPENROUTER_DEFAULT_MODEL).
// Deliberately minimal — no third-party OpenRouter wrapper package, just a
// direct fetch() to their REST API, so it's easy to read top to bottom.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_KEY = process.env.OPENROUTER_API_KEY;
const DEFAULT_MODEL = process.env.OPENROUTER_DEFAULT_MODEL || "deepseek/deepseek-chat";

const server = new McpServer({ name: "openrouter-research", version: "1.0.0" });

server.tool(
  "openrouter_ask",
  "Send a prompt to a model on OpenRouter (defaults to a cheap capable model) and return its response. Use this to offload research/summarization legwork to a low-cost model instead of doing it in the main session.",
  {
    prompt: z.string().describe("The full prompt/question to send to the model."),
    model: z.string().optional().describe("OpenRouter model id to use, e.g. 'deepseek/deepseek-chat'. Defaults to OPENROUTER_DEFAULT_MODEL."),
  },
  async ({ prompt, model }) => {
    if (!API_KEY) {
      return {
        isError: true,
        content: [{ type: "text", text: "OPENROUTER_API_KEY is not set. Create a .env file in the project root (see .env.example) and restart Claude Code." }],
      };
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model || DEFAULT_MODEL,
        messages: [{ role: "user", content: prompt }],
      }),
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

    return {
      content: [{ type: "text", text: text || "(model returned no content)" }],
      _meta: { model: usedModel, usage: data.usage },
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
