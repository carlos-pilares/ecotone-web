'use client'

import {LodgePageSectionOverridesForm} from './LodgePageSectionOverridesForm'

/** Editorial copy for one lodge landing section (writes `lodgePage.sections.*`). */
export function StudioLodgePageSectionCopyInput(props) {
  const section = props?.schemaType?.options?.section
  return <LodgePageSectionOverridesForm previewSection={section} />
}
