// Main App: themes, world map, cycling logic, tweaks panel

const THEMES = {
  cipher: {
    name: 'CIPHER',
    bg: '#070b0f',
    bg2: '#0a1015',
    fg: '#e5f7ef',
    fgDim: '#6b8578',
    fgDim2: '#a8bfb3',
    accent: '#00ff9f',
    warn: '#ffb347',
    border: 'rgba(0, 255, 159, 0.18)',
    panelBg: 'rgba(8, 14, 18, 0.85)',
    headerBg: 'rgba(0, 255, 159, 0.04)',
    landFill: 'rgba(0, 255, 159, 0.06)',
    grid: 'rgba(0, 255, 159, 0.04)',
    imgBg: 'rgba(0, 255, 159, 0.05)',
    imgBg2: 'rgba(0, 255, 159, 0.02)',
    glow: '0, 255, 159',
  },
  redline: {
    name: 'REDLINE',
    bg: '#0a0808',
    bg2: '#120a0a',
    fg: '#ffffff',
    fgDim: '#7a6060',
    fgDim2: '#c8b8b8',
    accent: '#ff2e3d',
    warn: '#ffa500',
    border: 'rgba(255, 46, 61, 0.22)',
    panelBg: 'rgba(14, 8, 10, 0.88)',
    headerBg: 'rgba(255, 46, 61, 0.05)',
    landFill: 'rgba(255, 255, 255, 0.04)',
    grid: 'rgba(255, 46, 61, 0.05)',
    imgBg: 'rgba(255, 46, 61, 0.05)',
    imgBg2: 'rgba(255, 255, 255, 0.02)',
    glow: '255, 46, 61',
  },
  sentinel: {
    name: 'SENTINEL',
    bg: '#070b14',
    bg2: '#0b1220',
    fg: '#e8f2ff',
    fgDim: '#5c7a9e',
    fgDim2: '#aabfd8',
    accent: '#5eead4',
    warn: '#fbbf24',
    border: 'rgba(94, 234, 212, 0.18)',
    panelBg: 'rgba(11, 18, 32, 0.88)',
    headerBg: 'rgba(94, 234, 212, 0.04)',
    landFill: 'rgba(94, 234, 212, 0.07)',
    grid: 'rgba(94, 234, 212, 0.04)',
    imgBg: 'rgba(94, 234, 212, 0.05)',
    imgBg2: 'rgba(94, 234, 212, 0.02)',
    glow: '94, 234, 212',
  },
};

// ─── TWEAKS: tweakable defaults persisted to file ─────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "colorScheme": "sentinel",
  "panelPosition": "floating",
  "cycleSeconds": 6,
  "showAmbient": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [editMode, setEditMode] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [mapVersion, setMapVersion] = useState(0);

  // Re-render when async world-110m finishes loading
  useEffect(() => {
    const onReady = () => setMapVersion(v => v + 1);
    window.addEventListener('mapready', onReady);
    return () => window.removeEventListener('mapready', onReady);
  }, []);

  // Tweaks host protocol
  useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') setEditMode(true);
      else if (e.data?.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const updateTweak = (key, value) => {
    setTweaks(t => ({ ...t, [key]: value }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: value } }, '*');
  };

  const theme = THEMES[tweaks.colorScheme] || THEMES.cipher;
  const assets = window.ASSETS;

  // Auto-cycle with progress bar
  useEffect(() => {
    const cycleMs = (tweaks.cycleSeconds || 6) * 1000;
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = (elapsed % cycleMs) / cycleMs;
      setProgress(p);
    }, 50);
    const advance = setInterval(() => {
      setActiveIdx(i => (i + 1) % assets.length);
    }, cycleMs);
    return () => { clearInterval(id); clearInterval(advance); };
  }, [tweaks.cycleSeconds, assets.length]);

  // Manual click = jump
  const handleMarkerClick = (i) => {
    setActiveIdx(i);
  };

  const activeAsset = assets[activeIdx];

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: theme.bg,
      overflow: 'hidden',
      position: 'relative',
      fontFamily: 'Inter, sans-serif',
      color: theme.fg,
    }}>
      <GlobalStyles theme={theme}/>
      <BackgroundGradient theme={theme}/>
      {tweaks.showAmbient && <ScanLines theme={theme}/>}
      <NavBar theme={theme}/>
      <MapView
        assets={assets}
        activeIdx={activeIdx}
        theme={theme}
        onMarkerClick={handleMarkerClick}
        showAmbient={tweaks.showAmbient}
      />
      <DetailPanel
        asset={activeAsset}
        theme={theme}
        position={tweaks.panelPosition}
        index={activeIdx}
        total={assets.length}
        progress={progress}
      />
      <Sidebar
        theme={theme}
        assets={assets}
        activeIdx={activeIdx}
        onSelect={handleMarkerClick}
      />
      <Watermark theme={theme}/>
      {editMode && <TweaksPanel tweaks={tweaks} onChange={updateTweak} theme={theme}/>}
    </div>
  );
}

// ─── Background gradient (radial vignette) ─────────────────────────────────
function BackgroundGradient({ theme }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `radial-gradient(ellipse at 50% 45%, ${theme.bg2} 0%, ${theme.bg} 70%)`,
      pointerEvents: 'none',
    }}/>
  );
}

// ─── Full-screen scan lines ───────────────────────────────────────────────
function ScanLines({ theme }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      pointerEvents: 'none',
      background: `repeating-linear-gradient(0deg, transparent 0 3px, rgba(${theme.glow}, 0.015) 3px 4px)`,
      mixBlendMode: 'screen',
    }}/>
  );
}

// ─── Map view (the heart) ─────────────────────────────────────────────────
function MapView({ assets, activeIdx, theme, onMarkerClick, showAmbient }) {
  const active = assets[activeIdx];
  const activePt = window.MAP.project(active.lon, active.lat);

  // Zoom/pan: center active point
  // Map viewbox is 1000 x 500; we animate a transform on an inner <g>.
  const ZOOM = 1.4;
  const cx = 500, cy = 250; // viewbox center
  const tx = cx - activePt.x * ZOOM;
  const ty = cy - activePt.y * ZOOM;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      paddingTop: 64, paddingBottom: 80,
    }}>
      <svg viewBox="0 0 1000 500" style={{
        width: '100%', height: '100%',
        maxWidth: '100%',
      }} preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="activeGlow">
            <stop offset="0%" stopColor={theme.accent} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={theme.accent} stopOpacity="0"/>
          </radialGradient>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke={theme.grid} strokeWidth="0.5"/>
          </pattern>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* grid background */}
        <rect x="0" y="0" width="1000" height="500" fill="url(#grid)"/>

        {/* equator + tropics */}
        <g stroke={theme.grid} strokeWidth="0.4" strokeDasharray="2 3" fill="none">
          <line x1="0" y1="250" x2="1000" y2="250"/> {/* equator */}
          <line x1="0" y1="185" x2="1000" y2="185"/> {/* tropic of cancer ~23.5N */}
          <line x1="0" y1="315" x2="1000" y2="315"/> {/* tropic of capricorn */}
          <line x1="500" y1="0" x2="500" y2="500"/> {/* prime meridian */}
        </g>

        {/* zoomed group */}
        <g transform={`translate(${tx} ${ty}) scale(${ZOOM})`} style={{ transition: 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>

          {/* Continent outlines (shaded fill + stroke) */}
          <g>
            {window.MAP_PATHS.map((d, i) => (
              <path key={i} d={d}
                fill={theme.landFill || `rgba(${theme.glow}, 0.08)`}
                stroke={theme.accent}
                strokeWidth="0.6"
                strokeOpacity="0.55"
                strokeLinejoin="round"
              />
            ))}
          </g>

          {/* Connection lines between active and others */}
          <g fill="none" stroke={theme.accent} strokeWidth="0.3" opacity="0.25" strokeDasharray="1 2">
            {assets.map((a, i) => {
              if (i === activeIdx) return null;
              const p = window.MAP.project(a.lon, a.lat);
              return (
                <line key={i} x1={activePt.x} y1={activePt.y} x2={p.x} y2={p.y}/>
              );
            })}
          </g>

          {/* Active glow */}
          <circle cx={activePt.x} cy={activePt.y} r="40" fill="url(#activeGlow)"/>

          {/* Markers */}
          {assets.map((a, i) => {
            const p = window.MAP.project(a.lon, a.lat);
            return (
              <Marker key={a.id}
                x={p.x} y={p.y}
                active={i === activeIdx}
                status={a.status}
                theme={theme}
                index={i}
                onClick={() => onMarkerClick(i)}
              />
            );
          })}

          {/* Reticle on active */}
          <Reticle cx={activePt.x} cy={activePt.y} theme={theme} size={18}/>

        </g>

        {/* Corner registration marks — stay fixed (outside zoom group) */}
        {[[20,84],[980,84],[20,480],[980,480]].map(([x,y], i) => (
          <g key={i} stroke={theme.accent} strokeWidth="0.5" fill="none" opacity="0.5">
            <line x1={x-6} y1={y} x2={x+6} y2={y}/>
            <line x1={x} y1={y-6} x2={x} y2={y+6}/>
            <circle cx={x} cy={y} r="2"/>
          </g>
        ))}

        {/* Viewport label */}
        <text x="24" y="96" fill={theme.fgDim} fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2">
          GEO.VIEW // EQUIRECTANGULAR // ZOOM {ZOOM.toFixed(1)}×
        </text>
        <text x="976" y="96" fill={theme.fgDim} fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="2" textAnchor="end">
          TRACKING {String(activeIdx + 1).padStart(2, '0')}/{String(assets.length).padStart(2, '0')}
        </text>
      </svg>
    </div>
  );
}

// ─── Left sidebar: list of assets ──────────────────────────────────────────
function Sidebar({ theme, assets, activeIdx, onSelect }) {
  return (
    <div style={{
      position: 'absolute', left: 24, top: 96, zIndex: 30,
      width: 260,
      background: theme.panelBg,
      border: `1px solid ${theme.border}`,
      fontFamily: 'JetBrains Mono, monospace',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        padding: '10px 14px',
        borderBottom: `1px solid ${theme.border}`,
        fontSize: 9, letterSpacing: 1.5, color: theme.fgDim,
        background: theme.headerBg,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>ASSET.INDEX</span>
        <span style={{ color: theme.accent }}>{assets.length} RECORDS</span>
      </div>
      <div>
        {assets.map((a, i) => {
          const active = i === activeIdx;
          return (
            <div key={a.id}
              onClick={() => onSelect(i)}
              style={{
                padding: '8px 14px',
                borderBottom: `1px solid ${theme.border}`,
                cursor: 'pointer',
                background: active ? `rgba(${theme.glow}, 0.08)` : 'transparent',
                borderLeft: `2px solid ${active ? theme.accent : 'transparent'}`,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 9, color: theme.fgDim, letterSpacing: 1 }}>
                  {a.id}
                </span>
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: a.status === 'ACTIVE' ? theme.accent : theme.warn,
                  boxShadow: a.status === 'ACTIVE' ? `0 0 6px ${theme.accent}` : 'none',
                }}/>
              </div>
              <div style={{ fontSize: 11, color: active ? theme.fg : theme.fgDim2, marginTop: 2, fontWeight: active ? 600 : 400 }}>
                {a.codename}
              </div>
              <div style={{ fontSize: 9, color: theme.fgDim, marginTop: 2, letterSpacing: 0.5 }}>
                {a.type} · {a.city}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Bottom ticker ────────────────────────────────────────────────────────
function BottomTicker({ theme, assets, activeIdx }) {
  const active = assets[activeIdx];
  const items = [
    `SIG.ACQ ${active.id} // ${active.codename}`,
    `COORD LOCK ${active.lat.toFixed(4)}, ${active.lon.toFixed(4)}`,
    `CLASS ${active.classification}`,
    `AUX.NODE.${Math.floor(Math.random()*900+100)} OK`,
    `THREAT.INDEX 0.${Math.floor(Math.random()*900+100)}`,
    `LINKED.ENTITIES 4`,
    `UPLINK ${active.lastSeen}`,
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
      height: 32, display: 'flex', alignItems: 'center',
      borderTop: `1px solid ${theme.border}`,
      background: theme.panelBg,
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 10, letterSpacing: 1, color: theme.fgDim,
      overflow: 'hidden',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        padding: '0 14px', height: '100%',
        display: 'flex', alignItems: 'center',
        background: theme.headerBg,
        borderRight: `1px solid ${theme.border}`,
        color: theme.accent, fontWeight: 600,
        letterSpacing: 1.5,
      }}>
        <span style={{
          width: 6, height: 6, background: theme.accent, borderRadius: '50%',
          marginRight: 8, animation: 'qnt-pulse 1.2s infinite',
          boxShadow: `0 0 6px ${theme.accent}`,
        }}/>
        FEED
      </div>
      <div style={{
        flex: 1, overflow: 'hidden', whiteSpace: 'nowrap',
        maskImage: 'linear-gradient(90deg, transparent, black 4%, black 96%, transparent)',
      }}>
        <div style={{
          display: 'inline-flex', gap: 36,
          animation: 'qnt-scroll 40s linear infinite',
          paddingLeft: '100%',
        }}>
          {[...items, ...items, ...items].map((t, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: theme.accent }}>◢</span>{t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Corner watermark ─────────────────────────────────────────────────────
function Watermark({ theme }) {
  return (
    <div style={{
      position: 'absolute', top: 80, right: 24, zIndex: 10,
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 8, letterSpacing: 2, color: theme.fgDim,
      textAlign: 'right', pointerEvents: 'none',
    }}>
      <div style={{ color: theme.accent, marginBottom: 2 }}>— Q.ASSET MAP v3.2 —</div>
      <div>BUILD 2026.04.19</div>
    </div>
  );
}

// ─── Tweaks panel ─────────────────────────────────────────────────────────
function TweaksPanel({ tweaks, onChange, theme }) {
  return (
    <div style={{
      position: 'absolute', bottom: 48, right: 24, zIndex: 200,
      width: 240,
      background: 'rgba(10, 10, 14, 0.95)',
      border: `1px solid ${theme.accent}`,
      boxShadow: `0 0 20px rgba(${theme.glow}, 0.3)`,
      fontFamily: 'JetBrains Mono, monospace',
      color: '#fff',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        padding: '10px 14px',
        borderBottom: `1px solid ${theme.accent}44`,
        fontSize: 10, letterSpacing: 2, color: theme.accent,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>◈ TWEAKS</span>
        <span style={{ fontSize: 8, color: '#888' }}>LIVE</span>
      </div>
      <div style={{ padding: '14px' }}>
        <TweakRow label="COLOR SCHEME">
          <div style={{ display: 'flex', gap: 6 }}>
            {Object.keys(THEMES).map(k => (
              <button key={k}
                onClick={() => onChange('colorScheme', k)}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  background: tweaks.colorScheme === k ? THEMES[k].accent : 'transparent',
                  color: tweaks.colorScheme === k ? '#000' : THEMES[k].accent,
                  border: `1px solid ${THEMES[k].accent}`,
                  fontSize: 9, letterSpacing: 1, cursor: 'pointer',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 600,
                }}
              >{THEMES[k].name}</button>
            ))}
          </div>
        </TweakRow>

        <TweakRow label="PANEL POSITION">
          <div style={{ display: 'flex', gap: 6 }}>
            {['left', 'right', 'floating'].map(p => (
              <button key={p}
                onClick={() => onChange('panelPosition', p)}
                style={{
                  flex: 1, padding: '6px 4px',
                  background: tweaks.panelPosition === p ? theme.accent : 'transparent',
                  color: tweaks.panelPosition === p ? '#000' : '#ccc',
                  border: `1px solid ${tweaks.panelPosition === p ? theme.accent : '#444'}`,
                  fontSize: 9, letterSpacing: 1, cursor: 'pointer',
                  fontFamily: 'JetBrains Mono, monospace',
                  textTransform: 'uppercase',
                }}
              >{p}</button>
            ))}
          </div>
        </TweakRow>

        <TweakRow label={`CYCLE SPEED (${tweaks.cycleSeconds}s)`}>
          <input type="range" min="2" max="15" step="1"
            value={tweaks.cycleSeconds}
            onChange={e => onChange('cycleSeconds', Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: theme.accent,
            }}
          />
        </TweakRow>

        <TweakRow label="AMBIENT EFFECTS">
          <button
            onClick={() => onChange('showAmbient', !tweaks.showAmbient)}
            style={{
              width: '100%', padding: '6px 4px',
              background: tweaks.showAmbient ? theme.accent : 'transparent',
              color: tweaks.showAmbient ? '#000' : '#ccc',
              border: `1px solid ${tweaks.showAmbient ? theme.accent : '#444'}`,
              fontSize: 9, letterSpacing: 1, cursor: 'pointer',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 600,
            }}
          >{tweaks.showAmbient ? 'ON' : 'OFF'}</button>
        </TweakRow>
      </div>
    </div>
  );
}

function TweakRow({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 8, letterSpacing: 1.5, color: '#888', marginBottom: 6 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

// ─── Global styles ────────────────────────────────────────────────────────
function GlobalStyles({ theme }) {
  return (
    <style>{`
      @keyframes qnt-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      @keyframes qnt-scroll {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      * { box-sizing: border-box; }
      body { margin: 0; background: ${theme.bg}; }
      button:focus { outline: none; }
    `}</style>
  );
}

Object.assign(window, { App, THEMES });
