// Opening and closing a place card. A place card and an event card share the one side panel, so
// opening one closes the other, and a story ends when a place is picked (as with a marker).

import { setState } from '../state.ts';

export function openPlace(id: string | null): void {
  if (id === null) {
    setState({ selectedPlaceId: null });
    return;
  }
  setState({ selectedPlaceId: id, selectedEventId: null, isPlaying: false, story: null, dimOthers: false });
}
