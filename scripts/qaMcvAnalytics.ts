/**
 * Manu Conservation Volunteer analytics QA harness (local / gtag mock).
 *
 * Run: NEXT_PUBLIC_GA_MEASUREMENT_ID=G-QA-TEST npx tsx scripts/qaMcvAnalytics.ts
 */

process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || 'G-QA-TEST'

type GtagCall = unknown[]

const events: GtagCall[] = []
const PII_PARAM_KEYS =
  /^(fullName|firstName|name|email|phone|fullPhone|phoneCountryCode|message|leadId|lead_id|preferredDates|raw|raw_payload)$/i

const results: { id: string; pass: boolean; detail: string }[] = []

function check(id: string, pass: boolean, detail: string) {
  results.push({ id, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${id}: ${detail}`)
}

function eventsNamed(name: string): Record<string, unknown>[] {
  return events
    .filter((args) => args[0] === 'event' && args[1] === name)
    .map((args) =>
      typeof args[2] === 'object' && args[2] !== null ? (args[2] as Record<string, unknown>) : {},
    )
}

function assertNoPiiInEvents(scope: string) {
  const bad: string[] = []
  for (const args of events) {
    if (args[0] !== 'event') continue
    const params = args[2]
    if (!params || typeof params !== 'object') continue
    for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
      if (PII_PARAM_KEYS.test(key)) bad.push(`${String(args[1])}.${key}`)
      if (typeof value === 'string') {
        const lower = value.toLowerCase()
        if (lower.includes('@') && lower.includes('.')) bad.push(`${String(args[1])} email-like value`)
        if (/^ECO-/i.test(value)) bad.push(`${String(args[1])} lead-id-like value`)
      }
    }
  }
  check(`pii:${scope}`, bad.length === 0, bad.length === 0 ? 'no PII keys/values' : bad.join('; '))
}

async function main() {
  ;(globalThis as unknown as { window: unknown }).window = {
    location: {
      href: 'http://localhost:3000/manu-conservation-volunteer?utm_source=google&utm_medium=cpc&utm_campaign=mcv&gclid=TESTGCLID',
      pathname: '/manu-conservation-volunteer',
      search: '?utm_source=google&utm_medium=cpc&utm_campaign=mcv&gclid=TESTGCLID',
    },
    dataLayer: [] as unknown[],
    gtag: (...args: unknown[]) => {
      events.push(args)
    },
  }

  const {
    trackMcvCtaClick,
    trackMcvModalOpen,
    trackMcvFormStart,
    trackMcvFormFieldSelect,
    trackMcvFormValidationError,
    trackMcvSubmitAttempt,
    trackMcvSubmitError,
    trackMcvLeadSuccess,
    trackMcvResultView,
    trackMcvFixedDepartureSelect,
    trackMcvWetravelClick,
    trackMcvOtherDatesSelect,
    trackMcvOtherDatesSubmit,
    resetMcvLeadConversionGuard,
    beginMcvModalSession,
  } = await import('../lib/trackMcvAnalytics')

  events.length = 0
  trackMcvCtaClick({ cta_label: 'Join the Manu Field Crew', cta_location: 'hero' })
  check('A.no_lead_on_cta', eventsNamed('generate_lead').length === 0, 'no generate_lead on CTA')

  events.length = 0
  resetMcvLeadConversionGuard()
  trackMcvModalOpen('hero')
  trackMcvFormStart({ opened_from: 'hero' })
  trackMcvFormFieldSelect({ field_name: 'travel_timing', field_value: 'November 2026' })
  trackMcvFormFieldSelect({ field_name: 'group_size', field_value: '2' })
  trackMcvSubmitAttempt({
    travel_timing: 'November 2026',
    group_size: '2',
    opened_from: 'hero',
  })
  trackMcvLeadSuccess({
    travel_timing: 'November 2026',
    group_size: '2',
    opened_from: 'hero',
  })

  check('C.one_modal_open', eventsNamed('mcv_modal_open').length === 1, 'modal_open=1')
  check('D.one_form_start', eventsNamed('mcv_form_start').length === 1, 'form_start=1')
  check(
    'E.success_sequence',
    eventsNamed('mcv_submit_attempt').length === 1 &&
      eventsNamed('enquiry_submit').length === 1 &&
      eventsNamed('generate_lead').length === 1,
    `submit=${eventsNamed('mcv_submit_attempt').length} enquiry=${eventsNamed('enquiry_submit').length} lead=${eventsNamed('generate_lead').length}`,
  )

  const lead = eventsNamed('generate_lead')[0]
  check(
    'E.lead_params',
    lead?.lead_type === 'Campaign' &&
      lead?.campaign_name === 'Volunteer Q4 2026' &&
      lead?.flow_type === 'manu_conservation_volunteer' &&
      lead?.utm_source === 'google' &&
      lead?.gclid === 'TESTGCLID',
    `lead_type=${String(lead?.lead_type)} utm=${String(lead?.utm_source)}`,
  )

  trackMcvLeadSuccess({
    travel_timing: 'November 2026',
    group_size: '2',
    opened_from: 'hero',
  })
  check(
    'E.single_generate_lead',
    eventsNamed('generate_lead').length === 1,
    `generate_lead=${eventsNamed('generate_lead').length}`,
  )

  ;(window as unknown as { location: { pathname: string; href: string; search: string } }).location =
    {
      href: 'http://localhost:3000/manu-conservation-volunteer/result',
      pathname: '/manu-conservation-volunteer/result',
      search: '',
    }
  trackMcvResultView({ travel_timing: 'November 2026', group_size: '2' })
  check('F.result_view', eventsNamed('mcv_result_view').length === 1, 'result_view=1')

  events.length = 0
  beginMcvModalSession('hero')
  trackMcvFixedDepartureSelect({
    departure_key: 'dep-02',
    departure_dates: '2 Nov – 4 Dec 2026',
  })
  trackMcvWetravelClick({
    departure_key: 'dep-02',
    departure_dates: '2 Nov – 4 Dec 2026',
  })
  check('H.fixed_departure_select', eventsNamed('mcv_fixed_departure_select').length === 1, 'fixed select=1')
  check(
    'I.wetravel_click',
    eventsNamed('mcv_wetravel_click').length === 1 &&
      eventsNamed('mcv_wetravel_click')[0]?.booking_provider === 'wetravel',
    'wetravel=1',
  )

  events.length = 0
  beginMcvModalSession('hero')
  trackMcvOtherDatesSelect()
  trackMcvOtherDatesSubmit()
  check(
    'J.other_dates',
    eventsNamed('mcv_other_dates_select').length === 1 &&
      eventsNamed('mcv_other_dates_submit').length === 1,
    'other dates select+submit',
  )

  events.length = 0
  beginMcvModalSession('hero')
  trackMcvFormValidationError({
    field_name: 'travel_timing,group_size',
    error_type: 'missing_required',
  })
  trackMcvSubmitError({ error_type: 'api_error' })
  check('validation_error', eventsNamed('mcv_form_validation_error').length === 1, 'validation=1')
  check('submit_error', eventsNamed('mcv_submit_error').length === 1, 'submit_error=1')

  assertNoPiiInEvents('all')

  const failed = results.filter((r) => !r.pass)
  if (failed.length > 0) {
    console.error(`\n${failed.length} check(s) failed`)
    process.exit(1)
  }
  console.log(`\nqaMcvAnalytics: all ${results.length} checks passed`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
