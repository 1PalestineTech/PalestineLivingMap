# Offline edition

A copy of the map that runs on someone else's computer with no internet. Built for sending to people.

## Make the package

```bash
npm run package:offline
```

Output (git-ignored, in `share/`):

- `PalestineLivingMap-offline.zip` (about 18 MB): send this.
- `PalestineLivingMap-offline/`: the same, unzipped.
  - `site/`: the offline build of the map.
  - `open-map.bat` + `serve.ps1`: Windows launcher (a tiny local server written in PowerShell, nothing to install).
  - `open-map.command`: Mac / Linux launcher (needs Python 3).
  - `README.txt`: plain instructions for the recipient.

## Why a launcher and not just index.html

Browsers refuse to let a page read its own JSON data and map tiles when opened from `file://`. The launcher serves the folder on `http://localhost:5175/`; nothing leaves the computer.

## What differs from the online site

The script runs `vite build --mode offline`, which sets `VITE_OFFLINE=true`:

- The basemap is a local copy of the OpenFreeMap tiles (OpenStreetMap data, ODbL) for the map frame at zoom 0 to 10, 279 tiles, saved by `npm run fetch:basemap-tiles` into `offline-assets/basemap/` (the tiles are git-ignored; `style.json` is kept). The package copies them to `site/basemap/`, and the map reads the same "positron" style as the online site, so roads, borders, lakes and modern names are all there, magnified beyond zoom 10.
- `src/map/offline.ts` is now only a fallback style (land from elevation) used if that copy is missing.
- `vite.config.ts` (`dropExternalLinks`) strips the Google Fonts links from `index.html`, so page text uses the device's own fonts.
- Source maps are not emitted.
- Not included: the online map's finest detail (small roads and streets beyond zoom 10).

## Checked

Served the built folder and loaded it at 1946: all requests stay on localhost, the canvas renders, no console errors.

## If you change the map

Re-run `npm run package:offline` and resend the zip. Data changes (`public/data/*.json`) need no code change.
