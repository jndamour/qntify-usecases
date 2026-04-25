import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { computeLayout } from './layouts';

/**
 * useGraphEngine — owns the simulation state (node positions, velocities,
 * layout targets) and runs a requestAnimationFrame loop that mutates them
 * in place. The hook returns refs and imperative commands; rendering is
 * handled by GraphCanvas which reads the same refs each frame.
 *
 * Mutating refs (vs. setState) is intentional: the physics loop runs at 60fps
 * and we don't want to trigger React re-renders for every node movement.
 */
export function useGraphEngine({ people, edges, categories }) {
  // Build immutable graph structure (nodes + links) once per data change
  const graph = useMemo(() => {
    const nodeById = {};
    const nodes = people.map((p, i) => {
      const angle = (i / people.length) * Math.PI * 2;
      const r = 180 + Math.random() * 60;
      const n = {
        ...p,
        x: Math.cos(angle) * r + (Math.random() - 0.5) * 40,
        y: Math.sin(angle) * r + (Math.random() - 0.5) * 40,
        vx: 0, vy: 0,
        degree: 0,
        fixed: false,
      };
      nodeById[p.id] = n;
      return n;
    });

    const links = [];
    for (const [a, b, rel] of edges) {
      if (nodeById[a] && nodeById[b]) {
        links.push({ source: nodeById[a], target: nodeById[b], rel });
        nodeById[a].degree++;
        nodeById[b].degree++;
      }
    }
    return { nodes, links, nodeById };
  }, [people, edges]);

  // Refs that the canvas reads on every frame
  const nodesRef = useRef(graph.nodes);
  const linksRef = useRef(graph.links);
  const nodeByIdRef = useRef(graph.nodeById);

  useEffect(() => {
    nodesRef.current = graph.nodes;
    linksRef.current = graph.links;
    nodeByIdRef.current = graph.nodeById;
  }, [graph]);

  // Layout & simulation state
  const [layout, setLayoutState] = useState('force');
  const layoutRef = useRef('force');
  const targetsRef = useRef(null);
  const pausedRef = useRef(false);
  const [paused, setPausedState] = useState(false);

  const applyLayout = useCallback((name) => {
    layoutRef.current = name;
    targetsRef.current = computeLayout(name, nodesRef.current, linksRef.current, categories);
    // Reset velocities for clean transition
    for (const n of nodesRef.current) { n.vx = 0; n.vy = 0; }
    setLayoutState(name);
  }, [categories]);

  const setPaused = useCallback((next) => {
    const v = typeof next === 'function' ? next(pausedRef.current) : next;
    pausedRef.current = v;
    setPausedState(v);
  }, []);

  const reheat = useCallback(() => {
    if (layoutRef.current === 'force') {
      for (const n of nodesRef.current) {
        n.vx += (Math.random() - 0.5) * 30;
        n.vy += (Math.random() - 0.5) * 30;
      }
    } else {
      // Scatter nodes; they'll re-converge to layout targets
      for (const n of nodesRef.current) {
        n.x += (Math.random() - 0.5) * 200;
        n.y += (Math.random() - 0.5) * 200;
      }
    }
  }, []);

  // Physics loop
  useEffect(() => {
    let raf;
    function step() {
      raf = requestAnimationFrame(step);
      if (pausedRef.current) return;

      const nodes = nodesRef.current;
      const links = linksRef.current;

      if (layoutRef.current === 'force') {
        const repulsion = 1200;
        const linkDist = 90;
        const linkStrength = 0.04;
        const centerPull = 0.003;
        const damping = 0.82;

        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          if (a.fixed) continue;
          for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            let d2 = dx * dx + dy * dy;
            if (d2 < 0.01) d2 = 0.01;
            const d = Math.sqrt(d2);
            const force = repulsion / d2;
            const fx = (dx / d) * force;
            const fy = (dy / d) * force;
            a.vx -= fx; a.vy -= fy;
            if (!b.fixed) { b.vx += fx; b.vy += fy; }
          }
        }

        for (const l of links) {
          const dx = l.target.x - l.source.x;
          const dy = l.target.y - l.source.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
          const diff = (d - linkDist) * linkStrength;
          const fx = (dx / d) * diff;
          const fy = (dy / d) * diff;
          if (!l.source.fixed) { l.source.vx += fx; l.source.vy += fy; }
          if (!l.target.fixed) { l.target.vx -= fx; l.target.vy -= fy; }
        }

        for (const n of nodes) {
          if (n.fixed) continue;
          n.vx += -n.x * centerPull;
          n.vy += -n.y * centerPull;
          n.vx *= damping;
          n.vy *= damping;
          n.x += n.vx;
          n.y += n.vy;
        }
      } else if (targetsRef.current) {
        const ease = 0.08;
        const targets = targetsRef.current;
        for (const n of nodes) {
          if (n.fixed) continue;
          const t = targets[n.id];
          if (!t) continue;
          n.x += (t.x - n.x) * ease;
          n.y += (t.y - n.y) * ease;
        }
      }
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  // If the data changes, recompute targets for the current layout
  useEffect(() => {
    if (layoutRef.current !== 'force') {
      targetsRef.current = computeLayout(layoutRef.current, nodesRef.current, linksRef.current, categories);
    }
  }, [graph, categories]);

  return {
    nodesRef,
    linksRef,
    nodeByIdRef,
    layout,
    paused,
    applyLayout,
    setPaused,
    reheat,
  };
}
