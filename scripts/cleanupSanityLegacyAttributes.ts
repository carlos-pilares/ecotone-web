/**
 * Unset legacy Sanity document fields to reduce dataset attribute count.
 * Does not delete documents — only patch unset[].
 *
 *   npx tsx scripts/cleanupSanityLegacyAttributes.ts           # dry-run
 *   npx tsx scripts/cleanupSanityLegacyAttributes.ts --commit  # apply
 *
 * Requires .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN
 */
import { config } from 'dotenv'
import { resolve } from 'node:path'

import {
  centralFaqsForExperience,
  hasCentralFaqsContent,
  type FaqsSettingsRow,
} from '../lib/faqsCms'
import {
  centralTermsPanelsForExperience,
  hasCentralTermsContent,
  resolveTermsPdfUrlForExperience,
  type TermsConditionsSettingsRow,
} from '../lib/termsConditionsCms'

import { writeClient } from './seed/sanityWriteClient.js'

config({ path: resolve(process.cwd(), '.env.local') })

const COMMIT = process.argv.includes('--commit')

type PatchPlan = {
  _id: string
  _type: string
  fields: string[]
  reason: string
}

function defined(val: unknown): boolean {
  if (val === undefined || val === null) return false
  if (Array.isArray(val)) return val.length > 0
  if (typeof val === 'string') return val.trim().length > 0
  if (typeof val === 'object') return Object.keys(val as object).length > 0
  return true
}

async function fetchFieldCount(projectId: string, dataset: string): Promise<number | null> {
  try {
    const url = `https://${projectId}.api.sanity.io/v1/data/stats/${dataset}`
    const res = await fetch(url)
    if (!res.ok) return null
    const json = (await res.json()) as {
      fields?: { count?: { value?: number } }
      attributes?: number
    }
    const fromFields = json.fields?.count?.value
    if (typeof fromFields === 'number') return fromFields
    return typeof json.attributes === 'number' ? json.attributes : null
  } catch {
    return null
  }
}

function resolveWriteToken(): string {
  let token = process.env.SANITY_API_TOKEN?.trim() ?? ''
  if (token.includes('TU_TOKEN_AQUI')) {
    token = token.replace('TU_TOKEN_AQUI', '').trim()
  }
  if (!token) {
    throw new Error(
      'SANITY_API_TOKEN is missing in .env.local. Add a valid write token from sanity.io/manage → API → Tokens.',
    )
  }
  return token
}

async function main() {
  process.env.SANITY_API_TOKEN = resolveWriteToken()
  const client = writeClient()
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

  const statsBefore = await fetchFieldCount(projectId, dataset)
  // eslint-disable-next-line no-console
  console.log(`\n=== Sanity attribute stats (${dataset}) ===`)
  // eslint-disable-next-line no-console
  console.log(statsBefore != null ? `Before: ${statsBefore} attributes` : 'Before: (stats API unavailable)')

  const [headerSettings, footerSettings, termsSettings, faqsSettings] = await Promise.all([
    client.fetch<{ _id: string } | null>(`*[_id == "headerSettings"][0]{ _id }`),
    client.fetch<{
      _id: string
      column1?: unknown
      socialMedia?: unknown[]
      bottomBar?: { copyright?: string | null } | null
    } | null>(`*[_id == "footerSettings"][0]{
      _id,
      column1,
      socialMedia,
      bottomBar
    }`),
    client.fetch<TermsConditionsSettingsRow>(`*[_id == "termsConditionsSettings"][0]{
      termsItems[]{ _key, title, text, appliesToAll, "experienceIds": experiences[]._ref },
      termsDocuments[]{ _key, appliesToAll, "pdfUrl": pdfFile.asset->url, "experienceIds": experiences[]._ref }
    }`),
    client.fetch<FaqsSettingsRow>(`*[_id == "faqsSettings"][0]{
      faqItems[]{ _key, title, body, appliesToAll, "experienceIds": experiences[]._ref }
    }`),
  ])

  const hasHeader = Boolean(headerSettings?._id)
  const hasFooter = Boolean(footerSettings?._id)
  const footerHasNewModel =
    Boolean(footerSettings?.column1) ||
    Boolean(footerSettings?.socialMedia?.length) ||
    Boolean(footerSettings?.bottomBar?.copyright?.trim())

  const centralTerms = (termsSettings ?? null) as TermsConditionsSettingsRow
  const centralFaqs = (faqsSettings ?? null) as FaqsSettingsRow
  const centralTermsReady = hasCentralTermsContent(centralTerms)
  const centralFaqsReady = hasCentralFaqsContent(centralFaqs)

  const plans: PatchPlan[] = []

  // --- siteSettings ---
  const siteRows = await client.fetch<Array<Record<string, unknown> & { _id: string }>>(
    `*[_type == "siteSettings"]{ _id, header, footer, socialLinks, copyright }`,
  )
  for (const doc of siteRows) {
    const fields: string[] = []
    if (hasHeader && defined(doc.header)) fields.push('header')
    if (hasFooter && defined(doc.footer)) fields.push('footer')
    if (hasFooter && defined(doc.socialLinks)) fields.push('socialLinks')
    if (hasFooter && defined(doc.copyright)) fields.push('copyright')
    if (fields.length) {
      plans.push({
        _id: doc._id,
        _type: 'siteSettings',
        fields,
        reason: 'Replaced by headerSettings/footerSettings singletons',
      })
    }
  }

  // --- footerSettings legacy nested ---
  if (footerSettings && footerHasNewModel) {
    const footerLegacyFields: string[] = []
    const fullFooter = await client.fetch<Record<string, unknown>>(`*[_id == "footerSettings"][0]`)
    if (fullFooter) {
      if (defined(fullFooter.footer)) footerLegacyFields.push('footer')
      if (defined(fullFooter.socialLinks)) footerLegacyFields.push('socialLinks')
      if (defined(fullFooter.copyright)) footerLegacyFields.push('copyright')
      if (footerLegacyFields.length) {
        plans.push({
          _id: footerSettings._id,
          _type: 'footerSettings',
          fields: footerLegacyFields,
          reason: 'Legacy nested footer block on footerSettings',
        })
      }
    }
  }

  // --- experiencePage (global safe fields) ---
  const xpSafeFields = [
    'snapshotStatSelections',
    'payloadV1',
    'tailorMadeImage',
    'tailorMadeAlt',
    'tailorMadeCtaLabel',
    'lodgePageLink',
    'lodgeCtaSmartLink',
    'resources',
    'overviewHighlightOrder',
    'wildlifeDisplayOrder',
    'includesDisplayOrder',
    'notIncludesDisplayOrder',
    'faqDisplayOrder',
    'resourcesFromExperienceOrder',
    'termsImportantNotesKeys',
    'termsImportantNotesOrder',
    'relatedSectionEyebrow',
    'relatedSectionTitle',
  ] as const

  const experiencePages = await client.fetch<
    Array<
      Record<string, unknown> & {
        _id: string
        reviewsSection?: { reviewCards?: unknown[] | null } | null
        reviewRefs?: unknown[] | null
      }
    >
  >(
    `*[_type == "experiencePage"]{
      _id,
      snapshotStatSelections,
      payloadV1,
      tailorMadeImage,
      tailorMadeAlt,
      tailorMadeCtaLabel,
      lodgePageLink,
      lodgeCtaSmartLink,
      resources,
      overviewHighlightOrder,
      wildlifeDisplayOrder,
      includesDisplayOrder,
      notIncludesDisplayOrder,
      faqDisplayOrder,
      resourcesFromExperienceOrder,
      termsImportantNotesKeys,
      termsImportantNotesOrder,
      relatedSectionEyebrow,
      relatedSectionTitle,
      reviewRefs,
      reviewsSection{ "reviewCards": reviewCards },
      showTailorMade,
      tailorMadeCtaSmartLink,
      pageHero { bookCta, bookCtaSmartLink },
      internalNav { bookCta, bookCtaSmartLink, ctaSmartLink },
      reserveBlock,
      reserveCtaSettings { priceSource, customPriceText, priceOverrideText, primaryCtaSmartLink }
    }`,
  )

  for (const doc of experiencePages) {
    const fields: string[] = xpSafeFields.filter((f) => defined(doc[f]))
    const reviewCards = doc.reviewsSection?.reviewCards
    if (
      Array.isArray(reviewCards) &&
      reviewCards.length > 0 &&
      defined(doc.reviewRefs)
    ) {
      fields.push('reviewRefs')
    }
    const ph = doc.pageHero as Record<string, unknown> | null | undefined
    if (ph?.bookCtaSmartLink && defined(ph.bookCta)) {
      fields.push('pageHero.bookCta')
    }
    const nav = doc.internalNav as Record<string, unknown> | null | undefined
    if (nav?.ctaSmartLink && defined(nav.bookCta)) {
      fields.push('internalNav.bookCta')
    }
    if (defined(nav?.bookCtaSmartLink)) {
      fields.push('internalNav.bookCtaSmartLink')
    }
    const hasReserveCta = Boolean(
      (doc.reserveCtaSettings as Record<string, unknown> | null | undefined)?.primaryCtaSmartLink,
    )
    if (hasReserveCta && defined(doc.reserveBlock)) {
      fields.push('reserveBlock')
    }
    if (doc.showTailorMade === false && defined(doc.tailorMadeCtaSmartLink)) {
      fields.push('tailorMadeCtaSmartLink')
    }
    const rs = doc.reserveCtaSettings as Record<string, unknown> | null | undefined
    if (rs?.priceSource === 'linked') {
      if (defined(rs.customPriceText)) fields.push('reserveCtaSettings.customPriceText')
      if (defined(rs.priceOverrideText)) fields.push('reserveCtaSettings.priceOverrideText')
    }
    if (fields.length) {
      plans.push({
        _id: doc._id,
        _type: 'experiencePage',
        fields: [...new Set(fields)],
        reason:
          fields.includes('reviewRefs')
            ? 'Deprecated page fields; reviewRefs superseded by reviewsSection'
            : 'Deprecated experiencePage fields not used at runtime',
      })
    }
  }

  // --- experience (per-doc conditional) ---
  const experiences = await client.fetch<
    Array<
      Record<string, unknown> & {
        _id: string
        termsPanels?: unknown[] | null
        fullTermsPdf?: unknown
        faqs?: unknown[] | null
        resources?: unknown[] | null
        knowledgeResources?: unknown[] | null
        travelerGuideSections?: unknown[] | null
        travelerGuideSubsections?: unknown[] | null
        fullTermsPdfUrl?: string | null
      }
    >
  >(
    `*[_type == "experience"]{
      _id,
      termsPanels,
      fullTermsPdf,
      "fullTermsPdfUrl": fullTermsPdf.asset->url,
      faqs,
      resources,
      knowledgeResources,
      travelerGuideSections,
      travelerGuideSubsections
    }`,
  )

  for (const doc of experiences) {
    const fields: string[] = []
    const expId = doc._id

    if (centralTermsReady && defined(doc.termsPanels)) {
      const panels = centralTermsPanelsForExperience(centralTerms, expId)
      if (panels.length > 0) fields.push('termsPanels')
    }
    if (centralTermsReady && defined(doc.fullTermsPdf)) {
      const pdf = resolveTermsPdfUrlForExperience(
        centralTerms,
        expId,
        doc.fullTermsPdfUrl ?? null,
      )
      if (pdf?.trim()) fields.push('fullTermsPdf')
    }
    if (centralFaqsReady && defined(doc.faqs)) {
      const faqs = centralFaqsForExperience(centralFaqs, expId)
      if (faqs.length > 0) fields.push('faqs')
    }
    if (defined(doc.resources) && defined(doc.knowledgeResources)) {
      fields.push('resources')
    }
    if (
      defined(doc.travelerGuideSections) &&
      defined(doc.travelerGuideSubsections)
    ) {
      fields.push('travelerGuideSections')
    }

    if (fields.length) {
      plans.push({
        _id: doc._id,
        _type: 'experience',
        fields,
        reason: 'Legacy Experience KC data superseded by central CK or active fields',
      })
    }
  }

  // --- lodgePage ---
  const lodgeLegacyFields = [
    'menuCtaLabel',
    'menuCtaSmartLink',
    'heroImageOverride',
    'heroCtaSmartLink',
  ] as const
  const lodgePages = await client.fetch<Array<Record<string, unknown> & { _id: string }>>(
    `*[_type == "lodgePage"]{
      _id,
      menuCtaLabel,
      menuCtaSmartLink,
      heroImageOverride,
      heroCtaSmartLink
    }`,
  )
  for (const doc of lodgePages) {
    const fields = lodgeLegacyFields.filter((f) => defined(doc[f]))
    if (fields.length) {
      plans.push({
        _id: doc._id,
        _type: 'lodgePage',
        fields,
        reason: 'Hidden legacy lodgePage fields not read by lodgePageCms',
      })
    }
  }

  // --- routesPage legacy fields (superseded by smart links / listed pages / reviewsSection / reserveCtaSettings) ---
  const routesLegacy = await client.fetch<
    Array<
      Record<string, unknown> & {
        _id: string
        heroPrimaryCta?: unknown
        heroSecondaryCta?: unknown
        heroPrimarySmartLink?: unknown
        heroSecondarySmartLink?: unknown
        experienceCards?: unknown[] | null
        experiencesFilters?: unknown[] | null
        selectedExperiences?: unknown[] | null
        fallbackToAllExperiences?: boolean | null
        reviewsSection?: {
          eyebrow?: string | null
          title?: string | null
          reviewCards?: unknown[] | null
          rotatingReviews?: unknown[] | null
        } | null
        reviewsFeaturedQuotes?: unknown[] | null
        reviewsRefs?: unknown[] | null
        reviewsEyebrow?: string | null
        reviewsHeadline?: string | null
        reviewsSectionLead?: string | null
        reviewsAverageRating?: string | null
        reviewsSourceLabel?: string | null
        reviewsSecondaryRatingLine?: string | null
        reserveCtaSettings?: {
          eyebrow?: string | null
          title?: string | null
          body?: string | null
          trustItems?: unknown[] | null
        } | null
        finalCtaEyebrow?: string | null
        finalCtaH2?: string | null
        finalCtaBody?: string | null
        finalCtaWhatsappHref?: string | null
        finalCtaWhatsappLabel?: string | null
        finalCtaSecondaryHref?: string | null
        finalCtaSecondaryLabel?: string | null
        finalCtaWhatsappSmartLink?: unknown
        finalCtaSecondarySmartLink?: unknown
        finalCtaTrustItems?: unknown[] | null
        routeCards?: Array<{ _key?: string; cta?: unknown; ctaSmartLink?: unknown; footPriceHtml?: string | null }> | null
      }
    >
  >(
    `*[_type == "routesPage"]{
      _id,
      heroPrimaryCta,
      heroSecondaryCta,
      heroPrimarySmartLink,
      heroSecondarySmartLink,
      experienceCards,
      experiencesFilters,
      selectedExperiences,
      fallbackToAllExperiences,
      reviewsSection { eyebrow, title, reviewCards, rotatingReviews },
      reviewsFeaturedQuotes,
      reviewsRefs,
      reviewsEyebrow,
      reviewsHeadline,
      reviewsSectionLead,
      reviewsAverageRating,
      reviewsSourceLabel,
      reviewsSecondaryRatingLine,
      reserveCtaSettings { eyebrow, title, body, trustItems },
      finalCtaEyebrow,
      finalCtaH2,
      finalCtaBody,
      finalCtaWhatsappHref,
      finalCtaWhatsappLabel,
      finalCtaSecondaryHref,
      finalCtaSecondaryLabel,
      finalCtaWhatsappSmartLink,
      finalCtaSecondarySmartLink,
      finalCtaTrustItems,
      routeCards[]{ _key, cta, ctaSmartLink, footPriceHtml }
    }`,
  )

  for (const doc of routesLegacy) {
    const fields: string[] = []
    if (defined(doc.experienceCards)) fields.push('experienceCards')
    if (defined(doc.experiencesFilters)) fields.push('experiencesFilters')
    if (defined(doc.selectedExperiences)) fields.push('selectedExperiences')
    if (doc.fallbackToAllExperiences != null) fields.push('fallbackToAllExperiences')
    if (doc.heroPrimarySmartLink && defined(doc.heroPrimaryCta)) fields.push('heroPrimaryCta')
    if (doc.heroSecondarySmartLink && defined(doc.heroSecondaryCta)) fields.push('heroSecondaryCta')

    const rs = doc.reviewsSection
    const hasReviewsBlock =
      Boolean(rs?.eyebrow?.trim()) ||
      Boolean(rs?.title?.trim()) ||
      Boolean(rs?.reviewCards?.length) ||
      Boolean(rs?.rotatingReviews?.length)
    if (hasReviewsBlock) {
      if (defined(doc.reviewsFeaturedQuotes)) fields.push('reviewsFeaturedQuotes')
      if (defined(doc.reviewsRefs)) fields.push('reviewsRefs')
      if (defined(doc.reviewsEyebrow)) fields.push('reviewsEyebrow')
      if (defined(doc.reviewsHeadline)) fields.push('reviewsHeadline')
      if (defined(doc.reviewsSectionLead)) fields.push('reviewsSectionLead')
      if (defined(doc.reviewsAverageRating)) fields.push('reviewsAverageRating')
      if (defined(doc.reviewsSourceLabel)) fields.push('reviewsSourceLabel')
      if (defined(doc.reviewsSecondaryRatingLine)) fields.push('reviewsSecondaryRatingLine')
    }

    const reserve = doc.reserveCtaSettings
    const hasReserveBlock =
      Boolean(reserve?.eyebrow?.trim()) ||
      Boolean(reserve?.title?.trim()) ||
      Boolean(reserve?.body?.trim()) ||
      Boolean(reserve?.trustItems?.length)
    if (hasReserveBlock || (doc.finalCtaWhatsappSmartLink && doc.finalCtaSecondarySmartLink)) {
      if (defined(doc.finalCtaEyebrow)) fields.push('finalCtaEyebrow')
      if (defined(doc.finalCtaH2)) fields.push('finalCtaH2')
      if (defined(doc.finalCtaBody)) fields.push('finalCtaBody')
      if (defined(doc.finalCtaWhatsappHref)) fields.push('finalCtaWhatsappHref')
      if (defined(doc.finalCtaWhatsappLabel)) fields.push('finalCtaWhatsappLabel')
      if (defined(doc.finalCtaSecondaryHref)) fields.push('finalCtaSecondaryHref')
      if (defined(doc.finalCtaSecondaryLabel)) fields.push('finalCtaSecondaryLabel')
    }
    if (hasReserveBlock && defined(doc.finalCtaTrustItems)) {
      fields.push('finalCtaTrustItems')
    }

    for (const card of doc.routeCards ?? []) {
      if (!card._key) continue
      if (defined(card.cta) && defined(card.ctaSmartLink)) {
        fields.push(`routeCards[_key=="${card._key}"].cta`)
      }
      if (card.footPriceHtml?.trim()) {
        fields.push(`routeCards[_key=="${card._key}"].footPriceHtml`)
      }
    }

    if (fields.length) {
      plans.push({
        _id: doc._id,
        _type: 'routesPage',
        fields: [...new Set(fields)],
        reason: 'Legacy routesPage fields superseded by smart links, listed pages, reviewsSection, reserveCtaSettings',
      })
    }
  }

  // --- learningProgramme drafts: broken in-progress gallery uploads ---
  const lpDrafts = await client.fetch<
    Array<{
      _id: string
      fieldBaseRef?: unknown
      lodgePresentationRows?: unknown[] | null
      gallery?: Array<{ _key?: string; image?: { _upload?: unknown; asset?: unknown } | null }> | null
    }>
  >(
    `*[_type == "learningProgramme" && _id match "drafts.*"]{
      _id,
      fieldBaseRef,
      lodgePresentationRows,
      gallery[]{ _key, image { asset, _upload } }
    }`,
  )
  for (const doc of lpDrafts) {
    const brokenKeys = (doc.gallery ?? [])
      .filter((g) => g?._key && g.image?._upload && !g.image?.asset)
      .map((g) => g._key!)
    for (const key of brokenKeys) {
      plans.push({
        _id: doc._id,
        _type: 'learningProgramme',
        fields: [`gallery[_key=="${key}"]`],
        reason: 'Remove broken in-progress gallery upload (_upload without asset)',
      })
    }
    const lp = doc
    if (Array.isArray(lp.lodgePresentationRows) && lp.lodgePresentationRows.length > 0 && defined(lp.fieldBaseRef)) {
      plans.push({
        _id: doc._id,
        _type: 'learningProgramme',
        fields: ['fieldBaseRef'],
        reason: 'Legacy fieldBaseRef superseded by lodgePresentationRows',
      })
    }
  }

  const publishedLps = await client.fetch<
    Array<{ _id: string; fieldBaseRef?: unknown; lodgePresentationRows?: unknown[] | null }>
  >(
    `*[_type == "learningProgramme" && !(_id match "drafts.*")]{
      _id,
      fieldBaseRef,
      lodgePresentationRows
    }`,
  )
  for (const doc of publishedLps) {
    if (Array.isArray(doc.lodgePresentationRows) && doc.lodgePresentationRows.length > 0 && defined(doc.fieldBaseRef)) {
      plans.push({
        _id: doc._id,
        _type: 'learningProgramme',
        fields: ['fieldBaseRef'],
        reason: 'Legacy fieldBaseRef superseded by lodgePresentationRows',
      })
    }
  }

  // --- Apply ---
  // eslint-disable-next-line no-console
  console.log(`\n=== Patch plan (${plans.length} operations) ===\n`)
  if (!hasHeader || !hasFooter) {
    // eslint-disable-next-line no-console
    console.warn(
      'WARN: headerSettings or footerSettings missing — siteSettings legacy fields will NOT be unset.',
    )
  }

  const byType = new Map<string, number>()
  const fieldTotals = new Map<string, number>()
  for (const p of plans) {
    byType.set(p._type, (byType.get(p._type) ?? 0) + 1)
    for (const f of p.fields) {
      fieldTotals.set(f, (fieldTotals.get(f) ?? 0) + 1)
    }
    // eslint-disable-next-line no-console
    console.log(`${COMMIT ? 'PATCH' : 'DRY'} ${p._type} ${p._id}`)
    // eslint-disable-next-line no-console
    console.log(`  unset: ${p.fields.join(', ')}`)
    // eslint-disable-next-line no-console
    console.log(`  reason: ${p.reason}\n`)
  }

  if (COMMIT) {
    for (const p of plans) {
      await client.patch(p._id).unset(p.fields).commit()
    }
    // eslint-disable-next-line no-console
    console.log(`Committed ${plans.length} patch(es).`)
    await new Promise((r) => setTimeout(r, 3000))
    const statsAfter = await fetchFieldCount(projectId, dataset)
    // eslint-disable-next-line no-console
    console.log(
      statsAfter != null ? `After: ${statsAfter} attributes` : 'After: (stats API unavailable)',
    )
    if (statsBefore != null && statsAfter != null) {
      // eslint-disable-next-line no-console
      console.log(`Delta: ${statsAfter - statsBefore}`)
    }
  } else {
    // eslint-disable-next-line no-console
    console.log('Dry-run only. Re-run with --commit to apply.')
  }

  // eslint-disable-next-line no-console
  console.log('\n=== Summary by document type ===')
  for (const [t, n] of [...byType.entries()].sort()) {
    // eslint-disable-next-line no-console
    console.log(`  ${t}: ${n} patch(es)`)
  }
  // eslint-disable-next-line no-console
  console.log('\n=== Top-level field paths touched ===')
  for (const [f, n] of [...fieldTotals.entries()].sort((a, b) => b[1] - a[1])) {
    // eslint-disable-next-line no-console
    console.log(`  ${f}: ${n}`)
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})
