#!/usr/bin/env node
// Smoke check for the deployed site. Not a test of behaviour — it only asks
// whether the page can turn on: the data files evaluate, the inline script
// parses, and every element the script reaches for by id (or every sprite
// icon it references) actually exists somewhere in the markup or in the HTML
// the script builds. A failure here is the kind that takes the whole map down
// silently in production, so run it before committing index.html:
//
//   node tools/check.js
//
// Exit code 0 = clean, 1 = something listed below is broken. No dependencies.
"use strict";
var fs = require("fs");
var path = require("path");
var vm = require("vm");

var root = path.join(__dirname, "..");
var problems = [];
var notes = [];

// ── 1. The data files must evaluate as plain scripts and define their globals.
var ctx = {};
vm.createContext(ctx);
var DATA = [
  ["data/sites.js", ["SITES"]],
  ["data/providers.js", ["PROVIDERS"]],
  ["data/news.js", ["NEWS"]],
  ["data/sources.js", ["SOURCE_CLASSES", "SOURCE_CLASS_ORDER", "SOURCE_CHANNELS", "CONFIDENCE_LEVELS", "VERDICTS", "PROVENANCE_FIELDS", "FIELD_LABELS", "BASIS_LABELS",
    "classifySource", "scoreSite", "scoreSiteField", "verdictFor", "liftAdvice", "derivativeHint", "hostOf", "siteFieldBasis", "siteFieldHasProvenance", "siteEvidenceFor"]]
];
DATA.forEach(function(entry){
  var file = entry[0];
  try {
    vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), ctx, { filename: file });
  } catch (e) {
    problems.push(file + " does not evaluate: " + e.message);
    return;
  }
  entry[1].forEach(function(name){
    if (typeof ctx[name] === "undefined") problems.push(file + " does not define " + name);
  });
});

// Every site needs the fields index.html reads unconditionally.
if (Array.isArray(ctx.SITES)) {
  var seen = {};
  ctx.SITES.forEach(function(s, i){
    var label = (s && s.id) || ("#" + i);
    ["id", "provider", "city", "country", "status"].forEach(function(f){
      if (s[f] == null || s[f] === "") problems.push("sites.js " + label + ": missing " + f);
    });
    if (typeof s.lat !== "number" || typeof s.lon !== "number") problems.push("sites.js " + label + ": lat/lon must be numbers");
    if (s.capacityMW != null && typeof s.capacityMW !== "number") problems.push("sites.js " + label + ": capacityMW must be a number or null");
    if (s.id) { if (seen[s.id]) problems.push("sites.js: duplicate id " + s.id); seen[s.id] = true; }
  });
  notes.push(ctx.SITES.length + " sites");
}

// ── 2. The page's inline script must parse.
var html = fs.readFileSync(path.join(root, "index.html"), "utf8");
var m = html.match(/<script>\n([\s\S]*?)<\/script>\s*<\/body>/) || html.match(/<script>\n([\s\S]*)<\/script>\s*$/);
if (!m) {
  problems.push("index.html: could not find the inline <script> block");
} else {
  var js = m[1];
  try { new Function(js); notes.push("script parses (" + js.length + " chars)"); }
  catch (e) { problems.push("index.html script does not parse: " + e.message); }

  // ── 3. Every id the script asks for has to exist: either in the static
  //       markup, or in HTML the script itself builds (id="…" inside a string).
  var wanted = {};
  var re = /getElementById\(\s*["']([^"']+)["']\s*\)/g, r;
  while ((r = re.exec(js))) wanted[r[1]] = true;
  var re2 = /querySelector(?:All)?\(\s*["']#([A-Za-z_][\w-]*)/g;
  while ((r = re2.exec(js))) wanted[r[1]] = true;
  var defined = {};
  var re3 = /\bid=\\?["']([A-Za-z_][\w-]*)\\?["']/g;
  while ((r = re3.exec(html))) defined[r[1]] = true;
  Object.keys(wanted).forEach(function(id){
    if (!defined[id]) problems.push("index.html: script uses #" + id + " but nothing defines id=\"" + id + "\"");
  });
  notes.push(Object.keys(wanted).length + " ids referenced, all present");

  // ── 4. Sprite icons: every <use href="#i-…"> needs a <symbol id="i-…">.
  var symbols = {};
  var re4 = /<symbol id="(i-[\w-]+)"/g;
  while ((r = re4.exec(html))) symbols[r[1]] = true;
  var used = {};
  var re5 = /href="#(i-[\w-]+)"/g;
  while ((r = re5.exec(html))) used[r[1]] = true;
  // Icons built by the ICON() helper in the script.
  var re6 = /ICON\(\s*["']([\w-]+)["']/g;
  while ((r = re6.exec(js))) used["i-" + r[1]] = true;
  Object.keys(used).forEach(function(id){
    if (!symbols[id]) problems.push("index.html: icon #" + id + " is referenced but no <symbol> defines it");
  });

  // ── 5. Data globals the script relies on must be the ones the data files define.
  ["SITES", "PROVIDERS", "NEWS", "SOURCE_CLASSES", "CONFIDENCE_LEVELS", "VERDICTS"].forEach(function(g){
    if (js.indexOf(g) !== -1 && typeof ctx[g] === "undefined") problems.push("index.html uses " + g + " but no data file defines it");
  });
}

// ── Report.
if (problems.length) {
  console.error("check: FAIL");
  problems.forEach(function(p){ console.error("  - " + p); });
  process.exit(1);
}
console.log("check: OK — " + notes.join(" · "));
