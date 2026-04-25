import { Fragment, useState } from 'react'
import { SiteNav } from '../shared/SiteNav'
import { SiteFooter } from '../shared/SiteFooter'
import { COUNTRIES, EXPECT } from './data'
import {
  TweaksPanel, TweakSection, TweakRadio, TweakToggle, TweakText,
  useTweaks,
} from './TweaksPanel'
import './styles.css'

const SITE_THEME = {
  name: 'PAPER',
  mode: 'light',
  bg: '#f7f5f0',
  fg: '#1a1d24',
  fgDim: '#7a7366',
  accent: '#4a5c9c',
  rule: 'rgba(20, 20, 30, 0.12)',
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "layout": "bold",
  "showProof": true,
  "headline": "Custom datasets, briefed to your *intelligence* team in 30 minutes.",
  "lede": "See how Qntify assembles asset maps, alternative-asset theses, and emerging-market datasets for legal claims and enforcement-era capital. Demos are run by a senior analyst, not an SDR."
}/*EDITMODE-END*/

function HeadlineWithEm({ text }) {
  const parts = text.split(/(\*[^*]+\*)/g)
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith('*') && p.endsWith('*')
          ? <em key={i}>{p.slice(1, -1)}</em>
          : <Fragment key={i}>{p}</Fragment>
      )}
    </span>
  )
}

function FormFields({ submitted }) {
  return (
    <Fragment>
      <div className="field-row">
        <div className="field">
          <label htmlFor="f-name">Full name <span className="req">*</span></label>
          <input id="f-name" type="text" placeholder="Ada Lovelace" required />
        </div>
        <div className="field">
          <label htmlFor="f-co">Company <span className="req">*</span></label>
          <input id="f-co" type="text" placeholder="Firm or fund" required />
        </div>
      </div>
      <div className="field">
        <label htmlFor="f-email">Work email <span className="req">*</span></label>
        <input id="f-email" type="email" placeholder="ada@firm.com" required />
      </div>
      <div className="field">
        <label htmlFor="f-region">Country / region of focus <span className="req">*</span></label>
        <select id="f-region" defaultValue="" required>
          <option value="" disabled>Select primary jurisdiction</option>
          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <button className="submit" type="submit">
        <span>{submitted ? 'Request received' : 'Request demo access'}</span>
        <span className="arrow">→</span>
      </button>
      <p className="form-footnote">
        Demos are scheduled within 2 business days. By submitting you agree to our <a href="#">privacy notice</a>. Qntify never resells contact data.
      </p>
      <div className="meta-row">
        <span>Avg. response · <b>under 24h</b></span>
        <span>Demo length · <b>30 min</b></span>
      </div>
    </Fragment>
  )
}

function FormCard({ variant }) {
  const [submitted, setSubmitted] = useState(false)
  const onSubmit = (e) => { e.preventDefault(); setSubmitted(true) }
  return (
    <form className={'form-card ' + (variant === 'bold' ? 'bold-form' : '')} onSubmit={onSubmit} noValidate>
      <div className="form-eyebrow">Demo Request · Form 01</div>
      <h2>Tell us where to start.</h2>
      <p className="form-sub">A senior analyst will reach out to scope the session. Four fields, no calendar dance.</p>
      <FormFields submitted={submitted} />
    </form>
  )
}

function ProofBlock({ dark }) {
  return (
    <div className={'proof ' + (dark ? 'bold-proof' : '')}>
      <div className="proof-eyebrow">Trusted by</div>
      <p className="proof-quote">
        "Qntify gave us a single defensible map of an offshore network we'd been chasing for eighteen months. Two weeks, end to end."
      </p>
      <div className="proof-attrib"><b>Partner</b> · Litigation finance fund · London</div>
      <div className="proof-clients">
        <span>Litigation Finance · NA</span>
        <span>Sovereign Recovery · EU</span>
        <span>Family Offices · MENA</span>
        <span>Whistleblower Counsel · US</span>
      </div>
    </div>
  )
}

function SplitLayout({ tweaks }) {
  return (
    <section className="split">
      <div className="split-left">
        <div className="eyebrow">Qntify · Request a Demo</div>
        <h1 className="headline"><HeadlineWithEm text={tweaks.headline} /></h1>
        <p className="lede">{tweaks.lede}</p>

        <div className="expect-list">
          {EXPECT.map(e => (
            <div className="expect-row" key={e.n}>
              <div className="num">{e.n}</div>
              <div>
                <h3 className="title">{e.t}</h3>
                <p className="desc">{e.d}</p>
              </div>
            </div>
          ))}
        </div>

        {tweaks.showProof && <ProofBlock />}
      </div>

      <aside className="split-right">
        <FormCard variant="split" />
      </aside>
    </section>
  )
}

function BoldLayout({ tweaks }) {
  return (
    <section className="bold-hero">
      <div className="bold-grid">
        <div className="bold-left">
          <div className="eyebrow">Qntify · Demo Access</div>
          <h1 className="headline"><HeadlineWithEm text={tweaks.headline} /></h1>
          <p className="lede">{tweaks.lede}</p>

          <div className="expect-list">
            {EXPECT.map(e => (
              <div className="expect-row" key={e.n}>
                <div className="num">{e.n}</div>
                <div>
                  <h3 className="title">{e.t}</h3>
                  <p className="desc">{e.d}</p>
                </div>
              </div>
            ))}
          </div>

          {tweaks.showProof && <ProofBlock dark />}
        </div>

        <div className="bold-form-wrap">
          <FormCard variant="bold" />
        </div>
      </div>
    </section>
  )
}

export default function DemoApp() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS)

  return (
    <div className="demo-page">
      <SiteNav theme={SITE_THEME} topPage="request-demo"/>

      <main className="page">
        {tweaks.layout === 'bold'
          ? <BoldLayout tweaks={tweaks} />
          : <SplitLayout tweaks={tweaks} />}

        <TweaksPanel title="Tweaks">
          <TweakSection label="Layout">
            <TweakRadio
              label="Variation"
              value={tweaks.layout}
              options={[
                { value: 'split', label: 'Split (safe)' },
                { value: 'bold', label: 'Bold (dark hero)' },
              ]}
              onChange={(v) => setTweak('layout', v)}
            />
          </TweakSection>

          <TweakSection label="Content">
            <TweakToggle
              label="Show social proof"
              value={tweaks.showProof}
              onChange={(v) => setTweak('showProof', v)}
            />
            <TweakText
              label="Headline · use *word* for italic accent"
              value={tweaks.headline}
              onChange={(v) => setTweak('headline', v)}
            />
            <TweakText
              label="Lede"
              value={tweaks.lede}
              onChange={(v) => setTweak('lede', v)}
            />
          </TweakSection>
        </TweaksPanel>
      </main>

      <SiteFooter theme={SITE_THEME}/>
    </div>
  )
}
