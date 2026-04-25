# Qntify Use Cases · Vite multi-page build

Production bundle for the five use-case pages. Replaces the inline-Babel
prototypes that live at the repo root.

## Layout

```text
q-app/
├── index.html                  ← landing (static HTML)
├── global-asset-map.html       ← entry → src/global-asset-map/main.jsx
├── alternative-assets.html     ← entry → src/alternative-assets/main.jsx
├── whistleblower-claims.html   ← entry → src/whistleblower-claims/main.jsx
├── emerging-markets.html       ← entry → src/emerging-markets/main.jsx
├── public/assets/              ← static images (copied verbatim to dist/assets/)
├── src/
│   ├── shared/                 ← ui primitives + worldmap loader
│   ├── nexus-graph/            ← NexusGraph component (ported from /NexusGraph/)
│   └── <page>/                 ← per-page App.jsx, main.jsx, data, sub-components
└── vite.config.js              ← multi-page rollup input + base: './'
```

`base: './'` makes the build portable to GitHub Pages subpaths and Azure
Static Web Apps root paths without needing a rebuild for each target.

## Develop

```bash
npm install
npm run dev          # http://localhost:5173/
# to stop the dev server use Ctrl+C in the terminal window
```

The dev server serves all five pages. Use `index.html` to navigate, or hit
`/global-asset-map.html` etc. directly.

## Build

```bash
npm run build        # → dist/
npm run preview      # serve the dist/ build locally
```

## Deploy

### GitHub Pages

1. Enable Pages for the repo under **Settings → Pages**.
2. Easiest path: GitHub Actions workflow that builds `q-app/` and publishes
   `q-app/dist/` to the `gh-pages` branch (or uses the official Pages
   deploy action). Minimal workflow:

   ```yaml
   # .github/workflows/pages.yml
   name: Deploy to GitHub Pages
   on: { push: { branches: [main] } }
   permissions: { contents: read, pages: write, id-token: write }
   concurrency: { group: pages, cancel-in-progress: true }
   jobs:
     build:
       runs-on: ubuntu-latest
       defaults: { run: { working-directory: q-app } }
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with: { node-version: 20, cache: npm, cache-dependency-path: q-app/package-lock.json }
         - run: npm ci
         - run: npm run build
         - uses: actions/upload-pages-artifact@v3
           with: { path: q-app/dist }
     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment: { name: github-pages, url: '${{ steps.deployment.outputs.page_url }}' }
       steps:
         - id: deployment
           uses: actions/deploy-pages@v4
   ```

3. The site will live at `https://<user>.github.io/<repo>/`. Inter-page
   links and asset paths are relative, so the subpath works.

### Azure Static Web Apps

1. Create a new Static Web App in Azure, point it at the repo, set:
   - **App location**: `q-app`
   - **Output location**: `dist`
   - **Build command**: (left blank — Azure runs `npm run build` automatically when it sees `vite`)
2. Azure's GitHub Actions integration will commit a workflow file. No
   `base` change needed: the same `dist/` works at Azure's root path.

## Notes

- `topojson-client` and the world atlas are loaded at runtime; the global
  asset map and alternative-assets globe both depend on this. The world
  data is fetched from `cdn.jsdelivr.net`. If you need to ship offline,
  download `world-atlas/countries-110m.json` to `public/` and update
  `src/shared/worldmap.js` to fetch it locally.
- The `EDITMODE-BEGIN/END` comment markers and `__activate_edit_mode`
  postMessage handler in each App are preserved from the prototypes —
  they're harmless in production (the listeners do nothing without a
  parent frame) and let the original tweaks-host workflow keep working.
