'use client'

import {useEffect, useState} from 'react'
import {Box, Card, Flex, Text} from '@sanity/ui'
import {useClient, useFormValue} from 'sanity'

import {apiVersion} from '../../env'

const AMENITY_ICON_IDS = new Set([
  'meals',
  'guide',
  'transport',
  'boots',
  'flask',
  'wifi',
  'shield',
  'book',
  'droplet',
])

function normalizeAmenityIconPreview(raw) {
  const t = typeof raw === 'string' ? raw.trim() : ''
  return AMENITY_ICON_IDS.has(t) ? t : 'meals'
}

const QUERY = `*[_id == $id][0]{
  "rows": amenities[]{ _key, icon, title, description }
}`

export function LodgeAmenityPickPreview(props) {
  const {value, path, amenityRowKey: rowKeyFromSelect, amenityIcon: iconFromSelect} = props
  const client = useClient({apiVersion})
  const lodgeRefField = useFormValue(['lodge'])
  const objectPath = Array.isArray(path) ? path : []
  const objectFragment = useFormValue(objectPath)
  const rowKeyPath = objectPath.length ? [...objectPath, 'amenityRowKey'] : ['amenityRowKey']
  const legacyIconPath = objectPath.length ? [...objectPath, 'amenityIcon'] : ['amenityIcon']
  const rowKeyFromForm = useFormValue(rowKeyPath)
  const legacyFromForm = useFormValue(legacyIconPath)
  const lodgeId =
    lodgeRefField && typeof lodgeRefField === 'object' && '_ref' in lodgeRefField
      ? lodgeRefField._ref
      : typeof lodgeRefField === 'string'
        ? lodgeRefField
        : null

  const rowKey =
    (typeof rowKeyFromSelect === 'string' && rowKeyFromSelect.trim()) ||
    (typeof objectFragment?.amenityRowKey === 'string' && objectFragment.amenityRowKey.trim()) ||
    (typeof value?.amenityRowKey === 'string' && value.amenityRowKey.trim()) ||
    (typeof rowKeyFromForm === 'string' ? rowKeyFromForm.trim() : '')
  const legacyIcon =
    (typeof iconFromSelect === 'string' && iconFromSelect.trim()) ||
    (typeof objectFragment?.amenityIcon === 'string' && objectFragment.amenityIcon.trim()) ||
    (typeof value?.amenityIcon === 'string' && value.amenityIcon.trim()) ||
    (typeof legacyFromForm === 'string' ? legacyFromForm.trim() : '')

  const [row, setRow] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!lodgeId || (!rowKey && !legacyIcon)) {
      setRow(null)
      return
    }
    let cancelled = false
    setLoading(true)
    client
      .fetch(QUERY, {id: lodgeId})
      .then((doc) => {
        if (cancelled) return
        const rows = Array.isArray(doc?.rows) ? doc.rows : []
        let found = null
        if (rowKey) found = rows.find((r) => r?._key === rowKey) ?? null
        if (!found && legacyIcon) {
          const needle = normalizeAmenityIconPreview(legacyIcon)
          found = rows.find((r) => normalizeAmenityIconPreview(r?.icon) === needle) ?? null
        }
        setRow(found)
      })
      .catch(() => {
        if (!cancelled) setRow(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [lodgeId, rowKey, legacyIcon, client])

  if (!rowKey && !legacyIcon) {
    return (
      <Card padding={2} radius={1} tone="transparent">
        <Text size={1} muted>
          Empty — select an amenity
        </Text>
      </Card>
    )
  }

  if (loading) {
    return (
      <Text size={1} muted>
        Loading…
      </Text>
    )
  }

  if (!row) {
    return (
      <Card padding={2} radius={1} tone="caution">
        <Text size={1}>Missing amenity — reselect</Text>
      </Card>
    )
  }

  const title = (row.title ?? '').trim() || 'Amenity'
  const icon = (row.icon ?? '').trim()
  const sub = (row.description ?? '').trim()
  const iconNorm = icon ? normalizeAmenityIconPreview(icon) : ''

  return (
    <Flex align="flex-start" gap={3} paddingY={1} style={{minWidth: 0}}>
      {iconNorm ? (
        <Box
          flex="none"
          paddingX={2}
          paddingY={2}
          style={{
            borderRadius: 4,
            background: 'var(--card-muted-bg-color)',
            minWidth: 36,
            textAlign: 'center',
          }}
        >
          <Text size={0} weight="semibold">
            {iconNorm}
          </Text>
        </Box>
      ) : null}
      <Flex direction="column" gap={1} flex={1} style={{minWidth: 0}}>
        <Text size={1} weight="medium" textOverflow="ellipsis">
          {title}
        </Text>
        {sub ? (
          <Text size={1} muted textOverflow="ellipsis">
            {sub}
          </Text>
        ) : null}
      </Flex>
    </Flex>
  )
}
