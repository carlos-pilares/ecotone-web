'use client'

import { useState } from 'react'

import { IconClipboard } from './WonderIcons'

type Props = {
  code: string
  className?: string
  label?: string
}

export function WonderCopyCodeButton({ code, className = '', label = 'Copy code' }: Props) {
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
      className={`wbtw-cta wbtw-cta--nav wbtw-result-copy ${className}`.trim()}
      onClick={(e) => {
        e.stopPropagation()
        void copyCode()
      }}
    >
      <IconClipboard className="wbtw-result-copy-icon" />
      {copied ? 'Copied' : label}
    </button>
  )
}
