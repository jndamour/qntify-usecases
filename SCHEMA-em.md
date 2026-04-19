# Content Schema — Qntify Emerging Markets page

Every user-editable element on `Emerging Markets.html` is driven by a single content object. A reference copy lives in **`em.schema.json.js`** (`window.EM_CONTENT_SCHEMA`). Copy it, edit the values, and you've changed the page.

---

## 1 · File shape

```jsonc
{
  "$schema":     "qntify-emerging-markets/1.0",
  "brand":       { … },   // nav + footer chrome
  "hero":        { … },   // top of page
  "partI":       { … },   // "Signals, not consensus" opener
  "chartSeries": { … },   // hero sparkline datasets (keyed by id)
  "heatmap":     { … },   // correlation heatmap
  "rankedBars":  { … },   // sector exposure bars
  "partII":      { … },   // "Trade & supply chain" opener
  "supplyChain": { … },   // four-stage network graph
  "datasets":    { … },   // 6-cell proprietary datasets grid
  "vignette":    { … },   // case vignette
  "coverage":    { … },   // country depth grid
  "close":       { … },   // closing statement + CTAs
  "theme":       { … }    // default mode, accent, network focus
}
```

---

## 2 · Field reference

### 2.1 `brand`

| Field         | Type                        | Notes                                                  |
| ------------- | --------------------------- | ------------------------------------------------------ |
| `name`        | string                      | Wordmark. Renders as `Q·ntify` (accent dot on the Q).  |
| `tagline`     | string                      | Left side of footer.                                   |
| `footerLinks` | string                      | Right side of footer. Plain separator-delimited text.  |
| `navLinks`    | `{label, href, active?}[]`  | Top-nav items. Mark current page with `active: true`.  |

### 2.2 `hero`

| Field      | Type                       | Notes                                                                          |
| ---------- | -------------------------- | ------------------------------------------------------------------------------ |
| `eyebrow`  | string                     | Mono uppercase label above headline. Keep short (<30 chars).                   |
| `headline` | string                     | Serif display. Use `{em}…{/em}` to italicize in the accent color (one pair).   |
| `lede`     | string                     | Sub-headline paragraph. ~35–60 words.                                          |
| `stats`    | `{value, label}[]`         | Exactly **3** items.                                                           |
| `focus`    | `{tag, label}[]`           | Exactly **3** focus-area tags (`DD`, `TRADE`, `DATA` by default).              |

### 2.3 `partI`

| Field         | Type     | Notes                                                                  |
| ------------- | -------- | ---------------------------------------------------------------------- |
| `eyebrow`     | string   | e.g. `"Part I"`.                                                       |
| `headline`    | string   | Serif section title.                                                   |
| `body`        | string   | Right-column paragraph. ~35–60 words.                                  |
| `heroDataset` | enum     | Key into `chartSeries`. `"fx"` or `"yields"`. Live-switchable via tweak. |

### 2.4 `chartSeries`

Keyed map of sparkline datasets. Each key is a dataset id referenced by `partI.heroDataset` and the tweak panel.

| Field      | Type         | Notes                                                          |
| ---------- | ------------ | -------------------------------------------------------------- |
| `name`     | string       | Chart title (serif).                                           |
| `subtitle` | string       | Mono uppercase label above title.                              |
| `xLabels`  | `string[]`   | **7** x-axis labels plotted at indices 0, 6, 12, 18, 24, 30, 35. |
| `series`   | `Series[]`   | 1–4 lines work cleanly; design assumes 3.                      |

**Series**

| Field   | Type       | Notes                                                                   |
| ------- | ---------- | ----------------------------------------------------------------------- |
| `id`    | string     | 3-letter code (e.g. `NGN`), shown in legend.                            |
| `label` | string     | Country/asset name, shown in legend.                                    |
| `color` | hex string | Line color. Keep to the warm-palette accents for visual consistency.    |
| `data`  | `number[]` | Exactly **36** monthly values (Jan 2023 → Dec 2025).                    |

### 2.5 `heatmap`

| Field      | Type                | Notes                                                         |
| ---------- | ------------------- | ------------------------------------------------------------- |
| `title`    | string              | Serif title.                                                  |
| `subtitle` | string              | Mono uppercase label above title.                             |
| `labels`   | `string[]`          | **N** row/column headers. Design tested with N = 7.           |
| `matrix`   | `number[][]`        | N×N symmetric matrix of values in `[-1, 1]`. Diagonals = 1.   |

### 2.6 `rankedBars`

| Field  | Type             | Notes                                                    |
| ------ | ---------------- | -------------------------------------------------------- |
| `name` | string           | Serif title.                                             |
| `unit` | string           | Mono uppercase label above title.                        |
| `rows` | `{label, value}[]` | 6–10 rows, sorted descending by `value` (`0.0`–`1.0`). |

### 2.7 `partII`

| Field      | Type   | Notes                                                        |
| ---------- | ------ | ------------------------------------------------------------ |
| `eyebrow`  | string | e.g. `"Part II"`.                                            |
| `headline` | string | Serif section title.                                         |
| `body`     | string | Right-column paragraph. ~35–60 words.                        |
| `label`    | string | Mono label above the diagram (e.g. stage count / sector).    |

### 2.8 `supplyChain`

Four-column network graph with particle flow along edges. Flagged nodes render as pulsing accent rings.

| Field    | Type                      | Notes                                                        |
| -------- | ------------------------- | ------------------------------------------------------------ |
| `stages` | `{id, label, x}[]`        | Column headers. `x` is horizontal position `0.0`–`1.0`. Design assumes **4** stages. |
| `nodes`  | `Node[]`                  | Graph nodes. See schema below. 10–16 nodes works well.       |
| `edges`  | `[fromId, toId][]`        | Directed connections. IDs must match node `id`s.             |

**Node**

| Field        | Type   | Notes                                                                                 |
| ------------ | ------ | ------------------------------------------------------------------------------------- |
| `id`         | string | Unique.                                                                               |
| `stage`      | string | Must match a `stages[].id`. Determines the node's `x`.                                |
| `label`      | string | Primary name. Serif.                                                                  |
| `sub`        | string | One-line descriptor below the label. Mono.                                            |
| `y`          | number | Vertical position, `0.0`–`1.0`.                                                       |
| `flag`       | enum?  | Optional. `"chokepoint" \| "sanctions" \| "ownership"`. Renders pulsing accent ring.  |
| `flagDetail` | string?| Required when `flag` is set. One sentence — shown in the side panel.                  |

**Network focus tweak** highlights all nodes matching the selected `flag`. `"none"` shows all flagged nodes equally.

### 2.9 `datasets`

| Field      | Type          | Notes                                                   |
| ---------- | ------------- | ------------------------------------------------------- |
| `eyebrow`  | string        | e.g. `"Part III"`.                                      |
| `headline` | string        | Section title.                                          |
| `body`     | string        | Right-column paragraph. ~25–45 words.                   |
| `items`    | `Dataset[]`   | Exactly **6** items — the design assumes 3×2 grid.     |

**Dataset**

| Field  | Type   | Notes                                        |
| ------ | ------ | -------------------------------------------- |
| `n`    | string | Two-digit index, `"01"`…`"06"`.              |
| `name` | string | Dataset name. 3–5 words.                     |
| `body` | string | One-sentence description. ~15–30 words.      |

### 2.10 `vignette`

| Field      | Type              | Notes                                                     |
| ---------- | ----------------- | --------------------------------------------------------- |
| `eyebrow`  | string            | e.g. `"Case Vignette"`.                                   |
| `headline` | string            | Serif section title.                                      |
| `id`       | string            | Anonymized reference code.                                |
| `region`   | string            | Region tag shown as accent line.                          |
| `subject`  | string            | One-line case subject.                                    |
| `body`     | string            | Narrative. ~50–80 words.                                  |
| `stages`   | `{label, body}[]` | Exactly **4** items — the right panel is a 2×2 grid.      |
| `outcome`  | string            | One-line resolution, shown in a dedicated footer strip.   |

### 2.11 `coverage`

| Field       | Type              | Notes                                                     |
| ----------- | ----------------- | --------------------------------------------------------- |
| `eyebrow`   | string            | e.g. `"Coverage"`.                                        |
| `headline`  | string            | Section title.                                            |
| `body`      | string            | Right-column paragraph. ~25–45 words.                     |
| `legend`    | `{deep, selective, targeted}` | Descriptor strings for the footer legend.      |
| `countries` | `Country[]`       | 20–40 entries work well — one column per region.          |

**Country**

| Field     | Type   | Notes                                                              |
| --------- | ------ | ------------------------------------------------------------------ |
| `region`  | string | Column grouping (e.g. `"Africa"`, `"Central Asia"`, `"Southeast Asia"`). |
| `country` | string | Display name.                                                      |
| `depth`   | enum   | `"deep" \| "selective" \| "targeted"`. Drives the dot indicator.   |

### 2.12 `close`

| Field          | Type            | Notes                  |
| -------------- | --------------- | ---------------------- |
| `eyebrow`      | string          | e.g. `"Next"`.         |
| `headline`     | string          | Closing statement.     |
| `primaryCta`   | `{label, href}` | Solid button.          |
| `secondaryCta` | `{label, href}` | Outlined button.       |

### 2.13 `theme`

| Field          | Enum                                                     | Default    |
| -------------- | -------------------------------------------------------- | ---------- |
| `mode`         | `"light" \| "dark"`                                      | `"light"`  |
| `accent`       | `"indigo" \| "copper" \| "sage" \| "navy"`               | `"sage"`   |
| `networkFocus` | `"none" \| "chokepoint" \| "sanctions" \| "ownership"`   | `"none"`   |

All three are live-toggled via the Tweaks panel — this field only sets the **initial** state.

---

## 3 · Authoring rules

- **Headlines** use IBM Plex Serif. Short, declarative sentences work best.
- **Eyebrows** render uppercase/mono; write them in sentence case in the source.
- **Bodies** are Inter. Keep paragraph bodies to ~30–60 words.
- **Counts matter.** Hero stats = 3, focus = 3, chart `xLabels` = 7, chart `data` = 36 points, supply-chain stages = 4, datasets = 6, vignette stages = 4. Layouts assume these counts.
- **Graph positions.** In the supply-chain graph, spread `y` evenly within each stage column (`0.1`–`0.9`) and keep stages ordered left-to-right via `x`.
- **Flag hygiene.** Don't flag more than ~25% of nodes — the pulsing rings lose meaning when everything is flagged.
- **Heatmap diagonals.** Set diagonal cells to `1.00` and keep the matrix symmetric; the renderer draws a box around the diagonal for clarity.

---

## 4 · How the page loads content

At runtime the page reads `window.EM_CONTENT_SCHEMA` (populated by `em.schema.json.js`). To swap content without touching code:

1. Author a JSON file matching the schema above.
2. Before `em-app.jsx` loads, assign it:
   ```html
   <script>
     fetch('my-em-content.json')
       .then(r => r.json())
       .then(c => { window.EM_CONTENT_SCHEMA = c; });
   </script>
   ```
3. Ship.

> **Current build note:** the live page still reads from inline JSX and `em-data.js`. `em.schema.json.js` is the single source of truth going forward — migrating the components to read from `window.EM_CONTENT_SCHEMA` is a one-file change per section and is the next step.
