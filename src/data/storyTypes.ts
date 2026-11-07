// Data types for public/data/stories.json. The JSON Schema in
// public/data/stories.schema.json must describe the same shape.

export interface StoryStep {
  eventId: string;
  /** Max 40 words, neutral, in our own words (the validator checks the length). */
  caption: string;
  /** Map zoom for this step; omit for the default for the event's location precision. */
  cameraZoom?: number;
}

export interface Story {
  /** Kebab-case, unique, stable (URLs link to it). */
  id: string;
  title: string;
  intro: string;
  /** True for sample stories that must be replaced before launch. */
  placeholder?: boolean;
  /** Show the Israeli settlements on the map while this story runs (the reader's own Settlements choice returns afterwards). */
  showSettlements?: boolean;
  /** Show the control-of-the-land zones while this story runs. */
  showControl?: boolean;
  /** Show the 1946 lake outlines while this story runs. */
  showLakes?: boolean;
  steps: [StoryStep, ...StoryStep[]];
}

export interface StoriesFile {
  $schema?: string;
  version: 1;
  stories: Story[];
}
