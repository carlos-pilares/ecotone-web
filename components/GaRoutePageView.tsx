'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { trackRoutePageView } from '@/lib/gaPageView'

/**
 * Sends one GA4 page_view per real document route (Next.js pathname change).
 * Ignores modal History API query updates because pathname is unchanged.
 */
export function GaRoutePageView() {
  const pathname = usePathname() ?? '/'
  const trackedPathRef = useRef<string | null>(null)

  useEffect(() => {
    if (trackedPathRef.current === pathname) return
    trackedPathRef.current = pathname
    trackRoutePageView(pathname)
  }, [pathname])

  return null
}
