import {
  EXPERIENCE_LEARNING_PROGRAMME_FLOW_IMAGE,
  EXPERIENCE_LEARNING_PROJECT_IMAGES,
  EXPERIENCE_LEARNING_TYPICAL_DAY_IMAGE,
} from '@/data/experienceLearningImages'
import type { ExperienceLearningContent } from '@/lib/experienceLearningTypes'

/** Placeholder content for Experiential Learning pages until CMS fields are wired. */
export const EXPERIENCE_LEARNING_FALLBACK: ExperienceLearningContent = {
  purpose: {
    eyebrow: 'Why this programme matters',
    title: 'Conservation science you can join — not observe from the sidelines.',
    body: 'Ecotone experiential learning programmes connect volunteers, students, and professionals with active field research in the Manu Biosphere. Your time in the forest supports real monitoring, community partnerships, and data that informs conservation decisions — while you build practical skills alongside resident scientists.',
    highlights: [
      'Contribute to long-term biodiversity monitoring',
      'Work alongside HERPIRO field teams and CIDS researchers',
      'Support community-led conservation in buffer-zone communities',
      'Every placement funds ongoing research and habitat protection',
    ],
  },
  programmeFlow: {
    steps: [
      {
        id: 'arrival',
        title: 'Arrival',
        subtitle: 'Welcome to the field',
        body: 'Transfer to the research station, settle in, and meet your field coordinator and project leads.',
      },
      {
        id: 'orientation',
        title: 'Orientation & training',
        subtitle: 'Tools, safety, methods',
        body: 'Field protocols, equipment orientation, and the scientific methods you will use throughout your stay.',
      },
      {
        id: 'projects',
        title: 'Join active projects',
        subtitle: 'Rotations begin',
        body: 'Embed with monitoring teams — transects, camera traps, species surveys, or community programmes matched to your duration.',
      },
      {
        id: 'data',
        title: 'Collect & interpret data',
        subtitle: 'From field to findings',
        body: 'Record observations, manage datasets, and learn how raw field data becomes conservation intelligence.',
      },
      {
        id: 'teams',
        title: 'Work with field teams',
        subtitle: 'Side by side in the forest',
        body: 'Daily collaboration with ecologists, parabiologists, and local guides who know this landscape intimately.',
      },
      {
        id: 'reflect',
        title: 'Reflect, present & continue',
        subtitle: 'Close the loop',
        body: 'Debrief sessions, optional presentations, and guidance on extending your learning journey beyond the programme.',
      },
    ],
    ...EXPERIENCE_LEARNING_PROGRAMME_FLOW_IMAGE,
  },
  typicalDay: {
    rows: [
      {
        id: 'dawn',
        timeLabel: '05:30',
        title: 'Dawn transect & monitoring',
        body: 'Early-morning bird and mammal activity surveys along established transects.',
      },
      {
        id: 'morning',
        timeLabel: '08:00',
        title: 'Research rotation',
        body: 'Hands-on fieldwork with your assigned project team — surveys, trapping checks, or vegetation plots.',
      },
      {
        id: 'midday',
        timeLabel: '11:00',
        title: 'Community or field support',
        body: 'Buffer-zone engagement, equipment maintenance, or data entry depending on the day’s rotation.',
      },
      {
        id: 'afternoon',
        timeLabel: '14:00',
        title: 'Data analysis & methods',
        body: 'Review captures, log observations, and short skills sessions with field scientists.',
      },
      {
        id: 'evening',
        timeLabel: '19:30',
        title: 'Optional night walk',
        body: 'Amphibian monitoring, spotlighting, or forest soundscapes when conditions allow.',
      },
    ],
    ...EXPERIENCE_LEARNING_TYPICAL_DAY_IMAGE,
    footnote:
      'Sundays are usually free days — time to rest, explore, read, swim, or connect with the field community.',
  },
  projects: [
    {
      id: 'wildlife',
      title: 'Wildlife monitoring',
      description: 'Mammal and large vertebrate transects across reserve trails.',
      ...EXPERIENCE_LEARNING_PROJECT_IMAGES[0]!,
    },
    {
      id: 'herp',
      title: 'Herpetology',
      description: 'Amphibian and reptile surveys — day and night protocols.',
      ...EXPERIENCE_LEARNING_PROJECT_IMAGES[1]!,
    },
    {
      id: 'birds',
      title: 'Bird monitoring',
      description: 'Point counts, mist-net support, and migration season tracking.',
      ...EXPERIENCE_LEARNING_PROJECT_IMAGES[2]!,
    },
    {
      id: 'camtrap',
      title: 'Camera trapping',
      description: 'Deploy, maintain, and analyse motion-triggered camera networks.',
      ...EXPERIENCE_LEARNING_PROJECT_IMAGES[3]!,
    },
    {
      id: 'agro',
      title: 'Agroecology',
      description: 'Buffer-zone farming practices and sustainable land-use research.',
      ...EXPERIENCE_LEARNING_PROJECT_IMAGES[4]!,
    },
    {
      id: 'community',
      title: 'Community initiatives',
      description: 'Education, livelihood, and conservation partnerships with local families.',
      ...EXPERIENCE_LEARNING_PROJECT_IMAGES[5]!,
    },
  ],
  outcomes: [
    {
      id: 'o1',
      title: 'Field research confidence',
      description: 'Comfort running surveys, handling equipment, and working safely in remote tropical forest.',
      icon: 'research',
    },
    {
      id: 'o2',
      title: 'Conservation thinking',
      description: 'Understand how monitoring, community action, and policy connect in real landscapes.',
      icon: 'conservation',
    },
    {
      id: 'o3',
      title: 'Data-to-impact mindset',
      description: 'See how field observations become datasets, reports, and decisions that protect habitat.',
      icon: 'data',
    },
    {
      id: 'o4',
      title: 'Life at a research station',
      description: 'Experience the rhythm, collaboration, and purpose of daily life alongside resident scientists.',
      icon: 'fieldwork',
    },
    {
      id: 'o5',
      title: 'Cross-cultural collaboration',
      description: 'Work respectfully with local guides, parabiologists, and buffer-zone communities.',
      icon: 'community',
    },
    {
      id: 'o6',
      title: 'Career & portfolio clarity',
      description: 'Leave with tangible field experience to strengthen applications, research, or conservation careers.',
      icon: 'career',
    },
  ],
  fieldBase: {
    eyebrow: 'Field base',
    title: 'Research station & living environment',
    intro: 'Shared field accommodation adjacent to active research facilities — designed for practical living and daily field access, not resort-style tourism.',
  },
  mentor: null,
  applicationProcess: null,
}
