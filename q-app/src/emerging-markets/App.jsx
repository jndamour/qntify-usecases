import { useEffect, useState } from 'react'
import { Eyebrow, Display, Rule, RevealText } from '../shared/ui'
import { SiteNav } from '../shared/SiteNav'
import { SiteFooter } from '../shared/SiteFooter'
import NexusGraph from '../nexus-graph/NexusGraph'
import { EM_DATA } from './data'
import { HeroSparkline, Heatmap, RankedBars } from './charts'
import { SupplyChainNetwork } from './network'
import { DatasetsGrid, CoverageList } from './sections'

const EM_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "light",
  "accent": "sage",
  "heroDataset": "fx",
  "networkFocus": "none"
}/*EDITMODE-END*/

const EM_THEMES = {
  light: {
    bg: '#f7f5f0', panel: '#fbfaf6',
    fg: '#1a1d24', fgDim: '#7a7366', fgDim2: '#4a4a44',
    rule: 'rgba(20, 20, 30, 0.12)',
    edge: 'rgba(20, 30, 46, 0.4)',
  },
  dark: {
    bg: '#0e1117', panel: '#141921',
    fg: '#eef0f4', fgDim: '#7a8394', fgDim2: '#b8bfcc',
    rule: 'rgba(255, 255, 255, 0.1)',
    edge: 'rgba(200, 220, 240, 0.35)',
  },
}

const EM_ACCENTS = {
  indigo: '#4a5c9c',
  copper: '#b5773a',
  sage:   '#4a7a6c',
  navy:   '#0f1a2e',
}

export default function EmApp() {
  const [tweaks, setTweaks] = useState(EM_TWEAK_DEFAULTS)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') setEditMode(true)
      else if (e.data?.type === '__deactivate_edit_mode') setEditMode(false)
    }
    window.addEventListener('message', onMsg)
    window.parent.postMessage({ type: '__edit_mode_available' }, '*')
    return () => window.removeEventListener('message', onMsg)
  }, [])

  const update = (k, v) => {
    setTweaks(t => ({ ...t, [k]: v }))
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*')
  }

  const baseTheme = EM_THEMES[tweaks.mode] || EM_THEMES.light
  const theme = { ...baseTheme, accent: EM_ACCENTS[tweaks.accent] || EM_ACCENTS.sage, mode: tweaks.mode }

  const focusFlag = tweaks.networkFocus && tweaks.networkFocus !== 'none' ? tweaks.networkFocus : null

  return (
    <div style={{ background: theme.bg, color: theme.fg, fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
      <style>{`
        html, body { background: ${theme.bg}; margin: 0; }
        * { box-sizing: border-box; }
        a { color: inherit; }
        ::selection { background: ${theme.accent}30; }
      `}</style>

      <SiteNav theme={theme} topPage="use-cases" currentPage="emerging-markets"/>

      <section style={{ padding: '120px 48px 80px', maxWidth: 1400, margin: '0 auto' }}>
        <Eyebrow theme={theme}>Use Case · 05</Eyebrow>
        <RevealText>
          <Display theme={theme} style={{ maxWidth: 1080 }}>
            Emerging Markets research, built from <em style={{ fontStyle: 'italic', color: theme.accent }}>primary signals</em>.
          </Display>
        </RevealText>
        <RevealText delay={0.2}>
          <div style={{
            marginTop: 32, maxWidth: 700,
            fontSize: 17, lineHeight: 1.6, color: theme.fgDim2,
          }}>
            Qntify builds custom datasets for due diligence, trade and supply chain intelligence.
          </div>
        </RevealText>

        <div style={{ marginTop: 56, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {EM_DATA.focus.map(f => (
            <span key={f.tag} style={{
              padding: '7px 14px',
              border: `1px solid ${theme.rule}`,
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
              letterSpacing: 1.5, color: theme.fgDim2,
            }}><span style={{ color: theme.accent }}>◆</span> {f.tag} · {f.label.toUpperCase()}</span>
          ))}
        </div>

        <div style={{ marginTop: 56, display: 'flex', gap: 48, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: 2, color: theme.fgDim, flexWrap: 'wrap' }}>
          {EM_DATA.stats.map(s => (
            <div key={s.label}>
              <div style={{ color: theme.fg, fontSize: 32, fontFamily: '"IBM Plex Serif", Georgia, serif', letterSpacing: -0.4, marginBottom: 4 }}>{s.value}</div>
              {s.label.toUpperCase()}
            </div>
          ))}
        </div>
      </section>

      <Rule theme={theme}/>

      <section style={{ padding: '80px 48px 40px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start', marginBottom: 48 }}>
          <div>
            <Eyebrow theme={theme}>Part I</Eyebrow>
            <Display theme={theme} style={{ fontSize: 'clamp(28px, 3.4vw, 44px)' }}>
              Signals, not consensus.
            </Display>
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.7, color: theme.fgDim2, paddingTop: 32 }}>
            Frontier prints move faster than the research that explains them. We publish
            reconstructed series from primary filings so allocators can read the move as
            it happens — not six weeks later, through a sell-side template.
          </div>
        </div>

        <HeroSparkline theme={theme} dataset={tweaks.heroDataset}/>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
          <Heatmap theme={theme}/>
          <RankedBars theme={theme}/>
        </div>
      </section>

      <div style={{ height: 40 }}/>
      <Rule theme={theme}/>

      <section style={{ padding: '80px 48px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start', marginBottom: 40 }}>
          <div>
            <Eyebrow theme={theme}>Part II</Eyebrow>
            <Display theme={theme} style={{ fontSize: 'clamp(28px, 3.4vw, 44px)' }}>
              Trade & supply chain.
            </Display>
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.7, color: theme.fgDim2, paddingTop: 32 }}>
            A cross-border exposure is a graph, not a line. We reconstruct the graph from
            port, customs and ownership data — then flag chokepoints, sanctioned parents,
            and hidden common ownership before the deal closes.
          </div>
        </div>

        <RevealText>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: 2, color: theme.fgDim, marginBottom: 18 }}>
            CRITICAL MINERALS · FOUR-STAGE RECONSTRUCTION
          </div>
        </RevealText>
        <SupplyChainNetwork theme={theme} focusFlag={focusFlag}/>
      </section>

      <Rule theme={theme}/>

      <section style={{ padding: '80px 48px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'end', marginBottom: 40 }}>
          <div>
            <Eyebrow theme={theme}>Part III</Eyebrow>
            <Display theme={theme} style={{ fontSize: 'clamp(28px, 3.4vw, 44px)' }}>Proprietary datasets.</Display>
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.7, color: theme.fgDim2, maxWidth: 540 }}>
            Six of thirty-one. Each is built, cleaned, and reconciled in-house — not
            licensed. FOI-recovered where necessary. Available to partners under
            standard data terms.
          </div>
        </div>
        <DatasetsGrid theme={theme}/>
      </section>

      <Rule theme={theme}/>

      <section style={{ padding: '80px 48px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'end', marginBottom: 40 }}>
          <div>
            <Eyebrow theme={theme}>Part IV</Eyebrow>
            <Display theme={theme} style={{ fontSize: 'clamp(28px, 3.4vw, 44px)' }}>Network Analysis.</Display>
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.7, color: theme.fgDim2, maxWidth: 540 }}>
            Six of thirty-one. Each is built, cleaned, and reconciled in-house — not
            licensed. FOI-recovered where necessary. Available to partners under
            standard data terms.
          </div>
        </div>
        <NexusGraph showHeader={false} showFooter={false} style={{ height: '720px', borderRadius: '12px' }}/>
      </section>

      <Rule theme={theme}/>

      <section style={{ padding: '80px 48px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'end', marginBottom: 40 }}>
          <div>
            <Eyebrow theme={theme}>Coverage</Eyebrow>
            <Display theme={theme} style={{ fontSize: 'clamp(26px, 3vw, 38px)' }}>Country depth.</Display>
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.65, color: theme.fgDim2, maxWidth: 520 }}>
            Depth varies by country and mandate. <em>Deep</em> coverage means primary
            sources, local counsel, and regular fieldwork; <em>selective</em> is sector-specific;
            <em> targeted</em> means we spin up on request.
          </div>
        </div>
        <CoverageList theme={theme}/>
      </section>

      <div style={{ height: 40 }}/>
      <Rule theme={theme}/>

      <section style={{ padding: '120px 48px 140px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ maxWidth: 820 }}>
          <Eyebrow theme={theme}>Next</Eyebrow>
          <Display theme={theme}>
            The alpha in frontier is in the reconstruction. Qntify reconstructs.
          </Display>
          <div style={{ marginTop: 40, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button style={{
              padding: '14px 28px', fontSize: 14, fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              background: theme.fg, color: theme.bg,
              border: 'none', cursor: 'pointer', letterSpacing: 0.5,
            }}>Request a briefing →</button>
            <button style={{
              padding: '14px 28px', fontSize: 14, fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              background: 'transparent', color: theme.fg,
              border: `1px solid ${theme.rule}`, cursor: 'pointer', letterSpacing: 0.5,
            }}>Download sample report (PDF)</button>
          </div>
        </div>
      </section>

      <SiteFooter theme={theme}/>

      {editMode && <EmTweaks tweaks={tweaks} onChange={update} theme={theme}/>}
    </div>
  )
}

function EmTweaks({ tweaks, onChange, theme }) {
  const row = { fontSize: 9, letterSpacing: 1.5, color: theme.fgDim, marginBottom: 6, marginTop: 14 }
  const btn = (active) => ({
    padding: '6px', fontSize: 10, letterSpacing: 1,
    background: active ? theme.fg : 'transparent',
    color: active ? theme.bg : theme.fg,
    border: `1px solid ${theme.rule}`, cursor: 'pointer',
    fontFamily: 'inherit', textTransform: 'uppercase', flex: 1,
  })
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 200,
      width: 252, background: theme.panel,
      border: `1px solid ${theme.rule}`,
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      padding: 16, fontFamily: 'JetBrains Mono, monospace',
    }}>
      <div style={{ fontSize: 10, letterSpacing: 2, color: theme.fgDim }}>◈ TWEAKS</div>

      <div style={row}>MODE</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {['light', 'dark'].map(m => (
          <button key={m} onClick={() => onChange('mode', m)} style={btn(tweaks.mode === m)}>{m}</button>
        ))}
      </div>

      <div style={row}>ACCENT</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
        {Object.entries(EM_ACCENTS).map(([k, c]) => (
          <button key={k} onClick={() => onChange('accent', k)} style={{
            padding: '10px 0', fontSize: 9, letterSpacing: 1,
            background: c, color: '#fff',
            border: tweaks.accent === k ? `2px solid ${theme.fg}` : `1px solid ${theme.rule}`,
            cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase',
          }}>{k.slice(0, 3)}</button>
        ))}
      </div>

      <div style={row}>HERO DATASET</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {[['fx','FX'], ['yields','YIELDS']].map(([k, l]) => (
          <button key={k} onClick={() => onChange('heroDataset', k)} style={btn(tweaks.heroDataset === k)}>{l}</button>
        ))}
      </div>

      <div style={row}>NETWORK FOCUS</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
        {[['none','NONE'],['chokepoint','CHOKE'],['sanctions','SANC'],['ownership','OWNR']].map(([k, l]) => (
          <button key={k} onClick={() => onChange('networkFocus', k)} style={btn(tweaks.networkFocus === k)}>{l}</button>
        ))}
      </div>
    </div>
  )
}
