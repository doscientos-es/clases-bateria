import { createId } from '../../../shared/lib/ids'
import type {
  ClassRepository,
  CreateClassInput,
  UpdateClassInput,
} from '../application/repositories'
import type { DemoData, SchoolClass } from '../domain/entities'
import { DemoError } from '../domain/errors'
import { classPathItems } from '../domain/itinerary'
import type { DemoStore } from './local-store'

function requireClass(data: DemoData, id: string): SchoolClass {
  const schoolClass = data.classes.find((item) => item.id === id)
  if (!schoolClass) throw new DemoError('not-found', 'No se ha encontrado la clase indicada.')
  return schoolClass
}

export function createMockClassRepository(store: DemoStore): ClassRepository {
  function replace(data: DemoData, schoolClass: SchoolClass): void {
    store.write({
      ...data,
      classes: data.classes.map((item) => (item.id === schoolClass.id ? schoolClass : item)),
    })
  }

  return {
    list() {
      return Promise.resolve(store.read().classes)
    },
    getDetail(id) {
      const data = store.read()
      const schoolClass = data.classes.find((item) => item.id === id)
      if (!schoolClass) return Promise.resolve(null)
      return Promise.resolve({
        schoolClass,
        teachers: data.teachers.filter((item) => schoolClass.teacherIds.includes(item.id)),
        students: data.students.filter((item) => schoolClass.studentIds.includes(item.id)),
        path: classPathItems(data, id),
      })
    },
    create(input: CreateClassInput) {
      const data = store.read()
      const schoolClass: SchoolClass = {
        id: createId('class'),
        name: input.name,
        description: input.description,
        level: input.level,
        teacherIds: [...input.teacherIds],
        studentIds: [...input.studentIds],
        scheduledAt: input.scheduledAt,
        status: 'active',
      }
      store.write({ ...data, classes: [...data.classes, schoolClass] })
      return Promise.resolve(schoolClass)
    },
    update(id, input: UpdateClassInput) {
      const data = store.read()
      const current = requireClass(data, id)
      const schoolClass: SchoolClass = {
        ...current,
        name: input.name,
        description: input.description,
        level: input.level,
        teacherIds: [...input.teacherIds],
        studentIds: [...input.studentIds],
        scheduledAt: input.scheduledAt,
      }
      replace(data, schoolClass)
      return Promise.resolve(schoolClass)
    },
    addStudent(classId, studentId) {
      const data = store.read()
      const current = requireClass(data, classId)
      if (!data.students.some((item) => item.id === studentId)) {
        throw new DemoError('not-found', 'No se ha encontrado el alumno indicado.')
      }
      if (current.studentIds.includes(studentId)) return Promise.resolve()
      replace(data, { ...current, studentIds: [...current.studentIds, studentId] })
      return Promise.resolve()
    },
    removeStudent(classId, studentId) {
      const data = store.read()
      const current = requireClass(data, classId)
      replace(data, {
        ...current,
        studentIds: current.studentIds.filter((item) => item !== studentId),
      })
      return Promise.resolve()
    },
  }
}
