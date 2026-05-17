'use client'

import {useEffect, useState} from 'react'
import {Card, Stack, Text} from '@sanity/ui'
import {useClient, useFormValue} from 'sanity'

function normalizeRefId(ref) {
  if (!ref) return ''
  if (typeof ref === 'string') return ref
  return ref._ref || ref._id || ''
}

const LODGE_PAGE_HERO_QUERY = /* groq */ `
  *[_type == "lodgePage" && lodge._ref == $lodgeId] | order(_updatedAt desc)[0] {
    heroShortDescription,
    heroHighlights[]{ text }
  }
`

/** Read-only preview of Lodge Page hero copy used on Experience lodge cards. */
export function LodgePresentationHeroPreview() {
  const client = useClient({apiVersion: '2024-01-01'})
  const lodgeRef = useFormValue(['lodge'])
  const lodgeId = normalizeRefId(lodgeRef)
  const [doc, setDoc] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    let cancelled = false
    if (!lodgeId) {
      setDoc(null)
      setErr(null)
      return
    }
    const pub = lodgeId.replace(/^drafts\./, '')
    client
      .fetch(LODGE_PAGE_HERO_QUERY, {lodgeId: pub})
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
    return () => {
      cancelled = true
    }
  }, [client, lodgeId])

  if (!lodgeId) {
    return (
      <Card padding={3} border radius={2} tone="transparent">
        <Text size={1} muted>
          Select a <strong>Lodge</strong> to preview card copy from its Lodge Page.
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

  if (!doc) {
    return (
      <Card padding={3} border radius={2} tone="transparent">
        <Text size={1} muted>
          Loading Lodge Page preview…
        </Text>
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
          Shown on Experience lodge cards (from Lodge Page → Hero)
        </Text>
        <div>
          <Text size={1} muted>
            Short description
          </Text>
          <Text size={1} style={{marginTop: 4}}>
            {desc || '— (empty on Lodge Page; falls back to Lodge KC short description on site)'}
          </Text>
        </div>
        <div>
          <Text size={1} muted>
            Highlight pills (chips)
          </Text>
          {pills.length ? (
            <Text size={1} style={{marginTop: 4}}>
              {pills.join(' · ')}
            </Text>
          ) : (
            <Text size={1} style={{marginTop: 4}}>
              — (none on Lodge Page)
            </Text>
          )}
        </div>
        <Text size={1} muted>
          Edit these on the linked <strong>Lodge Page</strong> document, not here.
        </Text>
      </Stack>
    </Card>
  )
}
