import { todayIso } from '../../../shared/lib/dates'
import { createId } from '../../../shared/lib/ids'
import type {
  CreateTeacherInput,
  TeacherRepository,
  UpdateTeacherInput,
} from '../application/repositories'
import type { Teacher } from '../domain/entities'
import { DemoError } from '../domain/errors'
import type { DemoStore } from './local-store'

function requireTeacher(teachers: Teacher[], id: string): Teacher {
  const teacher = teachers.find((item) => item.id === id)
  if (!teacher) throw new DemoError('not-found', 'No se ha encontrado el profesor indicado.')
  return teacher
}

export function createMockTeacherRepository(store: DemoStore): TeacherRepository {
  return {
    list() {
      return Promise.resolve(store.read().teachers)
    },
    getById(id) {
      const teacher = store.read().teachers.find((item) => item.id === id)
      return Promise.resolve(teacher ?? null)
    },
    create(input: CreateTeacherInput) {
      const data = store.read()
      const teacher: Teacher = {
        id: createId('teacher'),
        name: input.name,
        email: input.email,
        specialty: input.specialty,
        status: 'active',
        joinedOn: todayIso(),
      }
      store.write({ ...data, teachers: [...data.teachers, teacher] })
      return Promise.resolve(teacher)
    },
    update(id, input: UpdateTeacherInput) {
      const data = store.read()
      const current = requireTeacher(data.teachers, id)
      const teacher: Teacher = { ...current, ...input }
      store.write({
        ...data,
        teachers: data.teachers.map((item) => (item.id === id ? teacher : item)),
      })
      return Promise.resolve(teacher)
    },
    archive(id) {
      const data = store.read()
      requireTeacher(data.teachers, id)
      store.write({
        ...data,
        teachers: data.teachers.map((item) =>
          item.id === id ? { ...item, status: 'archived' } : item,
        ),
      })
      return Promise.resolve()
    },
    restore(id) {
      const data = store.read()
      requireTeacher(data.teachers, id)
      store.write({
        ...data,
        teachers: data.teachers.map((item) =>
          item.id === id ? { ...item, status: 'active' } : item,
        ),
      })
      return Promise.resolve()
    },
  }
}
