// Fetches the map-layers manifest. Layers are optional: if the manifest is missing or broken
// the app works without overlays.

import { toAstronomical } from './spans.ts';
import type { MapLayer } from './layerTypes.ts';

export const LAYERS_DIR_URL = `${import.meta.env.BASE_URL}data/layers/`;

type Obj = Record<string, unknown>;

const isObj = (value: unknown): value is Obj => typeof value === 'object' && value !== null && !Array.isArray(value);
const isText = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';
const isYear = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value) && value !== 0;

/** True when `year` (historical numbering) falls inside the layer's validFrom..validTo. */
export function layerActiveInYear(layer: Pick<MapLayer, 'validFrom' | 'validTo'>, year: number): boolean {
  const y = toAstronomical(Math.round(year));
  if (y < toAstronomical(layer.validFrom)) return false;
  return layer.validTo === null || y <= toAstronomical(layer.validTo);
}

function toLayer(raw: unknown): MapLayer | null {
  if (!isObj(raw)) return null;
  const { id, name, description, validFrom, validTo, source, license, file } = raw;
  if (!isText(id) || !isText(name) || !isText(description) || !isText(license) || !isText(file)) return null;
  if (!isYear(validFrom) || !(validTo === null || isYear(validTo))) return null;
  if (validTo !== null && toAstronomical(validTo) < toAstronomical(validFrom)) return null;
  if (!isObj(source) || !isText(source['title'])) return null;
  const url = source['url'];
  const layer: MapLayer = {
    id,
    name,
    description,
    validFrom,
    validTo,
    source: { title: source['title'], url: isText(url) && /^https?:\/\//.test(url) ? url : null },
    license,
    file,
  };
  if (raw['placeholder'] === true) layer.placeholder = true;
  return layer;
}

export function parseLayers(data: unknown): MapLayer[] {
  if (!isObj(data) || data['version'] !== 1 || !Array.isArray(data['layers'])) return [];
  const seen = new Set<string>();
  const layers: MapLayer[] = [];
  for (const raw of data['layers'] as unknown[]) {
    const layer = toLayer(raw);
    if (!layer || seen.has(layer.id)) continue;
    seen.add(layer.id);
    layers.push(layer);
  }
  return layers;
}

export async function loadLayers(url: string = `${LAYERS_DIR_URL}layers.json`): Promise<MapLayer[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    return parseLayers(await response.json());
  } catch (err) {
    console.warn('Map layers could not be loaded; overlays are unavailable.', err);
    return [];
  }
}
