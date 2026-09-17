import type { DemoData } from '@/features/demo-data'

/** Surfaces of the demo. The navigation derives from the role, not from the screen. */
export type DemoRole = 'teacher' | 'student'

export type DemoIdentity = {
  id: string
  name: string
  email: string
  role: DemoRole
  detail: string
}

/** Selectable demo cards: active teachers first, then active students. */
export function demoIdentities(data: DemoData): DemoIdentity[] {
  const teachers: DemoIdentity[] = data.teachers
    .filter((teacher) => teacher.status === 'active')
    .map((teacher) => ({
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      role: 'teacher',
      detail: teacher.specialty,
    }))

  const students: DemoIdentity[] = data.students
    .filter((student) => student.status === 'active')
    .map((student) => ({
      id: student.id,
      name: student.name,
      email: student.email,
      role: 'student',
      detail: classNamesForStudent(data, student.id),
    }))

  return [...teachers, ...students]
}

function classNamesForStudent(data: DemoData, studentId: string): string {
  const names = data.classes
    .filter((item) => item.status === 'active' && item.studentIds.includes(studentId))
    .map((item) => item.name)
  return names.length > 0 ? names.join(' · ') : 'Sin clases asignadas'
}

export function findIdentity(data: DemoData, userId: string | null): DemoIdentity | null {
  if (!userId) return null
  return demoIdentities(data).find((identity) => identity.id === userId) ?? null
}
