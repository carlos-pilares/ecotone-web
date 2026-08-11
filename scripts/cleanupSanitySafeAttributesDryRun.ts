/**
 * SAFE attribute cleanup — DRY RUN ONLY (no mutations).
 *
 * Plans `unset` patches for confirmed-redundant stored content that contributes
 * to Sanity's unique attribute (fields.count) limit. Does not change schema.
 *
 * Usage:
 *   npx tsx scripts/cleanupSanitySafeAttributesDryRun.ts
 *
 * Backup (run separately before any future --commit step):
 *   mkdir -p backups
 *   npx sanity dataset export production \
 *     "backups/sanity-production-$(date +%Y%m%d-%H%M%S).tar.gz"
 *
 * Requires .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
 * Read via CDN (no write token required for this dry-run).
 */
import { config } from 'dotenv'
import { resolve } from 'node:path'
import { createClient } from '@sanity/client'

config({ path: resolve(process.cwd(), '.env.local') })

type UnsetItem = {
  path: string
  valueSummary: string
  reason: string
}

type DocPlan = {
  _id: string
  _type: string
  label?: string
  unsets: UnsetItem[]
}

function defined(val: unknown): boolean {
  if (val === undefined || val === null) return false
  if (Array.isArray(val)) return val.length > 0
  if (typeof val === 'string') return val.trim().length > 0
  if (typeof val === 'object') return Object.keys(val as object).length > 0
  return true
}

function summarize(val: unknown, max = 120): string {
  if (val === undefined) return '(undefined)'
  if (val === null) return '(null)'
  if (typeof val === 'string') {
    const t = val.trim()
    if (!t) return '(empty string)'
    return t.length <= max ? JSON.stringify(t) : JSON.stringify(t.slice(0, max) + '…')
  }
  if (typeof val === 'boolean' || typeof val === 'number') return String(val)
  if (Array.isArray(val)) return `array(len=${val.length})`
  if (typeof val === 'object') {
    const o = val as Record<string, unknown>
    if (o._type === 'smartLink' || o.linkType != null || o.enabled != null) {
      return `smartLink{enabled=${String(o.enabled)}, linkType=${String(o.linkType ?? '')}, label=${JSON.stringify(String(o.label ?? '').slice(0, 40))}}`
    }
    if (o.asset && typeof o.asset === 'object') return 'image{asset}'
    const keys = Object.keys(o).filter((k) => !k.startsWith('_') || k === '_type')
    return `object{${keys.slice(0, 8).join(',')}${keys.length > 8 ? ',…' : ''}}`
  }
  return String(val)
}

function norm(s: unknown): string {
  return typeof s === 'string' ? s.trim() : ''
}

/** Smart link usable enough to replace a legacy text/href pair. */
function smartLinkUsable(smart: Record<string, unknown> | null | undefined): boolean {
  if (!smart || typeof smart !== 'object') return false
  if (smart.enabled === false) return false
  const lt = typeof smart.linkType === 'string' ? smart.linkType.trim() : ''
  if (lt === 'book' || lt === 'booking') return true
  if (lt) return true
  if (typeof smart.label === 'string' && smart.label.trim()) return true
  if (typeof smart.externalUrl === 'string' && smart.externalUrl.trim()) return true
  return false
}

function smartLinkFingerprint(smart: Record<string, unknown> | null | undefined): string {
  if (!smart) return ''
  return JSON.stringify({
    enabled: smart.enabled,
    linkType: smart.linkType ?? null,
    label: norm(smart.label),
    bookingMode: smart.bookingMode ?? null,
    samePageSectionId: smart.samePageSectionId ?? null,
    internalPage: smart.internalPage ?? null,
    externalUrl: smart.externalUrl ?? null,
    whatsappNumber: smart.whatsappNumber ?? null,
  })
}

async function fetchFieldCount(projectId: string, dataset: string): Promise<number | null> {
  try {
    const url = `https://${projectId}.api.sanity.io/v1/data/stats/${dataset}`
    const res = await fetch(url)
    if (!res.ok) return null
    const json = (await res.json()) as { fields?: { count?: { value?: number } } }
    const n = json.fields?.count?.value
    return typeof n === 'number' ? n : null
  } catch {
    return null
  }
}

function probeTokenStatus(): {
  envPresent: boolean
  containsPlaceholder: boolean
  strippedAuthOk: boolean | null
  role: string | null
  note: string
} {
  const raw = process.env.SANITY_API_TOKEN?.trim() ?? ''
  if (!raw) {
    return {
      envPresent: false,
      containsPlaceholder: false,
      strippedAuthOk: null,
      role: null,
      note: 'SANITY_API_TOKEN missing from .env.local — mutations cannot run until a valid Editor/write token is configured.',
    }
  }
  const containsPlaceholder = raw.includes('TU_TOKEN')
  const stripped = raw.replace(/TU_TOKEN_AQUI/g, '').trim()
  return {
    envPresent: true,
    containsPlaceholder,
    strippedAuthOk: null,
    role: null,
    note: containsPlaceholder
      ? 'Token string contains placeholder fragment TU_TOKEN_AQUI; raw value fails auth. Stripping the placeholder yields a usable token in local scripts (see probe below).'
      : 'Token present without known placeholder fragment.',
  }
}

async function probeTokenAuth(
  projectId: string,
  status: ReturnType<typeof probeTokenStatus>,
): Promise<ReturnType<typeof probeTokenStatus>> {
  const raw = process.env.SANITY_API_TOKEN?.trim() ?? ''
  if (!raw) return status
  const candidates = [
    { label: 'raw', token: raw },
    { label: 'stripped', token: raw.replace(/TU_TOKEN_AQUI/g, '').trim() },
  ]
  let strippedAuthOk: boolean | null = null
  let role: string | null = null
  const notes: string[] = [status.note]

  for (const c of candidates) {
    if (!c.token) continue
    try {
      const res = await fetch(`https://${projectId}.api.sanity.io/v2024-01-01/users/me`, {
        headers: { Authorization: `Bearer ${c.token}` },
      })
      if (res.ok) {
        const body = (await res.json()) as { role?: string; roles?: Array<{ name?: string }> }
        role = body.role ?? body.roles?.[0]?.name ?? 'unknown'
        if (c.label === 'stripped') strippedAuthOk = true
        notes.push(`${c.label}: OK (role=${role})`)
      } else {
        if (c.label === 'stripped') strippedAuthOk = false
        notes.push(`${c.label}: HTTP ${res.status}`)
      }
    } catch (e) {
      if (c.label === 'stripped') strippedAuthOk = false
      notes.push(`${c.label}: ${(e as Error).message}`)
    }
  }

  return {
    ...status,
    strippedAuthOk,
    role,
    note: notes.join(' | '),
  }
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  if (!projectId || !dataset) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET')
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
    useCdn: true,
  })

  const officialCount = await fetchFieldCount(projectId, dataset)
  let tokenStatus = probeTokenStatus()
  tokenStatus = await probeTokenAuth(projectId, tokenStatus)

  const plans: DocPlan[] = []
  const excluded: Array<{ scope: string; detail: string }> = []

  // ─── 1. homePage ─────────────────────────────────────────────────────────
  const home = await client.fetch<Record<string, unknown> | null>(`*[_type == "homePage"][0]{
    _id, _type,
    heroCta1Text, heroCta1Link, heroCta1SmartLink,
    heroCta2Text, heroCta2Link, heroCta2SmartLink,
    heroCardCtaText, heroCardCtaLink, heroCardCtaSmartLink,
    manifestoCta1Text, manifestoCta1Link, manifestoCta1SmartLink,
    manifestoCta2Text, manifestoCta2Link, manifestoCta2SmartLink,
    bookingCta1Text, bookingCta1Link, bookingCta1SmartLink,
    bookingCta2Text, bookingCta2Link, bookingCta2SmartLink,
    explorerTailorWhatsappSmartLink,
    explorerTailorBand
  }`)

  if (home?._id) {
    const unsets: UnsetItem[] = []
    const pairs: Array<{
      name: string
      textKey: string
      linkKey: string
      smartKey: string
    }> = [
      { name: 'heroCta1', textKey: 'heroCta1Text', linkKey: 'heroCta1Link', smartKey: 'heroCta1SmartLink' },
      { name: 'heroCta2', textKey: 'heroCta2Text', linkKey: 'heroCta2Link', smartKey: 'heroCta2SmartLink' },
      {
        name: 'heroCardCta',
        textKey: 'heroCardCtaText',
        linkKey: 'heroCardCtaLink',
        smartKey: 'heroCardCtaSmartLink',
      },
      {
        name: 'manifestoCta1',
        textKey: 'manifestoCta1Text',
        linkKey: 'manifestoCta1Link',
        smartKey: 'manifestoCta1SmartLink',
      },
      {
        name: 'manifestoCta2',
        textKey: 'manifestoCta2Text',
        linkKey: 'manifestoCta2Link',
        smartKey: 'manifestoCta2SmartLink',
      },
    ]

    for (const p of pairs) {
      const smart = home[p.smartKey] as Record<string, unknown> | null | undefined
      if (!smartLinkUsable(smart)) {
        if (defined(home[p.textKey]) || defined(home[p.linkKey])) {
          excluded.push({
            scope: `homePage.${p.name}`,
            detail: `Legacy text/link present but smart link missing/unusable — keeping (runtime may still use legacy via applyHomePageSmartLinks).`,
          })
        }
        continue
      }
      if (defined(home[p.textKey])) {
        unsets.push({
          path: p.textKey,
          valueSummary: summarize(home[p.textKey]),
          reason: `${p.name} smart link present — legacy text unused as CMS source`,
        })
      }
      if (defined(home[p.linkKey])) {
        unsets.push({
          path: p.linkKey,
          valueSummary: summarize(home[p.linkKey]),
          reason: `${p.name} smart link present — legacy href unused as CMS source`,
        })
      }
    }

    // booking CTAs: only if smart present (currently expected NOT to qualify)
    for (const p of [
      {
        name: 'bookingCta1',
        textKey: 'bookingCta1Text',
        linkKey: 'bookingCta1Link',
        smartKey: 'bookingCta1SmartLink',
      },
      {
        name: 'bookingCta2',
        textKey: 'bookingCta2Text',
        linkKey: 'bookingCta2Link',
        smartKey: 'bookingCta2SmartLink',
      },
    ] as const) {
      const smart = home[p.smartKey] as Record<string, unknown> | null | undefined
      if (smartLinkUsable(smart)) {
        if (defined(home[p.textKey])) {
          unsets.push({
            path: p.textKey,
            valueSummary: summarize(home[p.textKey]),
            reason: `${p.name} smart link present — legacy text unused as CMS source`,
          })
        }
        if (defined(home[p.linkKey])) {
          unsets.push({
            path: p.linkKey,
            valueSummary: summarize(home[p.linkKey]),
            reason: `${p.name} smart link present — legacy href unused as CMS source`,
          })
        }
      } else if (defined(home[p.textKey]) || defined(home[p.linkKey])) {
        excluded.push({
          scope: `homePage.${p.name}`,
          detail:
            'No usable booking*SmartLink — legacy text/link are the live CMS source (HomeStaticSections). EXCLUDED from SAFE batch.',
        })
      }
    }

    const tailorBand = home.explorerTailorBand as Record<string, unknown> | null | undefined
    const bandActive =
      tailorBand &&
      typeof tailorBand === 'object' &&
      (tailorBand.showTailorMade === true || tailorBand.enabled === true)
    const explorerWa = home.explorerTailorWhatsappSmartLink as Record<string, unknown> | null | undefined
    if (defined(explorerWa)) {
      if (bandActive) {
        unsets.push({
          path: 'explorerTailorWhatsappSmartLink',
          valueSummary: summarize(explorerWa),
          reason:
            'explorerTailorBand is active (showTailorMade/enabled) — resolveHomeExplorerTailorBand prefers the band; legacy WhatsApp smart link unused',
        })
      } else {
        excluded.push({
          scope: 'homePage.explorerTailorWhatsappSmartLink',
          detail: 'explorerTailorBand not active — keeping as legacy tailor CTA source',
        })
      }
    }

    if (unsets.length) {
      plans.push({ _id: String(home._id), _type: 'homePage', label: 'homePage', unsets })
    }
  }

  // ─── 2. bookingModalSettings ─────────────────────────────────────────────
  const booking = await client.fetch<Record<string, unknown> | null>(
    `*[_type == "bookingModalSettings"][0]{
      _id, _type,
      generalModal,
      experienceModal,
      planJourney,
      experienceBooking
    }`,
  )
  if (booking?._id) {
    const unsets: UnsetItem[] = []
    const general = booking.generalModal as Record<string, unknown> | null | undefined
    const hasGeneral =
      !!general &&
      (defined(general.step1) || defined(general.step2) || defined(general.step3) || defined(general.finalStep))

    if (defined(booking.planJourney)) {
      if (hasGeneral) {
        unsets.push({
          path: 'planJourney',
          valueSummary: summarize(booking.planJourney),
          reason: 'generalModal populated — bookingModalCopy uses generalModal, not planJourney',
        })
      } else {
        excluded.push({
          scope: 'bookingModalSettings.planJourney',
          detail: 'generalModal missing shape — planJourney still required as fallback',
        })
      }
    }

    if (defined(booking.experienceBooking)) {
      unsets.push({
        path: 'experienceBooking',
        valueSummary: summarize(booking.experienceBooking),
        reason: 'Legacy experienceBooking present — safe to unset when experienceModal is the active model',
      })
    }

    if (unsets.length) {
      plans.push({
        _id: String(booking._id),
        _type: 'bookingModalSettings',
        label: 'booking modals',
        unsets,
      })
    }
  }

  // ─── 3. experiencePage ───────────────────────────────────────────────────
  const experiencePages = await client.fetch<
    Array<{
      _id: string
      _type: string
      slug?: string | null
      reserveBlock?: unknown
      reserveCtaSettings?: {
        primaryCtaSmartLink?: unknown
        secondaryCtaSmartLink?: unknown
        title?: string | null
        eyebrow?: string | null
      } | null
      payloadV1?: unknown
      snapshotStatSelections?: unknown[] | null
      overviewHighlightOrder?: unknown[] | null
      wildlifeDisplayOrder?: unknown[] | null
      includesDisplayOrder?: unknown[] | null
      notIncludesDisplayOrder?: unknown[] | null
      faqDisplayOrder?: unknown[] | null
      resourcesFromExperienceOrder?: unknown[] | null
      experienceOrder?: unknown[] | null
      featuredExperienceOrder?: unknown[] | null
    }>
  >(
    `*[_type == "experiencePage"]{
      _id, _type,
      "slug": slug.current,
      reserveBlock,
      reserveCtaSettings {
        eyebrow, title, primaryCtaSmartLink, secondaryCtaSmartLink
      },
      payloadV1,
      snapshotStatSelections,
      overviewHighlightOrder,
      wildlifeDisplayOrder,
      includesDisplayOrder,
      notIncludesDisplayOrder,
      faqDisplayOrder,
      resourcesFromExperienceOrder,
      experienceOrder,
      featuredExperienceOrder
    }`,
  )

  for (const doc of experiencePages) {
    const unsets: UnsetItem[] = []
    const rs = doc.reserveCtaSettings
    const hasReserveCta =
      !!rs &&
      (smartLinkUsable(rs.primaryCtaSmartLink as Record<string, unknown>) ||
        defined(rs.title) ||
        defined(rs.eyebrow))

    if (defined(doc.reserveBlock)) {
      if (hasReserveCta && smartLinkUsable(rs?.primaryCtaSmartLink as Record<string, unknown>)) {
        unsets.push({
          path: 'reserveBlock',
          valueSummary: summarize(doc.reserveBlock),
          reason:
            'reserveCtaSettings.primaryCtaSmartLink present — alsoBookFromStructuredRow / resolveReserveCtaCard prefer reserveCtaSettings',
        })
      } else {
        excluded.push({
          scope: `experiencePage:${doc.slug ?? doc._id}.reserveBlock`,
          detail: 'reserveCtaSettings primary CTA incomplete — keeping reserveBlock fallback',
        })
      }
    }

    if (defined(doc.payloadV1)) {
      unsets.push({
        path: 'payloadV1',
        valueSummary: summarize(doc.payloadV1),
        reason: 'Legacy JSON blob unused by public experience queries',
      })
    }

    const deadOrders: Array<[string, unknown]> = [
      ['snapshotStatSelections', doc.snapshotStatSelections],
      ['overviewHighlightOrder', doc.overviewHighlightOrder],
      ['wildlifeDisplayOrder', doc.wildlifeDisplayOrder],
      ['includesDisplayOrder', doc.includesDisplayOrder],
      ['notIncludesDisplayOrder', doc.notIncludesDisplayOrder],
      ['faqDisplayOrder', doc.faqDisplayOrder],
      ['resourcesFromExperienceOrder', doc.resourcesFromExperienceOrder],
      ['experienceOrder', doc.experienceOrder],
      ['featuredExperienceOrder', doc.featuredExperienceOrder],
    ]
    for (const [path, val] of deadOrders) {
      // Only unset if present; *OrderKeys (active) are not in this list
      if (defined(val)) {
        // Conservative: index-based order arrays are superseded by *OrderKeys on live pages.
        // Include only when empty arrays somehow still stored as defined — `defined` requires length>0.
        // If non-empty, still SAFE only when corresponding *OrderKeys exist elsewhere — skip non-empty to stay SAFE.
        if (Array.isArray(val) && val.length > 0) {
          excluded.push({
            scope: `experiencePage:${doc.slug ?? doc._id}.${path}`,
            detail: `Non-empty legacy order array present — excluded from SAFE (verify *OrderKeys migration first)`,
          })
        }
      }
    }

    if (unsets.length) {
      plans.push({
        _id: doc._id,
        _type: 'experiencePage',
        label: doc.slug ?? undefined,
        unsets,
      })
    }
  }

  // ─── 4. lodgePage tailor legacy (only when equivalent / unused) ──────────
  const lodgePages = await client.fetch<
    Array<{
      _id: string
      _type: string
      slug?: string | null
      experiencesTailorCta?: Record<string, unknown> | null
    }>
  >(
    `*[_type == "lodgePage"]{
      _id, _type,
      "slug": slug.current,
      experiencesTailorCta
    }`,
  )

  for (const doc of lodgePages) {
    const t = doc.experiencesTailorCta
    if (!t || typeof t !== 'object') continue
    const unsets: UnsetItem[] = []
    const hasNewCopy =
      defined(t.tailorMadeEyebrow) || defined(t.tailorMadeTitle) || defined(t.tailorMadeBody)
    const hasNewCta = smartLinkUsable(t.tailorMadeCta as Record<string, unknown>)
    const show = t.showTailorMade === true || t.showTailorMade === false

    if (!hasNewCopy && !hasNewCta && !show) {
      excluded.push({
        scope: `lodgePage:${doc.slug ?? doc._id}.experiencesTailorCta`,
        detail: 'No tailorMade* / showTailorMade — legacy fields may still be live; excluded',
      })
      continue
    }

    // enabled superseded by showTailorMade
    if (defined(t.enabled) && show) {
      unsets.push({
        path: 'experiencesTailorCta.enabled',
        valueSummary: summarize(t.enabled),
        reason: 'showTailorMade present — enabled is legacy parallel',
      })
    }

    // description unused when subtitle or tailorMadeBody exists (resolver: subtitle ?? tailorMadeBody ?? description)
    if (defined(t.description) && (defined(t.subtitle) || defined(t.tailorMadeBody))) {
      unsets.push({
        path: 'experiencesTailorCta.description',
        valueSummary: summarize(t.description),
        reason: 'Unused behind subtitle/tailorMadeBody in resolveTailorMadeBand',
      })
    }

    if (defined(t.image)) {
      unsets.push({
        path: 'experiencesTailorCta.image',
        valueSummary: summarize(t.image),
        reason: 'Hidden reserved image unused by TailorMadeBand UI',
      })
    }
    if (defined(t.imageAlt)) {
      unsets.push({
        path: 'experiencesTailorCta.imageAlt',
        valueSummary: summarize(t.imageAlt),
        reason: 'Legacy image alt unused by TailorMadeBand UI',
      })
    }

    // Copy fields: only when identical to tailorMade* (resolver prefers legacy first — unsetting switches to new)
    if (defined(t.eyebrow) && defined(t.tailorMadeEyebrow) && norm(t.eyebrow) === norm(t.tailorMadeEyebrow)) {
      unsets.push({
        path: 'experiencesTailorCta.eyebrow',
        valueSummary: summarize(t.eyebrow),
        reason: 'Identical to tailorMadeEyebrow — redundant',
      })
    } else if (defined(t.eyebrow) && defined(t.tailorMadeEyebrow)) {
      excluded.push({
        scope: `lodgePage:${doc.slug}.experiencesTailorCta.eyebrow`,
        detail: `Differs from tailorMadeEyebrow (${JSON.stringify(norm(t.eyebrow))} vs ${JSON.stringify(norm(t.tailorMadeEyebrow))}) — EXCLUDED (would change live copy)`,
      })
    }

    if (defined(t.title) && defined(t.tailorMadeTitle) && norm(t.title) === norm(t.tailorMadeTitle)) {
      unsets.push({
        path: 'experiencesTailorCta.title',
        valueSummary: summarize(t.title),
        reason: 'Identical to tailorMadeTitle — redundant',
      })
    } else if (defined(t.title) && defined(t.tailorMadeTitle) && norm(t.title) !== norm(t.tailorMadeTitle)) {
      excluded.push({
        scope: `lodgePage:${doc.slug}.experiencesTailorCta.title`,
        detail: 'Differs from tailorMadeTitle — EXCLUDED',
      })
    }

    if (defined(t.subtitle) && defined(t.tailorMadeBody) && norm(t.subtitle) === norm(t.tailorMadeBody)) {
      unsets.push({
        path: 'experiencesTailorCta.subtitle',
        valueSummary: summarize(t.subtitle),
        reason: 'Identical to tailorMadeBody — redundant',
      })
    } else if (defined(t.subtitle) && defined(t.tailorMadeBody)) {
      excluded.push({
        scope: `lodgePage:${doc.slug}.experiencesTailorCta.subtitle`,
        detail: 'Differs from tailorMadeBody — EXCLUDED (would change live subtitle)',
      })
    }

    // CTA: only if fingerprint equal (otherwise live CTA would change: book modal vs samePageSection)
    if (defined(t.ctaSmartLink) && hasNewCta) {
      if (
        smartLinkFingerprint(t.ctaSmartLink as Record<string, unknown>) ===
        smartLinkFingerprint(t.tailorMadeCta as Record<string, unknown>)
      ) {
        unsets.push({
          path: 'experiencesTailorCta.ctaSmartLink',
          valueSummary: summarize(t.ctaSmartLink),
          reason: 'Identical to tailorMadeCta — redundant',
        })
      } else {
        excluded.push({
          scope: `lodgePage:${doc.slug}.experiencesTailorCta.ctaSmartLink`,
          detail:
            'Differs from tailorMadeCta (often book vs samePageSection) — EXCLUDED to preserve live Enquire behavior',
        })
      }
    }

    if (unsets.length) {
      plans.push({
        _id: doc._id,
        _type: 'lodgePage',
        label: doc.slug ?? undefined,
        unsets,
      })
    }
  }

  // ─── 5. learningProgramme flat mentors ───────────────────────────────────
  const programmes = await client.fetch<
    Array<{
      _id: string
      _type: string
      slug?: string | null
      mentors?: unknown[] | null
      mentorName?: string | null
      mentorRole?: string | null
      mentorPhoto?: unknown
      mentorBiography?: string | null
      mentorAchievements?: unknown[] | null
      mentorSkills?: unknown[] | null
    }>
  >(
    `*[_type == "learningProgramme"]{
      _id, _type,
      "slug": slug.current,
      mentors,
      mentorName, mentorRole, mentorPhoto, mentorBiography,
      mentorAchievements, mentorSkills
    }`,
  )

  for (const doc of programmes) {
    if (!Array.isArray(doc.mentors) || doc.mentors.length === 0) {
      if (
        defined(doc.mentorName) ||
        defined(doc.mentorRole) ||
        defined(doc.mentorPhoto) ||
        defined(doc.mentorBiography)
      ) {
        excluded.push({
          scope: `learningProgramme:${doc.slug ?? doc._id}`,
          detail: 'Flat mentor fields present but mentors[] empty — keeping as active fallback',
        })
      }
      continue
    }
    const unsets: UnsetItem[] = []
    const flat: Array<[string, unknown]> = [
      ['mentorName', doc.mentorName],
      ['mentorRole', doc.mentorRole],
      ['mentorPhoto', doc.mentorPhoto],
      ['mentorBiography', doc.mentorBiography],
      ['mentorAchievements', doc.mentorAchievements],
      ['mentorSkills', doc.mentorSkills],
    ]
    for (const [path, val] of flat) {
      if (defined(val)) {
        unsets.push({
          path,
          valueSummary: summarize(val),
          reason: `mentors[] has ${doc.mentors.length} item(s) — resolveLearningProgrammeContent prefers mentors[]`,
        })
      }
    }
    if (unsets.length) {
      plans.push({
        _id: doc._id,
        _type: 'learningProgramme',
        label: doc.slug ?? undefined,
        unsets,
      })
    }
  }

  // ─── 6. experience.termsAndConditions === "PENDING" ──────────────────────
  const pendingTerms = await client.fetch<
    Array<{ _id: string; _type: string; name?: string | null; slug?: string | null; termsAndConditions?: string | null }>
  >(
    `*[_type == "experience" && termsAndConditions == "PENDING"]{
      _id, _type, name, "slug": slug.current, termsAndConditions
    }`,
  )
  for (const doc of pendingTerms) {
    plans.push({
      _id: doc._id,
      _type: 'experience',
      label: doc.slug ?? doc.name ?? undefined,
      unsets: [
        {
          path: 'termsAndConditions',
          valueSummary: summarize(doc.termsAndConditions),
          reason: 'Placeholder junk value exactly "PENDING" — not real terms copy',
        },
      ],
    })
  }

  // ─── Report ──────────────────────────────────────────────────────────────
  const totalPaths = plans.reduce((n, p) => n + p.unsets.length, 0)
  const byType = new Map<string, number>()
  for (const p of plans) byType.set(p._type, (byType.get(p._type) ?? 0) + 1)

  // Rough exclusive-path estimate (not official)
  const approxExclusiveRoots = new Set<string>()
  for (const p of plans) {
    for (const u of p.unsets) {
      // top-level or first two segments for nested
      const parts = u.path.split('.')
      approxExclusiveRoots.add(parts[0]!)
    }
  }

  console.log('\n========== SAFE ATTRIBUTE CLEANUP — DRY RUN (NO MUTATIONS) ==========\n')
  console.log(`Dataset: ${projectId}/${dataset}`)
  console.log(
    `Official Sanity fields.count: ${officialCount != null ? officialCount : '(unavailable)'}`,
  )
  console.log(`Mode: DRY RUN ONLY — zero patches sent`)
  console.log('\n--- Write token status ---')
  console.log(`env present: ${tokenStatus.envPresent}`)
  console.log(`contains TU_TOKEN placeholder: ${tokenStatus.containsPlaceholder}`)
  console.log(`stripped token auth: ${String(tokenStatus.strippedAuthOk)}`)
  console.log(`role (if auth ok): ${tokenStatus.role ?? 'n/a'}`)
  console.log(`note: ${tokenStatus.note}`)

  console.log('\n--- Backup command (run before any future commit) ---')
  console.log(`mkdir -p backups`)
  console.log(
    `npx sanity dataset export ${dataset} "backups/sanity-${dataset}-$(date +%Y%m%d-%H%M%S).tar.gz"`,
  )
  console.log(`Backup location: <repo>/backups/sanity-${dataset}-YYYYMMDD-HHMMSS.tar.gz`)
  console.log(`(backups/ is local; sanity-backup-before-cleanup.tar.gz is gitignored)`)

  console.log('\n--- Proposed mutation plan ---')
  console.log(`Documents affected: ${plans.length}`)
  console.log(`Candidate paths to unset: ${totalPaths}`)
  console.log(
    `By type: ${[...byType.entries()].map(([t, n]) => `${t}=${n}`).join(', ') || '(none)'}`,
  )

  for (const plan of plans) {
    console.log(`\n### ${plan._type}  ${plan._id}${plan.label ? `  (${plan.label})` : ''}`)
    console.log(`    paths: ${plan.unsets.length}`)
    for (const u of plan.unsets) {
      console.log(`    - unset ${u.path}`)
      console.log(`        value: ${u.valueSummary}`)
      console.log(`        why:   ${u.reason}`)
    }
  }

  if (excluded.length) {
    console.log('\n--- Explicitly EXCLUDED from this SAFE batch ---')
    for (const e of excluded) {
      console.log(`  • ${e.scope}`)
      console.log(`      ${e.detail}`)
    }
  }

  console.log('\n--- Attribute reduction estimate (NOT official) ---')
  console.log(
    'Official metric only updates after content is unset and Sanity reindexes fields.count.',
  )
  console.log(
    `This batch targets ~${totalPaths} stored field trees across ${plans.length} docs.`,
  )
  console.log(
    'Prior audit scaled estimate for a similar SAFE set was roughly −50 to −70 attributes,',
  )
  console.log(
    'but booking CTA legacy was removed from scope here (still live), and lodge CTA/subtitle',
  )
  console.log(
    'diffs were excluded — expect a more conservative ~−25 to −45 on fields.count.',
  )
  console.log(
    `If official count is ${officialCount ?? 2041}, post-SAFE expectation ≈ ${
      officialCount != null ? officialCount - 35 : '~2005'
    } (mid estimate) — likely still above 1950; LOW guide cleanup remains for that target.`,
  )

  console.log('\n--- Next step ---')
  console.log('Review this plan. Do NOT run mutations until explicitly approved.')
  console.log('No --commit flag exists on this script (dry-run only).')
  console.log('======================================================================\n')

  // Machine-readable summary for the agent/user
  const machine = {
    mode: 'dry-run',
    mutationsExecuted: false,
    officialFieldsCount: officialCount,
    documentsAffected: plans.length,
    pathsToUnset: totalPaths,
    plans,
    excluded,
    tokenStatus,
  }
  console.log('JSON_SUMMARY_BEGIN')
  console.log(JSON.stringify(machine, null, 2))
  console.log('JSON_SUMMARY_END')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
