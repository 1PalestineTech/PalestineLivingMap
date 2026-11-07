// A small client-side search over event titles, place names (English, Arabic and
// historical), tags, and summaries. Every typed word must match the start of a word in the
// event; matches in the title count most. When nothing matches, a second pass forgives one
// typo in words of five or more letters. No dependency.

import { parseHistDate, toTimelineValue } from '../data/dates.ts';
import type { HistoricalEvent } from '../data/types.ts';
import { normalize, tokenize } from './normalize.ts';

const WEIGHT = { title: 5, place: 4, tags: 3, summary: 1 } as const;
const EXACT_WORD_BONUS = 0.5;
const TITLE_PREFIX_BONUS = 3;

type Field = keyof typeof WEIGHT;

interface Entry {
  event: HistoricalEvent;
  /** Normalized words per field. */
  words: Record<Field, string[]>;
  title: string;
  when: number;
}

export interface SearchIndex {
  entries: readonly Entry[];
}

function placeText(event: HistoricalEvent): string {
  const { name, nameAr, historicalNames } = event.location;
  return [name, nameAr, ...(historicalNames ?? []).map((h) => h.name)].filter(Boolean).join(' ');
}

export function buildIndex(events: readonly HistoricalEvent[]): SearchIndex {
  return {
    entries: events.map((event) => {
      const start = parseHistDate(event.dateStart);
      return {
        event,
        words: {
          title: tokenize(event.title),
          place: tokenize(placeText(event)),
          tags: tokenize(event.tags.join(' ')),
          summary: tokenize(event.summary),
        },
        title: normalize(event.title),
        when: start ? toTimelineValue(start) : 0,
      };
    }),
  };
}

/** Best score for one query word across the fields, or 0 if it matches none. */
function scoreWord(entry: Entry, word: string): number {
  let best = 0;
  for (const field of Object.keys(WEIGHT) as Field[]) {
    for (const candidate of entry.words[field]) {
      if (!candidate.startsWith(word)) continue;
      const score = WEIGHT[field] + (candidate === word ? EXACT_WORD_BONUS : 0);
      if (score > best) best = score;
    }
  }
  return best;
}

const FUZZY_MIN_LENGTH = 5;
const FUZZY_PENALTY = 0.5;

/** True if `a` and `b` differ by at most one substitution, insertion, or deletion. */
function withinOneEdit(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  if (i === a.length || i === b.length) return true;
  if (a.length === b.length) return a.slice(i + 1) === b.slice(i + 1);
  return a.length > b.length ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1);
}

/** Like scoreWord, but a typo of one letter is allowed (compared against the word's start). */
function scoreWordFuzzy(entry: Entry, word: string): number {
  if (word.length < FUZZY_MIN_LENGTH) return 0;
  let best = 0;
  for (const field of Object.keys(WEIGHT) as Field[]) {
    for (const candidate of entry.words[field]) {
      const head = candidate.slice(0, word.length);
      const near = withinOneEdit(head, word) || withinOneEdit(candidate.slice(0, word.length + 1), word);
      if (!near) continue;
      const score = WEIGHT[field] - FUZZY_PENALTY;
      if (score > best) best = score;
    }
  }
  return best;
}

export function search(index: SearchIndex, query: string, limit = 8): HistoricalEvent[] {
  const words = tokenize(query);
  if (words.length === 0) return [];
  const whole = normalize(query);

  const run = (fuzzy: boolean): { entry: Entry; score: number }[] => {
    const scored: { entry: Entry; score: number }[] = [];
    for (const entry of index.entries) {
      let total = 0;
      let all = true;
      for (const word of words) {
        const s = fuzzy ? Math.max(scoreWord(entry, word), scoreWordFuzzy(entry, word)) : scoreWord(entry, word);
        if (s === 0) {
          all = false;
          break;
        }
        total += s;
      }
      if (!all) continue;
      if (entry.title.startsWith(whole)) total += TITLE_PREFIX_BONUS;
      scored.push({ entry, score: total });
    }
    return scored;
  };

  let scored = run(false);
  if (scored.length === 0) scored = run(true);
  scored.sort((a, b) => b.score - a.score || a.entry.when - b.entry.when || a.entry.event.id.localeCompare(b.entry.event.id));
  return scored.slice(0, limit).map((s) => s.entry.event);
}
