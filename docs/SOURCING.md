# Sourcing Rules

These are the editorial rules for every event, story caption, and piece of UI copy.

## 1. Source tiers

**Preferred:** primary documents (treaties, resolutions, census and survey records,
archival papers); UN and OCHA reports; peer-reviewed history (journal articles,
university-press books); major archives and museums; established encyclopedias
(Britannica, Encyclopaedia of Islam, UNESCO).

**Acceptable with attribution:** reputable news outlets; NGOs; government statements,
labeled as such ("according to the Israeli government", "according to the Palestinian
Ministry of Health"); Wikipedia, only as a pointer to its cited sources or for
coordinates and name spellings, and replaced before an event is verified.

**Not acceptable:** anonymous or pseudonymous blogs and Q&A answers (including Quora),
social media posts, AI-generated text. These can point to sources; they are never cited.

Books are cited by title, author, publisher, ISBN, and page, with a URL to the
publisher, a library catalogue, or a lawful copy. Never link pirated copies.

## 2. Balance rule

For contested events or figures, cite at least two sources from different perspectives
and write each disputed claim with attribution ("according to X"). Use the
`perspectives` field for each view, with its own source. State as fact only what the
sources agree on.

## 3. Numbers rule

Casualty, population, displacement, and land figures always name their source and
date ("about 700,000, according to X, 2020"). Where sources differ, give the range and
name each end. For ongoing events, show the "as of" date and prefer UN or OCHA figures.

## 4. Naming rule

Every location has its common English name first, its Arabic name, and its Hebrew name
where one exists. Names used at the time of the event go in `historicalNames`. Use the
same name for the same place and group across the whole dataset.

## 5. Dating rule

Use `datePrecision` honestly. Never invent a day or month. If sources disagree, use the
precision they agree on, mark `circa` if they say "about", and explain in `editorNote`.

## 6. Review checklist (before status "verified")

- [ ] Every source URL loads and was read in full, not just a snippet.
- [ ] Each source supports the title, date, place, and summary it is cited for.
- [ ] Date precision matches what the sources say.
- [ ] Coordinates come from a source, or are marked `approximate` with a note.
- [ ] Figures name a source and date, with ranges where sources differ.
- [ ] Contested points have two or more perspectives with attribution.
- [ ] Wording is neutral; no loaded terms in our own voice.
- [ ] Text is in our own words; nothing copied.
- [ ] Names are consistent with the rest of the dataset.
- [ ] Any image has a license and credit that allow reuse.
- [ ] `npm run validate` passes.

## 7. Image rights

Use only public-domain, openly licensed (for example CC BY or CC BY-SA), or self-made
images. Record the credit, license, and source page for each, and show the credit in the
app. Don't hotlink; store approved images in the project.

## 8. Names and geometry

Rules for the data behind the map: era place names now, and paths and region boundaries as
they arrive (`docs/SPEC_MAP_V2.md` sections 4, 5 and 7).

**Place names (`public/data/places.json`)**

- Each name needs a source that attests the name in use in that span: an inscription, coin,
  text, map, or a scholarly work that says so. Masalha's chapters are the first stop for
  ancient through Ottoman names; cite the book, publisher, ISBN and page. Never cite or link
  Quora, and never copy text.
- Spans follow the evidence: the first and last attestation, or the political change that
  brought the name in or out (cite it). Set `fromCirca` and `toCirca` honestly.
- Never back-project a name to a period where no source attests it. A name with no dated
  attestation gets `from: null`; it stays on the place card as "Dates not yet sourced" and is
  never drawn.
- Where a source says only "later" or gives no end date, say so in the name's `note`, and
  mark the place `needs-review`. If a span end is set to the year before the next name
  begins (so the two do not overlap), the note says that too.
- Spellings follow Palestine Remembered (`docs/place-names.md`). Arabic is given for every
  name where an Arabic form exists; `ar: null` needs a note.
- Where the naming is itself contested (for example Hebraized names given to Palestinian
  places after 1948, Masalha chapter 10), the name's note states who used which name, with
  attribution, and a second perspective is added.
- Hebrew is never stored or shown on the map.

**Paths and boundaries**

- Every waypoint of a path is a place named in a source for that event. A schematic line never implies a precise road; the card always says it is approximate. Displacement routes are drawn only where sources document the route, never inferred from where people ended up.
- Geometry comes only from a published dataset or map whose licence allows reuse. Record
  where it came from. Lines traced by hand are labelled approximate.
- Never trace from a copyrighted atlas without permission; Abu Sitta's *Atlas* is cited for
  facts, not traced.
- Ancient and medieval regions without a sourced map stay as labels only; no guessed
  polygons.
