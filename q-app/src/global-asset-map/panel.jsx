export function DetailPanel({ asset, theme, position, index, total }) {
  const pos = position || 'right'

  const containerStyle = {
    position: 'absolute',
    zIndex: 40,
    width: 360,
    maxWidth: 'calc(100vw - 32px)',
    fontFamily: 'JetBrains Mono, monospace',
    color: theme.fg,
    background: theme.panelBg,
    border: `1px solid ${theme.border}`,
    backdropFilter: 'blur(8px)',
    boxShadow: `0 0 0 1px ${theme.accent}15, 0 20px 60px rgba(0,0,0,0.5)`,
  }

  if (pos === 'right') Object.assign(containerStyle, { right: 24, top: 104, bottom: 40 })
  else if (pos === 'left') Object.assign(containerStyle, { left: 24, top: 104, bottom: 40 })
  else Object.assign(containerStyle, { right: 40, bottom: 40, maxHeight: 'calc(100vh - 140px)' })

  return (
    <div style={containerStyle}>
      <div style={{
        borderBottom: `1px solid ${theme.border}`,
        padding: '10px 14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 9, letterSpacing: 1.5,
        background: theme.headerBg,
      }}>
        <span style={{ color: theme.fgDim }}>DOSSIER // {asset.id}</span>
        <span style={{
          color: theme.accent,
          padding: '2px 6px',
          border: `1px solid ${theme.accent}`,
          fontSize: 8,
        }}>{asset.classification}</span>
      </div>

      <div style={{
        height: 160,
        background: `repeating-linear-gradient(45deg, ${theme.imgBg} 0 8px, ${theme.imgBg2} 8px 16px)`,
        borderBottom: `1px solid ${theme.border}`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <AssetGlyph type={asset.type} theme={theme}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(180deg, transparent 50%, ${theme.accent}08 50%)`,
          backgroundSize: '100% 3px',
          pointerEvents: 'none',
        }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(180deg, ${theme.accent}10, transparent 30%, transparent 70%, ${theme.accent}10)`,
          pointerEvents: 'none',
        }}/>
        {[[0,0,1,1],[1,0,-1,1],[0,1,1,-1],[1,1,-1,-1]].map(([cx,cy,dx,dy], i) => (
          <svg key={i} width="16" height="16" style={{
            position: 'absolute',
            left: cx ? 'auto' : 6, right: cx ? 6 : 'auto',
            top: cy ? 'auto' : 6, bottom: cy ? 6 : 'auto',
          }}>
            <polyline points={dx>0?`0,8 0,0 8,0`:`16,8 16,0 8,0`} fill="none" stroke={theme.accent} strokeWidth="1"
              transform={dy>0 ? '' : 'matrix(1,0,0,-1,0,16)'}/>
          </svg>
        ))}
        <div style={{
          position: 'absolute', top: 8, left: 24,
          fontSize: 9, color: theme.accent, letterSpacing: 1.5,
        }}>
          IMG.CAP · {asset.lastSeen.split(' ')[0]}
        </div>
      </div>

      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ fontSize: 9, color: theme.fgDim, letterSpacing: 1.5, marginBottom: 4 }}>
          {asset.type} · {asset.subtype}
        </div>
        <div style={{
          fontSize: 20, fontWeight: 600, letterSpacing: 0.5,
          color: theme.fg, marginBottom: 10,
          fontFamily: 'Inter, sans-serif',
        }}>
          {asset.codename}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <FieldBlock label="STATUS" theme={theme}>
            <span style={{
              color: asset.status === 'ACTIVE' ? theme.accent : theme.warn,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: asset.status === 'ACTIVE' ? theme.accent : theme.warn,
                animation: asset.status === 'ACTIVE' ? 'qnt-pulse 1.4s infinite' : 'none',
                boxShadow: `0 0 8px ${asset.status === 'ACTIVE' ? theme.accent : theme.warn}`,
              }}/>
              {asset.status}
            </span>
          </FieldBlock>
          <FieldBlock label="EST. VALUE" theme={theme}>
            <span style={{ color: theme.fg, fontWeight: 600 }}>{asset.value}</span>
          </FieldBlock>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <FieldBlock label="COORDS" theme={theme}>
            {asset.lat.toFixed(4)}°, {asset.lon.toFixed(4)}°
          </FieldBlock>
          <FieldBlock label="LOCATION" theme={theme}>
            {asset.city} · {asset.region}
          </FieldBlock>
        </div>

        <FieldBlock label="LAST SIGNAL" theme={theme} full>
          {asset.lastSeen}
        </FieldBlock>

        <div style={{
          marginTop: 14, paddingTop: 12,
          borderTop: `1px dashed ${theme.border}`,
          fontSize: 11, lineHeight: 1.6, color: theme.fgDim2,
          fontFamily: 'Inter, sans-serif',
        }}>
          {asset.description}
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 9, color: theme.fgDim, letterSpacing: 1.5, marginBottom: 6 }}>
            ◢ CORRELATED SIGNALS
          </div>
          {asset.signals.map((s, i) => (
            <div key={i} style={{
              fontSize: 10.5, color: theme.fg,
              padding: '3px 0',
              display: 'flex', gap: 8,
              borderBottom: i < asset.signals.length-1 ? `1px dotted ${theme.border}` : 'none',
            }}>
              <span style={{ color: theme.accent, minWidth: 20 }}>{String(i+1).padStart(2,'0')}</span>
              <span style={{ flex: 1 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        padding: '10px 14px',
        borderTop: `1px solid ${theme.border}`,
        fontSize: 9, letterSpacing: 1.5, color: theme.fgDim,
      }}>
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} · AUTO-CYCLE
      </div>
    </div>
  )
}

function FieldBlock({ label, children, theme, full }) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
      <div style={{ fontSize: 8, color: theme.fgDim, letterSpacing: 1.5, marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ fontSize: 11, color: theme.fg }}>{children}</div>
    </div>
  )
}

function AssetGlyph({ type, theme }) {
  const common = { stroke: theme.accent, fill: 'none', strokeWidth: 1.2 }
  return (
    <svg viewBox="0 0 100 60" style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      opacity: 0.85,
    }}>
      {type === 'PROPERTY' && (
        <g {...common}>
          <rect x="28" y="20" width="44" height="30"/>
          <rect x="34" y="26" width="6" height="6"/>
          <rect x="44" y="26" width="6" height="6"/>
          <rect x="54" y="26" width="6" height="6"/>
          <rect x="64" y="26" width="4" height="6"/>
          <rect x="34" y="36" width="6" height="6"/>
          <rect x="44" y="36" width="6" height="6"/>
          <rect x="54" y="36" width="6" height="6"/>
          <polygon points="24,20 76,20 66,12 34,12"/>
        </g>
      )}
      {type === 'BANK' && (
        <g {...common}>
          <polygon points="30,22 70,22 50,12"/>
          <line x1="26" y1="22" x2="74" y2="22"/>
          <line x1="34" y1="22" x2="34" y2="46"/>
          <line x1="44" y1="22" x2="44" y2="46"/>
          <line x1="56" y1="22" x2="56" y2="46"/>
          <line x1="66" y1="22" x2="66" y2="46"/>
          <line x1="26" y1="46" x2="74" y2="46"/>
          <line x1="24" y1="50" x2="76" y2="50"/>
        </g>
      )}
      {type === 'AIRCRAFT' && (
        <g {...common}>
          <path d="M 20 30 L 80 30 L 86 33 L 80 34 L 60 34 L 50 42 L 46 42 L 50 34 L 30 34 L 22 40 L 20 40 L 24 32 L 20 30 Z"/>
          <line x1="50" y1="30" x2="50" y2="22"/>
          <line x1="46" y1="22" x2="54" y2="22"/>
        </g>
      )}
      {type === 'BUSINESS' && (
        <g {...common}>
          <rect x="22" y="18" width="24" height="32"/>
          <rect x="50" y="12" width="28" height="38"/>
          <line x1="26" y1="24" x2="30" y2="24"/><line x1="34" y1="24" x2="38" y2="24"/>
          <line x1="26" y1="30" x2="30" y2="30"/><line x1="34" y1="30" x2="38" y2="30"/>
          <line x1="26" y1="36" x2="30" y2="36"/><line x1="34" y1="36" x2="38" y2="36"/>
          <line x1="54" y1="18" x2="58" y2="18"/><line x1="62" y1="18" x2="66" y2="18"/><line x1="70" y1="18" x2="74" y2="18"/>
          <line x1="54" y1="24" x2="58" y2="24"/><line x1="62" y1="24" x2="66" y2="24"/><line x1="70" y1="24" x2="74" y2="24"/>
          <line x1="54" y1="30" x2="58" y2="30"/><line x1="62" y1="30" x2="66" y2="30"/><line x1="70" y1="30" x2="74" y2="30"/>
          <line x1="54" y1="36" x2="58" y2="36"/><line x1="62" y1="36" x2="66" y2="36"/><line x1="70" y1="36" x2="74" y2="36"/>
        </g>
      )}
    </svg>
  )
}
