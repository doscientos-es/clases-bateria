import { documentVisibility, type DemoData } from '@/features/demo-data'

/** Visibility of a document explained with text, never only with color. */
export function describeVisibility(data: DemoData, documentId: string): string {
  const { classIds, studentIds } = documentVisibility(data, documentId)
  if (classIds.length === 0 && studentIds.length === 0) return 'Privado'

  const parts: string[] = []
  if (classIds.length > 0) {
    parts.push(
      classIds.length === 1 ? 'Compartido con 1 clase' : `Compartido con ${classIds.length} clases`,
    )
  }
  if (studentIds.length > 0) {
    parts.push(
      studentIds.length === 1
        ? 'Compartido con 1 alumno'
        : `Compartido con ${studentIds.length} alumnos`,
    )
  }
  return parts.join(' · ')
}

/** Distinct categories present in the library, sorted for the filter control. */
export function documentCategories(data: DemoData): string[] {
  return [...new Set(data.documents.map((document) => document.category))].sort((left, right) =>
    left.localeCompare(right, 'es'),
  )
}

/** Distinct levels present in the library, sorted for the filter control. */
export function documentLevels(data: DemoData): string[] {
  return [...new Set(data.documents.map((document) => document.level))].sort((left, right) =>
    left.localeCompare(right, 'es'),
  )
}
