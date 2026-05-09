import {defineField, defineType} from 'sanity'

const iconKeyField = defineField({
  name: 'iconKey',
  title: 'Icon',
  type: 'string',
  options: {
    list: [
      {title: 'Family', value: 'family'},
      {title: 'Academic / research', value: 'academic'},
      {title: 'Independent', value: 'independent'},
      {title: 'Company', value: 'company'},
    ],
    layout: 'radio',
  },
})

const legacyTravellerOption = {
  type: 'object',
  fields: [
    defineField({name: 'key', type: 'string'}),
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'description', type: 'text', rows: 2}),
    iconKeyField,
  ],
}

const legacySeasonOption = {
  type: 'object',
  fields: [
    defineField({name: 'key', type: 'string'}),
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'description', type: 'string'}),
  ],
}

/** @deprecated Legacy flat shape — hidden; preserves existing CMS documents. */
const legacyPlanJourneyFields = [
  defineField({name: 'closeLabel', type: 'string'}),
  defineField({name: 'title', type: 'string'}),
  defineField({name: 'subtitle', type: 'string'}),
  defineField({name: 'step1Title', type: 'string'}),
  defineField({name: 'step2Title', type: 'string'}),
  defineField({name: 'step3Title', type: 'string'}),
  defineField({name: 'step1Subtitle', type: 'string'}),
  defineField({name: 'step2Subtitle', type: 'string'}),
  defineField({name: 'step3Subtitle', type: 'string'}),
  defineField({name: 'responseTimeText', type: 'string'}),
  defineField({name: 'nameLabel', type: 'string'}),
  defineField({name: 'namePlaceholder', type: 'string'}),
  defineField({name: 'travellerQuestionLabel', type: 'string'}),
  defineField({name: 'travellerOptions', type: 'array', of: [legacyTravellerOption]}),
  defineField({name: 'seasonQuestionLabel', type: 'string'}),
  defineField({name: 'seasonOptions', type: 'array', of: [legacySeasonOption]}),
  defineField({name: 'peopleLabel', type: 'string'}),
  defineField({name: 'contactQuestionLabel', type: 'string'}),
  defineField({name: 'whatsappLabel', type: 'string'}),
  defineField({name: 'whatsappDescription', type: 'string'}),
  defineField({name: 'emailLabel', type: 'string'}),
  defineField({name: 'emailDescription', type: 'string'}),
  defineField({name: 'emailFieldLabel', type: 'string'}),
  defineField({name: 'emailPlaceholder', type: 'string'}),
  defineField({name: 'messageLabel', type: 'string'}),
  defineField({name: 'messageOptionalHint', type: 'string'}),
  defineField({name: 'messagePlaceholder', type: 'string'}),
  defineField({name: 'continueCtaLabel', type: 'string'}),
  defineField({name: 'backCtaLabel', type: 'string'}),
  defineField({name: 'whatsappCtaLabel', type: 'string'}),
  defineField({name: 'emailCtaLabel', type: 'string'}),
  defineField({name: 'thankYouTitle', type: 'string'}),
  defineField({name: 'thankYouBody', type: 'text'}),
  defineField({name: 'footerNoteWhatsapp', type: 'text'}),
  defineField({name: 'footerNoteEmail', type: 'text'}),
  defineField({name: 'emailInvalidMessage', type: 'string'}),
]

/** @deprecated Legacy — hidden. */
const legacyExperienceFields = [
  defineField({name: 'closeLabel', type: 'string'}),
  defineField({name: 'emailInvalidMessage', type: 'string'}),
  defineField({name: 'title', type: 'string'}),
  defineField({name: 'subtitle', type: 'string'}),
  defineField({name: 'nameLabel', type: 'string'}),
  defineField({name: 'namePlaceholder', type: 'string'}),
  defineField({name: 'travelDateLabel', type: 'string'}),
  defineField({name: 'travelDatePlaceholder', type: 'string'}),
  defineField({name: 'peopleLabel', type: 'string'}),
  defineField({name: 'contactQuestionLabel', type: 'string'}),
  defineField({name: 'whatsappLabel', type: 'string'}),
  defineField({name: 'whatsappDescription', type: 'string'}),
  defineField({name: 'emailLabel', type: 'string'}),
  defineField({name: 'emailDescription', type: 'string'}),
  defineField({name: 'emailFieldLabel', type: 'string'}),
  defineField({name: 'emailPlaceholder', type: 'string'}),
  defineField({name: 'messageLabel', type: 'string'}),
  defineField({name: 'messageOptionalHint', type: 'string'}),
  defineField({name: 'messagePlaceholder', type: 'string'}),
  defineField({name: 'whatsappCtaLabel', type: 'string'}),
  defineField({name: 'emailCtaLabel', type: 'string'}),
  defineField({name: 'footerNote', type: 'text'}),
  defineField({name: 'thankYouTitle', type: 'string'}),
  defineField({name: 'thankYouBody', type: 'text'}),
]

const planStep1Option = {
  type: 'object',
  name: 'planStep1Option',
  fields: [
    iconKeyField,
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Shown on the card; also used as the value sent in the enquiry.',
    }),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'string', description: 'Supporting line under the title.'}),
    defineField({
      name: 'ctaLabel',
      title: 'CTA label (optional)',
      type: 'string',
      description: 'Reserved for future use; step uses the shared Continue button.',
    }),
  ],
  preview: {
    select: {t: 'title', ik: 'iconKey'},
    prepare({t, ik}) {
      return {title: t || ik || 'Option'}
    },
  },
}

const seasonOption = {
  type: 'object',
  name: 'seasonOption',
  fields: [
    defineField({name: 'title', title: 'Primary line', type: 'string'}),
    defineField({name: 'subtitle', title: 'Secondary line', type: 'string'}),
  ],
  preview: {
    select: {t: 'title', s: 'subtitle'},
    prepare({t, s}) {
      return {title: [t, s].filter(Boolean).join(' · ') || 'Season'}
    },
  },
}

const emailFieldNested = defineField({
  name: 'emailField',
  title: 'Email input',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string', title: 'Label'}),
    defineField({name: 'placeholder', type: 'string', title: 'Placeholder'}),
  ],
})

const messageFieldNested = defineField({
  name: 'messageField',
  title: 'Message input',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string', title: 'Label'}),
    defineField({name: 'helperText', type: 'string', title: 'Helper (e.g. optional)'}),
    defineField({name: 'placeholder', type: 'string', title: 'Placeholder'}),
  ],
})

const generalContactOption = {
  type: 'object',
  name: 'generalContactOption',
  fields: [
    iconKeyField,
    defineField({name: 'title', type: 'string', title: 'Card title'}),
    defineField({name: 'subtitle', type: 'string', title: 'Card subtitle'}),
    defineField({
      name: 'type',
      title: 'Channel type',
      type: 'string',
      options: {
        list: [
          {title: 'WhatsApp', value: 'whatsapp'},
          {title: 'Email', value: 'email'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp number (optional)',
      type: 'string',
      description: 'E.164 or digits; if empty, the site default WhatsApp from settings is used.',
    }),
    defineField({name: 'ctaLabel', type: 'string', title: 'Primary button label'}),
    defineField({
      name: 'endMessage',
      title: 'Footer note under CTA',
      type: 'text',
      rows: 2,
    }),
    emailFieldNested,
    messageFieldNested,
  ],
  preview: {
    select: {t: 'title', ty: 'type'},
    prepare({t, ty}) {
      return {title: t || ty || 'Contact option'}
    },
  },
}

const experienceContactOption = {
  type: 'object',
  name: 'experienceContactOption',
  fields: [
    iconKeyField,
    defineField({name: 'title', type: 'string', title: 'Card title'}),
    defineField({name: 'subtitle', type: 'string', title: 'Card subtitle'}),
    defineField({
      name: 'type',
      type: 'string',
      options: {
        list: [
          {title: 'WhatsApp', value: 'whatsapp'},
          {title: 'Email', value: 'email'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp number',
      type: 'string',
      description: 'Required for WhatsApp type if you override; empty falls back to site default.',
    }),
    defineField({name: 'ctaLabel', type: 'string', title: 'Primary button label'}),
    defineField({name: 'endMessage', title: 'Footer note under CTA', type: 'text', rows: 2}),
    emailFieldNested,
    messageFieldNested,
  ],
  preview: {
    select: {t: 'title', ty: 'type'},
    prepare({t, ty}) {
      return {title: t || ty || 'Contact'}
    },
  },
}

const generalModalObject = defineField({
  name: 'generalModal',
  title: 'General modal (Plan your journey)',
  type: 'object',
  group: 'general',
  description: 'Three steps plus a thank-you state after email is “sent”.',
  fields: [
    defineField({
      name: 'closeLabel',
      title: 'Close label',
      type: 'string',
      description: 'Accessibility label for the X and the thanks-screen close button.',
    }),
    defineField({
      name: 'emailInvalidMessage',
      title: 'Invalid email message',
      type: 'string',
    }),
    defineField({
      name: 'validation',
      title: 'Validation messages (optional)',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'nameRequired', type: 'string', title: 'Name required'}),
        defineField({name: 'travellerTypeRequired', type: 'string', title: 'Traveller type required'}),
        defineField({name: 'seasonRequired', type: 'string', title: 'Season / period required'}),
        defineField({name: 'peopleMinRequired', type: 'string', title: 'Party size (min. 1)'}),
        defineField({name: 'contactRequired', type: 'string', title: 'Contact method required'}),
        defineField({name: 'emailRequired', type: 'string', title: 'Email required (email channel)'}),
      ],
    }),
    defineField({
      name: 'step1',
      title: 'Step 1 — Name & traveller type',
      type: 'object',
      options: {collapsible: true, collapsed: false},
      fields: [
        defineField({
          name: 'internalId',
          type: 'string',
          description: 'Optional editor-only reference (not shown on site).',
        }),
        defineField({name: 'title', type: 'string', title: 'Step title'}),
        defineField({name: 'subtitle', type: 'text', title: 'Step subtitle', rows: 2}),
        defineField({
          name: 'nameField',
          type: 'object',
          title: 'Name field',
          fields: [
            defineField({name: 'label', type: 'string'}),
            defineField({name: 'placeholder', type: 'string'}),
          ],
        }),
        defineField({
          name: 'optionsField',
          type: 'object',
          title: 'Traveller type cards',
          fields: [
            defineField({name: 'label', type: 'string', title: 'Section label'}),
            defineField({
              name: 'options',
              type: 'array',
              title: 'Options',
              of: [planStep1Option],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'step2',
      title: 'Step 2 — Season & party size',
      type: 'object',
      options: {collapsible: true, collapsed: false},
      fields: [
        defineField({name: 'internalId', type: 'string'}),
        defineField({name: 'title', type: 'string', title: 'Step title'}),
        defineField({name: 'subtitle', type: 'text', title: 'Step subtitle', rows: 2}),
        defineField({
          name: 'seasonField',
          type: 'object',
          title: 'Season',
          fields: [
            defineField({name: 'label', type: 'string'}),
            defineField({name: 'options', type: 'array', of: [seasonOption]}),
          ],
        }),
        defineField({
          name: 'peopleField',
          type: 'object',
          title: 'Number of people',
          fields: [
            defineField({name: 'label', type: 'string'}),
            defineField({
              name: 'defaultNumber',
              type: 'number',
              description: 'Initial counter value (1–99).',
            }),
            defineField({name: 'singularLabel', type: 'string', description: 'e.g. traveller'}),
            defineField({name: 'pluralLabel', type: 'string', description: 'e.g. travellers'}),
          ],
        }),
        defineField({name: 'backCtaLabel', type: 'string', title: 'Back button'}),
        defineField({name: 'forwardCtaLabel', type: 'string', title: 'Continue button'}),
      ],
    }),
    defineField({
      name: 'step3',
      title: 'Step 3 — Contact channel',
      type: 'object',
      options: {collapsible: true, collapsed: false},
      fields: [
        defineField({name: 'internalId', type: 'string'}),
        defineField({name: 'title', type: 'string', title: 'Step title'}),
        defineField({name: 'subtitle', type: 'text', title: 'Step subtitle', rows: 2}),
        defineField({
          name: 'contactField',
          type: 'object',
          title: 'Contact',
          fields: [
            defineField({name: 'label', type: 'string', title: 'Section label'}),
            defineField({
              name: 'options',
              type: 'array',
              of: [generalContactOption],
            }),
          ],
        }),
        defineField({name: 'backCtaLabel', type: 'string', title: 'Back button'}),
      ],
    }),
    defineField({
      name: 'finalStep',
      title: 'Final step — Thank you (after email)',
      type: 'object',
      options: {collapsible: true, collapsed: false},
      fields: [
        defineField({name: 'title', type: 'string'}),
        defineField({name: 'subtitle', type: 'text', rows: 3}),
        defineField({
          name: 'summaryTitle',
          type: 'string',
          description: 'Optional heading above the summary list.',
        }),
        defineField({
          name: 'summaryFields',
          type: 'object',
          title: 'Summary row labels',
          fields: [
            defineField({name: 'nameLabel', type: 'string'}),
            defineField({name: 'travellerTypeLabel', type: 'string'}),
            defineField({name: 'seasonLabel', type: 'string'}),
            defineField({name: 'peopleLabel', type: 'string'}),
            defineField({name: 'contactViaLabel', type: 'string'}),
            defineField({name: 'noteLabel', type: 'string'}),
          ],
        }),
        defineField({name: 'finalCtaLabel', type: 'string', title: 'Close button'}),
      ],
    }),
  ],
})

const experienceModalObject = defineField({
  name: 'experienceModal',
  title: 'Experience modal',
  type: 'object',
  group: 'experience',
  description: 'Copy for the modal opened from an experience page (banner still comes from the experience).',
  fields: [
    defineField({
      name: 'closeLabel',
      title: 'Close label',
      type: 'string',
      description: 'X and thanks close button.',
    }),
    defineField({name: 'emailInvalidMessage', title: 'Invalid email message', type: 'string'}),
    defineField({
      name: 'validation',
      title: 'Validation messages (optional)',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'nameRequired', type: 'string', title: 'Name required'}),
        defineField({name: 'travelDateRequired', type: 'string', title: 'Approx. travel date required'}),
        defineField({name: 'peopleMinRequired', type: 'string', title: 'Party size (min. 1)'}),
        defineField({name: 'contactRequired', type: 'string', title: 'Contact method required'}),
        defineField({name: 'emailRequired', type: 'string', title: 'Email required (email channel)'}),
      ],
    }),
    defineField({
      name: 'intro',
      title: 'Intro (below banner)',
      type: 'object',
      options: {collapsible: true, collapsed: false},
      fields: [
        defineField({name: 'title', type: 'string'}),
        defineField({name: 'subtitle', type: 'text', rows: 2}),
      ],
    }),
    defineField({
      name: 'nameField',
      title: 'Field 1 — Name',
      type: 'object',
      options: {collapsible: true, collapsed: false},
      fields: [
        defineField({name: 'label', type: 'string'}),
        defineField({name: 'placeholder', type: 'string'}),
      ],
    }),
    defineField({
      name: 'travelDateField',
      title: 'Field 2 — Travel date',
      type: 'object',
      options: {collapsible: true, collapsed: false},
      fields: [
        defineField({name: 'label', type: 'string'}),
        defineField({name: 'placeholder', type: 'string'}),
      ],
    }),
    defineField({
      name: 'peopleField',
      title: 'Field 3 — People',
      type: 'object',
      options: {collapsible: true, collapsed: false},
      fields: [
        defineField({name: 'label', type: 'string'}),
        defineField({name: 'defaultNumber', type: 'number'}),
        defineField({name: 'singularLabel', type: 'string'}),
        defineField({name: 'pluralLabel', type: 'string'}),
      ],
    }),
    defineField({
      name: 'contactField',
      title: 'Field 4 — Contact',
      type: 'object',
      options: {collapsible: true, collapsed: false},
      fields: [
        defineField({name: 'label', type: 'string', title: 'Section label'}),
        defineField({
          name: 'options',
          type: 'array',
          of: [experienceContactOption],
        }),
      ],
    }),
    defineField({
      name: 'finalStep',
      title: 'Final step — Thank you',
      type: 'object',
      options: {collapsible: true, collapsed: false},
      fields: [
        defineField({name: 'title', type: 'string'}),
        defineField({name: 'subtitle', type: 'text', rows: 3}),
        defineField({name: 'summaryTitle', type: 'string'}),
        defineField({
          name: 'summaryFields',
          type: 'object',
          fields: [
            defineField({name: 'experienceLabel', type: 'string'}),
            defineField({name: 'nameLabel', type: 'string'}),
            defineField({name: 'dateLabel', type: 'string'}),
            defineField({name: 'peopleLabel', type: 'string'}),
            defineField({name: 'contactViaLabel', type: 'string'}),
            defineField({name: 'noteLabel', type: 'string'}),
          ],
        }),
        defineField({name: 'finalCtaLabel', type: 'string'}),
      ],
    }),
  ],
})

/**
 * Singleton — booking modal copy. Prefer `generalModal` / `experienceModal`.
 * Legacy `planJourney` / `experienceBooking` are hidden but preserved for old datasets.
 */
export const bookingModalSettings = defineType({
  name: 'bookingModalSettings',
  title: 'Booking modals',
  type: 'document',
  groups: [
    {name: 'general', title: 'General modal', default: true},
    {name: 'experience', title: 'Experience modal'},
  ],
  fields: [
    generalModalObject,
    experienceModalObject,
    defineField({
      name: 'planJourney',
      title: 'Legacy — Plan journey (hidden)',
      type: 'object',
      fields: legacyPlanJourneyFields,
      hidden: () => true,
    }),
    defineField({
      name: 'experienceBooking',
      title: 'Legacy — Experience booking (hidden)',
      type: 'object',
      fields: legacyExperienceFields,
      hidden: () => true,
    }),
  ],
  preview: {
    prepare: () => ({title: 'Booking modals'}),
  },
})
