'use client'

import {useEffect, useState} from 'react'
import {Box, Card, Flex, Text} from '@sanity/ui'
import {useClient, useFormValue} from 'sanity'

import {apiVersion} from '../../env'

const QUERY = `*[_id == $id][0]{
  "rows": gallery[]{
    _key,
    stableKey,
    title,
    photoCategory,
    usageSection,
    "imageUrl": image.asset->url
  }
}`

function categoryLabel(row) {
  const pc = typeof row?.photoCategory === 'string' ? row.photoCategory.trim() : ''
  if (pc === 'commonAreasAmenities') return 'Common areas & amenities'
  if (pc === 'accommodation') return 'Accommodation'
  if (pc === 'hero') return 'Hero'
  if (pc === 'other') return 'Other'
  const us = typeof row?.usageSection === 'string' ? row.usageSection.trim() : ''
  if (us === 'commonAreas' || us === 'commonAreasAmenities') return 'Common areas & amenities'
  if (us === 'accommodation') return 'Accommodation'
  if (us === 'hero') return 'Hero'
  if (us === 'other') return 'Other'
  return us || ''
}

export function FacilitiesGalleryPhotoPickPreview(props) {
  const {value, path, galleryRowKey: rowKeyFromSelect, galleryStableKey: stableFromSelect} = props
  const client = useClient({apiVersion})
  const lodgeRefField = useFormValue(['lodge'])
  const objectPath = Array.isArray(path) ? path : []
  const objectFragment = useFormValue(objectPath)
  const rowKeyPath = objectPath.length ? [...objectPath, 'galleryRowKey'] : ['galleryRowKey']
  const legacyKeyPath = objectPath.length ? [...objectPath, 'galleryStableKey'] : ['galleryStableKey']
  const rowKeyFromForm = useFormValue(rowKeyPath)
  const legacyFromForm = useFormValue(legacyKeyPath)
  const lodgeId =
    lodgeRefField && typeof lodgeRefField === 'object' && '_ref' in lodgeRefField
      ? lodgeRefField._ref
      : typeof lodgeRefField === 'string'
        ? lodgeRefField
        : null

  const rowKey =
    (typeof rowKeyFromSelect === 'string' && rowKeyFromSelect.trim()) ||
    (typeof objectFragment?.galleryRowKey === 'string' && objectFragment.galleryRowKey.trim()) ||
    (typeof value?.galleryRowKey === 'string' && value.galleryRowKey.trim()) ||
    (typeof rowKeyFromForm === 'string' ? rowKeyFromForm.trim() : '')
  const legacyKey =
    (typeof stableFromSelect === 'string' && stableFromSelect.trim()) ||
    (typeof objectFragment?.galleryStableKey === 'string' && objectFragment.galleryStableKey.trim()) ||
    (typeof value?.galleryStableKey === 'string' && value.galleryStableKey.trim()) ||
    (typeof legacyFromForm === 'string' ? legacyFromForm.trim() : '')

  const [row, setRow] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!lodgeId || (!rowKey && !legacyKey)) {
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
        if (!found && legacyKey) {
          found = rows.find((r) => (r?.stableKey ?? '').trim() === legacyKey) ?? null
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
  }, [lodgeId, rowKey, legacyKey, client])

  if (!rowKey && !legacyKey) {
    return (
      <Card padding={2} radius={1} tone="transparent">
        <Text size={1} muted>
          Empty — select a photo
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
        <Text size={1}>Missing photo — reselect</Text>
      </Card>
    )
  }

  const title = (row.title ?? '').trim() || 'Photo'
  const cat = categoryLabel(row)
  const url = row.imageUrl || ''

  return (
    <Flex align="center" gap={3} paddingY={1}>
      {url ? (
        <Box style={{width: 44, height: 44, borderRadius: 4, overflow: 'hidden', flexShrink: 0}}>
          <img src={url} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </Box>
      ) : null}
      <Flex direction="column" gap={1} flex={1} style={{minWidth: 0}}>
        <Text size={1} weight="medium" textOverflow="ellipsis">
          {title}
        </Text>
        {cat ? (
          <Text size={1} muted textOverflow="ellipsis">
            {cat}
          </Text>
        ) : null}
      </Flex>
    </Flex>
  )
}
