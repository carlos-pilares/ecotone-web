'use client'

import {useCallback, useMemo} from 'react'
import {Stack, Card, Text, TextInput, TextArea, Box} from '@sanity/ui'
import {PageSectionVisibilityInput} from '../pageSection/PageSectionVisibilityInput'
import {PatchEvent, set, useFormCallbacks, useFormValue} from 'sanity'
import {MODULE_LIST, getModuleKeyForPreviewSection} from '../../lib/pageModuleShared'

const MODULE_ORDER = MODULE_LIST.map((m) => m.value)

function sortSectionModulesByKeyOrder(modules) {
  const rank = (k) => {
    const i = MODULE_ORDER.indexOf(k)
    return i === -1 ? 999 : i
  }
  return [...(modules || [])].sort((a, b) => rank(a?.key) - rank(b?.key))
}

function newItemKey() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `pm_${Date.now().toString(36)}_${Math.random().toString(16).slice(2)}`
}

function cloneModules(modules) {
  return (modules || []).map((m) => ({...m}))
}

export function SectionModuleOverridesForm({previewSection, onRootPatch}) {
  const {onChange: documentOnChange} = useFormCallbacks()
  const moduleKey = getModuleKeyForPreviewSection(previewSection)
  const sectionModules = useFormValue(['sectionModules']) || []

  const emit = useCallback(
    (nextModules) => {
      const sorted = sortSectionModulesByKeyOrder(nextModules)
      const evt = PatchEvent.from(set(sorted, ['sectionModules']))
      if (typeof documentOnChange === 'function') {
        documentOnChange(evt)
        return
      }
      if (typeof onRootPatch === 'function') {
        onRootPatch(evt)
      }
    },
    [documentOnChange, onRootPatch],
  )

  const apply = useCallback(
    (updates) => {
      if (!moduleKey) return
      const next = cloneModules(sectionModules)
      const i = next.findIndex((m) => m?.key === moduleKey)
      if (i >= 0) {
        next[i] = {...next[i], ...updates}
      } else {
        next.push({
          _type: 'pageModule',
          _key: newItemKey(),
          key: moduleKey,
          visible: true,
          eyebrow: '',
          sectionTitle: '',
          sectionText: '',
          ...updates,
        })
      }
      emit(next)
    },
    [emit, moduleKey, sectionModules],
  )

  const row = useMemo(
    () => (moduleKey ? sectionModules.find((m) => m?.key === moduleKey) : null),
    [sectionModules, moduleKey],
  )

  if (!moduleKey) {
    return null
  }

  const visible = row ? row.visible !== false : true
  const eyebrow = row?.eyebrow ?? ''
  const sectionTitle = row?.sectionTitle ?? ''
  const sectionText = row?.sectionText ?? ''

  return (
    <Card padding={4} border radius={2} tone="transparent" style={{marginTop: 12}}>
      <Stack space={4}>
        <div>
          <Text size={0} weight="semibold" style={{textTransform: 'uppercase', letterSpacing: 0.4}}>
            Section on this URL
          </Text>
          <Text size={1} muted style={{marginTop: 6, lineHeight: 1.5}}>
            Empty fields inherit defaults from the linked Experience (or site layout). Changes are stored in sectionModules.
          </Text>
        </div>

        <Card padding={3} border radius={1} tone="default">
          <Stack space={3}>
            <PageSectionVisibilityInput value={visible} onChange={(v) => apply({visible: v})} />
            <Box>
              <Text size={1} weight="semibold" style={{marginBottom: 6}}>
                Eyebrow
              </Text>
              <TextInput
                value={eyebrow}
                onChange={(ev) => apply({eyebrow: ev.currentTarget.value})}
              />
            </Box>
            <Box>
              <Text size={1} weight="semibold" style={{marginBottom: 6}}>
                Título
              </Text>
              <TextInput
                value={sectionTitle}
                onChange={(ev) => apply({sectionTitle: ev.currentTarget.value})}
              />
            </Box>
            <Box>
              <Text size={1} weight="semibold" style={{marginBottom: 6}}>
                Texto
              </Text>
              <TextArea
                rows={3}
                value={sectionText}
                onChange={(ev) => apply({sectionText: ev.currentTarget.value})}
              />
            </Box>
          </Stack>
        </Card>
      </Stack>
    </Card>
  )
}
