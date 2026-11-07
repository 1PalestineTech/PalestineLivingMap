// Data types for public/data/layers/layers.json. The JSON Schema in
// public/data/layers/layers.schema.json must describe the same shape.

export interface LayerSource {
  title: string;
  /** Link to the source; null only for placeholder layers with no real source. */
  url: string | null;
}

export interface MapLayer {
  /** Kebab-case, unique, stable (URLs link to it). */
  id: string;
  name: string;
  description: string;
  /** Historical years (negative = BCE). The layer is shown from validFrom to validTo inclusive. */
  validFrom: number;
  /** null means to the present. */
  validTo: number | null;
  source: LayerSource;
  license: string;
  /** File name inside public/data/layers/. */
  file: string;
  /** True for invented test layers that must be replaced before launch. */
  placeholder?: boolean;
}

export interface LayersFile {
  $schema?: string;
  version: 1;
  layers: MapLayer[];
}
