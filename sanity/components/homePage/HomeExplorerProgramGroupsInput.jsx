'use client'

import {useCallback, useMemo} from 'react'
import {Box, Button, Card, Checkbox, Flex, Stack, Text, TextInput} from '@sanity/ui'
import {PatchEvent, set} from 'sanity'

const PROGRAM_OPTIONS = [
  {programType: 'all', defaultLabel: 'All experiences'},
  {programType: 'nature-core', defaultLabel: 'Classic Nature'},
  {programType: 'family-adventure', defaultLabel: 'Signature Expeditions'},
  {programType: 'experiential-learning', defaultLabel: 'Experiential Learning'},
  {programType: 'tailor-made', defaultLabel: 'Tailor Made'},
]

function newKey() {
  return `hepg-${Math.random().toString(36).slice(2, 10)}`
}

function normalizeRow(raw) {
  if (!raw || typeof raw !== 'object') return null
  const programType = raw.programType?.trim()
  if (!programType) return null
  return {
    _type: 'homeExperienceProgramGroup',
    _key: raw._key || newKey(),
    programType,
    label: typeof raw.label === 'string' ? raw.label : '',
  }
}

function labelForRow(row) {
  const opt = PROGRAM_OPTIONS.find((o) => o.programType === row.programType)
  const custom = row.label?.trim()
  return custom || opt?.defaultLabel || row.programType
}

/**
 * Ordered multi-select for Home → Experiences program filter tabs.
 * Stores `homeExperienceProgramGroup` objects (programType + optional tab label).
 */
export function HomeExplorerProgramGroupsInput(props) {
  const {value, onChange} = props

  const selected = useMemo(() => {
    if (!Array.isArray(value)) return []
    return value.map(normalizeRow).filter(Boolean)
  }, [value])

  const selectedTypes = useMemo(() => new Set(selected.map((r) => r.programType)), [selected])

  const emit = useCallback(
    (next) => {
      onChange(PatchEvent.from(set(next.length ? next : undefined)))
    },
    [onChange],
  )

  const toggle = useCallback(
    (programType) => {
      const has = selectedTypes.has(programType)
      if (has) {
        emit(selected.filter((r) => r.programType !== programType))
        return
      }
      emit([
        ...selected,
        {
          _type: 'homeExperienceProgramGroup',
          _key: newKey(),
          programType,
          label: '',
        },
      ])
    },
    [emit, selected, selectedTypes],
  )

  const move = useCallback(
    (from, to) => {
      if (to < 0 || to >= selected.length) return
      const next = [...selected]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      emit(next)
    },
    [emit, selected],
  )

  const setLabel = useCallback(
    (programType, label) => {
      emit(
        selected.map((r) =>
          r.programType === programType ? {...r, label} : r,
        ),
      )
    },
    [emit, selected],
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
      if (!Number.isFinite(from) || from === dropIndex) return
      move(from, dropIndex)
    },
    [move],
  )

  return (
    <Stack space={4}>
      <Card padding={3} radius={2} border tone="transparent">
        <Text size={1} weight="semibold" style={{marginBottom: 10}}>
          Selected order (drag or use arrows)
        </Text>
        {selected.length === 0 ? (
          <Text size={1} muted>
            None selected — no filter tabs will appear on the home page.
          </Text>
        ) : (
          <Stack space={2}>
            {selected.map((row, i) => (
              <Card
                key={row._key}
                padding={2}
                radius={1}
                border
                draggable
                onDragStart={(ev) => onDragStart(ev, i)}
                onDragOver={onDragOver}
                onDrop={(ev) => onDrop(ev, i)}
              >
                <Stack space={3}>
                  <Flex align="center" gap={2}>
                    <Text size={1} style={{flex: 1}}>
                      {labelForRow(row)}
                      <Text size={0} muted style={{display: 'block', marginTop: 2}}>
                        {row.programType}
                      </Text>
                    </Text>
                    <Button text="↑" disabled={i === 0} onClick={() => move(i, i - 1)} padding={2} />
                    <Button
                      text="↓"
                      disabled={i >= selected.length - 1}
                      onClick={() => move(i, i + 1)}
                      padding={2}
                    />
                    <Button text="Remove" tone="critical" onClick={() => toggle(row.programType)} padding={2} />
                  </Flex>
                  <Box>
                    <Text size={0} muted style={{marginBottom: 4}}>
                      Tab label (optional)
                    </Text>
                    <TextInput
                      value={row.label ?? ''}
                      placeholder={PROGRAM_OPTIONS.find((o) => o.programType === row.programType)?.defaultLabel}
                      onChange={(e) => setLabel(row.programType, e.currentTarget.value)}
                    />
                  </Box>
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </Card>

      <Card padding={3} radius={2} border tone="transparent">
        <Text size={1} weight="semibold" style={{marginBottom: 10}}>
          Add program types
        </Text>
        <Stack space={2}>
          {PROGRAM_OPTIONS.map((o) => (
            <Flex key={o.programType} align="center" gap={2}>
              <Checkbox
                checked={selectedTypes.has(o.programType)}
                onChange={() => toggle(o.programType)}
              />
              <Box flex={1}>
                <Text size={1}>{o.defaultLabel}</Text>
                <Text size={0} muted>
                  {o.programType === 'all'
                    ? 'Shows all published experience cards'
                    : o.programType === 'tailor-made'
                      ? 'Shows Tailor Made filter tab; band uses Tailor Made settings below'
                      : 'Filters cards by program type'}
                </Text>
              </Box>
            </Flex>
          ))}
        </Stack>
      </Card>
    </Stack>
  )
}
