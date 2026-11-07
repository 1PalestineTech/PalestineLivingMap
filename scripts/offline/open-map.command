#!/bin/sh
# macOS / Linux: double-click (or run in a terminal) to open the map. Needs Python 3, which both usually have.
cd "$(dirname "$0")/site" || exit 1
echo "Palestine: A Living Map is running at http://localhost:5175/  (press Ctrl+C to stop it)"
( sleep 1; (open "http://localhost:5175/" || xdg-open "http://localhost:5175/") >/dev/null 2>&1 ) &
python3 -m http.server 5175
