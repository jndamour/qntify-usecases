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



// Size constraints for node boxes
const NODE_MIN_W = 120;
const NODE_MAX_W = 240;
const NODE_MIN_H = 46;
const NODE_MAX_H = 160;
const NODE_PAD_X = 14;   // horizontal inner padding
const NODE_PAD_Y = 10;   // vertical inner padding
const LABEL_FS = 12;     // label font size
const SUB_FS = 9;        // sub font size
const SUB_LINE_H = 12;   // line-height for wrapped sub text
const LABEL_SUB_GAP = 6; // gap between label and sub block

// Rough per-character widths (in px) for the fonts/sizes used below.
// SVG can't measure text synchronously without a DOM pass, so we approximate.
const LABEL_CHAR_W = LABEL_FS * 0.58;         // Inter 600 @ 12px
const SUB_CHAR_W = SUB_FS * 0.62 + 0.5;       // JetBrains Mono @ 9px + letterSpacing 0.5

// Greedy word-wrap that breaks `text` into lines fitting within `maxWidth` px,
// using `charW` as the average glyph advance. Falls back to hard-breaking
// any single token that is itself wider than maxWidth.
function wrapText(text, maxWidth, charW) {
  if (!text) return [''];
  const maxChars = Math.max(1, Math.floor(maxWidth / charW));
  const words = String(text).split(/\s+/);
  const lines = [];
  let current = '';
  for (const word of words) {
    if (word.length > maxChars) {
      // Flush current, then hard-break the oversized word
      if (current) { lines.push(current); current = ''; }
      for (let i = 0; i < word.length; i += maxChars) {
        const chunk = word.slice(i, i + maxChars);
        if (i + maxChars >= word.length) current = chunk;
        else lines.push(chunk);
      }
      continue;
    }
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [''];
}

function NodeShape({ x, y, node, theme }) {
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

  // Step 1: measure natural widths, clamped to [MIN, MAX].
  const labelNaturalW = (node.label?.length || 0) * LABEL_CHAR_W + NODE_PAD_X * 2;
  const subNaturalW = (node.sub?.length || 0) * SUB_CHAR_W + NODE_PAD_X * 2;
  const unwrappedW = Math.max(labelNaturalW, subNaturalW);
  const w = Math.min(NODE_MAX_W, Math.max(NODE_MIN_W, unwrappedW));

  // Step 2: wrap sub text against the resulting inner width.
  const innerW = w - NODE_PAD_X * 2;
  const subLines = wrapText(node.sub, innerW, SUB_CHAR_W);

  // Step 3: compute height from label + gap + sub lines + padding, clamped.
  const contentH = LABEL_FS + LABEL_SUB_GAP + subLines.length * SUB_LINE_H;
  const h = Math.min(NODE_MAX_H, Math.max(NODE_MIN_H, contentH + NODE_PAD_Y * 2));

  // Vertical layout: center the (label + gap + sub block) stack in the box.
  const stackH = LABEL_FS + LABEL_SUB_GAP + subLines.length * SUB_LINE_H;
  const stackTop = y - stackH / 2;
  const labelY = stackTop + LABEL_FS - 2; // baseline for label
  const subStartY = stackTop + LABEL_FS + LABEL_SUB_GAP + SUB_FS - 1; // baseline for first sub line

  const isInverted = node.kind === 'origin' || node.kind === 'obligor' || node.kind === 'asset';

  return (
    <g>
      <rect x={x - w/2} y={y - h/2} width={w} height={h}
        fill={kindFill}
        stroke={theme.rule}
        strokeWidth="1"
      />
      <text x={x} y={labelY} textAnchor="middle"
        fontFamily="Inter, sans-serif" fontSize={LABEL_FS} fontWeight="600"
        fill={kindText}>
        {node.label}
      </text>
      <text x={x} y={subStartY} textAnchor="middle"
        fontFamily="JetBrains Mono, monospace" fontSize={SUB_FS}
        fill={subText}
        opacity={isInverted ? 0.75 : 1}
        letterSpacing="0.5">
        {subLines.map((line, i) => (
          <tspan key={i} x={x} dy={i === 0 ? 0 : SUB_LINE_H}>{line}</tspan>
        ))}
      </text>
    </g>
  );
}


function FixedNodeShape({ x, y, node, theme }) {
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
