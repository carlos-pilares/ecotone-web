/** GROQ projection for Experience KC flexible itinerary fields. */
export const GROQ_EXPERIENCE_ITINERARY_MODE_FIELDS = `
  itineraryMode,
  programmeFlow {
    eyebrow,
    title,
    intro,
    phases[] {
      _key,
      title,
      subtitle,
      body,
      durationLabel,
      accommodation,
      image,
      "imageUrl": image.asset->url
    }
  },
  typicalDay {
    eyebrow,
    title,
    intro,
    rows[] {
      _key,
      timeLabel,
      title,
      body
    }
  },
  hybridSummaryIntro,
  durationOptions[] {
    _key,
    label,
    durationDetail,
    shortBreakdown,
    price,
    startDates,
    enabled
  },
`
