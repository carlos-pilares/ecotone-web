'use client'

import {useEffect, useMemo, useState} from 'react'
import {Card, Stack, Text} from '@sanity/ui'
import {useClient, useFormValue} from 'sanity'

function normalizeRefId(ref) {
  if (!ref) return ''
  if (typeof ref === 'string') return ref
  return ref._ref || ref._id || ''
}

const LODGE_PAGE_HERO_QUERY = /* groq */ `
  *[_type == "lodgePage" && lodge._ref == $lodgeRef] | order(_updatedAt desc)[0] {
    heroShortDescription,
    heroHighlights[]{ text }
  }
`

/** Read-only preview of Lodge Page hero copy used on Experience lodge cards. */
export function LodgePresentationHeroPreview(props) {
  const {path} = props
  const client = useClient({apiVersion: '2024-01-01'})
  const parentPath = useMemo(
    () => (Array.isArray(path) ? path.slice(0, -1) : []),
    [path],
  )
  const lodgeRefField = useFormValue([...parentPath, 'lodge'])
  const lodgeId = normalizeRefId(lodgeRefField)
  const lodgeRef = lodgeId.replace(/^drafts\./, '')

  const [doc, setDoc] = useState(null)
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!lodgeRef) {
      setDoc(null)
      setErr(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setErr(null)
    client
      .fetch(LODGE_PAGE_HERO_QUERY, {lodgeRef})
      .then((res) => {
        if (!cancelled) {
          setDoc(res || null)
          setErr(null)
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setDoc(null)
          setErr(e?.message || 'Could not load Lodge Page')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [client, lodgeRef])

  if (!lodgeRef) {
    return (
      <Card padding={3} border radius={2} tone="transparent">
        <Text size={1} muted>
          Select a <strong>Lodge</strong> on this row to preview copy from its Lodge Page.
        </Text>
      </Card>
    )
  }

  if (err) {
    return (
      <Card padding={3} border radius={2} tone="critical">
        <Text size={1}>{err}</Text>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card padding={3} border radius={2} tone="transparent">
        <Text size={1} muted>
          Loading Lodge Page preview…
        </Text>
      </Card>
    )
  }

  if (!doc) {
    return (
      <Card padding={3} border radius={2} tone="caution">
        <Text size={1}>No linked Lodge Page found for this lodge yet.</Text>
      </Card>
    )
  }

  const desc = doc.heroShortDescription?.trim()
  const pills = (doc.heroHighlights || [])
    .map((p) => (p?.text && String(p.text).trim()) || '')
    .filter(Boolean)

  return (
    <Card padding={3} border radius={2} tone="transparent">
      <Stack space={3}>
        <Text size={1} weight="semibold">
          From Lodge Page → Hero (read only)
        </Text>
        <div>
          <Text size={1} muted>
            Short description
          </Text>
          <Text size={1} style={{marginTop: 4}}>
            {desc || '— (empty on Lodge Page → Hero short description)'}
          </Text>
        </div>
        <div>
          <Text size={1} muted>
            Highlight pills
          </Text>
          {pills.length ? (
            <Text size={1} style={{marginTop: 4}}>
              {pills.join(' · ')}
            </Text>
          ) : (
            <Text size={1} style={{marginTop: 4}}>
              — (none on Lodge Page → Hero highlight pills)
            </Text>
          )}
        </div>
        <Text size={1} muted>
          Edit on the linked <strong>Lodge Page</strong> document (Hero tab), not here.
        </Text>
      </Stack>
    </Card>
  )
}
