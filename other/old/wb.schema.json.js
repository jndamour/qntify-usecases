// Content schema for the Qntify Whistleblower Claims page.
// Every user-editable string/number on the page maps to a field in this file.
// Replace window.WB_CONTENT_SCHEMA below with your own values (or load from
// JSON at runtime and assign to window.WB_CONTENT_SCHEMA before the app mounts).
//
// See SCHEMA-wb.md for field-by-field documentation.

window.WB_CONTENT_SCHEMA = {
  "$schema": "qntify-whistleblower/1.0",

  "brand": {
    "name": "Qntify",
    "tagline": "© Qntify · 2026",
    "footerLinks": "Qntify.net · Legal · Privacy",
    "navLinks": [
      { "label": "Asset Mapping",     "href": "Global Asset Map.html" },
      { "label": "Alternative Assets","href": "Alternative Assets.html" },
      { "label": "Whistleblower",     "href": "#", "active": true },
      { "label": "Emerging Markets",  "href": "Emerging Markets.html" },
      { "label": "Request Demo",      "href": "#" }
    ]
  },

  "hero": {
    "eyebrow": "Use Case · 05",
    "headline": "Where fraud is revealed in {em}signals{/em}, not sources.",
    "lede": "Qntify consolidates independent signals — filings, registries, market traces, disclosures — into actionable whistleblower tips. We assemble the pattern that regulators need to act.",
    "stats": [
      { "value": "$2.4B", "label": "Sanctions influenced" },
      { "value": "340+",  "label": "Tips processed" },
      { "value": "11",    "label": "Enforcement actions supported" }
    ],
    "focus": [
      { "tag": "POL-CORR",   "label": "Political corruption" },
      { "tag": "CORP-FRAUD", "label": "Corporate fraud & malfeasance" },
      { "tag": "TBML",       "label": "Trade-based money laundering" }
    ]
  },

  "pastiche": {
    "eyebrow": "Pattern Detection",
    "headline": "Five clippings. One entity.",
    "body": "Signals rarely arrive together. They accumulate over months across filings, audits, and regulatory notices. Qntify's job is the reconciliation — the moment five independent accounts resolve to a single beneficial owner.",
    "clippings": [
      {
        "id": "CLIP-A",
        "kicker": "FINANCIAL · Europe",
        "headline": "Shell network routes freight contracts through third jurisdictions",
        "body": "Invoices reviewed by regulators show repeated over-valuation of commodity shipments moving between a Mediterranean port authority and an intermediary in the Gulf. The price gap, averaging twenty-two percent above market, has persisted across three fiscal years and recurs in seven related filings.",
        "highlights": [ { "start": 55, "end": 116 }, { "start": 175, "end": 215 } ],
        "tag": "TBML",
        "x": 0.04, "y": 0.10, "rot": -2.2, "w": 320
      },
      {
        "id": "CLIP-B",
        "kicker": "POLITICAL · Capitol",
        "headline": "Senate committee chair tied to undisclosed consulting fees",
        "body": "Campaign-adjacent payments flowing through a limited liability partnership appear to correlate with favorable subcommittee scheduling decisions. The entity was registered two weeks before the first of four six-figure transfers and dissolved within ninety days of the final one.",
        "highlights": [ { "start": 50, "end": 115 }, { "start": 165, "end": 235 } ],
        "tag": "POL-CORR",
        "x": 0.54, "y": 0.04, "rot": 1.6, "w": 320
      },
      {
        "id": "CLIP-C",
        "kicker": "MARKETS · Q2",
        "headline": "Revenue-recognition inquiry deepens at industrial conglomerate",
        "body": "Internal audit memos describe a pattern in which service contracts were booked as fulfilled ahead of delivery milestones, inflating recognized revenue for at least six consecutive quarters. A former regional controller resigned without cause shortly after raising concerns to the audit committee.",
        "highlights": [ { "start": 48, "end": 130 }, { "start": 180, "end": 240 } ],
        "tag": "CORP-FRAUD",
        "x": 0.30, "y": 0.42, "rot": 0.8, "w": 340
      },
      {
        "id": "CLIP-D",
        "kicker": "REGULATORY · Filing",
        "headline": "Correspondent bank flags trade finance irregularities",
        "body": "A Tier-1 correspondent bank filed suspicious-activity reports covering letters of credit drawn against shipments that could not be reconciled with port manifests. The filings identified the same beneficial owner across four ostensibly unrelated trading companies.",
        "highlights": [ { "start": 60, "end": 145 }, { "start": 180, "end": 245 } ],
        "tag": "TBML",
        "x": 0.70, "y": 0.46, "rot": -1.4, "w": 320
      },
      {
        "id": "CLIP-E",
        "kicker": "CIVIL SOCIETY",
        "headline": "Procurement audit surfaces repeat low-bidder anomalies",
        "body": "An independent audit of three agency procurement cycles identified a vendor that consistently submitted winning bids within two percent of the internal estimate — a figure that, according to the audit, should not have been available to external bidders at the time of submission.",
        "highlights": [ { "start": 70, "end": 160 } ],
        "tag": "POL-CORR",
        "x": 0.08, "y": 0.66, "rot": 2.4, "w": 310
      }
    ],
    "caseCallouts": {
      "standard": {
        "id": "W-2025-047",
        "program": "SEC Whistleblower Program",
        "statute": "§ 21F, Securities Exchange Act",
        "sanctionRange": "$40M – $120M",
        "jurisdictions": ["US · SDNY", "UK · SFO", "Luxembourg"],
        "status": "Intake complete · Tips consolidated"
      },
      "dossier": {
        "id": "W-2025-047",
        "subject": "████████████ (financial-industrial group)",
        "program": "SEC WB · FinCEN AML",
        "statute": "§ 21F · 31 U.S.C. 5323",
        "projectedAward": "$8M – $24M",
        "stage": "Counsel engaged"
      },
      "narrative": {
        "id": "W-2025-047",
        "headline": "Four independent signals, one entity.",
        "body": "Five clippings. One beneficial owner across three jurisdictions. A consolidated tip is now under review with the SEC Office of the Whistleblower."
      }
    }
  },

  "typology": {
    "eyebrow": "Typology",
    "headline": "Eight patterns that recur across jurisdictions.",
    "items": [
      { "n": "01", "name": "Invoice misvaluation",     "body": "Systematic over- or under-pricing of cross-border goods to move value." },
      { "n": "02", "name": "Phantom-shipment cycles",  "body": "Trade finance extended against goods that never ship — or that ship repeatedly." },
      { "n": "03", "name": "Third-party pass-through", "body": "Beneficial ownership obscured through intermediaries in low-transparency jurisdictions." },
      { "n": "04", "name": "Channel stuffing",         "body": "Revenue recognition pulled forward through inventory pushed to captive distributors." },
      { "n": "05", "name": "Round-tripping",           "body": "Funds exit and re-enter via offshore vehicles to reclassify source or purpose." },
      { "n": "06", "name": "Procurement collusion",    "body": "Repeated bid patterns consistent with information leakage or allocation." },
      { "n": "07", "name": "Shell layering",           "body": "Entity chains registered and dissolved within transaction windows." },
      { "n": "08", "name": "Sanctions masking",        "body": "Counterparty substitution or intermediary insertion to obscure restricted parties." }
    ]
  },

  "programs": {
    "eyebrow": "Programs",
    "headline": "Federal whistleblower frameworks we file under.",
    "body": "Three U.S. frameworks account for the bulk of our filings. We work with outside counsel in each jurisdiction; awards accrue to the source, not to Qntify.",
    "items": [
      {
        "abbr": "SEC",
        "name": "SEC Whistleblower Program",
        "statute": "Dodd-Frank § 21F · 2010",
        "scope": "Securities law violations: disclosure fraud, market manipulation, FCPA, accounting fraud.",
        "award": "10–30% of sanctions over $1M",
        "note": "Anti-retaliation protections under § 21F-17."
      },
      {
        "abbr": "CFTC",
        "name": "CFTC Whistleblower Program",
        "statute": "Dodd-Frank § 748 · 2010",
        "scope": "Commodities, derivatives, and swaps manipulation; spoofing; benchmark rigging.",
        "award": "10–30% of sanctions over $1M",
        "note": "Confidentiality maintained to the extent permitted by law."
      },
      {
        "abbr": "FinCEN",
        "name": "FinCEN AML Whistleblower Program",
        "statute": "AMLA § 6314 · 2020 / expanded 2022",
        "scope": "BSA/AML violations, sanctions evasion, trade-based money laundering, beneficial-ownership reporting.",
        "award": "10–30% of sanctions over $1M",
        "note": "Includes sanctions-evasion whistleblower expansion (Dec 2022)."
      }
    ]
  },

  "confidentiality": {
    "eyebrow": "Confidentiality",
    "headline": "Source protection is operational, not aspirational.",
    "pillars": [
      { "n": "01", "label": "Source anonymity",       "body": "Attorney-client and work-product privilege preserved throughout intake, triage, and filing." },
      { "n": "02", "label": "Compartmented handling", "body": "Case matter siloed from adjacent engagements. Access-on-need; no cross-matter reuse." },
      { "n": "03", "label": "Anti-retaliation",       "body": "§ 21F-17 and equivalent provisions actively invoked when employment action follows disclosure." },
      { "n": "04", "label": "Comms discipline",       "body": "Signal-grade channels, ephemeral review environments, counsel-mediated handoff of primary materials." }
    ]
  },

  "close": {
    "eyebrow": "Next",
    "headline": "If you have a signal, we can help you structure it into a filing.",
    "primaryCta":   { "label": "Contact intake →",      "href": "#" },
    "secondaryCta": { "label": "Download methodology", "href": "#" }
  },

  "theme": {
    "mode":    "light",
    "accent":  "copper",
    "callout": "standard"
  }
};
