'use client'

import { useId, useRef, useState, type FormEvent } from 'react'

import { trackMcvOtherDatesSubmit } from '@/lib/trackMcvAnalytics'

export type ManuVolunteerOtherDatesFormProps = {
  leadId?: string
}

async function updateOtherDates(
  leadId: string,
  travelDate: string,
  message: string,
): Promise<boolean> {
  const res = await fetch('/api/enquiry/update-other-dates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leadId, travelDate, message }),
  })
  if (!res.ok) return false
  const data = (await res.json()) as { ok?: boolean }
  return data.ok === true
}

export function ManuVolunteerOtherDatesForm({ leadId }: ManuVolunteerOtherDatesFormProps) {
  const preferredId = useId()
  const messageId = useId()
  const [preferredDates, setPreferredDates] = useState('')
  const [message, setMessage] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)
  const submitTrackedRef = useRef(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    const travelDate = preferredDates.trim()
    if (!travelDate) {
      setFieldError('Please enter your preferred dates.')
      setSubmitError('')
      setSaved(false)
      return
    }

    if (!leadId?.trim()) {
      setFieldError('')
      setSubmitError('Your preferred dates could not be saved because this session is missing a lead ID.')
      setSaved(false)
      return
    }

    setFieldError('')
    setSubmitError('')
    setIsSubmitting(true)

    try {
      const ok = await updateOtherDates(leadId.trim(), travelDate, message.trim())
      if (!ok) {
        setSubmitError('We couldn’t save your preferred dates. Please try again.')
        setSaved(false)
        return
      }
      if (!submitTrackedRef.current) {
        submitTrackedRef.current = true
        trackMcvOtherDatesSubmit()
      }
      setSaved(true)
    } catch {
      setSubmitError('We couldn’t save your preferred dates. Please try again.')
      setSaved(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="mcv-result-other-form" onSubmit={onSubmit} noValidate>
      <div className="mcv-result-other-form__field">
        <label className="mcv-result-other-form__label" htmlFor={preferredId}>
          Preferred dates
          <span className="mcv-result-other-form__required" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id={preferredId}
          className="mcv-result-other-form__input"
          type="text"
          name="preferredDates"
          autoComplete="off"
          placeholder="e.g. 10 March – 7 April 2027"
          value={preferredDates}
          disabled={isSubmitting}
          aria-invalid={Boolean(fieldError)}
          aria-describedby={fieldError ? `${preferredId}-error` : undefined}
          onChange={(event) => {
            setPreferredDates(event.target.value)
            if (fieldError) setFieldError('')
            if (saved) setSaved(false)
          }}
        />
        {fieldError ? (
          <p id={`${preferredId}-error`} className="mcv-result-other-form__error" role="alert">
            {fieldError}
          </p>
        ) : null}
      </div>

      <div className="mcv-result-other-form__field">
        <label className="mcv-result-other-form__label" htmlFor={messageId}>
          Message
          <span className="mcv-result-other-form__optional">Optional</span>
        </label>
        <textarea
          id={messageId}
          className="mcv-result-other-form__textarea"
          name="message"
          rows={3}
          placeholder="Anything we should know about your timing or flexibility?"
          value={message}
          disabled={isSubmitting}
          onChange={(event) => {
            setMessage(event.target.value)
            if (saved) setSaved(false)
          }}
        />
      </div>

      <button
        type="submit"
        className="mcv-cta mcv-cta--prominent mcv-result-continue__cta"
        disabled={isSubmitting}
        aria-disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving…' : 'Send my preferred dates'}
      </button>

      <p className="mcv-result-continue__note">
        Standard rate applies. Availability must be confirmed before any booking can proceed.
      </p>

      {saved ? (
        <p className="mcv-result-other-form__success" role="status">
          Thanks — we’ve saved your preferred dates.
        </p>
      ) : null}

      {submitError ? (
        <p className="mcv-result-continue__error" role="alert">
          {submitError}{' '}
          <button type="submit" className="mcv-result-continue__retry" disabled={isSubmitting}>
            Retry
          </button>
        </p>
      ) : null}
    </form>
  )
}
