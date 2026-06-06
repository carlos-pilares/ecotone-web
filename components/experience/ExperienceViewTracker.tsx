'use client'

import { useEffect } from 'react'

import { trackExperienceView, type ExperienceAnalyticsFields } from '@/lib/trackExperienceAnalytics'

type Props = ExperienceAnalyticsFields

/** Fires GA4 `experience_view` once when an experience landing page mounts. */
export function ExperienceViewTracker(props: Props) {
  useEffect(() => {
    trackExperienceView(props)
  }, [props.experience_name, props.experience_slug, props.route, props.program_type])

  return null
}
