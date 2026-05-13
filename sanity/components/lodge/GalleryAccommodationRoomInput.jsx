'use client'

import {Card, Select, Stack, Text} from '@sanity/ui'
import {set, unset, useFormValue} from 'sanity'

/**
 * Links a gallery row to an accommodation type using the room row's `_key`
 * (no stable-key typing). Legacy `roomStableId` is still read by the site resolver when this field is empty.
 */
export function GalleryAccommodationRoomInput(props) {
  const {value, onChange, id, readOnly, path} = props
  const roomsValue = useFormValue(['rooms'])
  const rooms = Array.isArray(roomsValue) ? roomsValue : []

  const parentPath = Array.isArray(path) ? path.slice(0, -1) : []
  const legacyStableIdRaw = useFormValue([...parentPath, 'roomStableId'])
  const legacyStableId =
    typeof legacyStableIdRaw === 'string' ? legacyStableIdRaw.trim() : String(legacyStableIdRaw ?? '').trim()

  const options = rooms
    .map((room) => {
      const rowKey = typeof room?._key === 'string' ? room._key : ''
      if (!rowKey) return null
      const roomName = typeof room?.name === 'string' ? room.name.trim() : ''
      return {
        value: rowKey,
        label: roomName || rowKey,
      }
    })
    .filter(Boolean)

  const current = typeof value === 'string' ? value.trim() : ''
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
        <option value="">Select accommodation type</option>
        {!includesCurrent && current ? (
          <option value={current}>{`Linked row (${current})`}</option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>

      {legacyStableId && !current ? (
        <Card padding={2} radius={2} tone="transparent" border>
          <Text size={1} muted>
            Legacy link saved on this photo (room ID: {legacyStableId}). The site still uses it until you pick an
            accommodation type above.
          </Text>
        </Card>
      ) : null}

      {options.length === 0 ? (
        <Card padding={2} radius={2} tone="caution">
          <Text size={1}>Add accommodation types first (Accommodation types tab), then assign photos here.</Text>
        </Card>
      ) : null}
    </Stack>
  )
}
