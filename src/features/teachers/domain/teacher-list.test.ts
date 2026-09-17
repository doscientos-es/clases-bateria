import { describe, expect, it } from 'vitest'

import type { Teacher } from '@/features/demo-data'

import { filterAndSortTeachers } from './teacher-list'

const teachers: Teacher[] = [
  {
    id: 'teacher-marta',
    name: 'Marta Soler',
    email: 'marta@aulanorte.es',
    specialty: 'Ritmo',
    status: 'active',
    joinedOn: '2024-01-15',
  },
  {
    id: 'teacher-ana',
    name: 'Ana Vidal',
    email: 'ana@aulanorte.es',
    specialty: 'Lectura',
    status: 'archived',
    joinedOn: '2023-09-01',
  },
  {
    id: 'teacher-luis',
    name: 'Luis Ortega',
    email: 'luis@aulanorte.es',
    specialty: 'Ritmo',
    status: 'active',
    joinedOn: '2024-03-20',
  },
]

const filters = { search: '', specialty: 'all', status: 'all' as const, sort: 'name-asc' as const }

describe('teacher list filters', () => {
  it('searches by name and email', () => {
    expect(filterAndSortTeachers(teachers, { ...filters, search: 'luis@' })).toEqual([teachers[2]])
  })

  it('combines specialty and status filters', () => {
    expect(
      filterAndSortTeachers(teachers, { ...filters, specialty: 'Ritmo', status: 'active' }),
    ).toEqual([teachers[2], teachers[0]])
  })

  it('sorts active teachers first and names alphabetically', () => {
    expect(
      filterAndSortTeachers(teachers, { ...filters, sort: 'status' }).map((item) => item.id),
    ).toEqual(['teacher-luis', 'teacher-marta', 'teacher-ana'])
  })
})
