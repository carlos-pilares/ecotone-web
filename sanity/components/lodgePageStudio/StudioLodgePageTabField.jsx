'use client'

import {Stack} from '@sanity/ui'
import {StudioLodgePagePreviewInput} from './StudioLodgePagePreviewInput'
import {LodgePageSectionOverridesForm} from './LodgePageSectionOverridesForm'

/**
 * Misma idea que Experience page: panel editorial por pestaña (fuente + vista previa + overrides de copy).
 */
export function StudioLodgePageTabField(props) {
  const section = props?.schemaType?.options?.section

  return (
    <Stack space={4}>
      <StudioLodgePagePreviewInput {...props} />
      <LodgePageSectionOverridesForm previewSection={section} />
    </Stack>
  )
}
