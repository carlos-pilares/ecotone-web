/** Display label for WBTW modal party-size selection (`travellers` form value). */
export function formatWbtwPartySizeLabel(partySize: string): string {
  switch (partySize) {
    case '1':
      return '1 traveller'
    case '2':
      return '2 travellers'
    case '3–4':
      return '3–4 travellers'
    case '5+':
      return '5+ travellers'
    default:
      return partySize.includes('traveller') ? partySize : `${partySize} travellers`
  }
}

/** Hero / offer context line, e.g. "November 2026 · 3–4 travellers". */
export function formatWbtwTripContext(travelTiming: string, partySize: string): string {
  return `${travelTiming} · ${formatWbtwPartySizeLabel(partySize)}`
}
