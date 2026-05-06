'use client'

import {Card, Select, Stack, Text} from '@sanity/ui'
import {set, unset, useFormValue} from 'sanity'

import {getSectionAnchorOptions} from '../../schemaTypes/objects/smartLinkSectionAnchors'

export function SmartLinkSamePageSectionInput(props) {
  const {value, onChange, id, readOnly} = props
  const docTypeRaw = useFormValue(['_type'])
  const docType = typeof docTypeRaw === 'string' ? docTypeRaw : ''
  const options = getSectionAnchorOptions(docType)

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
        <option value="">Select section</option>
        {!includesCurrent && current ? (
          <option value={current}>{`Saved value → #${current}`}</option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.title}
          </option>
        ))}
      </Select>

      {options.length === 0 ? (
        <Card padding={2} radius={2} tone="caution">
          <Text size={1}>
            {docType
              ? `No in-page section anchors are configured for “${docType}”. Pick another link type or add anchors in the schema.`
              : 'Could not read document type. Save the document and try again.'}
          </Text>
        </Card>
      ) : null}
    </Stack>
  )
}
