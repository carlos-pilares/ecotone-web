'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from 'react'

import type { ExperienceBookingSummary } from '@/components/booking/types'
import type { ExperienceModalCopy } from '@/lib/bookingModalCopy'
import { effectiveWhatsappNumber } from '@/lib/bookingModalCopy'
import { buildWaMeLink } from '@/lib/bookingWhatsapp'

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Props = {
  waNumber: string
  copy: ExperienceModalCopy
  summary: ExperienceBookingSummary
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

export function BookExperienceModal({ waNumber, copy, summary, onClose }: Props) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const dateRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const firstChannelRef = useRef<HTMLButtonElement>(null)

  const [name, setName] = useState('')
  const [approxDate, setApproxDate] = useState('')
  const [partySize, setPartySize] = useState(() => copy.peopleField.defaultNumber)
  const [selectedContactIndex, setSelectedContactIndex] = useState<number | null>(null)
  const [email, setEmail] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [emailErr, setEmailErr] = useState('')
  const [emailThanks, setEmailThanks] = useState(false)

  const [nameErr, setNameErr] = useState('')
  const [dateErr, setDateErr] = useState('')
  const [peopleErr, setPeopleErr] = useState('')
  const [contactErr, setContactErr] = useState('')

  const contactOptions = copy.contactField.options
  const v = copy.validation

  const waText = useMemo(() => {
    const lines = [
      `Hi Ecotone — I'd like to book: ${summary.experienceName}`,
      `Name: ${name.trim() || '—'}`,
      `Approx. travel date: ${approxDate.trim() || '—'}`,
      `Party size: ${partySize}`,
      `${summary.programType} · ${summary.route} · ${summary.duration}`,
      `Price shown: ${summary.priceLine}${summary.priceSub ? ` ${summary.priceSub}` : ''}`,
    ]
    return lines.join('\n')
  }, [summary, name, approxDate, partySize])

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
    if (emailThanks) return
    const root = dialogRef.current
    if (!root) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return
      if (selectedContactIndex !== null) return
      const t = e.target as HTMLElement | null
      if (!t || !root.contains(t)) return
      if (e.defaultPrevented) return
      if (t.closest('.ecotone-book-channel')) return
      if (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT') return
      e.preventDefault()
      setContactErr(v.contactRequired)
      queueMicrotask(() => firstChannelRef.current?.focus())
    }
    root.addEventListener('keydown', onKey)
    return () => root.removeEventListener('keydown', onKey)
  }, [emailThanks, selectedContactIndex, v.contactRequired])

  const bumpParty = (delta: number) => {
    setPartySize((n) => Math.min(99, Math.max(1, n + delta)))
    setPeopleErr('')
  }

  const focusFirstTextError = useCallback((errs: { name: boolean; date: boolean }) => {
    queueMicrotask(() => {
      if (errs.name) nameRef.current?.focus()
      else if (errs.date) dateRef.current?.focus()
    })
  }, [])

  const validateCore = useCallback(() => {
    const nameE = !name.trim() ? v.nameRequired : ''
    const dateE = !approxDate.trim() ? v.travelDateRequired : ''
    const peopleE = partySize < 1 ? v.peopleMinRequired : ''
    const contactE = selectedContactIndex === null ? v.contactRequired : ''
    setNameErr(nameE)
    setDateErr(dateE)
    setPeopleErr(peopleE)
    setContactErr(contactE)
    const ok = !nameE && !dateE && !peopleE && !contactE
    if (!ok) {
      if (contactE && !nameE && !dateE && !peopleE) {
        queueMicrotask(() => firstChannelRef.current?.focus())
      } else {
        focusFirstTextError({ name: !!nameE, date: !!dateE && !nameE })
      }
    }
    return ok
  }, [name, approxDate, partySize, selectedContactIndex, v, focusFirstTextError])

  const submitEmail = useCallback(() => {
    if (!validateCore()) return
    if (selectedContact?.type !== 'email') return
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
    setEmailErr('')
    setEmailThanks(true)
  }, [validateCore, selectedContact, email, copy.emailInvalidMessage, v.emailRequired])

  const handleWaClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!validateCore()) {
      e.preventDefault()
      return
    }
    if (selectedContact?.type !== 'whatsapp') {
      e.preventDefault()
    }
  }

  const bannerSub = `${summary.route} · ${summary.duration} · ${summary.programType}`
  const peopleSuffix = partySize === 1 ? copy.peopleField.singularLabel : copy.peopleField.pluralLabel

  return (
    <div
      className="ecotone-book-overlay"
      role="presentation"
      onMouseDown={(ev) => {
        if (ev.target === ev.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className="ecotone-book-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <button type="button" className="ecotone-book-close" onClick={onClose} aria-label={copy.closeLabel}>
          ×
        </button>

        <div className="ecotone-book-exp-banner">
          <div className="ecotone-book-exp-banner-thumb">
            <img src={summary.imageSrc} alt={summary.imageAlt ?? ''} />
          </div>
          <div className="ecotone-book-exp-banner-main">
            <div className="ecotone-book-exp-banner-title">{summary.experienceName}</div>
            <p className="ecotone-book-exp-banner-meta">{bannerSub}</p>
          </div>
          <div className="ecotone-book-exp-banner-price">
            <span className="ecotone-book-exp-banner-price-line">{summary.priceLine}</span>
            {summary.priceSub ? <span className="ecotone-book-exp-banner-price-sub">{summary.priceSub}</span> : null}
          </div>
        </div>

        <div className="ecotone-book-exp-intro">
          <h2 className="ecotone-book-title" id={titleId}>
            {copy.intro.title}
          </h2>
          <p className="ecotone-book-exp-subtitle">{copy.intro.subtitle}</p>
        </div>

        <div className="ecotone-book-body">
          {emailThanks ? (
            <div className="ecotone-book-thanks" role="status">
              <div className="ecotone-book-thanks-title">{copy.finalStep.title}</div>
              <p className="ecotone-book-thanks-lead">{copy.finalStep.subtitle}</p>
              {copy.finalStep.summaryTitle ? (
                <p className="ecotone-book-thanks-lead" style={{ fontWeight: 600 }}>
                  {copy.finalStep.summaryTitle}
                </p>
              ) : null}
              <div className="ecotone-book-summary">
                <div className="ecotone-book-summary-row">
                  <span className="ecotone-book-summary-k">{copy.finalStep.summaryFields.experienceLabel}</span>
                  <span className="ecotone-book-summary-v">{summary.experienceName}</span>
                </div>
                <div className="ecotone-book-summary-row">
                  <span className="ecotone-book-summary-k">{copy.finalStep.summaryFields.nameLabel}</span>
                  <span className="ecotone-book-summary-v">{name.trim() || '—'}</span>
                </div>
                <div className="ecotone-book-summary-row">
                  <span className="ecotone-book-summary-k">{copy.finalStep.summaryFields.dateLabel}</span>
                  <span className="ecotone-book-summary-v">{approxDate.trim() || '—'}</span>
                </div>
                <div className="ecotone-book-summary-row">
                  <span className="ecotone-book-summary-k">{copy.finalStep.summaryFields.peopleLabel}</span>
                  <span className="ecotone-book-summary-v">
                    {partySize} {peopleSuffix}
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
              <div className="ecotone-book-field-row-2">
                <div className={'ecotone-book-field' + (nameErr ? ' ecotone-book-field--error' : '')} style={{ marginBottom: 0 }}>
                  <label className="ecotone-book-label" htmlFor="be-name">
                    {copy.nameField.label}
                  </label>
                  <input
                    ref={nameRef}
                    id="be-name"
                    autoComplete="given-name"
                    placeholder={copy.nameField.placeholder}
                    value={name}
                    aria-invalid={!!nameErr}
                    onChange={(e) => {
                      setName(e.target.value)
                      setNameErr('')
                    }}
                  />
                  {nameErr ? <div className="ecotone-book-err">{nameErr}</div> : null}
                </div>
                <div className={'ecotone-book-field' + (dateErr ? ' ecotone-book-field--error' : '')} style={{ marginBottom: 0 }}>
                  <label className="ecotone-book-label" htmlFor="be-date">
                    {copy.travelDateField.label}
                  </label>
                  <input
                    ref={dateRef}
                    id="be-date"
                    type="text"
                    placeholder={copy.travelDateField.placeholder}
                    value={approxDate}
                    aria-invalid={!!dateErr}
                    onChange={(e) => {
                      setApproxDate(e.target.value)
                      setDateErr('')
                    }}
                  />
                  {dateErr ? <div className="ecotone-book-err">{dateErr}</div> : null}
                </div>
              </div>

              <div className="ecotone-book-label">{copy.peopleField.label}</div>
              <div className={'ecotone-book-counter' + (peopleErr ? ' ecotone-book-counter--error' : '')}>
                <button type="button" className="ecotone-book-counter-btn" aria-label="Decrease" onClick={() => bumpParty(-1)} disabled={partySize <= 1}>
                  −
                </button>
                <span className="ecotone-book-counter-val">{partySize}</span>
                <button type="button" className="ecotone-book-counter-btn" aria-label="Increase" onClick={() => bumpParty(1)} disabled={partySize >= 99}>
                  +
                </button>
                <span className="ecotone-book-counter-suffix">{peopleSuffix}</span>
              </div>
              {peopleErr ? <div className="ecotone-book-err">{peopleErr}</div> : null}

              <div className="ecotone-book-rule" aria-hidden />

              <div className="ecotone-book-channel-label">{copy.contactField.label}</div>
              <div
                className={'ecotone-book-channel-grid' + (contactErr ? ' ecotone-book-channel-grid--error' : '')}
                role="group"
                aria-label={copy.contactField.label}
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
              {contactErr && selectedContactIndex === null ? <div className="ecotone-book-err">{contactErr}</div> : null}

              {selectedContact?.type === 'email' ? (
                <div className="ecotone-book-email-expand">
                  <div className={'ecotone-book-field' + (emailErr ? ' ecotone-book-field--error' : '')}>
                    <label className="ecotone-book-label" htmlFor="be-email">
                      {selectedContact.emailField.label}
                    </label>
                    <input
                      ref={emailRef}
                      id="be-email"
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
                    <label className="ecotone-book-label" htmlFor="be-msg">
                      {selectedContact.messageField.label}{' '}
                      <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>{selectedContact.messageField.helperText}</span>
                    </label>
                    <textarea
                      id="be-msg"
                      placeholder={selectedContact.messageField.placeholder}
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                    />
                  </div>
                </div>
              ) : null}

              <div className="ecotone-book-footer">
                {selectedContact?.type === 'whatsapp' ? (
                  <>
                    <a
                      className="ecotone-book-cta-wa"
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ width: '100%' }}
                      onClick={handleWaClick}
                    >
                      <WaGlyph />
                      {selectedContact.ctaLabel}
                    </a>
                    <p className="ecotone-book-footer-note">{selectedContact.endMessage}</p>
                  </>
                ) : null}
                {selectedContact?.type === 'email' ? (
                  <>
                    <button type="button" className="ecotone-book-cta-dark" style={{ width: '100%' }} onClick={submitEmail}>
                      {selectedContact.ctaLabel}
                    </button>
                    <p className="ecotone-book-footer-note">{selectedContact.endMessage}</p>
                  </>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
