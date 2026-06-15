import { EXPERIENCE_LEARNING_FALLBACK } from '@/data/experienceLearningFallback'
import {
  EXPERIENCE_LEARNING_PROGRAMME_FLOW_IMAGE,
  EXPERIENCE_LEARNING_PROJECT_IMAGES,
  EXPERIENCE_LEARNING_TYPICAL_DAY_IMAGE,
} from '@/data/experienceLearningImages'
import type { LearningProgrammeCmsRow } from '@/lib/learningProgrammeGroq'
import { normalizeLearningOutcomeIcon } from '@/lib/learningOutcomeIcons'
import type {
  ExperienceLearningContent,
  ExperienceLearningMentorItem,
  ExperienceLearningMentorSection,
} from '@/lib/experienceLearningTypes'
import { optimizeSanityImageDelivery, SANITY_IMG } from '@/lib/sanity'

function mapMentorItemRow(
  row: {
    _key?: string | null
    name?: string | null
    role?: string | null
    photoUrl?: string | null
    biography?: string | null
    achievements?: string[] | null
    skills?: string[] | null
  },
  index: number,
): ExperienceLearningMentorItem | null {
  const name = row.name?.trim()
  const biography = row.biography?.trim()
  if (!name && !biography) return null
  return {
    id: row._key?.trim() || `mentor-${index + 1}`,
    name: name || undefined,
    role: row.role?.trim() || undefined,
    photoSrc: row.photoUrl?.trim()
      ? optimizeSanityImageDelivery(row.photoUrl.trim(), SANITY_IMG.ABOUT_PORTRAIT)
      : undefined,
    photoAlt: name || 'Programme mentor',
    biography: biography || undefined,
    achievements:
      row.achievements?.map((item) => item?.trim()).filter((item): item is string => Boolean(item)) ?? [],
    skills: row.skills?.map((item) => item?.trim()).filter((item): item is string => Boolean(item)) ?? [],
  }
}

function resolveMentorItemsFromDoc(doc: LearningProgrammeCmsRow): ExperienceLearningMentorItem[] {
  const fromArray = (doc.mentors ?? [])
    .map((row, i) => mapMentorItemRow(row, i))
    .filter((item): item is ExperienceLearningMentorItem => item != null)
  if (fromArray.length) return fromArray

  const legacy = mapMentorItemRow(
    {
      _key: 'legacy-mentor',
      name: doc.mentorName,
      role: doc.mentorRole,
      photoUrl: doc.mentorPhotoUrl,
      biography: doc.mentorBiography,
      achievements: doc.mentorAchievements,
      skills: doc.mentorSkills,
    },
    0,
  )
  return legacy ? [legacy] : []
}

function resolveMentorSection(doc: LearningProgrammeCmsRow): ExperienceLearningMentorSection | null {
  const mentors = resolveMentorItemsFromDoc(doc)
  if (!mentors.length) return null
  return {
    tabLabel: doc.mentorTabLabel?.trim() || undefined,
    mentors,
  }
}

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

  const mentor = resolveMentorSection(doc)

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
