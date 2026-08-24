'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

type ManuVolunteerMobileHScrollRailProps = {
  children: ReactNode
  className?: string
  controlsLabel: string
}

function ChevronIcon({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <svg
      className="mcv-hscroll-btn-icon"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
      <path
        d={direction === 'prev' ? 'M12.5 15L7.5 10L12.5 5' : 'M7.5 5L12.5 10L7.5 15'}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ManuVolunteerMobileHScrollRail({
  children,
  className,
  controlsLabel,
}: ManuVolunteerMobileHScrollRailProps) {
  const railRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const getScrollEl = useCallback(() => {
    return railRef.current?.querySelector<HTMLElement>('.mcv-mobile-hscroll') ?? null
  }, [])

  const updateButtons = useCallback(() => {
    const el = getScrollEl()
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 2)
    setCanNext(maxScroll > 2 && el.scrollLeft < maxScroll - 2)
  }, [getScrollEl])

  useEffect(() => {
    const el = getScrollEl()
    if (!el) return

    updateButtons()
    el.addEventListener('scroll', updateButtons, { passive: true })
    const ro = new ResizeObserver(updateButtons)
    ro.observe(el)
    if (el.firstElementChild) ro.observe(el.firstElementChild)

    return () => {
      el.removeEventListener('scroll', updateButtons)
      ro.disconnect()
    }
  }, [getScrollEl, updateButtons])

  const scrollStep = (direction: 'prev' | 'next') => {
    const el = getScrollEl()
    if (!el) return
    const card = el.querySelector('li')
    if (!card) return
    const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap) || 12
    const step = card.getBoundingClientRect().width + gap
    el.scrollBy({ left: direction === 'next' ? step : -step, behavior: 'smooth' })
  }

  return (
    <div className={['mcv-hscroll-rail', className].filter(Boolean).join(' ')} ref={railRef}>
      {children}
      <div className="mcv-hscroll-controls" role="group" aria-label={`${controlsLabel} navigation`}>
        <button
          type="button"
          className="mcv-hscroll-btn"
          aria-label="Show previous card"
          disabled={!canPrev}
          onClick={() => scrollStep('prev')}
        >
          <ChevronIcon direction="prev" />
        </button>
        <button
          type="button"
          className="mcv-hscroll-btn"
          aria-label="Show next card"
          disabled={!canNext}
          onClick={() => scrollStep('next')}
        >
          <ChevronIcon direction="next" />
        </button>
      </div>
    </div>
  )
}
