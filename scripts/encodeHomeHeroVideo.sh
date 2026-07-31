#!/usr/bin/env bash
# Re-encode home hero master → public/home/hero.mp4 (H.264 High, no audio, faststart).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MASTER="$ROOT/assets/masters/home-hero/0401-master.mp4"
OUT="$ROOT/public/home/hero.mp4"
mkdir -p "$(dirname "$OUT")"
if [[ ! -f "$MASTER" ]]; then
  echo "Missing master: $MASTER" >&2
  exit 1
fi
ffmpeg -y -i "$MASTER" \
  -an \
  -c:v libx264 -profile:v high -level 4.1 \
  -pix_fmt yuv420p \
  -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2" \
  -crf 23 -maxrate 1300k -bufsize 2600k \
  -preset slow \
  -movflags +faststart \
  "$OUT"
ls -lh "$OUT"
ffprobe -v error -show_entries format=duration,size,bit_rate -show_entries stream=codec_name,profile,width,height,bit_rate -of default=nw=1 "$OUT"
