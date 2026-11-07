// Fetches stories.json. Stories are optional: if the file is missing or broken the rest of
// the app works and story mode simply is not offered. Steps that point at unknown events
// are dropped (the validator catches them at author time).

import type { HistoricalEvent } from './types.ts';
import type { Story, StoryStep } from './storyTypes.ts';

export const STORIES_URL = `${import.meta.env.BASE_URL}data/stories.json`;

type Obj = Record<string, unknown>;

const isObj = (value: unknown): value is Obj => typeof value === 'object' && value !== null && !Array.isArray(value);
const isText = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';

function toStep(raw: unknown, eventIds: ReadonlySet<string>): StoryStep | null {
  if (!isObj(raw) || !isText(raw['eventId']) || !isText(raw['caption'])) return null;
  if (!eventIds.has(raw['eventId'])) return null;
  const zoom = raw['cameraZoom'];
  const step: StoryStep = { eventId: raw['eventId'], caption: raw['caption'] };
  if (typeof zoom === 'number' && zoom >= 3 && zoom <= 16) step.cameraZoom = zoom;
  return step;
}

export function parseStories(data: unknown, events: readonly HistoricalEvent[]): Story[] {
  if (!isObj(data) || data['version'] !== 1 || !Array.isArray(data['stories'])) return [];
  const eventIds = new Set(events.map((e) => e.id));
  const stories: Story[] = [];

  for (const raw of data['stories'] as unknown[]) {
    if (!isObj(raw) || !isText(raw['id']) || !isText(raw['title']) || !isText(raw['intro'])) continue;
    if (!Array.isArray(raw['steps'])) continue;
    const steps = (raw['steps'] as unknown[]).flatMap((s) => toStep(s, eventIds) ?? []);
    const [first, ...rest] = steps;
    if (!first) continue;
    const story: Story = { id: raw['id'], title: raw['title'], intro: raw['intro'], steps: [first, ...rest] };
    if (raw['placeholder'] === true) story.placeholder = true;
    if (raw['showSettlements'] === true) story.showSettlements = true;
    if (raw['showControl'] === true) story.showControl = true;
    if (raw['showLakes'] === true) story.showLakes = true;
    stories.push(story);
  }
  return stories;
}

export async function loadStories(events: readonly HistoricalEvent[], url: string = STORIES_URL): Promise<Story[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    return parseStories(await response.json(), events);
  } catch (err) {
    console.warn('Stories could not be loaded; story mode is unavailable.', err);
    return [];
  }
}
