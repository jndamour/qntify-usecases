import { useEffect, useMemo, useRef, useState } from 'react';

function hexToRgba(hex, a) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function nodeRadius(n) {
  return 4 + Math.sqrt(n.degree) * 3.2;
}

/**
 * GraphCanvas — renders the simulation onto a <canvas>, handles pan/zoom,
 * node hover/drag, and emits selection / hover changes upward.
 *
 * Reads node/link state from the refs supplied by useGraphEngine, so it never
 * causes React re-renders during the physics loop.
 */
export default function GraphCanvas({
  nodesRef,
  linksRef,
  categories,
  activeCats,
  searchQuery,
  selectedId,
  onSelect,
  onFpsUpdate,
  onTransformUpdate,
}) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: '' });
  const categoriesById = useMemo(
    () => new Map(categories.map(c => [c.id, c])),
    [categories]
  );

  // Local interaction state (refs to avoid re-renders during drag)
  const sizeRef = useRef({ width: 0, height: 0 });
  const transformRef = useRef({ x: 0, y: 0, k: 1 });
  const hoveredIdRef = useRef(null);
  const isDraggingRef = useRef(false);
  const draggedNodeRef = useRef(null);
  const dragStartRef = useRef(null);
  const selectedIdRef = useRef(selectedId);

  useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);

  // Allow parent to imperatively reset the view via callback. We expose this
  // by listening for a "center" custom event on the wrapper.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const handler = () => {
      transformRef.current = { x: 0, y: 0, k: 1 };
      onTransformUpdate?.(transformRef.current);
    };
    wrap.addEventListener('nexus:center', handler);
    return () => wrap.removeEventListener('nexus:center', handler);
  }, [onTransformUpdate]);

  // Resize handling
  useEffect(() => {
    const canvas = canvasRef.current;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    function resize() {
      const rect = canvas.getBoundingClientRect();
      sizeRef.current = { width: rect.width, height: rect.height };
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener('resize', resize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Visibility filter (closure captures latest activeCats / searchQuery refs)
  const filterRef = useRef({ activeCats, searchQuery });
  useEffect(() => { filterRef.current = { activeCats, searchQuery }; }, [activeCats, searchQuery]);

  function isNodeVisible(n) {
    const { activeCats, searchQuery } = filterRef.current;
    if (!activeCats.has(n.cat_id)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const cat = categoriesById.get(n.cat_id);
      const name = n.name?.toLowerCase() ?? '';
      const role = n.role?.toLowerCase() ?? '';
      const label = cat?.label?.toLowerCase() ?? '';
      if (!name.includes(q) && !role.includes(q) && !label.includes(q)) return false;
    }
    return true;
  }

  function neighborsOf(id) {
    const set = new Set([id]);
    for (const l of linksRef.current) {
      if (l.source.id === id) set.add(l.target.id);
      if (l.target.id === id) set.add(l.source.id);
    }
    return set;
  }

  function worldToScreen(x, y) {
    const { width, height } = sizeRef.current;
    const t = transformRef.current;
    return { x: x * t.k + t.x + width / 2, y: y * t.k + t.y + height / 2 };
  }
  function screenToWorld(sx, sy) {
    const { width, height } = sizeRef.current;
    const t = transformRef.current;
    return { x: (sx - width / 2 - t.x) / t.k, y: (sy - height / 2 - t.y) / t.k };
  }
  function nodeAt(sx, sy) {
    const nodes = nodesRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      if (!isNodeVisible(n)) continue;
      const p = worldToScreen(n.x, n.y);
      const r = nodeRadius(n);
      const dx = sx - p.x, dy = sy - p.y;
      if (dx * dx + dy * dy <= (r + 3) * (r + 3)) return n;
    }
    return null;
  }

  // Render loop — independent of physics
  useEffect(() => {
    let raf;
    let fpsLast = performance.now(), fpsFrames = 0;
    const ctx = canvasRef.current.getContext('2d');

    function draw() {
      raf = requestAnimationFrame(draw);
      const { width, height } = sizeRef.current;
      const t = transformRef.current;
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2 + t.x, height / 2 + t.y);
      ctx.scale(t.k, t.k);

      const nodes = nodesRef.current;
      const links = linksRef.current;
      const focusId = selectedIdRef.current || hoveredIdRef.current;
      const focusSet = focusId ? neighborsOf(focusId) : null;

      // Links
      for (const l of links) {
        if (!isNodeVisible(l.source) || !isNodeVisible(l.target)) continue;
        const active = focusSet && (focusSet.has(l.source.id) && focusSet.has(l.target.id));
        const dim = focusSet && !active;
        ctx.strokeStyle = active
          ? 'rgba(184,134,11,0.7)'
          : dim
            ? 'rgba(26,24,20,0.04)'
            : 'rgba(26,24,20,0.15)';
        ctx.lineWidth = (active ? 1.6 : 0.9) / t.k;
        ctx.beginPath();
        ctx.moveTo(l.source.x, l.source.y);
        ctx.lineTo(l.target.x, l.target.y);
        ctx.stroke();
      }

      // Nodes
      for (const n of nodes) {
        if (!isNodeVisible(n)) continue;
        const r = nodeRadius(n);
        const isFocus = focusId === n.id;
        const inFocus = focusSet ? focusSet.has(n.id) : true;
        const cat = categoriesById.get(n.cat_id);
        if (!cat) continue;

        if (isFocus) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 8 / t.k, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(cat.color, 0.18);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = inFocus ? cat.color : hexToRgba(cat.color, 0.28);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = inFocus ? hexToRgba(cat.color, 0.85) : 'rgba(26,24,20,0.12)';
        ctx.lineWidth = 1 / t.k;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 0.42, 0, Math.PI * 2);
        ctx.fillStyle = inFocus ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)';
        ctx.fill();

        if (selectedIdRef.current === n.id) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 4 / t.k, 0, Math.PI * 2);
          ctx.strokeStyle = '#1a1814';
          ctx.lineWidth = 1.3 / t.k;
          ctx.stroke();
        }

        const showLabel = isFocus
          || (focusSet && focusSet.has(n.id))
          || (n.degree >= 4 && t.k > 0.8);
        if (showLabel) {
          ctx.font = `${Math.max(11, 12 / t.k * 0.9)}px "Fraunces", Georgia, serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.lineWidth = 3 / t.k;
          ctx.strokeStyle = 'rgba(245,242,234,0.9)';
          ctx.strokeText(n.name, n.x, n.y + r + 4 / t.k);
          ctx.fillStyle = inFocus ? '#1a1814' : 'rgba(26,24,20,0.55)';
          ctx.fillText(n.name, n.x, n.y + r + 4 / t.k);
        }
      }

      ctx.restore();

      fpsFrames++;
      const now = performance.now();
      if (now - fpsLast >= 500) {
        const fps = Math.round((fpsFrames * 1000) / (now - fpsLast));
        fpsLast = now; fpsFrames = 0;
        onFpsUpdate?.(fps);
      }
    }
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [categoriesById, nodesRef, linksRef, onFpsUpdate]);

  // Pointer interactions
  function handleMouseMove(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    if (isDraggingRef.current && draggedNodeRef.current) {
      const w = screenToWorld(sx, sy);
      draggedNodeRef.current.x = w.x;
      draggedNodeRef.current.y = w.y;
      draggedNodeRef.current.vx = 0;
      draggedNodeRef.current.vy = 0;
    } else if (isDraggingRef.current && !draggedNodeRef.current && dragStartRef.current) {
      const t = transformRef.current;
      t.x += sx - dragStartRef.current.x;
      t.y += sy - dragStartRef.current.y;
      dragStartRef.current = { x: sx, y: sy };
      onTransformUpdate?.(t);
    } else {
      const n = nodeAt(sx, sy);
      hoveredIdRef.current = n ? n.id : null;
      if (n) {
        canvas.style.cursor = 'pointer';
        setTooltip({ visible: true, x: sx, y: sy, text: n.name });
      } else {
        canvas.style.cursor = 'grab';
        setTooltip(prev => prev.visible ? { ...prev, visible: false } : prev);
      }
    }
  }
  function handleMouseDown(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    const n = nodeAt(sx, sy);
    isDraggingRef.current = true;
    if (n) {
      draggedNodeRef.current = n;
      n.fixed = true;
    } else {
      dragStartRef.current = { x: sx, y: sy };
    }
  }
  function handleMouseUp(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    if (draggedNodeRef.current) {
      draggedNodeRef.current.fixed = false;
      const n = nodeAt(sx, sy);
      if (n && n.id === draggedNodeRef.current.id) {
        onSelect?.(n.id);
      }
      draggedNodeRef.current = null;
    } else if (isDraggingRef.current && dragStartRef.current) {
      const moved = Math.hypot(sx - dragStartRef.current.x, sy - dragStartRef.current.y) > 3;
      if (!moved) onSelect?.(null);
    }
    isDraggingRef.current = false;
    dragStartRef.current = null;
  }
  function handleWheel(e) {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    const t = transformRef.current;
    const wBefore = screenToWorld(sx, sy);
    const factor = Math.pow(1.0015, -e.deltaY);
    t.k = Math.min(3, Math.max(0.3, t.k * factor));
    const wAfter = screenToWorld(sx, sy);
    t.x += (wAfter.x - wBefore.x) * t.k;
    t.y += (wAfter.y - wBefore.y) * t.k;
    onTransformUpdate?.(t);
  }

  // Wheel needs to be non-passive — attach manually
  useEffect(() => {
    const canvas = canvasRef.current;
    const opts = { passive: false };
    canvas.addEventListener('wheel', handleWheel, opts);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      canvas.removeEventListener('wheel', handleWheel, opts);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="nx-canvas-wrap" ref={wrapRef}>
      <canvas
        ref={canvasRef}
        className="nx-canvas"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
      />
      <div
        className={`nx-tooltip${tooltip.visible ? ' nx-tooltip--visible' : ''}`}
        style={{ left: tooltip.x, top: tooltip.y }}
      >
        {tooltip.text}
      </div>
    </div>
  );
}
