// Fetches public/data/threads.json. Threads are optional: if the file is missing or broken the
// app works without them. A thread keeps only the events that exist, and needs at least three.

import type { HistoricalEvent } from './types.ts';
import type { Thread, ThreadKind } from './threadTypes.ts';

export const THREADS_URL = `${import.meta.env.BASE_URL}data/threads.json`;

const KINDS: readonly ThreadKind[] = ['person', 'place', 'theme'];
const MIN_EVENTS = 3;

type Obj = Record<string, unknown>;

const isObj = (value: unknown): value is Obj => typeof value === 'object' && value !== null && !Array.isArray(value);
const isText = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';
const strings = (value: unknown): string[] => (Array.isArray(value) ? value.filter(isText) : []);

function toThread(raw: unknown, known: ReadonlySet<string>): Thread | null {
  if (!isObj(raw) || !isText(raw['id']) || !isText(raw['title']) || !isText(raw['intro'])) return null;
  const { kind } = raw;
  if (typeof kind !== 'string' || !KINDS.includes(kind as ThreadKind)) return null;
  const eventIds = strings(raw['eventIds']).filter((id) => known.has(id));
  if (eventIds.length < MIN_EVENTS) return null;
  const thread: Thread = {
    id: raw['id'],
    kind: kind as ThreadKind,
    title: raw['title'],
    intro: raw['intro'],
    eventIds,
    pathIds: strings(raw['pathIds']),
    placeIds: strings(raw['placeIds']),
    status: raw['status'] === 'verified' ? 'verified' : 'needs-review',
  };
  if (isText(raw['titleAr'])) thread.titleAr = raw['titleAr'];
  return thread;
}

export function parseThreads(data: unknown, events: readonly HistoricalEvent[]): Thread[] {
  if (!isObj(data) || data['version'] !== 1 || !Array.isArray(data['threads'])) return [];
  const known = new Set(events.map((e) => e.id));
  const seen = new Set<string>();
  const threads: Thread[] = [];
  for (const raw of data['threads'] as unknown[]) {
    const thread = toThread(raw, known);
    if (!thread || seen.has(thread.id)) continue;
    seen.add(thread.id);
    threads.push(thread);
  }
  return threads;
}

export async function loadThreads(events: readonly HistoricalEvent[], url: string = THREADS_URL): Promise<Thread[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    return parseThreads(await response.json(), events);
  } catch (err) {
    console.warn('Threads could not be loaded; Follow is unavailable.', err);
    return [];
  }
}
