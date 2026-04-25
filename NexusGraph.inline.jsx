// NexusGraph.inline.jsx
// =====================
// Single-file build for environments without a bundler (e.g. Babel Standalone
// with <script type="text/babel">). No `import` / `require` statements.
//
// Assumes React and ReactDOM are loaded as globals via <script> tags BEFORE
// this file. CSS is injected at runtime so you don't need a separate stylesheet.
//
// Usage in your HTML:
//   <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
//   <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
//   <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
//   <script type="text/babel" data-presets="react" src="NexusGraph.inline.jsx"></script>
//   <script type="text/babel" data-presets="react" src="EmApp.jsx"></script>
//
// In your EmApp.jsx (also Babel Standalone), just use the global:
//   const App = () => <NexusGraph />;
//   ReactDOM.createRoot(document.getElementById('root')).render(<App />);

(function () {
  const { useEffect, useMemo, useRef, useState, useCallback } = React;

  /* =====================================================================
   * STYLES — injected once into <head>
   * ===================================================================== */
  const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,400&family=JetBrains+Mono:wght@300;400;500&display=swap');

.nexus-graph {
  --nx-bg: #f5f2ea;
  --nx-bg-panel: #ffffff;
  --nx-ink: #1a1814;
  --nx-ink-dim: #6e6a60;
  --nx-ink-dimmer: #b5afa0;
  --nx-line: #e4dfd2;
  --nx-line-strong: #c9c2b1;
  --nx-accent: #b8860b;
  --nx-serif: "Fraunces", Georgia, "Times New Roman", serif;
  --nx-mono: "JetBrains Mono", ui-monospace, monospace;

  position: relative;
  display: grid;
  grid-template-columns: 320px 1fr 340px;
  grid-template-rows: 64px 1fr 48px;
  grid-template-areas:
    "header header header"
    "sidebar canvas detail"
    "footer footer footer";
  height: 100vh;
  width: 100%;
  background: var(--nx-bg);
  color: var(--nx-ink);
  font-family: var(--nx-serif);
  overflow: hidden;
  isolation: isolate;
}
.nexus-graph * { box-sizing: border-box; }
.nexus-graph.nx-no-header { grid-template-rows: 0 1fr 48px; }
.nexus-graph.nx-no-footer { grid-template-rows: 64px 1fr 0; }
.nexus-graph.nx-no-header.nx-no-footer { grid-template-rows: 0 1fr 0; }

.nexus-graph::before, .nexus-graph::after {
  content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 0;
}
.nexus-graph::before {
  background-image:
    radial-gradient(circle at 20% 10%, rgba(184,134,11,0.08), transparent 40%),
    radial-gradient(circle at 85% 80%, rgba(201,69,48,0.06), transparent 45%);
}
.nexus-graph::after {
  background-image:
    linear-gradient(rgba(26,24,20,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(26,24,20,0.025) 1px, transparent 1px);
  background-size: 64px 64px;
}
.nexus-graph > * { position: relative; z-index: 1; }

.nx-header {
  grid-area: header;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 28px;
  border-bottom: 1px solid var(--nx-line);
  background: rgba(245,242,234,0.85);
  backdrop-filter: blur(14px);
  z-index: 10;
}
.nx-brand { display: flex; align-items: baseline; gap: 14px; }
.nx-brand-mark { font-family: var(--nx-serif); font-weight: 800; font-size: 28px; letter-spacing: -0.04em; font-style: italic; }
.nx-brand-mark span { color: var(--nx-accent); font-style: normal; }
.nx-brand-tag { font-family: var(--nx-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.22em; color: var(--nx-ink-dim); }
.nx-header-meta { display: flex; gap: 28px; align-items: center; font-family: var(--nx-mono); font-size: 11px; color: var(--nx-ink-dim); text-transform: uppercase; letter-spacing: 0.18em; }
.nx-dot { display: inline-block; width: 6px; height: 6px; background: #2f8a5f; border-radius: 50%; margin-right: 8px; box-shadow: 0 0 8px #2f8a5f; animation: nx-pulse 2s ease-in-out infinite; }
@keyframes nx-pulse { 0%,100%{opacity:1;} 50%{opacity:0.35;} }

.nx-sidebar {
  grid-area: sidebar;
  border-right: 1px solid var(--nx-line);
  background: var(--nx-bg-panel);
  padding: 28px 24px;
  overflow-y: auto;
  display: flex; flex-direction: column; gap: 28px;
}
.nx-section-label {
  font-family: var(--nx-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.22em;
  color: var(--nx-ink-dim); margin-bottom: 12px; display: flex; align-items: center; gap: 10px;
}
.nx-section-label::before { content: ""; width: 20px; height: 1px; background: var(--nx-ink-dimmer); }
.nx-search { position: relative; }
.nx-search input {
  width: 100%; background: transparent; border: none;
  border-bottom: 1px solid var(--nx-line-strong);
  color: var(--nx-ink); padding: 10px 0 10px 24px;
  font-family: var(--nx-serif); font-size: 18px; font-style: italic;
  outline: none; transition: border-color 0.3s;
}
.nx-search input:focus { border-bottom-color: var(--nx-accent); }
.nx-search input::placeholder { color: var(--nx-ink-dimmer); font-style: italic; }
.nx-search::before {
  content: "⌕"; position: absolute; left: 0; top: 50%;
  transform: translateY(-50%); color: var(--nx-ink-dim); font-size: 18px;
}
.nx-filters { display: flex; flex-direction: column; gap: 2px; }
.nx-filter {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 2px; border-bottom: 1px solid var(--nx-line);
  cursor: pointer; transition: padding-left 0.2s; user-select: none;
}
.nx-filter:hover { padding-left: 8px; }
.nx-filter--off { opacity: 0.35; }
.nx-filter-left { display: flex; align-items: center; gap: 12px; font-size: 15px; }
.nx-filter-swatch { width: 8px; height: 8px; border-radius: 50%; }
.nx-filter-count { font-family: var(--nx-mono); font-size: 11px; color: var(--nx-ink-dim); }

.nx-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--nx-line); border: 1px solid var(--nx-line); }
.nx-stat { background: var(--nx-bg-panel); padding: 16px 14px; }
.nx-stat-value { font-family: var(--nx-serif); font-size: 32px; font-weight: 300; letter-spacing: -0.02em; line-height: 1; }
.nx-stat-label { font-family: var(--nx-mono); font-size: 9px; text-transform: uppercase; letter-spacing: 0.2em; color: var(--nx-ink-dim); margin-top: 6px; }
.nx-legend-note { font-size: 13px; line-height: 1.55; color: var(--nx-ink-dim); font-style: italic; border-left: 2px solid var(--nx-accent); padding-left: 14px; }

.nx-canvas-area { grid-area: canvas; position: relative; overflow: hidden;
  background: radial-gradient(ellipse at center, rgba(255,255,255,0.6), transparent 70%), var(--nx-bg); }
.nx-canvas-wrap { position: absolute; inset: 0; }
.nx-canvas { display: block; width: 100%; height: 100%; cursor: grab; }
.nx-canvas:active { cursor: grabbing; }

.nx-canvas-overlay { position: absolute; top: 24px; left: 24px; z-index: 5; pointer-events: none; }
.nx-canvas-title { font-family: var(--nx-serif); font-style: italic; font-weight: 300; font-size: 44px; letter-spacing: -0.03em; line-height: 1; color: var(--nx-ink); max-width: 520px; margin: 0; }
.nx-canvas-title em { color: var(--nx-accent); font-style: italic; }
.nx-canvas-sub { font-family: var(--nx-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.22em; color: var(--nx-ink-dim); margin-top: 14px; }

.nx-canvas-controls {
  position: absolute; bottom: 20px; right: 20px;
  display: flex; gap: 2px; z-index: 5;
  background: var(--nx-bg-panel); border: 1px solid var(--nx-line);
  box-shadow: 0 2px 12px rgba(26,24,20,0.06);
}
.nx-canvas-controls button {
  background: transparent; border: none; color: var(--nx-ink-dim);
  font-family: var(--nx-mono); font-size: 11px; padding: 10px 14px;
  cursor: pointer; text-transform: uppercase; letter-spacing: 0.15em;
  transition: color 0.2s, background 0.2s;
}
.nx-canvas-controls button:hover { color: var(--nx-accent); background: rgba(184,134,11,0.08); }
.nx-canvas-controls button + button { border-left: 1px solid var(--nx-line); }

.nx-compass { position: absolute; bottom: 20px; left: 20px; z-index: 5; font-family: var(--nx-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: var(--nx-ink-dim); }
.nx-coord { color: var(--nx-accent); }

.nx-layout-sel {
  position: absolute; top: 24px; right: 24px; z-index: 5;
  background: var(--nx-bg-panel); border: 1px solid var(--nx-line);
  box-shadow: 0 2px 12px rgba(26,24,20,0.06);
  display: flex; flex-direction: column; min-width: 180px;
}
.nx-ls-label {
  font-family: var(--nx-mono); font-size: 9px; text-transform: uppercase; letter-spacing: 0.22em;
  color: var(--nx-ink-dim); padding: 10px 14px 8px;
  border-bottom: 1px solid var(--nx-line); cursor: pointer; user-select: none;
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  transition: color 0.2s, background 0.2s;
}
.nx-ls-label:hover { color: var(--nx-accent); background: rgba(184,134,11,0.04); }
.nx-layout-sel--collapsed .nx-ls-label { border-bottom-color: transparent; padding-bottom: 10px; }
.nx-ls-label-text { display: flex; align-items: center; gap: 8px; }
.nx-ls-current { font-family: var(--nx-serif); font-style: italic; font-weight: 400; font-size: 12px; text-transform: none; letter-spacing: 0; color: var(--nx-ink); }
.nx-ls-chevron { width: 8px; height: 8px; border-right: 1.5px solid currentColor; border-bottom: 1.5px solid currentColor; transform: rotate(45deg) translate(-1px,-1px); transition: transform 0.25s ease; color: var(--nx-ink-dim); }
.nx-layout-sel--collapsed .nx-ls-chevron { transform: rotate(-45deg) translate(1px,-1px); }
.nx-ls-options { display: flex; flex-direction: column; overflow: hidden; max-height: 400px; transition: max-height 0.3s ease, opacity 0.2s ease; opacity: 1; }
.nx-layout-sel--collapsed .nx-ls-options { max-height: 0; opacity: 0; }
.nx-ls-opt {
  background: transparent; border: none;
  border-bottom: 1px solid var(--nx-line);
  color: var(--nx-ink); font-family: var(--nx-serif);
  font-style: italic; font-size: 14px; padding: 9px 14px;
  cursor: pointer; text-align: left;
  display: flex; align-items: center; justify-content: space-between;
  transition: background 0.15s, color 0.15s, padding-left 0.2s;
}
.nx-ls-opt:last-child { border-bottom: none; }
.nx-ls-opt:hover { background: rgba(184,134,11,0.06); padding-left: 18px; }
.nx-ls-opt--active { color: var(--nx-accent); background: rgba(184,134,11,0.08); }
.nx-ls-key { font-family: var(--nx-mono); font-size: 9px; color: var(--nx-ink-dimmer); letter-spacing: 0.15em; text-transform: uppercase; }
.nx-ls-opt--active .nx-ls-key { color: var(--nx-accent); }

.nx-detail {
  grid-area: detail; border-left: 1px solid var(--nx-line);
  background: var(--nx-bg-panel); padding: 28px 26px; overflow-y: auto;
  display: flex; flex-direction: column; gap: 22px;
}
.nx-detail-empty { color: var(--nx-ink-dim); font-style: italic; font-size: 16px; line-height: 1.5; padding-top: 60px; }
.nx-detail-empty-big { font-size: 72px; font-family: var(--nx-serif); font-weight: 300; font-style: italic; color: var(--nx-ink-dimmer); line-height: 0.9; letter-spacing: -0.04em; margin-bottom: 18px; }
.nx-person { animation: nx-fadeUp 0.4s ease; }
@keyframes nx-fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.nx-person-cat { font-family: var(--nx-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.24em; display: inline-flex; align-items: center; gap: 8px; }
.nx-person-cat::before { content: ""; width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
.nx-person-name { font-family: var(--nx-serif); font-weight: 400; font-size: 34px; line-height: 1; letter-spacing: -0.02em; margin: 14px 0 8px; }
.nx-person-role { font-style: italic; color: var(--nx-ink-dim); font-size: 16px; margin-bottom: 18px; }
.nx-person-bio { font-size: 14px; line-height: 1.6; color: var(--nx-ink); padding-top: 18px; border-top: 1px solid var(--nx-line); }
.nx-connections { display: flex; flex-direction: column; }
.nx-connection { padding: 12px 0; border-bottom: 1px solid var(--nx-line); display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: padding-left 0.2s, color 0.2s; }
.nx-connection:hover { padding-left: 6px; color: var(--nx-accent); }
.nx-c-name { font-size: 15px; }
.nx-c-rel { font-family: var(--nx-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: var(--nx-ink-dim); }

.nx-tooltip {
  position: absolute; pointer-events: none;
  background: var(--nx-bg-panel); border: 1px solid var(--nx-accent);
  padding: 8px 12px; font-family: var(--nx-serif);
  font-style: italic; font-size: 14px; white-space: nowrap;
  z-index: 20; opacity: 0; transition: opacity 0.15s;
  transform: translate(-50%, -130%);
  box-shadow: 0 4px 14px rgba(26,24,20,0.08); color: var(--nx-ink);
}
.nx-tooltip--visible { opacity: 1; }
.nx-tooltip::after {
  content: ""; position: absolute; bottom: -5px; left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 8px; height: 8px; background: var(--nx-bg-panel);
  border-right: 1px solid var(--nx-accent); border-bottom: 1px solid var(--nx-accent);
}

.nx-footer {
  grid-area: footer; display: flex; align-items: center; justify-content: space-between;
  padding: 0 28px; border-top: 1px solid var(--nx-line);
  font-family: var(--nx-mono); font-size: 10px; text-transform: uppercase;
  letter-spacing: 0.22em; color: var(--nx-ink-dim); background: var(--nx-bg-panel);
}
.nx-footer-pager { display: flex; gap: 24px; }
.nx-footer-pager span { color: var(--nx-accent); }

.nexus-graph ::-webkit-scrollbar { width: 6px; }
.nexus-graph ::-webkit-scrollbar-track { background: transparent; }
.nexus-graph ::-webkit-scrollbar-thumb { background: var(--nx-ink-dimmer); }
.nexus-graph ::-webkit-scrollbar-thumb:hover { background: var(--nx-ink-dim); }

@media (max-width: 1100px) {
  .nexus-graph { grid-template-columns: 260px 1fr 280px; }
  .nx-canvas-title { font-size: 32px; }
}
@media (max-width: 800px) {
  .nexus-graph {
    grid-template-columns: 1fr;
    grid-template-rows: 64px auto 1fr auto 48px;
    grid-template-areas: "header" "sidebar" "canvas" "detail" "footer";
    height: auto; min-height: 100vh;
  }
  .nx-sidebar, .nx-detail { border: none; border-bottom: 1px solid var(--nx-line); }
  .nx-canvas-area { min-height: 60vh; }
}
`;

  // Inject styles once
  if (typeof document !== 'undefined' && !document.getElementById('nexus-graph-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'nexus-graph-styles';
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);
  }

  /* =====================================================================
   * DEFAULT DATA
   * ===================================================================== */
  const DEFAULT_CATEGORIES = {
    tech:     { label: "Technology",     color: "#2c6fb8" },
    politics: { label: "Politics",       color: "#c94530" },
    science:  { label: "Science",        color: "#2f8a5f" },
    business: { label: "Business",       color: "#b8860b" },
    culture:  { label: "Culture & Arts", color: "#8a4fb0" },
    sports:   { label: "Sports",         color: "#d96a2b" },
  };

  const DEFAULT_PEOPLE = [
    { id: "turing",     name: "Alan Turing",         cat: "science",  role: "Mathematician, cryptanalyst",              bio: "Pioneer of theoretical computer science and artificial intelligence. Formalized the concepts of algorithm and computation with the Turing machine." },
    { id: "vonneumann", name: "John von Neumann",    cat: "science",  role: "Mathematician, physicist",                 bio: "Contributed to game theory, quantum mechanics, and computing architecture that still bears his name." },
    { id: "berners",    name: "Tim Berners-Lee",     cat: "tech",     role: "Inventor of the World Wide Web",           bio: "Proposed the hypertext system that became the Web while at CERN in 1989." },
    { id: "jobs",       name: "Steve Jobs",          cat: "business", role: "Co-founder, Apple",                        bio: "Design-obsessed co-founder whose return to Apple reshaped consumer technology." },
    { id: "woz",        name: "Steve Wozniak",       cat: "tech",     role: "Engineer, co-founder Apple",               bio: "Designed the Apple I and Apple II. The engineering heart of early Apple." },
    { id: "gates",      name: "Bill Gates",          cat: "business", role: "Co-founder, Microsoft",                    bio: "Built Microsoft into a software empire; now focuses on philanthropy via the Gates Foundation." },
    { id: "allen",      name: "Paul Allen",          cat: "business", role: "Co-founder, Microsoft",                    bio: "Co-founded Microsoft with Gates; later invested broadly in science and sports." },
    { id: "musk",       name: "Elon Musk",           cat: "business", role: "CEO, Tesla & SpaceX",                      bio: "Serial entrepreneur pushing into electric vehicles, private spaceflight, and beyond." },
    { id: "bezos",      name: "Jeff Bezos",          cat: "business", role: "Founder, Amazon",                          bio: "Built Amazon from an online bookstore into a global logistics and cloud giant." },
    { id: "zuck",       name: "Mark Zuckerberg",     cat: "tech",     role: "Founder, Meta",                            bio: "Founded Facebook in a Harvard dorm room; now leads Meta's push into social and VR." },
    { id: "page",       name: "Larry Page",          cat: "tech",     role: "Co-founder, Google",                       bio: "Co-invented PageRank with Sergey Brin; co-founded Google in a Stanford dorm." },
    { id: "brin",       name: "Sergey Brin",         cat: "tech",     role: "Co-founder, Google",                       bio: "Mathematician and co-founder of Google; met Page at Stanford." },
    { id: "altman",     name: "Sam Altman",          cat: "tech",     role: "CEO, OpenAI",                              bio: "Former Y Combinator president; leads OpenAI's push for general-purpose AI." },
    { id: "hinton",     name: "Geoffrey Hinton",     cat: "science",  role: "Computer scientist",                       bio: "Godfather of deep learning; Turing Award laureate whose backpropagation work underlies modern AI." },
    { id: "lecun",      name: "Yann LeCun",          cat: "science",  role: "Chief AI Scientist, Meta",                 bio: "Developed convolutional neural networks; a Turing Award-winning deep learning pioneer." },
    { id: "obama",      name: "Barack Obama",        cat: "politics", role: "44th U.S. President",                      bio: "First African-American U.S. president; known for the Affordable Care Act and a measured oratorical style." },
    { id: "michelle",   name: "Michelle Obama",      cat: "politics", role: "Former First Lady, author",                bio: "Attorney, author, and advocate for education and nutrition." },
    { id: "biden",      name: "Joe Biden",           cat: "politics", role: "46th U.S. President",                      bio: "Six-term senator from Delaware, vice president under Obama, elected president in 2020." },
    { id: "harris",     name: "Kamala Harris",       cat: "politics", role: "49th U.S. Vice President",                 bio: "Former California AG and senator; first woman to hold the U.S. vice presidency." },
    { id: "merkel",     name: "Angela Merkel",       cat: "politics", role: "Former Chancellor of Germany",             bio: "Led Germany for sixteen years through financial, refugee, and pandemic crises." },
    { id: "macron",     name: "Emmanuel Macron",     cat: "politics", role: "President of France",                      bio: "Former investment banker who founded En Marche; youngest French president since Napoleon." },
    { id: "einstein",   name: "Albert Einstein",     cat: "science",  role: "Theoretical physicist",                    bio: "Reshaped physics with relativity and laid groundwork for quantum theory." },
    { id: "curie",      name: "Marie Curie",         cat: "science",  role: "Physicist, chemist",                       bio: "Pioneer of radioactivity; first person to win Nobel Prizes in two different sciences." },
    { id: "hawking",    name: "Stephen Hawking",     cat: "science",  role: "Theoretical physicist",                    bio: "Black hole thermodynamics and cosmology, plus a rare gift for public explanation." },
    { id: "tyson",      name: "Neil deGrasse Tyson", cat: "science",  role: "Astrophysicist, communicator",             bio: "Director of the Hayden Planetarium; popular science communicator." },
    { id: "doudna",     name: "Jennifer Doudna",     cat: "science",  role: "Biochemist",                                bio: "Shared 2020 Nobel Prize in Chemistry for the development of CRISPR-Cas9." },
    { id: "oprah",      name: "Oprah Winfrey",       cat: "culture",  role: "Media executive, philanthropist",          bio: "Transformed daytime television and built a cross-media empire with OWN and Harpo." },
    { id: "beyonce",    name: "Beyoncé",             cat: "culture",  role: "Singer, performer",                        bio: "From Destiny's Child to solo icon; one of the most decorated artists in Grammy history." },
    { id: "jayz",       name: "Jay-Z",               cat: "culture",  role: "Rapper, mogul",                            bio: "Built Roc Nation and Tidal alongside a decades-long recording career." },
    { id: "taylor",     name: "Taylor Swift",        cat: "culture",  role: "Singer-songwriter",                        bio: "Pop phenomenon whose Eras Tour became one of the highest-grossing in history." },
    { id: "kanye",      name: "Kanye West",          cat: "culture",  role: "Musician, designer",                       bio: "Producer turned rapper turned fashion provocateur; frequently controversial." },
    { id: "scorsese",   name: "Martin Scorsese",     cat: "culture",  role: "Filmmaker",                                 bio: "New Hollywood auteur behind Taxi Driver, Goodfellas, and The Irishman." },
    { id: "deniro",     name: "Robert De Niro",      cat: "culture",  role: "Actor",                                    bio: "Scorsese's long-time collaborator and one of the defining actors of his generation." },
    { id: "jordan",     name: "Michael Jordan",      cat: "sports",   role: "Basketball legend",                        bio: "Six-time NBA champion; redefined basketball's global reach." },
    { id: "lebron",     name: "LeBron James",        cat: "sports",   role: "Basketball player",                        bio: "Four-time NBA champion; all-time scoring leader with a media and business footprint to match." },
    { id: "serena",     name: "Serena Williams",     cat: "sports",   role: "Tennis champion",                          bio: "23 Grand Slam singles titles in the Open Era; retired 2022 as one of tennis's greatest." },
    { id: "messi",      name: "Lionel Messi",        cat: "sports",   role: "Footballer",                               bio: "Eight-time Ballon d'Or winner; led Argentina to the 2022 World Cup." },
    { id: "ronaldo",    name: "Cristiano Ronaldo",   cat: "sports",   role: "Footballer",                               bio: "Five-time Ballon d'Or; career-long rival to Messi and one of the most prolific goalscorers ever." },
    { id: "buffett",    name: "Warren Buffett",      cat: "business", role: "Investor, CEO Berkshire Hathaway",         bio: "The 'Oracle of Omaha'; proponent of value investing and large-scale philanthropy." },
    { id: "munger",     name: "Charlie Munger",      cat: "business", role: "Investor, Berkshire Hathaway",             bio: "Buffett's long-time partner and intellectual sparring partner." },
    { id: "soros",      name: "George Soros",        cat: "business", role: "Investor, philanthropist",                 bio: "Hedge fund manager known for the 1992 Bank of England short and Open Society Foundations." },
    { id: "thiel",      name: "Peter Thiel",         cat: "business", role: "Investor, PayPal co-founder",              bio: "Founded PayPal with Musk and Levchin; later backed Palantir and Facebook early." },
    { id: "hoffman",    name: "Reid Hoffman",        cat: "business", role: "Co-founder, LinkedIn",                     bio: "PayPal mafia alum; co-founded LinkedIn and invested across early Web 2.0." },
  ];

  const DEFAULT_EDGES = [
    ["musk","thiel","Co-founded PayPal"],["musk","hoffman","PayPal era"],
    ["thiel","hoffman","Co-workers at PayPal"],["thiel","zuck","Early Facebook investor"],
    ["jobs","woz","Co-founded Apple"],["jobs","gates","Rivals and occasional allies"],
    ["gates","allen","Co-founded Microsoft"],["gates","buffett","Friendship & philanthropy"],
    ["page","brin","Co-founded Google at Stanford"],["page","hinton","Hired at Google Brain"],
    ["brin","musk","Early Tesla investor"],["hinton","lecun","Deep learning godfathers"],
    ["altman","musk","Co-founded OpenAI"],["altman","thiel","Y Combinator network"],
    ["altman","hoffman","Tech investor network"],["lecun","zuck","Meta Chief AI Scientist"],
    ["turing","vonneumann","Contemporaries in early computing"],
    ["vonneumann","einstein","Princeton IAS colleagues"],["berners","turing","Intellectual lineage"],
    ["obama","michelle","Married"],["obama","biden","President & VP"],
    ["biden","harris","President & VP"],["obama","harris","Democratic allies"],
    ["merkel","macron","European Council counterparts"],["obama","merkel","Close diplomatic ties"],
    ["obama","oprah","Public endorsement & friendship"],
    ["einstein","curie","Solvay Conference contemporaries"],
    ["hawking","tyson","Fellow cosmology communicators"],
    ["doudna","hinton","Scientific contemporaries"],
    ["beyonce","jayz","Married & collaborators"],["jayz","kanye","Longtime collaborators, later feud"],
    ["kanye","taylor","Public feud (2009–)"],["oprah","michelle","Public friendship"],
    ["oprah","jayz","Interview & mutual respect"],["scorsese","deniro","Ten films together"],
    ["jordan","lebron","GOAT debate"],["messi","ronaldo","Defining rivalry"],
    ["serena","lebron","Close friends, Nike stablemates"],["jordan","obama","Chicago connections"],
    ["buffett","munger","Berkshire partners"],["buffett","gates","Close friendship & Giving Pledge"],
    ["soros","macron","Public policy dialogue"],["bezos","musk","Space industry rivals"],
    ["zuck","gates","Younger tech generation"],["musk","obama","White House visits"],
    ["tyson","obama","Science advocacy"],["hawking","obama","Medal of Freedom"],
    ["taylor","beyonce","Mutual public admiration"],
  ];

  /* =====================================================================
   * LAYOUT ALGORITHMS
   * ===================================================================== */
  const LAYOUT_OPTIONS = [
    { id: 'force',        label: 'Force-directed', key: '1' },
    { id: 'radial',       label: 'Radial',         key: '2' },
    { id: 'tree',         label: 'Tree',           key: '3' },
    { id: 'balloon',      label: 'Balloon',        key: '4' },
    { id: 'hierarchical', label: 'Hierarchical',   key: '5' },
  ];

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

  function computeRadial(nodes, links) {
    const root = findRootNode(nodes);
    const tree = buildBFSTree(nodes, links, root.id);
    const byDepth = {};
    for (const n of nodes) {
      const d = tree.depth[n.id] != null ? tree.depth[n.id] : 0;
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

  function computeTree(nodes, links) {
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
        x: (xPos[n.id] != null ? xPos[n.id] : 0) - cx,
        y: (tree.depth[n.id] != null ? tree.depth[n.id] : 0) * ySpacing - cy,
      };
    }
    return targets;
  }

  function computeBalloon(nodes, links) {
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

  function computeHierarchical(nodes, links, categories) {
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

  function computeLayout(name, nodes, links, categories) {
    if (name === 'force') return null;
    if (name === 'radial') return computeRadial(nodes, links);
    if (name === 'tree') return computeTree(nodes, links);
    if (name === 'balloon') return computeBalloon(nodes, links);
    if (name === 'hierarchical') return computeHierarchical(nodes, links, categories);
    return null;
  }

  /* =====================================================================
   * ENGINE HOOK
   * ===================================================================== */
  function useGraphEngine({ people, edges, categories }) {
    const graph = useMemo(() => {
      const nodeById = {};
      const nodes = people.map((p, i) => {
        const angle = (i / people.length) * Math.PI * 2;
        const r = 180 + Math.random() * 60;
        const n = {
          ...p,
          x: Math.cos(angle) * r + (Math.random() - 0.5) * 40,
          y: Math.sin(angle) * r + (Math.random() - 0.5) * 40,
          vx: 0, vy: 0, degree: 0, fixed: false,
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

    const nodesRef = useRef(graph.nodes);
    const linksRef = useRef(graph.links);
    const nodeByIdRef = useRef(graph.nodeById);

    useEffect(() => {
      nodesRef.current = graph.nodes;
      linksRef.current = graph.links;
      nodeByIdRef.current = graph.nodeById;
    }, [graph]);

    const [layout, setLayoutState] = useState('force');
    const layoutRef = useRef('force');
    const targetsRef = useRef(null);
    const pausedRef = useRef(false);
    const [paused, setPausedState] = useState(false);

    const applyLayout = useCallback((name) => {
      layoutRef.current = name;
      targetsRef.current = computeLayout(name, nodesRef.current, linksRef.current, categories);
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
        for (const n of nodesRef.current) {
          n.x += (Math.random() - 0.5) * 200;
          n.y += (Math.random() - 0.5) * 200;
        }
      }
    }, []);

    useEffect(() => {
      let raf;
      function step() {
        raf = requestAnimationFrame(step);
        if (pausedRef.current) return;
        const nodes = nodesRef.current;
        const links = linksRef.current;

        if (layoutRef.current === 'force') {
          const repulsion = 1200, linkDist = 90, linkStrength = 0.04, centerPull = 0.003, damping = 0.82;
          for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            if (a.fixed) continue;
            for (let j = i + 1; j < nodes.length; j++) {
              const b = nodes[j];
              const dx = b.x - a.x, dy = b.y - a.y;
              let d2 = dx*dx + dy*dy;
              if (d2 < 0.01) d2 = 0.01;
              const d = Math.sqrt(d2);
              const force = repulsion / d2;
              const fx = (dx/d)*force, fy = (dy/d)*force;
              a.vx -= fx; a.vy -= fy;
              if (!b.fixed) { b.vx += fx; b.vy += fy; }
            }
          }
          for (const l of links) {
            const dx = l.target.x - l.source.x, dy = l.target.y - l.source.y;
            const d = Math.sqrt(dx*dx + dy*dy) || 0.01;
            const diff = (d - linkDist) * linkStrength;
            const fx = (dx/d)*diff, fy = (dy/d)*diff;
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

    useEffect(() => {
      if (layoutRef.current !== 'force') {
        targetsRef.current = computeLayout(layoutRef.current, nodesRef.current, linksRef.current, categories);
      }
    }, [graph, categories]);

    return { nodesRef, linksRef, nodeByIdRef, layout, paused, applyLayout, setPaused, reheat };
  }

  /* =====================================================================
   * CANVAS COMPONENT
   * ===================================================================== */
  function hexToRgba(hex, a) {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }
  function nodeRadius(n) { return 4 + Math.sqrt(n.degree) * 3.2; }

  function GraphCanvas({
    nodesRef, linksRef, categories, activeCats, searchQuery,
    selectedId, onSelect, onFpsUpdate, onTransformUpdate, onCenterRequest,
  }) {
    const canvasRef = useRef(null);
    const wrapRef = useRef(null);
    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: '' });

    const sizeRef = useRef({ width: 0, height: 0 });
    const transformRef = useRef({ x: 0, y: 0, k: 1 });
    const hoveredIdRef = useRef(null);
    const isDraggingRef = useRef(false);
    const draggedNodeRef = useRef(null);
    const dragStartRef = useRef(null);
    const selectedIdRef = useRef(selectedId);

    useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);

    // External center command
    useEffect(() => {
      if (!onCenterRequest) return;
      onCenterRequest.current = () => {
        transformRef.current = { x: 0, y: 0, k: 1 };
        if (onTransformUpdate) onTransformUpdate(transformRef.current);
      };
    }, [onCenterRequest, onTransformUpdate]);

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
      return () => { ro.disconnect(); window.removeEventListener('resize', resize); };
    }, []);

    const filterRef = useRef({ activeCats, searchQuery });
    useEffect(() => { filterRef.current = { activeCats, searchQuery }; }, [activeCats, searchQuery]);

    function isNodeVisible(n) {
      const { activeCats, searchQuery } = filterRef.current;
      if (!activeCats.has(n.cat)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const cat = categories[n.cat];
        if (!n.name.toLowerCase().includes(q) &&
            !n.role.toLowerCase().includes(q) &&
            !(cat && cat.label.toLowerCase().includes(q))) return false;
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
        if (dx*dx + dy*dy <= (r + 3) * (r + 3)) return n;
      }
      return null;
    }

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

        for (const l of links) {
          if (!isNodeVisible(l.source) || !isNodeVisible(l.target)) continue;
          const active = focusSet && (focusSet.has(l.source.id) && focusSet.has(l.target.id));
          const dim = focusSet && !active;
          ctx.strokeStyle = active ? 'rgba(184,134,11,0.7)' : dim ? 'rgba(26,24,20,0.04)' : 'rgba(26,24,20,0.15)';
          ctx.lineWidth = (active ? 1.6 : 0.9) / t.k;
          ctx.beginPath();
          ctx.moveTo(l.source.x, l.source.y);
          ctx.lineTo(l.target.x, l.target.y);
          ctx.stroke();
        }

        for (const n of nodes) {
          if (!isNodeVisible(n)) continue;
          const r = nodeRadius(n);
          const isFocus = focusId === n.id;
          const inFocus = focusSet ? focusSet.has(n.id) : true;
          const cat = categories[n.cat];
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

          const showLabel = isFocus || (focusSet && focusSet.has(n.id)) || (n.degree >= 4 && t.k > 0.8);
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
          if (onFpsUpdate) onFpsUpdate(fps);
        }
      }
      raf = requestAnimationFrame(draw);
      return () => cancelAnimationFrame(raf);
    }, [categories, nodesRef, linksRef, onFpsUpdate]);

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
        if (onTransformUpdate) onTransformUpdate(t);
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
      if (n) { draggedNodeRef.current = n; n.fixed = true; }
      else { dragStartRef.current = { x: sx, y: sy }; }
    }

    useEffect(() => {
      function handleMouseUp(e) {
        const rect = canvasRef.current.getBoundingClientRect();
        const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
        if (draggedNodeRef.current) {
          draggedNodeRef.current.fixed = false;
          const n = nodeAt(sx, sy);
          if (n && n.id === draggedNodeRef.current.id) { if (onSelect) onSelect(n.id); }
          draggedNodeRef.current = null;
        } else if (isDraggingRef.current && dragStartRef.current) {
          const moved = Math.hypot(sx - dragStartRef.current.x, sy - dragStartRef.current.y) > 3;
          if (!moved && onSelect) onSelect(null);
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
        if (onTransformUpdate) onTransformUpdate(t);
      }
      const canvas = canvasRef.current;
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        canvas.removeEventListener('wheel', handleWheel);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }, [onSelect, onTransformUpdate]);

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

  /* =====================================================================
   * SIDEBAR
   * ===================================================================== */
  function Sidebar({ categories, nodes, links, activeCats, onToggleCat, searchQuery, onSearchChange }) {
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
                <div key={key} className={`nx-filter${off ? ' nx-filter--off' : ''}`} onClick={() => onToggleCat(key)}>
                  <div className="nx-filter-left">
                    <div className="nx-filter-swatch" style={{ background: cat.color }} />
                    <div>{cat.label}</div>
                  </div>
                  <div className="nx-filter-count">{String(counts[key] || 0).padStart(2, '0')}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div className="nx-section-label">Figures</div>
          <div className="nx-stat-grid">
            <div className="nx-stat"><div className="nx-stat-value">{nodes.length}</div><div className="nx-stat-label">Nodes</div></div>
            <div className="nx-stat"><div className="nx-stat-value">{links.length}</div><div className="nx-stat-label">Edges</div></div>
            <div className="nx-stat"><div className="nx-stat-value">{Object.keys(categories).length}</div><div className="nx-stat-label">Domains</div></div>
            <div className="nx-stat"><div className="nx-stat-value">{density}%</div><div className="nx-stat-label">Density</div></div>
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

  /* =====================================================================
   * DETAIL PANEL
   * ===================================================================== */
  function DetailPanel({ selectedNode, categories, links, onSelect }) {
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
          <div className="nx-person-cat" style={{ color: cat && cat.color }}>{cat && cat.label}</div>
          <h2 className="nx-person-name">{selectedNode.name}</h2>
          <div className="nx-person-role">{selectedNode.role}</div>
          <div>
            <div className="nx-section-label">Connections · {neighbors.length}</div>
            <div className="nx-connections">
              {neighbors.map(({ node, rel }) => (
                <div key={node.id} className="nx-connection" onClick={() => onSelect(node.id)}>
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

  /* =====================================================================
   * LAYOUT SELECTOR
   * ===================================================================== */
  function LayoutSelector({ value, onChange }) {
    const [collapsed, setCollapsed] = useState(true);
    const current = LAYOUT_OPTIONS.find(o => o.id === value);

    useEffect(() => {
      function onKey(e) {
        if (e.target.tagName === 'INPUT') return;
        const opt = LAYOUT_OPTIONS.find(o => o.key === e.key);
        if (opt) onChange(opt.id);
      }
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [onChange]);

    return (
      <div className={`nx-layout-sel${collapsed ? ' nx-layout-sel--collapsed' : ''}`}>
        <div className="nx-ls-label" onClick={() => setCollapsed(c => !c)}>
          <div className="nx-ls-label-text">
            <span>Layout</span>
            <span className="nx-ls-current">· {(current && current.label) || 'Force-directed'}</span>
          </div>
          <div className="nx-ls-chevron" />
        </div>
        <div className="nx-ls-options">
          {LAYOUT_OPTIONS.map(opt => (
            <button
              key={opt.id}
              type="button"
              className={`nx-ls-opt${value === opt.id ? ' nx-ls-opt--active' : ''}`}
              onClick={() => { onChange(opt.id); setCollapsed(true); }}
            >
              <span>{opt.label}</span>
              <span className="nx-ls-key">{opt.key}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* =====================================================================
   * MAIN COMPONENT
   * ===================================================================== */
  function NexusGraph(props) {
    const {
      people = DEFAULT_PEOPLE,
      edges = DEFAULT_EDGES,
      categories = DEFAULT_CATEGORIES,
      title,
      subtitle = 'Click any node to inspect · drag to reposition · scroll to zoom',
      showHeader = true,
      showFooter = true,
      className = '',
      style,
    } = props || {};

    const {
      nodesRef, linksRef, nodeByIdRef,
      layout, paused, applyLayout, setPaused, reheat,
    } = useGraphEngine({ people, edges, categories });

    const [activeCats, setActiveCats] = useState(() => new Set(Object.keys(categories)));
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const [fps, setFps] = useState(0);
    const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
    const centerRef = useRef(null);

    useEffect(() => { setActiveCats(new Set(Object.keys(categories))); }, [categories]);

    function toggleCat(key) {
      setActiveCats(prev => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key); else next.add(key);
        return next;
      });
    }
    function handleCenter() {
      if (centerRef.current) centerRef.current();
      setTransform({ x: 0, y: 0, k: 1 });
    }
    function handleLayoutChange(name) {
      applyLayout(name);
      handleCenter();
    }

    const selectedNode = selectedId ? nodeByIdRef.current[selectedId] : null;
    const defaultTitle = <>Who <em>knows</em> whom, and how does it <em>matter</em>?</>;

    const rootClass = ['nexus-graph', showHeader ? '' : 'nx-no-header', showFooter ? '' : 'nx-no-footer', className].filter(Boolean).join(' ');

    return (
      <div className={rootClass} style={style}>
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
            onCenterRequest={centerRef}
          />
          <div className="nx-canvas-overlay">
            <h1 className="nx-canvas-title">{title != null ? title : defaultTitle}</h1>
            <div className="nx-canvas-sub">{subtitle}</div>
          </div>
          <LayoutSelector value={layout} onChange={handleLayoutChange} />
          <div className="nx-compass">
            <div>Zoom · <span className="nx-coord">{transform.k.toFixed(2)}×</span></div>
            <div>Origin · <span className="nx-coord">{Math.round(-transform.x)}, {Math.round(-transform.y)}</span></div>
          </div>
          <div className="nx-canvas-controls">
            <button onClick={reheat}>Reheat</button>
            <button onClick={handleCenter}>Center</button>
            <button onClick={() => setPaused(p => !p)}>{paused ? 'Resume' : 'Pause'}</button>
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

  // Expose as a global so other Babel-Standalone scripts can use it
  window.NexusGraph = NexusGraph;
  window.NexusGraphData = { DEFAULT_CATEGORIES, DEFAULT_PEOPLE, DEFAULT_EDGES };
})();
