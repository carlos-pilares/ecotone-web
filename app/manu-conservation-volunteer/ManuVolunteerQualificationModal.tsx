'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'

import type { ManuConservationVolunteerEnquiryPayload } from '@/lib/enquiryPayload'
import { formatWonderBeyondPhoneDisplay } from '@/lib/enquiryPayload'
import { submitEnquiry } from '@/lib/submitEnquiry'
import {
  classifyMcvValidationErrors,
  readMcvCampaignQueryParams,
  trackMcvFormFieldSelect,
  trackMcvFormStart,
  trackMcvFormValidationError,
  trackMcvLeadSuccess,
  trackMcvSubmitAttempt,
  trackMcvSubmitError,
} from '@/lib/trackMcvAnalytics'

import { useManuVolunteerCampaign } from './ManuVolunteerCampaignContext'
import {
  MCV_BASE_PRICE,
  MCV_DISCOUNT_PERCENT,
  MCV_DURATION,
  MCV_LANDING_PATH,
  MCV_OFFER_PRICE,
  MCV_PRIVACY_NOTICE_VERSION,
} from './mcv-campaign'
import { MCV_HERO_IMAGES } from './manu-volunteer-images'
import { MCV_QUALIFICATION_STORAGE_KEY } from './mcv-result-shell'
import { WonderResponsiveImage } from '../wonder-beyond-the-wonder/WonderResponsiveImage'

const TIMING_OPTIONS = [
  'September 2026',
  'October 2026',
  'November 2026',
  'December 2026',
  'Early 2027',
] as const

const GROUP_SIZE_OPTIONS = ['Just me', '2', '3–4', '5+'] as const

const COUNTRY_DIAL_OPTIONS = [
  { id: 'PE', code: '+51', flag: '🇵🇪', name: 'Peru' },
  { id: 'US', code: '+1', flag: '🇺🇸', name: 'United States' },
  { id: 'CA', code: '+1', flag: '🇨🇦', name: 'Canada' },
  { id: 'GB', code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { id: 'FR', code: '+33', flag: '🇫🇷', name: 'France' },
  { id: 'ES', code: '+34', flag: '🇪🇸', name: 'Spain' },
  { id: 'DE', code: '+49', flag: '🇩🇪', name: 'Germany' },
  { id: 'CH', code: '+41', flag: '🇨🇭', name: 'Switzerland' },
  { id: 'IT', code: '+39', flag: '🇮🇹', name: 'Italy' },
  { id: 'NL', code: '+31', flag: '🇳🇱', name: 'Netherlands' },
  { id: 'BE', code: '+32', flag: '🇧🇪', name: 'Belgium' },
  { id: 'MX', code: '+52', flag: '🇲🇽', name: 'Mexico' },
  { id: 'AR', code: '+54', flag: '🇦🇷', name: 'Argentina' },
  { id: 'BR', code: '+55', flag: '🇧🇷', name: 'Brazil' },
  { id: 'CL', code: '+56', flag: '🇨🇱', name: 'Chile' },
  { id: 'CO', code: '+57', flag: '🇨🇴', name: 'Colombia' },
  { id: 'AU', code: '+61', flag: '🇦🇺', name: 'Australia' },
  { id: 'JP', code: '+81', flag: '🇯🇵', name: 'Japan' },
  { id: 'CN', code: '+86', flag: '🇨🇳', name: 'China' },
  { id: 'OTHER', code: '', flag: '', name: 'Other / custom code' },
] as const

type CountryDialOption = (typeof COUNTRY_DIAL_OPTIONS)[number]

type FormState = {
  fullName: string
  email: string
  countryId: string
  customCode: string
  phone: string
  travelTiming: string
  groupSize: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

const EMPTY_FORM: FormState = {
  fullName: '',
  email: '',
  countryId: 'PE',
  customCode: '',
  phone: '',
  travelTiming: '',
  groupSize: '',
}

const SAVE_ERROR_MESSAGE =
  'We couldn’t save your details. Please try again in a moment.'

function resolveMcvLandingPageUrl(): string {
  if (typeof window === 'undefined') return MCV_LANDING_PATH
  try {
    return new URL(MCV_LANDING_PATH, window.location.origin).href
  } catch {
    return MCV_LANDING_PATH
  }
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function normalizeDialCode(raw: string): string {
  const trimmed = raw.trim().replace(/\s+/g, '')
  if (!trimmed) return ''
  const digits = trimmed.replace(/^\+/, '').replace(/[^\d]/g, '')
  return digits ? `+${digits}` : ''
}

function dialCodeForForm(form: Pick<FormState, 'countryId' | 'customCode'>): string {
  if (form.countryId === 'OTHER') {
    return normalizeDialCode(form.customCode)
  }
  return COUNTRY_DIAL_OPTIONS.find((item) => item.id === form.countryId)?.code ?? '+51'
}

function sanitizePhoneInput(raw: string): string {
  return raw.replace(/[^\d\s]/g, '').replace(/\s+/g, ' ')
}

function countPhoneDigits(phone: string): number {
  return phone.replace(/\D/g, '').length
}

function buildLeadPayload(
  form: FormState,
  privacyNoticeShownAt: string,
): ManuConservationVolunteerEnquiryPayload {
  const phone = sanitizePhoneInput(form.phone).trim()
  const phoneCountryCode = dialCodeForForm(form)
  const campaign = readMcvCampaignQueryParams()
  return {
    kind: 'manu_conservation_volunteer',
    flowType: 'manu_conservation_volunteer',
    flowLabel: 'Manu Conservation Volunteer',
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    phoneCountryCode,
    phone,
    fullPhone: formatWonderBeyondPhoneDisplay(phoneCountryCode, phone),
    travelTiming: form.travelTiming,
    groupSize: form.groupSize,
    contactChannel: 'form',
    source: 'manu-conservation-volunteer-landing',
    pageUrl: resolveMcvLandingPageUrl(),
    utmSource: campaign.utm_source,
    utmMedium: campaign.utm_medium,
    utmCampaign: campaign.utm_campaign,
    utmTerm: campaign.utm_term,
    utmContent: campaign.utm_content,
    gclid: campaign.gclid,
    gbraid: campaign.gbraid,
    wbraid: campaign.wbraid,
    basePrice: MCV_BASE_PRICE,
    discountPercent: MCV_DISCOUNT_PERCENT,
    offerPrice: MCV_OFFER_PRICE,
    duration: MCV_DURATION,
    privacyNoticeVersion: MCV_PRIVACY_NOTICE_VERSION,
    privacyNoticeShownAt,
  }
}

function validateForm(form: FormState): FieldErrors {
  const errors: FieldErrors = {}
  if (!form.fullName.trim()) errors.fullName = 'Required'
  if (!form.email.trim()) errors.email = 'Required'
  else if (!isValidEmail(form.email.trim())) errors.email = 'Enter a valid email'
  if (!form.travelTiming) errors.travelTiming = 'Required'
  if (!form.groupSize) errors.groupSize = 'Required'
  const phone = sanitizePhoneInput(form.phone).trim()
  if (phone && countPhoneDigits(phone) < 6) {
    errors.phone = 'Please enter a valid phone number.'
  }
  return errors
}

function RequiredMark() {
  return (
    <span className="mcv-field-required" aria-hidden="true">
      *
    </span>
  )
}

function getCountryOption(countryId: string): CountryDialOption {
  return COUNTRY_DIAL_OPTIONS.find((item) => item.id === countryId) ?? COUNTRY_DIAL_OPTIONS[0]
}

function CountryCodeSelect({
  value,
  onChange,
  labelledBy,
  disabled,
}: {
  value: string
  onChange: (countryId: string) => void
  labelledBy: string
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selected = getCountryOption(value)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const closedLabel = selected.id === 'OTHER' ? 'Other' : `${selected.flag} ${selected.code}`

  return (
    <div className="mcv-phone-code" ref={rootRef}>
      <button
        type="button"
        className="mcv-phone-code-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelledBy}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="mcv-phone-code-trigger-label">{closedLabel}</span>
        <span className="mcv-phone-code-chevron" aria-hidden="true" />
      </button>
      {open ? (
        <ul className="mcv-phone-code-list" id={listId} role="listbox" aria-labelledby={labelledBy}>
          {COUNTRY_DIAL_OPTIONS.map((item) => {
            const optionLabel =
              item.id === 'OTHER' ? item.name : `${item.flag} ${item.name} (${item.code})`
            return (
              <li key={item.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  className={
                    item.id === value
                      ? 'mcv-phone-code-option mcv-phone-code-option--active'
                      : 'mcv-phone-code-option'
                  }
                  aria-selected={item.id === value}
                  onClick={() => {
                    onChange(item.id)
                    setOpen(false)
                  }}
                >
                  {optionLabel}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

function persistQualificationAndGo(
  router: ReturnType<typeof useRouter>,
  form: FormState,
  leadId: string,
  closeModal: (method: 'backdrop' | 'close_button' | 'escape') => void,
) {
  try {
    sessionStorage.setItem(
      MCV_QUALIFICATION_STORAGE_KEY,
      JSON.stringify({
        leadId,
        travelTiming: form.travelTiming,
        groupSize: form.groupSize,
      }),
    )
  } catch {
    // Ignore quota / private mode — redirect still works.
  }
  closeModal('close_button')
  router.push('/manu-conservation-volunteer/result')
}

export function ManuVolunteerQualificationModal() {
  const { isModalOpen, closeModal, openedFrom, markFormStarted } = useManuVolunteerCampaign()
  if (!isModalOpen) return null
  return (
    <ManuVolunteerQualificationModalInner
      closeModal={closeModal}
      openedFrom={openedFrom}
      markFormStarted={markFormStarted}
    />
  )
}

function ManuVolunteerQualificationModalInner({
  closeModal,
  openedFrom,
  markFormStarted,
}: {
  closeModal: (method: 'backdrop' | 'close_button' | 'escape') => void
  openedFrom: ReturnType<typeof useManuVolunteerCampaign>['openedFrom']
  markFormStarted: () => void
}) {
  const router = useRouter()
  const titleId = useId()
  const phoneLabelId = useId()
  const customCodeId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const privacyNoticeShownAtRef = useRef<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const formStartTrackedRef = useRef(false)

  useEffect(() => {
    formStartTrackedRef.current = false
  }, [])

  const noteFormStart = () => {
    if (formStartTrackedRef.current) return
    formStartTrackedRef.current = true
    markFormStarted()
    trackMcvFormStart({ opened_from: openedFrom })
  }

  useEffect(() => {
    if (!privacyNoticeShownAtRef.current) {
      privacyNoticeShownAtRef.current = new Date().toISOString()
    }
  }, [])

  useEffect(() => {
    const t = window.setTimeout(() => closeRef.current?.focus(), 0)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    dialog.addEventListener('keydown', onKeyDown)
    return () => dialog.removeEventListener('keydown', onKeyDown)
  }, [])

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    noteFormStart()
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
    if (submitError) setSubmitError('')
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (isSubmitting) return

    const nextErrors = validateForm(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      const classified = classifyMcvValidationErrors(nextErrors)
      if (classified) {
        trackMcvFormValidationError(classified)
      }
      return
    }

    const privacyNoticeShownAt = privacyNoticeShownAtRef.current ?? new Date().toISOString()

    trackMcvSubmitAttempt({
      travel_timing: form.travelTiming,
      group_size: form.groupSize,
      opened_from: openedFrom,
    })

    setIsSubmitting(true)
    setSubmitError('')
    try {
      const result = await submitEnquiry(buildLeadPayload(form, privacyNoticeShownAt))
      if (!result.ok) {
        setSubmitError(SAVE_ERROR_MESSAGE)
        trackMcvSubmitError({ error_type: 'api_error' })
        return
      }
      trackMcvLeadSuccess({
        travel_timing: form.travelTiming,
        group_size: form.groupSize,
        opened_from: openedFrom,
      })
      persistQualificationAndGo(router, form, result.leadId, closeModal)
    } catch {
      setSubmitError(SAVE_ERROR_MESSAGE)
      trackMcvSubmitError({ error_type: 'network_error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="mcv-modal-root"
      role="presentation"
      onMouseDown={() => closeModal('backdrop')}
    >
      <div
        ref={dialogRef}
        className="mcv-modal mcv-modal--split"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className="mcv-modal-close"
          aria-label="Close"
          onClick={() => closeModal('close_button')}
        >
          ×
        </button>

        <div className="mcv-modal-layout">
          <aside className="mcv-modal-promo" aria-label="Manu Field Crew">
            <div className="mcv-modal-promo-media" aria-hidden>
              <WonderResponsiveImage
                manifest={MCV_HERO_IMAGES}
                className="mcv-modal-promo-img"
                pictureClassName="mcv-modal-promo-picture"
                sizes="(min-width: 900px) 40vw, 100vw"
              />
              <div className="mcv-modal-promo-scrim" />
            </div>
            <div className="mcv-modal-promo-copy">
              <p className="mcv-modal-promo-eyebrow">Join the Manu Field Crew</p>
            </div>
          </aside>

          <div className="mcv-modal-form-panel">
            <div className="mcv-modal-form-inner">
              <h2 id={titleId} className="mcv-modal-title">
                Find your field place
              </h2>
              <p className="mcv-modal-subtitle">
                Tell us a little about you and when you&apos;d like to join.
              </p>

              <div className="mcv-modal-offer" aria-label="2026 field offer">
                <div className="mcv-modal-offer-row">
                  <span className="mcv-modal-offer-upto">Up to</span>
                  <span className="mcv-modal-offer-pct">30%</span>
                  <span className="mcv-modal-offer-off">Off</span>
                </div>
                <p className="mcv-modal-offer-detail">Selected 2026 Conservation Volunteer places.</p>
                <p className="mcv-modal-offer-foot">Your offer is revealed after you submit.</p>
              </div>

              <form className="mcv-modal-form" onSubmit={onSubmit} noValidate>
              <div className="mcv-form-grid">
                <label className="mcv-field">
                  <span className="mcv-field-label">
                    Full name <RequiredMark />
                  </span>
                  <input
                    className="mcv-field-input"
                    type="text"
                    name="fullName"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={form.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    aria-invalid={Boolean(errors.fullName)}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.fullName ? (
                    <span className="mcv-field-error" role="alert">
                      {errors.fullName}
                    </span>
                  ) : null}
                </label>

                <label className="mcv-field">
                  <span className="mcv-field-label">
                    Email <RequiredMark />
                  </span>
                  <input
                    className="mcv-field-input"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.email ? (
                    <span className="mcv-field-error" role="alert">
                      {errors.email}
                    </span>
                  ) : null}
                </label>

                <div className="mcv-field mcv-field--span">
                  <span className="mcv-field-label" id={phoneLabelId}>
                    WhatsApp / phone
                  </span>
                  <div
                    className={
                      form.countryId === 'OTHER'
                        ? 'mcv-phone-group mcv-phone-group--custom'
                        : 'mcv-phone-group'
                    }
                  >
                    <CountryCodeSelect
                      value={form.countryId}
                      onChange={(countryId) => updateField('countryId', countryId)}
                      labelledBy={phoneLabelId}
                      disabled={isSubmitting}
                    />
                    {form.countryId === 'OTHER' ? (
                      <label className="mcv-phone-custom" htmlFor={customCodeId}>
                        <span className="mcv-sr-only">Custom country code</span>
                        <input
                          id={customCodeId}
                          className="mcv-field-input"
                          type="text"
                          name="customCode"
                          inputMode="tel"
                          autoComplete="tel-country-code"
                          placeholder="+00"
                          value={form.customCode}
                          onChange={(e) => updateField('customCode', e.target.value)}
                          aria-labelledby={phoneLabelId}
                          disabled={isSubmitting}
                        />
                      </label>
                    ) : null}
                    <input
                      className="mcv-field-input mcv-phone-number"
                      type="tel"
                      name="phone"
                      inputMode="tel"
                      autoComplete="tel-national"
                      placeholder="Phone number"
                      value={form.phone}
                      onChange={(e) => updateField('phone', sanitizePhoneInput(e.target.value))}
                      aria-labelledby={phoneLabelId}
                      aria-invalid={Boolean(errors.phone)}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.phone ? (
                    <span className="mcv-field-error" role="alert">
                      {errors.phone}
                    </span>
                  ) : null}
                </div>

                <label className="mcv-field">
                  <span className="mcv-field-label">
                    When would you like to join? <RequiredMark />
                  </span>
                  <select
                    className="mcv-field-input"
                    name="travelTiming"
                    value={form.travelTiming}
                    onChange={(e) => {
                      updateField('travelTiming', e.target.value)
                      trackMcvFormFieldSelect({
                        field_name: 'travel_timing',
                        field_value: e.target.value,
                      })
                    }}
                    aria-invalid={Boolean(errors.travelTiming)}
                    disabled={isSubmitting}
                    required
                  >
                    <option value="">Select…</option>
                    {TIMING_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.travelTiming ? (
                    <span className="mcv-field-error" role="alert">
                      {errors.travelTiming}
                    </span>
                  ) : null}
                </label>

                <label className="mcv-field">
                  <span className="mcv-field-label">
                    How many people would join? <RequiredMark />
                  </span>
                  <select
                    className="mcv-field-input"
                    name="groupSize"
                    value={form.groupSize}
                    onChange={(e) => {
                      updateField('groupSize', e.target.value)
                      trackMcvFormFieldSelect({
                        field_name: 'group_size',
                        field_value: e.target.value,
                      })
                    }}
                    aria-invalid={Boolean(errors.groupSize)}
                    disabled={isSubmitting}
                    required
                  >
                    <option value="">Select…</option>
                    {GROUP_SIZE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.groupSize ? (
                    <span className="mcv-field-error" role="alert">
                      {errors.groupSize}
                    </span>
                  ) : null}
                </label>
              </div>

              {submitError ? (
                <p className="mcv-modal-submit-error" role="alert">
                  {submitError}
                </p>
              ) : null}

              <div className="mcv-modal-actions mcv-modal-actions--single">
                <button type="submit" className="mcv-cta mcv-cta--prominent" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'See what I qualify for'}
                </button>
              </div>
              <div className="mcv-modal-form-footer">
                <p className="mcv-modal-privacy-notice">
                  We&apos;ll use your details to show your field offer, respond to your enquiry and
                  manage your Manu Field Crew application.{' '}
                  <Link href="/privacy-policy" className="mcv-modal-privacy-link">
                    Privacy Policy
                  </Link>
                </p>
                <p className="mcv-modal-note">No commitment required.</p>
              </div>
            </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
