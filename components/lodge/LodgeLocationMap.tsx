import type { LodgeLocationMapDiagramLabels } from '@/data/lodgeSoqtapataStatic'

type LodgeLocationMapProps = {
  labels: LodgeLocationMapDiagramLabels
}

/** Ilustración mapa — textos desde `resolved.location.mapLabels` (CMS vía merge / fallback estático). */
export function LodgeLocationMap({ labels }: LodgeLocationMapProps) {
  return (
    <svg
      width="100%"
      height="180"
      viewBox="0 0 600 180"
      className="lodge-location-map-svg"
      aria-hidden
    >
      <path d="M0 90 Q150 60 300 80 Q450 100 600 75" fill="none" stroke="rgba(40,80,20,.2)" strokeWidth="2" />
      <path d="M0 70 Q150 40 300 60 Q450 80 600 55" fill="none" stroke="rgba(40,80,20,.15)" strokeWidth="1.5" />
      <path d="M0 110 Q150 80 300 100 Q450 120 600 95" fill="none" stroke="rgba(40,80,20,.15)" strokeWidth="1.5" />
      <path d="M0 130 Q150 100 300 120 Q450 140 600 115" fill="none" stroke="rgba(40,80,20,.12)" strokeWidth="1" />
      <path d="M0 50 Q150 20 300 40 Q450 60 600 35" fill="none" stroke="rgba(40,80,20,.1)" strokeWidth="1" />
      <path
        d="M80 90 Q200 78 320 85"
        fill="none"
        stroke="var(--brown-dk)"
        strokeWidth="3"
        strokeDasharray="10 5"
        opacity="0.6"
      />
      <circle cx="80" cy="90" r="6" fill="var(--brown)" opacity="0.8" />
      <text x="94" y="89" fontSize="12" fill="var(--brown-xdk)" fontFamily="var(--f),system-ui,sans-serif" fontWeight="600">
        {labels.cuscoTitle}
      </text>
      <text x="94" y="102" fontSize="10" fill="var(--brown)" fontFamily="var(--f),system-ui,sans-serif">
        {labels.cuscoSubtitle}
      </text>
      <circle cx="320" cy="85" r="4" fill="var(--brown-dk)" opacity="0.7" />
      <text x="330" y="83" fontSize="10" fill="var(--brown-dk)" fontFamily="var(--f),system-ui,sans-serif">
        {labels.trailheadLabel}
      </text>
      <path
        d="M320 85 Q370 75 430 70"
        fill="none"
        stroke="var(--brown)"
        strokeWidth="2.5"
        strokeDasharray="5 4"
        opacity="0.8"
      />
      <circle cx="430" cy="70" r="9" fill="var(--brown)" />
      <circle cx="430" cy="70" r="16" fill="none" stroke="var(--brown)" strokeWidth="1.5" opacity="0.3" />
      <text x="449" y="68" fontSize="12" fill="var(--brown-xdk)" fontFamily="var(--f),system-ui,sans-serif" fontWeight="700">
        {labels.lodgeTitle}
      </text>
      <text x="449" y="82" fontSize="10" fill="var(--brown)" fontFamily="var(--f),system-ui,sans-serif">
        {labels.lodgeSubtitle}
      </text>
      <text x="340" y="65" fontSize="10" fill="var(--brown-dk)" fontFamily="var(--f),system-ui,sans-serif" opacity="0.8">
        {labels.walkHint}
      </text>
    </svg>
  )
}
