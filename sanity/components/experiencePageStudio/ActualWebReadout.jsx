'use client'

import {Card, Stack, Text} from '@sanity/ui'
import {getActualWebHeadlines} from '../../lib/webHeadlineReference'

const pre = {whiteSpace: 'pre-line', lineHeight: 1.5}

/**
 * Bloque reutilizable: qué eyebrow/H2 ve el visitante (override o referencia del sitio).
 */
export function ActualWebReadout({moduleKey, row, title = 'Actual en la web'}) {
  if (!moduleKey) return null
  const a = getActualWebHeadlines(moduleKey, row || {})

  return (
    <Card padding={3} border radius={2} tone="default">
      <Text size={0} weight="semibold" style={{textTransform: 'uppercase', letterSpacing: 0.35, opacity: 0.88}}>
        {title}
      </Text>
      <Stack space={2} style={{marginTop: 10}}>
        <Text size={1} style={pre}>
          <strong>Eyebrow actual:</strong> {a.eyebrow}
        </Text>
        <Text size={1} style={pre}>
          <strong>Título actual:</strong> {a.title}
        </Text>
      </Stack>
    </Card>
  )
}
