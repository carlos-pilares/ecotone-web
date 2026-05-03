'use client'
/* eslint-disable react-hooks/set-state-in-effect -- Reseteo y carga async del Lodge en Studio (patrón alineado a StudioPreviewInput). */

import {useEffect, useMemo, useState} from 'react'
import {useClient, useFormValue} from 'sanity'
import {Card, Stack, Text} from '@sanity/ui'
import {apiVersion} from '../../env'
import {lodgeStudioPreviewById} from '../../lib/lodgePageStudioQuery'
import {resolveLodgePageSectionPreview} from '../../lib/lodgePageStudioResolvedCopy'
import {experienceDocsByIds, reviewDocsByIds} from '../../lib/experiencePageStudioQuery'

/** Pon `true` temporalmente para ver el JSON crudo del fetch en Studio. */
const DEBUG_LODGE_STUDIO_PAYLOAD = false

const L_SOURCE = '1. Fuente'
const L_PREVIEW = '2. Vista previa'
const L_NOTE_SELECTION = 'Usa los campos bajo este panel para selección y orden (cuando aplique).'

const block = {marginBottom: 20}
const labelStyle = {fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.45, marginBottom: 8, opacity: 0.8}
const preLine = {whiteSpace: 'pre-line', lineHeight: 1.6}

function getLodgeDocumentId(lodgeField) {
  if (lodgeField == null) return undefined
  if (typeof lodgeField === 'string') return lodgeField
  if (typeof lodgeField === 'object') {
    return lodgeField._ref || lodgeField._id
  }
  return undefined
}

async function fetchLodgeStudioPayload(client, id) {
  const opts = {perspective: 'previewDrafts'}
  let row = await client.fetch(lodgeStudioPreviewById, {id}, opts)
  if (row?.lodge) return row
  if (typeof id === 'string' && !id.startsWith('drafts.')) {
    row = await client.fetch(lodgeStudioPreviewById, {id: `drafts.${id}`}, opts)
  }
  return row
}

function orderDocsByRefList(docs, orderedRefIds) {
  if (!docs?.length || !orderedRefIds?.length) return docs || []
  const m = new Map(docs.map((d) => [d._id, d]))
  return orderedRefIds.map((rid) => m.get(rid)).filter(Boolean)
}

function parseInlineBold(str) {
  if (str == null) return null
  const s = String(str)
  if (!s.includes('**')) return s
  const parts = s.split('**')
  if (parts.length < 2) return s
  return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>))
}

function BlockSection({eyebrow, children, tone}) {
  return (
    <div style={block}>
      <div style={labelStyle}>
        <Text size={0} weight="semibold" muted>
          {eyebrow}
        </Text>
      </div>
      <Card padding={4} border radius={2} tone={tone || 'default'}>
        {children}
      </Card>
    </div>
  )
}

function FieldLabel({title, children}) {
  return (
    <Text size={1} style={{...preLine, marginBottom: 6}}>
      {title && <strong>{title}</strong>}
      {title && children != null && children !== '' ? ' ' : null}
      {children}
    </Text>
  )
}

function EditorialExcerpt({text, maxLength = 420}) {
  if (!text || typeof text !== 'string') {
    return (
      <Text size={1} muted>
        —
      </Text>
    )
  }
  const s = text.length > maxLength ? `${text.slice(0, maxLength)}…` : text
  return (
    <Text size={1} style={preLine}>
      {parseInlineBold(s)}
    </Text>
  )
}

function pickSnap(lodgeDoc, key) {
  const rows = lodgeDoc?.snapshotItems || []
  return rows.find((r) => r?.key === key) || null
}

function mergeLine(override, fallback) {
  const o = override?.trim()
  if (o) return o
  const f = fallback?.trim()
  return f || '—'
}

/** Copy de cabecera final: `lodgePage.sections.<key>` + fallback estático Soqtapata (no usa Lodge). */
function ResolvedSectionHeaderPreview({sections, sectionKey}) {
  const r = resolveLodgePageSectionPreview(sectionKey, sections)
  return (
    <>
      <FieldLabel title="Eyebrow final">{r.eyebrow}</FieldLabel>
      <FieldLabel title="Título final">{r.title}</FieldLabel>
      <FieldLabel title="Cuerpo / introducción final">
        <EditorialExcerpt text={r.body} maxLength={1200} />
      </FieldLabel>
    </>
  )
}

function DebugPayloadJson({data}) {
  if (!DEBUG_LODGE_STUDIO_PAYLOAD) return null
  return (
    <Card padding={3} border tone="transparent" radius={2} style={{marginBottom: 12}}>
      <Text size={0} weight="semibold" style={{marginBottom: 8}}>
        Debug: respuesta del query (Studio)
      </Text>
      <pre style={{fontSize: 11, maxHeight: 280, overflow: 'auto', margin: 0}}>{JSON.stringify(data, null, 2)}</pre>
    </Card>
  )
}

export function StudioLodgePagePreviewInput(props) {
  const section = props?.schemaType?.options?.section || 'general'
  const client = useClient({apiVersion})
  const lodgeRef = useFormValue(['lodge'])
  const lodgeId = getLodgeDocumentId(lodgeRef)

  const heroImage = useFormValue(['heroImage'])
  const experiencesSelectionRaw = useFormValue(['experiencesSelection'])
  const reviewsSelectionRaw = useFormValue(['reviewsSelection'])
  const experiencesSelection = Array.isArray(experiencesSelectionRaw) ? experiencesSelectionRaw : []
  const reviewsSelection = Array.isArray(reviewsSelectionRaw) ? reviewsSelectionRaw : []
  const heroHighlights = useFormValue(['heroHighlights']) || []
  const heroCTA = useFormValue(['heroCTA'])
  const snapshotSelection = useFormValue(['snapshotSelection']) || []
  const navTitle = useFormValue(['navTitle'])
  const navSubtitle = useFormValue(['navSubtitle'])
  const navCTA = useFormValue(['navCTA'])
  const sections = useFormValue(['sections']) || {}
  const featuredRoomStableId = useFormValue(['featuredRoomStableId'])
  const fallbackToLodgeRelations = useFormValue(['fallbackToLodgeRelations'])
  const bookingCta = useFormValue(['bookingCta'])

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [err, setErr] = useState(null)
  const [expRows, setExpRows] = useState(null)
  const [revRows, setRevRows] = useState(null)

  const expKey = useMemo(() => experiencesSelection.map((r) => r?._ref).filter(Boolean).join(','), [experiencesSelection])
  const revKey = useMemo(() => reviewsSelection.map((r) => r?._ref).filter(Boolean).join(','), [reviewsSelection])

  useEffect(() => {
    if (!lodgeId) {
      setLoading(false)
      setData(null)
      setErr(null)
      return
    }
    let cancelled = false
    setLoading(true)
    setErr(null)
    setData(null)
    ;(async () => {
      try {
        const row = await fetchLodgeStudioPayload(client, lodgeId)
        if (cancelled) return
        setLoading(false)
        setData(row ?? null)
      } catch (e) {
        if (cancelled) return
        setLoading(false)
        setData(null)
        setErr(e instanceof Error ? e.message : String(e))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [client, lodgeId])

  useEffect(() => {
    if (!lodgeId || section !== 'experiences') {
      setExpRows(null)
      return
    }
    const ids = experiencesSelection.map((r) => r?._ref).filter(Boolean)
    if (!ids.length) {
      setExpRows([])
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const result = await client.fetch(experienceDocsByIds, {ids})
        if (!cancelled) setExpRows(orderDocsByRefList(result, ids))
      } catch {
        if (!cancelled) setExpRows(null)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [client, lodgeId, section, expKey, experiencesSelection])

  useEffect(() => {
    if (!lodgeId || section !== 'reviews') {
      setRevRows(null)
      return
    }
    const ids = reviewsSelection.map((r) => r?._ref).filter(Boolean)
    if (!ids.length) {
      setRevRows([])
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const result = await client.fetch(reviewDocsByIds, {ids})
        if (!cancelled) setRevRows(orderDocsByRefList(result, ids))
      } catch {
        if (!cancelled) setRevRows(null)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [client, lodgeId, section, revKey, reviewsSelection])

  if (!lodgeId) {
    return (
      <Card padding={4} border tone="caution" radius={2}>
        <Text size={1} style={preLine}>
          Selecciona un <strong>Lodge</strong> en la pestaña General para ver la fuente y la vista previa.
        </Text>
      </Card>
    )
  }

  if (err) {
    return (
      <Card padding={4} border tone="critical" radius={2}>
        <Text size={1} style={preLine}>
          No se pudo cargar el Lodge: {err}
        </Text>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card padding={4} border radius={2}>
        <Text size={1} muted>
          Cargando Lodge…
        </Text>
      </Card>
    )
  }

  const lodge = data?.lodge

  if (!lodge) {
    return (
      <Stack space={3}>
        <DebugPayloadJson data={data} />
        <Card padding={4} border tone="caution" radius={2}>
          <Text size={1} style={preLine}>
            No se encontró contenido del Lodge para la referencia actual (<code>{lodgeId}</code>). Comprueba que el
            documento exista, esté publicado o que el id coincida con el borrador (
            <code>drafts.*</code>).
          </Text>
        </Card>
      </Stack>
    )
  }

  const hasHeroImageOverride = Boolean(heroImage?.asset?._ref)

  const selectionNote = (
    <Text size={1} muted style={{...preLine, marginTop: 12}}>
      {L_NOTE_SELECTION}
    </Text>
  )

  const debugBlock = <DebugPayloadJson data={data} />

  if (section === 'general') {
    return (
      <Stack space={3}>
        {debugBlock}
        <BlockSection eyebrow={L_SOURCE} tone="default">
          <Stack space={2}>
            <FieldLabel title="Nombre del Lodge">{lodge.name || '—'}</FieldLabel>
            <FieldLabel title="Ubicación / ruta">{[lodge.location, lodge.route].filter(Boolean).join(' · ') || '—'}</FieldLabel>
            <FieldLabel title="Altitud">{lodge.altitude != null ? `${lodge.altitude} m` : '—'}</FieldLabel>
            <EditorialExcerpt text={lodge.shortDescription} maxLength={280} />
          </Stack>
        </BlockSection>
        <BlockSection eyebrow={L_PREVIEW} tone="primary">
          <Text size={1} style={preLine}>
            Esta landing enlaza con el Lodge de arriba. El <strong>slug</strong> y el <strong>SEO</strong> de esta
            página definen la URL y los metadatos; el contenido largo se edita en el documento Lodge.
          </Text>
        </BlockSection>
      </Stack>
    )
  }

  if (section === 'hero') {
    return (
      <Stack space={3}>
        {debugBlock}
        <BlockSection eyebrow={L_SOURCE} tone="default">
          <Stack space={2}>
            <FieldLabel title="Nombre">{lodge.name}</FieldLabel>
            <FieldLabel title="Tagline / descripción corta">
              <EditorialExcerpt text={lodge.shortDescription} maxLength={400} />
            </FieldLabel>
            <FieldLabel title="Imagen principal en Lodge">{lodge.mainImageUrl ? 'Sí (asset en Lodge)' : '—'}</FieldLabel>
            <Text size={1} muted style={preLine}>
              Certificaciones: {(lodge.certifications || []).map((c) => c.label).filter(Boolean).join(' · ') || '—'}
            </Text>
          </Stack>
        </BlockSection>
        <BlockSection eyebrow={L_PREVIEW} tone="primary">
          <Stack space={2}>
            <FieldLabel title="Imagen en hero">
              {hasHeroImageOverride ? 'Imagen propia de esta landing' : 'Se usará la imagen principal del Lodge'}
            </FieldLabel>
            <FieldLabel title="Highlights bajo el título (hasta 3)">
              {heroHighlights.length
                ? heroHighlights.map((h, i) => {
                    const row = pickSnap(lodge, h?.key)
                    return (
                      <Text key={h._key || i} size={1} style={{...preLine, display: 'block'}}>
                        · {row ? `${row.label}: ${row.value}` : h?.key || '—'}
                      </Text>
                    )
                  })
                : '— (elige claves debajo)'}
            </FieldLabel>
            <FieldLabel title="CTA">
              {heroCTA?.label && heroCTA?.href
                ? `${heroCTA.label} → ${heroCTA.href}`
                : '— (configura CTA debajo)'}
            </FieldLabel>
          </Stack>
        </BlockSection>
        {selectionNote}
      </Stack>
    )
  }

  if (section === 'highlights') {
    return (
      <Stack space={3}>
        {debugBlock}
        <BlockSection eyebrow={L_SOURCE} tone="default">
          <Text size={1} weight="semibold" style={{marginBottom: 8}}>
            Valores canónicos en el Lodge (barra tipo «snapshot»)
          </Text>
          <Stack space={2}>
            {(lodge.snapshotItems || []).map((row) => (
              <Card key={row.key || row._key} padding={3} border radius={2} tone="transparent">
                <Text size={1}>
                  <strong>{row.label}</strong>: {row.value}
                </Text>
                <Text size={1} muted style={{marginTop: 4}}>
                  Clave: {row.key}
                </Text>
              </Card>
            ))}
          </Stack>
        </BlockSection>
        <BlockSection eyebrow={L_PREVIEW} tone="primary">
          <Text size={1} weight="semibold" style={{marginBottom: 8}}>
            Orden en esta landing (hasta 6)
          </Text>
          {snapshotSelection.length ? (
            <Stack space={2}>
              {snapshotSelection.map((h, i) => {
                const row = pickSnap(lodge, h?.key)
                return (
                  <Card key={h._key || i} padding={3} border radius={2}>
                    <Text size={1}>
                      #{i + 1} — {row ? `${row.label}: ${row.value}` : h?.key || '—'}
                    </Text>
                  </Card>
                )
              })}
            </Stack>
          ) : (
            <Text size={1} muted>
              Añade filas en «Selección y orden» debajo.
            </Text>
          )}
        </BlockSection>
        {selectionNote}
      </Stack>
    )
  }

  if (section === 'navigation') {
    return (
      <Stack space={3}>
        {debugBlock}
        <BlockSection eyebrow={L_SOURCE} tone="default">
          <Text size={1} style={preLine}>
            El menú fijo de esta página <strong>no viene del Lodge</strong>: solo se configura en esta landing.
          </Text>
        </BlockSection>
        <BlockSection eyebrow={L_PREVIEW} tone="primary">
          <FieldLabel title="Título">{mergeLine(navTitle, '')}</FieldLabel>
          <FieldLabel title="Subtítulo">{mergeLine(navSubtitle, '')}</FieldLabel>
          <FieldLabel title="CTA">
            {navCTA?.label && navCTA?.href ? `${navCTA.label} → ${navCTA.href}` : '—'}
          </FieldLabel>
        </BlockSection>
        <Text size={1} muted style={preLine}>
          Edita título, subtítulo y CTA en los campos bajo este panel.
        </Text>
      </Stack>
    )
  }

  if (section === 'overview') {
    return (
      <Stack space={3}>
        {debugBlock}
        <BlockSection eyebrow={L_SOURCE} tone="default">
          <Text size={1} weight="semibold" style={{marginBottom: 8}}>
            Texto largo y lista de ideas clave (Lodge)
          </Text>
          {lodge.keyElements?.length ? (
            <ul style={{margin: '0 0 12px', paddingLeft: 20}}>
              {lodge.keyElements.map((x, i) => (
                <li key={i} style={{marginBottom: 6}}>
                  <Text size={1} style={preLine}>
                    {parseInlineBold(x)}
                  </Text>
                </li>
              ))}
            </ul>
          ) : (
            <Text size={1} muted>
              (Sin bullets en keyElements)
            </Text>
          )}
          <EditorialExcerpt text={lodge.longDescription} maxLength={500} />
        </BlockSection>
        <BlockSection eyebrow={L_PREVIEW} tone="primary">
          <ResolvedSectionHeaderPreview sections={sections} sectionKey="overview" />
        </BlockSection>
      </Stack>
    )
  }

  if (section === 'accommodations') {
    const rooms = lodge.rooms || []
    const featured = rooms.find((r) => r.stableId === featuredRoomStableId)
    return (
      <Stack space={3}>
        {debugBlock}
        <BlockSection eyebrow={L_SOURCE} tone="default">
          <Stack space={2}>
            {rooms.length ? (
              rooms.map((r) => (
                <Card key={r.stableId || r._key} padding={3} border radius={2} tone="transparent">
                  <Text size={1} weight="semibold">
                    {r.name} · {r.stableId}
                  </Text>
                  <Text size={1} muted style={{marginTop: 4}}>
                    {r.numberOfRooms} unidad(es) · hasta {r.capacity} huéspedes
                  </Text>
                </Card>
              ))
            ) : (
              <Text size={1} muted>
                Sin habitaciones en el documento Lodge.
              </Text>
            )}
          </Stack>
        </BlockSection>
        <BlockSection eyebrow={L_PREVIEW} tone="primary">
          <FieldLabel title="Habitación destacada">
            {featured ? `${featured.name} (${featured.stableId})` : featuredRoomStableId || '—'}
          </FieldLabel>
          <ResolvedSectionHeaderPreview sections={sections} sectionKey="accommodation" />
        </BlockSection>
        {selectionNote}
      </Stack>
    )
  }

  if (section === 'commonAreas') {
    const nAreas = (lodge.commonAreas || []).length
    const nAmenities = (lodge.amenities || []).length
    return (
      <Stack space={3}>
        {debugBlock}
        <BlockSection eyebrow={L_SOURCE} tone="default">
          <Text size={1} style={preLine}>
            Zonas comunes: <strong>{nAreas}</strong> · Comodidades listadas: <strong>{nAmenities}</strong>
          </Text>
          <Stack space={2} style={{marginTop: 12}}>
            {(lodge.commonAreas || []).slice(0, 4).map((a, i) => (
              <Text key={a._key || i} size={1} style={preLine}>
                · {a.title}
              </Text>
            ))}
            {nAreas > 4 ? <Text size={1} muted>…</Text> : null}
          </Stack>
        </BlockSection>
        <BlockSection eyebrow={L_PREVIEW} tone="primary">
          <ResolvedSectionHeaderPreview sections={sections} sectionKey="facilities" />
        </BlockSection>
      </Stack>
    )
  }

  if (section === 'gettingHere') {
    return (
      <Stack space={3}>
        {debugBlock}
        <BlockSection eyebrow={L_SOURCE} tone="default">
          <Stack space={2}>
            {(lodge.journeySteps || []).length ? (
              (lodge.journeySteps || []).map((s, i) => (
                <Text key={s._key || i} size={1} style={preLine}>
                  <strong>{s.title}</strong> — {s.description}
                </Text>
              ))
            ) : (
              <Text size={1} muted>
                Sin pasos en journeySteps.
              </Text>
            )}
          </Stack>
          <Text size={1} style={{...preLine, marginTop: 12}}>
            <strong>Mensaje de reserva / acceso:</strong>
          </Text>
          <EditorialExcerpt text={lodge.bookingMessage} maxLength={400} />
        </BlockSection>
        <BlockSection eyebrow={L_PREVIEW} tone="primary">
          <ResolvedSectionHeaderPreview sections={sections} sectionKey="location" />
        </BlockSection>
      </Stack>
    )
  }

  if (section === 'science') {
    return (
      <Stack space={3}>
        {debugBlock}
        <BlockSection eyebrow={L_SOURCE} tone="default">
          <Stack space={2}>
            {(lodge.highlights || []).map((h, i) => (
              <Text key={h._key || i} size={1} style={preLine}>
                <strong>{h.title}</strong> — {h.subtitle}
              </Text>
            ))}
            {(lodge.researchAreas || []).map((a, i) => (
              <Card key={a._key || i} padding={3} border radius={2} tone="transparent">
                <Text size={1} weight="semibold">
                  {a.title}
                </Text>
                <EditorialExcerpt text={a.description} maxLength={220} />
              </Card>
            ))}
            {lodge.specialMessage ? (
              <Text size={1} muted style={preLine}>
                Nota: {lodge.specialMessage}
              </Text>
            ) : null}
          </Stack>
        </BlockSection>
        <BlockSection eyebrow={L_PREVIEW} tone="primary">
          <ResolvedSectionHeaderPreview sections={sections} sectionKey="research" />
        </BlockSection>
      </Stack>
    )
  }

  if (section === 'experiences') {
    const lodgeExp = lodge.experiences || []
    const useFallback =
      (!experiencesSelection?.length && fallbackToLodgeRelations !== false && lodgeExp.length > 0) || false
    const waitingList =
      !useFallback && (experiencesSelection?.length ?? 0) > 0 && expRows === null
    const list = useFallback ? lodgeExp : expRows || []

    if (waitingList) {
      return (
        <Card padding={4} border radius={2}>
          <Text size={1} muted>
            Cargando experiencias elegidas…
          </Text>
        </Card>
      )
    }

    return (
      <Stack space={3}>
        {debugBlock}
        <BlockSection eyebrow={L_SOURCE} tone="default">
          <Text size={1} style={preLine}>
            Programas vinculados al Lodge: <strong>{lodgeExp.length}</strong>
          </Text>
          {lodgeExp.map((x) => (
            <Text key={x._id} size={1} style={{...preLine, display: 'block'}}>
              · {x.name}
            </Text>
          ))}
        </BlockSection>
        <BlockSection eyebrow={L_PREVIEW} tone="primary">
          <FieldLabel title="Lista mostrada">
            {useFallback ? 'Orden del Lodge (sin lista propia en esta landing)' : 'Orden de esta landing'}
          </FieldLabel>
          {list.length ? (
            list.map((x, i) => (
              <Text key={x._id || i} size={1} style={{...preLine, display: 'block'}}>
                #{i + 1} {x.name}
              </Text>
            ))
          ) : (
            <Text size={1} muted>
              —
            </Text>
          )}
          <ResolvedSectionHeaderPreview sections={sections} sectionKey="experiences" />
        </BlockSection>
        {selectionNote}
      </Stack>
    )
  }

  if (section === 'reviews') {
    const lodgeRev = lodge.reviews || []
    const waitingRev = (reviewsSelection?.length ?? 0) > 0 && revRows === null
    const list = revRows || []

    if (waitingRev) {
      return (
        <Card padding={4} border radius={2}>
          <Text size={1} muted>
            Cargando reseñas elegidas…
          </Text>
        </Card>
      )
    }

    return (
      <Stack space={3}>
        {debugBlock}
        <BlockSection eyebrow={L_SOURCE} tone="default">
          <Text size={1} style={preLine}>
            Reseñas en el Lodge: <strong>{lodgeRev.length}</strong> (referencias)
          </Text>
          {lodgeRev.slice(0, 3).map((r) => (
            <Text key={r._id} size={1} muted style={{...preLine, display: 'block'}}>
              · {r.authorName}: {r.quote?.slice(0, 80)}…
            </Text>
          ))}
        </BlockSection>
        <BlockSection eyebrow={L_PREVIEW} tone="primary">
          <FieldLabel title="Reseñas en esta landing">{list.length ? `${list.length} elegidas` : '—'}</FieldLabel>
          {list.slice(0, 4).map((r) => (
            <Text key={r._id} size={1} style={{...preLine, display: 'block'}}>
              {r.rating}★ {r.authorName} — {r.quote?.slice(0, 100)}…
            </Text>
          ))}
          <ResolvedSectionHeaderPreview sections={sections} sectionKey="reviews" />
        </BlockSection>
        {selectionNote}
      </Stack>
    )
  }

  if (section === 'faq') {
    const items = lodge.faqs || []
    return (
      <Stack space={3}>
        {debugBlock}
        <BlockSection eyebrow={L_SOURCE} tone="default">
          {items.length ? (
            <ul style={{margin: 0, paddingLeft: 20}}>
              {items.map((f, i) => (
                <li key={f._key || i} style={{marginBottom: 12}}>
                  <Text size={1} weight="semibold">
                    {f.question}
                  </Text>
                  <EditorialExcerpt text={f.answer} maxLength={200} />
                </li>
              ))}
            </ul>
          ) : (
            <Text size={1} muted>
              Sin preguntas en el Lodge.
            </Text>
          )}
        </BlockSection>
        <BlockSection eyebrow={L_PREVIEW} tone="primary">
          <ResolvedSectionHeaderPreview sections={sections} sectionKey="faq" />
        </BlockSection>
      </Stack>
    )
  }

  if (section === 'booking') {
    return (
      <Stack space={3}>
        {debugBlock}
        <BlockSection eyebrow={L_SOURCE} tone="default">
          <Stack space={2}>
            <FieldLabel title="Desde precio">
              {lodge.startingPrice != null ? `${lodge.currency || 'USD'} ${lodge.startingPrice}` : '—'}
            </FieldLabel>
            <FieldLabel title="Grupo máx.">{lodge.maxGroupSize ?? '—'}</FieldLabel>
            <FieldLabel title="Disponibilidad">{lodge.availabilityNote || '—'}</FieldLabel>
            <Text size={1} weight="semibold" style={{marginTop: 8}}>
              Confianza (Lodge)
            </Text>
            {(lodge.trustItems || []).map((t, i) => (
              <Text key={t._key || i} size={1} style={preLine}>
                · {t.title}
                {t.subtitle ? ` — ${t.subtitle}` : ''}
              </Text>
            ))}
          </Stack>
        </BlockSection>
        <BlockSection eyebrow={L_PREVIEW} tone="primary">
          <ResolvedSectionHeaderPreview sections={sections} sectionKey="booking" />
          <Text size={1} weight="semibold" style={{...preLine, marginTop: 16, marginBottom: 8}}>
            Bloque reserva (campos de esta landing)
          </Text>
          <FieldLabel title="Título de tarjeta">{bookingCta?.title?.trim() || '—'}</FieldLabel>
          <FieldLabel title="Cuerpo">{bookingCta?.body?.trim() || '—'}</FieldLabel>
          <FieldLabel title="CTAs">
            {(bookingCta?.ctas || [])
              .map((c) => (c?.label && c?.href ? `${c.label} → ${c.href}` : null))
              .filter(Boolean)
              .join(' · ') || '—'}
          </FieldLabel>
        </BlockSection>
        {selectionNote}
      </Stack>
    )
  }

  return (
    <Stack space={2}>
      {debugBlock}
      <Card padding={3} border tone="caution">
        <Text size={1}>Vista previa no disponible para esta pestaña.</Text>
      </Card>
    </Stack>
  )
}
