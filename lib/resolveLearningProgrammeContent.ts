import { EXPERIENCE_LEARNING_FALLBACK } from '@/data/experienceLearningFallback'
import {
  EXPERIENCE_LEARNING_PROGRAMME_FLOW_IMAGE,
  EXPERIENCE_LEARNING_PROJECT_IMAGES,
  EXPERIENCE_LEARNING_TYPICAL_DAY_IMAGE,
} from '@/data/experienceLearningImages'
import type { LearningProgrammeCmsRow } from '@/lib/learningProgrammeGroq'
import { normalizeLearningOutcomeIcon } from '@/lib/learningOutcomeIcons'
import type { ExperienceLearningContent } from '@/lib/experienceLearningTypes'
import { optimizeSanityImageDelivery, SANITY_IMG } from '@/lib/sanity'

function pickImage(
  cmsUrl: string | null | undefined,
  fallback: { imageSrc: string; imageAlt: string; imageCaption?: string },
  alt: string,
): { imageSrc: string; imageAlt: string; imageCaption?: string } {
  if (cmsUrl?.trim()) {
    return {
      imageSrc: optimizeSanityImageDelivery(cmsUrl.trim(), SANITY_IMG.SECTION),
      imageAlt: alt,
      imageCaption: fallback.imageCaption,
    }
  }
  return fallback
}

/** Maps a Learning Programme CMS document to front-end EL section content. */
export function resolveLearningProgrammeContent(
  doc: LearningProgrammeCmsRow | null | undefined,
  fallback: ExperienceLearningContent = EXPERIENCE_LEARNING_FALLBACK,
): ExperienceLearningContent {
  if (!doc) return fallback

  const title = doc.title?.trim() || fallback.purpose.title

  const purpose = {
    eyebrow: fallback.purpose.eyebrow,
    title: fallback.purpose.title,
    body: fallback.purpose.body,
    highlights:
      doc.overviewHighlights?.filter((h) => h?.trim()).map((h) => h.trim()) ?? fallback.purpose.highlights,
  }

  const programmeSteps =
    doc.howItWorksSteps?.length
      ? doc.howItWorksSteps
          .map((step, i) => ({
            id: step._key?.trim() || `step-${i + 1}`,
            title: step.title?.trim() || '',
            subtitle: step.label?.trim() || undefined,
            body: step.body?.trim() || undefined,
          }))
          .filter((s) => s.title)
      : fallback.programmeFlow.steps

  const programmeFlow = {
    steps: programmeSteps.length ? programmeSteps : fallback.programmeFlow.steps,
    ...pickImage(
      doc.howItWorksImageUrl,
      {
        imageSrc: fallback.programmeFlow.imageSrc,
        imageAlt: fallback.programmeFlow.imageAlt,
        imageCaption: doc.howItWorksImageCaption?.trim() || fallback.programmeFlow.imageCaption,
      },
      title,
    ),
    imageCaption: doc.howItWorksImageCaption?.trim() || fallback.programmeFlow.imageCaption,
  }

  const typicalRows =
    doc.typicalDayRows?.length
      ? doc.typicalDayRows
          .map((row, i) => ({
            id: row._key?.trim() || `row-${i + 1}`,
            timeLabel: row.timeLabel?.trim() || '',
            title: row.title?.trim() || '',
            body: row.body?.trim() || undefined,
          }))
          .filter((r) => r.title)
      : fallback.typicalDay.rows

  const typicalDay = {
    rows: typicalRows.length ? typicalRows : fallback.typicalDay.rows,
    ...pickImage(
      doc.typicalDayImageUrl,
      {
        imageSrc: fallback.typicalDay.imageSrc,
        imageAlt: fallback.typicalDay.imageAlt,
        imageCaption: doc.typicalDayImageCaption?.trim() || fallback.typicalDay.imageCaption,
      },
      title,
    ),
    imageCaption: doc.typicalDayImageCaption?.trim() || fallback.typicalDay.imageCaption,
    footnote: doc.typicalDayNote?.trim() || fallback.typicalDay.footnote,
  }

  const projects =
    doc.projects?.length
      ? doc.projects
          .slice(0, 6)
          .map((project, i) => {
            const fb = EXPERIENCE_LEARNING_PROJECT_IMAGES[i] ?? EXPERIENCE_LEARNING_PROJECT_IMAGES[0]!
            return {
              id: project._key?.trim() || `project-${i + 1}`,
              title: project.title?.trim() || '',
              description: project.description?.trim() || '',
              imageSrc: project.imageUrl?.trim()
                ? optimizeSanityImageDelivery(project.imageUrl.trim(), SANITY_IMG.CARD)
                : fb.imageSrc,
              imageAlt: project.title?.trim() || fb.imageAlt,
            }
          })
          .filter((p) => p.title)
      : fallback.projects

  const outcomes =
    doc.learningOutcomes?.length
      ? doc.learningOutcomes
          .map((outcome, i) => {
            const icon = normalizeLearningOutcomeIcon(outcome.icon ?? outcome.iconKey)
            if (!icon) return null
            const titleText = outcome.title?.trim() || ''
            const description = outcome.description?.trim() || ''
            if (!titleText || !description) return null
            return {
              id: outcome._key?.trim() || `outcome-${i + 1}`,
              title: titleText,
              description,
              icon,
            }
          })
          .filter((o): o is NonNullable<typeof o> => o != null)
      : fallback.outcomes

  const fieldBase = {
    eyebrow: fallback.fieldBase.eyebrow,
    title: doc.fieldBaseOverrideTitle?.trim() || fallback.fieldBase.title,
    intro: doc.fieldBaseOverrideText?.trim() || fallback.fieldBase.intro,
  }

  const mentorName = doc.mentorName?.trim()
  const mentorBiography = doc.mentorBiography?.trim()
  const mentor =
    mentorName || mentorBiography
      ? {
          tabLabel: doc.mentorTabLabel?.trim() || undefined,
          name: mentorName || undefined,
          role: doc.mentorRole?.trim() || undefined,
          photoSrc: doc.mentorPhotoUrl?.trim()
            ? optimizeSanityImageDelivery(doc.mentorPhotoUrl.trim(), SANITY_IMG.ABOUT_PORTRAIT)
            : undefined,
          photoAlt: mentorName || 'Programme mentor',
          biography: mentorBiography || undefined,
          achievements:
            doc.mentorAchievements?.map((item) => item?.trim()).filter((item): item is string => Boolean(item)) ??
            [],
          skills: doc.mentorSkills?.map((item) => item?.trim()).filter((item): item is string => Boolean(item)) ?? [],
        }
      : null

  const applicationSteps =
    doc.applicationProcessSteps
      ?.map((step, i) => ({
        id: step._key?.trim() || `application-step-${i + 1}`,
        title: step.title?.trim() || '',
        description: step.description?.trim() || undefined,
      }))
      .filter((step) => step.title) ?? []

  const applicationProcess = applicationSteps.length
    ? {
        tabLabel: doc.applicationProcessTabLabel?.trim() || undefined,
        intro: doc.applicationProcessIntro?.trim() || undefined,
        steps: applicationSteps,
      }
    : null

  return {
    purpose,
    howItWorksPillTitle: doc.howItWorksPillTitle?.trim() || undefined,
    typicalDayPillTitle: doc.typicalDayPillTitle?.trim() || undefined,
    programmeFlow,
    programmeFlowIntro: doc.howItWorksIntro?.trim() || undefined,
    typicalDay,
    typicalDayIntro: doc.typicalDayIntro?.trim() || undefined,
    projects: projects.length ? projects : fallback.projects,
    outcomes: outcomes.length ? outcomes : fallback.outcomes,
    fieldBase,
    mentor,
    applicationProcess,
  }
}
