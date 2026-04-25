// Barrel export: most consumers only need the default component.
export { default } from './NexusGraph';
export { default as NexusGraph } from './NexusGraph';

// Advanced consumers can swap in their own data, layouts, or sub-components.
export { DEFAULT_CATEGORIES, DEFAULT_PEOPLE, DEFAULT_EDGES } from './data';
export { computeLayout, LAYOUT_OPTIONS } from './layouts';
export { useGraphEngine } from './useGraphEngine';
export { default as GraphCanvas } from './GraphCanvas';
export { default as Sidebar } from './Sidebar';
export { default as DetailPanel } from './DetailPanel';
export { default as LayoutSelector } from './LayoutSelector';
