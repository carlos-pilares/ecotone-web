/** Shared GROQ projection for ExperienceKcOrderInput (stable `_key`s for pickers). */
export const experienceKcOrderDocProjection = /* groq */ `{
  highlights,
  snapshotHighlights[]{ _key, title, subtitle },
  "highlightsKeyed": highlights[] { "_key": _key, "text": @ },
  "includesKeyed": includes[] { "_key": _key, "text": @ },
  includes,
  "notIncludesKeyed": notIncludes[] { "_key": _key, "text": @ },
  notIncludes,
  "importantNotesKeyed": importantNotes[] { "_key": _key, "text": @ },
  wildlife[]{ _key, name, description, iconType, badge },
  faqs[]{ _key, question },
  travelerGuideSubsections[]{ _key, title, displayType, "rowCount": count(rows) },
  knowledgeResources[]{ _key, title },
  resources[]{ _key, title },
  termsPanels[]{ _key, title },
  gallery[]{ _key, mediaType, title, caption, alt },
  lodgePresentationRows[] {
    _key,
    nightsLabel,
    "lodgeName": lodge->name
  }
}`
