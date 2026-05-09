/**
 * Resolved copy for booking modals. Merges `generalModal` / `experienceModal` from CMS
 * over code defaults; falls back to legacy `planJourney` / `experienceBooking` when new blocks are absent.
 */

export type TravellerIconKey = 'family' | 'academic' | 'independent' | 'company'

export type PlanStep1OptionCopy = {
  iconKey: TravellerIconKey
  title: string
  subtitle: string
  /** Stored in draft / WhatsApp */
  valueKey: string
  ctaLabel?: string
}

export type PlanSeasonOptionCopy = {
  title: string
  subtitle: string
  valueKey: string
}

export type PlanContactOptionCopy = {
  iconKey: TravellerIconKey
  title: string
  subtitle: string
  type: 'whatsapp' | 'email'
  /** Digits for wa.me; empty → use site default */
  whatsappNumber: string | null
  ctaLabel: string
  endMessage: string
  emailField: { label: string; placeholder: string }
  messageField: { label: string; helperText: string; placeholder: string }
}

/** Inline validation copy — CMS `validation` object overrides; code supplies defaults. */
export type PlanModalValidationCopy = {
  nameRequired: string
  travellerTypeRequired: string
  seasonRequired: string
  peopleMinRequired: string
  contactRequired: string
  emailRequired: string
}

export type ExperienceModalValidationCopy = {
  nameRequired: string
  travelDateRequired: string
  peopleMinRequired: string
  contactRequired: string
  emailRequired: string
}

export type GeneralModalCopy = {
  closeLabel: string
  emailInvalidMessage: string
  validation: PlanModalValidationCopy
  step1: {
    title: string
    subtitle: string
    nameField: { label: string; placeholder: string }
    optionsField: {
      label: string
      options: PlanStep1OptionCopy[]
    }
  }
  step2: {
    title: string
    subtitle: string
    seasonField: { label: string; options: PlanSeasonOptionCopy[] }
    peopleField: {
      label: string
      defaultNumber: number
      singularLabel: string
      pluralLabel: string
    }
    backCtaLabel: string
    forwardCtaLabel: string
  }
  step3: {
    title: string
    subtitle: string
    contactField: {
      label: string
      options: PlanContactOptionCopy[]
    }
    backCtaLabel: string
  }
  finalStep: {
    title: string
    subtitle: string
    summaryTitle?: string
    summaryFields: {
      nameLabel: string
      travellerTypeLabel: string
      seasonLabel: string
      peopleLabel: string
      contactViaLabel: string
      noteLabel: string
    }
    finalCtaLabel: string
  }
}

export type ExperienceContactOptionCopy = {
  iconKey: TravellerIconKey
  title: string
  subtitle: string
  type: 'whatsapp' | 'email'
  whatsappNumber: string | null
  ctaLabel: string
  endMessage: string
  emailField: { label: string; placeholder: string }
  messageField: { label: string; helperText: string; placeholder: string }
}

export type ExperienceModalCopy = {
  closeLabel: string
  emailInvalidMessage: string
  validation: ExperienceModalValidationCopy
  intro: { title: string; subtitle: string }
  nameField: { label: string; placeholder: string }
  travelDateField: { label: string; placeholder: string }
  peopleField: {
    label: string
    defaultNumber: number
    singularLabel: string
    pluralLabel: string
  }
  contactField: {
    label: string
    options: ExperienceContactOptionCopy[]
  }
  finalStep: {
    title: string
    subtitle: string
    summaryTitle?: string
    summaryFields: {
      experienceLabel: string
      nameLabel: string
      dateLabel: string
      peopleLabel: string
      contactViaLabel: string
      noteLabel: string
    }
    finalCtaLabel: string
  }
}

export type BookingModalCopy = {
  plan: GeneralModalCopy
  experience: ExperienceModalCopy
}

const DEF_STEP1_OPTS: PlanStep1OptionCopy[] = [
  { iconKey: 'family', title: 'Family', subtitle: 'With children or partner', valueKey: 'Family' },
  { iconKey: 'academic', title: 'Academic / Research', subtitle: 'University, volunteers', valueKey: 'Academic / Research' },
  { iconKey: 'independent', title: 'Independent', subtitle: 'Solo or couple', valueKey: 'Independent' },
  { iconKey: 'company', title: 'Company / Group', subtitle: 'Corporate retreat, team', valueKey: 'Company / group' },
]

const DEF_SEASON: PlanSeasonOptionCopy[] = [
  { title: 'Jan – Mar', subtitle: 'Wet · lush', valueKey: 'Jan – Mar · wet · lush' },
  { title: 'Apr – Jun', subtitle: 'Transition', valueKey: 'Apr – Jun · transition' },
  { title: 'Jul – Sep', subtitle: 'Dry · best', valueKey: 'Jul – Sep · dry · best' },
  { title: 'Oct – Dec', subtitle: 'Wet · quiet', valueKey: 'Oct – Dec · wet · quiet' },
]

const DEF_PLAN_CONTACT: PlanContactOptionCopy[] = [
  {
    iconKey: 'independent',
    title: 'WhatsApp',
    subtitle: 'Fast, conversational',
    type: 'whatsapp',
    whatsappNumber: null,
    ctaLabel: 'Book via WhatsApp',
    endMessage: "We'll confirm availability and help you choose a program.",
    emailField: { label: 'Email', placeholder: 'your@email.com' },
    messageField: { label: 'Message', helperText: '(optional)', placeholder: 'Any specific questions? (optional)' },
  },
  {
    iconKey: 'company',
    title: 'Email',
    subtitle: 'Formal, detailed',
    type: 'email',
    whatsappNumber: null,
    ctaLabel: 'Send enquiry by email',
    endMessage: "We'll reply by email — usually within one business day.",
    emailField: { label: 'Email', placeholder: 'your@email.com' },
    messageField: { label: 'Message', helperText: '(optional)', placeholder: 'Any specific questions? (optional)' },
  },
]

const DEF_EXP_CONTACT: ExperienceContactOptionCopy[] = [
  {
    iconKey: 'independent',
    title: 'WhatsApp',
    subtitle: 'Fast, conversational',
    type: 'whatsapp',
    whatsappNumber: null,
    ctaLabel: 'Book via WhatsApp',
    endMessage: "We'll confirm availability and send a payment link",
    emailField: { label: 'Email', placeholder: 'your@email.com' },
    messageField: { label: 'Message', helperText: '(optional)', placeholder: 'Any specific questions? (optional)' },
  },
  {
    iconKey: 'company',
    title: 'Email',
    subtitle: 'Formal, detailed',
    type: 'email',
    whatsappNumber: null,
    ctaLabel: 'Send booking request',
    endMessage: "We'll confirm availability and send a payment link",
    emailField: { label: 'Email', placeholder: 'your@email.com' },
    messageField: { label: 'Message', helperText: '(optional)', placeholder: 'Any specific questions? (optional)' },
  },
]

const DEF_PLAN_VALIDATION: PlanModalValidationCopy = {
  nameRequired: 'Please enter your name.',
  travellerTypeRequired: 'Please choose how you are travelling.',
  seasonRequired: 'Please choose a season or period.',
  peopleMinRequired: 'Party size must be at least 1.',
  contactRequired: 'Please choose WhatsApp or Email.',
  emailRequired: 'Please enter your email address.',
}

const DEF_EXP_VALIDATION: ExperienceModalValidationCopy = {
  nameRequired: 'Please enter your name.',
  travelDateRequired: 'Please enter an approximate travel date.',
  peopleMinRequired: 'Party size must be at least 1.',
  contactRequired: 'Please choose WhatsApp or Email.',
  emailRequired: 'Please enter your email address.',
}

export const DEFAULT_BOOKING_MODAL_COPY: BookingModalCopy = {
  plan: {
    closeLabel: 'Close',
    emailInvalidMessage: 'Please enter a valid email address.',
    validation: { ...DEF_PLAN_VALIDATION },
    step1: {
      title: 'Plan your journey',
      subtitle: 'A few questions to help us suggest the right program',
      nameField: { label: 'Your name', placeholder: 'First name' },
      optionsField: {
        label: "I'm travelling as",
        options: DEF_STEP1_OPTS,
      },
    },
    step2: {
      title: 'When are you thinking?',
      subtitle: "An approximate idea is enough — we'll confirm dates together",
      seasonField: { label: 'Season or period', options: DEF_SEASON },
      peopleField: {
        label: 'Number of people',
        defaultNumber: 2,
        singularLabel: 'traveller',
        pluralLabel: 'travellers',
      },
      backCtaLabel: 'Back',
      forwardCtaLabel: 'Continue',
    },
    step3: {
      title: 'How would you like us to reply?',
      subtitle: 'We respond within 24 hours',
      contactField: {
        label: 'Contact via',
        options: DEF_PLAN_CONTACT,
      },
      backCtaLabel: 'Back',
    },
    finalStep: {
      title: 'Message sent!',
      subtitle: "We've received your enquiry and will get back to you shortly.",
      summaryTitle: undefined,
      summaryFields: {
        nameLabel: 'Name',
        travellerTypeLabel: 'Travelling as',
        seasonLabel: 'Season',
        peopleLabel: 'People',
        contactViaLabel: 'Contact via',
        noteLabel: 'Note',
      },
      finalCtaLabel: 'Close',
    },
  },
  experience: {
    closeLabel: 'Close',
    emailInvalidMessage: 'Please enter a valid email address.',
    validation: { ...DEF_EXP_VALIDATION },
    intro: {
      title: 'Book this experience',
      subtitle: "Tell us about your trip and we'll confirm availability",
    },
    nameField: { label: 'Your name', placeholder: 'First name' },
    travelDateField: { label: 'Approx. travel date', placeholder: 'e.g. July 2026' },
    peopleField: {
      label: 'Number of people',
      defaultNumber: 2,
      singularLabel: 'traveller',
      pluralLabel: 'travellers',
    },
    contactField: {
      label: 'How would you like us to reply?',
      options: DEF_EXP_CONTACT,
    },
    finalStep: {
      title: 'Message sent!',
      subtitle: "We've received your enquiry and will get back to you shortly.",
      summaryFields: {
        experienceLabel: 'Experience',
        nameLabel: 'Name',
        dateLabel: 'Approx. date',
        peopleLabel: 'People',
        contactViaLabel: 'Contact via',
        noteLabel: 'Note',
      },
      finalCtaLabel: 'Close',
    },
  },
}

function s(v: unknown): string | undefined {
  return typeof v === 'string' ? v.trim() || undefined : undefined
}

function n(v: unknown, fallback: number): number {
  if (typeof v === 'number' && Number.isFinite(v)) {
    const x = Math.round(v)
    return Math.min(99, Math.max(1, x))
  }
  return fallback
}

function normalizeIconKey(raw: unknown): TravellerIconKey {
  const t = s(raw)?.toLowerCase()
  if (t === 'family') return 'family'
  if (t === 'academic') return 'academic'
  if (t === 'company') return 'company'
  return 'independent'
}

function seasonValueKey(title: string, subtitle: string, fallback?: string): string {
  const a = title.trim()
  const b = subtitle.trim()
  if (a && b) return `${a} · ${b}`
  if (a) return a
  return fallback ?? ''
}

function contactType(raw: unknown): 'whatsapp' | 'email' {
  const t = s(raw)?.toLowerCase()
  return t === 'email' ? 'email' : 'whatsapp'
}

function obj(o: unknown): Record<string, unknown> | undefined {
  return o && typeof o === 'object' && !Array.isArray(o) ? (o as Record<string, unknown>) : undefined
}

function mergePlanValidation(raw: Record<string, unknown> | undefined, def: PlanModalValidationCopy): PlanModalValidationCopy {
  if (!raw) return { ...def }
  return {
    nameRequired: s(raw.nameRequired) ?? def.nameRequired,
    travellerTypeRequired: s(raw.travellerTypeRequired) ?? def.travellerTypeRequired,
    seasonRequired: s(raw.seasonRequired) ?? def.seasonRequired,
    peopleMinRequired: s(raw.peopleMinRequired) ?? def.peopleMinRequired,
    contactRequired: s(raw.contactRequired) ?? def.contactRequired,
    emailRequired: s(raw.emailRequired) ?? def.emailRequired,
  }
}

function mergeExperienceValidation(raw: Record<string, unknown> | undefined, def: ExperienceModalValidationCopy): ExperienceModalValidationCopy {
  if (!raw) return { ...def }
  return {
    nameRequired: s(raw.nameRequired) ?? def.nameRequired,
    travelDateRequired: s(raw.travelDateRequired) ?? def.travelDateRequired,
    peopleMinRequired: s(raw.peopleMinRequired) ?? def.peopleMinRequired,
    contactRequired: s(raw.contactRequired) ?? def.contactRequired,
    emailRequired: s(raw.emailRequired) ?? def.emailRequired,
  }
}

function mergePlanStep1Options(
  cms: Array<Record<string, unknown>> | undefined,
  def: PlanStep1OptionCopy[],
): PlanStep1OptionCopy[] {
  if (!cms?.length) return def.map((x) => ({ ...x }))
  return cms.map((row, i) => {
    const title = s(row.title) ?? def[i]?.title ?? `Option ${i + 1}`
    const subtitle = s(row.subtitle) ?? def[i]?.subtitle ?? ''
    const valueKey = title
    return {
      iconKey: normalizeIconKey(row.iconKey),
      title,
      subtitle,
      valueKey,
      ctaLabel: s(row.ctaLabel),
    }
  })
}

function mergeSeasonOptions(
  cms: Array<Record<string, unknown>> | undefined,
  def: PlanSeasonOptionCopy[],
): PlanSeasonOptionCopy[] {
  if (!cms?.length) return def.map((x) => ({ ...x }))
  return cms.map((row, i) => {
    const title = s(row.title) ?? def[i]?.title ?? `Season ${i + 1}`
    const subtitle = s(row.subtitle) ?? def[i]?.subtitle ?? ''
    const valueKey = seasonValueKey(title, subtitle, def[i]?.valueKey)
    return { title, subtitle, valueKey }
  })
}

function mergePlanContactOptions(
  cms: Array<Record<string, unknown>> | undefined,
  def: PlanContactOptionCopy[],
): PlanContactOptionCopy[] {
  if (!cms?.length) return def.map((x) => ({ ...x, emailField: { ...x.emailField }, messageField: { ...x.messageField } }))
  return cms.map((row, i) => {
    const d = def[i] ?? def[def.length - 1]!
    const ty = contactType(row.type)
    const ef = obj(row.emailField)
    const mf = obj(row.messageField)
    const waRaw = s(row.whatsappNumber)
    const digits = waRaw ? waRaw.replace(/\D/g, '') : ''
    return {
      iconKey: normalizeIconKey(row.iconKey),
      title: s(row.title) ?? d.title,
      subtitle: s(row.subtitle) ?? d.subtitle,
      type: ty,
      whatsappNumber: digits.length >= 6 ? digits : null,
      ctaLabel: s(row.ctaLabel) ?? d.ctaLabel,
      endMessage: s(row.endMessage) ?? d.endMessage,
      emailField: {
        label: s(ef?.label) ?? d.emailField.label,
        placeholder: s(ef?.placeholder) ?? d.emailField.placeholder,
      },
      messageField: {
        label: s(mf?.label) ?? d.messageField.label,
        helperText: s(mf?.helperText) ?? d.messageField.helperText,
        placeholder: s(mf?.placeholder) ?? d.messageField.placeholder,
      },
    }
  })
}

function mergeExpContactOptions(
  cms: Array<Record<string, unknown>> | undefined,
  def: ExperienceContactOptionCopy[],
): ExperienceContactOptionCopy[] {
  if (!cms?.length) return def.map((x) => ({ ...x, emailField: { ...x.emailField }, messageField: { ...x.messageField } }))
  return cms.map((row, i) => {
    const d = def[i] ?? def[def.length - 1]!
    const ty = contactType(row.type)
    const ef = obj(row.emailField)
    const mf = obj(row.messageField)
    const waRaw = s(row.whatsappNumber)
    const digits = waRaw ? waRaw.replace(/\D/g, '') : ''
    return {
      iconKey: normalizeIconKey(row.iconKey),
      title: s(row.title) ?? d.title,
      subtitle: s(row.subtitle) ?? d.subtitle,
      type: ty,
      whatsappNumber: digits.length >= 6 ? digits : null,
      ctaLabel: s(row.ctaLabel) ?? d.ctaLabel,
      endMessage: s(row.endMessage) ?? d.endMessage,
      emailField: {
        label: s(ef?.label) ?? d.emailField.label,
        placeholder: s(ef?.placeholder) ?? d.emailField.placeholder,
      },
      messageField: {
        label: s(mf?.label) ?? d.messageField.label,
        helperText: s(mf?.helperText) ?? d.messageField.helperText,
        placeholder: s(mf?.placeholder) ?? d.messageField.placeholder,
      },
    }
  })
}

type RawRow = Record<string, unknown> | null | undefined

export type BookingModalSettingsRow = {
  generalModal?: RawRow
  experienceModal?: RawRow
  planJourney?: RawRow
  experienceBooking?: RawRow
} | null

function hasGeneralShape(g: RawRow): boolean {
  return !!(g && (obj(g.step1) || obj(g.step2) || obj(g.step3) || obj(g.finalStep)))
}

function resolveFromLegacyPlan(raw: RawRow): GeneralModalCopy {
  const p = raw ?? {}
  const d = DEFAULT_BOOKING_MODAL_COPY.plan
  const stepTitles: [string, string, string] = [
    s(p.step1Title ?? p.title) ?? d.step1.title,
    s(p.step2Title) ?? d.step2.title,
    s(p.step3Title) ?? d.step3.title,
  ]
  const stepSubs: [string, string, string] = [
    s(p.step1Subtitle ?? p.subtitle) ?? d.step1.subtitle,
    s(p.step2Subtitle) ?? d.step2.subtitle,
    s(p.step3Subtitle ?? p.responseTimeText) ?? d.step3.subtitle,
  ]

  const legacyTrav = (p.travellerOptions as Array<Record<string, unknown>> | undefined) ?? []
  const step1Opts: PlanStep1OptionCopy[] = legacyTrav.length
    ? legacyTrav.map((row) => ({
        iconKey: normalizeIconKey(row.iconKey),
        title: s(row.title) ?? s(row.key) ?? 'Option',
        subtitle: s(row.description) ?? '',
        valueKey: s(row.key) ?? s(row.title) ?? 'Option',
      }))
    : d.step1.optionsField.options.map((x) => ({ ...x }))

  const legacySeason = (p.seasonOptions as Array<Record<string, unknown>> | undefined) ?? []
  const seasonOpts: PlanSeasonOptionCopy[] = legacySeason.length
    ? legacySeason.map((row) => {
        const title = s(row.title) ?? ''
        const subtitle = s(row.description) ?? ''
        return {
          title,
          subtitle,
          valueKey: s(row.key) ?? seasonValueKey(title, subtitle),
        }
      })
    : d.step2.seasonField.options.map((x) => ({ ...x }))

  const waOpt: PlanContactOptionCopy = {
    ...d.step3.contactField.options[0]!,
    title: s(p.whatsappLabel) ?? d.step3.contactField.options[0]!.title,
    subtitle: s(p.whatsappDescription) ?? d.step3.contactField.options[0]!.subtitle,
    ctaLabel: s(p.whatsappCtaLabel) ?? d.step3.contactField.options[0]!.ctaLabel,
    endMessage: s(p.footerNoteWhatsapp) ?? d.step3.contactField.options[0]!.endMessage,
    emailField: {
      label: s(p.emailFieldLabel) ?? d.step3.contactField.options[0]!.emailField.label,
      placeholder: s(p.emailPlaceholder) ?? d.step3.contactField.options[0]!.emailField.placeholder,
    },
    messageField: {
      label: s(p.messageLabel) ?? d.step3.contactField.options[0]!.messageField.label,
      helperText: s(p.messageOptionalHint) ?? d.step3.contactField.options[0]!.messageField.helperText,
      placeholder: s(p.messagePlaceholder) ?? d.step3.contactField.options[0]!.messageField.placeholder,
    },
  }
  const emOpt: PlanContactOptionCopy = {
    ...d.step3.contactField.options[1]!,
    title: s(p.emailLabel) ?? d.step3.contactField.options[1]!.title,
    subtitle: s(p.emailDescription) ?? d.step3.contactField.options[1]!.subtitle,
    ctaLabel: s(p.emailCtaLabel) ?? d.step3.contactField.options[1]!.ctaLabel,
    endMessage: s(p.footerNoteEmail) ?? d.step3.contactField.options[1]!.endMessage,
    emailField: {
      label: s(p.emailFieldLabel) ?? d.step3.contactField.options[1]!.emailField.label,
      placeholder: s(p.emailPlaceholder) ?? d.step3.contactField.options[1]!.emailField.placeholder,
    },
    messageField: {
      label: s(p.messageLabel) ?? d.step3.contactField.options[1]!.messageField.label,
      helperText: s(p.messageOptionalHint) ?? d.step3.contactField.options[1]!.messageField.helperText,
      placeholder: s(p.messagePlaceholder) ?? d.step3.contactField.options[1]!.messageField.placeholder,
    },
  }

  return {
    closeLabel: s(p.closeLabel) ?? d.closeLabel,
    emailInvalidMessage: s(p.emailInvalidMessage) ?? d.emailInvalidMessage,
    validation: mergePlanValidation(obj(p.validation), d.validation),
    step1: {
      title: stepTitles[0]!,
      subtitle: stepSubs[0]!,
      nameField: {
        label: s(p.nameLabel) ?? d.step1.nameField.label,
        placeholder: s(p.namePlaceholder) ?? d.step1.nameField.placeholder,
      },
      optionsField: {
        label: s(p.travellerQuestionLabel) ?? d.step1.optionsField.label,
        options: step1Opts,
      },
    },
    step2: {
      title: stepTitles[1]!,
      subtitle: stepSubs[1]!,
      seasonField: {
        label: s(p.seasonQuestionLabel) ?? d.step2.seasonField.label,
        options: seasonOpts,
      },
      peopleField: {
        label: s(p.peopleLabel) ?? d.step2.peopleField.label,
        defaultNumber: d.step2.peopleField.defaultNumber,
        singularLabel: d.step2.peopleField.singularLabel,
        pluralLabel: d.step2.peopleField.pluralLabel,
      },
      backCtaLabel: s(p.backCtaLabel) ?? d.step2.backCtaLabel,
      forwardCtaLabel: s(p.continueCtaLabel) ?? d.step2.forwardCtaLabel,
    },
    step3: {
      title: stepTitles[2]!,
      subtitle: stepSubs[2]!,
      contactField: {
        label: s(p.contactQuestionLabel) ?? d.step3.contactField.label,
        options: [waOpt, emOpt],
      },
      backCtaLabel: s(p.backCtaLabel) ?? d.step3.backCtaLabel,
    },
    finalStep: {
      title: s(p.thankYouTitle) ?? d.finalStep.title,
      subtitle: s(p.thankYouBody) ?? d.finalStep.subtitle,
      summaryTitle: d.finalStep.summaryTitle,
      summaryFields: { ...d.finalStep.summaryFields },
      finalCtaLabel: s(p.closeLabel) ?? d.finalStep.finalCtaLabel,
    },
  }
}

function resolveFromLegacyExperience(raw: RawRow): ExperienceModalCopy {
  const e = raw ?? {}
  const d = DEFAULT_BOOKING_MODAL_COPY.experience
  const wa: ExperienceContactOptionCopy = {
    ...d.contactField.options[0]!,
    title: s(e.whatsappLabel) ?? d.contactField.options[0]!.title,
    subtitle: s(e.whatsappDescription) ?? d.contactField.options[0]!.subtitle,
    ctaLabel: s(e.whatsappCtaLabel) ?? d.contactField.options[0]!.ctaLabel,
    endMessage: s(e.footerNote) ?? d.contactField.options[0]!.endMessage,
    emailField: {
      label: s(e.emailFieldLabel) ?? d.contactField.options[0]!.emailField.label,
      placeholder: s(e.emailPlaceholder) ?? d.contactField.options[0]!.emailField.placeholder,
    },
    messageField: {
      label: s(e.messageLabel) ?? d.contactField.options[0]!.messageField.label,
      helperText: s(e.messageOptionalHint) ?? d.contactField.options[0]!.messageField.helperText,
      placeholder: s(e.messagePlaceholder) ?? d.contactField.options[0]!.messageField.placeholder,
    },
  }
  const em: ExperienceContactOptionCopy = {
    ...d.contactField.options[1]!,
    title: s(e.emailLabel) ?? d.contactField.options[1]!.title,
    subtitle: s(e.emailDescription) ?? d.contactField.options[1]!.subtitle,
    ctaLabel: s(e.emailCtaLabel) ?? d.contactField.options[1]!.ctaLabel,
    endMessage: s(e.footerNote) ?? d.contactField.options[1]!.endMessage,
    emailField: {
      label: s(e.emailFieldLabel) ?? d.contactField.options[1]!.emailField.label,
      placeholder: s(e.emailPlaceholder) ?? d.contactField.options[1]!.emailField.placeholder,
    },
    messageField: {
      label: s(e.messageLabel) ?? d.contactField.options[1]!.messageField.label,
      helperText: s(e.messageOptionalHint) ?? d.contactField.options[1]!.messageField.helperText,
      placeholder: s(e.messagePlaceholder) ?? d.contactField.options[1]!.messageField.placeholder,
    },
  }
  return {
    closeLabel: s(e.closeLabel) ?? d.closeLabel,
    emailInvalidMessage: s(e.emailInvalidMessage) ?? d.emailInvalidMessage,
    validation: mergeExperienceValidation(obj(e.validation), d.validation),
    intro: {
      title: s(e.title) ?? d.intro.title,
      subtitle: s(e.subtitle) ?? d.intro.subtitle,
    },
    nameField: {
      label: s(e.nameLabel) ?? d.nameField.label,
      placeholder: s(e.namePlaceholder) ?? d.nameField.placeholder,
    },
    travelDateField: {
      label: s(e.travelDateLabel) ?? d.travelDateField.label,
      placeholder: s(e.travelDatePlaceholder) ?? d.travelDateField.placeholder,
    },
    peopleField: {
      label: s(e.peopleLabel) ?? d.peopleField.label,
      defaultNumber: d.peopleField.defaultNumber,
      singularLabel: d.peopleField.singularLabel,
      pluralLabel: d.peopleField.pluralLabel,
    },
    contactField: {
      label: s(e.contactQuestionLabel) ?? d.contactField.label,
      options: [wa, em],
    },
    finalStep: {
      title: s(e.thankYouTitle) ?? d.finalStep.title,
      subtitle: s(e.thankYouBody) ?? d.finalStep.subtitle,
      summaryFields: { ...d.finalStep.summaryFields },
      finalCtaLabel: s(e.closeLabel) ?? d.finalStep.finalCtaLabel,
    },
  }
}

function resolveGeneralModal(g: RawRow | undefined, legacy: RawRow | undefined): GeneralModalCopy {
  if (!g || !hasGeneralShape(g)) {
    if (legacy && Object.keys(legacy).length > 0) return resolveFromLegacyPlan(legacy)
    return JSON.parse(JSON.stringify(DEFAULT_BOOKING_MODAL_COPY.plan)) as GeneralModalCopy
  }
  const d = DEFAULT_BOOKING_MODAL_COPY.plan
  const s1 = obj(g.step1)
  const s2 = obj(g.step2)
  const s3 = obj(g.step3)
  const fin = obj(g.finalStep)
  const nf = obj(s1?.nameField)
  const of = obj(s1?.optionsField)
  const sf = obj(s2?.seasonField)
  const pf = obj(s2?.peopleField)
  const cf = obj(s3?.contactField)
  const sum = obj(fin?.summaryFields)
  const val = obj(g.validation)

  const step1Opts = mergePlanStep1Options(of?.options as Array<Record<string, unknown>> | undefined, d.step1.optionsField.options)

  const seasonOpts = mergeSeasonOptions(sf?.options as Array<Record<string, unknown>> | undefined, d.step2.seasonField.options)

  const contactOpts = mergePlanContactOptions(cf?.options as Array<Record<string, unknown>> | undefined, d.step3.contactField.options)
  const safeContact = contactOpts.length ? contactOpts : d.step3.contactField.options.map((x) => ({ ...x }))

  return {
    closeLabel: s(g.closeLabel) ?? d.closeLabel,
    emailInvalidMessage: s(g.emailInvalidMessage) ?? d.emailInvalidMessage,
    validation: mergePlanValidation(val, d.validation),
    step1: {
      title: s(s1?.title) ?? d.step1.title,
      subtitle: s(s1?.subtitle) ?? d.step1.subtitle,
      nameField: {
        label: s(nf?.label) ?? d.step1.nameField.label,
        placeholder: s(nf?.placeholder) ?? d.step1.nameField.placeholder,
      },
      optionsField: {
        label: s(of?.label) ?? d.step1.optionsField.label,
        options: step1Opts,
      },
    },
    step2: {
      title: s(s2?.title) ?? d.step2.title,
      subtitle: s(s2?.subtitle) ?? d.step2.subtitle,
      seasonField: {
        label: s(sf?.label) ?? d.step2.seasonField.label,
        options: seasonOpts,
      },
      peopleField: {
        label: s(pf?.label) ?? d.step2.peopleField.label,
        defaultNumber: n(pf?.defaultNumber, d.step2.peopleField.defaultNumber),
        singularLabel: s(pf?.singularLabel) ?? d.step2.peopleField.singularLabel,
        pluralLabel: s(pf?.pluralLabel) ?? d.step2.peopleField.pluralLabel,
      },
      backCtaLabel: s(s2?.backCtaLabel) ?? d.step2.backCtaLabel,
      forwardCtaLabel: s(s2?.forwardCtaLabel) ?? d.step2.forwardCtaLabel,
    },
    step3: {
      title: s(s3?.title) ?? d.step3.title,
      subtitle: s(s3?.subtitle) ?? d.step3.subtitle,
      contactField: {
        label: s(cf?.label) ?? d.step3.contactField.label,
        options: safeContact,
      },
      backCtaLabel: s(s3?.backCtaLabel) ?? d.step3.backCtaLabel,
    },
    finalStep: {
      title: s(fin?.title) ?? d.finalStep.title,
      subtitle: s(fin?.subtitle) ?? d.finalStep.subtitle,
      summaryTitle: s(fin?.summaryTitle) ?? d.finalStep.summaryTitle,
      summaryFields: {
        nameLabel: s(sum?.nameLabel) ?? d.finalStep.summaryFields.nameLabel,
        travellerTypeLabel: s(sum?.travellerTypeLabel) ?? d.finalStep.summaryFields.travellerTypeLabel,
        seasonLabel: s(sum?.seasonLabel) ?? d.finalStep.summaryFields.seasonLabel,
        peopleLabel: s(sum?.peopleLabel) ?? d.finalStep.summaryFields.peopleLabel,
        contactViaLabel: s(sum?.contactViaLabel) ?? d.finalStep.summaryFields.contactViaLabel,
        noteLabel: s(sum?.noteLabel) ?? d.finalStep.summaryFields.noteLabel,
      },
      finalCtaLabel: s(fin?.finalCtaLabel) ?? d.finalStep.finalCtaLabel,
    },
  }
}

function hasExperienceShape(ex: RawRow): boolean {
  return !!(ex && (obj(ex.intro) || obj(ex.nameField) || obj(ex.contactField)))
}

function resolveExperienceModal(ex: RawRow | undefined, legacy: RawRow | undefined): ExperienceModalCopy {
  if (!ex || !hasExperienceShape(ex)) {
    if (legacy && Object.keys(legacy).length > 0) return resolveFromLegacyExperience(legacy)
    return JSON.parse(JSON.stringify(DEFAULT_BOOKING_MODAL_COPY.experience)) as ExperienceModalCopy
  }
  const d = DEFAULT_BOOKING_MODAL_COPY.experience
  const intro = obj(ex.intro)
  const nf = obj(ex.nameField)
  const tf = obj(ex.travelDateField)
  const pf = obj(ex.peopleField)
  const cf = obj(ex.contactField)
  const fin = obj(ex.finalStep)
  const sum = obj(fin?.summaryFields)
  const val = obj(ex.validation)

  const opts = mergeExpContactOptions(cf?.options as Array<Record<string, unknown>> | undefined, d.contactField.options)
  const safeOpts = opts.length ? opts : d.contactField.options.map((x) => ({ ...x }))

  return {
    closeLabel: s(ex.closeLabel) ?? d.closeLabel,
    emailInvalidMessage: s(ex.emailInvalidMessage) ?? d.emailInvalidMessage,
    validation: mergeExperienceValidation(val, d.validation),
    intro: {
      title: s(intro?.title) ?? d.intro.title,
      subtitle: s(intro?.subtitle) ?? d.intro.subtitle,
    },
    nameField: {
      label: s(nf?.label) ?? d.nameField.label,
      placeholder: s(nf?.placeholder) ?? d.nameField.placeholder,
    },
    travelDateField: {
      label: s(tf?.label) ?? d.travelDateField.label,
      placeholder: s(tf?.placeholder) ?? d.travelDateField.placeholder,
    },
    peopleField: {
      label: s(pf?.label) ?? d.peopleField.label,
      defaultNumber: n(pf?.defaultNumber, d.peopleField.defaultNumber),
      singularLabel: s(pf?.singularLabel) ?? d.peopleField.singularLabel,
      pluralLabel: s(pf?.pluralLabel) ?? d.peopleField.pluralLabel,
    },
    contactField: {
      label: s(cf?.label) ?? d.contactField.label,
      options: safeOpts,
    },
    finalStep: {
      title: s(fin?.title) ?? d.finalStep.title,
      subtitle: s(fin?.subtitle) ?? d.finalStep.subtitle,
      summaryTitle: s(fin?.summaryTitle) ?? d.finalStep.summaryTitle,
      summaryFields: {
        experienceLabel: s(sum?.experienceLabel) ?? d.finalStep.summaryFields.experienceLabel,
        nameLabel: s(sum?.nameLabel) ?? d.finalStep.summaryFields.nameLabel,
        dateLabel: s(sum?.dateLabel) ?? d.finalStep.summaryFields.dateLabel,
        peopleLabel: s(sum?.peopleLabel) ?? d.finalStep.summaryFields.peopleLabel,
        contactViaLabel: s(sum?.contactViaLabel) ?? d.finalStep.summaryFields.contactViaLabel,
        noteLabel: s(sum?.noteLabel) ?? d.finalStep.summaryFields.noteLabel,
      },
      finalCtaLabel: s(fin?.finalCtaLabel) ?? d.finalStep.finalCtaLabel,
    },
  }
}

export function resolveBookingModalCopy(row: BookingModalSettingsRow): BookingModalCopy {
  return {
    plan: resolveGeneralModal(row?.generalModal, row?.planJourney),
    experience: resolveExperienceModal(row?.experienceModal, row?.experienceBooking),
  }
}

/** Pick wa.me number: option override if valid, else site default. */
export function effectiveWhatsappNumber(optionDigits: string | null | undefined, siteDefault: string): string {
  const d = optionDigits?.replace(/\D/g, '') ?? ''
  if (d.length >= 6 && d.length <= 15) return d
  return siteDefault
}
