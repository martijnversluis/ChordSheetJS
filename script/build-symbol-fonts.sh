#!/usr/bin/env bash
set -euo pipefail

readonly UV_VERSION=0.11.32
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if command -v uv >/dev/null 2>&1 && uv --version >/dev/null 2>&1; then
  exec uv run --no-project "$SCRIPT_DIR/build_symbol_fonts.py"
fi

if command -v mise >/dev/null 2>&1; then
  if ! uv_root="$(mise where "uv@$UV_VERSION" 2>/dev/null)"; then
    mise install "uv@$UV_VERSION" >/dev/null
    uv_root="$(mise where "uv@$UV_VERSION")"
  fi
  uv_bin="$(find "$uv_root" -maxdepth 2 -type f -name uv -perm -u+x | head -1)"
  if [[ -n "$uv_bin" ]]; then
    exec "$uv_bin" run --no-project "$SCRIPT_DIR/build_symbol_fonts.py"
  fi
fi

echo "Building symbol fonts requires uv $UV_VERSION (https://docs.astral.sh/uv/)." >&2
exit 1
