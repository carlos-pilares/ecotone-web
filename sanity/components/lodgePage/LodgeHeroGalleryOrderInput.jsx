'use client'

import {useCallback, useEffect, useMemo, useState} from 'react'
import {Box, Button, Card, Checkbox, Flex, Stack, Text} from '@sanity/ui'
import {PatchEvent, set, useClient, useFormValue} from 'sanity'

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
  return Boolean(typeof row?.imageUrl === 'string' && row.imageUrl.trim())
}

/**
 * Multi-select + reorder of linked lodge `gallery[]` rows (`_key` only).
 * First selected row is the main hero image on the site.
 */
export function LodgeHeroGalleryOrderInput(props) {
  const {value, onChange} = props
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

  const options = useMemo(() => {
    return rows
      .filter((r) => r && rowIsSelectable(r))
      .map((row, idx) => {
        const key = typeof row._key === 'string' ? row._key.trim() : ''
        const title = typeof row.title === 'string' ? row.title.trim() : ''
        const cat = categoryLabel(row)
        const label = [title || `Photo ${idx + 1}`, cat].filter(Boolean).join(' · ')
        return {key: key || `gallery-${idx}`, label, imageUrl: row.imageUrl?.trim() || ''}
      })
      .filter((o) => o.key)
  }, [rows])

  const optionMap = useMemo(() => new Map(options.map((o) => [o.key, o])), [options])
  const selectedKeys = Array.isArray(value) ? value.filter(Boolean) : []

  const emit = useCallback(
    (next) => {
      onChange(PatchEvent.from(set(next?.length ? next : [])))
    },
    [onChange],
  )

  const toggle = useCallback(
    (k) => {
      const has = selectedKeys.includes(k)
      const next = has ? selectedKeys.filter((x) => x !== k) : [...selectedKeys, k]
      emit(next)
    },
    [emit, selectedKeys],
  )

  const move = useCallback(
    (from, to) => {
      if (to < 0 || to >= selectedKeys.length) return
      const next = [...selectedKeys]
      const [x] = next.splice(from, 1)
      next.splice(to, 0, x)
      emit(next)
    },
    [emit, selectedKeys],
  )

  const onDragStart = useCallback((e, index) => {
    e.dataTransfer.setData('text/plain', String(index))
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const onDragOver = useCallback((e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (e, dropIndex) => {
      e.preventDefault()
      const from = Number(e.dataTransfer.getData('text/plain'))
      if (!Number.isFinite(from) || from === dropIndex) return
      move(from, dropIndex)
    },
    [move],
  )

  if (!lodgeId) {
    return (
      <Card padding={3} radius={2} border tone="transparent">
        <Text size={1} muted>
          Link a <strong>Lodge (knowledge center)</strong> first, then choose hero photos from its media library.
        </Text>
      </Card>
    )
  }

  if (error) {
    return (
      <Card padding={3} radius={2} border tone="critical">
        <Text size={1}>{error}</Text>
      </Card>
    )
  }

  if (!options.length && !loading) {
    return (
      <Card padding={3} radius={2} border tone="transparent">
        <Text size={1} muted>
          No photos with images in the linked lodge library yet. Add images in Lodge knowledge center → Media.
        </Text>
      </Card>
    )
  }

  return (
    <Stack space={4}>
      <Card padding={3} radius={2} border tone="transparent">
        <Text size={1} weight="semibold" style={{marginBottom: 8}}>
          Selected hero order
        </Text>
        <Text size={1} muted style={{marginBottom: 10}}>
          First photo is the main hero image. Leave empty to use all lodge library photos in Knowledge Center order.
        </Text>
        {selectedKeys.length === 0 ? (
          <Text size={1} muted>
            None selected — site uses full KC gallery order.
          </Text>
        ) : (
          <Stack space={2}>
            {selectedKeys.map((k, i) => (
              <Card
                key={k}
                padding={2}
                radius={1}
                border
                draggable
                onDragStart={(ev) => onDragStart(ev, i)}
                onDragOver={onDragOver}
                onDrop={(ev) => onDrop(ev, i)}
              >
                <Flex align="center" gap={2}>
                  {optionMap.get(k)?.imageUrl ? (
                    <Box
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 4,
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={optionMap.get(k).imageUrl}
                        alt=""
                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                      />
                    </Box>
                  ) : null}
                  <Text size={1} style={{flex: 1}}>
                    {i === 0 ? '★ ' : ''}
                    {optionMap.get(k)?.label ?? k}
                  </Text>
                  <Button mode="bleed" text="↑" disabled={i === 0} onClick={() => move(i, i - 1)} />
                  <Button
                    mode="bleed"
                    text="↓"
                    disabled={i === selectedKeys.length - 1}
                    onClick={() => move(i, i + 1)}
                  />
                  <Button mode="bleed" tone="critical" text="×" onClick={() => toggle(k)} />
                </Flex>
              </Card>
            ))}
          </Stack>
        )}
      </Card>
      <Card padding={3} radius={2} border tone="transparent">
        <Text size={1} weight="semibold" style={{marginBottom: 10}}>
          Lodge media library
        </Text>
        <Stack space={2}>
          {options.map((o) => {
            const checked = selectedKeys.includes(o.key)
            return (
              <Card key={o.key} padding={2} radius={1} border>
                <Flex align="center" gap={3}>
                  <Checkbox checked={checked} onChange={() => toggle(o.key)} />
                  {o.imageUrl ? (
                    <Box
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 4,
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <img src={o.imageUrl} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    </Box>
                  ) : null}
                  <Text size={1}>{o.label}</Text>
                </Flex>
              </Card>
            )
          })}
        </Stack>
      </Card>
    </Stack>
  )
}
