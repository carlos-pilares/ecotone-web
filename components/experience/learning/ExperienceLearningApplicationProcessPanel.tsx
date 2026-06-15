import type { ExperienceLearningApplicationProcess } from '@/lib/experienceLearningTypes'

export function applicationProcessTabHasContent(
  applicationProcess: ExperienceLearningApplicationProcess | null | undefined,
): applicationProcess is ExperienceLearningApplicationProcess {
  return Boolean(applicationProcess?.steps.length)
}

export function ExperienceLearningApplicationProcessPanel({
  applicationProcess,
}: {
  applicationProcess: ExperienceLearningApplicationProcess
}) {
  const intro = applicationProcess.intro?.trim()

  return (
    <>
      {intro ? <p className="exp-learning-lead exp-learning-application-panel__intro">{intro}</p> : null}
      <div className="exp-learning-programme-tab-card exp-learning-application-panel">
        <div className="exp-learning-programme-tab-card__inner">
          <div className="exp-learning-flow" role="list" aria-label="Application process steps">
            {applicationProcess.steps.map((step, index) => (
              <article key={step.id} className="exp-learning-flow__step" role="listitem">
                <div className="exp-learning-flow__rail" aria-hidden>
                  <span className="exp-learning-flow__dot" />
                  {index < applicationProcess.steps.length - 1 ? (
                    <span className="exp-learning-flow__line" />
                  ) : null}
                </div>
                <div>
                  <p className="exp-learning-flow__subtitle">{`Step ${index + 1}`}</p>
                  <h3 className="exp-learning-flow__title">{step.title}</h3>
                  {step.description ? <p className="exp-learning-flow__body">{step.description}</p> : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
