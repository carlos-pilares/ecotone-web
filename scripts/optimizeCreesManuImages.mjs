/**
 * Generates responsive AVIF + WebP outputs from source masters in assets/crees-manu/.
 * Source masters are never placed in public/ and are not served by the site.
 *
 * Usage: node scripts/optimizeCreesManuImages.mjs
 */
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const ROOT = process.cwd()
const SOURCES = path.join(ROOT, 'assets/crees-manu')
const PUBLIC = path.join(ROOT, 'public/crees-manu')

/** @type {const} */
const IMAGE_SETS = [
  {
    id: 'hero',
    source: 'hero-source.jpg',
    outDir: path.join(PUBLIC, 'hero'),
    sizes: [
      { name: 'mobile', width: 900 },
      { name: 'tablet', width: 1600 },
      { name: 'desktop', width: 2800 },
    ],
    quality: { avif: 80, webp: 82 },
  },
  {
    id: 'closing',
    source: 'closing-source.jpg',
    outDir: path.join(PUBLIC, 'closing'),
    sizes: [
      { name: 'mobile', width: 800 },
      { name: 'tablet', width: 1400 },
      { name: 'desktop', width: 2400 },
    ],
    quality: { avif: 80, webp: 82 },
  },
]

async function writeVariant(input, outputPath, width, format, quality) {
  let pipeline = sharp(input).rotate().resize({ width, withoutEnlargement: false })

  if (format === 'avif') {
    pipeline = pipeline.avif({ quality, effort: 6 })
  } else {
    pipeline = pipeline.webp({ quality, effort: 6 })
  }

  await pipeline.toFile(outputPath)
  const stat = fs.statSync(outputPath)
  const meta = await sharp(outputPath).metadata()
  return { bytes: stat.size, width: meta.width, height: meta.height }
}

async function optimizeSet(set) {
  const sourcePath = path.join(SOURCES, set.source)
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing source master: ${sourcePath}`)
  }

  fs.mkdirSync(set.outDir, { recursive: true })

  const summary = []

  for (const size of set.sizes) {
    for (const format of ['avif', 'webp']) {
      const filename = `${size.name}.${format}`
      const outputPath = path.join(set.outDir, filename)
      const result = await writeVariant(
        sourcePath,
        outputPath,
        size.width,
        format,
        set.quality[format],
      )
      summary.push({
        file: path.relative(ROOT, outputPath),
        ...result,
        kb: Math.round(result.bytes / 1024),
      })
    }
  }

  return summary
}

async function main() {
  console.log('Optimizing CREES Manu responsive images from assets/crees-manu/…\n')

  for (const set of IMAGE_SETS) {
    const results = await optimizeSet(set)
    console.log(`[${set.id}]`)
    for (const row of results) {
      console.log(`  ${row.file} — ${row.width}x${row.height}, ${row.kb}KB`)
    }
    console.log('')
  }

  console.log('Done. Source masters remain in assets/crees-manu/ (not publicly served).')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
