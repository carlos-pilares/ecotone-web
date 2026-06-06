import type { ExperienceLearningProgrammeFlowContent } from '@/lib/experienceLearningTypes'

export function ExperienceLearningProgrammeFlowPanel({
  content,
  intro,
}: {
  content: ExperienceLearningProgrammeFlowContent
  intro?: string
}) {
  const { steps, imageSrc, imageAlt, imageCaption } = content
  if (!steps.length) return null

  return (
    <>
      <p className="exp-learning-lead exp-learning-programme-flow__intro">
        {intro?.trim() ||
          'One programme — a clear progression from arrival to contribution. Duration deepens each stage; the pathway stays the same.'}
      </p>
      <div className="exp-learning-programme-flow">
        <div className="exp-learning-programme-flow__grid">
          <div className="exp-learning-programme-flow__timeline">
            <div className="exp-learning-flow" role="list">
              {steps.map((step, index) => (
                <article key={step.id} className="exp-learning-flow__step" role="listitem">
                  <div className="exp-learning-flow__rail" aria-hidden>
                    <span className="exp-learning-flow__dot" />
                    {index < steps.length - 1 ? <span className="exp-learning-flow__line" /> : null}
                  </div>
                  <div>
                    <h3 className="exp-learning-flow__title">{step.title}</h3>
                    {step.subtitle ? <p className="exp-learning-flow__subtitle">{step.subtitle}</p> : null}
                    {step.body ? <p className="exp-learning-flow__body">{step.body}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
          <figure className="exp-learning-programme-flow__image">
            <img src={imageSrc} alt={imageAlt} decoding="async" />
            <div className="day-photo-overlay" aria-hidden />
            {imageCaption ? <figcaption className="day-photo-caption is-visible">{imageCaption}</figcaption> : null}
          </figure>
        </div>
      </div>
    </>
  )
}
