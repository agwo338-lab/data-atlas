// Site Atlas — data file
//
// This is the only file you should need to edit to keep your map up to date.
// Each entry is one facility. Fields:
//   id          unique short slug, no spaces (used internally, never shown)
//   provider    company/operator name — new names are picked up automatically,
//               no other file needs to change when you add a new one
//   site        the facility's own name/label, if it has one (else leave "")
//   city, country
//   lat, lon    decimal degrees
//   status      "Operational" | "Under construction" | "Planned"
//   capacityMW  disclosed power capacity in megawatts, or null if not public
//   source      short citation label, shown as a link in the detail panel
//   sourceUrl   link that citation points to
//   notes       your own free-text notes — anything you want to remember

var SITES = [
  {
    id: "nebius-mantsala",
    provider: "Nebius",
    site: "Mäntsälä I & II",
    city: "Mäntsälä",
    country: "Finland",
    lat: 60.6317,
    lon: 25.3200,
    status: "Operational",
    capacityMW: null,
    source: "Data Center Dynamics, Aug 2026",
    sourceUrl: "https://www.datacenterdynamics.com/en/news/nebius-expands-european-presence-announces-deployment-in-estonia-and-second-data-center-in-m%C3%A4nts%C3%A4l%C3%A4-finland/",
    notes: "Nebius's original flagship European site (inherited from Yandex); a second facility on the same site was announced in 2026."
  },
  {
    id: "nebius-lappeenranta",
    provider: "Nebius",
    site: "Lappeenranta AI Factory",
    city: "Lappeenranta",
    country: "Finland",
    lat: 61.0587,
    lon: 28.1887,
    status: "Planned",
    capacityMW: 310,
    source: "Nebius newsroom, Mar 2026",
    sourceUrl: "https://nebius.com/newsroom/nebius-to-construct-310-mw-ai-factory-in-finland",
    notes: "€8.5B project; first capacity expected 2027."
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
    source: "Data Center Dynamics, 2026",
    sourceUrl: "https://www.datacenterdynamics.com/en/news/nebius-expands-european-presence-announces-deployment-in-estonia-and-second-data-center-in-m%C3%A4nts%C3%A4l%C3%A4-finland/",
    notes: ""
  },
  {
    id: "nebius-london",
    provider: "Nebius",
    site: "Ark DC",
    city: "London",
    country: "United Kingdom",
    lat: 51.5074,
    lon: -0.1278,
    status: "Operational",
    capacityMW: null,
    source: "datacenters.com",
    sourceUrl: "https://www.datacenters.com/providers/nebius",
    notes: "Colocated capacity."
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
    source: "Data Center Dynamics, Jun 2026",
    sourceUrl: "https://www.datacenterdynamics.com/en/news/nebius-expands-european-presence-announces-deployment-in-estonia-and-second-data-center-in-m%C3%A4nts%C3%A4l%C3%A4-finland/",
    notes: "Part of a wider £1.7B UK investment pledge, alongside new Nvidia infrastructure deployments."
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
    source: "Data Center Dynamics, Aug 2026",
    sourceUrl: "https://www.datacenterdynamics.com/en/news/nebius-expands-european-presence-announces-deployment-in-estonia-and-second-data-center-in-m%C3%A4nts%C3%A4l%C3%A4-finland/",
    notes: "Near Tallinn."
  },
  {
    id: "nebius-vineland",
    provider: "Nebius",
    site: "DataOne",
    city: "Vineland, NJ",
    country: "United States",
    lat: 39.4864,
    lon: -75.0257,
    status: "Operational",
    capacityMW: null,
    source: "Data Center Dynamics",
    sourceUrl: "https://baxtel.com/data-centers/nebius",
    notes: "Leased capacity — Nebius's US entry point."
  }
];
