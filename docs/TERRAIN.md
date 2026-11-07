# Terrain tiles (Phase 13)

The painted terrain on the map comes from elevation tiles that ship with the site in
`public/terrain/`. Nothing at runtime or build time contacts an outside terrain server.

## What the tiles are

- **Format:** Terrarium-encoded PNG, `height (m) = R * 256 + G + B / 256 - 32768`.
- **Zoom:** 5 to 9 (`TERRAIN_MIN_ZOOM`, `TERRAIN_MAX_ZOOM` in `src/data/frame.ts`). The map
  overzooms beyond 9. Size: 366 tiles, 17.8 MB.
- **Zoom 10 was tried and left out:** it adds about 920 tiles and 36 MB (about 54 MB in total), well
  over the 20 MB budget in `docs/SPEC_MAP_V2.md` section 3.2.
- **Area:** the bounding box of the edge-fade frame (`frameBounds()` in `src/data/frame.ts`),
  about 29.6-40.4°E and 26.9-35.9°N. The map source declares these bounds, so no tile outside it is
  ever requested.
- **Processing:** `scripts/build-terrain.ts` rounds heights to whole metres (the blue channel is
  zeroed) and flattens everything below -440 m to -440 m. That only touches the sea floor, which the
  water layer hides; the lowest land, the Dead Sea shore, is about -430 m. This cut the pyramid
  from about 21 MB to 11.7 MB at zoom 9.

## Source and version

- **Dataset:** AWS Terrain Tiles (the Mapzen / Tilezen "Joerd" terrain tiles, Terrarium format),
  <https://registry.opendata.aws/terrain-tiles/>, bucket `elevation-tiles-prod`.
- **Downloaded:** 2026-11-04, once, by `npm run build:terrain`. The bucket is unversioned, so this
  date is the version.
- **Underlying data in this region** (per the Tilezen data-sources and attribution documents):
  SRTM and GMTED2010 (U.S. Geological Survey) for land, ETOPO1 (NOAA) for the sea floor, and
  EU-DEM (Copernicus) over Cyprus.

## Licence

- SRTM, GMTED2010 and ETOPO1 are US Government works, distributed without restriction. USGS asks
  for credit when the data is redistributed or published, and GMTED2010 users who modify the data
  must describe the changes (see Processing above).
- **One caveat:** the original SRTM distribution notice says copyright is asserted outside the
  United States. USGS and the Tilezen project treat SRTM as public domain, and so does this
  project, but the owner should know the wording exists.
- EU-DEM is free to use and redistribute with the attribution below.
- The data is not for navigation, and the tiles are not a survey product.

## Attribution text (shown in the map attribution)

> Terrain: SRTM and GMTED2010 data courtesy of the U.S. Geological Survey; ETOPO1 data, NOAA;
> Cyprus: produced using Copernicus data and information funded by the European Union (EU-DEM).
> Heights rounded to whole metres.

The same text lives in `TERRAIN_ATTRIBUTION` in `src/map/terrain.ts`.

## Rebuilding

```bash
npm run build:terrain
```

It downloads about 97 MB of raw tiles for zoom 5-10 (about 29 MB for 5-9), re-encodes them and writes
`public/terrain/`. Existing output files are skipped; delete `public/terrain/` to rebuild. Add
`--raw some/folder` to cache the untouched downloads.

## Two small derived files

Both are built from the committed zoom-9 tiles, with no download, and both are committed.

- **`public/terrain-sea/`** (`npm run build:sea-mask`, 110 tiles, 0.26 MB): how far each point of the
  open sea is from the nearest coast, for the dark coastal stain of the strong style. The Dead Sea
  and the Jordan valley are left out on purpose. It is a stain strength, not a height.
- **`public/data/relief-marks.json`** (`npm run build:relief-marks`, about 150 KB): where the strong
  style draws its hachure hill and mountain marks. They are decoration placed where the ground
  rises 200 m or more within a few kilometres; they are not a map of named mountains.
