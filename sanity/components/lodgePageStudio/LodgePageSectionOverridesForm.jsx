'use client'

import {useCallback, useMemo} from 'react'
import {Stack, Card, Text, TextInput, TextArea, Box, Checkbox} from '@sanity/ui'
import {PatchEvent, set, useFormCallbacks, useFormValue} from 'sanity'
import {getLodgePageSectionsCopyKey} from '../../lib/lodgePageStudioSectionMap'

/**
 * Overrides eyebrow / title / body en `lodgePage.sections.<key>` (misma forma que el front fusiona).
 */
export function LodgePageSectionOverridesForm({previewSection}) {
  const {onChange: documentOnChange} = useFormCallbacks()
  const copyKey = getLodgePageSectionsCopyKey(previewSection)
  const sectionsRaw = useFormValue(['sections'])

  const row = useMemo(() => {
    const sections = sectionsRaw || {}
    return copyKey ? sections[copyKey] || {} : {}
  }, [sectionsRaw, copyKey])

  const emitPatch = useCallback(
    (field, value) => {
      if (!copyKey || !documentOnChange) return
      const path = ['sections', copyKey, field]
      documentOnChange(PatchEvent.from(set(value, path)))
    },
    [copyKey, documentOnChange],
  )

  if (!copyKey) {
    return null
  }

  const visible = row?.visible !== false
  const eyebrow = row?.eyebrow ?? ''
  const title = row?.title ?? ''
  const body = row?.body ?? ''

  return (
    <Card padding={4} border radius={2} tone="transparent" style={{marginTop: 12}}>
      <Stack space={4}>
        <div>
          <Text size={0} weight="semibold" style={{textTransform: 'uppercase', letterSpacing: 0.4}}>
            3. Edición de esta landing
          </Text>
          <Text size={1} muted style={{marginTop: 6, lineHeight: 1.5}}>
            Rótulos y texto de cabecera de esta sección. Si dejas un campo vacío, se mantiene el texto del
            Lodge o el del sitio.
          </Text>
        </div>

        <Card padding={3} border radius={1} tone="default">
          <Stack space={3}>
            <Checkbox
              checked={visible}
              onChange={(e) => emitPatch('visible', e.currentTarget.checked)}
              label="Show this section on the website"
            />
            <Box>
              <Text size={1} weight="semibold" style={{marginBottom: 6}}>
                Eyebrow
              </Text>
              <TextInput value={eyebrow} onChange={(ev) => emitPatch('eyebrow', ev.currentTarget.value)} />
            </Box>
            <Box>
              <Text size={1} weight="semibold" style={{marginBottom: 6}}>
                Título
              </Text>
              <TextInput value={title} onChange={(ev) => emitPatch('title', ev.currentTarget.value)} />
            </Box>
            <Box>
              <Text size={1} weight="semibold" style={{marginBottom: 6}}>
                Cuerpo / introducción
              </Text>
              <TextArea rows={4} value={body} onChange={(ev) => emitPatch('body', ev.currentTarget.value)} />
            </Box>
          </Stack>
        </Card>
      </Stack>
    </Card>
  )
}
