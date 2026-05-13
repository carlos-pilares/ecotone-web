'use client'

import {useEffect, useState} from 'react'
import {Card, Select, Spinner, Stack, Text} from '@sanity/ui'
import {set, unset, useClient, useFormValue} from 'sanity'

import {apiVersion} from '../../env'

/**
 * Picks one row from the linked lodge's `amenities[]` by storing that row's `_key`.
 * Legacy `amenityIcon` is still read by the site resolver when this field is empty.
 */
export function FacilitiesAmenitySelectInput(props) {
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
      .fetch(`*[_id == $id][0]{ amenities[]{ _key, icon, title, description } }`, {id: lodgeId})
      .then((doc) => {
        if (cancelled) return
        setRows(Array.isArray(doc?.amenities) ? doc.amenities : [])
      })
      .catch((e) => {
        if (cancelled) return
        setError(e?.message || 'Failed to load amenities')
        setRows([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [lodgeId, client])

  const options = rows
    .map((row) => {
      const k = typeof row?._key === 'string' ? row._key : ''
      if (!k) return null
      const title = typeof row?.title === 'string' ? row.title.trim() : ''
      const icon = typeof row?.icon === 'string' ? row.icon.trim() : ''
      const sub = typeof row?.description === 'string' ? row.description.trim() : ''
      const label = title || icon || k
      return {value: k, label: sub ? `${label} — ${sub.slice(0, 60)}${sub.length > 60 ? '…' : ''}` : label}
    })
    .filter(Boolean)

  const current = typeof value === 'string' ? value.trim() : ''
  const includesCurrent = current ? options.some((o) => o.value === current) : false

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
          <Text size={1}>Link a lodge (knowledge center) on this page first, then pick amenities here.</Text>
        </Card>
      ) : (
        <Select
          id={id}
          value={current}
          disabled={readOnly}
          onChange={(ev) => {
            const next = ev.currentTarget.value
            onChange(next ? set(next) : unset())
          }}
        >
          <option value="">Select amenity</option>
          {!includesCurrent && current ? (
            <option value={current}>{`Linked row (${current})`}</option>
          ) : null}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      )}
      {lodgeId && !loading && options.length === 0 ? (
        <Card padding={2} tone="transparent" border>
          <Text size={1} muted>
            No amenities on the linked lodge yet — add them in the Lodge knowledge center.
          </Text>
        </Card>
      ) : null}
    </Stack>
  )
}
