/* global React, ReactDOM, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle, TweakText */
const { useState } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "layout": "split",
  "showProof": true,
  "headline": "Custom datasets, briefed to your *intelligence* team in 30 minutes.",
  "lede": "See how Qntify assembles asset maps, alternative-asset theses, and emerging-market datasets for legal claims and enforcement-era capital. Demos are run by a senior analyst, not an SDR."
}/*EDITMODE-END*/;

const COUNTRIES = [
  "United States","United Kingdom","Canada","Switzerland","Singapore",
  "United Arab Emirates","Germany","France","Netherlands","Luxembourg",
  "Hong Kong","Cayman Islands","British Virgin Islands","Other / multi-jurisdiction"
];

const EXPECT = [
  { n: "01", t: "Live walkthrough of an asset map", d: "We pull a real entity through Global Asset Tracing and show the corporate, real-property, and beneficial-ownership layers we surface." },
  { n: "02", t: "Source coverage for your jurisdiction", d: "Filings, registries, sanctioned-party datasets, court records and trade flows — scoped to where you operate." },
  { n: "03", t: "Methodology + delivery options", d: "How human analysts qualify the machine output, plus API, dossier, and bespoke-engagement formats." }
];

function HeadlineWithEm({ text }) {
  // *word* -> <em>
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith('*') && p.endsWith('*')
          ? <em key={i}>{p.slice(1, -1)}</em>
          : <React.Fragment key={i}>{p}</React.Fragment>
      )}
    </span>
  );
}

function FormFields({ submitted }) {
  return (
    <React.Fragment>
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
        <span>{submitted ? "Request received" : "Request demo access"}</span>
        <span className="arrow">→</span>
      </button>
      <p className="form-footnote">
        Demos are scheduled within 2 business days. By submitting you agree to our <a href="#">privacy notice</a>. Qntify never resells contact data.
      </p>
      <div className="meta-row">
        <span>Avg. response · <b>under 24h</b></span>
        <span>Demo length · <b>30 min</b></span>
      </div>
    </React.Fragment>
  );
}

function FormCard({ variant }) {
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = (e) => { e.preventDefault(); setSubmitted(true); };
  return (
    <form className={"form-card " + (variant === "bold" ? "bold-form" : "")} onSubmit={onSubmit} noValidate>
      <div className="form-eyebrow">Demo Request · Form 01</div>
      <h2>Tell us where to start.</h2>
      <p className="form-sub">A senior analyst will reach out to scope the session. Four fields, no calendar dance.</p>
      <FormFields submitted={submitted} />
    </form>
  );
}

function ProofBlock({ dark }) {
  return (
    <div className={"proof " + (dark ? "bold-proof" : "")}>
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
  );
}

function SplitLayout({ tweaks }) {
  return (
    <section className="split" data-screen-label="01 Split layout">
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
  );
}

function BoldLayout({ tweaks }) {
  return (
    <section className="bold-hero" data-screen-label="02 Bold layout">
      <div className="bold-grid">
        <div className="bold-left">
          <div className="eyebrow">Qntify · Demo Access</div>
          <h1 className="headline"><HeadlineWithEm text={tweaks.headline} /></h1>
          <p className="lede">{tweaks.lede}</p>

          <div className="expect-list dark-expect">
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
  );
}

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  return (
    <main className="page" data-screen-label={tweaks.layout === "bold" ? "Page · Bold" : "Page · Split"}>
      {tweaks.layout === "bold"
        ? <BoldLayout tweaks={tweaks} />
        : <SplitLayout tweaks={tweaks} />}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Layout">
          <TweakRadio
            label="Variation"
            value={tweaks.layout}
            options={[
              { value: "split", label: "Split (safe)" },
              { value: "bold", label: "Bold (dark hero)" }
            ]}
            onChange={(v) => setTweak("layout", v)}
          />
        </TweakSection>

        <TweakSection label="Content">
          <TweakToggle
            label="Show social proof"
            value={tweaks.showProof}
            onChange={(v) => setTweak("showProof", v)}
          />
          <TweakText
            label="Headline · use *word* for italic accent"
            value={tweaks.headline}
            onChange={(v) => setTweak("headline", v)}
          />
          <TweakText
            label="Lede"
            value={tweaks.lede}
            onChange={(v) => setTweak("lede", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
