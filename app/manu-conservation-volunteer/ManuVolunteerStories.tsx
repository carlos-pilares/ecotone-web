import { WonderJourneyCardImage } from '../wonder-beyond-the-wonder/WonderResponsiveImage'

import {
  MCV_TRIPADVISOR_EXCERPTS,
  MCV_TRIPADVISOR_PROFILE_URL,
  MCV_VOLUNTEER_STORIES,
  type McvVolunteerStory,
} from './manu-volunteer-images'

const TA_LOGO_SRC = '/manu-conservation-volunteer/brand/tripadvisor-lockup.svg'

function QuoteMark({ className = 'mcv-story-quote-mark' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 36" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M10.2 36C4.4 36 0 31.4 0 24.8 0 14.2 7.2 5.2 20.2 0l3.2 5.4C15.6 8.2 12 13 12 19.2h8.4V36H10.2Zm25.4 0C29.8 36 25.4 31.4 25.4 24.8 25.4 14.2 32.6 5.2 45.6 0L48.8 5.4C41 8.2 37.4 13 37.4 19.2H45.8V36H35.6Z"
      />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg className="mcv-ta-strip-external" viewBox="0 0 16 16" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M9.5 2a.75.75 0 0 0 0 1.5h2.19L6.22 8.97a.75.75 0 1 0 1.06 1.06l5.47-5.47V6.5a.75.75 0 0 0 1.5 0V2.75A.75.75 0 0 0 13.5 2H9.5ZM3.75 4A1.75 1.75 0 0 0 2 5.75v6.5C2 13.216 2.784 14 3.75 14h6.5A1.75 1.75 0 0 0 12 12.25V9.5a.75.75 0 0 0-1.5 0v2.75a.25.25 0 0 1-.25.25h-6.5a.25.25 0 0 1-.25-.25v-6.5a.25.25 0 0 1 .25-.25H6.5a.75.75 0 0 0 0-1.5H3.75Z"
      />
    </svg>
  )
}

/** TripAdvisor-style rating circles (4.5 / 5) — custom, not an embed. */
function TripadvisorRatingCircles() {
  return (
    <div className="mcv-ta-strip-circles" aria-label="4.5 out of 5 on TripAdvisor">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`mcv-ta-strip-circle${i < 4 ? ' is-full' : ' is-half'}`}
          aria-hidden
        />
      ))}
    </div>
  )
}

function StoryCopy({ story }: { story: McvVolunteerStory }) {
  return (
    <div className="mcv-story-copy">
      <QuoteMark />
      <blockquote className="mcv-story-quote">
        <p className="mcv-story-quote-headline">{story.quoteHeadline}</p>
        <p className="mcv-story-quote-body">{story.quoteBody}</p>
      </blockquote>
      <footer className="mcv-story-attribution">
        <cite className="mcv-story-name">{story.name}</cite>
        <p className="mcv-story-descriptor">{story.descriptor}</p>
      </footer>
    </div>
  )
}

function StoryMedia({
  story,
  sizes,
}: {
  story: McvVolunteerStory
  sizes: string
}) {
  return (
    <div className="mcv-story-media">
      <WonderJourneyCardImage image={story.image} className="mcv-story-img" sizes={sizes} />
    </div>
  )
}

function TripadvisorStrip() {
  return (
    <aside className="mcv-ta-strip" aria-label="TripAdvisor reviews for Ecotone - Manu Learning Centre">
      <div className="mcv-ta-strip-rating">
        <p className="mcv-ta-strip-excellent">Excellent</p>
        <TripadvisorRatingCircles />
        <p className="mcv-ta-strip-based">Based on 83 reviews</p>
        <img
          src={TA_LOGO_SRC}
          alt="Tripadvisor"
          className="mcv-ta-strip-logo"
          width={140}
          height={28}
          loading="lazy"
          decoding="async"
        />
        <p className="mcv-ta-strip-brand">Ecotone - Manu Learning Centre</p>
      </div>

      <ul className="mcv-ta-strip-excerpts">
        {MCV_TRIPADVISOR_EXCERPTS.map((item) => (
          <li key={item.author} className="mcv-ta-strip-excerpt">
            <QuoteMark className="mcv-ta-strip-quote-mark" />
            <blockquote>
              <p>{item.quote}</p>
              <footer>
                <cite>— {item.author}</cite>
              </footer>
            </blockquote>
          </li>
        ))}
      </ul>

      <a
        className="mcv-ta-strip-cta"
        href={MCV_TRIPADVISOR_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View all reviews on TripAdvisor (opens in a new tab)"
      >
        <span>View all reviews on TripAdvisor</span>
        <ExternalLinkIcon />
      </a>
    </aside>
  )
}

/**
 * Volunteers’ stories + TripAdvisor trust strip — one cohesive section matching the
 * campaign reference composition (intro beside Story 1, alternating Story 2, TA strip).
 */
export function ManuVolunteerStories() {
  const story1 = MCV_VOLUNTEER_STORIES[0]
  const story2 = MCV_VOLUNTEER_STORIES[1]
  if (!story1 || !story2) return null

  return (
    <section
      className="mcv-section mcv-section--cream mcv-stories"
      aria-labelledby="mcv-stories-title"
    >
      <div className="mcv-stories-shell">
        <div className="mcv-stories-row mcv-stories-row--lead">
          <header className="mcv-stories-head">
            <p className="mcv-stories-eyebrow">Real people. Real impact.</p>
            <h2 id="mcv-stories-title" className="mcv-stories-title">
              Volunteers&apos; stories
            </h2>
            <p className="mcv-stories-intro">
              People come to Manu to learn, contribute and protect one of the most biodiverse places on
              Earth. Here&apos;s what the experience felt like on the ground.
            </p>
          </header>

          <article className="mcv-story-panel mcv-story-panel--sofia">
            <StoryCopy story={story1} />
            <StoryMedia story={story1} sizes="(min-width: 1000px) 42vw, 100vw" />
          </article>
        </div>

        <article className="mcv-story-panel mcv-story-panel--amelia">
          <StoryMedia story={story2} sizes="(min-width: 1000px) 48vw, 100vw" />
          <StoryCopy story={story2} />
        </article>

        <TripadvisorStrip />
      </div>
    </section>
  )
}
