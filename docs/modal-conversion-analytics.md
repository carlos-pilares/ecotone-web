# Modal URL & conversion analytics

Internal developer reference for the URL-synchronised booking modals and canonical conversion tracking.

## Modal URL architecture (stable — do not change)

Query params are synced via the History API (`pushState` / `popstate`). The user never leaves the current page.

### Plan journey (`PlanJourneyModal`)

| State | URL |
|-------|-----|
| Open (step 1) | `?modal=plan&step=travellers` |
| Step 2 | `?modal=plan&step=details` |
| Step 3 (no channel) | `?modal=plan&step=contact` |
| Email selected | `?modal=plan&step=contact&channel=email` |
| WhatsApp selected | `?modal=plan&step=contact&channel=whatsapp` |
| Email success (home) | `?modal=thank-you&intent=plan&channel=email` |
| Email success (lodge) | `?modal=thank-you&channel=email` |

### Experience booking (`BookExperienceModal`)

| State | URL |
|-------|-----|
| Open | `?modal=book` |
| Email selected | `?modal=book&channel=email` |
| WhatsApp selected | `?modal=book&channel=whatsapp` |
| Email success | `?modal=thank-you&channel=email` |

URL builders live in `lib/bookingModalUrl.ts`. All History API sync is owned by `BookingModalContext` — CTAs must not manipulate query params directly.

## Modal lifecycle

1. **Open** — CTA calls `openPlanJourney(source)` or `openExperienceBooking(summary, source)` from `useBookingModal()`.
2. **Steps (plan only)** — `onPlanStepAdvance` pushes `step=` URLs; UI Back uses `history.back()`.
3. **Channel** — selecting Email/WhatsApp pushes `channel=`; Back clears channel before previous step.
4. **Email success** — modal calls `onEmailThankYou()` → context sets thank-you phase, pushes thank-you URL, fires `trackEmailConversionSuccess()`.
5. **Close** — `close()` runs `history.go(-n)` to restore the pre-modal URL.
6. **Browser Back/Forward** — `popstate` → `syncStateFromUrl()` updates modal phase/step/channel.

### Thank-you protection

The thank-you URL is **not** a deep-linkable landing page. If `?modal=thank-you` appears without a successful email submit in the current session (`thankYouEligibleRef`), the context:

- strips modal query params via `history.replaceState`
- keeps the modal closed

Thank-you is only valid immediately after `trackEmailConversionSuccess` runs in the same session.

## Analytics lifecycle

### Pre-conversion (unchanged events)

| Event | When | Helper |
|-------|------|--------|
| `book_now_click` | Book-intent CTA click | `trackBookNowClick()` |
| `booking_modal_open` | Modal opens (form phase) | `trackBookingModalOpen()` |
| `whatsapp_click` | WhatsApp link click | `trackWhatsappClick()` |

### Canonical conversion (email success only)

**Single entry point:** `trackEmailConversionSuccess()` in `lib/conversionAnalytics.ts`.

Fires exactly once per successful email submission:

1. Virtual `page_view` (current History API URL)
2. `enquiry_submit`
3. `generate_lead`

Do not fire these events anywhere else.

### Standard conversion payload

Built by `buildStandardConversionPayload()`:

| Field | Description |
|-------|-------------|
| `conversion_intent` | `plan_journey` \| `book_experience` |
| `channel` | `email` (success path) |
| `cta_id` | Stable CTA identifier (from `lib/ctaIds.ts`) |
| `source` | Placement label; defaults to `button_location` |
| `page_path` | `pathname + search` |
| `page_url` | Full current URL |
| `experience_slug` | When on an experience page or from booking summary |
| `programme_type` | From experience summary when available |
| `lodge_slug` | When on a lodge page |

`generate_lead` also includes `lead_type` (= `conversion_intent`) for GA4 backwards compatibility.

## CTA identifiers (`lib/ctaIds.ts`)

Never derive IDs from button labels. Use constants:

- `header_book_now`, `header_tailor_program`, `header_tailor_book`
- `home_design_program`, `lodge_design_program`, `experience_tailor_program`
- `experience_hero_book`, `experience_sticky_book`, `experience_reserve_book`
- `experience_reserve_whatsapp`, `footer_whatsapp`, `floating_whatsapp`
- `booking_modal_whatsapp`

Add new IDs to `CTA_IDS` before wiring a new CTA.

## Integrating a new lead CTA

1. Import `useBookingModal` and `CTA_IDS`.
2. Call `openPlanJourney()` or `openExperienceBooking()` with a `BookNowOpenSource`:

```typescript
openPlanJourney({
  cta_id: CTA_IDS.HOME_DESIGN_PROGRAM,
  button_location: 'reserve_section',
})

openExperienceBooking(summary, {
  cta_id: CTA_IDS.EXPERIENCE_HERO_BOOK,
  button_location: 'hero',
  price: summary.priceLine,
})
```

3. Do **not** touch URL query params or conversion events in the CTA component.
4. Optionally fire `trackBookNowClick()` on click if the CTA is a link that does not open the modal directly (see `ReserveCtaSection`).

For tailor/reserve bands, pass `ctaId` into `TailorMadeBand` / `SmartLinkCtaAction` / `ReserveCtaCta`.

## Key files

| File | Role |
|------|------|
| `lib/bookingModalUrl.ts` | URL parse/build |
| `lib/conversionAnalytics.ts` | Canonical conversion helper + payload |
| `lib/ctaIds.ts` | Stable CTA identifiers |
| `lib/trackBookNowClick.ts` | Pre-conversion book events + `BookNowOpenSource` type |
| `components/booking/BookingModalContext.tsx` | Modal state, History API, thank-you guard |

## Ad platform notes

- Email success URLs always include `modal=thank-you` and `channel=email`.
- Prefer importing GA4 `generate_lead` for Google Ads; URL-contains rules depend on tag configuration for History API updates.
- Payload fields are platform-agnostic for future Meta/LinkedIn GTM mappings.
