import { useEffect, useState } from 'react'

export function NavBar({ theme }) {
  return (
    <nav style={{
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
      height: 64, display: 'flex', alignItems: 'center',
      padding: '0 32px', justifyContent: 'space-between',
      background: 'transparent', color: theme.fg,
      borderBottom: `1px solid ${theme.border}`,
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          fontFamily: '"Barlow Condensed", "Oswald", sans-serif',
          fontWeight: 500, fontSize: 26, letterSpacing: 0.5,
          color: theme.fg, position: 'relative',
        }}>
          <span style={{ position: 'relative' }}>
            Q
            <span style={{
              position: 'absolute', top: -4, right: -2,
              width: 6, height: 6, background: theme.accent, borderRadius: '50%',
            }}/>
          </span>
          ntify
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500 }}>
        <a href="global-asset-map.html" style={{ color: theme.fg, textDecoration: 'none', borderBottom: `1px solid ${theme.accent}`, paddingBottom: 2 }}>Asset Mapping</a>
        <a href="alternative-assets.html" style={{ color: theme.fgDim, textDecoration: 'none' }}>Alternative Assets</a>
        <a href="whistleblower-claims.html" style={{ color: theme.fgDim, textDecoration: 'none' }}>Whistleblower</a>
        <a href="emerging-markets.html" style={{ color: theme.fgDim, textDecoration: 'none' }}>Emerging Markets</a>
        <a href="#" style={{ color: theme.fgDim, textDecoration: 'none' }}>Request Demo</a>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: theme.fgDim, letterSpacing: 1 }}>
        <LiveClock />
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, background: theme.accent, borderRadius: '50%', animation: 'qnt-pulse 2s infinite' }}/>
          LIVE
        </span>
      </div>
    </nav>
  )
}

export function LiveClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const fmt = now.toISOString().replace('T', ' ').split('.')[0] + ' UTC'
  return <span>{fmt}</span>
}

export function Reticle({ cx, cy, theme, size = 80 }) {
  const half = size / 2
  const tick = 8
  const gap = 4
  return (
    <g style={{ pointerEvents: 'none' }}>
      <g transform={`translate(${cx} ${cy})`}>
        <circle r={half} fill="none" stroke={theme.accent} strokeWidth="0.6" opacity="0.7"
          strokeDasharray="2 4">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="8s" repeatCount="indefinite"/>
        </circle>
      </g>
      {[[-1,-1],[1,-1],[-1,1],[1,1]].map(([sx,sy],i) => {
        const x = cx + sx*half, y = cy + sy*half
        return (
          <g key={i} stroke={theme.accent} strokeWidth="1.2" fill="none">
            <line x1={x} y1={y} x2={x - sx*tick} y2={y} />
            <line x1={x} y1={y} x2={x} y2={y - sy*tick} />
          </g>
        )
      })}
      <line x1={cx - half - 6} y1={cy} x2={cx - gap} y2={cy} stroke={theme.accent} strokeWidth="0.6" opacity="0.6"/>
      <line x1={cx + gap} y1={cy} x2={cx + half + 6} y2={cy} stroke={theme.accent} strokeWidth="0.6" opacity="0.6"/>
      <line x1={cx} y1={cy - half - 6} x2={cx} y2={cy - gap} stroke={theme.accent} strokeWidth="0.6" opacity="0.6"/>
      <line x1={cx} y1={cy + gap} x2={cx} y2={cy + half + 6} stroke={theme.accent} strokeWidth="0.6" opacity="0.6"/>
      <circle cx={cx} cy={cy} r="1.2" fill={theme.accent}/>
    </g>
  )
}

export function Marker({ x, y, active, status, theme, onClick, index }) {
  const color = status === 'ACTIVE' ? theme.accent : theme.warn
  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      {active && (
        <circle cx={x} cy={y} r="3" fill={color} opacity="0.3">
          <animate attributeName="r" values="3;12;3" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite"/>
        </circle>
      )}
      <circle cx={x} cy={y} r={active ? 2.2 : 1.6} fill={color} stroke={theme.bg} strokeWidth="0.3"/>
      {active && (
        <text x={x + 4} y={y - 3} fontSize="3.5" fontFamily="JetBrains Mono, monospace"
          fill={theme.accent} style={{ textShadow: `0 0 4px ${theme.accent}` }}>
          {String(index + 1).padStart(2, '0')}
        </text>
      )}
    </g>
  )
}
