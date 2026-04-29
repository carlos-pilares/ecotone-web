'use client'

import {useEffect, useState} from 'react'
import {useClient} from 'sanity'
import {Box, Card, Stack, Text} from '@sanity/ui'
import {apiVersion} from '../../env'

const QUERIES = {
  experiences: `*[_type == "experience"] | order(name asc) {
    _id,
    name,
    status,
    programType,
    "slug": slug.current
  }`,
  technologyProducts: `*[_type == "technologyProduct"] | order(coalesce(order, 999) asc, name asc) {
    _id,
    name,
    number,
    order,
    "slug": slug.current
  }`,
  partners: `*[_type == "partner"] | order(coalesce(order, 999) asc, name asc) {
    _id,
    name,
    order,
    category
  }`,
  blogPosts: `*[_type == "blogPost"] | order(coalesce(publishedAt, _updatedAt) desc) {
    _id,
    title,
    category,
    publishedAt,
    "slug": slug.current
  }`,
}

const CAPTIONS = {
  experiences:
    'Read-only: all Experience documents. The public site lists these when wired to this catalog (order on the site may differ until the front reads Home selections). Edit each experience in Content → Experience.',
  technologyProducts:
    'Read-only: Tech product catalog. Canonical copy lives in each Tech product document. Use the list below to choose which cards appear on Home (when connected).',
  partners:
    'Read-only: Partner / certification documents. Canonical copy lives in each Partner. Use the list below to choose order on Home.',
  blogPosts:
    'Read-only: Blog post documents. Canonical copy lives in each Blog post. Use the list below to choose teasers on Home.',
}

const cardSurface = {
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'var(--card-border-color, rgba(55, 60, 67, 0.14))',
  boxShadow: '0 1px 2px rgba(55, 60, 67, 0.06)',
}

const pathLineStyle = {
  marginTop: 10,
  paddingTop: 10,
  borderTop: '1px solid var(--card-border-color, rgba(55, 60, 67, 0.12))',
}

const titleStyle = {
  lineHeight: 1.35,
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
}

const metaStyle = {
  lineHeight: 1.55,
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
}

const pathTextStyle = {
  lineHeight: 1.45,
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
  fontFamily:
    'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
  fontSize: 11,
  letterSpacing: 0.01,
}

function formatStatus(status) {
  if (status === 'active') return 'Active'
  if (status === 'coming-soon') return 'Coming soon'
  return status || '—'
}

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'})
  } catch {
    return ''
  }
}

/** Single catalog row: primary title, secondary meta, optional footer (label + value). */
function ReadoutItemCard({title, meta, footer}) {
  const hasFooter = footer?.value != null && String(footer.value).trim() !== ''
  return (
    <Card padding={4} radius={2} tone="default" style={cardSurface}>
      <Stack space={3}>
        <Text weight="bold" size={2} style={titleStyle}>
          {title || 'Untitled'}
        </Text>
        {meta ? (
          <Text size={1} muted style={metaStyle}>
            {meta}
          </Text>
        ) : null}
        {hasFooter ? (
          <Box style={pathLineStyle}>
            <Text size={0} muted style={{...metaStyle, marginBottom: 6, fontWeight: 500}}>
              {footer.label}
            </Text>
            <Text size={0} muted style={pathTextStyle}>
              {footer.value}
            </Text>
          </Box>
        ) : null}
      </Stack>
    </Card>
  )
}

/** Sanity field input: ignores value/onChange; only shows live catalog. */
export function HomeSourceListReadout(props) {
  const {schemaType} = props
  const catalog = schemaType?.options?.catalog
  const query = QUERIES[catalog]
  const caption = CAPTIONS[catalog] || 'Catalog preview'

  const client = useClient({apiVersion})
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query) return
    let cancelled = false
    setError(null)
    client
      .fetch(query)
      .then((res) => {
        if (!cancelled) setRows(Array.isArray(res) ? res : [])
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Failed to load')
      })
    return () => {
      cancelled = true
    }
  }, [client, query])

  if (!query) {
    return (
      <Card padding={4} border radius={2} tone="critical">
        <Text size={1}>Invalid catalog key for readout.</Text>
      </Card>
    )
  }

  return (
    <Stack space={4}>
      <Text size={1} muted style={{lineHeight: 1.55}}>
        {caption}
      </Text>
      {error ? (
        <Card padding={4} border radius={2} tone="critical">
          <Text size={1}>{error}</Text>
        </Card>
      ) : rows === null ? (
        <Text size={1} muted>
          Loading…
        </Text>
      ) : rows.length === 0 ? (
        <Card padding={4} border radius={2} style={cardSurface}>
          <Text size={1} muted>
            No documents yet.
          </Text>
        </Card>
      ) : (
        <Stack space={4}>
          {catalog === 'experiences' &&
            rows.map((row) => {
              const metaParts = [formatStatus(row.status), row.programType].filter(Boolean)
              return (
                <ReadoutItemCard
                  key={row._id}
                  title={row.name}
                  meta={metaParts.length ? metaParts.join(' · ') : null}
                  footer={row.slug ? {label: 'URL path (slug)', value: `/${row.slug}`} : null}
                />
              )
            })}
          {catalog === 'technologyProducts' &&
            rows.map((row) => {
              const metaParts = []
              if (row.number) metaParts.push(`Product # ${row.number}`)
              if (row.order != null) metaParts.push(`Sort order: ${row.order}`)
              return (
                <ReadoutItemCard
                  key={row._id}
                  title={row.name}
                  meta={metaParts.length ? metaParts.join(' · ') : null}
                  footer={row.slug ? {label: 'Slug', value: row.slug} : null}
                />
              )
            })}
          {catalog === 'partners' &&
            rows.map((row) => {
              const metaParts = []
              if (row.category) metaParts.push(`Type: ${row.category}`)
              if (row.order != null) metaParts.push(`Sort order: ${row.order}`)
              return (
                <ReadoutItemCard
                  key={row._id}
                  title={row.name}
                  meta={metaParts.length ? metaParts.join(' · ') : null}
                  footer={{label: 'Document ID', value: row._id}}
                />
              )
            })}
          {catalog === 'blogPosts' &&
            rows.map((row) => {
              const metaParts = [row.category, formatDate(row.publishedAt)].filter(Boolean)
              return (
                <ReadoutItemCard
                  key={row._id}
                  title={row.title}
                  meta={metaParts.length ? metaParts.join(' · ') : null}
                  footer={row.slug ? {label: 'URL path (slug)', value: `/${row.slug}`} : null}
                />
              )
            })}
        </Stack>
      )}
    </Stack>
  )
}
