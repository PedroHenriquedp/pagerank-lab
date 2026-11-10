#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")/.."
export HOST="${HOST:-127.0.0.1}"
export PORT="${PORT:-4173}"
exec node server.js
