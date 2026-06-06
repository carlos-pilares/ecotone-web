import type { ExperienceLearningOutcome } from '@/lib/experienceLearningTypes'
import type { LearningOutcomeIcon } from '@/lib/learningOutcomeIcons'

function OutcomeIcon({ icon }: { icon: LearningOutcomeIcon }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    'aria-hidden': true as const,
  }

  switch (icon) {
    case 'research':
      return (
        <svg {...common}>
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      )
    case 'wildlife':
      return (
        <svg {...common}>
          <path d="M12 3c-2 3-6 4-6 9a6 6 0 0 0 12 0c0-5-4-6-6-9z" />
          <path d="M8 14c-1.5 1-2 3-2 4h12c0-1-.5-3-2-4" />
        </svg>
      )
    case 'conservation':
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    case 'community':
      return (
        <svg {...common}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    case 'leadership':
      return (
        <svg {...common}>
          <path d="M12 2l2.4 4.8 5.4.8-3.9 3.8.9 5.3L12 14.8 7.2 16.7l.9-5.3L4.2 7.6l5.4-.8L12 2z" />
        </svg>
      )
    case 'teamwork':
      return (
        <svg {...common}>
          <circle cx="9" cy="7" r="3" />
          <circle cx="17" cy="8" r="2.5" />
          <path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" />
          <path d="M16 20v-1a3.5 3.5 0 0 0-2.8-3.4" />
        </svg>
      )
    case 'data':
      return (
        <svg {...common}>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      )
    case 'communication':
      return (
        <svg {...common}>
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
      )
    case 'career':
      return (
        <svg {...common}>
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        </svg>
      )
    case 'fieldwork':
      return (
        <svg {...common}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    default: {
      const _exhaustive: never = icon
      return _exhaustive
    }
  }
}

export function ExperienceLearningOutcomes({ outcomes }: { outcomes: ExperienceLearningOutcome[] }) {
  if (!outcomes.length) return null

  return (
    <section className="content-section fade exp-learning-outcomes-section" id="outcomes">
      <div className="content-inner">
        <div className="eyebrow">Learning outcomes</div>
        <h2 className="h2">What you take away</h2>
        <p className="exp-learning-lead exp-learning-outcomes__intro">
          Practical skills and conservation literacy — grounded in real fieldwork, not classroom theory.
        </p>
        <div className="exp-learning-outcomes" role="list">
          {outcomes.map((outcome) => (
            <article key={outcome.id} className="exp-learning-outcome" role="listitem">
              <div className="exp-learning-outcome__icon">
                <OutcomeIcon icon={outcome.icon} />
              </div>
              <div className="exp-learning-outcome__body">
                <h3 className="exp-learning-outcome__title">{outcome.title}</h3>
                <p className="exp-learning-outcome__desc">{outcome.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
