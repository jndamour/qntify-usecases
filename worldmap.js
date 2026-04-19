// Real world map via TopoJSON world-110m.
// Loads the dataset async from a CDN, converts topology to SVG path strings in
// equirectangular projection matching the 1000×500 viewbox.

(function () {
  window.MAP = {
    W: 1000,
    H: 500,
    project(lon, lat) {
      return {
        x: ((lon + 180) / 360) * 1000,
        y: ((90 - lat) / 180) * 500,
      };
    },
  };

  // Build an SVG `d` string from a GeoJSON Polygon/MultiPolygon in equirectangular.
  function geoJsonToPathD(geom) {
    const parts = [];
    const rings = geom.type === 'MultiPolygon'
      ? geom.coordinates.flat()
      : geom.type === 'Polygon'
      ? geom.coordinates
      : [];
    for (const ring of rings) {
      if (!ring.length) continue;
      let d = '';
      for (let i = 0; i < ring.length; i++) {
        const [lon, lat] = ring[i];
        const x = ((lon + 180) / 360) * 1000;
        const y = ((90 - lat) / 180) * 500;
        d += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2);
      }
      parts.push(d + 'Z');
    }
    return parts.join(' ');
  }

  // Fetch TopoJSON world-110m from CDN and convert to array of path-d strings
  // (one per country) — anti-meridian clipping is skipped because the dataset
  // ships pre-cut for the Pacific.
  async function loadWorld() {
    try {
      const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
      const topo = await res.json();
      if (!window.topojson) throw new Error('topojson-client not loaded');
      const fc = window.topojson.feature(topo, topo.objects.countries);
      const paths = fc.features.map(f => geoJsonToPathD(f.geometry)).filter(Boolean);
      window.MAP_PATHS = paths;
      // expose raw ring coords for orthographic (globe) re-projection
      // shape: Array<Array<Array<[lon,lat]>>>  -- feature → rings → points
      window.MAP_FEATURES = fc.features.map(f => {
        const g = f.geometry;
        if (!g) return [];
        if (g.type === 'Polygon') return g.coordinates;
        if (g.type === 'MultiPolygon') return g.coordinates.flat();
        return [];
      });
      window.dispatchEvent(new CustomEvent('mapready'));
    } catch (e) {
      console.error('map load failed, falling back to stub', e);
      window.MAP_PATHS = window.MAP_PATHS_FALLBACK || [];
      window.dispatchEvent(new CustomEvent('mapready'));
    }
  }

  // Minimal fallback so the UI never looks empty if the CDN is blocked.
  window.MAP_PATHS_FALLBACK = [
    "M 140 80 L 330 90 L 330 165 L 290 195 L 225 240 L 140 195 L 108 170 L 115 110 Z",
    "M 285 270 L 355 315 L 350 365 L 305 425 L 278 420 L 272 345 Z",
    "M 470 110 L 580 130 L 555 158 L 490 150 L 470 128 Z",
    "M 485 190 L 600 270 L 555 370 L 525 378 L 475 225 Z",
    "M 590 85 L 880 125 L 820 170 L 660 185 L 590 135 Z",
    "M 830 335 L 955 360 L 895 392 L 825 365 Z",
    "M 0 455 L 1000 455 L 1000 500 L 0 500 Z",
  ];
  window.MAP_PATHS = window.MAP_PATHS_FALLBACK;

  loadWorld();
})();
