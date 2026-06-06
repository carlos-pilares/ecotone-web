'use client'

import {useEffect, useMemo, useState} from 'react'
import {useClient, useFormValue} from 'sanity'
import {Box, Card, Stack, Text} from '@sanity/ui'
import {apiVersion} from '../../env'
import {
  experienceStudioPreviewById,
  experienceDocsByIds,
  learningProgrammeStudioPreviewById,
  reviewDocsByIds,
  techDocsByIds,
} from '../../lib/experiencePageStudioQuery'
import {SNAPSHOT_BAR_SLOT_OPTIONS, resolveSnapshotStatPreview} from '../../lib/snapshotBarShared'
import {getActualWebHeadlines} from '../../lib/webHeadlineReference'
import {getModuleKeyForPreviewSection} from '../../lib/pageModuleShared'
import {soqtapataExperience} from '../../../data/soqtapataExperienceLocal'
import {alsoBookFromStructuredRow, buildSoqtapataStudioPreviewRow} from '../../../lib/soqtapataStructuredCms'

/** Orden de resultados GROQ según el orden de `_ref` en la landing (cards, reseñas, etc.). */
function orderDocsByRefList(docs, orderedRefIds) {
  if (!docs?.length || !orderedRefIds?.length) return docs || []
  const m = new Map(docs.map((d) => [d._id, d]))
  return orderedRefIds.map((rid) => m.get(rid)).filter(Boolean)
}

// --- UI solo Studio (no datos, queries ni front público) ---

const L_WEB = '1. Fuente'
const L_OV = '3. Edición de esta landing'
const L_SRC = '1. Fuente'

const block = {marginBottom: 20}
const subBlock = {marginBottom: 12}
const labelStyle = {fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.45, marginBottom: 8, opacity: 0.8}
const preLine = {whiteSpace: 'pre-line', lineHeight: 1.6}

function parseInlineBold(str) {
  if (str == null) return null
  const s = String(str)
  if (!s.includes('**')) return s
  const parts = s.split('**')
  if (parts.length < 2) return s
  return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>))
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

function BodyMultiline({text, size = 1, muted, weight}) {
  if (text == null || text === '') {
    return (
      <Text size={1} muted>
        —
      </Text>
    )
  }
  return (
    <Text size={size} weight={weight} muted={muted} style={{...preLine, marginBottom: 0}}>
      {parseInlineBold(text)}
    </Text>
  )
}

function EditorialExcerpt({text, maxLength = 500}) {
  if (!text || typeof text !== 'string') {
    return (
      <Text size={1} muted>
        (sin texto en la experiencia vinculada)
      </Text>
    )
  }
  const s = text.length > maxLength ? `${text.slice(0, maxLength)}…` : text
  return (
    <div style={subBlock}>
      <Text size={1} style={preLine}>
        {parseInlineBold(s)}
      </Text>
    </div>
  )
}

function MutedLine({children}) {
  return (
    <Text size={1} muted style={{...preLine, marginBottom: 0}}>
      {children}
    </Text>
  )
}

function Muted({children}) {
  return <MutedLine>{children}</MutedLine>
}

function H({children}) {
  return (
    <Text weight="semibold" size={1} style={{display: 'block', marginBottom: 10}}>
      {children}
    </Text>
  )
}

function OverrideContextNote() {
  return (
    <MutedLine>
      Personaliza solo esta landing. El contenido base se sigue editando en su sección correspondiente.
    </MutedLine>
  )
}

function FuenteAtribucion({children}) {
  return (
    <BlockSection eyebrow={L_SRC} tone="transparent">
      <Text size={1} muted style={preLine}>
        {children}
      </Text>
    </BlockSection>
  )
}

function useStableRefs(refs) {
  return useMemo(() => (refs || []).map((r) => r?._ref).filter(Boolean).join(','), [refs])
}

function sortStudioResourceCards(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return []
  return rows
    .map((r, idx) => ({ r, idx }))
    .filter(({ r }) => r?.visible !== false)
    .sort((a, b) => {
      const oa = a.r?.order ?? 10000
      const ob = b.r?.order ?? 10000
      if (oa !== ob) return oa - ob
      return a.idx - b.idx
    })
    .map(({ r }) => r)
}

function studioResourceFileLine(r) {
  const asset = r?.fileAssetUrl && String(r.fileAssetUrl).trim()
  const url = r?.fileUrl && String(r.fileUrl).trim()
  if (asset) return `PDF (Sanity): ${asset}`
  if (url) return `URL: ${url}`
  return '— (sin archivo configurado)'
}

const TECH_PREVIEW_FALLBACK_TEXT =
  'Esta experiencia incluye EcoDroneView® y ForestWhisper® en tu pack. EcoSpeciesExplorer® está disponible en tu dispositivo.'

export function StudioPreviewInput(props) {
  const section = props?.schemaType?.options?.section || 'overview'
  const client = useClient({apiVersion})
  const expRef = useFormValue(['experience'])
  const lpRef = useFormValue(['learningProgramme'])
  const id = expRef?._ref || lpRef?._ref
  const pageHero = useFormValue(['pageHero'])
  const sectionModules = useFormValue(['sectionModules']) || []
  const snapshotStatSelections = useFormValue(['snapshotStatSelections']) || []
  const reviewRefs = useFormValue(['reviewRefs']) || []
  const techRefs = useFormValue(['techProductRefs']) || []
  const relatedRefs = useFormValue(['relatedExperienceRefs']) || []
  const reserveBlock = useFormValue(['reserveBlock'])
  const [data, setData] = useState(null)
  const [rdata, setRdata] = useState(null)
  const [err, setErr] = useState(null)
  const revKey = useStableRefs(reviewRefs)
  const techKey = useStableRefs(techRefs)
  const relatedKey = useStableRefs(relatedRefs)

  useEffect(() => {
    if (!id) {
      setData(null)
      setErr(null)
      return
    }
    let cancelled = false
    setErr(null)

    async function run() {
      try {
        const query = lpRef?._ref && !expRef?._ref ? learningProgrammeStudioPreviewById : experienceStudioPreviewById
        const d = await client.fetch(query, {id})
        if (cancelled) return
        setData(d)
      } catch (e) {
        if (!cancelled) {
          setData(null)
          setErr(e instanceof Error ? e.message : String(e))
        }
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [client, id, expRef?._ref, lpRef?._ref])

  useEffect(() => {
    if (!id) {
      setRdata(null)
      return
    }
    let cancelled = false

    async function run() {
      const reviewIds = (reviewRefs || []).map((r) => r?._ref).filter(Boolean)
      const techIds = (techRefs || []).map((r) => r?._ref).filter(Boolean)
      const relatedIds = (relatedRefs || []).map((r) => r?._ref).filter(Boolean)
      try {
        if (section === 'reviews' && reviewIds.length) {
          const result = await client.fetch(reviewDocsByIds, {ids: reviewIds})
          if (!cancelled) setRdata(orderDocsByRefList(result, reviewIds))
          return
        }
        if (section === 'tech' && techIds.length) {
          const result = await client.fetch(techDocsByIds, {ids: techIds})
          if (!cancelled) setRdata(orderDocsByRefList(result, techIds))
          return
        }
        if (section === 'related' && relatedIds.length) {
          const result = await client.fetch(experienceDocsByIds, {ids: relatedIds})
          if (!cancelled) setRdata(orderDocsByRefList(result, relatedIds))
          return
        }
        if (!cancelled) setRdata(null)
      } catch (e) {
        if (!cancelled) {
          setRdata(null)
          setErr(e instanceof Error ? e.message : String(e))
        }
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [client, id, section, revKey, techKey, relatedKey, reviewRefs, techRefs, relatedRefs])

  const isLoadingE = id && !data && !err
  const needsE = new Set([
    'general',
    'hero',
    'overview',
    'highlights',
    'itinerary',
    'lodge',
    'wildlife',
    'includes',
    'tech',
    'gallery',
    'when',
    'beforeYou',
    'terms',
    'resources',
    'faq',
    'related',
    'reserve',
  ])

  if (!id) {
    return (
      <Card padding={4} border tone="caution" radius={2}>
        <Text size={1} style={preLine}>
          Elige <strong>Experiencia vinculada</strong> (pestaña General) para previsualizar el
          contenido.
        </Text>
      </Card>
    )
  }

  if (err) {
    return (
      <Card padding={4} border tone="critical" radius={2}>
        <Text size={1} style={preLine}>
          No se pudo cargar la previsualización: {err}
        </Text>
      </Card>
    )
  }

  if (needsE.has(section) && isLoadingE) {
    return (
      <Card padding={4} border radius={2}>
        <Text size={1} muted>
          Cargando experiencia…
        </Text>
      </Card>
    )
  }

  const e = data
  const moduleKey = getModuleKeyForPreviewSection(section)
  const moduleRow = moduleKey ? sectionModules.find((m) => m?.key === moduleKey) || null : null

  if (section === 'internalNav') {
    return (
      <Stack space={4}>
        <BlockSection eyebrow={L_OV} tone="default">
          <Text size={1} style={preLine}>
            El menú interno sticky es **solo de esta landing**. Edita título, subtítulo, ítems y CTAs en los
            campos debajo; no hay fuente canónica externa para estos valores.
          </Text>
        </BlockSection>
      </Stack>
    )
  }

  if (section === 'general' && e) {
    return (
      <Stack space={4}>
        <BlockSection eyebrow={L_WEB} tone="default">
          <Stack space={2}>
            <FieldLabel title="Nombre del programa (lista / referencia)">{e.name || '—'}</FieldLabel>
            <FieldLabel title="Estado (Experiencia)">{e.status || '—'}</FieldLabel>
            <FieldLabel title="Precio base (número)">
              {e.price != null ? String(e.price) : '—'}
            </FieldLabel>
            <FieldLabel title="Etiqueta de precio">{e.priceLabel || '—'}</FieldLabel>
            <FieldLabel title="Tagline">
              {e.tagline != null && e.tagline !== '' ? parseInlineBold(e.tagline) : '—'}
            </FieldLabel>
          </Stack>
        </BlockSection>
        <BlockSection eyebrow={L_OV} tone="caution">
          <Text size={1} style={preLine}>
            Slug, SEO y campos de esta <strong>landing</strong> definen la URL y metadatos. El programa en
            sí se edita en <strong>Content library → Experiences</strong>.
          </Text>
        </BlockSection>
        <FuenteAtribucion>
          Todos los datos de referencia de arriba provienen del documento <strong>Experiencia</strong>{' '}
          vinculado en General, hasta que modifiquen ese documento o los campos propios de esta URL.
        </FuenteAtribucion>
      </Stack>
    )
  }

  if (section === 'hero' && e) {
    return (
      <Stack space={4}>
        <BlockSection eyebrow={L_WEB} tone="default">
          <Stack space={3}>
            <FieldLabel title="Título (H1) mostrado">
              {pageHero?.headline?.trim() ? (
                <strong>{pageHero.headline}</strong>
              ) : (
                <>
                  {e.name}{' '}
                  <span style={{opacity: 0.75, fontSize: '0.95em'}}>
                    (heredado de Experiencia, sin H1 de override)
                  </span>
                </>
              )}
            </FieldLabel>
            <FieldLabel title="Subtítulo / tagline mostrado">
              {pageHero?.headlineSub?.trim() || e.tagline || '—'}
            </FieldLabel>
            <FieldLabel title="Badges / pills">
              {pageHero?.pills?.length
                ? pageHero.pills.join(' · ')
                : [e.programType, e.duration, e.route].filter(Boolean).join(' · ') || '— (front / default)'}
            </FieldLabel>
            <FieldLabel title="Precio en hero">
              {pageHero?.priceLine
                ? pageHero.priceLine
                : pageHero?.useProductPrice !== false
                  ? e.priceLabel != null && e.priceLabel !== ''
                    ? e.priceLabel
                    : e.price != null
                      ? `USD ${e.price}`
                      : '—'
                  : '—'}
              {pageHero?.priceSub ? <span> · {pageHero.priceSub}</span> : null}
            </FieldLabel>
            {pageHero?.bookCta?.label ? (
              <FieldLabel title="CTA">
                {pageHero.bookCta.label} → {pageHero.bookCta.href}
              </FieldLabel>
            ) : null}
          </Stack>
        </BlockSection>
        <BlockSection eyebrow={L_OV} tone="caution">
          <Stack space={2}>
            <Text size={1} style={preLine}>
              Título, subtítulo, pastillas, precio y CTA del hero: solo si rellenan en{' '}
              <strong>Hero (esta URL)</strong>. Vacío = se hereda de la <strong>Experiencia</strong> o
              regla del front. Imagen de hero: mismo criterio.
            </Text>
          </Stack>
        </BlockSection>
        <BlockSection eyebrow={L_SRC} tone="transparent">
          <Text size={1} style={preLine}>
            <strong>Experiencia</strong>: nombre, tagline, precio, imagen principal por defecto. Editar allí
            el canónico; el hero de esta pestaña pisa solo lo que rellenan.
          </Text>
          <Text size={1} style={{...preLine, marginTop: 8}}>
            <strong>Imagen principal (Experiencia):</strong> {e.mainImageUrl ? 'Sí (asset)' : '—'}
          </Text>
        </BlockSection>
        <div style={subBlock}>
          <OverrideContextNote />
        </div>
      </Stack>
    )
  }

  if (section === 'highlights' && e) {
    return (
      <Stack space={4}>
        <BlockSection eyebrow={L_SRC} tone="default">
          <Text size={1} weight="semibold" style={{marginBottom: 8}}>
            Fuente canónica — barra de stats (snapshot)
          </Text>
          <Text size={1} muted style={{marginBottom: 12, lineHeight: 1.5}}>
            Cada celda usa los mismos datos que la Experiencia vinculada (duración, Cusco, altitud, grupo,
            inclusivo fijo en preview, ecosistema). Solo lectura aquí.
          </Text>
          <Stack space={3}>
            {SNAPSHOT_BAR_SLOT_OPTIONS.map((opt) => {
              const {value: pv, label: pl} = resolveSnapshotStatPreview(e, opt.value)
              return (
                <Card key={opt.value} padding={3} border radius={2} tone="transparent">
                  <Text size={1}>
                    <strong>{pl}</strong>
                  </Text>
                  <Text size={1} muted style={{marginTop: 4}}>
                    Valor mostrado: {pv}
                  </Text>
                </Card>
              )
            })}
          </Stack>
        </BlockSection>
        <BlockSection eyebrow={L_OV} tone="caution">
          <Text size={1} weight="semibold" style={{marginBottom: 8}}>
            Selección de esta landing (hasta 6 · orden = orden de lista)
          </Text>
          {snapshotStatSelections.length ? (
            <Stack space={3}>
              {snapshotStatSelections.map((row, i) => {
                const slot = row?.slot
                const {value: pv, label: pl} = resolveSnapshotStatPreview(e, slot)
                const vis = row?.visible !== false
                return (
                  <Card key={row._key || `${slot}-${i}`} padding={3} border radius={2}>
                    <Text size={1} weight="semibold">
                      #{i + 1} · {slot || '—'}
                    </Text>
                    <Text size={1} style={{marginTop: 6}}>
                      {pl}: <strong>{pv}</strong>
                    </Text>
                    <Text size={1} muted style={{marginTop: 4}}>
                      Visible en esta landing: {vis ? 'sí' : 'no'}
                    </Text>
                  </Card>
                )
              })}
            </Stack>
          ) : (
            <Muted>Añade filas en «Stats mostrados en esta landing» debajo.</Muted>
          )}
        </BlockSection>
      </Stack>
    )
  }

  if (section === 'reserve' && e) {
    const row = buildSoqtapataStudioPreviewRow({
      relatedRefIds: [],
      relatedExperiencesFromLanding: [],
      reserveBlock,
    })
    const {book} = alsoBookFromStructuredRow(row, soqtapataExperience)
    const h = getActualWebHeadlines(moduleKey, moduleRow || {})
    const lead =
      moduleRow?.sectionText?.trim() ||
      [
        book.sub?.trim(),
        [book.price, book.priceSmall].filter(Boolean).join(' ').trim(),
      ]
        .filter(Boolean)
        .join(' · ') ||
      'Precio, filas informativas y CTAs según la resolución publicada de esta ruta.'

    return (
      <Stack space={4}>
        <BlockSection eyebrow={L_WEB} tone="default">
          <Stack space={2}>
            <FieldLabel title="Programa (Experiencia)">{e.name || '—'}</FieldLabel>
            <FieldLabel title="Precio / etiqueta">
              {e.priceLabel?.trim()
                ? e.priceLabel
                : e.price != null
                  ? `USD ${e.price}`
                  : '—'}
            </FieldLabel>
            <FieldLabel title="Duración">{e.duration || '—'}</FieldLabel>
            <FieldLabel title="Tipo · ruta">
              {[e.programType, e.route].filter(Boolean).join(' · ') || '—'}
            </FieldLabel>
            <Text size={1} muted style={{...preLine, marginTop: 4}}>
              Contenido base del producto viene de la <strong>Experiencia</strong>. El bloque #book en la web
              combina esos datos con los overrides de <strong>esta landing</strong> (abajo) y los valores por
              defecto publicados de la ruta.
            </Text>
          </Stack>
        </BlockSection>
        <BlockSection eyebrow="2. Vista previa" tone="primary">
          <Stack space={3}>
            <FieldLabel title="Eyebrow final:">{h.eyebrow}</FieldLabel>
            <FieldLabel title="Título final:">{h.title}</FieldLabel>
            <FieldLabel title="Texto final:">{lead}</FieldLabel>
            <Text size={1} muted style={preLine}>
              <strong>Rótulo y H2 de la tarjeta (resueltos):</strong> {book.eyebrow} · {book.h2}
            </Text>
            <Text size={1} muted style={preLine}>
              <strong>Precio en tarjeta:</strong> {book.price}
              {book.priceSmall ? <small> {book.priceSmall}</small> : null}
            </Text>
            {book.sub ? (
              <Text size={1} muted style={preLine}>
                <strong>Subtítulo:</strong> {book.sub}
              </Text>
            ) : null}
            <Text size={1} muted style={preLine}>
              <strong>Filas informativas ({book.rows.length}):</strong>{' '}
              {book.rows.length
                ? book.rows.map((r) => `${r.label}: ${r.value}`).join(' · ')
                : '—'}
            </Text>
            <Text size={1} muted style={preLine}>
              <strong>CTA principal:</strong> {book.wetravelLabel} → {book.wetravelUrl}
            </Text>
            <Text size={1} muted style={preLine}>
              <strong>WhatsApp:</strong> {book.whatsappLabel} → {book.whatsappUrl}
            </Text>
            <Text size={1} muted style={preLine}>
              <strong>Texto legal:</strong> {book.termsNote || '—'}
              {book.termsHash ? <em> ({book.termsHash})</em> : null}
            </Text>
          </Stack>
        </BlockSection>
      </Stack>
    )
  }

  return (
    <Stack space={4}>
      {section === 'overview' && e && (
        <>
          <BlockSection eyebrow={L_WEB} tone="default">
            <H>Overview</H>
            <Text size={1} weight="semibold" style={{marginBottom: 8}}>
              Highlights
            </Text>
            {e.highlights?.length ? (
              <ul style={{margin: '0 0 12px', paddingLeft: 20}}>
                {e.highlights.map((h, i) => (
                  <li key={i} style={{marginBottom: 8}}>
                    <Text size={1} style={preLine}>
                      {parseInlineBold(h)}
                    </Text>
                  </li>
                ))}
              </ul>
            ) : (
              <Muted>—</Muted>
            )}
            <Text size={1} weight="semibold" style={subBlock}>
              Texto principal
            </Text>
            <EditorialExcerpt text={e.fullDescription || e.shortDescription} maxLength={500} />
          </BlockSection>
          {(() => {
            const h = getActualWebHeadlines('overview', moduleRow || {})
            const lead =
              moduleRow?.sectionText?.trim() ||
              e.shortDescription ||
              'Se publicará la descripción completa del programa pronto.'
            const bodySource = e.fullDescription || e.shortDescription
            return (
              <BlockSection eyebrow="2. Vista previa" tone="primary">
                <Stack space={3}>
                  <FieldLabel title="Eyebrow final:">{h.eyebrow}</FieldLabel>
                  <FieldLabel title="Título final:">{h.title}</FieldLabel>
                  <FieldLabel title="Texto final:">{lead}</FieldLabel>
                  <Text size={1} muted style={{...preLine, marginTop: 4}}>
                    <strong>Cuerpo final:</strong>{' '}
                    {bodySource
                      ? 'se muestra desde Experiencia (fullDescription/shortDescription).'
                      : 'si falta contenido, se usa el texto base del sitio.'}
                  </Text>
                  <Text size={1} muted style={preLine}>
                    <strong>Highlights finales:</strong> {(e.highlights || []).length} item(s) desde Experiencia.
                  </Text>
                </Stack>
              </BlockSection>
            )
          })()}
        </>
      )}

      {section === 'itinerary' && e?.itinerary && e.itinerary.length > 0 && (
        <>
          <BlockSection eyebrow={L_WEB} tone="default">
            <Stack space={3}>
              {e.itinerary.map((d, i) => (
                <Card key={i} padding={3} border radius={1}>
                  <Text size={1} weight="semibold" style={subBlock}>
                    Día {d.dayNumber ?? i + 1}: {d.title}
                  </Text>
                  {d.subtitle && (
                    <Text size={1} muted style={{...preLine, marginBottom: 8}}>
                      {parseInlineBold(d.subtitle)}
                    </Text>
                  )}
                  {d.timeline?.length > 0 && (
                    <Box marginTop={1}>
                      <Stack space={3}>
                        {d.timeline.map((t, j) => (
                          <div key={j}>
                            <Text size={1} style={preLine}>
                              <strong>{t.time}</strong> — {t.title}
                            </Text>
                            {t.description ? (
                              <Text size={1} muted style={{...preLine, marginTop: 6}}>
                                {parseInlineBold(t.description)}
                              </Text>
                            ) : null}
                          </div>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Card>
              ))}
            </Stack>
          </BlockSection>
          {(() => {
            const h = getActualWebHeadlines('itinerary', moduleRow || {})
            const lead =
              moduleRow?.sectionText?.trim() ||
              `Cronograma día por día desde Experiencia (${e.itinerary.length} día${e.itinerary.length === 1 ? '' : 's'}).`
            return (
              <BlockSection eyebrow="2. Vista previa" tone="primary">
                <FieldLabel title="Eyebrow final:">{h.eyebrow}</FieldLabel>
                <FieldLabel title="Título final:">{h.title}</FieldLabel>
                <FieldLabel title="Texto final:">{lead}</FieldLabel>
                <Text size={1} muted style={preLine}>
                  {e.itinerary.length} día(s) visibles desde Experiencia.
                </Text>
              </BlockSection>
            )
          })()}
        </>
      )}

      {section === 'itinerary' && e && (!e.itinerary || e.itinerary.length === 0) && (
        <Muted>La experiencia aún no tiene días de itinerario.</Muted>
      )}

      {section === 'lodge' && e?.lodge && (
        <>
          <BlockSection eyebrow={L_WEB} tone="default">
            <FieldLabel title="Nombre:">{e.lodge.name}</FieldLabel>
            {e.lodge.mainImageUrl && (
              <Text size={1} muted style={{...preLine, marginBottom: 8}}>
                Imagen: asset en el documento Lodge
              </Text>
            )}
            {e.lodge.shortDescription && <EditorialExcerpt text={e.lodge.shortDescription} maxLength={400} />}
            {e.lodge.amenities?.length > 0 && (
              <Text size={1} style={preLine}>
                <strong>Comodidades / amenities: </strong>
                {e.lodge.amenities.map((a, i) => (
                  <span key={i}>
                    {i > 0 ? ' · ' : null}
                    {parseInlineBold(a)}
                  </span>
                ))}
              </Text>
            )}
          </BlockSection>
          {(() => {
            const h = getActualWebHeadlines('lodge', moduleRow || {})
            const lead =
              moduleRow?.sectionText?.trim() ||
              e.lodge.shortDescription ||
              'Los detalles del lodge vienen del lodge vinculado en Experiencia.'
            return (
              <BlockSection eyebrow="2. Vista previa" tone="primary">
                <FieldLabel title="Eyebrow final:">{h.eyebrow}</FieldLabel>
                <FieldLabel title="Título final:">{h.title}</FieldLabel>
                <FieldLabel title="Texto final:">{lead}</FieldLabel>
                <Text size={1} muted style={preLine}>
                  Lodge mostrado: {e.lodge.name || '—'}.
                </Text>
              </BlockSection>
            )
          })()}
        </>
      )}

      {section === 'lodge' && e && !e.lodge && <Muted>Sin Lodge referenciado en la experiencia.</Muted>}

      {section === 'wildlife' && e?.wildlife && e.wildlife.length > 0 && (
        <>
          <BlockSection eyebrow={L_WEB} tone="default">
            <ul style={{margin: 0, paddingLeft: 20}}>
              {e.wildlife.map((w, i) => (
                <li key={i} style={{marginBottom: 12}}>
                  <Text size={1} style={preLine}>
                    <strong>{w.name}</strong>
                  </Text>
                  <Text size={1} style={{...preLine, marginTop: 4}}>
                    {parseInlineBold(w.description)} ({w.iconType})
                  </Text>
                </li>
              ))}
            </ul>
          </BlockSection>
          {(() => {
            const h = getActualWebHeadlines('wildlife', moduleRow || {})
            const lead =
              moduleRow?.sectionText?.trim() ||
              'No está garantizado: es naturaleza silvestre. El equipo de campo lo observa con frecuencia en este corredor.'
            return (
              <BlockSection eyebrow="2. Vista previa" tone="primary">
                <FieldLabel title="Eyebrow final:">{h.eyebrow}</FieldLabel>
                <FieldLabel title="Título final:">{h.title}</FieldLabel>
                <FieldLabel title="Texto final:">{lead}</FieldLabel>
                <Text size={1} muted style={preLine}>
                  Especies visibles: {e.wildlife.length} item(s) desde Experiencia.
                </Text>
              </BlockSection>
            )
          })()}
        </>
      )}

      {section === 'wildlife' && e && (!e.wildlife || e.wildlife.length === 0) && <Muted>—</Muted>}

      {section === 'includes' && e && (
        <>
          <BlockSection eyebrow={L_WEB} tone="default">
            <Text size={1} weight="semibold" style={subBlock}>
              Incluye
            </Text>
            <ul style={{margin: '0 0 16px', paddingLeft: 20}}>
              {(e.includes || []).map((x, i) => (
                <li key={i} style={{marginBottom: 8}}>
                  <Text size={1} style={preLine}>
                    {parseInlineBold(x)}
                  </Text>
                </li>
              ))}
            </ul>
            <Text size={1} weight="semibold" style={subBlock}>
              No incluye
            </Text>
            <ul style={{margin: 0, paddingLeft: 20}}>
              {(e.notIncludes || []).map((x, i) => (
                <li key={i} style={{marginBottom: 8}}>
                  <Text size={1} style={preLine}>
                    {parseInlineBold(x)}
                  </Text>
                </li>
              ))}
            </ul>
          </BlockSection>
          {(() => {
            const h = getActualWebHeadlines('includes', moduleRow || {})
            const lead =
              moduleRow?.sectionText?.trim() ||
              'Las listas se muestran desde incluye y no incluye de Experiencia.'
            return (
              <BlockSection eyebrow="2. Vista previa" tone="primary">
                <FieldLabel title="Eyebrow final:">{h.eyebrow}</FieldLabel>
                <FieldLabel title="Título final:">{h.title}</FieldLabel>
                <FieldLabel title="Texto final:">{lead}</FieldLabel>
                <Text size={1} muted style={preLine}>
                  Incluye: {(e.includes || []).length} · No incluye: {(e.notIncludes || []).length}.
                </Text>
              </BlockSection>
            )
          })()}
        </>
      )}

      {section === 'tech' && (
        <>
          <BlockSection eyebrow={L_WEB} tone="default">
            {rdata?.length > 0 ? (
              rdata.map((t) => (
                <Card key={t._id} padding={3} border radius={1} style={subBlock}>
                  <Text size={1} weight="semibold" style={subBlock}>
                    {t.number} · {t.name} {t.stableId ? `· ${t.stableId}` : ''}
                  </Text>
                  {t.description && <EditorialExcerpt text={t.description} maxLength={220} />}
                </Card>
              ))
            ) : e?.incTech?.length > 0 ? (
              <Stack space={2}>
                <Text size={1} tone="caution" weight="semibold" style={preLine}>
                  Sin productos referenciados en esta landing. Referencia (Experiencia → incluidos):
                </Text>
                {e.incTech.map((t) => (
                  <Card key={t._id} padding={3} border radius={1}>
                    <Text size={1} weight="semibold">
                      {t.number} · {t.name} {t.stableId ? `· ${t.stableId}` : ''}
                    </Text>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Muted>
                Añade referencias a producto tech, o rellena «incluidos en el pack» en la Experiencia.
              </Muted>
            )}
          </BlockSection>
          {(() => {
            const h = getActualWebHeadlines('tech', moduleRow || {})
            const intro = moduleRow?.sectionText?.trim() || TECH_PREVIEW_FALLBACK_TEXT
            const previewCards = rdata?.length > 0 ? rdata : e?.incTech?.length > 0 ? e.incTech : []
            return (
              <BlockSection eyebrow="2. Vista previa" tone="primary">
                <Stack space={3}>
                  <FieldLabel title="Eyebrow final:">{h.eyebrow}</FieldLabel>
                  <FieldLabel title="Título final:">{h.title}</FieldLabel>
                  <FieldLabel title="Texto final:">{intro}</FieldLabel>
                  <Text size={1} muted style={preLine}>
                    <strong>Tarjetas visibles:</strong>{' '}
                    {previewCards.length
                      ? previewCards
                          .map((t) => [t?.number, t?.name].filter(Boolean).join(' · '))
                          .filter(Boolean)
                          .join(' | ')
                      : 'sin tarjetas (faltan selección y productos incluidos en Experiencia).'}
                  </Text>
                </Stack>
              </BlockSection>
            )
          })()}
        </>
      )}

      {section === 'gallery' && e && (
        <>
          <BlockSection eyebrow={L_WEB} tone="default">
            <FieldLabel title="Vídeo URL:">{e.videoUrl || '—'}</FieldLabel>
            <FieldLabel title="Título vídeo:">{e.videoTitle || '—'}</FieldLabel>
            {e.gallery?.length > 0 ? (
              <ul style={{margin: 0, paddingLeft: 20}}>
                {e.gallery.map((g, i) => (
                  <li key={i} style={{marginBottom: 8}}>
                    <Text size={1} style={preLine}>
                      {g.caption ? parseInlineBold(g.caption) : 'Imagen'}
                      {g.url ? ' · (asset en Experiencia)' : ''}
                    </Text>
                  </li>
                ))}
              </ul>
            ) : (
              <Muted>Sin imágenes en la galería de la Experiencia.</Muted>
            )}
          </BlockSection>
          {(() => {
            const h = getActualWebHeadlines(moduleKey, moduleRow || {})
            const n = (e.gallery || []).filter((g) => g?.url).length
            const hasVideo = Boolean(e.videoUrl && String(e.videoUrl).trim())
            const lead =
              moduleRow?.sectionText?.trim() ||
              (hasVideo || n > 0
                ? `Vídeo: ${hasVideo ? 'sí' : 'no'} · ${n} imagen(es) con asset en galería.`
                : 'Sin vídeo ni galería en la fuente.')
            const previewImgs = (e.gallery || []).filter((g) => g?.url).slice(0, 4)
            return (
              <BlockSection eyebrow="2. Vista previa" tone="primary">
                <Stack space={3}>
                  <FieldLabel title="Eyebrow final:">{h.eyebrow}</FieldLabel>
                  <FieldLabel title="Título final:">{h.title}</FieldLabel>
                  <FieldLabel title="Texto final:">{lead}</FieldLabel>
                  {hasVideo ? (
                    <Text size={1} muted style={preLine}>
                      <strong>Vídeo:</strong> {e.videoTitle || 'sin título'} · {e.videoUrl}
                    </Text>
                  ) : null}
                  <Text size={1} muted style={preLine}>
                    <strong>Galería visible (resumen):</strong>{' '}
                    {previewImgs.length
                      ? previewImgs.map((g, i) => (g.caption ? String(g.caption).slice(0, 40) : `Imagen ${i + 1}`)).join(' · ')
                      : '—'}
                    {n > previewImgs.length ? ` (+${n - previewImgs.length} más)` : ''}
                  </Text>
                </Stack>
              </BlockSection>
            )
          })()}
        </>
      )}

      {section === 'when' && e && (
        <>
          <BlockSection eyebrow={L_WEB} tone="default">
            {e.bestTimeByMonth?.length ? (
              <ul style={{margin: 0, paddingLeft: 20}}>
                {e.bestTimeByMonth.map((m, i) => (
                  <li key={i} style={{marginBottom: 8}}>
                    <Text size={1} style={preLine}>
                      {m.month}: {parseInlineBold(m.highlight)} ({m.level})
                    </Text>
                  </li>
                ))}
              </ul>
            ) : (
              <Muted>Sin calendario mensual en la Experiencia.</Muted>
            )}
          </BlockSection>
          {(() => {
            const h = getActualWebHeadlines(moduleKey, moduleRow || {})
            const n = e.bestTimeByMonth?.length || 0
            const lead =
              moduleRow?.sectionText?.trim() ||
              (n ? `Mes a mes: ${n} entradas en la fuente.` : 'Sin datos estacionales en la fuente.')
            return (
              <BlockSection eyebrow="2. Vista previa" tone="primary">
                <Stack space={3}>
                  <FieldLabel title="Eyebrow final:">{h.eyebrow}</FieldLabel>
                  <FieldLabel title="Título final:">{h.title}</FieldLabel>
                  <FieldLabel title="Texto final:">{lead}</FieldLabel>
                  <Text size={1} muted style={preLine}>
                    <strong>Resumen:</strong> {n ? `${n} mes(es) con highlight y nivel.` : '—'}
                  </Text>
                </Stack>
              </BlockSection>
            )
          })()}
        </>
      )}

      {section === 'beforeYou' && e && (
        <>
          <BlockSection eyebrow={L_WEB} tone="default">
            <H>Requisitos</H>
            {(e.entryRequirements || []).length ? (
              <Stack space={3} style={subBlock}>
                {(e.entryRequirements || []).map((b, i) => (
                  <div key={i}>
                    <Text size={1} weight="semibold" style={subBlock}>
                      {b.title}
                    </Text>
                    <BodyMultiline text={b.description} />
                  </div>
                ))}
              </Stack>
            ) : (
              <Muted>Sin bloques de requisitos.</Muted>
            )}
            <H>Equipaje</H>
            {(e.packingList || []).length ? (
              <ul style={{margin: '0 0 16px', paddingLeft: 20}}>
                {(e.packingList || []).map((p, i) => (
                  <li key={i} style={{marginBottom: 8}}>
                    <Text size={1} style={preLine}>
                      {parseInlineBold(p)}
                    </Text>
                  </li>
                ))}
              </ul>
            ) : (
              <Muted>Sin lista de equipaje.</Muted>
            )}
            <H>Cómo llegar</H>
            {(e.gettingHereInfo || []).length ? (
              <Stack space={3}>
                {(e.gettingHereInfo || []).map((b, i) => (
                  <div key={i}>
                    <Text size={1} weight="semibold" style={subBlock}>
                      {b.title}
                    </Text>
                    <BodyMultiline text={b.description} />
                  </div>
                ))}
              </Stack>
            ) : (
              <Muted>Sin bloques «cómo llegar».</Muted>
            )}
          </BlockSection>
          {(() => {
            const h = getActualWebHeadlines(moduleKey, moduleRow || {})
            const nReq = (e.entryRequirements || []).length
            const nPack = (e.packingList || []).length
            const nHere = (e.gettingHereInfo || []).length
            const lead =
              moduleRow?.sectionText?.trim() ||
              `Antes de viajar: ${nReq} requisito(s) · ${nPack} ítem(s) de equipaje · ${nHere} bloque(s) de llegada.`
            return (
              <BlockSection eyebrow="2. Vista previa" tone="primary">
                <Stack space={3}>
                  <FieldLabel title="Eyebrow final:">{h.eyebrow}</FieldLabel>
                  <FieldLabel title="Título final:">{h.title}</FieldLabel>
                  <FieldLabel title="Texto final:">{lead}</FieldLabel>
                  <Text size={1} muted style={preLine}>
                    <strong>Resumen:</strong> guía del viajero desde Experiencia (requisitos, packing, logística).
                  </Text>
                </Stack>
              </BlockSection>
            )
          })()}
        </>
      )}

      {section === 'terms' && e && (
        <>
          <BlockSection eyebrow={L_WEB} tone="default">
            <H>Cancelación</H>
            <EditorialExcerpt text={e.cancellationPolicy} maxLength={500} />
            <H>Términos (extracto)</H>
            <EditorialExcerpt text={e.termsAndConditions} maxLength={500} />
            {e.importantNotes?.length > 0 ? (
              <>
                <H>Notas</H>
                <ul style={{margin: 0, paddingLeft: 20}}>
                  {e.importantNotes.map((n, i) => (
                    <li key={i} style={{marginBottom: 8}}>
                      <Text size={1} style={preLine}>
                        {parseInlineBold(n)}
                      </Text>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <Muted>Sin notas adicionales.</Muted>
            )}
          </BlockSection>
          {(() => {
            const h = getActualWebHeadlines(moduleKey, moduleRow || {})
            const hasC = Boolean(e.cancellationPolicy && String(e.cancellationPolicy).trim())
            const hasT = Boolean(e.termsAndConditions && String(e.termsAndConditions).trim())
            const nN = (e.importantNotes || []).length
            const lead =
              moduleRow?.sectionText?.trim() ||
              `Política de cancelación: ${hasC ? 'con texto' : 'sin texto'} · Términos: ${hasT ? 'con texto' : 'sin texto'} · Notas: ${nN}.`
            return (
              <BlockSection eyebrow="2. Vista previa" tone="primary">
                <Stack space={3}>
                  <FieldLabel title="Eyebrow final:">{h.eyebrow}</FieldLabel>
                  <FieldLabel title="Título final:">{h.title}</FieldLabel>
                  <FieldLabel title="Texto final:">{lead}</FieldLabel>
                  <Text size={1} muted style={preLine}>
                    <strong>Contenido legal visible:</strong> tres bloques (cancelación, términos, notas) desde
                    Experiencia; el sitio puede mostrarlos en acordeón.
                  </Text>
                </Stack>
              </BlockSection>
            )
          })()}
        </>
      )}

      {section === 'resources' && e
        ? (() => {
            const resCards = sortStudioResourceCards(e.resources)
            const h = getActualWebHeadlines(moduleKey, moduleRow || {})
            const lead = moduleRow?.sectionText?.trim() || 'Descargas y recursos de esta experiencia.'
            return (
              <>
                <BlockSection eyebrow={L_WEB} tone="default">
                  {resCards.length > 0 ? (
                    <Stack space={3}>
                      {resCards.map((r, i) => (
                        <Card key={r._key || `res-${i}`} padding={3} border radius={2}>
                          <Text size={1} weight="semibold" style={{marginBottom: 8}}>
                            {r.title || '—'}{' '}
                            <span style={{opacity: 0.75}}>
                              · orden {r.order ?? '—'} · visible: {r.visible !== false ? 'sí' : 'no'}
                            </span>
                          </Text>
                          <Text size={1} muted style={{...preLine, marginBottom: 6}}>
                            <strong>Subtítulo:</strong> {r.subtitle?.trim() || '—'}
                          </Text>
                          <Text size={1} muted style={{...preLine, marginBottom: 6}}>
                            <strong>Tipo:</strong> {r.resourceType || '—'} · <strong>Visual:</strong>{' '}
                            {r.visualPreset || 'auto'}
                          </Text>
                          <Text size={1} muted style={{...preLine, marginBottom: 6}}>
                            <strong>CTA:</strong> {r.ctaLabel?.trim() || '—'}
                          </Text>
                          <Text size={1} muted style={preLine}>
                            <strong>Archivo:</strong> {studioResourceFileLine(r)}
                          </Text>
                          {r.previewImage?.imageUrl ? (
                            <Text size={1} muted style={{...preLine, marginTop: 6}}>
                              <strong>Imagen de vista previa:</strong> asset ·{' '}
                              {(r.previewImage.alt && String(r.previewImage.alt).trim()) || 'sin alt'}
                            </Text>
                          ) : null}
                        </Card>
                      ))}
                      <Text size={1} muted style={{...preLine, marginTop: 4}}>
                        Fuente: <strong>Experiencia → resources[]</strong> (solo tarjetas visibles y ordenadas).
                        Los PDF sueltos del documento no sustituyen a estas tarjetas mientras haya al menos una
                        visible en la web.
                      </Text>
                    </Stack>
                  ) : (
                    <Stack space={2}>
                      <Text size={1} muted style={preLine}>
                        Sin tarjetas en <strong>Experiencia → resources[]</strong>. La web puede usar solo como
                        respaldo los PDF de mapa/brochure si están rellenados:
                      </Text>
                      <FieldLabel title="Mapa (respaldo):">
                        {e.mapPdfLabel || '—'} — {e.mapPdfUrl || '—'}
                      </FieldLabel>
                      <FieldLabel title="Brochure (respaldo):">
                        {e.brochurePdfLabel || '—'} — {e.brochurePdfUrl || '—'}
                      </FieldLabel>
                    </Stack>
                  )}
                </BlockSection>
                <BlockSection eyebrow="2. Vista previa" tone="primary">
                  <FieldLabel title="Eyebrow final:">{h.eyebrow}</FieldLabel>
                  <FieldLabel title="Título final:">{h.title}</FieldLabel>
                  <FieldLabel title="Texto final:">{lead}</FieldLabel>
                  <Text size={1} muted style={preLine}>
                    <strong>Tarjetas visibles (resources[]):</strong> {resCards.length}.{' '}
                    {resCards.length === 0
                      ? 'Sin tarjetas: en la publicación puede mostrarse la vista alternativa con PDFs si existen.'
                      : 'Orden y visibilidad según cada fila en la Experiencia.'}
                  </Text>
                </BlockSection>
              </>
            )
          })()
        : null}

      {section === 'faq' && e && (
        <>
          <BlockSection eyebrow={L_WEB} tone="default">
            {e.faqs?.length ? (
              <ul style={{margin: 0, paddingLeft: 20}}>
                {e.faqs.map((f, i) => (
                  <li key={i} style={{marginBottom: 16}}>
                    <Text size={1} weight="semibold" style={subBlock}>
                      {f.question}
                    </Text>
                    {f.answer ? <BodyMultiline text={f.answer} /> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <Muted>Sin FAQs en la Experiencia.</Muted>
            )}
          </BlockSection>
          {(() => {
            const h = getActualWebHeadlines(moduleKey, moduleRow || {})
            const items = e.faqs || []
            const n = items.length
            const lead =
              moduleRow?.sectionText?.trim() ||
              (n ? `${n} pregunta(s) frecuentes en la fuente.` : 'Sin preguntas en la fuente.')
            const titles = items.slice(0, 6).map((f) => f.question || '—')
            return (
              <BlockSection eyebrow="2. Vista previa" tone="primary">
                <Stack space={3}>
                  <FieldLabel title="Eyebrow final:">{h.eyebrow}</FieldLabel>
                  <FieldLabel title="Título final:">{h.title}</FieldLabel>
                  <FieldLabel title="Texto final:">{lead}</FieldLabel>
                  <Text size={1} muted style={preLine}>
                    <strong>Lista resumida:</strong>{' '}
                    {n ? titles.join(' · ') + (n > titles.length ? ` (+${n - titles.length} más)` : '') : '—'}
                  </Text>
                </Stack>
              </BlockSection>
            )
          })()}
        </>
      )}

      {section === 'reviews' && (
        <>
          <BlockSection eyebrow={L_WEB} tone="default">
            {rdata?.length > 0 ? (
              rdata.map((r) => (
                <Card key={r._id} padding={3} border radius={1} style={subBlock}>
                  <Text size={1} style={subBlock}>
                    {r.rating}★ — {r.authorName} {r.authorCity ? `· ${r.authorCity}` : ''}
                  </Text>
                  {r.quote && <EditorialExcerpt text={r.quote} maxLength={200} />}
                </Card>
              ))
            ) : (
              <Muted>Selecciona reseñas (referencias) en esta landing para previsualizar el texto canónico.</Muted>
            )}
          </BlockSection>
          {(() => {
            const h = getActualWebHeadlines('reviews', moduleRow || {})
            const lead = moduleRow?.sectionText?.trim() || 'Reseñas reales seleccionadas para esta landing.'
            return (
              <BlockSection eyebrow="2. Vista previa" tone="primary">
                <FieldLabel title="Eyebrow final:">{h.eyebrow}</FieldLabel>
                <FieldLabel title="Título final:">{h.title}</FieldLabel>
                <FieldLabel title="Texto final:">{lead}</FieldLabel>
                <Text size={1} muted style={preLine}>
                  Reseñas visibles: {rdata?.length || 0} (sin selección no hay tarjetas).
                </Text>
              </BlockSection>
            )
          })()}
        </>
      )}

      {section === 'related' && (
        <>
          <BlockSection eyebrow={L_WEB} tone="default">
            {rdata?.length > 0 ? (
              <Stack space={2}>
                {rdata.map((x) => (
                  <Text key={x._id} size={1} style={preLine}>
                    <strong>{x.name || '—'}</strong> · {x.duration || '—'}
                  </Text>
                ))}
              </Stack>
            ) : e?.relFromExp?.length > 0 ? (
              <Stack space={2}>
                <Text size={1} muted style={preLine}>
                  Sin selección en esta landing. Se usa la lista base de Experiencia:
                </Text>
                {e.relFromExp.map((x) => (
                  <Text key={x._id} size={1} style={preLine}>
                    <strong>{x.name || '—'}</strong> · {x.duration || '—'}
                  </Text>
                ))}
              </Stack>
            ) : (
              <Muted>Sin experiencias relacionadas en selección ni en la lista base de Experiencia.</Muted>
            )}
          </BlockSection>
          {(() => {
            const h = getActualWebHeadlines(moduleKey, moduleRow || {})
            const lead = moduleRow?.sectionText?.trim() || 'Experiencias relacionadas según selección o lista base.'
            const rows = rdata?.length > 0 ? rdata : e?.relFromExp || []
            return (
              <BlockSection eyebrow="2. Vista previa" tone="primary">
                <FieldLabel title="Eyebrow final:">{h.eyebrow}</FieldLabel>
                <FieldLabel title="Título final:">{h.title}</FieldLabel>
                <FieldLabel title="Texto final:">{lead}</FieldLabel>
                <Text size={1} muted style={preLine}>
                  Tarjetas visibles: {rows.length}. La selección tiene prioridad; si está vacía, usa la lista base de Experiencia.
                </Text>
              </BlockSection>
            )
          })()}
        </>
      )}

    </Stack>
  )
}
