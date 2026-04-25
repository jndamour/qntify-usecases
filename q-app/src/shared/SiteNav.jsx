// Shared top nav for all use-case pages.
// - variant="sticky" (default): sits at the top of a scrollable page (alt/wb/em)
// - variant="overlay": absolute, transparent — overlays a fullscreen visual (asset map)
// Pass `currentPage` so the matching link is highlighted and rendered as inert (#).
// Pass `extras` to slot status indicators (e.g. LiveClock) on the right.

const PAGES = [
  { key: 'asset-mapping',      label: 'Asset Mapping',      href: 'global-asset-map.html' },
  { key: 'alternative-assets', label: 'Alternative Assets', href: 'alternative-assets.html' },
  { key: 'whistleblower',      label: 'Whistleblower',      href: 'whistleblower-claims.html' },
  { key: 'emerging-markets',   label: 'Emerging Markets',   href: 'emerging-markets.html' },
]

export function SiteNav({ theme, currentPage, variant = 'sticky', extras = null }) {
  // Asset-map themes flag light/dark via theme.name (PAPER is the only light one);
  // content-page themes use theme.mode.
  const isLight =
    theme.mode === 'light' ||
    (theme.mode === undefined && theme.name === 'PAPER')
  const logoSrc = isLight
    ? 'assets/Qntify_logo_trans.png'
    : 'assets/qntify-logo-white.png'

  const navStyle = variant === 'overlay' ? {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
    height: 72, display: 'flex', alignItems: 'center',
    padding: '0 48px', justifyContent: 'space-between',
    background: 'transparent', color: theme.fg,
    borderBottom: `1px solid ${theme.border || theme.rule}`,
    backdropFilter: 'blur(4px)',
  } : {
    position: 'sticky', top: 0, zIndex: 50,
    height: 72, display: 'flex', alignItems: 'center',
    padding: '0 48px', justifyContent: 'space-between',
    background: `${theme.bg}e8`,
    backdropFilter: 'blur(8px)',
    borderBottom: `1px solid ${theme.rule}`,
  }

  return (
    <nav style={navStyle}>
      <div>
        <a href="index.html" aria-label="Qntify" style={{ display: 'inline-block', lineHeight: 0 }}>
          <img src={logoSrc} alt="Qntify"
            style={{ display: 'block', height: '45px', width: 'auto' }} />
        </a>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <div style={{ display: 'flex', gap: 24, fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500 }}>
          {PAGES.map(p => {
            const active = p.key === currentPage
            return (
              <a key={p.key} href={active ? '#' : p.href}
                style={active ? {
                  color: theme.fg, textDecoration: 'none',
                  borderBottom: `1px solid ${theme.accent}`, paddingBottom: 2,
                } : {
                  color: theme.fgDim, textDecoration: 'none',
                }}>
                {p.label}
              </a>
            )
          })}
          <a href="#" style={{ color: theme.fgDim, textDecoration: 'none' }}>Request Demo</a>
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
    </nav>
  )
}
