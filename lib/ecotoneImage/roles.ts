import type { EcotoneImageRole, EcotoneImageRoleConfig } from './types'

/**
 * Role configs tuned to Ecotone layout shells:
 * - content max ~1200px (`--max`)
 * - About who column 340px; pair visual ~0.4fr; people 4/2/1 columns
 */
export const ECOTONE_IMAGE_ROLES: Record<EcotoneImageRole, EcotoneImageRoleConfig> = {
  hero: {
    // Full-bleed About / landing heroes
    sizes: '100vw',
    minWidth: 640,
    maxWidth: 3840,
    quality: 82,
  },
  editorial: {
    // About Who (340px), CREES/Diff pair (~40% of content ≈ 480px), mobile full width
    sizes: '(max-width: 900px) 100vw, min(560px, 45vw)',
    minWidth: 640,
    maxWidth: 2400,
    quality: 80,
  },
  portrait: {
    // About people: 4-col desktop (~289px in 1200), 2-col tablet, 1-col narrow
    sizes: '(max-width: 420px) 92vw, (max-width: 760px) 46vw, min(300px, 25vw)',
    minWidth: 400,
    maxWidth: 1600,
    quality: 80,
  },
  card: {
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, min(400px, 33vw)',
    minWidth: 400,
    maxWidth: 1600,
    quality: 80,
  },
}
