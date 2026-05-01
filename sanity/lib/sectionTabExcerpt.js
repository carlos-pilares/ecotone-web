/**
 * Un solo renglón de resumen del copy canónico por pestaña (solo Studio; no afecta al front).
 */

function pick(str, n = 180) {
  if (str == null || typeof str !== 'string' || str.trim() === '') return '— (sin texto en el documento vinculado todavía)'
  const t = str.trim()
  return t.length > n ? `${t.slice(0, n)}…` : t
}

/**
 * @param {string} section - options.section del preview
 * @param {object} e - documento experiencia (fetch Studio)
 * @param {Array|object|null} rdata - reviews / tech / related según sección
 */
export function buildSectionExcerpt(section, e, rdata) {
  if (!e && !rdata) return '—'

  switch (section) {
    case 'overview': {
      const t = e?.shortDescription || e?.fullDescription
      return pick(t, 220)
    }
    case 'itinerary': {
      const days = e?.itinerary
      if (!days?.length) return 'Sin días de itinerario en el documento de experiencia aún.'
      const first = days[0]
      const n = days.length
      return `Itinerario: ${n} día(s). Eje: ${first?.title || 'Día 1'}. ${pick(first?.subtitle || first?.timeline?.[0]?.title, 100)}`
    }
    case 'lodge': {
      if (!e?.lodge) return 'Sin Lodge referenciado en la experiencia.'
      return pick(`${e.lodge.name}: ${e.lodge.shortDescription || ''}`.trim(), 220)
    }
    case 'wildlife': {
      const w = e?.wildlife
      if (!w?.length) return 'Sin entradas de wildlife en el documento.'
      return `Fauna: ${w.length} especie(s), p. ej. ${w[0]?.name} — ${pick(w[0]?.description, 100)}`
    }
    case 'includes': {
      const inc = e?.includes?.length ?? 0
      const ninc = e?.notIncludes?.length ?? 0
      return `Incluye ${inc} item(s) · no incluye ${ninc} item(s) (listas canónicas en la experiencia).`
    }
    case 'tech': {
      if (rdata?.length) {
        const names = rdata.map((t) => t.name || t.number).filter(Boolean).slice(0, 4).join(' · ')
        return `Productos (orden en esta landing): ${names || '—'}${rdata.length > 4 ? '…' : ''}`
      }
      if (e?.incTech?.length) {
        return `Referencia: experiencia (pack) — ${e.incTech.map((t) => t.name).slice(0, 3).join(' · ')}…`
      }
      return 'Añade referencias a producto tech o define incluidos en el pack (experiencia).'
    }
    case 'gallery': {
      const n = e?.gallery?.length ?? 0
      return `Galería: ${n} imagen(es) · Vídeo: ${e?.videoUrl ? e.videoTitle || 'sin título' : 'ninguno'}.`
    }
    case 'when': {
      const m = e?.bestTimeByMonth
      if (!m?.length) return 'Sin mes a mes en el documento de experiencia todavía.'
      return `Estacional: ${m.length} mes(es), p. ej. ${m[0]?.month}: ${pick(m[0]?.highlight, 120)}`
    }
    case 'beforeYou': {
      const a = (e?.entryRequirements?.length ?? 0) + (e?.packingList?.length ?? 0) + (e?.gettingHereInfo?.length ?? 0)
      return a ? `Bloques canónicos: requisitos / equipaje / cómo llegar — ${a} sección(es) con listas.`
        : 'Sin requisitos / packing / llegada rellenados aún en la experiencia.'
    }
    case 'terms': {
      return `Cancelación: ${pick(e?.cancellationPolicy, 100)} / Términos: ${pick(e?.termsAndConditions, 100)}`
    }
    case 'resources': {
      const rows = e?.resources
      if (Array.isArray(rows) && rows.length > 0) {
        const sorted = rows
          .map((r, i) => ({ r, i }))
          .filter(({ r }) => r?.visible !== false)
          .sort((a, b) => {
            const oa = a.r?.order ?? 10000
            const ob = b.r?.order ?? 10000
            if (oa !== ob) return oa - ob
            return a.i - b.i
          })
        const parts = sorted.map(({ r }) => {
          const t = (r.title && String(r.title).trim()) || '—'
          const ty = r.resourceType || '—'
          return `${t} (${ty})`
        })
        const s = parts.join(' · ')
        return s.length > 180 ? `${s.slice(0, 177)}…` : s
      }
      return `Mapa (legacy): ${e?.mapPdfLabel || '—'} · Brochure (legacy): ${e?.brochurePdfLabel || '—'}`
    }
    case 'faq': {
      const n = e?.faqs?.length ?? 0
      if (!n) return 'Sin FAQ en el documento de experiencia aún.'
      return `${n} pregunta(s) · 1.ª: ${e.faqs[0]?.question || '—'}`
    }
    case 'reviews': {
      if (!rdata?.length) return 'Elige reseñas (referencias) en esta landing para mostrar copy canónico.'
      const r = rdata[0]
      return `Reseñas: ${rdata.length} en lista — ${r.rating}★ ${pick(r.quote, 150)}`
    }
    case 'related': {
      if (rdata?.length) {
        return `Experiencias en esta URL: ${rdata.map((x) => x.name).slice(0, 3).join(' · ')}${rdata.length > 3 ? '…' : ''}`
      }
      if (e?.relFromExp?.length) {
        return `Experiencia (default): ${e.relFromExp.map((x) => x.name).slice(0, 2).join(' · ')}…`
      }
      return 'Elige otras experiencias (referencias) o usa las relacionadas del programa en la experiencia.'
    }
    default:
      return '—'
  }
}
