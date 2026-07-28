#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
readonly GENERATED="$ROOT/src/formatter/pdf_formatter/fonts/ChordSheetSymbolsFonts.base64.ts"
backup="$(mktemp)"

cleanup() {
  cp "$backup" "$GENERATED"
  rm -f "$backup"
}

cp "$GENERATED" "$backup"
trap cleanup EXIT
"$SCRIPT_DIR/build-symbol-fonts.sh" >/dev/null

if ! cmp -s "$backup" "$GENERATED"; then
  echo "ChordSheet Symbols output is stale. Run: yarn fonts:build" >&2
  exit 1
fi

echo "ChordSheet Symbols output is current."
