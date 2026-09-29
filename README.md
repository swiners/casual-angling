# Casual Angling

A little black book of good fishing spots within driving range of Melbourne. Pick a drive time, find a spot, get directions, and keep notes on what worked. Add your own spots as you go.

- It starts with fly and trout water northeast and east of Melbourne. Beach, bay and estuary spots are next.
- Spots you add, plus your ★ / ✓ marks and notes, are stored **in your own browser only**. Use *Export book* / *Import* to move them to another device or share them.
- Pin locations and drive times are approximate. Always check public access on [MapShareVic](https://mapshare.vic.gov.au/mapsharevic/) and the current rules on the [VFA site](https://vfa.vic.gov.au) before you go.

## Running locally

Serve the folder (for example `python3 -m http.server 8023`) and open http://localhost:8023.
For Google Maps, run `sh set-key.sh` and paste a browser key restricted to your site address and the Maps JavaScript API. Without a key, the map falls back to free Esri tiles.

## Adding built-in spots

Edit `spots.js`. Each water is one entry with its spots. Coordinates are decimal degrees; `drive` is a fallback estimate in minutes from home (Flemington); `tools/build-drive-grid.py` computes the real ones.
