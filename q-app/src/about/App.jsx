import { SiteNav } from '../shared/SiteNav'
import { SiteFooter } from '../shared/SiteFooter'
import { ABOUT_DATA } from './data'
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

export default function AboutApp() {
  return (
    <div className="about-page">
      <SiteNav theme={SITE_THEME} topPage="about"/>

      <section className="hero">
        <div className="eyebrow">Qntify · Who We Are</div>
        <h1>A two-person firm, a wide bench of <em>field operators</em>.</h1>
        <p className="lede">
          Qntify was founded to assemble difficult datasets — beneficial ownership, asset trails, supply-chain provenance — for legal and financial clients operating in enforcement-era markets. We run lean by design, and bring in vetted partners when a brief calls for boots, languages, or jurisdictions we don't keep in-house.
        </p>
      </section>

      <section className="principles">
        <div className="p-grid">
          {ABOUT_DATA.principles.map(p => (
            <div className="p-cell" key={p.n}>
              <span className="p-num">{p.n}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="founders">
        <div className="section-head">
          <div>
            <span className="eyebrow">The Founders</span>
            <h2>Two backgrounds, one <em>operating thesis</em>.</h2>
          </div>
          <div className="head-meta">
            Headcount · <b>2</b><br/>
            Founded · <b>Independently held</b><br/>
            Bench · <b>Vetted partners only</b>
          </div>
        </div>

        <div className="founder-grid">
          {ABOUT_DATA.founders.map(f => (
            <article className="founder" key={f.initials}>
              <div className="portrait" aria-hidden="true">
                <span className="initials">{f.initials}</span>
                <span className="ph">{f.portraitCaption}</span>
              </div>
              <div className="founder-body">
                <span className="role-tag">{f.roleTag}</span>
                <h3 className="name">{f.name}</h3>
                <div className="title">{f.title}</div>
                {f.paragraphs.map((p, i) => (
                  <p key={i} className={i === f.paragraphs.length - 1 ? 'muted' : undefined}>{p}</p>
                ))}
                <div className="creds">
                  {f.creds.map(c => (
                    <div className="cred" key={c.k}>
                      <span className="k">{c.k}</span>
                      <span className="v">{c.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="partners">
        <div className="section-head">
          <div>
            <span className="eyebrow">Bench · Partners</span>
            <h2>The rest is a <em>vetted network</em>, not a payroll.</h2>
            <p className="lede">For specialist work — local source networks, forensic accounting, regional language coverage — we engage partners we've worked with directly. Below are the firm types we routinely co-engage; specific names are disclosed under NDA.</p>
          </div>
        </div>
        <div className="partner-grid">
          {ABOUT_DATA.partners.map(p => (
            <div className="partner" key={p.kind}>
              <span className="kind">{p.kind}</span>
              <h4>{p.name}</h4>
              <p>{p.body}</p>
              <span className="geo">{p.geo}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cta">
        <div className="cta-inner">
          <h2>Have a brief that needs more than a <em>standard dataset?</em></h2>
          <div className="cta-actions">
            <a className="btn btn-primary" href="request-demo.html"><span>Request a demo</span><span>→</span></a>
            <a className="btn btn-ghost" href="mailto:hello@qntify.net"><span>Email the founders</span><span>→</span></a>
          </div>
        </div>
      </section>

      <SiteFooter theme={SITE_THEME}/>
    </div>
  )
}
