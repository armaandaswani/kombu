#!/bin/zsh
set -eu
cd "$(dirname "$0")"
if curl -fsS http://127.0.0.1:4317/api/state >/dev/null 2>&1; then
  open http://127.0.0.1:4317
  exit 0
fi
/usr/local/bin/node scripts/studio.mjs &
kombu_studio_pid=$!
trap 'kill "$kombu_studio_pid" 2>/dev/null || true' EXIT
for kombu_attempt in {1..20}; do
  if curl -fsS http://127.0.0.1:4317/api/state >/dev/null 2>&1; then
    open http://127.0.0.1:4317
    break
  fi
  sleep 0.25
done
wait "$kombu_studio_pid"
