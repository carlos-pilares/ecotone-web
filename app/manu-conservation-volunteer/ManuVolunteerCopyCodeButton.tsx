'use client'

import { useState } from 'react'

type Props = {
  code: string
  className?: string
  label?: string
}

export function ManuVolunteerCopyCodeButton({
  code,
  className = '',
  label = 'Copy',
}: Props) {
  const [copied, setCopied] = useState(false)

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      return
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button
      type="button"
      className={`mcv-cta mcv-cta--nav mcv-result-copy ${className}`.trim()}
      onClick={(e) => {
        e.stopPropagation()
        void copyCode()
      }}
    >
      <svg className="mcv-result-copy-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M9 4V3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M9 11h6M9 15h4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      {copied ? 'Copied' : label}
    </button>
  )
}
