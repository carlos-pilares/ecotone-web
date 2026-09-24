'use client'

import { useId, useState } from 'react'

import { EcotoneImage } from '@/components/media/EcotoneImage'
import type { AboutPageResolved } from '@/lib/resolveAboutPageData'

type PeopleData = AboutPageResolved['people']
type Person = PeopleData['members'][number]

/**
 * Existing About People section.
 * Optional `initialVisible` enables View more people / Show less when members exceed that count.
 * Default (omit / undefined) shows everyone — same as production behaviour.
 */
export function AboutPeople({
  data,
  initialVisible,
}: {
  data: PeopleData
  initialVisible?: number
}) {
  const panelId = useId()
  const [expanded, setExpanded] = useState(false)
  const limit = initialVisible && initialVisible > 0 ? initialVisible : null
  const canExpand = limit != null && data.members.length > limit
  const visible =
    !canExpand || expanded ? data.members : data.members.slice(0, limit)

  return (
    <section className="content-section bg-parch fade" id={data.sectionId}>
      <div className="content-inner">
        <div className="eyebrow">{data.eyebrow}</div>
        <h2 className="h2">{data.headline}</h2>
        <p className="body people-intro">{data.intro}</p>
        <div
          className={`people-grid${expanded && canExpand ? ' people-grid--expanded' : ''}`}
          id={panelId}
        >
          {visible.map((m, i) => (
            <PersonCard
              key={m.key}
              person={m}
              reveal={canExpand && expanded && limit != null && i >= limit}
            />
          ))}
        </div>
        {canExpand ? (
          <div className="people-expand">
            <button
              type="button"
              className="people-expand-btn"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? 'Show less ↑' : 'View more people ↓'}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )
}

function PersonCard({ person, reveal }: { person: Person; reveal?: boolean }) {
  const linkedin = person.linkedinUrl?.trim()

  return (
    <article className={`person-card${reveal ? ' person-card--reveal' : ''}`}>
      <div className="person-img">
        <EcotoneImage
          image={person.image.image}
          fallbackUrl={person.image.fallbackUrl || person.imageUrl}
          masterWidth={person.image.masterWidth}
          masterHeight={person.image.masterHeight}
          role="portrait"
          alt={person.imageAlt}
          loading="lazy"
        />
      </div>
      <div className="person-body">
        <div className="person-name">{person.name}</div>
        <div className="person-role">{person.role}</div>
        {person.affiliation?.trim() ? (
          <div className="person-affiliation">{person.affiliation.trim()}</div>
        ) : null}
        <p className="person-bio">{person.bio}</p>
        <div className="person-linkedin-slot">
          {linkedin ? (
            <a
              href={linkedin}
              className="person-linkedin"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn ↗
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}
