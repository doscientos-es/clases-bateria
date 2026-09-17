import BoringAvatar from 'boring-avatars'
import type { CSSProperties } from 'react'

const avatarColors = ['#c96d57', '#708f91', '#c7a266', '#8c9f83', '#b75f4a']

export type AvatarPerson = {
  id: string
  name: string
}

export function PersonAvatar({ person, size = 36 }: { person: AvatarPerson; size?: number }) {
  return (
    <span
      className="person-avatar"
      style={{ '--avatar-size': `${size}px` } as CSSProperties}
      title={person.name}
      aria-hidden
    >
      <BoringAvatar
        name={`${person.id}-${person.name}`}
        variant="beam"
        colors={avatarColors}
        size={size}
        title
      />
    </span>
  )
}

export function PersonAvatarGroup({
  people,
  max = 4,
  size = 30,
}: {
  people: AvatarPerson[]
  max?: number
  size?: number
}) {
  if (people.length === 0) return null
  const visible = people.slice(0, max)
  const remaining = people.length - visible.length
  const names = people.map((person) => person.name).join(', ')
  return (
    <ul className="person-avatar-group" aria-label={`Alumnos con acceso: ${names}`}>
      {visible.map((person) => (
        <li className="person-avatar-group-item" key={person.id} title={person.name}>
          <PersonAvatar person={person} size={size} />
        </li>
      ))}
      {remaining > 0 ? (
        <li
          className="person-avatar-group-more"
          style={{ '--avatar-size': `${size}px` } as CSSProperties}
        >
          +{remaining}
        </li>
      ) : null}
    </ul>
  )
}
