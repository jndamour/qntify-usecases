import { useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from '../shared/ui'
import { EM_DATA } from './data'

export function SupplyChainNetwork({ theme, focusFlag = null }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.2 })
  const { stages, nodes, edges } = EM_DATA.supplyChain

  const [t, setT] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf
    let last = performance.now()
    const tick = (now) => {
      const dt = (now - last) / 1000
      last = now
      setT(x => x + dt)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView])

  const nodeById = useMemo(() => {
    const m = {}
    const stageX = Object.fromEntries(stages.map(s => [s.id, s.x]))
    for (const n of nodes) m[n.id] = { ...n, x: stageX[n.stage], y: n.y }
    return m
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const flaggedNodes = nodes.filter(n => n.flag)
  const activeFlag = focusFlag && flaggedNodes.find(n => n.flag === focusFlag)

  return (
    <div ref={ref} style={{
      display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 0,
      border: `1px solid ${theme.rule}`,
      background: theme.panel,
    }}>
      <div style={{
        position: 'relative', padding: '40px 40px 48px',
        borderRight: `1px solid ${theme.rule}`,
        minHeight: 560,
      }}>
        <div style={{ position: 'absolute', left: 40, right: 40, top: 16,
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
          letterSpacing: 2, color: theme.fgDim, pointerEvents: 'none' }}>
          {stages.map(s => (
            <div key={s.id} style={{ width: '25%', textAlign: 'center' }}>{s.label}</div>
          ))}
        </div>

        <div style={{ position: 'absolute', inset: '40px 40px 48px' }}>
          <svg viewBox="0 0 1 1" preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            {edges.map(([a, b], i) => {
              const na = nodeById[a], nb = nodeById[b]
              if (!na || !nb) return null
              const flagged = na.flag || nb.flag
              return (
                <path key={i}
                  d={`M ${na.x} ${na.y} C ${(na.x + nb.x) / 2} ${na.y}, ${(na.x + nb.x) / 2} ${nb.y}, ${nb.x} ${nb.y}`}
                  fill="none"
                  stroke={flagged ? theme.accent : theme.edge}
                  strokeOpacity={flagged ? 0.55 : 0.3}
                  strokeWidth="0.0015"/>
              )
            })}

            {edges.map(([a, b], i) => {
              const na = nodeById[a], nb = nodeById[b]
              if (!na || !nb) return null
              const period = 3.5
              const phase = ((t + i * 0.37) % period) / period
              const mx1 = (na.x + nb.x) / 2, mx2 = (na.x + nb.x) / 2
              const u = phase, iu = 1 - u
              const x = iu*iu*iu*na.x + 3*iu*iu*u*mx1 + 3*iu*u*u*mx2 + u*u*u*nb.x
              const y = iu*iu*iu*na.y + 3*iu*iu*u*na.y + 3*iu*u*u*nb.y + u*u*u*nb.y
              const flagged = na.flag || nb.flag
              const opacity = Math.sin(phase * Math.PI) * (flagged ? 1 : 0.7)
              return (
                <circle key={'p' + i} cx={x} cy={y}
                  r={flagged ? 0.006 : 0.004}
                  fill={flagged ? theme.accent : theme.fg}
                  opacity={opacity}/>
              )
            })}

            {nodes.map(n => {
              const pos = nodeById[n.id]
              const r = n.flag ? 0.014 : 0.010
              const fill = n.flag ? theme.accent : theme.fg
              const ringActive = activeFlag && activeFlag.id === n.id
              return (
                <g key={n.id}>
                  {n.flag && (
                    <circle cx={pos.x} cy={pos.y} r={r * 2} fill={theme.accent} opacity="0.25">
                      <animate attributeName="r" values={`${r * 1.4};${r * 3};${r * 1.4}`} dur="2.4s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.35;0;0.35" dur="2.4s" repeatCount="indefinite"/>
                    </circle>
                  )}
                  {ringActive && (
                    <circle cx={pos.x} cy={pos.y} r={r * 4}
                      fill="none" stroke={theme.accent} strokeWidth="0.002"/>
                  )}
                  <circle cx={pos.x} cy={pos.y} r={r}
                    fill={fill}
                    stroke={theme.panel} strokeWidth="0.003"/>
                </g>
              )
            })}
          </svg>

          {nodes.map(n => {
            const pos = nodeById[n.id]
            return (
              <div key={'label-' + n.id} style={{
                position: 'absolute',
                left: `${pos.x * 100}%`,
                top: `${pos.y * 100}%`,
                transform: 'translate(14px, -50%)',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}>
                <div style={{
                  fontFamily: 'Inter, sans-serif', fontSize: 11,
                  color: theme.fg, lineHeight: 1.25, fontWeight: 500,
                }}>{n.label}</div>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
                  color: theme.fgDim, letterSpacing: 0.5, marginTop: 2,
                }}>{n.sub}</div>
              </div>
            )
          })}
        </div>

        <div style={{
          position: 'absolute', bottom: 14, left: 40,
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
          letterSpacing: 1.5, color: theme.fgDim, opacity: 0.7,
        }}>CRITICAL MINERALS · {nodes.length} ENTITIES · {flaggedNodes.length} FLAGGED</div>
      </div>

      <div style={{ padding: '28px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
          letterSpacing: 2, color: theme.fgDim,
        }}>FLAGGED NODES</div>
        {flaggedNodes.map(n => (
          <div key={n.id} style={{
            paddingBottom: 14, borderBottom: `1px solid ${theme.rule}`,
            opacity: !focusFlag || focusFlag === n.flag ? 1 : 0.4,
            transition: 'opacity 0.3s',
          }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
              letterSpacing: 1.5, color: theme.accent, marginBottom: 6,
            }}>◆ {n.flag.toUpperCase()}</div>
            <div style={{
              fontFamily: '"IBM Plex Serif", Georgia, serif', fontSize: 15,
              color: theme.fg, lineHeight: 1.2, marginBottom: 6,
            }}>{n.label}</div>
            <div style={{
              fontFamily: 'Inter, sans-serif', fontSize: 12,
              lineHeight: 1.5, color: theme.fgDim2,
            }}>{n.flagDetail}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
