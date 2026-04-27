import { useEffect, useState } from 'react'
import { Eyebrow, Display, Rule, RevealText } from '../shared/ui'
import { SiteNav } from '../shared/SiteNav'
import { SiteFooter } from '../shared/SiteFooter'
import { RelationshipGraph } from './graph'
import { JurisdictionsMap } from './globe'

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "light",
  "accent": "indigo"
}/*EDITMODE-END*/

const THEMES = {
  light: {
    bg: '#f7f5f0', panel: '#fbfaf6',
    fg: '#1a1d24', fgDim: '#7a7366', fgDim2: '#4a4a44',
    rule: 'rgba(20, 20, 30, 0.12)',
    landFill: 'rgba(20, 30, 46, 0.08)',
    landStroke: 'rgba(20, 30, 46, 0.35)',
    nodePrimary: '#0f1a2e',
    nodeNeutral: '#fbfaf6',
    nodeAccent: '#d9dde4',
    edge: 'rgba(20, 30, 46, 0.4)',
    aerial1: '#5a6b3c', aerial2: '#b89c5f', aerial3: '#7a8850',
    aerial1Active: '#4a6b3c', aerial2Active: '#c9a565', aerial3Active: '#6a8850',
  },
  dark: {
    bg: '#0e1117', panel: '#141921',
    fg: '#eef0f4', fgDim: '#7a8394', fgDim2: '#b8bfcc',
    rule: 'rgba(255, 255, 255, 0.1)',
    landFill: 'rgba(200, 220, 240, 0.04)',
    landStroke: 'rgba(200, 220, 240, 0.3)',
    nodePrimary: '#e8ecf4',
    nodeNeutral: '#1a1f28',
    nodeAccent: '#2a3040',
    edge: 'rgba(200, 220, 240, 0.35)',
    aerial1: '#2b3820', aerial2: '#4a3f20', aerial3: '#3a4a28',
    aerial1Active: '#3d5028', aerial2Active: '#6a5a30', aerial3Active: '#506340',
  },
}

const ACCENTS = {
  indigo: '#4a5c9c',
  copper: '#b5773a',
  sage:   '#4a7a6c',
  navy:   '#0f1a2e',
}

export default function AltApp() {
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS)
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

  const baseTheme = THEMES[tweaks.mode] || THEMES.light
  const theme = { ...baseTheme, accent: ACCENTS[tweaks.accent] || ACCENTS.indigo, mode: tweaks.mode }

  return (
    <div style={{
      background: theme.bg, color: theme.fg,
      fontFamily: 'Inter, sans-serif',
      minHeight: '100vh',
    }}>
      <style>{`
        html, body { background: ${theme.bg}; margin: 0; }
        * { box-sizing: border-box; }
        a { color: inherit; }
        ::selection { background: ${theme.accent}30; }
      `}</style>

      <SiteNav theme={theme} topPage="use-cases" currentPage="alternative-assets"/>

      <section style={{ padding: '80px 48px 100px', maxWidth: 1400, margin: '0 auto' }}>
        <Eyebrow theme={theme}>Use Case · 02</Eyebrow>
        <RevealText>
          <Display theme={theme} style={{ maxWidth: 980 }}>
            Alternative Assets for an era defined by <em style={{ fontStyle: 'italic', color: theme.accent }}>enforcement</em>.
          </Display>
        </RevealText>
        <RevealText delay={0.2}>
          <div style={{
            marginTop: 32, maxWidth: 680,
            fontSize: 17, lineHeight: 1.6, color: theme.fgDim2,
          }}>
            Qntify focuses on two asset classes where information asymmetry is the
            determinant of return: legal claims and enforcement recoveries. Both reward depth over speed.
          </div>
        </RevealText>
        <div style={{ marginTop: 64, display: 'flex', gap: 48, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: 2, color: theme.fgDim }}>
          <div><div style={{ color: theme.fg, fontSize: 28, fontFamily: '"IBM Plex Serif", Georgia, serif', letterSpacing: -0.3, marginBottom: 4 }}>$1.8B</div>CAPITAL UNDER WATCH</div>
          <div><div style={{ color: theme.fg, fontSize: 28, fontFamily: '"IBM Plex Serif", Georgia, serif', letterSpacing: -0.3, marginBottom: 4 }}>17</div>JURISDICTIONS</div>
          <div><div style={{ color: theme.fg, fontSize: 28, fontFamily: '"IBM Plex Serif", Georgia, serif', letterSpacing: -0.3, marginBottom: 4 }}>42</div>ACTIVE CASES</div>
        </div>
      </section>

      <Rule theme={theme}/>

      <section style={{ padding: '100px 48px 40px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start' }}>
          <div>
            <Eyebrow theme={theme}>Asset Classes</Eyebrow>
            <Display theme={theme} style={{ fontSize: 'clamp(28px, 3.4vw, 44px)' }}>
              Legal Claims & Enforcement
            </Display>
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.7, color: theme.fgDim2, paddingTop: 32 }}>
            A claim is not a number — it is a network of counsel, forums, counter-parties
            and recoverable assets distributed across jurisdictions. Investing in a claim
            is underwriting that network. Enforcement is the long tail: the period between
            an award on paper and money returned to the claimant, where most of the
            structural alpha lives.
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 48px 80px', maxWidth: 1400, margin: '0 auto' }}>
        <RevealText>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: 2, color: theme.fgDim, marginBottom: 24 }}>
            ANATOMY OF A CLAIM
          </div>
        </RevealText>
        <RelationshipGraph theme={theme}/>
      </section>

      <Rule theme={theme}/>

      <section style={{ padding: '80px 48px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'end', marginBottom: 40 }}>
          <div>
            <Eyebrow theme={theme}>Case Book</Eyebrow>
            <Display theme={theme} style={{ fontSize: 'clamp(26px, 3vw, 38px)' }}>Jurisdictional coverage.</Display>
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.65, color: theme.fgDim2, maxWidth: 520 }}>
            Eight anonymized cases from the current book, across commercial arbitration,
            investor-state disputes, and post-judgment enforcement. Displayed on rotation.
          </div>
        </div>
        <JurisdictionsMap theme={theme}/>
      </section>

      <div style={{ height: 40 }}/>
      <Rule theme={theme}/>

      <section style={{ padding: '120px 48px 140px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ maxWidth: 820 }}>
          <Eyebrow theme={theme}>Next</Eyebrow>
          <Display theme={theme}>
            Patient, structured information compounds in value - Qntify supplies the knowledge.
          </Display>
          <div style={{ marginTop: 40, display: 'flex', gap: 16 }}>
            <a href="request-demo.html" style={{
              padding: '14px 28px', fontSize: 14, fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              background: theme.fg, color: theme.bg,
              border: 'none', cursor: 'pointer',
              letterSpacing: 0.5,
              textDecoration: 'none', display: 'inline-block',
            }}>Request a briefing →</a>
{/*             <button style={{
              padding: '14px 28px', fontSize: 14, fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              background: 'transparent', color: theme.fg,
              border: `1px solid ${theme.rule}`, cursor: 'pointer',
              letterSpacing: 0.5,
            }}>Download thesis (PDF)</button> */}
          </div>
        </div>
      </section>

      <SiteFooter theme={theme}/>

      {editMode && <AltTweaks tweaks={tweaks} onChange={update} theme={theme}/>}
    </div>
  )
}

function AltTweaks({ tweaks, onChange, theme }) {
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
        {Object.entries(ACCENTS).map(([k, c]) => (
          <button key={k} onClick={() => onChange('accent', k)} style={{
            padding: '10px 0', fontSize: 9, letterSpacing: 1,
            background: c, color: '#fff',
            border: tweaks.accent === k ? `2px solid ${theme.fg}` : `1px solid ${theme.rule}`,
            cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase',
          }}>{k.slice(0, 3)}</button>
        ))}
      </div>
    </div>
  )
}
