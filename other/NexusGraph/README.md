# NexusGraph

A self-contained interactive network graph component. Drop into any React page as a section.

## Files

```
NexusGraph/
├── index.js              ← barrel export
├── NexusGraph.jsx        ← main component (compose this)
├── GraphCanvas.jsx       ← canvas renderer + pointer interactions
├── Sidebar.jsx           ← left filters/search panel
├── DetailPanel.jsx       ← right node-detail panel
├── LayoutSelector.jsx    ← collapsible layout dropdown
├── useGraphEngine.js     ← physics + layout hook
├── layouts.js            ← pure layout algorithms
├── data.js               ← default demo dataset
└── styles.css            ← scoped under .nexus-graph
```

## Requirements

- React ≥ 17 (uses hooks; no other runtime deps)
- A bundler that handles `.jsx` and `import './styles.css'` (Vite, Next.js, CRA, etc.)
- Network access for the Google Fonts import in `styles.css` (or self-host Fraunces + JetBrains Mono and edit the `@import`)

No third-party libraries — physics, layouts, and rendering are all written from scratch in ~600 lines.

## Basic usage

```jsx
import NexusGraph from './NexusGraph';

export default function MyPage() {
  return (
    <section style={{ height: '100vh' }}>
      <NexusGraph />
    </section>
  );
}
```

## Custom data

```jsx
import NexusGraph from './NexusGraph';

const categories = {
  founders: { label: 'Founders', color: '#2c6fb8' },
  investors: { label: 'Investors', color: '#b8860b' },
};

const people = [
  { id: 'a', name: 'Ada Founder', cat: 'founders', role: 'CEO, Acme', bio: '…' },
  { id: 'b', name: 'Bob Investor', cat: 'investors', role: 'Partner, Capital', bio: '…' },
];

const edges = [
  ['a', 'b', 'Series A lead'],
];

<NexusGraph
  people={people}
  edges={edges}
  categories={categories}
  title={<>Our <em>cap table</em>, mapped</>}
  subtitle="Click any node to inspect"
/>
```

## Embedding as a page section (not full-screen)

The component fills its parent. Pass a height via `style` and hide the chrome:

```jsx
<NexusGraph
  showHeader={false}
  showFooter={false}
  style={{ height: '720px', borderRadius: '12px' }}
/>
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `people` | `Array<Person>` | demo data | `{ id, name, cat, role, bio }` |
| `edges` | `Array<[id, id, label]>` | demo data | source id, target id, relationship label |
| `categories` | `{ [id]: { label, color } }` | demo data | order of keys controls hierarchical layout row order |
| `title` | `ReactNode` | "Who *knows* whom…" | top-left headline |
| `subtitle` | `string` | usage hint | small text below title |
| `showHeader` | `boolean` | `true` | brand bar at top |
| `showFooter` | `boolean` | `true` | metadata strip at bottom |
| `className` | `string` | `''` | extra class on root |
| `style` | `CSSProperties` | — | inline style on root |

## Keyboard shortcuts

- `1` Force-directed
- `2` Radial
- `3` Tree
- `4` Balloon
- `5` Hierarchical

## Styling notes

All CSS is scoped under `.nexus-graph` and uses CSS variables prefixed with `--nx-`. Override the palette by setting these on a wrapper or in your own stylesheet:

```css
.nexus-graph {
  --nx-bg: #fff;
  --nx-accent: #ff5f4a;
  /* etc. */
}
```

The component sets `isolation: isolate` so its `z-index` stack won't conflict with the rest of your page.

## Advanced: composing the parts yourself

If you want to use just the engine (e.g. with your own UI), import `useGraphEngine` and `GraphCanvas` directly:

```jsx
import { useGraphEngine, GraphCanvas } from './NexusGraph';

function MyCustomGraph() {
  const engine = useGraphEngine({ people, edges, categories });
  return <GraphCanvas {...engine} categories={categories} activeCats={...} />;
}
```

You can also import `computeLayout` from `./layouts` to compute target positions yourself for things like animations or PDF export.
