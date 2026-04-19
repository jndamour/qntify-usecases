# Qntify · Use Cases — Deployment Guide

This folder is a ready-to-deploy static site. Four interactive use-case pages + a landing page, all self-contained (React + Babel loaded from CDN). No build step required.

## What's in this folder

```
deploy/
├── index.html                   ← landing page (links to the four use cases)
├── Global Asset Map.html        ← 3D asset map
├── Alternative Assets.html      ← legal claims thesis + rotating globe
├── Whistleblower Claims.html    ← pattern-detection pastiche + programs
├── Emerging Markets.html        ← supply-chain + frontier signals
│
├── *.jsx  *.js                  ← page scripts (referenced by the HTML files)
└── README.md                    ← this file
```

Every page is fully self-contained — the `.html` files reference their sibling `.jsx` / `.js` files by relative path and pull React, ReactDOM, Babel, and topojson-client from unpkg.

---

## Option A · Deploy to GitHub Pages *(free, with custom domain support)*

### 1. Create the repo

1. On [github.com](https://github.com), create a new repository. Any name works (e.g. `qntify-usecases`).
2. Set it to **Public** (GitHub Pages is free on public repos; paid plans allow private).

### 2. Push the contents of this folder

On your machine, from inside the `deploy/` folder:

```bash
git init
git add .
git commit -m "Initial deploy"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/qntify-usecases.git
git push -u origin main
```

Or just use GitHub's web UI — drag all the files in this folder into a fresh repo via the "uploading an existing file" link.

### 3. Enable GitHub Pages

1. In the repo, go to **Settings → Pages**.
2. Under **Source**, select **Deploy from a branch**.
3. Pick branch **`main`** and folder **`/ (root)`**. Save.
4. Wait ~1 minute. Your site will be live at:
   ```
   https://YOUR-USERNAME.github.io/qntify-usecases/
   ```

### 4. (Optional) Custom subdomain — e.g. `usecases.qntify.net`

1. In your domain registrar's DNS settings, add a **CNAME** record:
   - **Host**: `usecases`
   - **Points to**: `YOUR-USERNAME.github.io`
2. Back in GitHub **Settings → Pages**, under **Custom domain**, enter `usecases.qntify.net` and save. GitHub will auto-issue HTTPS after verification (a few minutes to an hour).

---

## Option B · Deploy to Netlify (no GitHub required)

1. Zip this folder.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag the zip onto the page.
4. You'll get a URL like `https://qntify-usecases.netlify.app` instantly.
5. Custom domain: **Domain settings → Add custom domain**, then update DNS per Netlify's instructions.

---

## Linking from your Squarespace site

Once deployed, add links in Squarespace pointing to your use-case pages.

### As navigation items

In Squarespace **Site → Navigation**, add external links:

- `https://usecases.qntify.net/Alternative%20Assets.html`
- `https://usecases.qntify.net/Whistleblower%20Claims.html`
- `https://usecases.qntify.net/Emerging%20Markets.html`
- `https://usecases.qntify.net/Global%20Asset%20Map.html`

> **Note**: URLs percent-encode spaces as `%20`. If you rename files, drop the spaces (`alternative-assets.html`) to keep URLs cleaner — just rename in both the filename and any `href` references.

### As embedded iframes (inline on a Squarespace page)

Add a **Code block** to your Squarespace page:

```html
<iframe src="https://usecases.qntify.net/Alternative%20Assets.html"
        style="width:100%; height:100vh; border:0; display:block;"
        loading="lazy"
        title="Alternative Assets — Qntify">
</iframe>
```

Works, but the nav bars on each page assume they have the full viewport. Linking out is generally cleaner than iframing.

---

## Renaming files (recommended for clean URLs)

The pages ship with spaces in filenames (`Alternative Assets.html`) to read nicely in the project pane. For production you probably want:

| From                         | To                         |
| ---------------------------- | -------------------------- |
| `Alternative Assets.html`    | `alternative-assets.html`  |
| `Whistleblower Claims.html`  | `whistleblower-claims.html`|
| `Emerging Markets.html`      | `emerging-markets.html`    |
| `Global Asset Map.html`      | `asset-map.html`           |

If you rename, also update:
1. The `href` attributes in **`index.html`** (the card grid).
2. Cross-page nav links inside each page's JSX nav (search the `.jsx` files for the old filenames and swap them).

---

## Updating content

Each page has a companion JSON-shaped schema that documents every editable string:

| Page                     | Schema file                | Docs             |
| ------------------------ | -------------------------- | ---------------- |
| Alternative Assets       | `content.schema.json.js`   | `SCHEMA.md`      |
| Whistleblower Claims     | `wb.schema.json.js`        | `SCHEMA-wb.md`   |
| Emerging Markets         | `em.schema.json.js`        | `SCHEMA-em.md`   |

> **Current state**: page components still read copy from their `*-data.js` / inline JSX. The schema files are the documented single source of truth and a target for a future refactor where the components read `window.*_CONTENT_SCHEMA` at mount time.

For now, to change copy: edit the corresponding `*-data.js` or the JSX file directly.

---

## Troubleshooting

- **Page is blank / "React is not defined"** — check that the HTML file and its sibling `.jsx` / `.js` files all uploaded. Each page needs ~5–7 sibling files to work.
- **Spaces in URLs break** — use `%20` (e.g. `Alternative%20Assets.html`) or rename files per above.
- **Fonts aren't loading** — pages load Inter, JetBrains Mono, IBM Plex Serif, and Barlow Condensed from Google Fonts. Needs internet access on the viewer's side.
- **iframe cut off** — iframes need an explicit height; `height: 100vh` is usually right for full-bleed use cases.
