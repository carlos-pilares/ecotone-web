'use client'

import { useEffect, useId, useRef, useState, type FormEvent } from 'react'

import type { WonderBeyondEnquiryPayload } from '@/lib/enquiryPayload'
import { submitEnquiry } from '@/lib/submitEnquiry'
import {
  readWbtwCampaignQueryParams,
  trackWbtwFormFieldSelect,
  trackWbtwFormStart,
  trackWbtwFormValidationError,
  trackWbtwLeadSuccess,
  trackWbtwSubmitAttempt,
  trackWbtwSubmitError,
  trackWbtwThankYouView,
  trackWbtwWhatsappOpen,
  type WbtwSubmissionChannel,
} from '@/lib/trackWonderBeyondAnalytics'

import { useWonderCampaign } from './WonderCampaignContext'

/**
 * Ecotone campaign WhatsApp destination for wa.me.
 * Digits only — no +, spaces, parentheses, or dashes.
 * Display form: +51 974 781 094
 */
const ECOTONE_WHATSAPP_NUMBER = '51974781094'

const TRAVEL_TIMING_OPTIONS = [
  'July–August 2026',
  'September–October 2026',
  'November–December 2026',
  'Early 2027',
  'Not sure yet',
] as const

const TRAVELLER_COUNT_OPTIONS = ['1', '2', '3–4', '5+', 'Not sure yet'] as const

const INTEREST_OPTIONS = [
  'Nature adventure',
  'Family experience',
  'Wildlife & photography',
  'Not sure yet',
] as const

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
  travellers: string
  interest: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

const EMPTY_FORM: FormState = {
  fullName: '',
  email: '',
  countryId: 'PE',
  customCode: '',
  phone: '',
  travelTiming: '',
  travellers: '',
  interest: '',
}

const SAVE_ERROR_MESSAGE =
  'We couldn’t save your details. Please try again or continue via WhatsApp.'

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

/** Keep only digits and spaces in the local phone input. */
function sanitizePhoneInput(raw: string): string {
  return raw.replace(/[^\d\s]/g, '').replace(/\s+/g, ' ')
}

function countPhoneDigits(phone: string): number {
  return phone.replace(/\D/g, '').length
}

function formatPhoneForMessage(form: Pick<FormState, 'countryId' | 'customCode' | 'phone'>): string {
  const countryCode = dialCodeForForm(form)
  const digits = form.phone.trim().replace(/\s+/g, ' ').trim()
  if (!digits) return 'Not provided'
  if (!countryCode) {
    return digits.startsWith('+') ? digits : `+${digits}`
  }
  // Avoid duplicating the dial code if the user typed it into the number field.
  const prefix = countryCode.replace('+', '')
  const cleaned = digits.startsWith(prefix) ? digits.slice(prefix.length).trim() : digits
  const number = cleaned || digits
  return `${countryCode} ${number}`.replace(/\s+/g, ' ').trim()
}

function buildLeadPayload(
  form: FormState,
  contactChannel: WonderBeyondEnquiryPayload['contactChannel'],
): WonderBeyondEnquiryPayload {
  const phone = sanitizePhoneInput(form.phone).trim()
  const phoneCountryCode = dialCodeForForm(form)
  const campaign = readWbtwCampaignQueryParams()
  return {
    kind: 'wonder_beyond_the_wonder',
    flowType: 'wonder_beyond_the_wonder',
    flowLabel: 'Wonder Beyond the Wonder',
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    phoneCountryCode,
    phone,
    fullPhone: formatPhoneForMessage({ ...form, phone }),
    travelTiming: form.travelTiming,
    groupSize: form.travellers,
    interest: form.interest.trim(),
    contactChannel,
    source: 'wonder-beyond-the-wonder-landing',
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    utmSource: campaign.utm_source,
    utmMedium: campaign.utm_medium,
    utmCampaign: campaign.utm_campaign,
    utmTerm: campaign.utm_term,
    utmContent: campaign.utm_content,
    gclid: campaign.gclid,
    gbraid: campaign.gbraid,
    wbraid: campaign.wbraid,
  }
}

function classifyValidationErrors(errors: FieldErrors): {
  missing_fields: string
  invalid_fields: string
} {
  const missing: string[] = []
  const invalid: string[] = []
  if (errors.fullName) missing.push('fullName')
  if (errors.email === 'Required') missing.push('email')
  else if (errors.email) invalid.push('email')
  if (errors.travelTiming) missing.push('travelTiming')
  if (errors.travellers) missing.push('groupSize')
  if (errors.phone) invalid.push('phone')
  return {
    missing_fields: missing.join(','),
    invalid_fields: invalid.join(','),
  }
}

function buildWhatsAppMessage(form: FormState): string {
  const interest = form.interest.trim() || 'Not sure yet'

  return [
    'Hello Ecotone,',
    '',
    'I would like to check my travel fit for the Wonder Beyond the Wonder campaign.',
    '',
    `Name: ${form.fullName.trim()}`,
    `Email: ${form.email.trim()}`,
    `WhatsApp / phone: ${formatPhoneForMessage(form)}`,
    `Travel timing: ${form.travelTiming}`,
    `Number of travellers: ${form.travellers}`,
    `Interest: ${interest}`,
    '',
    'Please let me know which Ecotone Experience and 2026 benefit may fit my Peru trip.',
  ].join('\n')
}

function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${ECOTONE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

function validateForm(form: FormState): FieldErrors {
  const errors: FieldErrors = {}
  if (!form.fullName.trim()) errors.fullName = 'Required'
  if (!form.email.trim()) errors.email = 'Required'
  else if (!isValidEmail(form.email.trim())) errors.email = 'Enter a valid email'
  if (!form.travelTiming) errors.travelTiming = 'Required'
  if (!form.travellers) errors.travellers = 'Required'
  const phone = sanitizePhoneInput(form.phone).trim()
  if (phone && countPhoneDigits(phone) < 6) {
    errors.phone = 'Please enter a valid phone number.'
  }
  return errors
}

function RequiredMark() {
  return (
    <span className="wbtw-field-required" aria-hidden="true">
      *
    </span>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="wbtw-whatsapp-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      />
    </svg>
  )
}

function getCountryOption(countryId: string): CountryDialOption {
  return COUNTRY_DIAL_OPTIONS.find((item) => item.id === countryId) ?? COUNTRY_DIAL_OPTIONS[0]
}

/** Closed: flag + dial code. Open list: flag + country name + dial code. */
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

  const closedLabel =
    selected.id === 'OTHER' ? 'Other' : `${selected.flag} ${selected.code}`

  return (
    <div className="wbtw-phone-code" ref={rootRef}>
      <button
        type="button"
        className="wbtw-phone-code-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelledBy}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="wbtw-phone-code-trigger-label">{closedLabel}</span>
        <span className="wbtw-phone-code-chevron" aria-hidden="true" />
      </button>
      {open ? (
        <ul className="wbtw-phone-code-list" id={listId} role="listbox" aria-labelledby={labelledBy}>
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
                      ? 'wbtw-phone-code-option wbtw-phone-code-option--active'
                      : 'wbtw-phone-code-option'
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

type ModalPhase = 'form' | 'thanks' | 'whatsapp_confirm'

export function WonderTravelFitModal() {
  const { isModalOpen, closeModal, openedFrom, markFormStarted } = useWonderCampaign()
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [phase, setPhase] = useState<ModalPhase>('form')
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const formStartTrackedRef = useRef(false)

  useEffect(() => {
    if (!isModalOpen) return
    setForm(EMPTY_FORM)
    setErrors({})
    setPhase('form')
    setWhatsappUrl('')
    setIsSubmitting(false)
    setSubmitError('')
    formStartTrackedRef.current = false
  }, [isModalOpen])

  if (!isModalOpen) return null

  const noteFormStart = (firstField: string) => {
    if (formStartTrackedRef.current) return
    formStartTrackedRef.current = true
    markFormStarted()
    trackWbtwFormStart({
      first_field: firstField,
      opened_from: openedFrom,
    })
  }

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    noteFormStart(key === 'travellers' ? 'groupSize' : key)
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
    if (submitError) setSubmitError('')
  }

  const onSelectFieldChange = (
    field: 'travelTiming' | 'groupSize' | 'interest',
    formKey: 'travelTiming' | 'travellers' | 'interest',
    value: string,
  ) => {
    updateField(formKey, value)
    trackWbtwFormFieldSelect({ field_name: field, field_value: value })
  }

  const openWhatsApp = (url: string) => {
    // Keep the campaign landing page open; open WhatsApp in a new tab only.
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  /** Validate → save lead. Caller decides success UX (thanks vs WhatsApp). */
  const saveLead = async (contactChannel: WbtwSubmissionChannel): Promise<boolean> => {
    if (isSubmitting) return false

    const nextErrors = validateForm(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      const classified = classifyValidationErrors(nextErrors)
      trackWbtwFormValidationError({
        submission_channel: contactChannel,
        ...classified,
      })
      return false
    }

    trackWbtwSubmitAttempt({
      submission_channel: contactChannel,
      travel_timing: form.travelTiming,
      group_size: form.travellers,
      interest: form.interest.trim(),
    })

    setSubmitError('')
    setIsSubmitting(true)

    try {
      const ok = await submitEnquiry(buildLeadPayload(form, contactChannel))
      if (!ok) {
        setSubmitError(SAVE_ERROR_MESSAGE)
        trackWbtwSubmitError({
          submission_channel: contactChannel,
          error_type: 'api_error',
        })
        return false
      }
      trackWbtwLeadSuccess({
        submission_channel: contactChannel,
        travel_timing: form.travelTiming,
        group_size: form.travellers,
        interest: form.interest.trim(),
      })
      return true
    } catch {
      setSubmitError(SAVE_ERROR_MESSAGE)
      trackWbtwSubmitError({
        submission_channel: contactChannel,
        error_type: 'network_error',
      })
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const onPrimarySubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const ok = await saveLead('form')
    if (!ok) return
    setPhase('thanks')
    trackWbtwThankYouView('form')
  }

  const onWhatsAppClick = async () => {
    const message = buildWhatsAppMessage(form)
    const url = buildWhatsAppUrl(message)
    setWhatsappUrl(url)
    const ok = await saveLead('whatsapp')
    if (!ok) return
    openWhatsApp(url)
    trackWbtwWhatsappOpen()
    setPhase('whatsapp_confirm')
    trackWbtwThankYouView('whatsapp')
  }

  /** Fallback after API failure — open WhatsApp without treating this as a lead conversion. */
  const onContinueViaWhatsApp = () => {
    const message = buildWhatsAppMessage(form)
    const url = whatsappUrl || buildWhatsAppUrl(message)
    setWhatsappUrl(url)
    openWhatsApp(url)
    trackWbtwWhatsappOpen()
    setPhase('whatsapp_confirm')
  }

  return (
    <div
      className="wbtw-modal-root"
      role="presentation"
      onMouseDown={() => closeModal('backdrop')}
    >
      <div
        className="wbtw-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wbtw-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="wbtw-modal-close"
          onClick={() => closeModal(phase === 'form' ? 'close_button' : 'thank_you_close')}
          aria-label="Close"
        >
          ×
        </button>

        {phase === 'form' ? (
          <>
            <h2 id="wbtw-modal-title" className="wbtw-modal-title">
              Check your 2026 benefit
            </h2>
            <p className="wbtw-modal-subtitle">
              Tell us a few details about your Peru plans and we&apos;ll help you understand which
              Ecotone Experience may fit your trip, including any 2026 direct-booking benefit that may
              apply.
            </p>

            <aside className="wbtw-modal-benefit" aria-label="Campaign benefit">
              <p className="wbtw-modal-benefit-lead">Selected travellers may be eligible for</p>
              <p className="wbtw-modal-benefit-value">
                <span className="wbtw-modal-benefit-upto">Up to</span>{' '}
                <span className="wbtw-modal-benefit-pct">50%</span>{' '}
                <span className="wbtw-modal-benefit-off">off</span>
              </p>
              <p className="wbtw-modal-benefit-detail">selected 2026 Ecotone Experiences</p>
            </aside>

            <form className="wbtw-form wbtw-modal-form" onSubmit={onPrimarySubmit} noValidate>
              <div className="wbtw-form-grid">
                <label className="wbtw-field">
                  <span className="wbtw-field-label">
                    Full name <RequiredMark />
                  </span>
                  <input
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
                  {errors.fullName ? <span className="wbtw-field-error">{errors.fullName}</span> : null}
                </label>

                <label className="wbtw-field">
                  <span className="wbtw-field-label">
                    Email address <RequiredMark />
                  </span>
                  <input
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
                  {errors.email ? <span className="wbtw-field-error">{errors.email}</span> : null}
                </label>

                <div className="wbtw-field">
                  <span className="wbtw-field-label" id="wbtw-phone-label">
                    WhatsApp / phone
                  </span>
                  <div
                    className={
                      form.countryId === 'OTHER'
                        ? 'wbtw-phone-group wbtw-phone-group--custom'
                        : 'wbtw-phone-group'
                    }
                  >
                    <CountryCodeSelect
                      value={form.countryId}
                      onChange={(countryId) => updateField('countryId', countryId)}
                      labelledBy="wbtw-phone-label"
                      disabled={isSubmitting}
                    />
                    {form.countryId === 'OTHER' ? (
                      <label className="wbtw-phone-custom" htmlFor="wbtw-custom-code">
                        <span className="wbtw-sr-only">Custom country code</span>
                        <input
                          id="wbtw-custom-code"
                          type="text"
                          name="customCode"
                          inputMode="tel"
                          autoComplete="tel-country-code"
                          placeholder="+00"
                          value={form.customCode}
                          onChange={(e) => updateField('customCode', e.target.value)}
                          aria-labelledby="wbtw-phone-label"
                          disabled={isSubmitting}
                        />
                      </label>
                    ) : null}
                    <label className="wbtw-phone-number" htmlFor="wbtw-phone-number">
                      <span className="wbtw-sr-only">Phone number</span>
                      <input
                        id="wbtw-phone-number"
                        type="tel"
                        name="phone"
                        autoComplete="tel-national"
                        inputMode="numeric"
                        placeholder="999 999 999"
                        value={form.phone}
                        onChange={(e) => updateField('phone', sanitizePhoneInput(e.target.value))}
                        aria-labelledby="wbtw-phone-label"
                        aria-invalid={Boolean(errors.phone)}
                        disabled={isSubmitting}
                      />
                    </label>
                  </div>
                  {errors.phone ? <span className="wbtw-field-error">{errors.phone}</span> : null}
                </div>

                <label className="wbtw-field">
                  <span className="wbtw-field-label">
                    When are you planning to travel? <RequiredMark />
                  </span>
                  <select
                    name="travelTiming"
                    value={form.travelTiming}
                    onChange={(e) => onSelectFieldChange('travelTiming', 'travelTiming', e.target.value)}
                    aria-invalid={Boolean(errors.travelTiming)}
                    disabled={isSubmitting}
                    required
                  >
                    <option value="" disabled>
                      Select timing
                    </option>
                    {TRAVEL_TIMING_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.travelTiming ? (
                    <span className="wbtw-field-error">{errors.travelTiming}</span>
                  ) : null}
                </label>

                <label className="wbtw-field">
                  <span className="wbtw-field-label">
                    How many people are travelling? <RequiredMark />
                  </span>
                  <select
                    name="travellers"
                    value={form.travellers}
                    onChange={(e) => onSelectFieldChange('groupSize', 'travellers', e.target.value)}
                    aria-invalid={Boolean(errors.travellers)}
                    disabled={isSubmitting}
                    required
                  >
                    <option value="" disabled>
                      Select number
                    </option>
                    {TRAVELLER_COUNT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.travellers ? (
                    <span className="wbtw-field-error">{errors.travellers}</span>
                  ) : null}
                </label>

                <label className="wbtw-field">
                  <span className="wbtw-field-label">What interests you most?</span>
                  <select
                    name="interest"
                    value={form.interest}
                    onChange={(e) => onSelectFieldChange('interest', 'interest', e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="">Select interest</option>
                    {INTEREST_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {submitError ? (
                <div className="wbtw-form-submit-error" role="alert">
                  <p>{submitError}</p>
                  <button
                    type="button"
                    className="wbtw-cta wbtw-cta--whatsapp wbtw-modal-btn"
                    onClick={onContinueViaWhatsApp}
                  >
                    <WhatsAppIcon />
                    Continue via WhatsApp
                  </button>
                </div>
              ) : null}

              <div className="wbtw-modal-actions">
                <button
                  type="submit"
                  className="wbtw-cta wbtw-cta--primary wbtw-modal-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving…' : 'Check my travel fit'}
                </button>
                <button
                  type="button"
                  className="wbtw-cta wbtw-cta--whatsapp wbtw-modal-btn"
                  onClick={onWhatsAppClick}
                  disabled={isSubmitting}
                >
                  <WhatsAppIcon />
                  {isSubmitting ? 'Saving…' : 'Send via WhatsApp'}
                </button>
              </div>
            </form>

            <p className="wbtw-modal-note">No commitment required.</p>
          </>
        ) : null}

        {phase === 'thanks' ? (
          <div className="wbtw-modal-confirm">
            <h2 id="wbtw-modal-title" className="wbtw-modal-title">
              Thank you — we received your travel fit details
            </h2>
            <p className="wbtw-modal-subtitle">
              Our team will review your Peru plans and contact you shortly with the Ecotone Experience
              and 2026 benefit that may best fit your journey.
            </p>
            <div className="wbtw-modal-actions">
              <button
                type="button"
                className="wbtw-cta wbtw-cta--primary wbtw-modal-btn"
                onClick={() => closeModal('thank_you_close')}
              >
                Close
              </button>
            </div>
          </div>
        ) : null}

        {phase === 'whatsapp_confirm' ? (
          <div className="wbtw-modal-confirm">
            <h2 id="wbtw-modal-title" className="wbtw-modal-title">
              Your WhatsApp message is ready
            </h2>
            <p className="wbtw-modal-subtitle">
              Please send the message in WhatsApp so our team receives your details. We&apos;ve also
              recorded your travel fit request and will review which Ecotone Experience and 2026
              benefit may fit your trip.
            </p>
            <div className="wbtw-modal-actions">
              {whatsappUrl ? (
                <button
                  type="button"
                  className="wbtw-cta wbtw-cta--whatsapp wbtw-modal-btn"
                  onClick={() => openWhatsApp(whatsappUrl)}
                >
                  <WhatsAppIcon />
                  Open WhatsApp again
                </button>
              ) : null}
              <button
                type="button"
                className="wbtw-cta wbtw-cta--primary wbtw-modal-btn"
                onClick={() => closeModal('thank_you_close')}
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
