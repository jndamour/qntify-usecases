// Content schema for the Qntify Emerging Markets Financial Intelligence page.
// Every user-editable string/number on the page maps to a field in this file.
// Replace window.EM_CONTENT_SCHEMA below with your own values (or load from
// JSON at runtime and assign to window.EM_CONTENT_SCHEMA before the app mounts).
//
// See SCHEMA-em.md for field-by-field documentation.

window.EM_CONTENT_SCHEMA = {
  "$schema": "qntify-emerging-markets/1.0",

  "brand": {
    "name": "Qntify",
    "tagline": "© Qntify · 2026",
    "footerLinks": "Qntify.net · Legal · Privacy",
    "navLinks": [
      { "label": "Asset Mapping",     "href": "Global Asset Map.html" },
      { "label": "Alternative Assets","href": "Alternative Assets.html" },
      { "label": "Whistleblower",     "href": "Whistleblower Claims.html" },
      { "label": "Emerging Markets",  "href": "#", "active": true },
      { "label": "Request Demo",      "href": "#" }
    ]
  },

  "hero": {
    "eyebrow": "Use Case · 05",
    "headline": "Emerging Markets research, built from {em}primary signals{/em}.",
    "lede": "Qntify builds EM conviction from port data, customs filings, ownership registers, and in-country sources — not consensus notes. Used by sovereign allocators, trade-finance desks, and DD teams underwriting frontier exposure.",
    "stats": [
      { "value": "47",      "label": "Countries covered" },
      { "value": "12,400+", "label": "Entities tracked" },
      { "value": "31",      "label": "Proprietary datasets" }
    ],
    "focus": [
      { "tag": "DD",    "label": "Due diligence" },
      { "tag": "TRADE", "label": "Trade & supply chain" },
      { "tag": "DATA",  "label": "Unique datasets" }
    ]
  },

  "partI": {
    "eyebrow":  "Part I",
    "headline": "Signals, not consensus.",
    "body":     "Frontier prints move faster than the research that explains them. We publish reconstructed series from primary filings so allocators can read the move as it happens — not six weeks later, through a sell-side template.",
    "heroDataset": "fx"
  },

  "chartSeries": {
    "fx": {
      "name":     "FX vs USD (indexed, 100 = Jan 2023)",
      "subtitle": "Frontier currencies, de-stressed peer set",
      "xLabels":  ["JAN 23","JUL 23","JAN 24","JUL 24","JAN 25","JUL 25","DEC 25"],
      "series": [
        { "id": "NGN", "label": "Nigeria",    "color": "#8aa37a", "data": [100,99.1,98.3,97.5,95.2,92.0,88.4,78.2,76.1,74.0,68.5,65.9,62.0,58.1,57.3,55.8,54.0,52.2,50.9,49.1,48.4,47.8,46.9,46.2,45.6,45.0,44.4,43.9,43.3,42.8,42.4,41.9,41.4,41.0,40.6,40.2] },
        { "id": "KZT", "label": "Kazakhstan", "color": "#c99a4a", "data": [100,100.3,100.9,101.2,101.8,102.1,101.5,100.8,99.9,99.0,98.4,97.8,97.1,96.3,95.7,95.0,94.2,93.4,92.7,92.0,91.3,90.7,90.1,89.6,89.0,88.4,87.9,87.4,87.0,86.7,86.3,86.0,85.7,85.5,85.2,85.0] },
        { "id": "IDR", "label": "Indonesia",  "color": "#4a7a6c", "data": [100,100.4,100.7,101.1,101.2,100.9,100.6,100.3,99.8,99.4,99.1,98.8,98.5,98.2,97.9,97.6,97.3,97.1,96.9,96.7,96.6,96.4,96.3,96.2,96.1,96.0,95.9,95.9,95.8,95.8,95.7,95.7,95.7,95.6,95.6,95.6] }
      ]
    },
    "yields": {
      "name":     "Sovereign 10Y yields (%, basis points)",
      "subtitle": "Hard-currency issuance, select frontier",
      "xLabels":  ["JAN 23","JUL 23","JAN 24","JUL 24","JAN 25","JUL 25","DEC 25"],
      "series": [
        { "id": "NGA", "label": "Nigeria",    "color": "#8aa37a", "data": [9.8,10.1,10.4,11.2,11.9,12.5,13.1,14.2,14.8,15.1,14.6,14.0,13.5,13.0,12.6,12.2,11.8,11.5,11.2,11.0,10.8,10.7,10.5,10.4,10.3,10.2,10.1,10.0,9.9,9.9,9.8,9.8,9.7,9.7,9.7,9.6] },
        { "id": "KAZ", "label": "Kazakhstan", "color": "#c99a4a", "data": [5.2,5.3,5.4,5.5,5.7,5.9,6.1,6.4,6.6,6.8,6.9,7.0,7.1,7.1,7.1,7.0,7.0,6.9,6.9,6.8,6.8,6.7,6.7,6.6,6.6,6.5,6.5,6.5,6.4,6.4,6.4,6.3,6.3,6.3,6.3,6.2] },
        { "id": "IDN", "label": "Indonesia",  "color": "#4a7a6c", "data": [6.8,6.9,7.0,7.1,7.2,7.3,7.4,7.5,7.5,7.5,7.4,7.3,7.2,7.1,7.0,6.9,6.8,6.7,6.7,6.6,6.6,6.5,6.5,6.5,6.4,6.4,6.4,6.4,6.3,6.3,6.3,6.2,6.2,6.2,6.2,6.1] }
      ]
    }
  },

  "heatmap": {
    "title":    "Cross-currency correlation",
    "subtitle": "CORRELATION · FX RETURNS · 90D",
    "labels":   ["NGN", "GHS", "KES", "KZT", "UZS", "IDR", "VND"],
    "matrix": [
      [ 1.00,  0.62,  0.41,  0.18,  0.22,  0.08,  0.11],
      [ 0.62,  1.00,  0.55,  0.14,  0.20,  0.06,  0.09],
      [ 0.41,  0.55,  1.00,  0.10,  0.16,  0.04,  0.07],
      [ 0.18,  0.14,  0.10,  1.00,  0.71,  0.25,  0.28],
      [ 0.22,  0.20,  0.16,  0.71,  1.00,  0.22,  0.24],
      [ 0.08,  0.06,  0.04,  0.25,  0.22,  1.00,  0.68],
      [ 0.11,  0.09,  0.07,  0.28,  0.24,  0.68,  1.00]
    ]
  },

  "rankedBars": {
    "name": "Sector exposure — frontier composite",
    "unit": "Share of tracked inflows, trailing 12m",
    "rows": [
      { "label": "Critical minerals",       "value": 0.28 },
      { "label": "Agricultural commodities","value": 0.19 },
      { "label": "Hydrocarbons",            "value": 0.15 },
      { "label": "Light manufacturing",     "value": 0.12 },
      { "label": "Port / logistics",        "value": 0.10 },
      { "label": "Telecom / fiber",         "value": 0.08 },
      { "label": "Renewables",              "value": 0.05 },
      { "label": "Other",                   "value": 0.03 }
    ]
  },

  "partII": {
    "eyebrow":  "Part II",
    "headline": "Trade & supply chain.",
    "body":     "A cross-border exposure is a graph, not a line. We reconstruct the graph from port, customs and ownership data — then flag chokepoints, sanctioned parents, and hidden common ownership before the deal closes.",
    "label":    "CRITICAL MINERALS · FOUR-STAGE RECONSTRUCTION"
  },

  "supplyChain": {
    "stages": [
      { "id": "mine",    "label": "MINE",     "x": 0.07 },
      { "id": "refin",   "label": "REFINERY", "x": 0.32 },
      { "id": "cathode", "label": "CATHODE",  "x": 0.58 },
      { "id": "battery", "label": "BATTERY",  "x": 0.82 }
    ],
    "nodes": [
      { "id": "m1", "stage": "mine",    "label": "DRC-A · Katanga",     "y": 0.15, "sub": "Cobalt · 42kt/y" },
      { "id": "m2", "stage": "mine",    "label": "ZMB-B · Copperbelt",  "y": 0.40, "sub": "Copper · 180kt/y" },
      { "id": "m3", "stage": "mine",    "label": "KAZ-C · Karaganda",   "y": 0.65, "sub": "Lithium brine" },
      { "id": "m4", "stage": "mine",    "label": "IDN-D · Sulawesi",    "y": 0.88, "sub": "Nickel laterite" },

      { "id": "r1", "stage": "refin",   "label": "Refiner · Tianjin",   "y": 0.22, "sub": "Cobalt sulfate · PGM" },
      { "id": "r2", "stage": "refin",   "label": "Refiner · Foshan",    "y": 0.55, "sub": "Mixed hydroxide",
        "flag": "chokepoint", "flagDetail": "Sole processor for 60%+ of Cu-Co feed from Southern Africa." },
      { "id": "r3", "stage": "refin",   "label": "Refiner · Rotterdam", "y": 0.85, "sub": "Nickel class I" },

      { "id": "c1", "stage": "cathode", "label": "Cathode · Changsha",  "y": 0.25, "sub": "NMC 811",
        "flag": "sanctions", "flagDetail": "Parent entity subject to expanded export-control listing (Oct 2025)." },
      { "id": "c2", "stage": "cathode", "label": "Cathode · Ulsan",     "y": 0.55, "sub": "LFP / NMC" },
      { "id": "c3", "stage": "cathode", "label": "Cathode · Dalian",    "y": 0.82, "sub": "High-Ni NMC",
        "flag": "ownership", "flagDetail": "Beneficial ownership traces to same holding as Refiner · Foshan." },

      { "id": "b1", "stage": "battery", "label": "OEM · K1",            "y": 0.30, "sub": "EV platform A" },
      { "id": "b2", "stage": "battery", "label": "OEM · K2",            "y": 0.55, "sub": "EV platform B" },
      { "id": "b3", "stage": "battery", "label": "OEM · K3",            "y": 0.80, "sub": "ESS / grid" }
    ],
    "edges": [
      ["m1","r1"],["m1","r2"],
      ["m2","r2"],
      ["m3","r2"],["m3","r3"],
      ["m4","r3"],
      ["r1","c1"],["r1","c2"],
      ["r2","c1"],["r2","c2"],["r2","c3"],
      ["r3","c2"],["r3","c3"],
      ["c1","b1"],
      ["c2","b1"],["c2","b2"],
      ["c3","b2"],["c3","b3"]
    ]
  },

  "datasets": {
    "eyebrow":  "Part III",
    "headline": "Proprietary datasets.",
    "body":     "Six of thirty-one. Each is built, cleaned, and reconciled in-house — not licensed. FOI-recovered where necessary. Available to partners under standard data terms.",
    "items": [
      { "n": "01", "name": "Port AIS vessel dwell",     "body": "Hourly vessel positions and berth-dwell metrics across 340 EM container and bulk terminals." },
      { "n": "02", "name": "Frontier customs filings",  "body": "De-duplicated HS-code level trade filings from 22 countries, cleaned of re-exports." },
      { "n": "03", "name": "Sovereign MOF disclosures", "body": "Machine-readable Ministry of Finance issuance, debt stock, and guarantee filings." },
      { "n": "04", "name": "LCA licensing registers",   "body": "Local content and licensing records for extractive concessions in 14 jurisdictions." },
      { "n": "05", "name": "Regional power dispatch",   "body": "Day-ahead and real-time dispatch from EM ISOs where published or FOI-recovered." },
      { "n": "06", "name": "State-enterprise filings",  "body": "Annual reports and audited financials of SOEs below listing thresholds." }
    ]
  },

  "vignette": {
    "eyebrow":  "Case Vignette",
    "headline": "How a four-week engagement re-shaped a battery-metals off-take.",
    "id":       "EM-C-2025-019",
    "region":   "Southeast Asia",
    "subject":  "Battery metals consortium, cross-listed Jakarta / Singapore",
    "body":     "Initial mandate: confirm the operational independence of three 'unaffiliated' suppliers feeding a proposed off-take agreement. Source reconciliation across customs filings, port AIS, and corporate disclosures surfaced common beneficial ownership and a shared logistics agent. The off-take was re-scoped with tighter representations and an audit-step prior to closing.",
    "stages": [
      { "label": "Intake",    "body": "Mandate, KYC, scoping of jurisdictions and entities." },
      { "label": "Signals",   "body": "Filings, customs, AIS, ownership — reconciled against named counterparties." },
      { "label": "Fieldwork", "body": "In-country sources, operational visits, local counsel consultations." },
      { "label": "Report",    "body": "Findings, exposures, and recommended deal mechanics." }
    ],
    "outcome": "Off-take closed · audit-step inserted · two counterparties removed from scope"
  },

  "coverage": {
    "eyebrow":  "Coverage",
    "headline": "Country depth.",
    "body":     "Depth varies by country and mandate. Deep coverage means primary sources, local counsel, and regular fieldwork; selective is sector-specific; targeted means we spin up on request.",
    "legend": {
      "deep":      "DEEP — primary sources, fieldwork",
      "selective": "SELECTIVE — select sectors",
      "targeted":  "TARGETED — project-specific"
    },
    "countries": [
      { "region": "Africa",         "country": "Nigeria",         "depth": "deep" },
      { "region": "Africa",         "country": "Ghana",           "depth": "deep" },
      { "region": "Africa",         "country": "Kenya",           "depth": "deep" },
      { "region": "Africa",         "country": "DRC",             "depth": "deep" },
      { "region": "Africa",         "country": "Zambia",          "depth": "deep" },
      { "region": "Africa",         "country": "South Africa",    "depth": "deep" },
      { "region": "Africa",         "country": "Ethiopia",        "depth": "selective" },
      { "region": "Africa",         "country": "Côte d'Ivoire",   "depth": "selective" },
      { "region": "Africa",         "country": "Senegal",         "depth": "selective" },
      { "region": "Africa",         "country": "Tanzania",        "depth": "selective" },
      { "region": "Africa",         "country": "Morocco",         "depth": "targeted" },
      { "region": "Africa",         "country": "Egypt",           "depth": "targeted" },

      { "region": "Central Asia",   "country": "Kazakhstan",      "depth": "deep" },
      { "region": "Central Asia",   "country": "Uzbekistan",      "depth": "deep" },
      { "region": "Central Asia",   "country": "Kyrgyzstan",      "depth": "selective" },
      { "region": "Central Asia",   "country": "Tajikistan",      "depth": "selective" },
      { "region": "Central Asia",   "country": "Mongolia",        "depth": "targeted" },
      { "region": "Central Asia",   "country": "Turkmenistan",    "depth": "targeted" },

      { "region": "Southeast Asia", "country": "Indonesia",       "depth": "deep" },
      { "region": "Southeast Asia", "country": "Vietnam",         "depth": "deep" },
      { "region": "Southeast Asia", "country": "Philippines",     "depth": "deep" },
      { "region": "Southeast Asia", "country": "Malaysia",        "depth": "selective" },
      { "region": "Southeast Asia", "country": "Thailand",        "depth": "selective" },
      { "region": "Southeast Asia", "country": "Myanmar",         "depth": "targeted" },
      { "region": "Southeast Asia", "country": "Cambodia",        "depth": "targeted" },
      { "region": "Southeast Asia", "country": "Laos",            "depth": "targeted" }
    ]
  },

  "close": {
    "eyebrow":      "Next",
    "headline":     "The alpha in frontier is in the reconstruction. Qntify reconstructs.",
    "primaryCta":   { "label": "Request a briefing →",         "href": "#" },
    "secondaryCta": { "label": "Download sample report (PDF)", "href": "#" }
  },

  "theme": {
    "mode":           "light",
    "accent":         "sage",
    "networkFocus":   "none"
  }
};
