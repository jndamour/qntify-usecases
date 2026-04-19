// Relationship graph — claimant/counsel/forum/obligor/assets
// Edges trace in sequentially when the section scrolls into view.

function RelationshipGraph({ theme }) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.3 });
  const { relationshipNodes: nodes, relationshipEdges: edges } = window.ALT_DATA;

  const W = 1200, H = 600;
  const pad = { x: 80, y: 60 };
  const pos = (n) => ({
    x: pad.x + n.x * (W - pad.x * 2),
    y: pad.y + n.y * (H - pad.y * 2),
  });

  const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));

  // Stage edges in order they appear in the array, over 2.4s total
  const edgeDelay = (i) => 0.4 + i * 0.12;

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={theme.accent}/>
          </marker>
        </defs>

        {/* Column labels */}
        {[
          ['Principal', pos({ x: 0.08, y: 0 }).x, 34],
          ['Counsel', pos({ x: 0.26, y: 0 }).x, 34],
          ['Forum', pos({ x: 0.48, y: 0 }).x, 34],
          ['Obligor', pos({ x: 0.70, y: 0 }).x, 34],
          ['Recoverable Assets', pos({ x: 0.90, y: 0 }).x, 34],
        ].map(([t, x, y], i) => (
          <text key={i} x={x} y={y} textAnchor="middle"
            fontFamily="JetBrains Mono, monospace" fontSize="10" fill={theme.fgDim}
            letterSpacing="2">
            {t.toUpperCase()}
          </text>
        ))}

        {/* Edges */}
        {edges.map(([aId, bId], i) => {
          const a = pos(nodeById[aId]), b = pos(nodeById[bId]);
          const mx = (a.x + b.x) / 2;
          const d = `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
          return (
            <path key={i} d={d}
              fill="none"
              stroke={theme.edge}
              strokeWidth="1"
              strokeDasharray="600"
              strokeDashoffset={inView ? 0 : 600}
              style={{
                transition: `stroke-dashoffset 1.2s ${edgeDelay(i)}s cubic-bezier(0.4, 0, 0.2, 1)`,
              }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((n, i) => {
          const p = pos(n);
          const delay = 0.2 + i * 0.06;
          return (
            <g key={n.id} style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(8px)',
              transition: `opacity 0.6s ${delay}s ease, transform 0.6s ${delay}s ease`,
              transformBox: 'fill-box', transformOrigin: 'center',
            }}>
              <NodeShape x={p.x} y={p.y} node={n} theme={theme}/>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function NodeShape({ x, y, node, theme }) {
  const w = 150, h = 46;
  const kindFill = {
    origin: theme.nodePrimary,
    counsel: theme.nodeNeutral,
    forum: theme.nodeNeutral,
    obligor: theme.nodePrimary,
    asset: theme.nodeAccent,
  }[node.kind];
  const kindText = (node.kind === 'asset' || node.kind === 'origin' || node.kind === 'obligor')
    ? theme.bg
    : theme.fg;
  const subText = (node.kind === 'asset' || node.kind === 'origin' || node.kind === 'obligor')
    ? theme.bg
    : theme.fgDim;
  return (
    <g>
      <rect x={x - w/2} y={y - h/2} width={w} height={h}
        fill={kindFill}
        stroke={theme.rule}
        strokeWidth="1"
      />
      <text x={x} y={y - 4} textAnchor="middle"
        fontFamily="Inter, sans-serif" fontSize="12" fontWeight="600"
        fill={kindText}>
        {node.label}
      </text>
      <text x={x} y={y + 12} textAnchor="middle"
        fontFamily="JetBrains Mono, monospace" fontSize="9"
        fill={subText}
        opacity={(node.kind === 'origin' || node.kind === 'obligor' || node.kind === 'asset') ? 0.75 : 1}
        letterSpacing="0.5">
        {node.sub}
      </text>
    </g>
  );
}

// ─── Lifecycle flowchart ──────────────────────────────────────────────────
function LifecycleFlow({ theme }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const stages = window.ALT_DATA.lifecycle;
  return (
    <div ref={ref} style={{
      display: 'grid', gridTemplateColumns: `repeat(${stages.length}, 1fr)`,
      gap: 0, alignItems: 'stretch',
      borderTop: `1px solid ${theme.rule}`,
      borderBottom: `1px solid ${theme.rule}`,
    }}>
      {stages.map((s, i) => (
        <div key={s.n} style={{
          padding: '28px 24px',
          borderLeft: i > 0 ? `1px solid ${theme.rule}` : 'none',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(12px)',
          transition: `opacity 0.7s ${0.15 * i}s ease, transform 0.7s ${0.15 * i}s ease`,
          position: 'relative',
        }}>
          {/* connector line */}
          {i > 0 && (
            <div style={{
              position: 'absolute', left: -1, top: 44, width: 9, height: 1,
              background: theme.accent, transform: 'translateX(-4px)',
            }}/>
          )}
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11, color: theme.accent, letterSpacing: 2,
            marginBottom: 12,
          }}>{s.n}</div>
          <div style={{
            fontFamily: '"IBM Plex Serif", Georgia, serif',
            fontSize: 20, color: theme.fg, marginBottom: 8,
            letterSpacing: -0.2,
          }}>{s.title}</div>
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 13, lineHeight: 1.55, color: theme.fgDim2,
          }}>{s.body}</div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { RelationshipGraph, LifecycleFlow });
