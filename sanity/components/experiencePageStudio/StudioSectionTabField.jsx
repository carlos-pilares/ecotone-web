'use client'

import {Stack} from '@sanity/ui'
import {StudioPreviewInput} from './StudioPreviewInput'
import {SectionModuleOverridesForm} from './SectionModuleOverridesForm'
import {getModuleKeyForPreviewSection} from '../../lib/pageModuleShared'

/**
 * Preview canónico + formulario de overrides (sectionModules) en la misma pestaña.
 * El campo de schema sigue siendo el string stPrev*; no se añaden claves al documento.
 */
export function StudioSectionTabField(props) {
  const section = props?.schemaType?.options?.section
  const hidePreview = Boolean(props?.schemaType?.options?.hidePreview)
  const moduleKey = getModuleKeyForPreviewSection(section)

  return (
    <Stack space={4}>
      {!hidePreview ? <StudioPreviewInput {...props} /> : null}
      {moduleKey ? <SectionModuleOverridesForm previewSection={section} onRootPatch={props.onChange} /> : null}
    </Stack>
  )
}
