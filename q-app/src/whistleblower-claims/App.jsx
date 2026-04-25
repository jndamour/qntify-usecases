import { useEffect, useState } from 'react'
import { Eyebrow, Display, Rule, RevealText } from '../shared/ui'
import { SiteNav } from '../shared/SiteNav'
import { SiteFooter } from '../shared/SiteFooter'
import { WB_DATA } from './data'
import { NewsPastiche } from './pastiche'
import { TypologyGrid, ProgramsTable, ConfidentialityBlock } from './sections'

const WB_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "light",
  "accent": "copper",
  "callout": "standard"
}/*EDITMODE-END*/

const WB_THEMES = {
  light: {
    bg: '#f7f5f0', paper: '#eeeae0', clipBg: '#fbfaf4', panel: '#fbfaf6',
    fg: '#1a1d24', fgDim: '#7a7366', fgDim2: '#4a4a44',
    rule: 'rgba(20, 20, 30, 0.12)',
    landFill: 'rgba(20, 30, 46, 0.08)',
    landStroke: 'rgba(20, 30, 46, 0.35)',
    highlight: 'rgba(220, 180, 60, 0.45)',
    tape: 'rgba(220, 200, 140, 0.55)',
  },
  dark: {
    bg: '#0e1117', paper: '#161b24', clipBg: '#1a202b', panel: '#141921',
    fg: '#eef0f4', fgDim: '#7a8394', fgDim2: '#b8bfcc',
    rule: 'rgba(255, 255, 255, 0.1)',
    landFill: 'rgba(200, 220, 240, 0.04)',
    landStroke: 'rgba(200, 220, 240, 0.3)',
    highlight: 'rgba(220, 180, 60, 0.3)',
    tape: 'rgba(120, 105, 70, 0.45)',
  },
}

const WB_ACCENTS = {
  indigo: '#4a5c9c',
  copper: '#b5773a',
  sage:   '#4a7a6c',
  navy:   '#0f1a2e',
}

export default function WBApp() {
  const [tweaks, setTweaks] = useState(WB_TWEAK_DEFAULTS)
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

  const base = WB_THEMES[tweaks.mode] || WB_THEMES.light
  const theme = { ...base, accent: WB_ACCENTS[tweaks.accent] || WB_ACCENTS.copper, mode: tweaks.mode }

  const stats = WB_DATA.stats
  const focus = WB_DATA.focus

  return (
    <div style={{ background: theme.bg, color: theme.fg, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        html, body { background: ${theme.bg}; margin: 0; }
        * { box-sizing: border-box; }
        ::selection { background: ${theme.accent}30; }
      `}</style>

      <SiteNav theme={theme} currentPage="whistleblower"/>

      <section style={{ padding: '120px 48px 80px', maxWidth: 1400, margin: '0 auto' }}>
        <Eyebrow theme={theme}>Use Case · 05</Eyebrow>
        <RevealText>
          <Display theme={theme} style={{ maxWidth: 1040 }}>
            Where fraud is revealed in <em style={{ fontStyle: 'italic', color: theme.accent }}>signals</em>, not sources.
          </Display>
        </RevealText>
        <RevealText delay={0.15}>
          <div style={{ marginTop: 32, maxWidth: 720, fontSize: 17, lineHeight: 1.6, color: theme.fgDim2 }}>
            Qntify assembles specialized intelligence for whistleblower matters across
            political corruption, corporate fraud, and trade-based money laundering. Public
            filings, media, and corporate records are triangulated into consolidated tips
            filed under the major federal programs.
          </div>
        </RevealText>
        <div style={{ marginTop: 56, display: 'flex', gap: 48, flexWrap: 'wrap' }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={{
                fontFamily: '"IBM Plex Serif", Georgia, serif',
                fontSize: 32, letterSpacing: -0.4, color: theme.fg, marginBottom: 4,
              }}>{s.value}</div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10, letterSpacing: 2, color: theme.fgDim,
                textTransform: 'uppercase',
              }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 48, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {focus.map(f => (
            <span key={f.tag} style={{
              padding: '6px 14px',
              border: `1px solid ${theme.rule}`,
              background: theme.panel,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10, letterSpacing: 1.5,
              color: theme.fgDim2,
            }}>
              <span style={{ color: theme.accent, marginRight: 8 }}>◆</span>
              {f.tag} · {f.label}
            </span>
          ))}
        </div>
      </section>

      <Rule theme={theme}/>

      <section style={{ padding: '80px 48px 60px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start', marginBottom: 40 }}>
          <div>
            <Eyebrow theme={theme}>Pattern Detection</Eyebrow>
            <Display theme={theme} style={{ fontSize: 'clamp(28px, 3.4vw, 44px)' }}>
              Five clippings. One entity.
            </Display>
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.7, color: theme.fgDim2, paddingTop: 28 }}>
            An anonymized walk-through. Each clipping is a public signal — a regulatory
            filing, a market report, an audit footnote. Separately they are background
            noise. Consolidated, they describe a single beneficial owner moving value
            through layered intermediaries. A whistleblower case is initiated.
          </div>
        </div>
        <NewsPastiche theme={theme} variant={tweaks.callout || 'standard'}/>
      </section>

      <Rule theme={theme}/>

      <section style={{ padding: '100px 48px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ maxWidth: 760, marginBottom: 48 }}>
          <Eyebrow theme={theme}>Typology</Eyebrow>
          <Display theme={theme} style={{ fontSize: 'clamp(28px, 3.4vw, 44px)' }}>
            Eight patterns that recur across jurisdictions.
          </Display>
        </div>
        <TypologyGrid theme={theme}/>
      </section>

      <Rule theme={theme}/>

      <section style={{ padding: '100px 48px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'end', marginBottom: 40 }}>
          <div>
            <Eyebrow theme={theme}>Programs</Eyebrow>
            <Display theme={theme} style={{ fontSize: 'clamp(26px, 3vw, 38px)' }}>
              Federal whistleblower frameworks we file under.
            </Display>
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.65, color: theme.fgDim2, maxWidth: 520 }}>
            Consolidated tips are prepared with outside counsel and filed directly with the
            responsible agency. Award bands reflect statutory ranges; actual outcomes
            depend on the agency's exercise of discretion.
          </div>
        </div>
        <ProgramsTable theme={theme}/>
      </section>

      <Rule theme={theme}/>

      <section style={{ padding: '100px 48px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ maxWidth: 820, marginBottom: 48 }}>
          <Eyebrow theme={theme}>Confidentiality</Eyebrow>
          <Display theme={theme} style={{ fontSize: 'clamp(28px, 3.4vw, 44px)' }}>
            Source protection is operational, not aspirational.
          </Display>
        </div>
        <ConfidentialityBlock theme={theme}/>
      </section>

      <Rule theme={theme}/>

      <section style={{ padding: '120px 48px 140px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ maxWidth: 820 }}>
          <Eyebrow theme={theme}>Next</Eyebrow>
          <Display theme={theme}>
            If you have a signal, we can help you structure it into a filing.
          </Display>
          <div style={{ marginTop: 40, display: 'flex', gap: 16 }}>
            <button style={{
              padding: '14px 28px', fontSize: 14, fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              background: theme.fg, color: theme.bg,
              border: 'none', cursor: 'pointer', letterSpacing: 0.5,
            }}>Request intake →</button>
            <button style={{
              padding: '14px 28px', fontSize: 14, fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              background: 'transparent', color: theme.fg,
              border: `1px solid ${theme.rule}`, cursor: 'pointer', letterSpacing: 0.5,
            }}>Secure contact</button>
          </div>
        </div>
      </section>

      <SiteFooter theme={theme}/>

      {editMode && <WBTweaks tweaks={tweaks} onChange={update} theme={theme}/>}
    </div>
  )
}

function WBTweaks({ tweaks, onChange, theme }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 200,
      width: 240, background: theme.panel,
      border: `1px solid ${theme.rule}`,
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      padding: 16, fontFamily: 'JetBrains Mono, monospace',
    }}>
      <div style={{ fontSize: 10, letterSpacing: 2, color: theme.fgDim, marginBottom: 14 }}>◈ TWEAKS</div>

      <div style={{ fontSize: 9, letterSpacing: 1.5, color: theme.fgDim, marginBottom: 6 }}>MODE</div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {['light', 'dark'].map(m => (
          <button key={m} onClick={() => onChange('mode', m)} style={{
            flex: 1, padding: '6px', fontSize: 10, letterSpacing: 1,
            background: tweaks.mode === m ? theme.fg : 'transparent',
            color: tweaks.mode === m ? theme.bg : theme.fg,
            border: `1px solid ${theme.rule}`, cursor: 'pointer',
            fontFamily: 'inherit', textTransform: 'uppercase',
          }}>{m}</button>
        ))}
      </div>

      <div style={{ fontSize: 9, letterSpacing: 1.5, color: theme.fgDim, marginBottom: 6 }}>ACCENT</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 14 }}>
        {Object.entries(WB_ACCENTS).map(([k, c]) => (
          <button key={k} onClick={() => onChange('accent', k)} style={{
            padding: '10px 0', fontSize: 9, letterSpacing: 1,
            background: c, color: '#fff',
            border: tweaks.accent === k ? `2px solid ${theme.fg}` : `1px solid ${theme.rule}`,
            cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase',
          }}>{k.slice(0, 3)}</button>
        ))}
      </div>

      <div style={{ fontSize: 9, letterSpacing: 1.5, color: theme.fgDim, marginBottom: 6 }}>CALLOUT</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[
          ['standard',  'Standard'],
          ['dossier',   'Dossier'],
          ['narrative', 'Narrative'],
        ].map(([k, label]) => (
          <button key={k} onClick={() => onChange('callout', k)} style={{
            padding: '8px 10px', fontSize: 10, letterSpacing: 1, textAlign: 'left',
            background: tweaks.callout === k ? theme.fg : 'transparent',
            color: tweaks.callout === k ? theme.bg : theme.fg,
            border: `1px solid ${theme.rule}`, cursor: 'pointer',
            fontFamily: 'inherit', textTransform: 'uppercase',
          }}>{label}</button>
        ))}
      </div>
    </div>
  )
}
