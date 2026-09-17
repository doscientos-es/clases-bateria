import type { EntityStatus, Teacher } from '@/features/demo-data'

export type TeacherSort = 'name-asc' | 'name-desc' | 'specialty-asc' | 'status'

export type TeacherListFilters = {
  search: string
  specialty: string
  status: EntityStatus | 'all'
  sort: TeacherSort
}

export function filterAndSortTeachers(teachers: Teacher[], filters: TeacherListFilters) {
  const normalizedSearch = filters.search.trim().toLocaleLowerCase('es')
  return teachers
    .filter((teacher) => {
      const matchesSearch = normalizedSearch
        ? `${teacher.name} ${teacher.email}`.toLocaleLowerCase('es').includes(normalizedSearch)
        : true
      const matchesSpecialty =
        filters.specialty === 'all' || teacher.specialty === filters.specialty
      const matchesStatus = filters.status === 'all' || teacher.status === filters.status
      return matchesSearch && matchesSpecialty && matchesStatus
    })
    .sort((left, right) => {
      if (filters.sort === 'status') {
        return statusRank(left.status) - statusRank(right.status) || compareNames(left, right)
      }
      if (filters.sort === 'specialty-asc') {
        return left.specialty.localeCompare(right.specialty, 'es') || compareNames(left, right)
      }
      const comparison = compareNames(left, right)
      return filters.sort === 'name-desc' ? -comparison : comparison
    })
}

function compareNames(left: Teacher, right: Teacher) {
  return left.name.localeCompare(right.name, 'es')
}

function statusRank(status: EntityStatus) {
  return status === 'active' ? 0 : 1
}
