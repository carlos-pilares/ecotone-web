'use client'

import { useEffect, useMemo, useState } from 'react'
import { useClient, useFormValue } from 'sanity'
import { Card, Stack, Text } from '@sanity/ui'
import { soqtapataExperience } from '../../../data/soqtapataExperienceLocal'
import { alsoBookFromStructuredRow, buildSoqtapataStudioPreviewRow } from '../../../lib/soqtapataStructuredCms'
import { apiVersion } from '../../env'
import { experienceDocsByIds } from '../../lib/experiencePageStudioQuery'

const preLine = { whiteSpace: 'pre-line', lineHeight: 1.6, marginBottom: 0 }
const subBlock = { marginBottom: 8 }
const labelStyle = { fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.45, marginBottom: 8, opacity: 0.8 }

function orderDocsByRefList(docs, orderedRefIds) {
  if (!docs?.length || !orderedRefIds?.length) return docs || []
  const m = new Map(docs.map((d) => [d._id, d]))
  return orderedRefIds.map((id) => m.get(id)).filter(Boolean)
}

function ReadoutBlock({ eyebrow, children, tone }) {
  return (
    <div style={{ marginBottom: 20 }}>
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

/**
 * Misma resolución que el front (alsoBookFromStructuredRow) para Soqtapata: muestra
 * el texto resuelto aunque los overrides de la landing estén vacíos.
 */
export function StudioSoqtapataActualReadout(props) {
  const part = props?.schemaType?.options?.part || 'related'
  const client = useClient({ apiVersion })
  const relRefs = useFormValue(['relatedExperienceRefs']) || []
  const reserveBlock = useFormValue(['reserveBlock'])
  const relatedSectionEyebrow = useFormValue(['relatedSectionEyebrow'])
  const relatedSectionTitle = useFormValue(['relatedSectionTitle'])

  const relIds = useMemo(() => relRefs.map((r) => r?._ref).filter(Boolean), [relRefs])
  const [relDocs, setRelDocs] = useState(null)
  const relKey = relIds.join(',')

  useEffect(() => {
    if (relIds.length === 0) {
      setRelDocs([])
      return
    }
    setRelDocs(null)
    let cancelled = false
    ;(async () => {
      try {
        const result = await client.fetch(experienceDocsByIds, { ids: relIds })
        if (!cancelled) setRelDocs(orderDocsByRefList(result, relIds))
      } catch {
        if (!cancelled) setRelDocs([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [client, relKey, relIds])

  const { also, book, relatedLoading } = useMemo(() => {
    const relLoading = relIds.length > 0 && relDocs === null
    const landingRel = relIds.length === 0 ? [] : (relDocs ?? [])

    const row = buildSoqtapataStudioPreviewRow({
      relatedSectionEyebrow,
      relatedSectionTitle,
      relatedRefIds: relIds,
      relatedExperiencesFromLanding: landingRel,
      reserveBlock,
    })
    const out = alsoBookFromStructuredRow(row, soqtapataExperience)
    return { also: out.also, book: out.book, relatedLoading: relLoading }
  }, [relIds, relDocs, relatedSectionEyebrow, relatedSectionTitle, reserveBlock])

  if (part === 'related') {
    return (
      <Stack space={3}>
        <ReadoutBlock eyebrow="Actual en la web" tone="default">
          {relatedLoading ? (
            <Text size={1} muted>
              Cargando experiencias referenciadas…
            </Text>
          ) : (
            <Stack space={3}>
              <Text size={1} style={preLine}>
                <strong>Eyebrow:</strong> {also.eyebrow}
              </Text>
              <Text size={1} style={preLine}>
                <strong>Título:</strong> {also.h2}
              </Text>
              <Text size={0} weight="semibold" muted>
                Cards (como se publican ahora)
              </Text>
              {also.cards.map((card, i) => {
                if (card.kind === 'image') {
                  return (
                    <Card key={i} padding={2} border radius={1} style={subBlock}>
                      <Text size={1} weight="semibold" style={subBlock}>
                        {card.name}
                      </Text>
                      <Text size={0} muted style={preLine}>
                        {card.typeLabel} · {card.meta} · {card.price} · {card.footRight}
                      </Text>
                    </Card>
                  )
                }
                return (
                  <Card key={i} padding={2} border radius={1} style={subBlock}>
                    <Text size={1} weight="semibold" style={subBlock}>
                      {card.name} (Tailor Made)
                    </Text>
                    <Text size={0} muted style={preLine}>
                      {card.meta} · {card.footLeft} · {card.footRight}
                    </Text>
                  </Card>
                )
              })}
            </Stack>
          )}
        </ReadoutBlock>
        {relIds.length === 0 ? (
          <Text size={1} muted style={preLine}>
            <strong>Referencias vacías</strong> = el sitio usa el fallback de esta ruta (cards locales de referencia; mismo
            resultado que arriba si no hay overrides).
          </Text>
        ) : (
          <Text size={1} muted style={preLine}>
            <strong>Overrides</strong> (campos a continuación): vacío = se mantiene el valor resuelto arriba, campo a campo.
          </Text>
        )}
      </Stack>
    )
  }

  if (part === 'reserve') {
    return (
      <Stack space={3}>
        <ReadoutBlock eyebrow="Actual en la web" tone="default">
          <Text size={1} style={preLine}>
            <strong>Eyebrow:</strong> {book.eyebrow}
          </Text>
          <Text size={1} style={preLine}>
            <strong>Headline:</strong> {book.h2}
          </Text>
          <Text size={1} style={preLine}>
            <strong>Precio / nota de precio:</strong> {book.price}
            <small> {book.priceSmall}</small>
          </Text>
          <Text size={1} style={preLine} muted>
            {book.sub}
          </Text>
          <Text size={0} weight="semibold" muted>
            Filas informativas
          </Text>
          {book.rows.map((r, i) => (
            <Text key={i} size={1} style={preLine}>
              {r.label} → {r.value}
            </Text>
          ))}
          <Text size={0} weight="semibold" muted>
            CTA
          </Text>
          <Text size={1} style={preLine}>
            {book.wetravelLabel} → {book.wetravelUrl}
          </Text>
          <Text size={1} style={preLine}>
            {book.whatsappLabel} → {book.whatsappUrl}
          </Text>
          <Text size={0} weight="semibold" muted>
            Legal
          </Text>
          <Text size={1} style={preLine}>
            {book.termsNote}
            {book.termsHash ? <em> {book.termsHash}</em> : null}
          </Text>
        </ReadoutBlock>
        <Text size={1} muted style={preLine}>
          <strong>Override de esta landing</strong> (bloque debajo): vacío = usa el valor mostrado arriba, campo a campo.
        </Text>
      </Stack>
    )
  }

  return null
}
