// Event categories. Ids must match the "category" enum in public/data/events.schema.json
// (the validator checks this). Colors and shapes come from docs/SPEC.md section 5.

export const CATEGORY_IDS = [
  'political',
  'conflict',
  'cultural',
  'demographic',
  'religious-sites',
  'displacement',
  'economy-daily-life',
  'land-settlement',
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export type MarkerShape =
  | 'square'
  | 'diamond'
  | 'circle'
  | 'triangle'
  | 'octagon'
  | 'ring-chevron'
  | 'hexagon'
  | 'pentagon';

export interface CategoryInfo {
  id: CategoryId;
  label: string;
  shape: MarkerShape;
  color: string;
}

export const CATEGORIES: readonly CategoryInfo[] = [
  { id: 'political', label: 'Political', shape: 'square', color: '#2F4B6E' },
  { id: 'conflict', label: 'Conflict', shape: 'diamond', color: '#8C3B2E' },
  { id: 'cultural', label: 'Cultural', shape: 'circle', color: '#5E7A3A' },
  { id: 'demographic', label: 'Demographic', shape: 'triangle', color: '#2E6E6A' },
  { id: 'religious-sites', label: 'Religious sites', shape: 'octagon', color: '#6B4A7A' },
  { id: 'displacement', label: 'Displacement', shape: 'ring-chevron', color: '#9A5A1E' },
  { id: 'economy-daily-life', label: 'Economy and daily life', shape: 'hexagon', color: '#8A7420' },
  { id: 'land-settlement', label: 'Land and settlement', shape: 'pentagon', color: '#9B4467' },
];
