/**
 * Wonder Beyond the Wonder analytics QA harness (local / gtag mock).
 *
 * Run: NEXT_PUBLIC_GA_MEASUREMENT_ID=G-QA-TEST npx tsx scripts/qaWbtwAnalytics.ts
 */

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'

process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || 'G-QA-TEST'

type GtagCall = unknown[]

const events: GtagCall[] = []
const PII_PARAM_KEYS =
  /^(fullnameName|name|email|phone|fullPhone|phoneCountryCode|message|emailMessage|raw|raw_payload|whatsapp_message|whatsappMessage|payload)$/i

const results: { id: string; pass: boolean; detail: string }[] = []

function check(id: string, pass: boolean, detail: string) {
  results.push({ id, pass, detail })
  const mark = pass ? 'PASS' : 'FAIL'
  console.log(`${mark}  ${id}: ${detail}`)
}

function eventNames(): string[] {
  return events
    .filter((args) => args[0] === 'event' && typeof args[1] === 'string')
    .map((args) => String(args[1]))
}

function eventsNamed(name: string): Record<string, unknown>[] {
  return events
    .filter((args) => args[0] === 'event' && args[1] === name)
    .map((args) => (typeof args[2] === 'object' && args[2] !== null ? (args[2] as Record<string, unknown>) : {}))
}

function assertNoPiiInEvents(scope: string) {
  const bad: string[] = []
  for (const args of events) {
    if (args[0] !== 'event') continue
    const params = args[2]
    if (!params || typeof params !== 'object') continue
    for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
      if (PII_PARAM_KEYS.test(key)) {
        bad.push(`${String(args[1])}.${key}`)
      }
      if (typeof value === 'string') {
        const lower = value.toLowerCase()
        if (lower.includes('@') && lower.includes('.')) bad.push(`${String(args[1])} value looks like email`)
        if (/\+\d{1,3}\s?\d{6,}/.test(value)) bad.push(`${String(args[1])} value looks like phone`)
        if (value.includes('Hello Ecotone')) bad.push(`${String(args[1])} WhatsApp message text`)
        if (value.includes('"kind":') || value.includes('fullName')) {
          bad.push(`${String(args[1])} looks like raw payload`)
        }
      }
    }
  }
  check(`pii:${scope}`, bad.length === 0, bad.length === 0 ? 'no PII keys/values in gtag params' : bad.join('; '))
}

async function main() {
  ;(globalThis as unknown as { window: unknown }).window = {
    location: {
      href: 'http://localhost:3000/wonder-beyond-the-wonder?utm_source=google&utm_medium=cpc&utm_campaign=wbtw&gclid=TESTGCLID',
      pathname: '/wonder-beyond-the-wonder',
      search: '?utm_source=google&utm_medium=cpc&utm_campaign=wbtw&gclid=TESTGCLID',
    },
    dataLayer: [] as unknown[],
    gtag: (...args: unknown[]) => {
      events.push(args)
      ;(window as unknown as { dataLayer: unknown[] }).dataLayer.push(args)
    },
    __ecotoneSuppressModalPageViews: 0,
    __ecotoneAllowRoutePageView: false,
  }
  ;(globalThis as unknown as { document: unknown }).document = {
    title: 'Wonder Beyond the Wonder | Ecotone',
  }

  const {
    trackWbtwCtaClick,
    trackWbtwModalOpen,
    trackWbtwModalClose,
    trackWbtwFormStart,
    trackWbtwFormFieldSelect,
    trackWbtwFormValidationError,
    trackWbtwSubmitAttempt,
    trackWbtwLeadSuccess,
    trackWbtwWhatsappOpen,
    trackWbtwThankYouView,
    resetWbtwLeadConversionGuard,
    beginWbtwModalSession,
    clearWbtwModalSession,
  } = await import('../lib/trackWonderBeyondAnalytics')

  const { trackRoutePageView } = await import('../lib/gaPageView')
  const {
    trackEmailConversionSuccess,
    resetEmailConversionGuard,
  } = await import('../lib/conversionAnalytics')

  // --- 1 & 2: page_view only from route helper; modal open/close do not emit page_view ---
  events.length = 0
  trackRoutePageView('/wonder-beyond-the-wonder')
  const pageViewsAfterLoad = eventsNamed('page_view')
  check(
    '1.page_view_once',
    pageViewsAfterLoad.length === 1,
    `page_view count=${pageViewsAfterLoad.length}`,
  )

  events.length = 0
  trackWbtwCtaClick({ cta_label: 'Check my travel fit', cta_location: 'hero' })
  trackWbtwModalOpen('hero')
  trackWbtwModalClose({ close_method: 'close_button', opened_from: 'hero', form_started: false })
  const pageViewsAfterModal = eventsNamed('page_view')
  check(
    '2.modal_no_page_view',
    pageViewsAfterModal.length === 0,
    `page_view during modal open/close=${pageViewsAfterModal.length}; events=${eventNames().join(',')}`,
  )

  // --- 3: CTA locations ---
  const locations = [
    'header',
    'hero',
    'how_it_works',
    'experience_section',
    'benefit_section',
    'final_cta',
  ] as const
  events.length = 0
  for (const loc of locations) {
    trackWbtwCtaClick({ cta_label: 'Check my travel fit', cta_location: loc })
  }
  const ctaEvents = eventsNamed('wbtw_cta_click')
  const ctaLocations = ctaEvents.map((e) => e.cta_location)
  check(
    '3.cta_locations',
    ctaEvents.length === 6 && locations.every((l, i) => ctaLocations[i] === l),
    `locations=${ctaLocations.join(',')}`,
  )

  // Source wiring audit
  const pageSrc = readFileSync(
    path.join(process.cwd(), 'app/wonder-beyond-the-wonder/WonderPageContent.tsx'),
    'utf8',
  )
  const wired = locations.every((l) => pageSrc.includes(`ctaLocation="${l}"`))
  check('3.cta_source_wiring', wired, 'all ctaLocation props present in WonderPageContent')

  // --- 4: modal open ---
  events.length = 0
  trackWbtwModalOpen('hero')
  check(
    '4.modal_open',
    eventsNamed('wbtw_modal_open').length === 1 &&
      eventsNamed('wbtw_modal_open')[0]?.opened_from === 'hero' &&
      eventsNamed('page_view').length === 0,
    `opened_from=${String(eventsNamed('wbtw_modal_open')[0]?.opened_from)}`,
  )

  // --- 5: form_start once (simulate session refs via single calls as modal would) ---
  events.length = 0
  trackWbtwFormStart({ first_field: 'fullName', opened_from: 'hero' })
  // Modal guards with formStartTrackedRef — helper itself is not once-only;
  // verify modal source has the once-per-session guard.
  const modalSrc = readFileSync(
    path.join(process.cwd(), 'app/wonder-beyond-the-wonder/WonderTravelFitModal.tsx'),
    'utf8',
  )
  const hasOnceGuard =
    modalSrc.includes('formStartTrackedRef') &&
    modalSrc.includes('if (formStartTrackedRef.current) return')
  check('5.form_start_once_guard', hasOnceGuard, 'modal formStartTrackedRef guard present')
  check('5.form_start_fires', eventsNamed('wbtw_form_start').length === 1, 'form_start fired')

  // --- 6: field select, no PII ---
  events.length = 0
  trackWbtwFormFieldSelect({ field_name: 'travelTiming', field_value: 'September–October 2026' })
  trackWbtwFormFieldSelect({ field_name: 'groupSize', field_value: '2' })
  trackWbtwFormFieldSelect({ field_name: 'interest', field_value: 'Wildlife & photography' })
  trackWbtwFormFieldSelect({ field_name: 'interest', field_value: '' }) // should no-op
  const fieldEvents = eventsNamed('wbtw_form_field_select')
  check(
    '6.field_select',
    fieldEvents.length === 3 &&
      fieldEvents.every((e) => ['travelTiming', 'groupSize', 'interest'].includes(String(e.field_name))),
    `count=${fieldEvents.length} names=${fieldEvents.map((e) => e.field_name).join(',')}`,
  )
  assertNoPiiInEvents('field_select')

  // --- 7: validation error ---
  events.length = 0
  trackWbtwFormValidationError({
    submission_channel: 'form',
    missing_fields: 'fullName,email,travelTiming',
    invalid_fields: 'phone',
  })
  const ve = eventsNamed('wbtw_form_validation_error')[0]
  check(
    '7.validation_error',
    !!ve &&
      ve.submission_channel === 'form' &&
      ve.missing_fields === 'fullName,email,travelTiming' &&
      ve.invalid_fields === 'phone' &&
      !('fullName' in ve && typeof ve.fullName === 'string' && String(ve.fullName).includes('@')),
    `missing=${String(ve?.missing_fields)} invalid=${String(ve?.invalid_fields)}`,
  )

  // --- 8: successful form submit sequence ---
  events.length = 0
  resetWbtwLeadConversionGuard()
  trackWbtwSubmitAttempt({
    submission_channel: 'form',
    travel_timing: 'September–October 2026',
    group_size: '2',
    interest: 'Wildlife & photography',
  })
  trackWbtwLeadSuccess({
    submission_channel: 'form',
    travel_timing: 'September–October 2026',
    group_size: '2',
    interest: 'Wildlife & photography',
  })
  trackWbtwThankYouView('form')
  const formSeq = eventNames()
  check(
    '8.form_success_sequence',
    formSeq.includes('wbtw_submit_attempt') &&
      formSeq.includes('enquiry_submit') &&
      formSeq.includes('generate_lead') &&
      formSeq.includes('wbtw_thank_you_view') &&
      !formSeq.includes('wbtw_whatsapp_open'),
    formSeq.join(' → '),
  )
  assertNoPiiInEvents('form_success')

  // --- 9: WhatsApp success sequence ---
  events.length = 0
  resetWbtwLeadConversionGuard()
  trackWbtwSubmitAttempt({
    submission_channel: 'whatsapp',
    travel_timing: 'Early 2027',
    group_size: '3–4',
    interest: 'Nature adventure',
  })
  trackWbtwLeadSuccess({
    submission_channel: 'whatsapp',
    travel_timing: 'Early 2027',
    group_size: '3–4',
    interest: 'Nature adventure',
  })
  trackWbtwWhatsappOpen()
  trackWbtwThankYouView('whatsapp')
  const waSeq = eventNames()
  check(
    '9.whatsapp_success_sequence',
    waSeq.includes('wbtw_submit_attempt') &&
      waSeq.includes('enquiry_submit') &&
      waSeq.includes('generate_lead') &&
      waSeq.includes('wbtw_whatsapp_open') &&
      waSeq.includes('wbtw_thank_you_view'),
    waSeq.join(' → '),
  )

  // Modal order audit: generate_lead before whatsapp_open / thank_you
  const leadIdx = modalSrc.indexOf('trackWbtwLeadSuccess')
  const waOpenIdx = modalSrc.indexOf('trackWbtwWhatsappOpen()')
  const thanksWaIdx = modalSrc.lastIndexOf("trackWbtwThankYouView('whatsapp')")
  check(
    '9.modal_order_source',
    leadIdx > 0 && waOpenIdx > leadIdx && thanksWaIdx > waOpenIdx,
    'source order: lead → whatsapp_open → thank_you',
  )

  // --- 10: single generate_lead ---
  events.length = 0
  resetWbtwLeadConversionGuard()
  trackWbtwLeadSuccess({
    submission_channel: 'form',
    travel_timing: 'Early 2027',
    group_size: '2',
    interest: '',
  })
  trackWbtwLeadSuccess({
    submission_channel: 'form',
    travel_timing: 'Early 2027',
    group_size: '2',
    interest: '',
  })
  check(
    '10.generate_lead_once',
    eventsNamed('generate_lead').length === 1 && eventsNamed('enquiry_submit').length === 1,
    `generate_lead=${eventsNamed('generate_lead').length} enquiry_submit=${eventsNamed('enquiry_submit').length}`,
  )

  // --- 11: global PII scan across a mixed session ---
  events.length = 0
  resetWbtwLeadConversionGuard()
  trackWbtwCtaClick({ cta_label: 'Check my travel fit', cta_location: 'final_cta' })
  trackWbtwModalOpen('final_cta')
  trackWbtwFormStart({ first_field: 'email', opened_from: 'final_cta' })
  trackWbtwFormFieldSelect({ field_name: 'travelTiming', field_value: 'July–August 2026' })
  trackWbtwSubmitAttempt({
    submission_channel: 'form',
    travel_timing: 'July–August 2026',
    group_size: '1',
    interest: 'Family experience',
  })
  trackWbtwLeadSuccess({
    submission_channel: 'form',
    travel_timing: 'July–August 2026',
    group_size: '1',
    interest: 'Family experience',
  })
  trackWbtwThankYouView('form')
  assertNoPiiInEvents('full_session')

  // Campaign params present on conversion
  const leadParams = eventsNamed('generate_lead')[0]
  check(
    '11.campaign_params',
    leadParams?.page_path === '/wonder-beyond-the-wonder' &&
      leadParams?.campaign_page === 'wonder_beyond_the_wonder' &&
      leadParams?.flow_type === 'wonder_beyond_the_wonder' &&
      leadParams?.utm_source === 'google' &&
      leadParams?.lead_type === 'wonder_beyond_the_wonder',
    JSON.stringify(leadParams),
  )

  // --- origin_cta_location session attribution ---
  clearWbtwModalSession()
  events.length = 0
  trackWbtwCtaClick({ cta_label: 'Check my travel fit', cta_location: 'hero' })
  check(
    'origin.cta_click_no_origin',
    eventsNamed('wbtw_cta_click')[0]?.origin_cta_location === undefined,
    'cta_click must not include origin_cta_location before session',
  )

  events.length = 0
  trackWbtwModalOpen('hero')
  trackWbtwFormStart({ first_field: 'fullName', opened_from: 'hero' })
  trackWbtwFormFieldSelect({ field_name: 'groupSize', field_value: '2' })
  trackWbtwSubmitAttempt({
    submission_channel: 'form',
    travel_timing: 'Early 2027',
    group_size: '2',
    interest: 'Nature adventure',
  })
  trackWbtwLeadSuccess({
    submission_channel: 'form',
    travel_timing: 'Early 2027',
    group_size: '2',
    interest: 'Nature adventure',
  })
  trackWbtwThankYouView('form')
  trackWbtwModalClose({
    close_method: 'thank_you_close',
    opened_from: 'hero',
    form_started: true,
  })
  const originFunnel = [
    'wbtw_modal_open',
    'wbtw_form_start',
    'wbtw_form_field_select',
    'wbtw_submit_attempt',
    'enquiry_submit',
    'generate_lead',
    'wbtw_thank_you_view',
    'wbtw_modal_close',
  ]
  const originOk = originFunnel.every((name) => eventsNamed(name)[0]?.origin_cta_location === 'hero')
  check('origin.session_hero', originOk, 'all funnel events carry origin_cta_location=hero')

  events.length = 0
  trackWbtwModalOpen('benefit_section')
  trackWbtwLeadSuccess({
    submission_channel: 'whatsapp',
    travel_timing: 'Early 2027',
    group_size: '1',
    interest: '',
  })
  check(
    'origin.session_reset',
    eventsNamed('generate_lead')[0]?.origin_cta_location === 'benefit_section',
    `origin=${String(eventsNamed('generate_lead')[0]?.origin_cta_location)}`,
  )
  check(
    'origin.reject_invalid',
    beginWbtwModalSession('' as never) === false &&
      beginWbtwModalSession('not_a_place' as never) === false,
    'invalid CTA locations rejected',
  )

  // --- 12: Plan Journey / Book Experience helpers still fire generate_lead ---
  events.length = 0
  resetEmailConversionGuard()
  trackEmailConversionSuccess({ conversion_intent: 'plan_journey', channel: 'email' })
  check(
    '12.plan_journey_generate_lead',
    eventsNamed('generate_lead').length === 1 &&
      eventsNamed('enquiry_submit').length === 1 &&
      eventsNamed('generate_lead')[0]?.lead_type === 'plan_journey',
    `lead_type=${String(eventsNamed('generate_lead')[0]?.lead_type)}`,
  )

  events.length = 0
  resetEmailConversionGuard()
  trackEmailConversionSuccess({ conversion_intent: 'book_experience', channel: 'email' })
  check(
    '12.book_experience_generate_lead',
    eventsNamed('generate_lead').length === 1 &&
      eventsNamed('generate_lead')[0]?.lead_type === 'book_experience',
    `lead_type=${String(eventsNamed('generate_lead')[0]?.lead_type)}`,
  )

  const bookingCtx = readFileSync(
    path.join(process.cwd(), 'components/booking/BookingModalContext.tsx'),
    'utf8',
  )
  check(
    '12.booking_context_wiring',
    bookingCtx.includes('trackEmailConversionSuccess') &&
      bookingCtx.includes('trackBookNowClick') &&
      bookingCtx.includes('trackBookingModalOpen'),
    'BookingModalContext still wires existing conversion helpers',
  )

  // WBTW does not use History API (no fake page_view risk)
  const wbtwDirFiles = ['WonderTravelFitModal.tsx', 'WonderCampaignContext.tsx', 'WonderPageContent.tsx']
  const historyUse = wbtwDirFiles.some((f) => {
    const src = readFileSync(path.join(process.cwd(), 'app/wonder-beyond-the-wonder', f), 'utf8')
    return /pushState|replaceState|history\./.test(src)
  })
  check('2.no_history_api', !historyUse, 'WBTW modal/page do not mutate History API')

  const failed = results.filter((r) => !r.pass)
  console.log('\n── Summary ──')
  console.log(`Passed: ${results.filter((r) => r.pass).length}/${results.length}`)
  if (failed.length) {
    console.log('Failed:')
    for (const f of failed) console.log(`  - ${f.id}: ${f.detail}`)
    process.exit(1)
  }
  console.log('All analytics QA checks passed.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
