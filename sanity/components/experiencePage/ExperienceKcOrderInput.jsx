'use client'

import {useCallback, useEffect, useMemo, useState} from 'react'
import {Box, Button, Card, Checkbox, Flex, Stack, Text} from '@sanity/ui'
import {PatchEvent, set, useClient, useFormValue} from 'sanity'
import {experienceKcOrderDocProjection} from './experienceKcOrderDocProjection'
import {highlightListKeyAt, includeListKeyAt, notIncludeListKeyAt} from '../../lib/experienceKcStringListKeys'

/**
 * Ordered multi-select of Knowledge Center rows (linked Experience document).
 * Stores Sanity `_key` strings only; labels are loaded for display.
 */
function normalizeRefId(ref) {
  if (!ref) return ''
  if (typeof ref === 'string') return ref
  return ref._ref || ref._id || ''
}

function lineText(item) {
  if (typeof item === 'string') return item.trim()
  if (item && typeof item === 'object') {
    const raw = item.text ?? item.value ?? item.title
    return raw != null ? String(raw).trim() : ''
  }
  return ''
}

function stringRowMeta(item, idx) {
  if (typeof item === 'string') {
    const t = item.trim()
    return {key: `legacy-str:${idx}`, label: t || `Item ${idx + 1}`}
  }
  if (item && typeof item === 'object') {
    const key = item._key || `legacy-str:${idx}`
    const t = lineText(item)
    return {key, label: t || `Item ${idx + 1}`}
  }
  return {key: `legacy-str:${idx}`, label: `Item ${idx + 1}`}
}

function keyedStringRowMeta(item, idx, rawFlat, fallbackPrefix) {
  const key = item?._key || `${fallbackPrefix}-${idx}`
  const t = lineText(item) || (Array.isArray(rawFlat) && typeof rawFlat[idx] === 'string' ? rawFlat[idx].trim() : '')
  return {key, label: t || `${fallbackPrefix} ${idx + 1}`}
}

function wildlifeMeta(item, idx) {
  const key = item?._key || `legacy-w:${idx}`
  const name = (item?.name && String(item.name).trim()) || `Species ${idx + 1}`
  return {key, label: name}
}

function faqMeta(item, idx) {
  const key = item?._key || `legacy-f:${idx}`
  const q = (item?.question && String(item.question).trim()) || `FAQ ${idx + 1}`
  const label = q.length > 72 ? `${q.slice(0, 69)}…` : q
  return {key, label}
}

function resourceMeta(item, idx) {
  const key = item?._key || `legacy-r:${idx}`
  const t = (item?.title && String(item.title).trim()) || `Resource ${idx + 1}`
  return {key, label: t}
}

function normalizeExpId(id) {
  return (id || '').replace(/^drafts\./, '')
}

function termAppliesToExperience(item, experienceId) {
  if (!item || !experienceId) return false
  if (item.appliesToAll === true) return true
  const exp = normalizeExpId(experienceId)
  const ids = Array.isArray(item.experienceIds) ? item.experienceIds : []
  return ids.some((ref) => normalizeExpId(ref) === exp)
}

function faqMetaCentral(item, idx) {
  const key = item?._key || `faq-${idx}`
  const t = (item?.title && String(item.title).trim()) || `FAQ ${idx + 1}`
  const label = t.length > 72 ? `${t.slice(0, 69)}…` : t
  return {key, label}
}

function sectionHasApplicableRow(section, experienceId) {
  if (!section?.rows?.length || !experienceId) return false
  return section.rows.some((row) => termAppliesToExperience(row, experienceId))
}

function buildOptions(source, doc, experienceId, termsConditions, faqsSettings, travellerGuideSettings) {
  if (!doc && source !== 'termsPanels' && source !== 'faq' && source !== 'travellerGuide') return []
  switch (source) {
    case 'overviewHighlights': {
      const raw = doc.highlights
      if (!Array.isArray(raw)) return []
      return raw.map((item, idx) => {
        const label = lineText(item) || `Highlight ${idx + 1}`
        return {key: highlightListKeyAt(idx), label}
      })
    }
    case 'wildlife': {
      const raw = doc.wildlife
      if (!Array.isArray(raw)) return []
      return raw.map(wildlifeMeta)
    }
    case 'includes': {
      const raw = doc.includes
      if (!Array.isArray(raw)) return []
      return raw.map((item, idx) => {
        const label = lineText(item) || `Included ${idx + 1}`
        return {key: includeListKeyAt(idx), label}
      })
    }
    case 'notIncludes': {
      const raw = doc.notIncludes
      if (!Array.isArray(raw)) return []
      return raw.map((item, idx) => {
        const label = lineText(item) || `Not included ${idx + 1}`
        return {key: notIncludeListKeyAt(idx), label}
      })
    }
    case 'snapshotHighlights': {
      const raw = doc.snapshotHighlights
      if (!Array.isArray(raw)) return []
      return raw.map((item, idx) => {
        const title = (item?.title && String(item.title).trim()) || ''
        const subtitle = (item?.subtitle && String(item.subtitle).trim()) || ''
        const label = [title, subtitle].filter(Boolean).join(' · ') || `Highlight ${idx + 1}`
        return {key: (item && item._key) || `snapshot-${idx}`, label}
      })
    }
    case 'lodges': {
      const raw = doc.lodgePresentationRows
      if (!Array.isArray(raw)) return []
      return raw.map((row, idx) => {
        const key = (row && row._key) || `lodge-${idx}`
        const label =
          (row && row.lodgeName && String(row.lodgeName).trim()) ||
          `Lodge ${idx + 1}`
        return {key, label}
      })
    }
    case 'termsPanels': {
      const central = termsConditions?.termsItems
      if (Array.isArray(central) && central.length && experienceId) {
        const applicable = central.filter((item) => termAppliesToExperience(item, experienceId))
        if (applicable.length) {
          return applicable.map((item, idx) => {
            const key = item?._key || `terms-${idx}`
            const t = (item?.title && String(item.title).trim()) || `Terms section ${idx + 1}`
            const scope = item?.appliesToAll ? ' (all experiences)' : ''
            const label = `${t.length > 60 ? `${t.slice(0, 57)}…` : t}${scope}`
            return {key, label}
          })
        }
      }
      const raw = doc?.termsPanels
      if (!Array.isArray(raw)) return []
      return raw.map((item, idx) => {
        const key = item?._key || `terms-${idx}`
        const t = (item?.title && String(item.title).trim()) || `Terms section ${idx + 1}`
        const label = `${t.length > 69 ? `${t.slice(0, 66)}…` : t} (legacy KC)`
        return {key, label}
      })
    }
    case 'importantNotes': {
      const keyed = doc.importantNotesKeyed
      if (Array.isArray(keyed) && keyed.length) {
        return keyed.map((item, idx) => {
          const key = item?._key || `note-${idx}`
          const t = item?.text != null ? String(item.text).trim() : ''
          return {key, label: t || `Note ${idx + 1}`}
        })
      }
      const raw = doc.importantNotes
      if (!Array.isArray(raw)) return []
      return raw.map(stringRowMeta)
    }
    case 'travellerGuide': {
      const central = travellerGuideSettings?.travellerGuideSections
      if (Array.isArray(central) && central.length && experienceId) {
        const applicable = central.filter((section) => sectionHasApplicableRow(section, experienceId))
        if (applicable.length) {
          return applicable.map((section, idx) => {
            const key = section?._key || `tg-${idx}`
            const t = (section?.title && String(section.title).trim()) || `Section ${idx + 1}`
            const layout = section?.rowLayout === 'checklist' ? 'Checklist' : 'Q&A'
            const rows = Array.isArray(section?.rows) ? section.rows : []
            const global = rows.filter((r) => r?.appliesToAll === true).length
            const label = `${t.length > 48 ? `${t.slice(0, 45)}…` : t} · ${layout} · ${rows.length} rows (${global} global)`
            return {key, label}
          })
        }
      }
      const raw = doc?.travelerGuideSubsections
      if (!Array.isArray(raw)) return []
      return raw.map((item, idx) => {
        const key = item?._key || `legacy-tg-${idx}`
        const t = (item?.title && String(item.title).trim()) || `Section ${idx + 1}`
        const layout = item?.displayType === 'checklist' ? 'Checklist' : 'Q&A'
        const n = Array.isArray(item?.rows) ? item.rows.length : 0
        return {
          key,
          label: `${t} · ${layout} · ${n} rows (legacy KC)`,
        }
      })
    }
    case 'faq': {
      const central = faqsSettings?.faqItems
      if (Array.isArray(central) && central.length && experienceId) {
        const applicable = central.filter((item) => termAppliesToExperience(item, experienceId))
        if (applicable.length) {
          return applicable.map((item, idx) => {
            const {key, label: base} = faqMetaCentral(item, idx)
            const scope = item?.appliesToAll ? ' (all experiences)' : ''
            return {key, label: `${base}${scope}`}
          })
        }
      }
      const raw = doc?.faqs
      if (!Array.isArray(raw)) return []
      return raw.map((item, idx) => {
        const {key, label} = faqMeta(item, idx)
        return {key, label: `${label} (legacy KC)`}
      })
    }
    case 'resources': {
      const raw =
        doc.knowledgeResources?.length > 0 ? doc.knowledgeResources : doc.resources
      if (!Array.isArray(raw)) return []
      return raw.map(resourceMeta)
    }
    case 'gallery': {
      const raw = doc.gallery
      if (!Array.isArray(raw)) return []
      return raw.map((item, idx) => {
        const key = item?._key || `legacy-g:${idx}`
        const typeLabel = item?.mediaType === 'video' ? 'Video' : 'Photo'
        const label =
          (item?.caption && String(item.caption).trim()) ||
          (item?.title && String(item.title).trim()) ||
          (item?.alt && String(item.alt).trim()) ||
          `${typeLabel} ${idx + 1}`
        return {key, label: `${typeLabel}: ${label}`}
      })
    }
    default:
      return []
  }
}

export function ExperienceKcOrderInput(props) {
  const {value, onChange, schemaType} = props
  const client = useClient({apiVersion: '2024-01-01'})
  const experienceRef = useFormValue(['experience'])
  const source = schemaType?.options?.kcSource

  const [doc, setDoc] = useState(null)
  const [termsConditions, setTermsConditions] = useState(null)
  const [faqsSettings, setFaqsSettings] = useState(null)
  const [travellerGuideSettings, setTravellerGuideSettings] = useState(null)
  const [loadErr, setLoadErr] = useState(null)

  const id = normalizeRefId(experienceRef)

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!id) {
        setDoc(null)
        setTermsConditions(null)
        setFaqsSettings(null)
        setTravellerGuideSettings(null)
        setLoadErr(null)
        return
      }
      const pub = id.replace(/^drafts\./, '')
      const candidates = [pub, `drafts.${pub}`]
      setLoadErr(null)
      try {
        const q = `{
          "experience": *[_id in $ids] | order(_updatedAt desc)[0] ${experienceKcOrderDocProjection},
          "termsConditions": *[_id == "termsConditionsSettings"][0]{
            termsItems[]{
              _key,
              title,
              appliesToAll,
              "experienceIds": experiences[]._ref
            }
          },
          "faqsSettings": *[_id == "faqsSettings"][0]{
            faqItems[]{
              _key,
              title,
              appliesToAll,
              "experienceIds": experiences[]._ref
            }
          },
          "travellerGuideSettings": *[_id == "travellerGuideSettings"][0]{
            travellerGuideSections[]{
              _key,
              title,
              rowLayout,
              rows[]{
                _key,
                appliesToAll,
                "experienceIds": experiences[]._ref
              }
            }
          }
        }`
        const res = await client.fetch(q, {ids: candidates})
        if (!cancelled) {
          setDoc(res?.experience || null)
          setTermsConditions(res?.termsConditions || null)
          setFaqsSettings(res?.faqsSettings || null)
          setTravellerGuideSettings(res?.travellerGuideSettings || null)
        }
      } catch (e) {
        if (!cancelled) {
          setDoc(null)
          setTermsConditions(null)
          setFaqsSettings(null)
          setTravellerGuideSettings(null)
          setLoadErr(e?.message || 'Could not load experience')
        }
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [client, id])

  const options = useMemo(
    () => buildOptions(source, doc, id, termsConditions, faqsSettings, travellerGuideSettings),
    [doc, source, id, termsConditions, faqsSettings, travellerGuideSettings],
  )
  const optionMap = useMemo(() => new Map(options.map((o) => [o.key, o])), [options])

  const selectedKeys = Array.isArray(value) ? value.filter(Boolean) : []

  const emit = useCallback(
    (next) => {
      onChange(PatchEvent.from(set(next === undefined ? [] : next)))
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
      if (!Number.isFinite(from)) return
      if (from === dropIndex) return
      move(from, dropIndex)
    },
    [move],
  )

  if (!id) {
    return (
      <Card padding={3} radius={2} border tone="transparent">
        <Text size={1} muted>
          Link an <strong>Experience</strong> first to load items from the Knowledge Center.
        </Text>
      </Card>
    )
  }

  if (loadErr) {
    return (
      <Card padding={3} radius={2} border tone="critical">
        <Text size={1}>{loadErr}</Text>
      </Card>
    )
  }

  if (!options.length) {
    return (
      <Card padding={3} radius={2} border tone="transparent">
        <Text size={1} muted>
          No items in the linked Experience for this list yet.
        </Text>
      </Card>
    )
  }

  return (
    <Stack space={4}>
      <Card padding={3} radius={2} border tone="transparent">
        <Text size={1} weight="semibold" style={{marginBottom: 10}}>
          Selected order (drag or use arrows)
        </Text>
        {selectedKeys.length === 0 ? (
          <Text size={1} muted>
            None selected — the site shows all items in Knowledge Center order (or legacy index order if configured).
          </Text>
        ) : (
          <Stack space={2}>
            {selectedKeys.map((k, i) => (
              <Card
                key={k}
                padding={2}
                radius={1}
                border
                tone="default"
                draggable
                onDragStart={(ev) => onDragStart(ev, i)}
                onDragOver={onDragOver}
                onDrop={(ev) => onDrop(ev, i)}
              >
                <Flex align="center" gap={2}>
                  <Text size={1} style={{flex: 1}}>
                    {optionMap.get(k)?.label ?? k}
                  </Text>
                  <Button text="↑" disabled={i === 0} onClick={() => move(i, i - 1)} padding={2} />
                  <Button text="↓" disabled={i >= selectedKeys.length - 1} onClick={() => move(i, i + 1)} padding={2} />
                  <Button text="Remove" tone="critical" onClick={() => toggle(k)} padding={2} />
                </Flex>
              </Card>
            ))}
          </Stack>
        )}
      </Card>

      <Card padding={3} radius={2} border tone="transparent">
        <Text size={1} weight="semibold" style={{marginBottom: 10}}>
          Add items
        </Text>
        <Stack space={2}>
          {options.map((o) => (
            <Flex key={o.key} align="center" gap={2}>
              <Checkbox checked={selectedKeys.includes(o.key)} onChange={() => toggle(o.key)} />
              <Box flex={1}>
                <Text size={1}>{o.label}</Text>
              </Box>
            </Flex>
          ))}
        </Stack>
      </Card>
    </Stack>
  )
}
