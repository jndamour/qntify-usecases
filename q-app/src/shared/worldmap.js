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

// Walks a GeoJSON ring and splits it wherever consecutive vertices jump more
// than 180° in longitude (the antimeridian crossing — Russia, Fiji, etc.).
// At each crossing we interpolate the latitude where the edge meets ±180°
// and insert a seam vertex on both sides, so each resulting sub-ring closes
// cleanly along the map's east/west edge instead of cutting diagonally back
// to the ring's starting vertex.
function splitRingAtAntimeridian(ring) {
  if (ring.length < 2) return [ring]
  const runs = []
  let current = [ring[0]]
  let crossings = 0
  for (let i = 1; i < ring.length; i++) {
    const [lonPrev, latPrev] = ring[i - 1]
    const [lon, lat] = ring[i]
    if (Math.abs(lon - lonPrev) > 180) {
      crossings++
      const sideI = lonPrev > 0 ? 180 : -180
      const sideJ = -sideI
      const distI = Math.abs(sideI - lonPrev)
      const totalDist = 360 - Math.abs(lon - lonPrev)
      const t = totalDist > 0 ? distI / totalDist : 0
      const seamLat = latPrev + t * (lat - latPrev)
      current.push([sideI, seamLat])
      runs.push(current)
      current = [[sideJ, seamLat], [lon, lat]]
    } else {
      current.push([lon, lat])
    }
  }
  runs.push(current)
  // GeoJSON rings are closed (ring[0] === ring[n-1]). When crossings happen,
  // the very first run and the very last run are two halves of the same piece
  // separated only by that closure — stitch them back together.
  if (crossings > 0 && runs.length >= 2) {
    const first = runs.shift()
    const last = runs[runs.length - 1]
    runs[runs.length - 1] = last.concat(first.slice(1))
  }
  return runs
}

function geoJsonToPathD(geom) {
  const parts = []
  const rings = geom.type === 'MultiPolygon'
    ? geom.coordinates.flat()
    : geom.type === 'Polygon'
    ? geom.coordinates
    : []
  for (const ring of rings) {
    if (ring.length < 2) continue
    for (const run of splitRingAtAntimeridian(ring)) {
      if (run.length < 2) continue
      let d = ''
      for (let i = 0; i < run.length; i++) {
        const [lon, lat] = run[i]
        const x = ((lon + 180) / 360) * W
        const y = ((90 - lat) / 180) * H
        d += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2)
      }
      parts.push(d + 'Z')
    }
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
