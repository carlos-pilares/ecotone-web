'use client'

import type { FormEvent } from 'react'

import { useWonderCampaign } from './WonderCampaignContext'

export function WonderTravelFitModal() {
  const { isModalOpen, closeModal } = useWonderCampaign()

  if (!isModalOpen) return null

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <div className="wbtw-modal-root" role="presentation" onMouseDown={closeModal}>
      <div
        className="wbtw-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wbtw-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button type="button" className="wbtw-modal-close" onClick={closeModal} aria-label="Close">
          ×
        </button>
        <p className="wbtw-eyebrow wbtw-modal-eyebrow">Travel fit</p>
        <h2 id="wbtw-modal-title" className="wbtw-modal-title">
          Check my travel fit
        </h2>
        <p className="wbtw-modal-subtitle">
          Tell us a little about your Peru plans so our team can recommend the right Ecotone Experience.
        </p>
        <form className="wbtw-form wbtw-modal-form" onSubmit={onSubmit} noValidate>
          <label className="wbtw-field">
            <span className="wbtw-field-label">Full name</span>
            <input type="text" name="fullName" autoComplete="name" placeholder="Your name" />
          </label>
          <label className="wbtw-field">
            <span className="wbtw-field-label">Email address</span>
            <input type="email" name="email" autoComplete="email" placeholder="you@email.com" />
          </label>
          <label className="wbtw-field">
            <span className="wbtw-field-label">Country</span>
            <input type="text" name="country" autoComplete="country-name" placeholder="Where you live" />
          </label>
          <label className="wbtw-field">
            <span className="wbtw-field-label">When are you planning to travel?</span>
            <input type="text" name="travelWhen" placeholder="e.g. June 2026" />
          </label>
          <button type="submit" className="wbtw-cta wbtw-cta--primary wbtw-modal-submit">
            Check my travel fit
          </button>
        </form>
        <p className="wbtw-small-note wbtw-modal-note">
          No commitment required. We&apos;ll only use your answers to follow up with relevant options.
        </p>
      </div>
    </div>
  )
}
