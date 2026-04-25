// Typology grid + Programs + Confidentiality section for Whistleblower page

function TypologyGrid({ theme }) {
  const rows = window.WB_DATA.typologies;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 1,
      background: theme.rule,
      border: `1px solid ${theme.rule}`,
    }}>
      {rows.map((r) => (
        <div key={r.n} style={{
          background: theme.panel,
          padding: '24px 22px 28px',
          minHeight: 180,
          display: 'flex', flexDirection: 'column',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = theme.bg}
        onMouseLeave={e => e.currentTarget.style.background = theme.panel}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10, letterSpacing: 2,
            color: theme.accent, marginBottom: 14,
          }}>{r.n}</div>
          <div style={{
            fontFamily: '"IBM Plex Serif", Georgia, serif',
            fontSize: 18, lineHeight: 1.15,
            color: theme.fg, marginBottom: 10,
            letterSpacing: -0.2,
          }}>{r.name}</div>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: 12,
            lineHeight: 1.5, color: theme.fgDim2,
          }}>{r.body}</div>
        </div>
      ))}
    </div>
  );
}

function ProgramsTable({ theme }) {
  const programs = window.WB_DATA.programs;
  return (
    <div style={{ border: `1px solid ${theme.rule}`, background: theme.panel }}>
      {programs.map((p, i) => (
        <div key={p.abbr} style={{
          display: 'grid',
          gridTemplateColumns: '100px 1.2fr 2fr 0.9fr',
          gap: 32,
          padding: '28px 32px',
          borderTop: i === 0 ? 'none' : `1px solid ${theme.rule}`,
          alignItems: 'baseline',
        }}>
          <div style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontWeight: 500, fontSize: 36,
            color: theme.accent, letterSpacing: 0.5,
            lineHeight: 0.9,
          }}>{p.abbr}</div>
          <div>
            <div style={{
              fontFamily: '"IBM Plex Serif", Georgia, serif',
              fontSize: 17, color: theme.fg, marginBottom: 4,
              letterSpacing: -0.1,
            }}>{p.name}</div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10, letterSpacing: 1.5,
              color: theme.fgDim,
            }}>{p.statute}</div>
          </div>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: 13,
            lineHeight: 1.55, color: theme.fgDim2,
          }}>
            {p.scope}
            <div style={{
              fontSize: 11, color: theme.fgDim,
              marginTop: 8, fontStyle: 'italic',
            }}>{p.note}</div>
          </div>
          <div style={{
            fontFamily: '"IBM Plex Serif", Georgia, serif',
            fontSize: 14, color: theme.fg,
            textAlign: 'right',
            lineHeight: 1.3,
          }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 9, letterSpacing: 1.5,
              color: theme.fgDim, marginBottom: 4,
            }}>AWARD</div>
            {p.award}
          </div>
        </div>
      ))}
    </div>
  );
}

function ConfidentialityBlock({ theme }) {
  const items = [
    { n: '01', label: 'Source anonymity', body: 'Attorney-client and work-product privilege preserved throughout intake, triage, and filing.' },
    { n: '02', label: 'Compartmented handling', body: 'Case matter siloed from adjacent engagements. Access-on-need; no cross-matter reuse.' },
    { n: '03', label: 'Anti-retaliation posture', body: 'Filings routed through counsel; direct disclosure to enforcement agency under statutory protections.' },
    { n: '04', label: 'Communications discipline', body: 'Encrypted channels end-to-end. No unencrypted artifacts. Hold-and-destroy protocols on close.' },
  ];
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 0,
      border: `1px solid ${theme.rule}`,
    }}>
      {items.map((it, i) => (
        <div key={it.n} style={{
          padding: '32px 36px',
          borderRight: (i % 2 === 0) ? `1px solid ${theme.rule}` : 'none',
          borderTop: i >= 2 ? `1px solid ${theme.rule}` : 'none',
          background: theme.panel,
          minHeight: 160,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'baseline', marginBottom: 14,
          }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10, letterSpacing: 2,
              color: theme.fgDim,
            }}>{it.n}</span>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 9, letterSpacing: 1.5,
              color: theme.accent,
            }}>◆ ENFORCED</span>
          </div>
          <div style={{
            fontFamily: '"IBM Plex Serif", Georgia, serif',
            fontSize: 22, lineHeight: 1.15,
            color: theme.fg, marginBottom: 10,
            letterSpacing: -0.2,
          }}>{it.label}</div>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: 13,
            lineHeight: 1.55, color: theme.fgDim2,
          }}>{it.body}</div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { TypologyGrid, ProgramsTable, ConfidentialityBlock });
