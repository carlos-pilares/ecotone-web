import {defineField, defineType} from 'sanity'
import {PageModuleInput} from '../../components/pageModule/PageModuleInput'
import {MODULE_LIST, getListSubtitleLine} from '../../lib/pageModuleShared'

const DROPDOWN = MODULE_LIST.map((m) => ({title: `${m.title}`, value: m.value}))

export const pageModule = defineType({
  name: 'pageModule',
  title: 'Sección de la landing',
  type: 'object',
  components: {input: PageModuleInput},
  description:
    'Solo afecta a esta URL: visibilidad, ancla, y reemplazos de eyebrow/título. El texto largo de cada sección se edita en la librería (Experiencia, Lodge, reseñas, etc.), no aquí.',
  fields: [
    defineField({
      name: 'key',
      title: 'Bloque',
      type: 'string',
      options: {list: DROPDOWN, layout: 'dropdown'},
      validation: (Rule) => Rule.required(),
      description:
        'Cada bloque toma su contenido principal de la fuente de verdad indicada en el subtítulo (preview al guardar).',
    }),
    defineField({
      name: 'visible',
      title: 'Visible en la página',
      type: 'boolean',
      initialValue: true,
      description: 'Desactiva para ocultar el módulo sin borrarlo.',
    }),
    defineField({
      name: 'anchorId',
      title: 'ID HTML (ancla)',
      type: 'string',
      validation: (Rule) => Rule.max(64),
      hidden: true,
      description: 'Reservado para el front / migraciones; no se muestra en el editor.',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Override (opcional) — Eyebrow',
      type: 'string',
      validation: (Rule) => Rule.max(80),
      description: 'Solo rellenar para sustituir en esta landing. Vacío: el rótulo lo define el sitio (front).',
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Override (opcional) — Título de sección (H2)',
      type: 'string',
      validation: (Rule) => Rule.max(120),
      description: 'Solo rellenar para sustituir en esta landing. Vacío: el H2 lo define el sitio (front).',
    }),
    defineField({
      name: 'sectionText',
      title: 'Override (opcional) — Intro / lead corto',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(480),
      description:
        'Texto corto bajo el H2 (intro editorial). No sustituye listados, FAQs ni descripciones largas del Experience.',
    }),
  ],
  preview: {
    select: {
      key: 'key',
      visible: 'visible',
      sectionTitle: 'sectionTitle',
      eyebrow: 'eyebrow',
      sectionText: 'sectionText',
    },
    prepare: ({key, visible, sectionTitle, eyebrow, sectionText}) => {
      const m = MODULE_LIST.find((k) => k.value === key)
      const label = m?.title || key || 'Sección'
      const src = getListSubtitleLine(key)
      const sub = [
        visible === false ? 'Oculta' : 'Visible',
        src,
        eyebrow,
        sectionTitle,
        sectionText && String(sectionText).trim().slice(0, 40),
      ]
        .filter(Boolean)
        .join(' · ')
      return {title: label, subtitle: sub}
    },
  },
})
