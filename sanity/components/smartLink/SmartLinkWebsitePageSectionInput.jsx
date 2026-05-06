'use client'

import {Card, Select, Stack, Text} from '@sanity/ui'
import {set, unset, useFormValue} from 'sanity'

import {
  getDocTypeForWebsitePageTarget,
  getSectionAnchorOptions,
} from '../../schemaTypes/objects/smartLinkSectionAnchors'

/** @param {import('sanity').StringInputProps} props */
export function SmartLinkWebsitePageSectionInput(props) {
  const {value, onChange, id, readOnly, path} = props
  const safePath = Array.isArray(path) ? path : []
  const parentPath = safePath.slice(0, -1)
  const internalPagePath = [...parentPath, 'internalPage']
  const internalPageRaw = useFormValue(internalPagePath)
  const internalPage = typeof internalPageRaw === 'string' ? internalPageRaw.trim() : ''

  const docType = getDocTypeForWebsitePageTarget(internalPage)
  const options = docType ? getSectionAnchorOptions(docType) : []

  const current = typeof value === 'string' ? value : ''
  const includesCurrent = current ? options.some((opt) => opt.value === current) : false

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
        <option value="">No anchor (top of page)</option>
        {!includesCurrent && current ? (
          <option value={current}>{`Saved value → #${current}`}</option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.title}
          </option>
        ))}
      </Select>

      {!internalPage ? (
        <Card padding={2} radius={2} tone="caution">
          <Text size={1}>Pick a site page first, then choose an optional anchor.</Text>
        </Card>
      ) : null}

      {internalPage && !docType ? (
        <Card padding={2} radius={2} tone="caution">
          <Text size={1}>
            No anchor list for this page type (e.g. index pages). Leave empty or add anchors in code later.
          </Text>
        </Card>
      ) : null}
    </Stack>
  )
}
