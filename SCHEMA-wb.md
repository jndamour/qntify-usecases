# Content Schema — Qntify Whistleblower Claims page

Every user-editable element on `Whistleblower Claims.html` is driven by a single content object. A reference copy lives in **`wb.schema.json.js`** (`window.WB_CONTENT_SCHEMA`). Copy it, edit the values, and you've changed the page.

---

## 1 · File shape

```jsonc
{
  "$schema":         "qntify-whistleblower/1.0",
  "brand":           { … },   // nav + footer chrome
  "hero":            { … },   // top of page
  "pastiche":        { … },   // "Pattern Detection" section + clippings + case callout
  "typology":        { … },   // 8-cell recurring-pattern grid
  "programs":        { … },   // SEC / CFTC / FinCEN table
  "confidentiality": { … },   // 4-pillar source-protection section
  "close":           { … },   // closing statement + CTAs
  "theme":           { … }    // default mode, accent, callout variant
}
```

---

## 2 · Field reference

### 2.1 `brand`

| Field         | Type              | Notes                                                  |
| ------------- | ----------------- | ------------------------------------------------------ |
| `name`        | string            | Wordmark. Renders as `Q·ntify` (accent dot on the Q).  |
| `tagline`     | string            | Left side of footer.                                   |
| `footerLinks` | string            | Right side of footer. Plain separator-delimited text.  |
| `navLinks`    | `{label, href, active?}[]` | Top-nav items. Mark current page with `active: true`. |

### 2.2 `hero`

| Field      | Type                       | Notes                                                                          |
| ---------- | -------------------------- | ------------------------------------------------------------------------------ |
| `eyebrow`  | string                     | Mono uppercase label above headline. Keep short (<30 chars).                   |
| `headline` | string                     | Serif display. Use `{em}…{/em}` to italicize in the accent color (one pair).   |
| `lede`     | string                     | Sub-headline paragraph. ~35–55 words.                                          |
| `stats`    | `{value, label}[]`         | Exactly **3** items. Value is serif/large, label is mono/small.                |
| `focus`    | `{tag, label}[]`           | Exactly **3** focus-area tags. `tag` is mono/upper; `label` is longform.       |

### 2.3 `pastiche`

The animated "Pattern Detection" section. Five newspaper-style clippings drift on a paper background; highlighters pulse in sequence, then connector lines trace to a central **Case Callout** which flashes.

| Field          | Type           | Notes                                                                        |
| -------------- | -------------- | ---------------------------------------------------------------------------- |
| `eyebrow`      | string         | e.g. `"Pattern Detection"`.                                                  |
| `headline`     | string         | Section title.                                                               |
| `body`         | string         | Right-column paragraph. ~35–55 words.                                        |
| `clippings`    | `Clipping[]`   | Exactly **5** items. Animation timing assumes 5.                             |
| `caseCallouts` | `CalloutMap`   | Three named variants: `standard`, `dossier`, `narrative`. Switched via tweak.|

**Clipping**

| Field        | Type                          | Notes                                                                      |
| ------------ | ----------------------------- | -------------------------------------------------------------------------- |
| `id`         | string                        | Stable identifier. Any scheme (`CLIP-A`, `CLIP-B`, …).                    |
| `kicker`     | string                        | Tiny mono uppercase kicker above the headline. `SECTION · REGION` format.  |
| `headline`   | string                        | Serif clipping headline. One line works best; keep under ~70 chars.        |
| `body`       | string                        | Paragraph body. ~40–60 words. Character offsets in `highlights` match this.|
| `highlights` | `{start, end}[]`              | 1–2 ranges of character indices into `body` to receive highlighter pulse.  |
| `tag`        | enum-ish                      | One of `"POL-CORR" \| "CORP-FRAUD" \| "TBML"` (typology classifier).       |
| `x`          | number                        | Horizontal position on paper, `0.0`–`1.0`.                                 |
| `y`          | number                        | Vertical position, `0.0`–`1.0`.                                            |
| `rot`        | number                        | Tilt in degrees. Small values (`-3`…`+3`) look natural.                    |
| `w`          | number                        | Width in px (`300`–`360` typical).                                         |

Character-offset tip: open the body string, count to the first character of the phrase you want highlighted, count through its last character, and use those indices. One or two highlight ranges per clipping produces the cleanest pulse rhythm.

**Callout variants (`caseCallouts`)**

The tweak panel switches between three callout layouts. All three carry the same case `id` but emphasize different framings:

| Variant     | Fields                                                                            | When to use                         |
| ----------- | --------------------------------------------------------------------------------- | ----------------------------------- |
| `standard`  | `id`, `program`, `statute`, `sanctionRange`, `jurisdictions[]`, `status`          | Default. Regulator-framed summary.  |
| `dossier`   | `id`, `subject`, `program`, `statute`, `projectedAward`, `stage`                  | Source/counsel-framed brief.        |
| `narrative` | `id`, `headline`, `body`                                                          | Editorial/story-framed recap.       |

### 2.4 `typology`

| Field      | Type            | Notes                                                |
| ---------- | --------------- | ---------------------------------------------------- |
| `eyebrow`  | string          | e.g. `"Typology"`.                                   |
| `headline` | string          | Section title.                                       |
| `items`    | `Typology[]`    | Exactly **8** items — the design assumes 4×2 grid.  |

**Typology**

| Field  | Type   | Notes                                          |
| ------ | ------ | ---------------------------------------------- |
| `n`    | string | Two-digit index, `"01"`…`"08"`.                |
| `name` | string | Pattern name. ~2–4 words.                      |
| `body` | string | 1-sentence description. ~12–20 words.          |

### 2.5 `programs`

| Field      | Type         | Notes                                                     |
| ---------- | ------------ | --------------------------------------------------------- |
| `eyebrow`  | string       | e.g. `"Programs"`.                                        |
| `headline` | string       | Section title.                                            |
| `body`     | string       | Right-column paragraph. ~30–50 words.                     |
| `items`    | `Program[]`  | **3** rows (the table design assumes 3).                  |

**Program**

| Field     | Type   | Notes                                               |
| --------- | ------ | --------------------------------------------------- |
| `abbr`    | string | 3–6 letter abbreviation.                            |
| `name`    | string | Full program name.                                  |
| `statute` | string | Governing statute + year.                           |
| `scope`   | string | 1-sentence coverage description.                    |
| `award`   | string | Award formula, free-form.                           |
| `note`    | string | 1-sentence caveat / addendum.                       |

### 2.6 `confidentiality`

| Field      | Type         | Notes                                                  |
| ---------- | ------------ | ------------------------------------------------------ |
| `eyebrow`  | string       | e.g. `"Confidentiality"`.                              |
| `headline` | string       | Section title.                                         |
| `pillars`  | `Pillar[]`   | Exactly **4** items — design assumes 2×2 grid.         |

**Pillar**

| Field   | Type   | Notes                                          |
| ------- | ------ | ---------------------------------------------- |
| `n`     | string | Two-digit index, `"01"`…`"04"`.                |
| `label` | string | Pillar name. 2–4 words.                        |
| `body`  | string | 1-sentence explanation. ~15–25 words.          |

### 2.7 `close`

| Field          | Type              | Notes                  |
| -------------- | ----------------- | ---------------------- |
| `eyebrow`      | string            | e.g. `"Next"`.         |
| `headline`     | string            | Closing statement.     |
| `primaryCta`   | `{label, href}`   | Solid button.          |
| `secondaryCta` | `{label, href}`   | Outlined button.       |

### 2.8 `theme`

| Field     | Enum                                         | Default      |
| --------- | -------------------------------------------- | ------------ |
| `mode`    | `"light" \| "dark"`                          | `"light"`    |
| `accent`  | `"indigo" \| "copper" \| "sage" \| "navy"`   | `"copper"`   |
| `callout` | `"standard" \| "dossier" \| "narrative"`     | `"standard"` |

All three are live-toggled via the Tweaks panel — this field only sets the **initial** state.

---

## 3 · Authoring rules

- **Headlines** use IBM Plex Serif. Short, declarative sentences work best.
- **Eyebrows** render uppercase/mono; write them in sentence case in the source.
- **Bodies** are Inter. Keep paragraph bodies to ~30–60 words.
- **Counts matter.** Hero stats = 3, focus = 3, clippings = 5, typology = 8, programs = 3, pillars = 4. The layouts assume these counts.
- **Clipping positions** (`x`, `y`, `rot`, `w`) must read as a scattered newsroom paste-up. Avoid overlaps by keeping `x` gaps ≥ 0.25 or staggering `y`.
- **Highlight offsets** are character indices into the clipping `body`. Off-by-one will still render, but the highlighter will clip mid-word — proofread after edits.

---

## 4 · How the page loads content

At runtime the page reads `window.WB_CONTENT_SCHEMA` (populated by `wb.schema.json.js`). To swap content without touching code:

1. Author a JSON file matching the schema above.
2. Before `wb-app.jsx` loads, assign it:
   ```html
   <script>
     fetch('my-wb-content.json')
       .then(r => r.json())
       .then(c => { window.WB_CONTENT_SCHEMA = c; });
   </script>
   ```
3. Ship.

> **Current build note:** the live page still reads copy from inline JSX and `wb-data.js`. `wb.schema.json.js` is the single source of truth going forward — migrating the components to read from `window.WB_CONTENT_SCHEMA` is a one-file change per section and is the next step.
