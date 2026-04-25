// Shared top nav for all site pages — supports two tiers:
//   - Top row (always): site-level sections (Use Cases / About Us / Request Demo)
//   - Sub row (when currentPage is set): the 4 use-case pages
//
// Variants:
//   - variant="sticky" (default): sits at the top of a scrollable page
//   - variant="overlay": absolute, transparent — overlays a fullscreen visual
//
// Pass `topPage` to highlight the current top-level section.
// Pass `currentPage` (only on use-case pages) to render and highlight the sub row.
// Pass `extras` to slot status indicators (e.g. LiveClock) on the right of the top row.

const TOP_PAGES = [
  { key: 'use-cases',    label: 'Use Cases',    href: 'index.html#use-cases' },
  { key: 'about',        label: 'About Us',     href: 'about.html' },
  { key: 'request-demo', label: 'Request Demo', href: 'request-demo.html' },
]

const SUB_PAGES = [
  { key: 'asset-mapping',      label: 'Asset Mapping',      href: 'global-asset-map.html' },
  { key: 'alternative-assets', label: 'Alternative Assets', href: 'alternative-assets.html' },
  { key: 'whistleblower',      label: 'Whistleblower',      href: 'whistleblower-claims.html' },
  { key: 'emerging-markets',   label: 'Emerging Markets',   href: 'emerging-markets.html' },
]

export function SiteNav({
  theme,
  topPage = 'use-cases',
  currentPage = null,
  variant = 'sticky',
  extras = null,
}) {
  // Asset-map themes flag light/dark via theme.name (PAPER is the only light one);
  // content-page themes use theme.mode.
  const isLight =
    theme.mode === 'light' ||
    (theme.mode === undefined && theme.name === 'PAPER')
  const logoSrc = isLight
    ? 'assets/Qntify_logo_trans.png'
    : 'assets/qntify-logo-white.png'

  const isOverlay = variant === 'overlay'
  const ruleColor = theme.border || theme.rule
  const showSubRow = currentPage != null

  const containerStyle = isOverlay ? {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
    background: 'transparent',
    color: theme.fg,
    backdropFilter: 'blur(4px)',
  } : {
    position: 'sticky', top: 0, zIndex: 50,
    background: `${theme.bg}e8`,
    backdropFilter: 'blur(8px)',
  }

  const linkActive = {
    color: theme.fg, textDecoration: 'none',
    borderBottom: `1px solid ${theme.accent}`, paddingBottom: 2,
  }
  const linkInactive = { color: theme.fgDim, textDecoration: 'none' }

  return (
    <nav style={containerStyle}>
      {/* Top row: logo + top-tier links + extras */}
      <div style={{
        height: 72,
        display: 'flex', alignItems: 'center',
        padding: '0 48px', justifyContent: 'space-between',
        borderBottom: `1px solid ${ruleColor}`,
      }}>
        <div>
          <a href="index.html" aria-label="Qntify" style={{ display: 'inline-block', lineHeight: 0 }}>
            <img src={logoSrc} alt="Qntify"
              style={{ display: 'block', height: '55px', width: 'auto' }} />
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <div style={{ display: 'flex', gap: 28, fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500 }}>
            {TOP_PAGES.map(p => {
              const active = p.key === topPage
              // For "Use Cases", we link to the landing-page anchor even when
              // active — clicking it from a use-case page should take you back
              // to the grid. Other top links go inert (#) when active.
              const inertOnActive = p.key !== 'use-cases'
              return (
                <a key={p.key}
                  href={active && inertOnActive ? '#' : p.href}
                  style={active ? linkActive : linkInactive}>
                  {p.label}
                </a>
              )
            })}
          </div>
          {extras ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10, color: theme.fgDim, letterSpacing: 1,
            }}>
              {extras}
            </div>
          ) : null}
        </div>
      </div>

      {/* Sub row: use-case page links (only on use-case pages) */}
      {showSubRow && (
        <div style={{
          height: 40,
          display: 'flex', alignItems: 'center',
          padding: '0 48px', justifyContent: 'flex-end',
          borderBottom: `1px solid ${ruleColor}`,
          background: isOverlay ? 'transparent' : `${theme.bg}9c`,
        }}>
          <div style={{ display: 'flex', gap: 24, fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500 }}>
            {SUB_PAGES.map(p => {
              const active = p.key === currentPage
              return (
                <a key={p.key} href={active ? '#' : p.href}
                  style={active ? linkActive : linkInactive}>
                  {p.label}
                </a>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
