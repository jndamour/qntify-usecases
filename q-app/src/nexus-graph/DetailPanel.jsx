import { useMemo } from 'react';

export default function DetailPanel({
  selectedNode,
  categories,
  links,
  onSelect,
}) {
  const neighbors = useMemo(() => {
    if (!selectedNode) return [];
    const out = [];
    for (const l of links) {
      if (l.source.id === selectedNode.id) out.push({ node: l.target, rel: l.rel });
      else if (l.target.id === selectedNode.id) out.push({ node: l.source, rel: l.rel });
    }
    return out;
  }, [selectedNode, links]);

  if (!selectedNode) {
    return (
      <aside className="nx-detail">
        <div className="nx-detail-empty">
          <div className="nx-detail-empty-big">Ø</div>
          No node selected.<br />
          Hover over the web to see names. Click to dive deeper into any figure's connections and biography.
        </div>
      </aside>
    );
  }

  const cat = categories[selectedNode.cat];

  return (
    <aside className="nx-detail">
      <div className="nx-person">
        <div className="nx-person-cat" style={{ color: cat?.color }}>
          {cat?.label}
        </div>
        <h2 className="nx-person-name">{selectedNode.name}</h2>
        <div className="nx-person-role">{selectedNode.role}</div>

        <div>
          <div className="nx-section-label">Connections · {neighbors.length}</div>
          <div className="nx-connections">
            {neighbors.map(({ node, rel }) => (
              <div
                key={node.id}
                className="nx-connection"
                onClick={() => onSelect(node.id)}
              >
                <div className="nx-c-name">{node.name}</div>
                <div className="nx-c-rel">{rel}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="nx-person-bio">{selectedNode.bio}</div>
      </div>
    </aside>
  );
}
