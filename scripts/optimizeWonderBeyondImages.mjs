/**
 * Generates responsive AVIF + WebP outputs for Wonder Beyond the Wonder campaign.
 * Source masters live in assets/wonder-beyond-the-wonder/ (not served directly).
 *
 * Usage: node scripts/optimizeWonderBeyondImages.mjs
 */
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const ROOT = process.cwd()
const SOURCES = path.join(ROOT, 'assets/wonder-beyond-the-wonder')
const PUBLIC = path.join(ROOT, 'public/wonder-beyond-the-wonder')

/**
 * Mild cinematic grade burned into bitmap so base frames match campaign tone.
 * Keep grading subtle — CSS overlays provide vignette / warm film / text scrim.
 */
function applyCinematicGrade(pipeline) {
  return pipeline
    .modulate({
      brightness: 0.84,
      saturation: 0.78,
    })
    .linear(0.94, -5)
    // Gentle warm bias without crushing greens into mud.
    .recomb([
      [1.02, 0.02, 0.0],
      [0.0, 0.98, 0.0],
      [0.0, 0.0, 0.9],
    ])
}

/** @type {const} */
const IMAGE_SETS = [
  {
    id: 'hero',
    source: 'hero-source.png',
    outDir: path.join(PUBLIC, 'hero'),
    sizes: [
      { name: 'mobile', width: 900 },
      { name: 'tablet', width: 1400 },
      { name: 'desktop', width: 2400 },
    ],
    quality: { avif: 78, webp: 80 },
  },
  {
    id: 'editorial',
    source: 'editorial-source.png',
    outDir: path.join(PUBLIC, 'editorial'),
    sizes: [
      { name: 'mobile', width: 900 },
      { name: 'tablet', width: 1400 },
      { name: 'desktop', width: 2000 },
    ],
    quality: { avif: 78, webp: 80 },
  },
  {
    // 50% benefit section — canopy / Tropical Andes mountain
    id: 'benefit',
    source: 'benefit-source.png',
    outDir: path.join(PUBLIC, 'benefit'),
    sizes: [
      { name: 'mobile', width: 900 },
      { name: 'tablet', width: 1024 },
      { name: 'desktop', width: 1024 },
    ],
    quality: { avif: 72, webp: 76 },
    withoutEnlargement: true,
    cinematicGrade: true,
  },
  {
    // Final CTA section — river winding toward forested peak
    id: 'close',
    source: 'close-source.png',
    outDir: path.join(PUBLIC, 'close'),
    sizes: [
      { name: 'mobile', width: 900 },
      { name: 'tablet', width: 1024 },
      { name: 'desktop', width: 1024 },
    ],
    quality: { avif: 72, webp: 76 },
    withoutEnlargement: true,
    cinematicGrade: true,
  },
  {
    id: 'journey-wonder',
    source: path.join('journeys', 'wonder-beyond-the-wonder-source.jpg'),
    outDir: path.join(PUBLIC, 'journeys', 'wonder-beyond-the-wonder-card'),
    sizes: [
      { name: 'mobile', width: 600 },
      { name: 'tablet', width: 800 },
      { name: 'desktop', width: 1200 },
    ],
    quality: { avif: 85, webp: 88 },
  },
  {
    id: 'journey-family',
    source: path.join('journeys', 'family-quest-source.jpg'),
    outDir: path.join(PUBLIC, 'journeys', 'family-quest-beyond-machu-picchu-card'),
    sizes: [
      { name: 'mobile', width: 600 },
      { name: 'tablet', width: 800 },
      { name: 'desktop', width: 1200 },
    ],
    quality: { avif: 85, webp: 88 },
  },
  {
    id: 'journey-wildlife',
    source: path.join('journeys', 'wildlife-photography-source.jpg'),
    outDir: path.join(PUBLIC, 'journeys', 'wildlife-photography-card'),
    sizes: [
      { name: 'mobile', width: 600 },
      { name: 'tablet', width: 800 },
      { name: 'desktop', width: 1200 },
    ],
    quality: { avif: 85, webp: 88 },
  },
  {
    id: 'why-connection',
    source: path.join('why', 'why-deeper-connection-source.jpg'),
    outDir: path.join(PUBLIC, 'why', 'why-deeper-connection'),
    sizes: [
      { name: 'mobile', width: 600 },
      { name: 'tablet', width: 850 },
      { name: 'desktop', width: 964 },
    ],
    quality: { avif: 85, webp: 88 },
    withoutEnlargement: true,
  },
  {
    id: 'why-impact',
    source: path.join('why', 'why-meaningful-impact-source.jpg'),
    outDir: path.join(PUBLIC, 'why', 'why-meaningful-impact'),
    sizes: [
      { name: 'mobile', width: 600 },
      { name: 'tablet', width: 850 },
      { name: 'desktop', width: 964 },
    ],
    quality: { avif: 85, webp: 88 },
    withoutEnlargement: true,
  },
  {
    id: 'why-perspective',
    source: path.join('why', 'why-richer-perspective-source.jpg'),
    outDir: path.join(PUBLIC, 'why', 'why-richer-perspective'),
    sizes: [
      { name: 'mobile', width: 600 },
      { name: 'tablet', width: 850 },
      { name: 'desktop', width: 964 },
    ],
    quality: { avif: 85, webp: 88 },
    withoutEnlargement: true,
  },
]

async function writeVariant(input, outputPath, width, format, quality, crop, withoutEnlargement, cinematicGrade) {
  let pipeline = sharp(input).rotate()

  if (crop) {
    const meta = await sharp(input).metadata()
    const w = meta.width ?? width
    const h = meta.height ?? Math.round(width * 0.75)
    const targetRatio = 4 / 5
    let cropW = w
    let cropH = Math.round(w / targetRatio)
    if (cropH > h) {
      cropH = h
      cropW = Math.round(h * targetRatio)
    }
    let left = 0
    if (crop.position === 'right') left = w - cropW
    if (crop.position === 'centre') left = Math.round((w - cropW) / 2)
    pipeline = pipeline.extract({ left, top: Math.round((h - cropH) / 2), width: cropW, height: cropH })
  }

  pipeline = pipeline.resize({ width, withoutEnlargement: withoutEnlargement ?? false })

  if (cinematicGrade) {
    pipeline = applyCinematicGrade(pipeline)
  }

  if (format === 'avif') {
    pipeline = pipeline.avif({ quality, effort: 6 })
  } else {
    pipeline = pipeline.webp({ quality, effort: 6 })
  }

  await pipeline.toFile(outputPath)
  const stat = fs.statSync(outputPath)
  return { bytes: stat.size, kb: Math.round(stat.size / 1024) }
}

async function optimizeSet(set) {
  const sourcePath = path.join(SOURCES, set.source)
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing source master: ${sourcePath}`)
  }

  fs.mkdirSync(set.outDir, { recursive: true })

  for (const size of set.sizes) {
    const base = size.name
    for (const format of ['avif', 'webp']) {
      const filename = `${base}.${format}`
      const outputPath = path.join(set.outDir, filename)
      const result = await writeVariant(
        sourcePath,
        outputPath,
        size.width,
        format,
        set.quality[format],
        set.crop,
        set.withoutEnlargement,
        set.cinematicGrade,
      )
      console.log(`${path.relative(ROOT, outputPath)} — ${result.kb} KB`)
    }
  }
}

const only = process.argv.includes('--only')
  ? process.argv[process.argv.indexOf('--only') + 1]?.split(',').filter(Boolean)
  : null

for (const set of IMAGE_SETS) {
  if (only && !only.includes(set.id)) continue
  console.log(`\nOptimizing ${set.id}…`)
  await optimizeSet(set)
}

console.log('\nDone.')
