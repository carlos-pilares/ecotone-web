'use client'

import {useEffect, useState} from 'react'
import {Card, Select, Stack, Text} from '@sanity/ui'
import {set, unset, useClient} from 'sanity'

import {apiVersion} from '../../env'

const ROUTES_QUERY = `*[_type == "route" && defined(slug.current)] | order(coalesce(menuOrder, 999) asc, lower(name) asc) {
  "slug": slug.current,
  name,
  shortLabel
}`

export function LodgeRouteSlugSelectInput(props) {
  const {value, onChange, id, readOnly} = props
  const client = useClient({apiVersion})
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    client
      .fetch(ROUTES_QUERY)
      .then((r) => {
        if (!cancelled) {
          setRows(Array.isArray(r) ? r : [])
          setError(null)
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e?.message || 'Failed to load routes')
          setRows([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [client])

  const options = rows
    .map((row) => {
      const slug = typeof row?.slug === 'string' ? row.slug.trim().toLowerCase() : ''
      if (!slug) return null
      const name = typeof row?.name === 'string' ? row.name.trim() : ''
      const short = typeof row?.shortLabel === 'string' ? row.shortLabel.trim() : ''
      const label = short || name || slug
      return {value: slug, label: `${label} (${slug})`}
    })
    .filter(Boolean)

  const current = typeof value === 'string' ? value.trim().toLowerCase() : ''
  const includesCurrent = current ? options.some((opt) => opt.value === current) : false

  return (
    <Stack space={3}>
      <Select
        id={id}
        value={current}
        disabled={readOnly || loading}
        onChange={(event) => {
          const next = event.currentTarget.value
          onChange(next ? set(next) : unset())
        }}
      >
        <option value="">{loading ? 'Loading routes…' : 'Select route'}</option>
        {!includesCurrent && current ? (
          <option value={current}>{`Legacy / unpublished slug → ${current}`}</option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>

      {error ? (
        <Card padding={2} radius={2} tone="critical">
          <Text size={1}>{error}</Text>
        </Card>
      ) : null}

      {!loading && options.length === 0 ? (
        <Card padding={2} radius={2} tone="caution">
          <Text size={1}>Create at least one Route document (Knowledge Center → Route) with a slug before assigning lodges.</Text>
        </Card>
      ) : null}
    </Stack>
  )
}
