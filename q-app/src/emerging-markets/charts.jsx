import { Fragment, useRef } from 'react'
import { useInView } from '../shared/ui'
import { EM_DATA } from './data'

export function HeroSparkline({ theme, dataset = 'fx' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.3 })
  const data = EM_DATA.chartSeries[dataset]
  const series = data.series
  const W = 1000, H = 340, padL = 56, padR = 40, padT = 28, padB = 44

  const allVals = series.flatMap(s => s.data)
  const minV = Math.min(...allVals), maxV = Math.max(...allVals)
  const span = maxV - minV || 1
  const n = series[0].data.length

  const xAt = (i) => padL + (i / (n - 1)) * (W - padL - padR)
  const yAt = (v) => padT + (1 - (v - minV) / span) * (H - padT - padB)

  const yTicks = 4
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => minV + (span * i) / yTicks)

  return (
    <div ref={ref} style={{
      border: `1px solid ${theme.rule}`,
      background: theme.panel,
      padding: '28px 32px 20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
            letterSpacing: 2, color: theme.fgDim,
          }}>{data.subtitle.toUpperCase()}</div>
          <div style={{
            fontFamily: '"IBM Plex Serif", Georgia, serif', fontSize: 22,
            color: theme.fg, letterSpacing: -0.2, marginTop: 4,
          }}>{data.name}</div>
        </div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          {series.map(s => (
            <div key={s.id} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
              letterSpacing: 1.5, color: theme.fgDim2,
            }}>
              <span style={{ width: 12, height: 2, background: s.color }}/>
              {s.label.toUpperCase()} · {s.id}
            </div>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 320, display: 'block' }}>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={yAt(t)} y2={yAt(t)}
              stroke={theme.rule} strokeWidth="1"/>
            <text x={padL - 8} y={yAt(t) + 4}
              textAnchor="end"
              fontFamily="JetBrains Mono, monospace" fontSize="10"
              fill={theme.fgDim}>{t.toFixed(0)}</text>
          </g>
        ))}
        {[0, 6, 12, 18, 24, 30, 35].map(i => {
          const labels = ['JAN 23','JUL 23','JAN 24','JUL 24','JAN 25','JUL 25','DEC 25']
          return (
            <text key={i}
              x={xAt(i)} y={H - padB + 20}
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace" fontSize="10"
              fill={theme.fgDim}>{labels[[0,6,12,18,24,30,35].indexOf(i)]}</text>
          )
        })}

        {series.map(s => {
          const d = s.data.map((v, i) => (i === 0 ? 'M' : 'L') + xAt(i).toFixed(2) + ' ' + yAt(v).toFixed(2)).join('')
          const len = 2400
          return (
            <g key={s.id}>
              <path d={d} fill="none" stroke={s.color} strokeWidth="1.8"
                strokeLinejoin="round" strokeLinecap="round"
                strokeDasharray={len}
                strokeDashoffset={inView ? 0 : len}
                style={{ transition: 'stroke-dashoffset 1.8s ease-out' }}/>
              <circle cx={xAt(n - 1)} cy={yAt(s.data[n - 1])} r="3.5"
                fill={s.color} opacity={inView ? 1 : 0}
                style={{ transition: 'opacity 0.6s 1.8s ease' }}/>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export function Heatmap({ theme }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.3 })
  const { labels, matrix } = EM_DATA.heatmap
  const N = labels.length
  const SIZE = 44

  const colorFor = (v) => {
    const a = Math.max(0, Math.min(1, v))
    return `color-mix(in srgb, ${theme.accent} ${Math.round(a * 100)}%, ${theme.panel})`
  }

  return (
    <div ref={ref} style={{
      border: `1px solid ${theme.rule}`,
      background: theme.panel,
      padding: '24px 28px 28px',
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
        letterSpacing: 2, color: theme.fgDim, marginBottom: 4,
      }}>CORRELATION · FX RETURNS · 90D</div>
      <div style={{
        fontFamily: '"IBM Plex Serif", Georgia, serif', fontSize: 17,
        color: theme.fg, letterSpacing: -0.1, marginBottom: 16,
      }}>Cross-currency correlation</div>

      <div style={{ display: 'inline-block' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `44px repeat(${N}, ${SIZE}px)`, gap: 2 }}>
          <div/>
          {labels.map(l => (
            <div key={l} style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
              letterSpacing: 1, color: theme.fgDim, textAlign: 'center',
              paddingBottom: 4,
            }}>{l}</div>
          ))}
          {matrix.map((row, i) => (
            <Fragment key={i}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
                letterSpacing: 1, color: theme.fgDim,
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                paddingRight: 6,
              }}>{labels[i]}</div>
              {row.map((v, j) => (
                <div key={j} style={{
                  width: SIZE, height: SIZE,
                  background: colorFor(v),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                  color: v > 0.55 ? theme.bg : theme.fg,
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'scale(1)' : 'scale(0.6)',
                  transition: `opacity 0.4s ${(i+j)*0.02}s ease, transform 0.4s ${(i+j)*0.02}s ease`,
                  border: i === j ? `1px solid ${theme.fg}` : 'none',
                }}>{v.toFixed(2).replace(/^0\./, '.').replace(/^-0\./, '-.')}</div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export function RankedBars({ theme }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.3 })
  const data = EM_DATA.rankedBars
  const max = Math.max(...data.rows.map(r => r.value))
  return (
    <div ref={ref} style={{
      border: `1px solid ${theme.rule}`,
      background: theme.panel,
      padding: '24px 28px 28px',
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
        letterSpacing: 2, color: theme.fgDim, marginBottom: 4,
      }}>{data.unit.toUpperCase()}</div>
      <div style={{
        fontFamily: '"IBM Plex Serif", Georgia, serif', fontSize: 17,
        color: theme.fg, letterSpacing: -0.1, marginBottom: 18,
      }}>{data.name}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.rows.map((r, i) => (
          <div key={r.label} style={{
            display: 'grid', gridTemplateColumns: '150px 1fr 50px',
            gap: 12, alignItems: 'center',
            fontFamily: 'Inter, sans-serif', fontSize: 12,
          }}>
            <div style={{ color: theme.fgDim2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.label}</div>
            <div style={{ height: 14, background: theme.rule, position: 'relative' }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: inView ? `${(r.value / max) * 100}%` : 0,
                background: i === 0 ? theme.accent : `color-mix(in srgb, ${theme.accent} ${Math.max(30, 100 - i * 10)}%, ${theme.panel})`,
                transition: `width 1s ${i * 0.06}s ease-out`,
              }}/>
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              color: theme.fg, textAlign: 'right',
            }}>{(r.value * 100).toFixed(0)}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}
