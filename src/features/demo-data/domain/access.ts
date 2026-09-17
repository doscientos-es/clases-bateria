import type {
  ClassPathEntry,
  DemoData,
  DocumentAccessSource,
  DocumentItem,
  ProgressEntry,
  VisibleDocument,
} from './entities'

/** Identifiers of the active classes the student belongs to. */
export function classIdsForStudent(data: DemoData, studentId: string): string[] {
  return data.classes
    .filter((item) => item.status === 'active' && item.studentIds.includes(studentId))
    .map((item) => item.id)
}

/** Documents granted through any class the student belongs to. */
export function classShareEntriesForStudent(data: DemoData, studentId: string): ClassPathEntry[] {
  const classIds = new Set(classIdsForStudent(data, studentId))
  return data.classDocumentPaths.filter((entry) => entry.shared && classIds.has(entry.classId))
}

/** Documents granted directly to the student. */
export function directShareDocumentIds(data: DemoData, studentId: string): string[] {
  return data.directShares
    .filter((share) => share.studentId === studentId)
    .map((share) => share.documentId)
}

/** Union of direct and class grants, deduplicated by document. */
export function visibleDocumentIds(data: DemoData, studentId: string): string[] {
  const ids = new Set(directShareDocumentIds(data, studentId))
  for (const entry of classShareEntriesForStudent(data, studentId)) ids.add(entry.documentId)
  return [...ids]
}

function resolveSource(direct: boolean, viaClass: boolean): DocumentAccessSource {
  if (direct && viaClass) return 'both'
  return direct ? 'direct' : 'class'
}

function findProgress(
  progress: ProgressEntry[],
  documentId: string,
  studentId: string,
): ProgressEntry | undefined {
  return progress.find((item) => item.documentId === documentId && item.studentId === studentId)
}

function findDocument(documents: DocumentItem[], documentId: string): DocumentItem | undefined {
  return documents.find((item) => item.id === documentId)
}

/**
 * Effective library of a student: direct grants ∪ class grants, without duplicates,
 * ordered by itinerary position when available and then by title.
 */
export function buildStudentLibrary(data: DemoData, studentId: string): VisibleDocument[] {
  const directIds = new Set(directShareDocumentIds(data, studentId))
  const classEntries = classShareEntriesForStudent(data, studentId)
  const classPositions = new Map<string, number>()
  const classIdsByDocument = new Map<string, string[]>()

  for (const entry of classEntries) {
    const current = classPositions.get(entry.documentId)
    if (current === undefined || entry.position < current) {
      classPositions.set(entry.documentId, entry.position)
    }
    classIdsByDocument.set(entry.documentId, [
      ...(classIdsByDocument.get(entry.documentId) ?? []),
      entry.classId,
    ])
  }

  const documentIds = new Set([...directIds, ...classPositions.keys()])
  const visible: VisibleDocument[] = []

  for (const documentId of documentIds) {
    const document = findDocument(data.documents, documentId)
    if (!document || document.status === 'archived') continue
    const progress = findProgress(data.progress, documentId, studentId)
    visible.push({
      document,
      source: resolveSource(directIds.has(documentId), classPositions.has(documentId)),
      classIds: classIdsByDocument.get(documentId) ?? [],
      position: classPositions.get(documentId) ?? null,
      viewed: progress?.viewed ?? false,
      completed: progress?.completed ?? false,
    })
  }

  return visible.sort((left, right) => {
    if (left.position !== right.position) {
      if (left.position === null) return 1
      if (right.position === null) return -1
      return left.position - right.position
    }
    return left.document.title.localeCompare(right.document.title, 'es')
  })
}

/** Share state of a document across the whole demo dataset. */
export function documentVisibility(
  data: DemoData,
  documentId: string,
): { classIds: string[]; studentIds: string[] } {
  return {
    classIds: data.classDocumentPaths
      .filter((entry) => entry.documentId === documentId && entry.shared)
      .map((entry) => entry.classId),
    studentIds: data.directShares
      .filter((share) => share.documentId === documentId)
      .map((share) => share.studentId),
  }
}

/** Active students who can access a document through any sharing channel. */
export function studentIdsWithDocument(data: DemoData, documentId: string): string[] {
  const directStudentIds = data.directShares
    .filter((share) => share.documentId === documentId)
    .map((share) => share.studentId)
  const sharedClassIds = new Set(
    data.classDocumentPaths
      .filter((entry) => entry.documentId === documentId && entry.shared)
      .map((entry) => entry.classId),
  )
  const classStudentIds = data.classes
    .filter((schoolClass) => schoolClass.status === 'active' && sharedClassIds.has(schoolClass.id))
    .flatMap((schoolClass) => schoolClass.studentIds)
  const studentIds = new Set([...directStudentIds, ...classStudentIds])
  return data.students.filter((student) => studentIds.has(student.id)).map((student) => student.id)
}
