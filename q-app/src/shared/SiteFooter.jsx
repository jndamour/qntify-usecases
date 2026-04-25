// Shared bottom footer for use-case pages.
// - variant="sticky" (default): normal page footer in document flow (alt/wb/em)
// - variant="overlay": absolute, thin strip at bottom — overlays a fullscreen visual (asset map)

export function SiteFooter({ theme, variant = 'sticky' }) {
  const ruleColor = theme.rule || theme.border

  const style = variant === 'overlay' ? {
    position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
    padding: '10px 48px',
    borderTop: `1px solid ${ruleColor}`,
    background: `${theme.bg}c8`,
    backdropFilter: 'blur(4px)',
    display: 'flex', justifyContent: 'space-between',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10, letterSpacing: 1.5,
    color: theme.fgDim,
  } : {
    padding: '32px 48px',
    borderTop: `1px solid ${ruleColor}`,
    display: 'flex', justifyContent: 'space-between',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10, letterSpacing: 1.5,
    color: theme.fgDim,
  }

  return (
    <footer style={style}>
      <span>© Qntify · 2026</span>
      <span>Qntify.net · Legal · Privacy</span>
    </footer>
  )
}
