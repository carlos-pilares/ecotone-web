/** Static copy for `/lodges/soqtapata-lodge` (Phase 1 — no CMS). */

import type { SoqtapataFaq, SoqtapataOverview } from '@/data/soqtapataExperienceLocal'

export type LodgeBreadcrumbItem = { href: string; label: string }

export const lodgeSoqtapataHero = {
  imageSrc: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=85',
  imageAlt: 'Soqtapata Lodge — cloud forest',
  photoCountLabel: '+12 photos',
  breadcrumbs: [
    { href: '/', label: 'Lodges' },
    { href: '/experiences/soqtapata-pristine-immersion', label: 'Camanti Route' },
  ] satisfies LodgeBreadcrumbItem[],
  currentCrumbLabel: 'Soqtapata Lodge',
  badges: ['Camanti Route', 'Research station', 'B Corp'],
  title: 'Soqtapata Lodge',
  tagline:
    'The only lodge inside the Soqtapata Reserve. Adjacent to CIDS, our active research centre. Maximum 14 guests.',
  ratingScore: '5.0',
  reviewCountLabel: '12 reviews',
  secondaryMeta: '3 experiences',
  primaryCta: {
    href: '/experiences/soqtapata-pristine-immersion',
    label: 'See experiences',
  },
} as const

export type LodgeHeroData = typeof lodgeSoqtapataHero

/** Misma forma que `SoqtapataOverview` (`ExperienceOverviewSoqtapata`). */
export const lodgeSoqtapataOverview = {
  eyebrow: 'About this lodge',
  h2: 'The forest, your home.',
  paragraphs: [
    'Soqtapata Lodge is the only accommodation inside the Soqtapata Reserve — 10,000 hectares of primary cloud forest from 900 to 4,700 m.a.s.l. Accessible only on foot, a 45-minute guided walk from the road.',
    'Adjacent to CIDS, our active Conservation, Investigation & Development Station, the lodge is run by resident biologists and naturalists who live in the forest year-round. Every booking directly funds conservation work managed by HERPIRO (B Corp).',
  ],
  highlights: [
    'Inside the reserve — 10,000 ha of primary forest',
    'CIDS adjacent — Active research station',
    'Resident biologists — Not a tour operator',
    '300+ bird species — From the lodge terrace',
    'Every stay funds conservation — HERPIRO B Corp certified',
  ],
} as const satisfies SoqtapataOverview

export type LodgeOverviewData = typeof lodgeSoqtapataOverview

/** Misma forma que `SoqtapataFaq` (`ExperienceFaqSoqtapata` / `soqtapataPhase6Faq`). */
export const lodgeSoqtapataFaq = {
  eyebrow: 'Common questions',
  h2: 'About Soqtapata Lodge',
  h2Style: { marginBottom: 6 },
  lead: 'Everything you need to know before arriving.',
  leadStyle: { fontSize: 14, fontWeight: 300, color: 'var(--n700)', lineHeight: 1.8, marginBottom: 22 },
  items: [
    {
      id: 'f1',
      question: 'Is there electricity and hot water?',
      answer:
        'Yes — solar-powered electricity with 220V outlets in each room for phone and camera charging. Hot water showers are available all day, heated by solar panels. Evening lighting throughout the lodge and common areas.',
    },
    {
      id: 'f2',
      question: 'Can I visit the lodge without booking an experience?',
      answer:
        'No — the lodge is only accessible through one of our programs. This is to protect the reserve and ensure every guest has a guide. The shortest program is 3 days / 2 nights (Soqtapata Pristine Immersion).',
    },
    {
      id: 'f3',
      question: 'What is the fitness level required?',
      answer:
        'Moderate. The walk from the trailhead to the lodge is 45 minutes over uneven terrain. Daily trails vary — some are gentle, others more demanding. A reasonable level of fitness is expected. Minimum age is 8 years.',
    },
    {
      id: 'f4',
      question: 'Is the lodge suitable for families with children?',
      answer:
        'Yes — from age 8. Families often find the lodge environment extraordinary for children. The guides are experienced with young guests and adapt the pace accordingly. The Soqtapata 3D/2N program is the most popular for families.',
    },
    {
      id: 'f5',
      question: 'What should I pack for the lodge?',
      answer:
        "Rubber boots and rain gear are provided. Bring: quick-dry trousers, warm mid-layer fleece (temperatures drop at night at 1,200 m), waterproof jacket, insect repellent (DEET), sunscreen, binoculars, headlamp, and camera. Pack light — you're walking 45 minutes with your bag.",
    },
  ],
} as const satisfies SoqtapataFaq

export type LodgeFaqData = typeof lodgeSoqtapataFaq
