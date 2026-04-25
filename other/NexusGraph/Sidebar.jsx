import { useMemo } from 'react';

export default function Sidebar({
  categories,
  nodes,
  links,
  activeCats,
  onToggleCat,
  searchQuery,
  onSearchChange,
}) {
  const counts = useMemo(() => {
    const c = {};
    for (const n of nodes) c[n.cat] = (c[n.cat] || 0) + 1;
    return c;
  }, [nodes]);

  const density = useMemo(() => {
    const max = nodes.length * (nodes.length - 1) / 2;
    return max ? ((links.length / max) * 100).toFixed(1) : '0.0';
  }, [nodes.length, links.length]);

  return (
    <aside className="nx-sidebar">
      <div>
        <div className="nx-section-label">Search the Atlas</div>
        <div className="nx-search">
          <input
            type="text"
            placeholder="by name, field, era…"
            autoComplete="off"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div>
        <div className="nx-section-label">Domains</div>
        <div className="nx-filters">
          {Object.entries(categories).map(([key, cat]) => {
            const off = !activeCats.has(key);
            return (
              <div
                key={key}
                className={`nx-filter${off ? ' nx-filter--off' : ''}`}
                onClick={() => onToggleCat(key)}
              >
                <div className="nx-filter-left">
                  <div className="nx-filter-swatch" style={{ background: cat.color }} />
                  <div>{cat.label}</div>
                </div>
                <div className="nx-filter-count">
                  {String(counts[key] || 0).padStart(2, '0')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="nx-section-label">Figures</div>
        <div className="nx-stat-grid">
          <div className="nx-stat">
            <div className="nx-stat-value">{nodes.length}</div>
            <div className="nx-stat-label">Nodes</div>
          </div>
          <div className="nx-stat">
            <div className="nx-stat-value">{links.length}</div>
            <div className="nx-stat-label">Edges</div>
          </div>
          <div className="nx-stat">
            <div className="nx-stat-value">{Object.keys(categories).length}</div>
            <div className="nx-stat-label">Domains</div>
          </div>
          <div className="nx-stat">
            <div className="nx-stat-value">{density}%</div>
            <div className="nx-stat-label">Density</div>
          </div>
        </div>
      </div>

      <div>
        <div className="nx-section-label">Legend</div>
        <div className="nx-legend-note">
          Each node is a public figure. Edges represent documented associations — mentorships, rivalries, collaborations, public disputes. Node size scales with centrality in the network.
        </div>
      </div>
    </aside>
  );
}
