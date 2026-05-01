'use client'

import {Card, Stack, Text} from '@sanity/ui'
import {ActualWebReadout} from '../experiencePageStudio/ActualWebReadout'

/**
 * Añade «Actual en la web» antes de los campos estándar.
 */
export function PageModuleInput(props) {
  const {renderDefault, value} = props

  if (typeof renderDefault !== 'function') {
    return (
      <Card padding={4} border tone="caution" radius={2}>
        <Text size={1}>
          No se pudieron cargar los campos. Abre el documento en la vista normal o recarga.
        </Text>
      </Card>
    )
  }

  const key = value?.key
  const fields = renderDefault(props)

  return (
    <Stack space={4}>
      {key ? <ActualWebReadout moduleKey={key} row={value} /> : null}
      {fields}
    </Stack>
  )
}
