type ManuVolunteerPhotoCreditProps = {
  credit: string
  className?: string
}

/**
 * Subtle photographer credit for campaign photography.
 * Accessible text — not metadata-only.
 */
export function ManuVolunteerPhotoCredit({ credit, className }: ManuVolunteerPhotoCreditProps) {
  return (
    <p className={['mcv-photo-credit', className].filter(Boolean).join(' ')}>{credit}</p>
  )
}
