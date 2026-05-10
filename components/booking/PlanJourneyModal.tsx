'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from 'react'

import type { PlanJourneyDraft } from '@/components/booking/types'
import type { GeneralModalCopy, TravellerIconKey } from '@/lib/bookingModalCopy'
import { effectiveWhatsappNumber } from '@/lib/bookingModalCopy'
import { buildWaMeLink } from '@/lib/bookingWhatsapp'
import { submitEnquiryInBackground } from '@/lib/submitEnquiry'

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function TravellerSvg({ iconKey }: { iconKey: TravellerIconKey }) {
  switch (iconKey) {
    case 'family':
      return (
        <svg className="ecotone-book-pick-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    case 'academic':
      return (
        <svg className="ecotone-book-pick-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M9 2v6l3-2 3 2V2" />
          <path d="M5 10h14v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V10z" />
        </svg>
      )
    case 'company':
      return (
        <svg className="ecotone-book-pick-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      )
    default:
      return (
        <svg className="ecotone-book-pick-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
        </svg>
      )
  }
}

type Props = {
  waNumber: string
  copy: GeneralModalCopy
  onClose: () => void
}

function WaGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      />
    </svg>
  )
}

function MailGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M22 7l-10 7L2 7" />
    </svg>
  )
}

function backLabel(raw: string) {
  const t = raw.trim()
  if (t.startsWith('←') || t.startsWith('\u2190')) return t
  return `\u2190 ${t}`
}

export function PlanJourneyModal({ waNumber, copy, onClose }: Props) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const firstTravellerRef = useRef<HTMLButtonElement>(null)
  const firstSeasonRef = useRef<HTMLButtonElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const firstChannelRef = useRef<HTMLButtonElement>(null)

  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [travellerType, setTravellerType] = useState<string | null>(null)
  const [season, setSeason] = useState<string | null>(null)
  const [partySize, setPartySize] = useState(() => copy.step2.peopleField.defaultNumber)
  const [selectedContactIndex, setSelectedContactIndex] = useState<number | null>(null)
  const [email, setEmail] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [emailErr, setEmailErr] = useState('')
  const [emailThanks, setEmailThanks] = useState(false)

  const [step1Err, setStep1Err] = useState({ name: '', traveller: '' })
  const [step2Err, setStep2Err] = useState({ season: '', people: '' })
  const [contactErr, setContactErr] = useState('')

  const contactOptions = copy.step3.contactField.options
  const v = copy.validation

  function travellerTitle(valueKey: string) {
    return copy.step1.optionsField.options.find((o) => o.valueKey === valueKey)?.title ?? valueKey
  }

  function seasonLine(valueKey: string) {
    const o = copy.step2.seasonField.options.find((x) => x.valueKey === valueKey)
    if (!o) return valueKey
    return [o.title, o.subtitle].filter(Boolean).join(' · ')
  }

  const draft: PlanJourneyDraft = useMemo(
    () => ({
      fullName: name.trim(),
      travellerType,
      season,
      partySize: String(partySize),
    }),
    [name, travellerType, season, partySize],
  )

  const waText = useMemo(() => {
    const tt = travellerType ? travellerTitle(travellerType) : '—'
    const sn = season ? seasonLine(season) : '—'
    const lines = [
      `Hi Ecotone — I'd like to plan a journey.`,
      `Name: ${draft.fullName || '—'}`,
      `Travelling as: ${tt}`,
      `Season / period: ${sn}`,
      `Party size: ${draft.partySize}`,
    ]
    return lines.join('\n')
  }, [copy, draft.fullName, draft.partySize, travellerType, season])

  const selectedContact = selectedContactIndex !== null ? contactOptions[selectedContactIndex] : undefined
  const waHref = useMemo(() => {
    if (!selectedContact || selectedContact.type !== 'whatsapp') return '#'
    const num = effectiveWhatsappNumber(selectedContact.whatsappNumber, waNumber)
    return buildWaMeLink(num, waText)
  }, [selectedContact, waNumber, waText])

  useLayoutEffect(() => {
    dialogRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    if (step !== 3 || emailThanks) return
    const root = dialogRef.current
    if (!root) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return
      if (selectedContactIndex !== null) return
      const t = e.target as HTMLElement | null
      if (!t || !root.contains(t)) return
      if (e.defaultPrevented) return
      if (t.closest('.ecotone-book-back')) return
      if (t.closest('.ecotone-book-channel')) return
      if (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT') return
      e.preventDefault()
      setContactErr(v.contactRequired)
      queueMicrotask(() => firstChannelRef.current?.focus())
    }
    root.addEventListener('keydown', onKey)
    return () => root.removeEventListener('keydown', onKey)
  }, [step, emailThanks, selectedContactIndex, v.contactRequired])

  const bumpParty = (delta: number) => {
    setPartySize((n) => Math.min(99, Math.max(1, n + delta)))
    setStep2Err((prev) => ({ ...prev, people: '' }))
  }

  const goNext = useCallback(() => {
    if (step === 1) {
      const nameE = !draft.fullName ? v.nameRequired : ''
      const travE = travellerType === null ? v.travellerTypeRequired : ''
      setStep1Err({ name: nameE, traveller: travE })
      if (nameE || travE) {
        queueMicrotask(() => (nameE ? nameRef.current : firstTravellerRef.current)?.focus())
        return
      }
      setStep(2)
      return
    }
    if (step === 2) {
      const seasonE = season === null ? v.seasonRequired : ''
      const peopleE = partySize < 1 ? v.peopleMinRequired : ''
      setStep2Err({ season: seasonE, people: peopleE })
      if (seasonE || peopleE) {
        queueMicrotask(() => (seasonE ? firstSeasonRef.current : null)?.focus())
        return
      }
      setStep(3)
    }
  }, [step, draft.fullName, travellerType, season, partySize, v])

  const goBack = useCallback(() => {
    setEmailThanks(false)
    setEmailErr('')
    setContactErr('')
    if (step === 3) {
      setSelectedContactIndex(null)
      setStep(2)
      return
    }
    setStep((s) => Math.max(1, s - 1))
  }, [step])

  const submitEmail = useCallback(() => {
    const trimmed = email.trim()
    if (!trimmed) {
      setEmailErr(v.emailRequired)
      queueMicrotask(() => emailRef.current?.focus())
      return
    }
    if (!EMAIL_OK.test(trimmed)) {
      setEmailErr(copy.emailInvalidMessage)
      queueMicrotask(() => emailRef.current?.focus())
      return
    }
    submitEnquiryInBackground({
      kind: 'plan_journey',
      fullName: draft.fullName,
      travellerType,
      travellerTypeTitle: travellerType ? travellerTitle(travellerType) : null,
      season,
      seasonLine: season ? seasonLine(season) : null,
      partySize,
      contactChannel: 'email',
      email: trimmed,
      emailMessage: emailMessage.trim(),
    })
    setEmailErr('')
    setEmailThanks(true)
  }, [
    email,
    emailMessage,
    copy.emailInvalidMessage,
    v.emailRequired,
    draft.fullName,
    travellerType,
    season,
    partySize,
    travellerTitle,
    seasonLine,
  ])

  const segClass = (i: number) => {
    const idx = step - 1
    if (i < idx) return 'ecotone-book-step-seg done'
    if (i === idx) return 'ecotone-book-step-seg active'
    return 'ecotone-book-step-seg'
  }

  const st = step - 1

  const peopleSuffix = partySize === 1 ? copy.step2.peopleField.singularLabel : copy.step2.peopleField.pluralLabel

  const handleWaClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!draft.fullName || travellerType === null || season === null || partySize < 1 || selectedContact?.type !== 'whatsapp') {
      e.preventDefault()
    }
  }

  return (
    <div
      className="ecotone-book-overlay"
      role="presentation"
      onMouseDown={(ev) => {
        if (ev.target === ev.currentTarget) onClose()
      }}
    >
      <div ref={dialogRef} className="ecotone-book-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <button type="button" className="ecotone-book-close" onClick={onClose} aria-label={copy.closeLabel}>
          ×
        </button>

        <div className="ecotone-book-head">
          <h2 className="ecotone-book-title" id={titleId}>
            {st === 0 ? copy.step1.title : st === 1 ? copy.step2.title : copy.step3.title}
          </h2>
          <p className="ecotone-book-plan-subtitle">{st === 0 ? copy.step1.subtitle : st === 1 ? copy.step2.subtitle : copy.step3.subtitle}</p>
        </div>

        <div className="ecotone-book-body">
          <div className="ecotone-book-steps" aria-hidden>
            {[0, 1, 2].map((i) => (
              <div key={i} className={segClass(i)} />
            ))}
          </div>

          {step === 1 ? (
            <>
              <div className={'ecotone-book-field' + (step1Err.name ? ' ecotone-book-field--error' : '')}>
                <label className="ecotone-book-label" htmlFor="pj-name">
                  {copy.step1.nameField.label}
                </label>
                <input
                  ref={nameRef}
                  id="pj-name"
                  autoComplete="given-name"
                  placeholder={copy.step1.nameField.placeholder}
                  value={name}
                  aria-invalid={!!step1Err.name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setStep1Err((prev) => ({ ...prev, name: '' }))
                  }}
                />
                {step1Err.name ? <div className="ecotone-book-err">{step1Err.name}</div> : null}
              </div>
              <div className="ecotone-book-label">{copy.step1.optionsField.label}</div>
              <div className={'ecotone-book-card-grid' + (step1Err.traveller ? ' ecotone-book-card-grid--error' : '')}>
                {copy.step1.optionsField.options.map((c, i) => (
                  <button
                    key={c.valueKey}
                    ref={i === 0 ? firstTravellerRef : undefined}
                    type="button"
                    className={'ecotone-book-pick-card' + (travellerType === c.valueKey ? ' on' : '')}
                    onClick={() => {
                      setTravellerType(c.valueKey)
                      setStep1Err((prev) => ({ ...prev, traveller: '' }))
                    }}
                  >
                    <TravellerSvg iconKey={c.iconKey} />
                    <span className="ecotone-book-pick-card-title">{c.title}</span>
                    <span className="ecotone-book-pick-card-desc">{c.subtitle}</span>
                  </button>
                ))}
              </div>
              {step1Err.traveller ? <div className="ecotone-book-err">{step1Err.traveller}</div> : null}
              <div className="ecotone-book-continue-row">
                <button type="button" className="ecotone-book-continue-only" onClick={goNext}>
                  {copy.step2.forwardCtaLabel} <span aria-hidden>›</span>
                </button>
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <div className="ecotone-book-label">{copy.step2.seasonField.label}</div>
              <div className={'ecotone-book-season-row' + (step2Err.season ? ' ecotone-book-season-row--error' : '')}>
                {copy.step2.seasonField.options.map((c, i) => (
                  <button
                    key={c.valueKey}
                    ref={i === 0 ? firstSeasonRef : undefined}
                    type="button"
                    className={'ecotone-book-season-card' + (season === c.valueKey ? ' on' : '')}
                    onClick={() => {
                      setSeason(c.valueKey)
                      setStep2Err((prev) => ({ ...prev, season: '' }))
                    }}
                  >
                    <span className="t1">{c.title}</span>
                    <span className="t2">{c.subtitle}</span>
                  </button>
                ))}
              </div>
              {step2Err.season ? <div className="ecotone-book-err">{step2Err.season}</div> : null}
              <div className="ecotone-book-rule" aria-hidden />
              <div className="ecotone-book-label">{copy.step2.peopleField.label}</div>
              <div className={'ecotone-book-counter' + (step2Err.people ? ' ecotone-book-counter--error' : '')}>
                <button type="button" className="ecotone-book-counter-btn" aria-label="Decrease" onClick={() => bumpParty(-1)} disabled={partySize <= 1}>
                  −
                </button>
                <span className="ecotone-book-counter-val">{partySize}</span>
                <button type="button" className="ecotone-book-counter-btn" aria-label="Increase" onClick={() => bumpParty(1)} disabled={partySize >= 99}>
                  +
                </button>
                <span className="ecotone-book-counter-suffix">{peopleSuffix}</span>
              </div>
              {step2Err.people ? <div className="ecotone-book-err">{step2Err.people}</div> : null}
              <div className="ecotone-book-footer">
                <div className="ecotone-book-footer-row">
                  <button type="button" className="ecotone-book-back" onClick={goBack}>
                    {backLabel(copy.step2.backCtaLabel)}
                  </button>
                  <button type="button" className="ecotone-book-continue-only ecotone-book-cta-grow" onClick={goNext}>
                    {copy.step2.forwardCtaLabel} <span aria-hidden>›</span>
                  </button>
                </div>
              </div>
            </>
          ) : null}

          {step === 3 ? (
            emailThanks ? (
              <div className="ecotone-book-thanks" role="status">
                <div className="ecotone-book-thanks-title">{copy.finalStep.title}</div>
                <p className="ecotone-book-thanks-lead">{copy.finalStep.subtitle}</p>
                {copy.finalStep.summaryTitle ? <p className="ecotone-book-thanks-lead" style={{ fontWeight: 600 }}>{copy.finalStep.summaryTitle}</p> : null}
                <div className="ecotone-book-summary">
                  <div className="ecotone-book-summary-row">
                    <span className="ecotone-book-summary-k">{copy.finalStep.summaryFields.nameLabel}</span>
                    <span className="ecotone-book-summary-v">{draft.fullName || '—'}</span>
                  </div>
                  <div className="ecotone-book-summary-row">
                    <span className="ecotone-book-summary-k">{copy.finalStep.summaryFields.travellerTypeLabel}</span>
                    <span className="ecotone-book-summary-v">{travellerType ? travellerTitle(travellerType) : '—'}</span>
                  </div>
                  <div className="ecotone-book-summary-row">
                    <span className="ecotone-book-summary-k">{copy.finalStep.summaryFields.seasonLabel}</span>
                    <span className="ecotone-book-summary-v">{season ? seasonLine(season) : '—'}</span>
                  </div>
                  <div className="ecotone-book-summary-row">
                    <span className="ecotone-book-summary-k">{copy.finalStep.summaryFields.peopleLabel}</span>
                    <span className="ecotone-book-summary-v">
                      {draft.partySize} {parseInt(draft.partySize, 10) === 1 ? copy.step2.peopleField.singularLabel : copy.step2.peopleField.pluralLabel}
                    </span>
                  </div>
                  <div className="ecotone-book-summary-row">
                    <span className="ecotone-book-summary-k">{copy.finalStep.summaryFields.contactViaLabel}</span>
                    <span className="ecotone-book-summary-v">Email</span>
                  </div>
                  {emailMessage.trim() ? (
                    <div className="ecotone-book-summary-row">
                      <span className="ecotone-book-summary-k">{copy.finalStep.summaryFields.noteLabel}</span>
                      <span className="ecotone-book-summary-v">{emailMessage.trim()}</span>
                    </div>
                  ) : null}
                </div>
                <button type="button" className="ecotone-book-close-thanks" onClick={onClose}>
                  {copy.finalStep.finalCtaLabel}
                </button>
              </div>
            ) : (
              <>
                <div className="ecotone-book-channel-label">{copy.step3.contactField.label}</div>
                <div
                  className={'ecotone-book-channel-grid' + (contactErr ? ' ecotone-book-channel-grid--error' : '')}
                  role="group"
                  aria-label={copy.step3.contactField.label}
                >
                  {contactOptions.map((opt, idx) => (
                    <button
                      key={`${opt.title}-${idx}`}
                      ref={idx === 0 ? firstChannelRef : undefined}
                      type="button"
                      className={'ecotone-book-channel' + (selectedContactIndex === idx ? ' on' : '')}
                      onClick={() => {
                        setSelectedContactIndex(idx)
                        setEmailErr('')
                        setContactErr('')
                      }}
                    >
                      <span className="ecotone-book-channel-ic" style={{ color: selectedContactIndex === idx ? '#fff' : undefined }}>
                        {opt.type === 'whatsapp' ? <WaGlyph /> : <MailGlyph />}
                      </span>
                      <span className="ecotone-book-channel-body">
                        <strong>{opt.title}</strong>
                        <span>{opt.subtitle}</span>
                      </span>
                    </button>
                  ))}
                </div>
                {contactErr ? <div className="ecotone-book-err">{contactErr}</div> : null}

                {selectedContact?.type === 'email' ? (
                  <div className="ecotone-book-email-expand">
                    <div className={'ecotone-book-field' + (emailErr ? ' ecotone-book-field--error' : '')}>
                      <label className="ecotone-book-label" htmlFor="pj-email">
                        {selectedContact.emailField.label}
                      </label>
                      <input
                        ref={emailRef}
                        id="pj-email"
                        type="email"
                        autoComplete="email"
                        placeholder={selectedContact.emailField.placeholder}
                        value={email}
                        aria-invalid={!!emailErr}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setEmailErr('')
                        }}
                      />
                      {emailErr ? <div className="ecotone-book-err">{emailErr}</div> : null}
                    </div>
                    <div className="ecotone-book-field">
                      <label className="ecotone-book-label" htmlFor="pj-msg">
                        {selectedContact.messageField.label}{' '}
                        <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>{selectedContact.messageField.helperText}</span>
                      </label>
                      <textarea
                        id="pj-msg"
                        placeholder={selectedContact.messageField.placeholder}
                        value={emailMessage}
                        onChange={(e) => setEmailMessage(e.target.value)}
                      />
                    </div>
                  </div>
                ) : null}

                <div className="ecotone-book-footer">
                  <div className="ecotone-book-footer-row">
                    <button type="button" className="ecotone-book-back" onClick={goBack}>
                      {backLabel(copy.step3.backCtaLabel)}
                    </button>
                    {selectedContact?.type === 'whatsapp' ? (
                      <a
                        className="ecotone-book-cta-wa ecotone-book-cta-grow"
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleWaClick}
                      >
                        <WaGlyph />
                        {selectedContact.ctaLabel}
                      </a>
                    ) : null}
                    {selectedContact?.type === 'email' ? (
                      <button type="button" className="ecotone-book-cta-dark ecotone-book-cta-grow" onClick={submitEmail}>
                        {selectedContact.ctaLabel}
                      </button>
                    ) : null}
                  </div>
                  {selectedContact ? <p className="ecotone-book-footer-note">{selectedContact.endMessage}</p> : null}
                </div>
              </>
            )
          ) : null}
        </div>
      </div>
    </div>
  )
}
