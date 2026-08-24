// Site Atlas — provider data
//
// One entry per operator/company shown on the map. `data/sites.js` entries
// reference a provider by name (the `provider` field); this file is the
// canonical home for anything that's about the *company* rather than one
// specific site — right now just its display color, with room to grow
// (e.g. a homepage link or short blurb) as more providers get added.
//
// Schema: PROVIDERS is an array of:
//   name    string — must exactly match `provider` in data/sites.js entries
//   color   hex string — used for this provider's dashboard card, map
//           pins, table dot, and provider page. Optional — omit the field
//           (or leave the provider out of this file entirely) to fall back
//           to the next unused color in index.html's shared palette.
//
// A provider does NOT need an entry here to appear on the map — any new
// `provider` string in data/sites.js is picked up automatically and
// auto-assigned a palette color. Add an entry here only when a provider
// warrants a pinned color — e.g. matching brand identity, softened to fit
// this site's muted dark palette rather than used at full saturation.

var PROVIDERS = [
  { name: "Nebius", color: "#4CAF6D" },
  { name: "CoreWeave", color: "#4C6FE5" }
];
