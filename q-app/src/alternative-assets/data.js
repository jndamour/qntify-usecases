export const ALT_DATA = {
  relationshipNodes: [
    { id: 'claimant', label: 'Claimant', sub: 'Institutional holder', x: 0.08, y: 0.5, kind: 'origin' },
    { id: 'counsel-a', label: 'Counsel (Lead)', sub: 'Magic-circle firm', x: 0.26, y: 0.28, kind: 'counsel' },
    { id: 'counsel-b', label: 'Local Counsel', sub: 'In-jurisdiction', x: 0.26, y: 0.72, kind: 'counsel' },
    { id: 'forum-a', label: 'Forum · ICSID', sub: 'Washington, DC', x: 0.48, y: 0.18, kind: 'forum' },
    { id: 'forum-b', label: 'Forum · UNCITRAL', sub: 'Seat: Paris', x: 0.48, y: 0.42, kind: 'forum' },
    { id: 'forum-c', label: 'Forum · NY Supreme Court', sub: 'Judgment recognition', x: 0.48, y: 0.65, kind: 'forum' },
    { id: 'forum-d', label: 'Forum · High Court UK', sub: '§ 101 enforcement', x: 0.48, y: 0.85, kind: 'forum' },
    { id: 'obligor', label: 'Obligor', sub: 'Sovereign / Corporate / Individual', x: 0.70, y: 0.5, kind: 'obligor' },
    { id: 'asset-1', label: 'Recoverable', sub: 'Commercial real estate', x: 0.90, y: 0.18, kind: 'asset' },
    { id: 'asset-2', label: 'Recoverable', sub: 'Aircraft registry', x: 0.90, y: 0.38, kind: 'asset' },
    { id: 'asset-3', label: 'Recoverable', sub: 'Blocked bank accounts', x: 0.90, y: 0.62, kind: 'asset' },
    { id: 'asset-4', label: 'Recoverable', sub: 'Shareholding / equity', x: 0.90, y: 0.82, kind: 'asset' },
  ],
  relationshipEdges: [
    ['claimant', 'counsel-a'], ['claimant', 'counsel-b'],
    ['counsel-a', 'forum-a'], ['counsel-a', 'forum-b'],
    ['counsel-b', 'forum-c'], ['counsel-b', 'forum-d'],
    ['forum-a', 'obligor'], ['forum-b', 'obligor'],
    ['forum-c', 'obligor'], ['forum-d', 'obligor'],
    ['obligor', 'asset-1'], ['obligor', 'asset-2'],
    ['obligor', 'asset-3'], ['obligor', 'asset-4'],
  ],

  lifecycle: [
    { n: '01', title: 'Origination', body: 'Referral, broker-dealer, or direct claimant outreach. Initial review of jurisdiction, theory, and quantum.' },
    { n: '02', title: 'Diligence', body: 'Merits opinion, enforcement analysis, obligor-asset tracing, counter-party risk, insurance.' },
    { n: '03', title: 'Funding', body: 'Non-recourse capital deployment against defined case budget. Alignment through return waterfalls.' },
    { n: '04', title: 'Litigation / Arbitration', body: 'Active case management. Monitoring of docket, discovery, and strategic inflection points.' },
    { n: '05', title: 'Enforcement & Recovery', body: 'Post-award execution across jurisdictions. Asset tracing, freezing orders, attachment, and monetization.' },
  ],

  cases: [
    { id: 'C-2023-044', jurisdiction: 'London, UK', lat: 51.5, lon: -0.12, type: 'Judgment recognition', duration: '2.4 yrs', outcome: 'Settled', status: 'Closed' },
    { id: 'C-2024-011', jurisdiction: 'Washington DC (ICSID)', lat: 38.9, lon: -77.03, type: 'Investor-state arbitration', duration: '4.1 yrs', outcome: 'Award issued', status: 'Enforcement' },
    { id: 'C-2024-019', jurisdiction: 'Paris, FR', lat: 48.85, lon: 2.35, type: 'Commercial arbitration', duration: '3.0 yrs', outcome: 'Award issued', status: 'Active' },
    { id: 'C-2024-028', jurisdiction: 'Singapore, SG', lat: 1.35, lon: 103.82, type: 'Contract breach', duration: '1.8 yrs', outcome: 'Award issued', status: 'Closed' },
    { id: 'C-2025-003', jurisdiction: 'New York, US', lat: 40.71, lon: -74.01, type: 'Fraudulent conveyance', duration: '1.1 yrs', outcome: 'Judgment', status: 'Active' },
    { id: 'C-2025-017', jurisdiction: 'São Paulo, BR', lat: -23.55, lon: -46.63, type: 'Expropriation claim', duration: '3.6 yrs', outcome: 'Pending', status: 'Active' },
    { id: 'C-2025-022', jurisdiction: 'Frankfurt, DE', lat: 50.11, lon: 8.68, type: 'Sovereign default recovery', duration: '2.2 yrs', outcome: 'Partial recovery', status: 'Active' },
    { id: 'C-2026-001', jurisdiction: 'Dubai, AE', lat: 25.20, lon: 55.27, type: 'Asset tracing', duration: '0.4 yrs', outcome: 'Ongoing', status: 'Active' },
  ],
}
