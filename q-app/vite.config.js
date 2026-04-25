import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Use './' so the build is portable to GitHub Pages subpaths and Azure Static
// Web Apps root paths without rebuilds.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        globalAssetMap: resolve(__dirname, 'global-asset-map.html'),
        alternativeAssets: resolve(__dirname, 'alternative-assets.html'),
        whistleblowerClaims: resolve(__dirname, 'whistleblower-claims.html'),
        emergingMarkets: resolve(__dirname, 'emerging-markets.html'),
      },
    },
  },
})
