// Timeline bar: era presets, big year readout, play controls, density sparkline, scrubber
// with ticks, and a live region. Modules: scale.ts (non-linear scale), slider.ts, ticks.ts,
// sparkline.ts, eraBar.ts, playback.ts.

import { formatYear } from '../data/format.ts';
import { el } from '../dom.ts';
import type { EraInfo } from '../data/eras.ts';
import type { HistoricalEvent } from '../data/types.ts';
import { getState, setState, subscribe } from '../state.ts';
import { createEraBar } from './eraBar.ts';
import { cancelYearAnimation, initNavigation } from './navigate.ts';
import { createPlayback } from './playback.ts';
import type { Speed } from './playback.ts';
import type { Scale } from './scale.ts';
import { createSlider } from './slider.ts';
import { createSparkline, densityBuckets } from './sparkline.ts';
import { computeTicks } from './ticks.ts';

function eraRange(era: EraInfo): string {
  const end = era.end === null ? 'the present' : formatYear(era.end, true);
  return `${formatYear(era.start, true)} to ${end}`;
}

export function initTimeline(container: HTMLElement, events: readonly HistoricalEvent[], scale: Scale): void {
  container.replaceChildren();
  initNavigation(scale);

  const eraBar = createEraBar();
  const playback = createPlayback(scale, events);
  const sparkline = createSparkline();

  const slider = createSlider({
    scale,
    onInput: (year) => setState({ currentYear: year, activeEra: scale.eraAt(year).id }),
    onUserControl: () => {
      cancelYearAnimation();
      if (getState().story !== null && getState().dimOthers) setState({ dimOthers: false });
      if (getState().isPlaying) setState({ isPlaying: false });
    },
  });

  // Readout: big year and era name, then play controls.
  const yearText = el('span', 'readout__year');
  const eraText = el('span', 'readout__era');
  const readout = el('div', 'readout');
  const yearBox = el('div', 'readout__time');
  yearBox.setAttribute('aria-hidden', 'true'); // the slider's aria-valuetext says the same
  yearBox.append(yearText, eraText);

  const playButton = el('button', 'btn play-button');
  playButton.type = 'button';
  playButton.addEventListener('click', () => playback.toggle());

  const speed = el('select', 'speed-select');
  speed.setAttribute('aria-label', 'Playback speed');
  for (const value of [1, 2, 4] as const) {
    const option = el('option', '', `${value}x`);
    option.value = String(value);
    speed.append(option);
  }
  speed.addEventListener('change', () => playback.setSpeed(Number(speed.value) as Speed));

  const controls = el('div', 'readout__controls');
  controls.append(playButton, speed);
  readout.append(yearBox, controls);

  const sparkWrap = el('div', 'spark');
  sparkWrap.append(sparkline.element);

  const ticks = el('div', 'ticks');
  ticks.setAttribute('aria-hidden', 'true');
  slider.inner.append(ticks);

  const live = el('div', 'sr-only');
  live.setAttribute('role', 'status');
  live.setAttribute('aria-live', 'polite');

  container.append(eraBar.element, readout, sparkWrap, slider.element, live);

  // --- Rendering -------------------------------------------------------------------------

  function renderTicks(): void {
    const width = slider.inner.clientWidth;
    ticks.replaceChildren(
      ...computeTicks(scale, width).map((tick) => {
        const node = el('span', tick.label === null ? 'tick' : 'tick tick--major');
        node.style.left = `${tick.pos * 100}%`;
        if (tick.label !== null) node.append(el('span', 'tick__label', tick.label));
        return node;
      }),
    );
  }

  function renderSparkline(): void {
    sparkline.update(densityBuckets(events, scale, getState().activeCategories));
  }

  function renderYear(): void {
    const { currentYear } = getState();
    const era = scale.eraAt(currentYear);
    yearText.textContent = formatYear(currentYear, true);
    eraText.textContent = era.label;
    slider.setYear(currentYear, `${formatYear(currentYear, true)}, ${era.label} era`);
    eraBar.setActive(era.id);
  }

  function renderPlay(): void {
    const playing = getState().isPlaying;
    playButton.textContent = playing ? 'Pause' : 'Play';
    playButton.setAttribute('aria-label', playing ? 'Pause timeline playback' : 'Play timeline');
  }

  let announceTimer = 0;
  function announceEra(): void {
    window.clearTimeout(announceTimer);
    announceTimer = window.setTimeout(() => {
      const era = scale.eraAt(getState().currentYear);
      live.textContent = `${era.label} era, ${eraRange(era)}`;
    }, 350);
  }

  renderYear();
  renderPlay();
  renderSparkline();
  new ResizeObserver(renderTicks).observe(slider.inner);
  renderTicks();

  // The panel and map sit above the bar, so tell CSS how tall it really is.
  new ResizeObserver(() => {
    document.documentElement.style.setProperty('--timeline-h', `${container.offsetHeight}px`);
  }).observe(container);

  subscribe((state, previous) => {
    if (state.currentYear !== previous.currentYear) {
      renderYear();
      if (scale.eraAt(state.currentYear).id !== scale.eraAt(previous.currentYear).id) announceEra();
    }
    if (state.isPlaying !== previous.isPlaying) renderPlay();
    if (state.activeCategories !== previous.activeCategories) {
      renderSparkline();
      playback.refreshEvents();
    }
    // Opening an event pauses playback.
    if (state.selectedEventId !== null && state.selectedEventId !== previous.selectedEventId && state.isPlaying) {
      setState({ isPlaying: false });
    }
  });
}
