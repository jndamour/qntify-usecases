import { useEffect, useRef, useState } from 'react'

export function useInView(ref, opts = { threshold: 0.25 }) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect() }
    }, opts)
    io.observe(ref.current)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return inView
}

export function RevealText({ children, as: Tag = 'div', style, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  return (
    <Tag ref={ref} style={{
      ...style,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(12px)',
      transition: `opacity 0.9s ${delay}s ease, transform 0.9s ${delay}s ease`,
    }}>{children}</Tag>
  )
}

export function Eyebrow({ children, theme }) {
  return <div style={{
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 11, letterSpacing: 3, color: theme.fgDim,
    textTransform: 'uppercase', marginBottom: 12,
  }}>{children}</div>
}

export function Display({ children, theme, style }) {
  return <div style={{
    fontFamily: '"IBM Plex Serif", Georgia, serif',
    fontWeight: 400, fontSize: 'clamp(36px, 5vw, 64px)',
    lineHeight: 1.05, letterSpacing: -0.5, color: theme.fg,
    textWrap: 'pretty', ...style,
  }}>{children}</div>
}

export function Rule({ theme, style }) {
  return <div style={{ height: 1, background: theme.rule, ...style }} />
}
