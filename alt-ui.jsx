// Shared UI bits for the Alternative Assets page
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// Observe when an element scrolls into view
function useInView(ref, opts = { threshold: 0.25 }) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect(); }
    }, opts);
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return inView;
}

// Small label that reveals character-by-character when in view
function RevealText({ children, as: Tag = 'div', style, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  return (
    <Tag ref={ref} style={{
      ...style,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(12px)',
      transition: `opacity 0.9s ${delay}s ease, transform 0.9s ${delay}s ease`,
    }}>{children}</Tag>
  );
}

// Nav bar matching site
function AltNav({ theme }) {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      height: 72, display: 'flex', alignItems: 'center',
      padding: '0 48px', justifyContent: 'space-between',
      background: `${theme.bg}e8`,
      backdropFilter: 'blur(8px)',
      borderBottom: `1px solid ${theme.rule}`,
    }}>
      <div style={{
        fontFamily: '"Barlow Condensed", sans-serif',
        fontWeight: 500, fontSize: 28, color: theme.fg, letterSpacing: 0.3,
        display: 'inline-flex', alignItems: 'baseline', whiteSpace: 'nowrap',
      }}>
        <span style={{ position: 'relative', display: 'inline-block' }}>
          Q
          <span style={{
            position: 'absolute', top: -4, right: -3,
            width: 6, height: 6, background: theme.accent, borderRadius: '50%',
          }}/>
        </span>
        <span>ntify</span>
      </div>
      <div style={{ display: 'flex', gap: 26, fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500 }}>
        <a href="Global Asset Map.html" style={{ color: theme.fgDim, textDecoration: 'none' }}>Asset Mapping</a>
        <a href="#" style={{ color: theme.fg, textDecoration: 'none', borderBottom: `1px solid ${theme.accent}`, paddingBottom: 3 }}>Alternative Assets</a>
        <a href="Whistleblower Claims.html" style={{ color: theme.fgDim, textDecoration: 'none' }}>Whistleblower</a>
        <a href="Emerging Markets.html" style={{ color: theme.fgDim, textDecoration: 'none' }}>Emerging Markets</a>
        <a href="#" style={{ color: theme.fgDim, textDecoration: 'none' }}>Request Demo</a>
      </div>
    </nav>
  );
}

// Section label (eyebrow)
function Eyebrow({ children, theme }) {
  return <div style={{
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 11, letterSpacing: 3, color: theme.fgDim,
    textTransform: 'uppercase', marginBottom: 12,
  }}>{children}</div>;
}

// Big display title
function Display({ children, theme, style }) {
  return <div style={{
    fontFamily: '"IBM Plex Serif", Georgia, serif',
    fontWeight: 400, fontSize: 'clamp(36px, 5vw, 64px)',
    lineHeight: 1.05, letterSpacing: -0.5, color: theme.fg,
    textWrap: 'pretty', ...style,
  }}>{children}</div>;
}

function Rule({ theme, style }) {
  return <div style={{ height: 1, background: theme.rule, ...style }}/>;
}

Object.assign(window, { useInView, RevealText, AltNav, Eyebrow, Display, Rule });
