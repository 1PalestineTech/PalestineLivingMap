# Deploying (Phase 11)

The site is static: `npm run build` writes `dist/`, which any static host can serve from any path (`base: './'` in `vite.config.ts`).

## GitHub Pages (set up, not yet run)

`.github/workflows/pages.yml` validates the data, type-checks, runs the tests, builds and publishes `dist/` on every push to `main`.
One-time setup by the owner: push the repository to GitHub, then Settings > Pages > Source: "GitHub Actions".

## Before going public (owner)

- Replace the preview-image and URL placeholders (`og:url`, `og:image`) in `index.html` once the address is known.
- Confirm licences listed in `docs/REGION_SOURCES.md` and `docs/VILLAGE_SOURCES.md` for anything shipped, and the 1946 sheet's edition.
- Check the attribution text on the map (basemap, terrain, fonts) is still complete (`docs/TERRAIN.md`, `docs/GLYPHS.md`).
- The map still loads the basemap tiles and style from OpenFreeMap and the web fonts from Google Fonts; both are external services.
- Self-hosting the UI fonts (Cormorant Garamond, IBM Plex Sans) would remove the Google Fonts request and its layout-shift risk; the font files
  were not downloaded.

## Build settings (environment variables)

- `VITE_SITE_URL`: the public address of the site, ending in a slash (for example `https://example.org/map/`). Chat apps such as Discord need the full address to show the share preview (`preview.png`); without it the preview image link is relative and will not show in chats.
- `VITE_DISCORD_URL`: the Discord invite link; adds "Join the discussion" to the About panel.
- `VITE_FEEDBACK_POST_URL`: an endpoint that takes reports and forwards them to a Discord webhook. See `docs/DISCORD_SETUP.md` for all the options.
- `VITE_FEEDBACK_URL`: where "Report a mistake" goes. `mailto:you@example.org` opens the reader's mail app with the report filled in; an `https://` link (for example a Discord channel link) is opened after the report is copied. With none set, the report is only copied and the reader is told to paste it in the map channel.

Example: `VITE_SITE_URL=https://example.org/map/ VITE_FEEDBACK_URL=mailto:you@example.org npm run build`

The share-preview picture is made by `npm run build:preview` (`public/preview.png`, 1200 x 630).

## Speed

A "light mode" starts automatically on narrow screens and on devices that report four processor threads or fewer: pixel ratio 1, no sea ships, no finest hill marks, no farmland and grove patterns, no label fade. `?lite=1` forces it on and `?lite=0` off. The map opens flat (no 3D terrain), which is the biggest saving. If one browser is much slower than another (for example Chrome, Brave or Opera against Edge), the usual cause is that hardware graphics acceleration is off there: check `chrome://gpu` (or `brave://gpu`, `opera://gpu`) for "WebGL: Hardware accelerated" and the browser's setting "Use graphics acceleration when available".
