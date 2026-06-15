/**
 * Limits review picks on `experiencePage.reviewsSection` to reviews linked to the page's KC.
 */
export function experiencePageReviewReferenceFilter({document}) {
  const expRef = document?.experience?._ref
  const lpRef = document?.learningProgramme?._ref

  if (expRef && lpRef) {
    return {
      filter: '_type == "review" && (experience._ref == $expRef || learningProgramme._ref == $lpRef)',
      params: {expRef, lpRef},
    }
  }
  if (expRef) {
    return {
      filter: '_type == "review" && experience._ref == $expRef',
      params: {expRef},
    }
  }
  if (lpRef) {
    return {
      filter: '_type == "review" && learningProgramme._ref == $lpRef',
      params: {lpRef},
    }
  }
  return {filter: '_type == "review"'}
}

export const experiencePageReviewReferenceOptions = {
  filter: experiencePageReviewReferenceFilter,
}
