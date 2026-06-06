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
    const sanityLib = path.join(sanityPkg, 'lib')
    const mdItCjs = path.join(dir, 'node_modules', 'markdown-it', 'dist', 'index.cjs.js')

    config.resolve = config.resolve ?? {}
    const prev = (config.resolve.alias ?? {}) as Record<string, string | false | string[]>

    /** Pin every npm `sanity/*` export — local `./sanity/` shadows them and breaks Studio (incl. uploads). */
    const sanitySubpathAliases: Record<string, string> = {
      'sanity$': path.join(sanityLib, 'index.js'),
      'sanity/_internal': path.join(sanityLib, '_internal.js'),
      'sanity/_singletons': path.join(sanityLib, '_singletons.js'),
      'sanity/_createContext': path.join(sanityLib, '_createContext.js'),
      'sanity/cli': path.join(sanityLib, 'cli.js'),
      'sanity/desk': path.join(sanityLib, 'desk.js'),
      'sanity/presentation': path.join(sanityLib, 'presentation.js'),
      'sanity/router': path.join(sanityLib, 'router.js'),
      'sanity/structure': path.join(sanityLib, 'structure.js'),
      'sanity/media-library': path.join(sanityLib, 'media-library.js'),
      'sanity/migrate': path.join(sanityLib, 'migrate.js'),
    }

    config.resolve.alias = {
      ...prev,
      '@': dir,
      'markdown-it$': mdItCjs,
      ...sanitySubpathAliases,
    }
    return config
  },
}

export default nextConfig
