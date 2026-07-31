# Home hero video masters

Keep original camera / grade masters here — **not** under `public/`.

| File | Role |
|------|------|
| `0401-master.mp4` | Untouched master (~88 MB, HEVC 1920×1080, ~50s) |
| `../../public/home/hero.mp4` | Web-optimised H.264 (site serves this only) |

## Re-encode web version

```bash
ffmpeg -y -i assets/masters/home-hero/0401-master.mp4 \
  -an \
  -c:v libx264 -profile:v high -level 4.1 \
  -pix_fmt yuv420p \
  -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2" \
  -crf 23 -maxrate 1300k -bufsize 2600k \
  -preset slow \
  -movflags +faststart \
  public/home/hero.mp4
```

The app always resolves hero video playback to `/home/hero.mp4` when a CMS hero video is configured.
