# New Pages — About + Request Demo

Standalone deployment for the two new pages, isolated from the rest of the site.

## Files
- `About.html` — About page (founders + partner bench)
- `Request Demo.html` — Demo request page (Split + Bold layouts, Tweaks-toggleable)
- `demo-page.jsx` — React app for the demo page (loaded via Babel)
- `tweaks-panel.jsx` — Tweaks panel helper

## Hosting
Drop the entire folder onto any static host. Both HTML files are entry points; relative links between them work as-is.

The demo page links to itself via `Request Demo.html` and the About page links to it. Update the `<a href="https://jndamour.github.io/qntify-usecases/">` topbar links if you publish this elsewhere.
