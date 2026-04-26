import { useEffect, useMemo, useRef, useState } from 'react'
import { useInView, Rule } from '../shared/ui'
import { getMapFeatures } from '../shared/worldmap'
import { ALT_DATA } from './data'

export function JurisdictionsMap({ theme }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.2 })
  const cases = ALT_DATA.cases

  const [features, setFeatures] = useState(getMapFeatures())
  const [activeIdx, setActiveIdx] = useState(0)
  const [lambda, setLambda] = useState(20)
  // tilt of the globe, in degrees. 0 means equator-on, 90 means pole-on
  // default -15
  const phi = -15

  useEffect(() => {
    const onReady = () => setFeatures(getMapFeatures())
    window.addEventListener('mapready', onReady)
    const initial = getMapFeatures()
    if (initial && initial.length) setFeatures(initial)
    return () => window.removeEventListener('mapready', onReady)
  }, [])

  useEffect(() => {
    if (!inView) return
    let raf
    let last = performance.now()
    const tick = (t) => {
      const dt = t - last; last = t
      setLambda(l => (l + dt * 0.012) % 360)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView])

  useEffect(() => {
    if (!inView) return
    const id = setInterval(() => setActiveIdx(i => (i + 1) % cases.length), 4200)
    return () => clearInterval(id)
  }, [inView, cases.length])

  const active = cases[activeIdx]

  const R = 1
  const cosPhi = Math.cos(phi * Math.PI / 180)
  const sinPhi = Math.sin(phi * Math.PI / 180)

  const project = (lon, lat) => {
    const l = (lon + lambda) * Math.PI / 180
    const p = lat * Math.PI / 180
    const x = Math.cos(p) * Math.sin(l)
    const y = Math.sin(p)
    const z = Math.cos(p) * Math.cos(l)
    const y2 = y * cosPhi - z * sinPhi
    const z2 = y * sinPhi + z * cosPhi
    return { x: R * x, y: -R * y2, z: z2 }
  }

  const ringToPaths = (ring) => {
    const out = []
    let current = ''
    for (let i = 0; i < ring.length; i++) {
      const [lon, lat] = ring[i]
      const p = project(lon, lat)
      if (p.z > 0) {
        current += (current ? 'L' : 'M') + p.x.toFixed(4) + ' ' + p.y.toFixed(4)
      } else {
        if (current) { out.push(current); current = '' }
      }
    }
    if (current) out.push(current)
    return out
  }

  const landD = useMemo(() => {
    if (!features.length) return ''
    const parts = []
    for (const rings of features) {
      for (const ring of rings) {
        if (ring.length < 4) continue
        parts.push(...ringToPaths(ring))
      }
    }
    return parts.join(' ')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features, lambda])

  const graticule = useMemo(() => {
    const parts = []
    for (let lon = -180; lon < 180; lon += 30) {
      const pts = []
      for (let lat = -80; lat <= 80; lat += 4) {
        const p = project(lon, lat)
        if (p.z > 0) pts.push(p)
        else if (pts.length) { parts.push(pts); pts.length = 0 }
      }
      if (pts.length) parts.push(pts)
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts = []
      for (let lon = -180; lon <= 180; lon += 4) {
        const p = project(lon, lat)
        if (p.z > 0) pts.push(p)
        else if (pts.length) { parts.push(pts); pts.length = 0 }
      }
      if (pts.length) parts.push(pts)
    }
    return parts.map(pts =>
      pts.map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(3) + ' ' + p.y.toFixed(3)).join('')
    ).join(' ')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lambda])

  return (
    <div ref={ref} style={{
      display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 0,
      border: `1px solid ${theme.rule}`,
      background: theme.panel,
    }}>
      <div style={{
        position: 'relative',
        borderRight: `1px solid ${theme.rule}`,
        minHeight: 560,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
      }}>
        <svg viewBox="-1.2 -1.2 2.4 2.4"
          style={{ width: '100%', height: '100%', maxHeight: 560, display: 'block' }}>
          <defs>
            <radialGradient id="globe-shade" cx="0.4" cy="0.35">
              <stop offset="0%" stopColor={theme.bg} stopOpacity="0"/>
              <stop offset="70%" stopColor={theme.bg} stopOpacity="0"/>
              <stop offset="100%" stopColor="#000" stopOpacity={theme.mode === 'dark' ? 0.5 : 0.18}/>
            </radialGradient>
          </defs>
          <circle cx="0" cy="0" r="1" fill={theme.landFill} opacity="0.4"/>

          <path d={graticule} fill="none" stroke={theme.landStroke}
            strokeWidth="0.003" strokeOpacity="0.35"/>

          <path d={landD} fill={theme.landFill} stroke={theme.landStroke}
            strokeWidth="0.004" strokeLinejoin="round" fillRule="evenodd"/>

          <circle cx="0" cy="0" r="1" fill="none"
            stroke={theme.fg} strokeOpacity="0.25" strokeWidth="0.006"/>

          <circle cx="0" cy="0" r="1" fill="url(#globe-shade)"/>

          {cases.map((c, i) => {
            const p = project(c.lon, c.lat)
            if (p.z <= 0.02) return null
            const isActive = i === activeIdx
            const horizonOpacity = Math.min(1, p.z * 4)
            return (
              <g key={c.id} opacity={horizonOpacity}>
                {isActive && (
                  <>
                    <circle cx={p.x} cy={p.y} r="0.015" fill={theme.accent} opacity="0.4">
                      <animate attributeName="r" values="0.015;0.06;0.015" dur="2s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <line x1={p.x} y1={p.y}
                      x2={p.x > 0 ? p.x + 0.22 : p.x - 0.22}
                      y2={p.y - 0.12}
                      stroke={theme.accent} strokeWidth="0.003"/>
                  </>
                )}
                <circle cx={p.x} cy={p.y}
                  r={isActive ? 0.014 : 0.008}
                  fill={isActive ? theme.accent : theme.fg}
                  stroke={theme.panel} strokeWidth="0.004"/>
                {isActive && (
                  <text
                    x={p.x > 0 ? p.x + 0.24 : p.x - 0.24}
                    y={p.y - 0.13}
                    textAnchor={p.x > 0 ? 'start' : 'end'}
                    fontFamily="JetBrains Mono, monospace"
                    fontSize="0.038"
                    fill={theme.fg}
                    letterSpacing="0.004">
                    {c.jurisdiction.toUpperCase()}
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        <div style={{
          position: 'absolute', top: 20, left: 24,
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
          letterSpacing: 2, color: theme.fgDim,
        }}>JURISDICTIONAL COVERAGE · {cases.length} CASES</div>
        <div style={{
          position: 'absolute', bottom: 20, left: 24,
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
          letterSpacing: 2, color: theme.fgDim, opacity: 0.7,
        }}>λ {lambda.toFixed(1)}° · φ {phi.toFixed(1)}° · ORTHOGRAPHIC</div>
      </div>

      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
          letterSpacing: 2, color: theme.fgDim,
        }}>CASE · {active.id}</div>
        <div style={{
          fontFamily: '"IBM Plex Serif", Georgia, serif',
          fontSize: 24, lineHeight: 1.15, color: theme.fg,
          letterSpacing: -0.2,
        }}>{active.jurisdiction}</div>
        <Rule theme={theme} style={{ margin: '4px 0' }}/>
        {[
          ['Type', active.type],
          ['Duration', active.duration],
          ['Outcome', active.outcome],
          ['Status', active.status],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
            <span style={{ color: theme.fgDim, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 1.5 }}>{k.toUpperCase()}</span>
            <span style={{ color: theme.fg, textAlign: 'right', fontWeight: 500 }}>{v}</span>
          </div>
        ))}
        <div style={{ flex: 1, minHeight: 24 }}/>
        <div style={{ display: 'flex', gap: 4 }}>
          {cases.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 2,
              background: i === activeIdx ? theme.accent : theme.rule,
              transition: 'background 0.3s',
            }}/>
          ))}
        </div>
      </div>
    </div>
  )
}
