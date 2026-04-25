// 8 tracked assets across the globe — lat/lon + type + details
// Coordinate system: lat -90..90, lon -180..180
// Asset types: PROPERTY, BANK, AIRCRAFT, BUSINESS
// Edit data/assets.json to change the data set.
//
// Optional `image` field per asset: relative URL to an image file
// (e.g. "assets/dossier-001.webp" served from q-app/public/assets/).
// When present, the DetailPanel renders the image in the dossier's image
// section; when absent, falls back to the type-specific line-art glyph.

import assets from './data/assets.json'

export const ASSETS = assets
