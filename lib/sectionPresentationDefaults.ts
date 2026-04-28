/**
 * Defaults exclusivamente editoriales (eyebrow, title, intro corto).
 * Poblado manualmente para coincidir con la UI actual Soqtapata; no importa `soqtapataExperienceLocal` entero.
 */
import type { SectionModuleKey, SectionPresentationDefaultsRow } from './sectionPresentationTypes'

export const SECTION_DEFAULTS: Record<SectionModuleKey, SectionPresentationDefaultsRow> = {
  overview: {
    eyebrow: 'About this experience',
    title: 'The cloud forest, unfiltered.',
    text: '',
  },
  itinerary: {
    eyebrow: 'Day by day',
    title: "What you'll experience",
    text: '',
  },
  lodge: {
    eyebrow: "Where you'll stay",
    title: 'Your base in the forest',
    text:
      'This experience stays at Soqtapata Lodge for both nights — adjacent to the CIDS research centre.',
  },
  wildlife: {
    eyebrow: 'What you might encounter',
    title: 'Wildlife in this reserve',
    text: 'Not guaranteed — this is wild nature. These species are regularly observed in the Soqtapata territory.',
  },
  includes: {
    eyebrow: "What's covered",
    title: 'Includes & not included',
    text: '',
  },
  tech: {
    eyebrow: 'Exclusive technology',
    title: "What's in your tech pack",
    text:
      'This experience includes EcoDroneView® and ForestWhisper® in your pack. EcoSpeciesExplorer® is available free on your device.',
  },
  media: {
    eyebrow: 'See it before you go',
    title: 'The experience, unfiltered',
    text: '',
  },
  whenToVisit: {
    eyebrow: 'When to visit',
    title: 'Every month has something extraordinary',
    text:
      'Camanti is alive year-round. Wildlife shifts with the season — not better or worse, just different. Every month is visible below.',
  },
  beforeYouGo: {
    eyebrow: 'Traveller guide',
    title: 'Before you go',
    text: 'Everything international visitors need to know.',
  },
  reviews: {
    eyebrow: 'What guests say',
    title: 'Real experiences',
    text: '',
  },
  terms: {
    eyebrow: 'Before you book',
    title: 'Terms',
    text:
      'Key things to know. For the complete legal text, use the full PDF. These bullets do not replace your booking agreement.',
  },
  resources: {
    eyebrow: 'Resources',
    title: 'Download & plan',
    text: '',
  },
  faq: {
    eyebrow: 'Common questions',
    title: 'Frequently asked questions',
    text: 'Everything else you might want to know before booking.',
  },
  related: {
    eyebrow: 'Also in Camanti',
    title: 'You might also like',
    text: '',
  },
  reserve: {
    eyebrow: 'Reserve your spot',
    title: 'Ready to go deep?',
    text: '',
  },
}
