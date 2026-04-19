# Content Schema — Qntify Alternative Assets page

Every user-editable element on `Alternative Assets.html` is driven by a single content object. A reference copy lives in **`content.schema.json.js`** (`window.CONTENT_SCHEMA`). Copy it, edit the values, and you've changed the page.

---

## 1 · File shape

```jsonc
{
  "$schema":   "qntify-alt-assets/1.0",
  "brand":     { … },   // navigation + footer chrome
  "hero":      { … },   // top of page
  "partI":     { … },   // section opener for Legal Claims
  "relationshipGraph": { … },  // "Anatomy of a Claim" network diagram
  "lifecycle": { … },   // 5-stage process flow
  "caseBook":  { … },   // rotating globe + case panel
  "close":     { … },   // closing statement + CTAs
  "theme":     { … }    // default mode & accent
}
```

---

## 2 · Field reference

### 2.1 `brand`

| Field          | Type     | Notes                                                |
| -------------- | -------- | ---------------------------------------------------- |
| `name`         | string   | Wordmark. Renders as `Q·ntify` (accent dot on the Q).|
| `tagline`      | string   | Left side of footer.                                 |
| `footerLinks`  | string   | Right side of footer. Plain separator-delimited text.|
| `navLinks`     | `{label, href}[]` | Top-nav items. 3–5 works best.              |

### 2.2 `hero`

| Field      | Type     | Notes                                                                                |
| ---------- | -------- | ------------------------------------------------------------------------------------ |
| `eyebrow`  | string   | Mono uppercase label above headline. Keep short (<30 chars).                         |
| `headline` | string   | Serif display. Use `{em}…{/em}` to italicize in the accent color (one pair max).     |
| `lede`     | string   | Sub-headline paragraph. ~45–60 words.                                                |
| `stats`    | `{value, label}[]` | Exactly **3** items. `value` is serif/large, `label` is mono/small.        |

### 2.3 `partI`

| Field      | Type   | Notes                                                   |
| ---------- | ------ | ------------------------------------------------------- |
| `eyebrow`  | string | e.g. `"Part I"`.                                        |
| `headline` | string | Serif section title.                                    |
| `body`     | string | Right-column paragraph. ~60–90 words.                   |

### 2.4 `relationshipGraph`

Renders the "Anatomy of a Claim" network diagram.

| Field    | Type                  | Notes                                                |
| -------- | --------------------- | ---------------------------------------------------- |
| `label`  | string                | Mono uppercase label above the diagram.              |
| `nodes`  | `Node[]`              | See schema below.                                    |
| `edges`  | `[fromId, toId][]`    | Directed connections. IDs must match node `id`s.     |

**Node**

| Field   | Type   | Notes                                                                                              |
| ------- | ------ | -------------------------------------------------------------------------------------------------- |
| `id`    | string | Unique.                                                                                            |
| `label` | string | Primary name. Serif.                                                                               |
| `sub`   | string | Single-line descriptor. Mono.                                                                      |
| `x`     | number | Horizontal position, `0.0`–`1.0` (0 = left edge).                                                  |
| `y`     | number | Vertical position, `0.0`–`1.0` (0 = top).                                                          |
| `kind`  | enum   | One of `"origin" \| "counsel" \| "forum" \| "obligor" \| "asset"`. Controls shape, fill, and text. |

Typical layout: group x-columns by role (claimant on far left, counsels next, forums in the middle, obligor, recoverables on the right) and spread y within each column.

### 2.5 `lifecycle`

| Field      | Type        | Notes                                                           |
| ---------- | ----------- | --------------------------------------------------------------- |
| `eyebrow`  | string      | e.g. `"Process"`.                                               |
| `headline` | string      | Section title.                                                  |
| `stages`   | `Stage[]`   | Exactly **5** items (the design assumes 5 columns).             |

**Stage**

| Field   | Type   | Notes                                          |
| ------- | ------ | ---------------------------------------------- |
| `n`     | string | Two-digit index, `"01"`…`"05"`.                |
| `title` | string | Stage name.                                    |
| `body`  | string | 1–2 sentences. ~18–30 words.                   |

### 2.6 `caseBook`

Drives both the rotating globe and the right-hand detail panel.

| Field      | Type     | Notes                                                                          |
| ---------- | -------- | ------------------------------------------------------------------------------ |
| `eyebrow`  | string   | e.g. `"Case Book"`.                                                            |
| `headline` | string   | Section title.                                                                 |
| `body`     | string   | Short intro, 1–2 sentences.                                                    |
| `cases`    | `Case[]` | **4–12** items. The globe cycles one every 4.2s and paces the progress strip. |

**Case**

| Field          | Type    | Notes                                                             |
| -------------- | ------- | ----------------------------------------------------------------- |
| `id`           | string  | Anonymized reference code (e.g. `"C-2024-011"`).                 |
| `jurisdiction` | string  | City + country/court name. Shown as the case's display title.     |
| `lat`          | number  | Latitude, `-90`–`90`. Plots the pin on the globe.                 |
| `lon`          | number  | Longitude, `-180`–`180`.                                          |
| `type`         | string  | e.g. `"Commercial arbitration"`. Short.                           |
| `duration`     | string  | Free-form, e.g. `"2.4 yrs"`.                                      |
| `outcome`      | string  | e.g. `"Award issued"`, `"Settled"`, `"Pending"`.                  |
| `status`       | string  | e.g. `"Active"`, `"Closed"`, `"Enforcement"`.                     |

### 2.7 `close`

| Field          | Type          | Notes                                   |
| -------------- | ------------- | --------------------------------------- |
| `eyebrow`      | string        | e.g. `"Next"`.                          |
| `headline`     | string        | Closing display statement.              |
| `primaryCta`   | `{label, href}` | Solid button.                         |
| `secondaryCta` | `{label, href}` | Outlined button.                      |

### 2.8 `theme`

| Field    | Enum                                         | Default    |
| -------- | -------------------------------------------- | ---------- |
| `mode`   | `"light" \| "dark"`                          | `"light"`  |
| `accent` | `"indigo" \| "copper" \| "sage" \| "navy"`   | `"indigo"` |

Both can be live-toggled via the Tweaks panel — this field only sets the **initial** state.

---

## 3 · Authoring rules

- **Headlines** use IBM Plex Serif. Short, declarative sentences work best. 8–14 words for section headlines, up to 20 for the hero.
- **Eyebrows** are rendered uppercase/mono. Write them in sentence case in the source; CSS handles the transformation.
- **Bodies** are Inter. Keep paragraph bodies to ~50–90 words.
- **IDs** in `relationshipGraph.nodes` must be unique and match all references in `edges`. The graph silently drops edges with unknown IDs.
- **Counts matter.** Hero stats = 3, lifecycle stages = 5, case book = 4–12. Any fewer and the layout looks thin; more and spacing breaks.

---

## 4 · How the page loads content

At runtime the page reads `window.CONTENT_SCHEMA` (populated by `content.schema.json.js`). To swap content without touching code:

1. Author a JSON file matching the schema above.
2. Before `alt-app.jsx` loads, assign it:
   ```html
   <script>
     fetch('my-content.json')
       .then(r => r.json())
       .then(c => { window.CONTENT_SCHEMA = c; });
   </script>
   ```
3. Ship.

> **Current build note:** the live page still reads copy from inline JSX and `alt-data.js`. `content.schema.json.js` is the single source of truth going forward — migrating the components to read from `window.CONTENT_SCHEMA` is a one-file change per section and is the next step.
