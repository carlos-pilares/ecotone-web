import type { ExperienceLearningProject } from '@/lib/experienceLearningTypes'

const MAX_PROJECTS = 6

export function ExperienceLearningProjects({ projects }: { projects: ExperienceLearningProject[] }) {
  const visible = projects.slice(0, MAX_PROJECTS)
  if (!visible.length) return null

  return (
    <section className="content-section bg-cream fade" id="projects">
      <div className="content-inner">
        <div className="eyebrow">Projects you can join</div>
        <h2 className="h2">What you will work on</h2>
        <p className="exp-learning-lead exp-learning-projects__intro">
          Rotations depend on season, team capacity, and your duration — these are the active research and community
          threads in the field.
        </p>
        <div className="exp-learning-projects" role="list">
          {visible.map((project) => (
            <article key={project.id} className="exp-learning-project" role="listitem">
              <div className="exp-learning-project__media">
                <img src={project.imageSrc} alt={project.imageAlt} loading="lazy" decoding="async" />
                <div className="exp-learning-project__overlay" aria-hidden />
              </div>
              <div className="exp-learning-project__content">
                <h3 className="exp-learning-project__title">{project.title}</h3>
                <p className="exp-learning-project__desc">{project.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
