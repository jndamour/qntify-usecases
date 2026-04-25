import { useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_CATEGORIES, DEFAULT_PEOPLE, DEFAULT_EDGES } from './data';
import { useGraphEngine } from './useGraphEngine';
import GraphCanvas from './GraphCanvas';
import Sidebar from './Sidebar';
import DetailPanel from './DetailPanel';
import LayoutSelector from './LayoutSelector';
import './styles.css';

/**
 * <NexusGraph />
 *
 * A self-contained interactive network graph section. Drop into any page:
 *
 *   import NexusGraph from './NexusGraph';
 *   <NexusGraph />
 *
 * Or with custom data:
 *
 *   <NexusGraph
 *     people={myPeople}
 *     edges={myEdges}
 *     categories={myCategories}
 *     title="My Network"
 *     subtitle="Some context"
 *     showHeader={true}
 *   />
 *
 * Sizing: the component fills its parent. By default it uses 100vh; override
 * with the `style` prop, e.g. style={{ height: '720px' }}.
 *
 * Props:
 *   - people:      array of { id, name, cat, role, bio }
 *   - edges:       array of [sourceId, targetId, relationshipLabel]
 *   - categories:  object { [catId]: { label, color } }
 *   - title:       optional canvas headline (JSX or string)
 *   - subtitle:    optional canvas subhead text
 *   - showHeader:  boolean — render the top brand/meta bar (default true)
 *   - showFooter:  boolean — render the bottom strip (default true)
 *   - className:   extra class on the root element
 *   - style:       inline style on the root element
 */
export default function NexusGraph({
  people = DEFAULT_PEOPLE,
  edges = DEFAULT_EDGES,
  categories = DEFAULT_CATEGORIES,
  title,
  subtitle = 'Click any node to inspect · drag to reposition · scroll to zoom',
  showHeader = true,
  showFooter = true,
  className = '',
  style,
}) {
  const {
    nodesRef,
    linksRef,
    nodeByIdRef,
    layout,
    paused,
    applyLayout,
    setPaused,
    reheat,
  } = useGraphEngine({ people, edges, categories });

  const [activeCats, setActiveCats] = useState(() => new Set(Object.keys(categories)));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [fps, setFps] = useState(0);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });

  // Reset active cats when categories prop changes
  useEffect(() => {
    setActiveCats(new Set(Object.keys(categories)));
  }, [categories]);

  // Use a ref so canvas wrapper can receive imperative center commands
  const canvasShellRef = useRef(null);

  function toggleCat(key) {
    setActiveCats(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function handleCenter() {
    // Dispatch custom event for the canvas to reset its transform
    canvasShellRef.current?.querySelector('.nx-canvas-wrap')?.dispatchEvent(
      new CustomEvent('nexus:center')
    );
    setTransform({ x: 0, y: 0, k: 1 });
  }

  function handleLayoutChange(name) {
    applyLayout(name);
    handleCenter();
  }

  const selectedNode = selectedId ? nodeByIdRef.current[selectedId] : null;
  const defaultTitle = (
    <>Who <em>knows</em> whom, and how does it <em>matter</em>?</>
  );

  return (
    <div
      className={[
        'nexus-graph',
        showHeader ? '' : 'nx-no-header',
        showFooter ? '' : 'nx-no-footer',
        className,
      ].filter(Boolean).join(' ')}
      style={style}
      ref={canvasShellRef}
    >
      {showHeader && (
        <header className="nx-header">
          <div className="nx-brand">
            <div className="nx-brand-mark">Nex<span>u</span>s</div>
            <div className="nx-brand-tag">Atlas of Public Figures · v0.4</div>
          </div>
          <div className="nx-header-meta">
            <div><span className="nx-dot" />Live Simulation</div>
            <div>{fps} FPS</div>
            <div>Last indexed · 24.IV.2026</div>
          </div>
        </header>
      )}

      <Sidebar
        categories={categories}
        nodes={nodesRef.current}
        links={linksRef.current}
        activeCats={activeCats}
        onToggleCat={toggleCat}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="nx-canvas-area">
        <GraphCanvas
          nodesRef={nodesRef}
          linksRef={linksRef}
          categories={categories}
          activeCats={activeCats}
          searchQuery={searchQuery}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onFpsUpdate={setFps}
          onTransformUpdate={(t) => setTransform({ x: t.x, y: t.y, k: t.k })}
        />

        <div className="nx-canvas-overlay">
          <h1 className="nx-canvas-title">{title ?? defaultTitle}</h1>
          <div className="nx-canvas-sub">{subtitle}</div>
        </div>

        <LayoutSelector value={layout} onChange={handleLayoutChange} />

        <div className="nx-compass">
          <div>Zoom · <span className="nx-coord">{transform.k.toFixed(2)}×</span></div>
          <div>Origin · <span className="nx-coord">
            {Math.round(-transform.x)}, {Math.round(-transform.y)}
          </span></div>
        </div>

        <div className="nx-canvas-controls">
          <button onClick={reheat}>Reheat</button>
          <button onClick={handleCenter}>Center</button>
          <button onClick={() => setPaused(p => !p)}>
            {paused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>

      <DetailPanel
        selectedNode={selectedNode}
        categories={categories}
        links={linksRef.current}
        onSelect={setSelectedId}
      />

      {showFooter && (
        <footer className="nx-footer">
          <div>Nexus Research · An open map of human associations</div>
          <div className="nx-footer-pager">
            <div>Dataset: <span>Public · Demo</span></div>
            <div>Rendering: <span>HTML5 Canvas</span></div>
            <div>Physics: <span>Barnes-Hut-lite</span></div>
          </div>
        </footer>
      )}
    </div>
  );
}
