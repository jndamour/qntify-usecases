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
  "showProof": false,
  "headline": "Custom datasets, briefed to your *intelligence* team in 30 minutes.",
  "lede": "See how Qntify assembles asset maps, alternative-asset insights, and emerging-market datasets for legal claims and enforcement-era capital."
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

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xojyzwar'

const SUBMIT_LABELS = {
  idle: 'Request information',
  sending: 'Sending…',
  sent: 'Request received',
  error: 'Could not send — try again',
}

function FormFields({ status }) {
  return (
    <Fragment>
      <div className="field-row">
        <div className="field">
          <label htmlFor="f-name">Full name <span className="req">*</span></label>
          <input id="f-name" name="name" type="text" placeholder="Claude Shannon" required />
        </div>
        <div className="field">
          <label htmlFor="f-co">Company <span className="req">*</span></label>
          <input id="f-co" name="company" type="text" placeholder="Firm or fund" required />
        </div>
      </div>
      <div className="field">
        <label htmlFor="f-email">Work email <span className="req">*</span></label>
        <input id="f-email" name="email" type="email" placeholder="user@firm.com" required />
      </div>
      <div className="field">
        <label htmlFor="f-region">Country / region of focus <span className="req">*</span></label>
        <select id="f-region" name="region" defaultValue="" required>
          <option value="" disabled>Select primary jurisdiction</option>
          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <button className="submit" type="submit" disabled={status === 'sending' || status === 'sent'}>
        <span>{SUBMIT_LABELS[status]}</span>
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
  const [status, setStatus] = useState('idle')
  const onSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending' || status === 'sent') return
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    const company = (data.company || '').trim()
    const name = (data.name || '').trim()
    setStatus('sending')
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...data,
          _subject: `Demo request — ${company || name || 'Qntify'}`,
        }),
      })
      if (res.ok) {
        setStatus('sent')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }
  return (
    <form className={'form-card ' + (variant === 'bold' ? 'bold-form' : '')} onSubmit={onSubmit} noValidate>
      <div className="form-eyebrow">Demo Request · Form 01</div>
      <h2>Tell us where to start.</h2>
      <p className="form-sub">A senior analyst will reach out to scope the session. Four fields, no calendar dance.</p>
      <FormFields status={status} />
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
