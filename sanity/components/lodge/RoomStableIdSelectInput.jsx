'use client'

import {Card, Select, Stack, Text} from '@sanity/ui'
import {set, unset, useFormValue} from 'sanity'

export function RoomStableIdSelectInput(props) {
  const {value, onChange, id, readOnly} = props
  const roomsValue = useFormValue(['rooms'])
  const rooms = Array.isArray(roomsValue) ? roomsValue : []

  const options = rooms
    .map((room) => {
      const stableId = typeof room?.stableId === 'string' ? room.stableId.trim() : ''
      if (!stableId) return null
      const roomName = typeof room?.name === 'string' ? room.name.trim() : ''
      return {
        value: stableId,
        label: roomName ? `${roomName} -> ${stableId}` : stableId,
      }
    })
    .filter(Boolean)

  const current = typeof value === 'string' ? value : ''
  const includesCurrent = current ? options.some((opt) => opt.value === current) : false

  return (
    <Stack space={3}>
      <Select
        id={id}
        value={current}
        disabled={readOnly}
        onChange={(event) => {
          const next = event.currentTarget.value
          onChange(next ? set(next) : unset())
        }}
      >
        <option value="">Select room</option>
        {!includesCurrent && current ? <option value={current}>{`Legacy value -> ${current}`}</option> : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>

      {options.length === 0 ? (
        <Card padding={2} radius={2} tone="caution">
          <Text size={1}>Add rooms with stable IDs first (Lodge {'->'} Accommodation {'->'} Rooms).</Text>
        </Card>
      ) : null}
    </Stack>
  )
}
