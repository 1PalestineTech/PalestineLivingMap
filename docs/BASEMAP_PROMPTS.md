# Prompts for a commissioned painted base map (ChatGPT image / Midjourney)

For the optional "Tier 2" base: a hand-painted landscape that goes under our labels, roads, paths and events. Everything on top (names, towns,
borders, events) stays live from our data, so **the picture must contain no text, no symbols and no borders**. Whatever you generate is
a picture of the land, not a surveyed map, so we will warp it onto real coordinates with control points (coastline corners, the Sea of
Galilee, the Dead Sea, Gaza, Haifa bay). The closer the coast and lakes are to real, the better it fits.

## Step 0: give the generator the real shape

Fantasy-style generators invent coastlines. To stop that, upload a reference of the real land as an image prompt:

1. Use the ready-made shape references in `basemap-art/reference/` (made from our own elevation data, no names or borders; re-make them with `npm run build:reference-images`):
   - `land-relief.png`: shaded relief with the sea, the Sea of Galilee, the northern Dead Sea and the Gulf of Aqaba. Best for Midjourney and ChatGPT.
   - `land-silhouette.png`: flat land and sea only. Use it if the generator copies the relief colours too closely.
   Both are 1000 x 2500, north up, about lng 34.1 to 36.1 and lat 29.3 to 33.6. The southern Dead Sea basin is drawn as land (it is mostly salt pans).
2. In Midjourney: upload the image, copy its URL, put it first in the prompt and add `--iw 1.5` (image weight; raise it to 2 if the coast drifts). In ChatGPT: attach the image and say
   "use the attached image as the exact shape of the land and sea; keep the coastline, the Dead Sea and the Sea of Galilee where they are."
3. Generate in strips if the result is too small (north, centre, south), each overlapping about 15 percent, so we can stitch them.

## What the land looks like (for the prompt)

Seen from above, north at the top: the Mediterranean coast on the left (west), running nearly straight north to south, with the Carmel headland and the Bay of Acre in the north.
Inland: the hills of Galilee in the north, the wide flat Jezreel valley cutting across, then the long central hills (Samaria, Judea, Hebron) running north to south like a spine.
West of the hills a broad, flat coastal plain with orchards and sand dunes at Gaza. East of the hills the Jordan valley, a deep green strip with the Sea of Galilee in the north and
the long, narrow Dead Sea below it, then the pale Naqab (Negev) desert opening southward into a triangle that ends at the Gulf of Aqaba. East of the valley, the high plateau.

## Prompt A: hand-inked fantasy map (matches the "inked" look)

> Top-down antique hand-drawn map of a Mediterranean land, no text. Yellowed aged parchment with fold creases and stained edges. Brown ink engraving: dense hatched mountain ranges
> only along real ridges, rounded hills, olive groves as rows of small round trees, patchwork farm fields, small dark-green forests, pale ochre desert with sparse scrub, sand dunes along the southern coast, a grey-green sea with fine wave strokes and
> a heavier ink shoreline, a deep green Jordan valley, a narrow Dead Sea and a Sea of Galilee drawn as lakes, winding thin rivers and dry valleys. Soft watercolour washes: olive green on woodland,
> yellow-green on farmland, ochre on hills, grey-green sea. Flat orthographic view, evenly lit, no perspective. Do not draw any lettering, labels, symbols, compass, borders, roads, towns, castles, ships, creatures or people.
> Very high detail, muted colours, printed-map finish. Aspect ratio 2:5 (tall).

Midjourney line to add: `--ar 2:5 --style raw --v 7 --no text, letters, labels, border, frame, compass, buildings, people, ships, dragon` and, from Step 0, `--iw 1.5` with the reference image first.

## Prompt B: richer painted look (closer to a game-world illustration)

> Painted illustration of a real-world Mediterranean landscape seen straight from above, in the style of a fantasy-game world map: textured parchment sky-free background, softly shaded
> relief, forests as clustered painted tree canopies, olive groves, fields, cliffs on the Jordan valley edges, a blue-grey sea with foam along the shore, a dark teal Dead Sea. Warm light from the north-west.
> Strictly no text, no icons, no borders, no roads, no buildings, no figures, no animals. Subtle paper grain. Tall format.

## Variants to ask for

- **Dark version:** same prompt with "night chart: dark brown parchment, muted gold ink, deep blue-green sea".
- **Sea and land separately:** if the tool allows, a version with the sea painted solid grey-green and the land cut out, so we can recolour the sea per theme.
- **Texture sheets:** `seamless tileable parchment texture, aged yellowed paper, fold creases, no text` (for our paper overlay), and
  `seamless tileable hand-drawn hatching of mountain ranges on transparent background` (for relief marks).

## After generating

Send the files back (or drop them in a folder) and I will: cut the picture into map tiles, warp it to the real coordinates, place it under our layers behind a toggle, and check the size
against the performance budget (a painted base of this size is tens of megabytes, so it loads only when the reader picks it).

## Rights and honesty

- Check the generator's terms for commercial or public use of the output, and keep a note of the prompt and tool for the site's credits.
- Do not ask for, or upload, anyone else's artwork as a style reference. The prompts above name no artist or game on purpose.
- The picture is a decoration of the land. It must not be presented as a survey or as showing any boundary.
