// MapLibre's stylesheet first, so our map.css overrides win the cascade.
import 'maplibre-gl/dist/maplibre-gl.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/map.css';
import './styles/paper.css';
import './styles/timeline.css';
import './styles/panel.css';
import './styles/story.css';
import './styles/rtl.css';
import './styles/filters.css';
import './styles/search.css';
import './styles/list.css';
import './styles/about.css';
import './styles/labels.css';
import './styles/threads.css';

import { LoadEventsError, loadEvents } from './data/loadEvents.ts';
import { loadLayers } from './data/loadLayers.ts';
import { loadPaths } from './data/loadPaths.ts';
import { loadPlaces } from './data/loadPlaces.ts';
import { loadStories } from './data/loadStories.ts';
import { loadThreads } from './data/loadThreads.ts';
import { initFilters } from './filters/index.ts';
import { initEventList } from './list/index.ts';
import { initLayerToggles } from './filters/layerToggles.ts';
import { initControlToggle } from './filters/control.ts';
import { initLakesToggle } from './filters/lakes.ts';
import { initDistrictToggles } from './filters/districts.ts';
import { initCompare } from './compare.ts';
import { initEmbed } from './embed.ts';
import { initWhatsNewBadge } from './whatsNew.ts';
import { initLanguage } from './i18n.ts';
import { initShareButton } from './share.ts';
import { initIllustratedToggle } from './filters/illustrated.ts';
import { initSettlementsToggle } from './filters/settlements.ts';
import { savedIllustrated } from './map/illustrated.ts';
import { preloadBaseStyle } from './map/style.ts';
import { initPanel } from './panel/index.ts';
import { initSearch } from './search/index.ts';
import { initStory } from './story/index.ts';
import { getState, setState } from './state.ts';
import { applySavedTheme, initThemeToggle } from './theme.ts';
import { clearStatus, showStatus } from './status.ts';
import { initThreads } from './threads/index.ts';
import { initTimeline } from './timeline/index.ts';
import { createScale } from './timeline/scale.ts';
import { restoreFromHash, syncHash } from './urlHash.ts';

function requireEl(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing #${id} in index.html`);
  return el;
}

function initChrome(): void {
  applySavedTheme();
  initThemeToggle(requireEl('theme-button'));
  requireEl('about-button').addEventListener('click', () => {
    void import('./about/index.ts').then((about) => about.openAbout());
  });
}

async function start(): Promise<void> {
  initEmbed(); // before anything that reads the embed flag (the story autostart)
  clearStatus();
  try {
    // One round trip for everything the first paint needs: events, the optional overlays and era
    // labels (empty if missing) and the basemap style all download together.
    // The map code (MapLibre is the bulk of the download) loads as its own chunk, in parallel, so the
    // timeline and top bar can paint without waiting for it.
    const mapModule = import('./map/index.ts');
    preloadBaseStyle();
    const [{ events, problems }, layers, places, paths] = await Promise.all([loadEvents(), loadLayers(), loadPlaces(), loadPaths()]);
    const threads = loadThreads(events); // optional; empty if missing; resolved once the map is up
    const stories = loadStories(events); // optional; resolved after the map is ready

    const scale = createScale();
    restoreFromHash(scale, events);
    syncHash(scale, events);
    initTimeline(requireEl('timeline'), events, scale);

    setState({ illustratedBase: savedIllustrated() });
    const { initMap } = await mapModule;
    const map = await initMap(requireEl('map-canvas'), events, layers, places, paths);
    if (import.meta.env.DEV) (window as unknown as { __map: unknown }).__map = map;
    initPanel(requireEl('panel'), events, places, paths);
    const filters = initFilters(requireEl('filters-button'), events);
    initLayerToggles(filters.layersSlot, layers);
    initSettlementsToggle(filters.layersSlot);
    initIllustratedToggle(filters.layersSlot);
    initDistrictToggles(filters.layersSlot);
    initShareButton(requireEl('share-button'));
    initControlToggle(filters.layersSlot);
    initLakesToggle(filters.layersSlot);
    initCompare(filters.layersSlot, map);
    initSearch(requireEl('search'), events, places);
    initEventList(requireEl('event-list'), events);
    initThreads(requireEl('follow-button'), requireEl('map'), await threads, events, scale);
    initStory(requireEl('story-button'), requireEl('story-mount'), await stories, events);
    initLanguage(requireEl('lang-button'));
    void initWhatsNewBadge();

    if (problems.length > 0) {
      console.warn('Some events were skipped:', problems);
      showStatus({
        title: `${problems.length} event(s) could not be shown`,
        detail: problems.join('; '),
      });
    }
  } catch (err) {
    const detail = err instanceof LoadEventsError ? err.message : 'An unexpected error occurred while starting the app.';
    console.error(err);
    showStatus({ title: 'The timeline could not load', detail, isError: true, onRetry: () => void start() });
  }
}

if (import.meta.env.DEV) {
  // Console helper while building: __state.setState({ currentYear: 1948 })
  (window as unknown as { __state: unknown }).__state = { getState, setState };
}

initChrome();
void start();
