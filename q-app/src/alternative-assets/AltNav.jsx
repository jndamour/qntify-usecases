export function AltNav({ theme }) {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      height: 72, display: 'flex', alignItems: 'center',
      padding: '0 48px', justifyContent: 'space-between',
      background: `${theme.bg}e8`,
      backdropFilter: 'blur(8px)',
      borderBottom: `1px solid ${theme.rule}`,
    }}>
      <div>
        <a href="index.html" aria-label="Qntify" style={{ display: 'inline-block', lineHeight: 0 }}>
          <img src="assets/Qntify_logo_trans.png" alt="Qntify"
            style={{ display: 'block', width: '120px', height: 'auto' }} />
        </a>
      </div>
      <div style={{ display: 'flex', gap: 26, fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500 }}>
        <a href="global-asset-map.html" style={{ color: theme.fgDim, textDecoration: 'none' }}>Asset Mapping</a>
        <a href="#" style={{ color: theme.fg, textDecoration: 'none', borderBottom: `1px solid ${theme.accent}`, paddingBottom: 3 }}>Alternative Assets</a>
        <a href="whistleblower-claims.html" style={{ color: theme.fgDim, textDecoration: 'none' }}>Whistleblower</a>
        <a href="emerging-markets.html" style={{ color: theme.fgDim, textDecoration: 'none' }}>Emerging Markets</a>
        <a href="#" style={{ color: theme.fgDim, textDecoration: 'none' }}>Request Demo</a>
      </div>
    </nav>
  )
}
