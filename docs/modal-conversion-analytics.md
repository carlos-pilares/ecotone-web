# Modal URL & conversion analytics

Production reference for URL-synchronised booking modals and GA4/Google Ads conversion tracking.

**Principle:** The modal is not a page. Query-param History API updates sync UX and browser history only. Analytics treats real navigations (pathname changes) and conversion events separately.

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

## Final event map

| User action | URL change | GA4 events |
|-------------|------------|------------|
| Land on a page (e.g. `/`, `/experiences/[slug]`) | Pathname set | **`page_view`** (once per pathname) |
| Click book-intent CTA | — | **`book_now_click`** |
| Modal opens (form phase) | `?modal=plan…` or `?modal=book` | **`booking_modal_open`** (once per session) |
| Advance plan step | `?step=…` | — |
| Select email / WhatsApp channel | `?channel=…` | — |
| Click WhatsApp link | — | **`whatsapp_click`** only |
| Successful email submit | `?modal=thank-you&channel=email` | **`enquiry_submit`** + **`generate_lead`** (once each) |
| Thank-you visible | (same URL) | — |
| Browser Back / Forward through modal | Step/channel/thank-you restored | — |
| Close modal | Params stripped via history | — |
| Navigate to another route | Pathname changes | **`page_view`** (new pathname only) |

Query-only changes (`?modal=`, `?step=`, `?channel=`, `?modal=thank-you`) never fire `page_view`.

### Pre-conversion helpers

| Event | When | Helper |
|-------|------|--------|
| `book_now_click` | Book-intent CTA click | `trackBookNowClick()` |
| `booking_modal_open` | Modal opens (form phase, once) | `trackBookingModalOpen()` |
| `whatsapp_click` | WhatsApp link click | `trackWhatsappClick()` |

### Conversion (email success only)

**Single entry point:** `trackEmailConversionSuccess()` in `lib/conversionAnalytics.ts`.

Fires exactly once per successful email submission:

1. `enquiry_submit`
2. `generate_lead`

Guarded by `emailConversionFired`; reset via `resetEmailConversionGuard()` on modal open, close, and pathname change.

Does **not** fire `page_view`. WhatsApp does **not** fire conversion events.

## Page views (real routes only)

| Mechanism | Role |
|-----------|------|
| `GoogleAnalytics` | One Google tag (gtag.js) with `gtag('config', id, { send_page_view: false })` for GA4 **and** Google Ads — disables auto page_view on both destinations |
| `GaRoutePageView` | Fires one `page_view` per Next.js **pathname** change only (not `useSearchParams`) |
| `lib/gaPageView.ts` | dataLayer guard + session/per-operation suppression around modal history |
| Modal session | While modal is open, `__ecotoneSuppressModalPageViews` stays active |
| Route bypass | `trackRoutePageView()` sets `__ecotoneAllowRoutePageView` so real navigations still count |

Modal `pushState` / `replaceState` / `history.go` / `popstate` does not change pathname, so `GaRoutePageView` does not re-fire.

**Why modal URLs appeared in GA4:** GA4 Enhanced Measurement listens to History API changes and fires `page_view` via `dataLayer.push(arguments)`. gtag passes an array-like `arguments` object — the guard must check `entry[0]==='event'` and `entry[1]==='page_view'`, not only `Array.isArray` or `.event`.

**GA4 Admin (required):** Admin → Data collection and modification → Data streams → [web stream] → Enhanced measurement → **Page views** (gear) → Advanced settings → disable **“Page changes based on browser history events”**.

**Debug:** Set `NEXT_PUBLIC_GA_DEBUG=true` or run in development. Console logs `[GA4 gtag]`, `[GA4 dataLayer]`, and `[GA4] blocked page_view` when suppression works.

## Standard conversion payload

Built by `buildStandardConversionPayload()`. Shared by `enquiry_submit` and `generate_lead`.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `conversion_intent` | Yes | `plan_journey` \| `book_experience` |
| `channel` | Yes | `email` on success path |
| `cta_id` | Yes* | Stable CTA identifier from `lib/ctaIds.ts` |
| `source` | Yes* | Placement label; defaults to `button_location` |
| `button_location` | Yes* | CTA placement (`header`, `hero`, `sticky_nav`, etc.) |
| `page_path` | Yes | `pathname + search` at conversion time |
| `page_url` | Yes | Full current URL at conversion time |
| `experience_slug` | When applicable | On experience pages or from booking summary |
| `programme_type` | When applicable | From experience booking summary |
| `lodge_slug` | When applicable | On lodge pages |
| `lead_type` | `generate_lead` only | Same value as `conversion_intent` |

\*Always present when modal opened from a wired CTA (`BookNowOpenSource`).

## Modal lifecycle (code)

1. **Open** — CTA calls `openPlanJourney(source)` or `openExperienceBooking(summary, source)`.
2. **Steps (plan only)** — `onPlanStepAdvance` pushes `step=` URLs; UI Back uses `history.back()`.
3. **Channel** — selecting Email/WhatsApp pushes `channel=`; Back clears channel before previous step.
4. **Email success** — modal calls `onEmailThankYou()` → context pushes thank-you URL, fires `trackEmailConversionSuccess()`.
5. **Close** — `close()` runs `history.go(-n)` to restore the pre-modal URL.
6. **Browser Back/Forward** — `popstate` → `syncStateFromUrl()` updates modal phase/step/channel.

### Thank-you protection

The thank-you URL is **not** a deep-linkable landing page. If `?modal=thank-you` appears without a successful email submit in the current session (`thankYouEligibleRef`), the context strips modal params and keeps the modal closed.

## CTA identifiers (`lib/ctaIds.ts`)

Never derive IDs from button labels. Use constants:

- `header_book_now`, `header_tailor_program`, `header_tailor_book`
- `home_design_program`, `lodge_design_program`, `experience_tailor_program`
- `experience_hero_book`, `experience_sticky_book`, `experience_reserve_book`
- `experience_reserve_whatsapp`, `footer_whatsapp`, `floating_whatsapp`
- `booking_modal_whatsapp`

## Google Ads & GA4

**Single Google tag, two destinations.** `GoogleAnalytics` loads one gtag.js and configures both the GA4 measurement ID and the Google Ads ID (`AW-16757365006`, from `GOOGLE_ADS_ID` / `NEXT_PUBLIC_GOOGLE_ADS_ID`). There is **no** second standalone gtag.js and **no** Google Ads event snippet in the app.

- Both destinations use `send_page_view: false`; Google Ads never receives a synthetic page_view. The GA4 route page_view logic and modal history suppression are unchanged.
- **Conversions are imported from GA4, not hard-coded as Ads snippets.** Because GA4 and Google Ads share the same tag/data stream, existing GA4 key events (e.g. `generate_lead`) can be linked and imported directly — no `gtag('event', 'conversion', { send_to: 'AW-…/label' })` calls are needed.
- **Primary conversion:** Import **`generate_lead`** from GA4 into Google Ads (Tools → Conversions → Import → Google Analytics 4 → Web).
- **Secondary / validation:** **`enquiry_submit`** — useful for debugging and cross-checking counts.
- **Destination URLs are not required.** Success uses History API (`?modal=thank-you&channel=email`), not full document navigation. Event-based conversion import is the supported production path.
- **Setup steps (one-time, in the Google UIs):**
  1. Link the GA4 property to Google Ads (GA4 Admin → Product links → Google Ads links).
  2. Mark `generate_lead` as a key event / conversion in GA4 Admin.
  3. In Google Ads, import it as a conversion (Import → GA4 → Web).
- **Environment gating:** the default `AW-16757365006` is active in **Vercel production only** (`NEXT_PUBLIC_VERCEL_ENV === 'production'`). Preview/staging/development load no Ads tag unless `NEXT_PUBLIC_GOOGLE_ADS_ID` is set explicitly. Setting `NEXT_PUBLIC_GOOGLE_ADS_ID=""` disables it everywhere, including production.

## Consent Mode v2 (EEA/UK + US/CA)

**Advanced mode with a first-party banner.** The Google tag ships Consent Mode v2 default signals *before* `gtag('js')` and any `config`, so consent state is set before tags fire.

| Region | Default (`ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`) |
|--------|-----------------------------------------------------------------------------------|
| EEA + UK (`CONSENT_DENIED_REGIONS`) | **denied** until the visitor accepts (`wait_for_update: 500`) |
| US / Canada / rest of world | **granted** (opt-out model) |

- **Advanced mode:** the tag still loads while denied and sends cookieless pings, so Google conversion modeling recovers EEA/UK measurement. `ads_data_redaction: true` and `url_passthrough: true` are set.
- **Banner:** `components/ConsentBanner.tsx` shows until the visitor chooses Accept/Decline, stores the choice in the first-party `ecotone_consent` cookie (180 days), and pushes `gtag('consent', 'update', …)`. Returning visitors are not re-prompted; their stored choice is re-applied on load.
- **No conflict with the page_view fix:** consent commands are not `page_view` entries, so the dataLayer guard ignores them; route page_view logic is unchanged.
- **GA4 Admin still required:** in the GA4 web stream, enable **Consent settings / Google signals** as needed, and keep the Enhanced Measurement history-based page-view toggle **off** (see above).

Consent files: `lib/consent.ts` (defaults, regions, cookie + update helpers), `components/ConsentBanner.tsx`, `app/consent-banner.css`.

## Key files

| File | Role |
|------|------|
| `lib/bookingModalUrl.ts` | URL parse/build |
| `lib/conversionAnalytics.ts` | Canonical conversion helper + payload |
| `lib/ctaIds.ts` | Stable CTA identifiers |
| `lib/trackBookNowClick.ts` | Pre-conversion book events + `BookNowOpenSource` |
| `lib/trackWhatsappClick.ts` | WhatsApp click events + page context |
| `lib/gaPageView.ts` | Route page views + modal history page_view guard |
| `components/GaRoutePageView.tsx` | Pathname-based page_view tracker |
| `components/GoogleAnalytics.tsx` | gtag load + `send_page_view: false` |
| `components/booking/BookingModalContext.tsx` | Modal state, History API, thank-you guard, conversion calls |

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
