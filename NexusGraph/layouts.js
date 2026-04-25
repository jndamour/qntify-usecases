// Pure layout algorithms. Each function takes (nodes, links) and returns
// either null (force layout = use physics) or a map of { [nodeId]: {x, y} }.
//
// Layouts are deterministic given the same inputs, so they can be recomputed
// any time the data or graph topology changes.

function findRootNode(nodes) {
  let best = nodes[0];
  for (const n of nodes) if (n.degree > best.degree) best = n;
  return best;
}

function buildBFSTree(nodes, links, rootId) {
  const parent = {}, children = {}, depth = {};
  const order = [];
  const visited = new Set();
  const queue = [rootId];
  parent[rootId] = null;
  depth[rootId] = 0;
  visited.add(rootId);
  for (const n of nodes) children[n.id] = [];

  while (queue.length) {
    const id = queue.shift();
    order.push(id);
    for (const l of links) {
      let other = null;
      if (l.source.id === id) other = l.target.id;
      else if (l.target.id === id) other = l.source.id;
      if (other && !visited.has(other)) {
        visited.add(other);
        parent[other] = id;
        children[id].push(other);
        depth[other] = depth[id] + 1;
        queue.push(other);
      }
    }
  }
  // Disconnected nodes attach below the deepest layer
  let maxDepth = 0;
  for (const d of Object.values(depth)) if (d > maxDepth) maxDepth = d;
  for (const n of nodes) {
    if (!visited.has(n.id)) {
      parent[n.id] = rootId;
      depth[n.id] = maxDepth + 1;
      children[rootId].push(n.id);
      order.push(n.id);
      visited.add(n.id);
    }
  }
  return { parent, children, depth, order };
}

export function computeRadial(nodes, links) {
  const root = findRootNode(nodes);
  const tree = buildBFSTree(nodes, links, root.id);
  const byDepth = {};
  for (const n of nodes) {
    const d = tree.depth[n.id] ?? 0;
    if (!byDepth[d]) byDepth[d] = [];
    byDepth[d].push(n.id);
  }
  const targets = {};
  const ringStep = 130;
  const depths = Object.keys(byDepth).map(Number).sort((a, b) => a - b);
  for (const d of depths) {
    const ids = byDepth[d];
    if (d === 0) {
      targets[ids[0]] = { x: 0, y: 0 };
    } else {
      const radius = d * ringStep;
      ids.forEach((id, i) => {
        const angle = (i / ids.length) * Math.PI * 2 - Math.PI / 2;
        targets[id] = { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
      });
    }
  }
  return targets;
}

export function computeTree(nodes, links) {
  const root = findRootNode(nodes);
  const tree = buildBFSTree(nodes, links, root.id);
  const xPos = {};
  let leafCounter = 0;
  const xSpacing = 90;

  function assign(id) {
    const kids = tree.children[id];
    if (kids.length === 0) {
      xPos[id] = leafCounter * xSpacing;
      leafCounter++;
    } else {
      kids.forEach(assign);
      const first = xPos[kids[0]];
      const last = xPos[kids[kids.length - 1]];
      xPos[id] = (first + last) / 2;
    }
  }
  assign(root.id);

  let minX = Infinity, maxX = -Infinity;
  for (const x of Object.values(xPos)) { if (x < minX) minX = x; if (x > maxX) maxX = x; }
  const cx = (minX + maxX) / 2;

  const ySpacing = 110;
  let maxDepth = 0;
  for (const d of Object.values(tree.depth)) if (d > maxDepth) maxDepth = d;
  const cy = (maxDepth * ySpacing) / 2;

  const targets = {};
  for (const n of nodes) {
    targets[n.id] = {
      x: (xPos[n.id] ?? 0) - cx,
      y: (tree.depth[n.id] ?? 0) * ySpacing - cy,
    };
  }
  return targets;
}

export function computeBalloon(nodes, links) {
  const root = findRootNode(nodes);
  const tree = buildBFSTree(nodes, links, root.id);
  const subtreeSize = {};

  function countDesc(id) {
    let total = 1;
    for (const c of tree.children[id]) total += countDesc(c);
    subtreeSize[id] = total;
    return total;
  }
  countDesc(root.id);

  const targets = {};
  function place(id, cx, cy, parentAngle, allowedAngle) {
    targets[id] = { x: cx, y: cy };
    const kids = tree.children[id];
    if (kids.length === 0) return;
    const totalKidWeight = kids.reduce((s, k) => s + Math.sqrt(subtreeSize[k]), 0);
    const baseRadius = 60 + Math.sqrt(subtreeSize[id]) * 22;
    let angleCursor = parentAngle - allowedAngle / 2;
    for (const k of kids) {
      const kidWeight = Math.sqrt(subtreeSize[k]);
      const kidAngleSpan = (kidWeight / totalKidWeight) * allowedAngle;
      const kidAngle = angleCursor + kidAngleSpan / 2;
      const kx = cx + Math.cos(kidAngle) * baseRadius;
      const ky = cy + Math.sin(kidAngle) * baseRadius;
      const childCone = Math.min(Math.PI * 1.5, kidAngleSpan * 2.5 + 0.5);
      place(k, kx, ky, kidAngle, childCone);
      angleCursor += kidAngleSpan;
    }
  }
  place(root.id, 0, 0, 0, Math.PI * 2);
  return targets;
}

export function computeHierarchical(nodes, links, categories) {
  // Order rows by category. Use the order keys appear in `categories`.
  const catOrder = Object.keys(categories);
  const byCat = {};
  for (const c of catOrder) byCat[c] = [];
  for (const n of nodes) {
    if (byCat[n.cat]) byCat[n.cat].push(n);
    else { byCat[n.cat] = [n]; }
  }
  for (const row of Object.values(byCat)) row.sort((a, b) => b.degree - a.degree);

  const xSpacing = 95;
  const ySpacing = 130;
  const totalRows = catOrder.length;
  const targets = {};
  catOrder.forEach((cat, rowIdx) => {
    const row = byCat[cat] || [];
    const rowWidth = (row.length - 1) * xSpacing;
    row.forEach((n, i) => {
      targets[n.id] = {
        x: i * xSpacing - rowWidth / 2,
        y: rowIdx * ySpacing - ((totalRows - 1) * ySpacing) / 2,
      };
    });
  });
  return targets;
}

// Dispatch — returns null for "force" (handled by physics), otherwise a target map.
export function computeLayout(name, nodes, links, categories) {
  if (name === 'force') return null;
  if (name === 'radial') return computeRadial(nodes, links);
  if (name === 'tree') return computeTree(nodes, links);
  if (name === 'balloon') return computeBalloon(nodes, links);
  if (name === 'hierarchical') return computeHierarchical(nodes, links, categories);
  return null;
}

export const LAYOUT_OPTIONS = [
  { id: 'force',        label: 'Force-directed', key: '1' },
  { id: 'radial',       label: 'Radial',         key: '2' },
  { id: 'tree',         label: 'Tree',           key: '3' },
  { id: 'balloon',      label: 'Balloon',        key: '4' },
  { id: 'hierarchical', label: 'Hierarchical',   key: '5' },
];
