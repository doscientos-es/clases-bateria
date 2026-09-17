import { createId, matchesSearch } from '../../../shared/lib/ids'
import type {
  CreateDocumentInput,
  DocumentFilters,
  DocumentRepository,
  ShareResult,
  UpdateDocumentInput,
} from '../application/repositories'
import { buildStudentLibrary } from '../domain/access'
import type { DemoData, DocumentItem, ProgressEntry } from '../domain/entities'
import { DemoError } from '../domain/errors'
import { classPathEntries, nextPathPosition, reorderedPathEntries } from '../domain/itinerary'
import type { DemoStore } from './local-store'

function requireDocument(data: DemoData, id: string): DocumentItem {
  const document = data.documents.find((item) => item.id === id)
  if (!document) throw new DemoError('not-found', 'No se ha encontrado el documento indicado.')
  return document
}

function withProgress(
  data: DemoData,
  documentId: string,
  studentId: string,
  change: (entry: ProgressEntry) => ProgressEntry,
): DemoData {
  const current = data.progress.find(
    (item) => item.documentId === documentId && item.studentId === studentId,
  )
  const base: ProgressEntry = current ?? { documentId, studentId, viewed: false, completed: false }
  const next = change(base)
  return {
    ...data,
    progress: current
      ? data.progress.map((item) => (item === current ? next : item))
      : [...data.progress, next],
  }
}

export function createMockDocumentRepository(store: DemoStore): DocumentRepository {
  return {
    list(filters) {
      const data = store.read()
      const { search, category, level, status }: DocumentFilters = filters ?? {}
      return Promise.resolve(
        data.documents.filter((document) => {
          if (status && document.status !== status) return false
          if (category && document.category !== category) return false
          if (level && document.level !== level) return false
          if (search && !matchesSearch(`${document.title} ${document.description}`, search)) {
            return false
          }
          return true
        }),
      )
    },
    create(input: CreateDocumentInput) {
      const data = store.read()
      const document: DocumentItem = {
        id: createId('doc'),
        title: input.title,
        description: input.description,
        category: input.category,
        level: input.level,
        status: 'published',
        fileName: input.fileName,
      }
      store.write({ ...data, documents: [...data.documents, document] })
      return Promise.resolve(document)
    },
    update(id, input: UpdateDocumentInput) {
      const data = store.read()
      const current = requireDocument(data, id)
      const document: DocumentItem = { ...current, ...input }
      store.write({
        ...data,
        documents: data.documents.map((item) => (item.id === id ? document : item)),
      })
      return Promise.resolve(document)
    },
    archive(id) {
      const data = store.read()
      requireDocument(data, id)
      store.write({
        ...data,
        documents: data.documents.map((item) =>
          item.id === id ? { ...item, status: 'archived' } : item,
        ),
      })
      return Promise.resolve()
    },
    addToClassPath(classId, documentId) {
      const data = store.read()
      requireDocument(data, documentId)
      const exists = data.classDocumentPaths.some(
        (entry) => entry.classId === classId && entry.documentId === documentId,
      )
      if (exists) return Promise.resolve()
      store.write({
        ...data,
        classDocumentPaths: [
          ...data.classDocumentPaths,
          { classId, documentId, position: nextPathPosition(data, classId), shared: false },
        ],
      })
      return Promise.resolve()
    },
    removeFromClassPath(classId, documentId) {
      const data = store.read()
      const remaining = reorderedPathEntries(
        classPathEntries(data, classId).filter((entry) => entry.documentId !== documentId),
        [],
      )
      store.write({
        ...data,
        classDocumentPaths: [
          ...data.classDocumentPaths.filter((entry) => entry.classId !== classId),
          ...remaining,
        ],
      })
      return Promise.resolve()
    },
    reorderClassPath(classId, orderedDocumentIds) {
      const data = store.read()
      const reordered = reorderedPathEntries(classPathEntries(data, classId), orderedDocumentIds)
      store.write({
        ...data,
        classDocumentPaths: [
          ...data.classDocumentPaths.filter((entry) => entry.classId !== classId),
          ...reordered,
        ],
      })
      return Promise.resolve()
    },
    shareWithClass(classId, documentId, shared) {
      const data = store.read()
      const exists = data.classDocumentPaths.some(
        (entry) => entry.classId === classId && entry.documentId === documentId,
      )
      if (!exists) {
        throw new DemoError('not-found', 'El documento no está en el itinerario de la clase.')
      }
      store.write({
        ...data,
        classDocumentPaths: data.classDocumentPaths.map((entry) =>
          entry.classId === classId && entry.documentId === documentId
            ? { ...entry, shared }
            : entry,
        ),
      })
      return Promise.resolve()
    },
    shareWithStudents(documentIds, studentIds) {
      const data = store.read()
      for (const documentId of documentIds) requireDocument(data, documentId)
      const known = new Set(data.students.map((item) => item.id))
      const targets = studentIds.filter((studentId) => known.has(studentId))
      if (documentIds.length === 0 || targets.length === 0) {
        throw new DemoError('validation', 'Selecciona al menos un documento y un alumno.')
      }
      const created = []
      for (const documentId of documentIds) {
        for (const studentId of targets) {
          const exists = data.directShares.some(
            (share) => share.documentId === documentId && share.studentId === studentId,
          )
          if (!exists) created.push({ documentId, studentId })
        }
      }
      store.write({ ...data, directShares: [...data.directShares, ...created] })
      const result: ShareResult = {
        documentCount: documentIds.length,
        studentCount: targets.length,
        createdShares: created.length,
      }
      return Promise.resolve(result)
    },
    unshareWithStudent(documentId, studentId) {
      const data = store.read()
      store.write({
        ...data,
        directShares: data.directShares.filter(
          (share) => !(share.documentId === documentId && share.studentId === studentId),
        ),
      })
      return Promise.resolve()
    },
    getStudentLibrary(studentId) {
      return Promise.resolve(buildStudentLibrary(store.read(), studentId))
    },
    markDocumentViewed(documentId, studentId) {
      const data = store.read()
      store.write(
        withProgress(data, documentId, studentId, (entry) => ({ ...entry, viewed: true })),
      )
      return Promise.resolve()
    },
    markDocumentCompleted(documentId, studentId, completed) {
      const data = store.read()
      store.write(
        withProgress(data, documentId, studentId, (entry) => ({
          ...entry,
          completed,
          viewed: entry.viewed || completed,
        })),
      )
      return Promise.resolve()
    },
  }
}
