// example-usage.jsx — drop this into your app to verify the component works.
// Delete or move into your own routes once you've confirmed it renders.

import NexusGraph from './NexusGraph';

export default function ExamplePage() {
  return (
    <main>
      {/* Option 1: Full-screen, all chrome shown (default) */}
      <NexusGraph />

      {/*
      // Option 2: Embedded as a section with a fixed height
      <section style={{ height: '720px' }}>
        <NexusGraph showHeader={false} showFooter={false} />
      </section>

      // Option 3: With your own data
      <NexusGraph
        people={myPeople}
        edges={myEdges}
        categories={myCategories}
        title={<>My <em>custom</em> graph</>}
        subtitle="Tap nodes to explore"
      />
      */}
    </main>
  );
}
