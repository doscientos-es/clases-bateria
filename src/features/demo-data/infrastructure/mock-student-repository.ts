import { todayIso } from '../../../shared/lib/dates'
import { createId, matchesSearch } from '../../../shared/lib/ids'
import type {
  CreateStudentInput,
  StudentFilters,
  StudentRepository,
  UpdateStudentInput,
} from '../application/repositories'
import type { Student } from '../domain/entities'
import { DemoError } from '../domain/errors'
import type { DemoStore } from './local-store'

function requireStudent(students: Student[], id: string): Student {
  const student = students.find((item) => item.id === id)
  if (!student) throw new DemoError('not-found', 'No se ha encontrado el alumno indicado.')
  return student
}

export function createMockStudentRepository(store: DemoStore): StudentRepository {
  return {
    list(filters) {
      const data = store.read()
      const { search, classId, status }: StudentFilters = filters ?? {}
      const members = classId
        ? new Set(data.classes.find((item) => item.id === classId)?.studentIds ?? [])
        : null
      const students = data.students.filter((student) => {
        if (status && student.status !== status) return false
        if (members && !members.has(student.id)) return false
        if (search && !matchesSearch(`${student.name} ${student.email}`, search)) return false
        return true
      })
      return Promise.resolve(students)
    },
    getById(id) {
      const student = store.read().students.find((item) => item.id === id)
      return Promise.resolve(student ?? null)
    },
    create(input: CreateStudentInput) {
      const data = store.read()
      const student: Student = {
        id: createId('student'),
        name: input.name,
        email: input.email,
        phone: input.phone,
        notes: input.notes,
        status: 'active',
        enrolledOn: todayIso(),
      }
      store.write({ ...data, students: [...data.students, student] })
      return Promise.resolve(student)
    },
    update(id, input: UpdateStudentInput) {
      const data = store.read()
      const current = requireStudent(data.students, id)
      const student: Student = { ...current, ...input }
      store.write({
        ...data,
        students: data.students.map((item) => (item.id === id ? student : item)),
      })
      return Promise.resolve(student)
    },
    archive(id) {
      const data = store.read()
      requireStudent(data.students, id)
      store.write({
        ...data,
        students: data.students.map((item) =>
          item.id === id ? { ...item, status: 'archived' } : item,
        ),
      })
      return Promise.resolve()
    },
    restore(id) {
      const data = store.read()
      requireStudent(data.students, id)
      store.write({
        ...data,
        students: data.students.map((item) =>
          item.id === id ? { ...item, status: 'active' } : item,
        ),
      })
      return Promise.resolve()
    },
  }
}
