#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
npm ci
if [ ! -x ../.render/video-tools/python/bin/python ]; then
  uv venv --python 3.11 ../.render/video-tools/python
fi
uv pip install --python ../.render/video-tools/python/bin/python -r requirements-lock.txt
npm run doctor
