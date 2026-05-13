'use client'

import {useEffect, useMemo, useState} from 'react'
import {Box, Button, Card, Flex, Spinner, Stack, Text} from '@sanity/ui'
import {set, unset, useClient, useFormValue} from 'sanity'

import {apiVersion} from '../../env'

const GALLERY_QUERY = `*[_id == $id][0]{
  "rows": gallery[]{
    _key,
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
  return us || '—'
}

function rowIsSelectable(row) {
  const url = typeof row?.imageUrl === 'string' ? row.imageUrl.trim() : ''
  const title = typeof row?.title === 'string' ? row.title.trim() : ''
  return Boolean(url || title)
}

function bucketKeyForRow(row) {
  const raw = typeof row.photoCategory === 'string' ? row.photoCategory.trim() : ''
  const legacy = typeof row.usageSection === 'string' ? row.usageSection.trim() : ''
  if (raw === 'commonAreasAmenities' || legacy === 'commonAreas' || legacy === 'commonAreasAmenities') {
    return 'commonAreasAmenities'
  }
  if (raw === 'accommodation' || legacy === 'accommodation') return 'accommodation'
  if (raw === 'hero' || legacy === 'hero') return 'hero'
  if (raw === 'other' || legacy === 'other') return 'other'
  return 'other'
}

/**
 * Picks one row from the linked lodge `gallery[]` by `_key`.
 * Lists every library row that has an image or title (all categories), grouped by category.
 */
export function FacilitiesGalleryPhotoSelectInput(props) {
  const {value, onChange, id, readOnly} = props
  const client = useClient({apiVersion})
  const lodgeRefField = useFormValue(['lodge'])
  const lodgeId =
    lodgeRefField && typeof lodgeRefField === 'object' && '_ref' in lodgeRefField
      ? lodgeRefField._ref
      : typeof lodgeRefField === 'string'
        ? lodgeRefField
        : null

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!lodgeId) {
      setRows([])
      setError(null)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    client
      .fetch(GALLERY_QUERY, {id: lodgeId})
      .then((doc) => {
        if (cancelled) return
        setRows(Array.isArray(doc?.rows) ? doc.rows : [])
      })
      .catch((e) => {
        if (cancelled) return
        setError(e?.message || 'Failed to load photo library')
        setRows([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [lodgeId, client])

  const selectable = useMemo(() => rows.filter((r) => r && rowIsSelectable(r)), [rows])

  const grouped = useMemo(() => {
    const order = ['hero', 'accommodation', 'commonAreasAmenities', 'other']
    const buckets = new Map()
    for (const row of selectable) {
      const bk = bucketKeyForRow(row)
      if (!buckets.has(bk)) buckets.set(bk, [])
      buckets.get(bk).push(row)
    }
    const out = []
    for (const k of order) {
      const list = buckets.get(k)
      if (list?.length) {
        out.push({
          key: k,
          label: categoryLabel({photoCategory: k, usageSection: k}),
          rows: list,
        })
      }
    }
    return out
  }, [selectable])

  const current = typeof value === 'string' ? value.trim() : ''

  return (
    <Stack space={3}>
      {loading ? <Spinner muted /> : null}
      {error ? (
        <Card tone="critical" padding={2} radius={2}>
          <Text size={1}>{error}</Text>
        </Card>
      ) : null}
      {!lodgeId ? (
        <Card padding={2} tone="caution" radius={2}>
          <Text size={1}>Link a lodge on this page first, then choose a photo from its library.</Text>
        </Card>
      ) : (
        <Stack space={3}>
          <Flex gap={2} align="center" wrap="wrap">
            <Text size={1} weight="semibold">
              Selected
            </Text>
            {current ? (
              <Button id={id ? `${id}-clear` : undefined} tone="critical" mode="ghost" disabled={readOnly} onClick={() => onChange(unset())}>
                <Text size={1}>Clear selection</Text>
              </Button>
            ) : (
              <Text size={1} muted>
                —
              </Text>
            )}
          </Flex>
          <Card padding={2} radius={2} tone="transparent" border style={{maxHeight: 360, overflow: 'auto'}}>
            {grouped.length === 0 ? (
              <Text size={1} muted>
                No photos with an image or title in the linked lodge library yet.
              </Text>
            ) : (
              <Stack space={4}>
                {grouped.map((group) => (
                  <Stack key={group.key} space={2}>
                    <Text size={0} weight="semibold" muted>
                      {group.label}
                    </Text>
                    <Stack space={2}>
                      {group.rows.map((row) => {
                        const k = typeof row?._key === 'string' ? row._key : ''
                        if (!k) return null
                        const title = typeof row?.title === 'string' ? row.title.trim() : ''
                        const cat = categoryLabel(row)
                        const url = typeof row?.imageUrl === 'string' ? row.imageUrl.trim() : ''
                        const selected = k === current
                        return (
                          <Button
                            key={k}
                            mode="ghost"
                            padding={3}
                            disabled={readOnly}
                            tone={selected ? 'primary' : 'default'}
                            onClick={() => onChange(selected ? unset() : set(k))}
                          >
                            <Flex align="center" gap={3}>
                              {url ? (
                                <Box
                                  style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                    opacity: selected ? 1 : 0.92,
                                  }}
                                >
                                  <img src={url} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                </Box>
                              ) : (
                                <Box
                                  style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 4,
                                    background: 'var(--card-muted-bg-color)',
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                              <Flex
                                direction="column"
                                align="flex-start"
                                gap={1}
                                style={{minWidth: 0, textAlign: 'left'}}
                              >
                                <Text size={1} weight="medium">
                                  {title || 'Untitled'}
                                </Text>
                                <Text size={1} muted>
                                  {cat}
                                </Text>
                              </Flex>
                            </Flex>
                          </Button>
                        )
                      })}
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            )}
          </Card>
        </Stack>
      )}
    </Stack>
  )
}
