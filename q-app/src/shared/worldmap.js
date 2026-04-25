// World map state: equirectangular projection helper + lazy-loaded land
// outlines. Consumers can import the projection synchronously, but should
// listen for the 'mapready' event before drawing land paths.
import { feature } from 'topojson-client'

const W = 1000
const H = 500

export const MAP = {
  W,
  H,
  project(lon, lat) {
    return {
      x: ((lon + 180) / 360) * W,
      y: ((90 - lat) / 180) * H,
    }
  },
}

// Minimal fallback so the UI never looks empty if the CDN is blocked.
const FALLBACK_PATHS = [
  'M 140 80 L 330 90 L 330 165 L 290 195 L 225 240 L 140 195 L 108 170 L 115 110 Z',
  'M 285 270 L 355 315 L 350 365 L 305 425 L 278 420 L 272 345 Z',
  'M 470 110 L 580 130 L 555 158 L 490 150 L 470 128 Z',
  'M 485 190 L 600 270 L 555 370 L 525 378 L 475 225 Z',
  'M 590 85 L 880 125 L 820 170 L 660 185 L 590 135 Z',
  'M 830 335 L 955 360 L 895 392 L 825 365 Z',
  'M 0 455 L 1000 455 L 1000 500 L 0 500 Z',
]

let mapPaths = FALLBACK_PATHS
let mapFeatures = []

export function getMapPaths() { return mapPaths }
export function getMapFeatures() { return mapFeatures }

function geoJsonToPathD(geom) {
  const parts = []
  const rings = geom.type === 'MultiPolygon'
    ? geom.coordinates.flat()
    : geom.type === 'Polygon'
    ? geom.coordinates
    : []
  for (const ring of rings) {
    if (!ring.length) continue
    let d = ''
    for (let i = 0; i < ring.length; i++) {
      const [lon, lat] = ring[i]
      const x = ((lon + 180) / 360) * W
      const y = ((90 - lat) / 180) * H
      d += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2)
    }
    parts.push(d + 'Z')
  }
  return parts.join(' ')
}

async function loadWorld() {
  try {
    // fetch() with a relative URL resolves against the document URL, so this
    // works on both root deploys (Azure) and subpath deploys (GitHub Pages).
    const res = await fetch('countries-110m.json')
    const topo = await res.json()
    const fc = feature(topo, topo.objects.countries)
    mapPaths = fc.features.map(f => geoJsonToPathD(f.geometry)).filter(Boolean)
    mapFeatures = fc.features.map(f => {
      const g = f.geometry
      if (!g) return []
      if (g.type === 'Polygon') return g.coordinates
      if (g.type === 'MultiPolygon') return g.coordinates.flat()
      return []
    })
    window.dispatchEvent(new CustomEvent('mapready'))
  } catch (e) {
    console.error('map load failed, using fallback', e)
    window.dispatchEvent(new CustomEvent('mapready'))
  }
}

loadWorld()
