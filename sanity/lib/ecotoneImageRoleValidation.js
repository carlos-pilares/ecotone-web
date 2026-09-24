/**
 * Reusable Sanity Studio validation for Ecotone CMS image roles.
 * Resolution-based (not file size). Warnings are publishable; errors block publish.
 *
 * Asset refs typically encode dimensions: `image-{hash}-{W}x{H}-{ext}`
 */

/** @typedef {'hero' | 'editorial' | 'portrait' | 'card'} EcotoneImageRole */

/**
 * @typedef {{
 *   label: string
 *   warnWidth?: number
 *   errorWidth?: number
 *   warnShortSide?: number
 *   errorShortSide?: number
 *   recommended: string
 * }} RoleThresholds
 */

/** @type {Record<EcotoneImageRole, RoleThresholds>} */
export const ECOTONE_IMAGE_ROLE_THRESHOLDS = {
  hero: {
    label: 'Hero',
    warnWidth: 3200,
    errorWidth: 1600,
    recommended: 'at least 3200px wide (ideally 3200–3840px)',
  },
  editorial: {
    label: 'Editorial',
    warnWidth: 2000,
    errorWidth: 1200,
    recommended: 'at least 2000px wide (ideally 2400–2800px)',
  },
  portrait: {
    label: 'Portrait',
    warnShortSide: 1000,
    errorShortSide: 700,
    recommended: 'short side at least 1000px (ideally ≥1200px)',
  },
  card: {
    label: 'Card',
    warnWidth: 1200,
    errorWidth: 800,
    recommended: 'at least 1200px wide (ideally 1200–1600px)',
  },
}

/**
 * Parse width/height from a Sanity image asset id / _ref.
 * @param {string | null | undefined} ref
 * @returns {{ width: number, height: number } | null}
 */
export function dimensionsFromAssetRef(ref) {
  if (!ref || typeof ref !== 'string') return null
  const m = String(ref).match(/-(\d+)x(\d+)-([a-z0-9]+)$/i)
  if (!m) return null
  const width = Number(m[1])
  const height = Number(m[2])
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null
  }
  return {width, height}
}

/**
 * @param {unknown} imageValue Sanity image field value
 * @returns {string | null}
 */
function assetRefFromImage(imageValue) {
  if (!imageValue || typeof imageValue !== 'object') return null
  const asset = /** @type {{ asset?: { _ref?: string; _id?: string } }} */ (imageValue).asset
  const ref = asset?._ref || asset?._id
  return typeof ref === 'string' && ref.length > 0 ? ref : null
}

/**
 * @param {string} ref
 * @returns {boolean}
 */
function looksLikeSvgAsset(ref) {
  return /-svg$/i.test(ref)
}

/**
 * @param {unknown} imageValue
 * @param {{ getClient?: (opts: { apiVersion: string }) => { fetch: (q: string, p?: object) => Promise<unknown> } }} [context]
 * @returns {Promise<{ width: number, height: number } | null>}
 */
async function resolveImageDimensions(imageValue, context) {
  const ref = assetRefFromImage(imageValue)
  if (!ref) return null
  if (looksLikeSvgAsset(ref)) return null

  let dims = dimensionsFromAssetRef(ref)
  if (dims) return dims

  if (typeof context?.getClient === 'function') {
    try {
      const client = context.getClient({apiVersion: '2025-01-01'})
      const meta = await client.fetch(
        `*[_id == $id][0]{ "w": metadata.dimensions.width, "h": metadata.dimensions.height }`,
        {id: ref},
      )
      if (meta && typeof meta.w === 'number' && typeof meta.h === 'number') {
        return {width: meta.w, height: meta.h}
      }
    } catch {
      return null
    }
  }
  return null
}

/**
 * @param {{ width: number, height: number }} dims
 * @param {EcotoneImageRole} role
 * @returns {'ok' | 'warning' | 'error'}
 */
export function classifyImageRoleDimensions(dims, role) {
  const t = ECOTONE_IMAGE_ROLE_THRESHOLDS[role]
  if (!t) return 'ok'
  const {width, height} = dims
  const shortSide = Math.min(width, height)
  if (t.errorWidth != null && width < t.errorWidth) return 'error'
  if (t.errorShortSide != null && shortSide < t.errorShortSide) return 'error'
  if (t.warnWidth != null && width < t.warnWidth) return 'warning'
  if (t.warnShortSide != null && shortSide < t.warnShortSide) return 'warning'
  return 'ok'
}

/**
 * @param {{ width: number, height: number }} dims
 * @param {EcotoneImageRole} role
 * @param {'warning' | 'error'} severity
 * @returns {string}
 */
function messageForSeverity(dims, role, severity) {
  const t = ECOTONE_IMAGE_ROLE_THRESHOLDS[role]
  const {width, height} = dims
  const uploaded = `Uploaded: ${width} × ${height}.`

  if (severity === 'error') {
    if (t.errorWidth != null) {
      return `${t.label} image is too small for Retina delivery. ${uploaded} Minimum for ${t.label}: ${t.errorWidth}px wide. Recommended: ${t.recommended}. Upload a larger master — the site will create smaller derivatives.`
    }
    return `${t.label} image is too small for Retina delivery. ${uploaded} Minimum short side for ${t.label}: ${t.errorShortSide}px. Recommended: ${t.recommended}. Upload a larger master — the site will create smaller derivatives.`
  }

  return `Image may appear soft on Retina displays. ${uploaded} Recommended for ${t.label}: ${t.recommended}.`
}

/**
 * Shared severity check for Studio rules.
 * @param {unknown} imageValue
 * @param {EcotoneImageRole} role
 * @param {'warning' | 'error'} severity
 * @param {{ getClient?: (opts: { apiVersion: string }) => { fetch: (q: string, p?: object) => Promise<unknown> } }} [context]
 * @returns {Promise<true | string>}
 */
export async function validateEcotoneImageRoleSeverity(imageValue, role, severity, context) {
  const dims = await resolveImageDimensions(imageValue, context)
  if (!dims) return true
  const classification = classifyImageRoleDimensions(dims, role)
  if (classification !== severity) return true
  return messageForSeverity(dims, role, severity)
}

/**
 * Convenience for combining with Rule.required() on portrait fields.
 * Returns error message string | true (errors only). Prefer validateImageRole for full warn+error.
 *
 * @param {unknown} imageValue
 * @param {EcotoneImageRole} role
 * @param {{ getClient?: (opts: { apiVersion: string }) => { fetch: (q: string, p?: object) => Promise<unknown> } }} [context]
 */
export async function validateEcotoneImageRole(imageValue, role, context) {
  return validateEcotoneImageRoleSeverity(imageValue, role, 'error', context)
}

/**
 * Factory for `defineField({ validation: validateImageRole('hero') })`.
 * Emits a publish-blocking error rule and a publishable warning rule.
 * @param {EcotoneImageRole} role
 */
export function validateImageRole(role) {
  return (Rule) => [
    Rule.custom((value, context) =>
      validateEcotoneImageRoleSeverity(value, role, 'error', context),
    ),
    Rule.custom((value, context) =>
      validateEcotoneImageRoleSeverity(value, role, 'warning', context),
    ).warning(),
  ]
}

/**
 * For fields that also need Rule.required(), e.g. people portraits.
 * @param {EcotoneImageRole} role
 */
export function validateRequiredImageRole(role) {
  return (Rule) => [
    Rule.required(),
    Rule.custom((value, context) =>
      validateEcotoneImageRoleSeverity(value, role, 'error', context),
    ),
    Rule.custom((value, context) =>
      validateEcotoneImageRoleSeverity(value, role, 'warning', context),
    ).warning(),
  ]
}
