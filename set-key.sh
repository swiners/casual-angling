#!/bin/sh
# Writes config.js from a key you paste. The key is read with echo off, never printed,
# and only lands in config.js (gitignored). Run: sh set-key.sh
set -e
cd "$(dirname "$0")"
printf 'Paste your Google Maps API key, then press Enter (input hidden): '
stty -echo; read -r KEY; stty echo; echo
# Google browser keys are "AIza" + 35 URL-safe chars; reject anything else so nothing odd gets written into JS.
case "$KEY" in
  AIza*) ;;
  *) echo "That doesn't look like a Google Maps key (they start with AIza). Nothing written."; exit 1 ;;
esac
if ! printf '%s' "$KEY" | grep -Eq '^[A-Za-z0-9_-]{39}$'; then
  echo "Key has unexpected characters or length. Nothing written."; exit 1
fi
umask 077
cat > config.js <<JS
// Local only — gitignored. Regenerate with: sh set-key.sh
window.CASUAL_ANGLING_CONFIG = {
  googleMapsKey: '$KEY',
  mapId: 'DEMO_MAP_ID',
};
JS
echo "Saved to config.js. Reload http://localhost:8023 to switch to Google Maps."
