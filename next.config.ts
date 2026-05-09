import path from 'path'
import type { NextConfig } from 'next'

/**
 * Embedded Studio pulls `sanity.config.js` → schema → app/lib code using `@/…` imports.
 * - Webpack must resolve `@` to the project root (same as `tsconfig` paths `"@/*": ["./*"]`).
 * - The repo has a `sanity/` CMS folder; pin the `sanity` npm package so it is not shadowed.
 * - `sanity` ships ESM-heavy deps; transpile so webpack can bundle Studio correctly.
 */
const nextConfig: NextConfig = {
  transpilePackages: [
    'sanity',
    '@sanity/vision',
    'next-sanity',
    '@portabletext/editor',
    '@portabletext/markdown',
    'markdown-it',
  ],
  webpack: (config, { dir }) => {
    const sanityPkg = path.join(dir, 'node_modules', 'sanity')

    config.resolve = config.resolve ?? {}
    const prev = (config.resolve.alias ?? {}) as Record<string, string | false | string[]>

    const mdItCjs = path.join(dir, 'node_modules', 'markdown-it', 'dist', 'index.cjs.js')

    config.resolve.alias = {
      ...prev,
      '@': dir,
      /** Prefer CJS build: published `index.mjs` can point at a missing `./lib/` tree in some installs. */
      'markdown-it$': mdItCjs,
      sanity$: path.join(sanityPkg, 'lib', 'index.js'),
      'sanity/structure': path.join(sanityPkg, 'lib', 'structure.js'),
      'sanity/router': path.join(sanityPkg, 'lib', 'router.js'),
      'sanity/desk': path.join(sanityPkg, 'lib', 'desk.js'),
      'sanity/presentation': path.join(sanityPkg, 'lib', 'presentation.js'),
      'sanity/migrate': path.join(sanityPkg, 'lib', 'migrate.js'),
      'sanity/cli': path.join(sanityPkg, 'lib', 'cli.js'),
      'sanity/media-library': path.join(sanityPkg, 'lib', 'media-library.js'),
    }
    return config
  },
}

export default nextConfig
