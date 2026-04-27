import { useEffect, useRef, useState } from 'react'
import { useInView } from '../shared/ui'
import { WB_DATA } from './data'

export function NewsPastiche({ theme, variant = 'standard' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.15 })
  const clippings = WB_DATA.clippings

  const [pulse, setPulse] = useState(-1)

  useEffect(() => {
    if (!inView) return
    const total = clippings.length + 2
    let i = 0
    setPulse(0)
    const id = setInterval(() => {
      i = (i + 1) % total
      setPulse(i)
    }, 1400)
    return () => clearInterval(id)
  }, [inView, clippings.length])

  const connectorActive = pulse >= clippings.length
  const calloutActive = pulse === clippings.length + 1

  const CX = 0.5, CY = 0.5

  return (
    <div ref={ref} style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '16 / 11',
      background: theme.paper,
      border: `1px solid ${theme.rule}`,
      overflow: 'hidden',
      boxShadow: theme.mode === 'light'
        ? 'inset 0 0 80px rgba(60, 50, 30, 0.05)'
        : 'inset 0 0 80px rgba(0, 0, 0, 0.3)',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: theme.mode === 'light'
          ? 'radial-gradient(circle at 25% 20%, rgba(140,120,80,0.06) 0, transparent 40%), radial-gradient(circle at 80% 75%, rgba(100,90,60,0.05) 0, transparent 50%)'
          : 'radial-gradient(circle at 25% 20%, rgba(120,140,180,0.05) 0, transparent 40%)',
        pointerEvents: 'none',
      }}/>

      <svg viewBox="0 0 1 1" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {clippings.map((c, i) => {
          const sx = c.x + c.w / 2 / 1400
          const sy = c.y + 0.12
          const active = connectorActive
          const delay = i * 0.15
          return (
            <path key={c.id}
              d={`M ${sx} ${sy} Q ${(sx + CX) / 2} ${sy}, ${CX} ${CY}`}
              fill="none"
              stroke={theme.accent}
              strokeWidth="0.0015"
              strokeDasharray="1"
              strokeDashoffset={active ? 0 : 1}
              style={{
                transition: `stroke-dashoffset 0.9s ${delay}s ease-out, opacity 0.4s ease`,
                opacity: active ? 0.7 : 0,
              }}/>
          )
        })}
      </svg>

      {clippings.map((c, i) => (
        <Clipping key={c.id} clipping={c} theme={theme}
          active={pulse === i} inView={inView} index={i}/>
      ))}

      <div style={{
        position: 'absolute',
        left: `${CX * 100}%`, top: `${CY * 100}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
        transition: 'transform 0.6s ease, box-shadow 0.6s ease',
        boxShadow: calloutActive
          ? `0 0 0 6px ${theme.accent}20, 0 8px 32px rgba(0,0,0,0.18)`
          : `0 4px 20px rgba(0,0,0,0.1)`,
      }}>
        <CaseCallout variant={variant} theme={theme} active={calloutActive}/>
      </div>

      <div style={{
        position: 'absolute', top: 16, left: 16,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
        letterSpacing: 2, color: theme.fgDim,
      }}>PATTERN DETECTED</div>
      <div style={{
        position: 'absolute', bottom: 16, right: 20,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
        letterSpacing: 1.5, color: theme.fgDim, opacity: 0.6,
      }}>{clippings.length} SIGNALS · 1 ENTITY</div>
    </div>
  )
}

function Clipping({ clipping: c, theme, active, inView, index }) {
  const [driftRot, setDriftRot] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf
    const start = performance.now() + index * 800
    const tick = (t) => {
      const elapsed = (t - start) / 1000
      setDriftRot(Math.sin(elapsed * 0.4 + index) * 0.4)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, index])

  const body = c.body
  const segments = []
  let cursor = 0
  const ranges = [...c.highlights].sort((a, b) => a.start - b.start)
  for (const r of ranges) {
    if (r.start > cursor) segments.push({ text: body.slice(cursor, r.start), hl: false })
    segments.push({ text: body.slice(r.start, r.end), hl: true })
    cursor = r.end
  }
  if (cursor < body.length) segments.push({ text: body.slice(cursor), hl: false })

  return (
    <div style={{
      position: 'absolute',
      left: `${c.x * 100}%`,
      top: `${c.y * 100}%`,
      width: c.w,
      transform: `rotate(${c.rot + driftRot}deg)`,
      transformOrigin: 'center',
      background: theme.clipBg,
      padding: '14px 16px 16px',
      boxShadow: active
        ? `0 0 0 2px ${theme.accent}, 0 12px 28px rgba(0,0,0,0.18)`
        : `0 2px 12px rgba(0,0,0,${theme.mode === 'dark' ? 0.3 : 0.08}), 0 1px 3px rgba(0,0,0,0.08)`,
      transition: 'box-shadow 0.6s ease, transform 0.6s ease',
      zIndex: active ? 15 : 5,
      border: `1px solid ${theme.rule}`,
    }}>
      <div style={{
        position: 'absolute', top: -10, left: 30,
        width: 54, height: 18,
        background: theme.tape,
        opacity: 0.75,
        transform: `rotate(${-c.rot - 4}deg)`,
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      }}/>

      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9, letterSpacing: 2,
        color: theme.fgDim,
        paddingBottom: 6,
        borderBottom: `1px solid ${theme.rule}`,
        marginBottom: 10,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>{c.kicker}</span>
        <span style={{ color: active ? theme.accent : theme.fgDim2, fontWeight: 500 }}>{c.tag}</span>
      </div>
      <div style={{
        fontFamily: '"IBM Plex Serif", Georgia, serif',
        fontSize: 15, lineHeight: 1.18,
        color: theme.fg,
        marginBottom: 8,
        fontWeight: 500,
      }}>{c.headline}</div>
      <div style={{
        fontFamily: '"IBM Plex Serif", Georgia, serif',
        fontSize: 12, lineHeight: 1.45,
        color: theme.fgDim2,
        columnCount: c.w > 330 ? 2 : 1,
        columnGap: 14,
      }}>
        {segments.map((s, i) => s.hl ? (
          <span key={i} style={{
            background: active
              ? `linear-gradient(180deg, transparent 50%, ${theme.accent}99 50%)`
              : `linear-gradient(180deg, transparent 50%, ${theme.highlight} 50%)`,
            padding: '0 1px',
            transition: 'background 0.6s ease',
          }}>{s.text}</span>
        ) : (
          <span key={i}>{s.text}</span>
        ))}
      </div>
    </div>
  )
}

function CaseCallout({ variant, theme, active }) {
  const data = WB_DATA.caseCallouts[variant] || WB_DATA.caseCallouts.standard

  if (variant === 'narrative') {
    return (
      <div style={{
        width: 300,
        background: theme.panel,
        border: `1.5px solid ${active ? theme.accent : theme.fg}`,
        padding: '20px 22px',
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
          letterSpacing: 2, color: theme.accent, marginBottom: 10,
        }}>◆ CASE OPENED · {data.id}</div>
        <div style={{
          fontFamily: '"IBM Plex Serif", Georgia, serif',
          fontSize: 17, lineHeight: 1.2, color: theme.fg,
          marginBottom: 8, fontStyle: 'italic',
        }}>{data.headline}</div>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: 12,
          lineHeight: 1.5, color: theme.fgDim2,
        }}>{data.body}</div>
      </div>
    )
  }

  if (variant === 'dossier') {
    return (
      <div style={{
        width: 280,
        background: theme.panel,
        border: `1.5px solid ${active ? theme.accent : theme.fg}`,
      }}>
        <div style={{
          background: theme.fg, color: theme.bg,
          padding: '8px 14px',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
          letterSpacing: 2,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <span>DOSSIER · {data.id}</span>
          <span style={{ opacity: 0.7 }}>CONFIDENTIAL</span>
        </div>
        <div style={{ padding: '16px 18px' }}>
          <div style={{
            fontFamily: '"IBM Plex Serif", Georgia, serif',
            fontSize: 14, lineHeight: 1.3, color: theme.fg,
            marginBottom: 12,
            letterSpacing: 1,
          }}>{data.subject}</div>
          <CalloutRow k="Program" v={data.program} theme={theme}/>
          <CalloutRow k="Statute" v={data.statute} theme={theme}/>
          <CalloutRow k="Award (proj.)" v={data.projectedAward} theme={theme} emphasis/>
          <CalloutRow k="Stage" v={data.stage} theme={theme}/>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      width: 300,
      background: theme.panel,
      border: `1.5px solid ${active ? theme.accent : theme.fg}`,
    }}>
      <div style={{
        padding: '10px 16px 8px',
        borderBottom: `1px solid ${theme.rule}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      }}>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
          letterSpacing: 2, color: theme.accent,
        }}>◆ CASE INITIATED</span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
          letterSpacing: 1.5, color: theme.fg, fontWeight: 500,
        }}>{data.id}</span>
      </div>
      <div style={{ padding: '14px 18px 16px' }}>
        <CalloutRow k="Program" v={data.program} theme={theme}/>
        <CalloutRow k="Statute" v={data.statute} theme={theme}/>
        <CalloutRow k="Sanction range" v={data.sanctionRange} theme={theme} emphasis/>
        <div style={{
          marginTop: 10, paddingTop: 10,
          borderTop: `1px solid ${theme.rule}`,
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
          letterSpacing: 1.5, color: theme.fgDim,
        }}>JURISDICTIONS</div>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: 12,
          color: theme.fg, marginTop: 4,
        }}>{data.jurisdictions.join(' · ')}</div>
      </div>
    </div>
  )
}

function CalloutRow({ k, v, theme, emphasis }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '4px 0', gap: 12,
    }}>
      <span style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
        letterSpacing: 1.5, color: theme.fgDim,
        whiteSpace: 'nowrap',
      }}>{k.toUpperCase()}</span>
      <span style={{
        fontFamily: emphasis ? '"IBM Plex Serif", Georgia, serif' : 'Inter, sans-serif',
        fontSize: emphasis ? 15 : 12,
        color: emphasis ? theme.accent : theme.fg,
        fontWeight: emphasis ? 500 : 400,
        textAlign: 'right',
      }}>{v}</span>
    </div>
  )
}
