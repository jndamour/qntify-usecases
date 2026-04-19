// EM: datasets grid, case vignette, coverage list
const { useState, useEffect, useRef } = React;

function DatasetsGrid({ theme }) {
  const rows = window.EM_DATA.datasets;
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1, background: theme.rule, border: `1px solid ${theme.rule}`,
    }}>
      {rows.map(r => (
        <div key={r.n} style={{
          background: theme.panel, padding: '26px 24px 30px', minHeight: 180,
        }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
            letterSpacing: 2, color: theme.accent, marginBottom: 12,
          }}>{r.n}</div>
          <div style={{
            fontFamily: '"IBM Plex Serif", Georgia, serif', fontSize: 19,
            lineHeight: 1.15, color: theme.fg, marginBottom: 10, letterSpacing: -0.2,
          }}>{r.name}</div>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: 12,
            lineHeight: 1.55, color: theme.fgDim2,
          }}>{r.body}</div>
        </div>
      ))}
    </div>
  );
}

function Vignette({ theme }) {
  const v = window.EM_DATA.vignette;
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: 0,
      border: `1px solid ${theme.rule}`, background: theme.panel,
    }}>
      <div style={{
        padding: '32px 36px', borderRight: `1px solid ${theme.rule}`,
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
          letterSpacing: 2, color: theme.fgDim, marginBottom: 12,
        }}>CASE · {v.id}</div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
          letterSpacing: 1.5, color: theme.accent, marginBottom: 20,
        }}>◆ {v.region.toUpperCase()}</div>
        <div style={{
          fontFamily: '"IBM Plex Serif", Georgia, serif', fontSize: 22,
          lineHeight: 1.2, color: theme.fg, marginBottom: 18, letterSpacing: -0.2,
        }}>{v.subject}</div>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: 13,
          lineHeight: 1.6, color: theme.fgDim2,
        }}>{v.body}</div>
        <div style={{
          marginTop: 22, paddingTop: 16,
          borderTop: `1px solid ${theme.rule}`,
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
          letterSpacing: 1.5, color: theme.fgDim,
        }}>OUTCOME</div>
        <div style={{
          fontFamily: '"IBM Plex Serif", Georgia, serif', fontSize: 14,
          lineHeight: 1.4, color: theme.fg, marginTop: 4,
        }}>{v.outcome}</div>
      </div>
      <div style={{ padding: '32px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {v.stages.map((s, i) => (
          <div key={s.label}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
              letterSpacing: 2, color: theme.fgDim, marginBottom: 8,
            }}>0{i + 1} · STAGE</div>
            <div style={{
              fontFamily: '"IBM Plex Serif", Georgia, serif', fontSize: 20,
              color: theme.fg, marginBottom: 8, letterSpacing: -0.1,
            }}>{s.label}</div>
            <div style={{
              fontFamily: 'Inter, sans-serif', fontSize: 12,
              lineHeight: 1.5, color: theme.fgDim2,
            }}>{s.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoverageList({ theme }) {
  const data = window.EM_DATA.coverage;
  const regions = [...new Set(data.map(c => c.region))];
  const depthColor = (d) => d === 'deep' ? theme.accent : d === 'selective' ? theme.fg : theme.fgDim;
  const depthFill  = (d) => d === 'deep' ? 1 : d === 'selective' ? 0.5 : 0.25;
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: `repeat(${regions.length}, 1fr)`, gap: 1,
      background: theme.rule, border: `1px solid ${theme.rule}`,
    }}>
      {regions.map(region => {
        const countries = data.filter(c => c.region === region);
        return (
          <div key={region} style={{ background: theme.panel, padding: '24px 26px 28px' }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
              letterSpacing: 2, color: theme.fgDim, marginBottom: 16,
            }}>{region.toUpperCase()}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {countries.map(c => (
                <div key={c.country} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontFamily: 'Inter, sans-serif', fontSize: 13,
                }}>
                  <span style={{ color: theme.fg }}>{c.country}</span>
                  <span style={{ display: 'flex', gap: 4 }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: i < (c.depth === 'deep' ? 3 : c.depth === 'selective' ? 2 : 1)
                          ? depthColor(c.depth) : theme.rule,
                        opacity: i < (c.depth === 'deep' ? 3 : c.depth === 'selective' ? 2 : 1) ? depthFill(c.depth) : 1,
                      }}/>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div style={{
        gridColumn: `1 / span ${regions.length}`,
        background: theme.bg, padding: '14px 26px',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
        letterSpacing: 1.5, color: theme.fgDim,
        display: 'flex', gap: 28, flexWrap: 'wrap',
      }}>
        <span>● ● ● DEEP — primary sources, fieldwork</span>
        <span>● ● SELECTIVE — select sectors</span>
        <span>● TARGETED — project-specific</span>
      </div>
    </div>
  );
}

Object.assign(window, { DatasetsGrid, Vignette, CoverageList });
