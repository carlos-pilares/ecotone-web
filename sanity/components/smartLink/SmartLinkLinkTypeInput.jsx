'use client'

import {Card, Select, Stack, Text} from '@sanity/ui'

import {set, unset} from 'sanity'

import {
  SMART_LINK_LINK_TYPE_EDITOR_OPTIONS,
  SMART_LINK_LINK_TYPE_LEGACY,
} from '../../schemaTypes/objects/smartLinkEditorOptions'

const EDITOR_LINK_TYPE_VALUES = new Set(SMART_LINK_LINK_TYPE_EDITOR_OPTIONS.map((o) => o.value))

export function SmartLinkLinkTypeInput(props) {
  const {value, onChange, id, readOnly} = props
  const current = typeof value === 'string' ? value.trim() : ''
  const isLegacy = SMART_LINK_LINK_TYPE_LEGACY.has(current)
  const needsPlaceholder = !current || (!isLegacy && !EDITOR_LINK_TYPE_VALUES.has(current))

  return (
    <Stack space={3}>
      {isLegacy ? (
        <Card padding={3} radius={2} tone="caution">
          <Text size={1}>
            This link uses a legacy type (<code>{current}</code>). Publishing is allowed. Choose a type below to
            migrate to the current model.
          </Text>
        </Card>
      ) : null}

      <Select
        id={id}
        key={isLegacy ? `${id}-legacy` : `${id}-std`}
        value={current}
        disabled={readOnly}
        onChange={(event) => {
          const next = event.currentTarget.value
          onChange(next ? set(next) : unset())
        }}
      >
        {isLegacy ? (
          <option value={current}>Stored legacy value (pick A–F below to replace)</option>
        ) : needsPlaceholder ? (
          <option value="">Pick a link type</option>
        ) : null}
        {SMART_LINK_LINK_TYPE_EDITOR_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.title}
          </option>
        ))}
      </Select>
    </Stack>
  )
}
