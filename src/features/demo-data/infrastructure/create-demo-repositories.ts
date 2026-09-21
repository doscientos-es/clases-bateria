import type { DemoRepositories } from '../application/repositories'
import { createLocalStore } from './local-store'
import { createMockClassRepository } from './mock-class-repository'
import { createMockDocumentRepository } from './mock-document-repository'
import { createMockPaymentRepository } from './mock-payment-repository'
import { createMockStudentRepository } from './mock-student-repository'
import { createMockTeacherRepository } from './mock-teacher-repository'

/** Single composition point of the demo persistence. */
export function createDemoRepositories(): DemoRepositories {
  const store = createLocalStore()

  return {
    demoData: {
      load() {
        return Promise.resolve(store.read())
      },
      reset() {
        return Promise.resolve(store.reset())
      },
    },
    students: createMockStudentRepository(store),
    payments: createMockPaymentRepository(store),
    teachers: createMockTeacherRepository(store),
    classes: createMockClassRepository(store),
    documents: createMockDocumentRepository(store),
  }
}
