'use client'

import {Stack, Text, Switch, Flex} from '@sanity/ui'

const LABEL = 'Show this section on the website'
const HELPER =
  'When off, this section is hidden on the live site and removed from in-page navigation.'

/**
 * Shared section visibility control (toggle + label + helper) for all landing CMS pages.
 */
export function PageSectionVisibilityInput(props) {
  const {value, onChange, readOnly} = props
  const checked = value !== false

  return (
    <Stack space={3} paddingBottom={3}>
      <Flex align="center" gap={3}>
        <Switch
          checked={checked}
          disabled={readOnly}
          onChange={(event) => onChange(event.currentTarget.checked)}
        />
        <Text size={2} weight="medium">
          {LABEL}
        </Text>
      </Flex>
      <Text size={1} muted>
        {HELPER}
      </Text>
    </Stack>
  )
}
