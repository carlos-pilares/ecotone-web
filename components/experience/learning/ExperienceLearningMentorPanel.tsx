import type {
  ExperienceLearningMentorItem,
  ExperienceLearningMentorSection,
} from '@/lib/experienceLearningTypes'

export function mentorTabHasContent(
  mentor: ExperienceLearningMentorSection | null | undefined,
): mentor is ExperienceLearningMentorSection {
  return Boolean(mentor?.mentors?.some((item) => item.name?.trim() || item.biography?.trim()))
}

function MentorItemCard({ mentor }: { mentor: ExperienceLearningMentorItem }) {
  const hasDetails = mentor.achievements.length > 0 || mentor.skills.length > 0

  return (
    <article className="exp-learning-mentor-panel__item">
      <div
        className={`exp-learning-mentor-panel__grid${mentor.photoSrc ? '' : ' exp-learning-mentor-panel__grid--solo'}`}
      >
        <div className="exp-learning-mentor-panel__main">
          {mentor.name ? <h3 className="exp-learning-mentor-panel__name">{mentor.name}</h3> : null}
          {mentor.role ? <p className="exp-learning-mentor-panel__role">{mentor.role}</p> : null}
          {mentor.biography ? <p className="exp-learning-mentor-panel__bio">{mentor.biography}</p> : null}
          {hasDetails ? (
            <div className="exp-learning-mentor-panel__details">
              {mentor.achievements.length ? (
                <div className="exp-learning-mentor-panel__block">
                  <h4 className="exp-learning-mentor-panel__label">Key achievements</h4>
                  <ul className="exp-learning-mentor-panel__list">
                    {mentor.achievements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {mentor.skills.length ? (
                <div className="exp-learning-mentor-panel__block">
                  <h4 className="exp-learning-mentor-panel__label">Skills & experience</h4>
                  <ul className="exp-learning-mentor-panel__list">
                    {mentor.skills.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        {mentor.photoSrc ? (
          <figure className="exp-learning-mentor-panel__photo">
            <img src={mentor.photoSrc} alt={mentor.photoAlt} loading="lazy" decoding="async" />
            <div className="day-photo-overlay" aria-hidden />
          </figure>
        ) : null}
      </div>
    </article>
  )
}

export function ExperienceLearningMentorPanel({ mentor }: { mentor: ExperienceLearningMentorSection }) {
  const mentors = mentor.mentors.filter((item) => item.name?.trim() || item.biography?.trim())
  if (!mentors.length) return null

  return (
    <div className="exp-learning-programme-tab-card exp-learning-mentor-panel">
      <div className="exp-learning-programme-tab-card__inner">
        <div
          className={`exp-learning-mentor-panel__list${mentors.length === 1 ? ' exp-learning-mentor-panel__list--solo' : ''}`}
        >
          {mentors.map((item) => (
            <MentorItemCard key={item.id} mentor={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
