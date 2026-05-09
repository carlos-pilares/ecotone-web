'use client'

import {Select, Stack} from '@sanity/ui'

import {set, unset} from 'sanity'

import {
  SMART_LINK_INTERNAL_PAGE_LEGACY_ALIASES,
  SMART_LINK_WEBSITE_PAGE_EDITOR_OPTIONS,
} from '../../schemaTypes/objects/smartLinkEditorOptions'

export function SmartLinkInternalPageInput(props) {
  const {value, onChange, id, readOnly} = props
  const current = typeof value === 'string' ? value.trim() : ''
  const editorValues = new Set(SMART_LINK_WEBSITE_PAGE_EDITOR_OPTIONS.map((o) => o.value))
  const includesCurrent = current ? editorValues.has(current) : false
  const isLegacyAlias = SMART_LINK_INTERNAL_PAGE_LEGACY_ALIASES.has(current)

  return (
    <Stack space={3}>
      <Select
        id={id}
        value={current}
        disabled={readOnly}
        onChange={(event) => {
          const next = event.currentTarget.value
          onChange(next ? set(next) : unset())
        }}
      >
        <option value="">Select site page</option>
        {!includesCurrent && current ? (
          <option value={current}>
            {isLegacyAlias
              ? `Saved legacy key → ${current} (pick “About” or “Routes” above to normalize)`
              : `Saved value → ${current}`}
          </option>
        ) : null}
        {SMART_LINK_WEBSITE_PAGE_EDITOR_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.title}
          </option>
        ))}
      </Select>
    </Stack>
  )
}
