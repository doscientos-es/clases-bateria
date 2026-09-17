import type { ClassPathEntry, ClassPathItem, DemoData } from './entities'

/** Itinerary entries of a class sorted by position. */
export function classPathEntries(data: DemoData, classId: string): ClassPathEntry[] {
  return data.classDocumentPaths
    .filter((entry) => entry.classId === classId)
    .sort((left, right) => left.position - right.position)
}

/** Itinerary of a class resolved against the library, sorted by position. */
export function classPathItems(data: DemoData, classId: string): ClassPathItem[] {
  const items: ClassPathItem[] = []
  for (const entry of classPathEntries(data, classId)) {
    const document = data.documents.find((item) => item.id === entry.documentId)
    if (!document) continue
    items.push({ document, position: entry.position, shared: entry.shared })
  }
  return items
}

/** Next free position at the end of the itinerary of a class. */
export function nextPathPosition(data: DemoData, classId: string): number {
  const entries = classPathEntries(data, classId)
  const last = entries.at(-1)
  return last ? last.position + 1 : 1
}

/** Applies the requested document order, renumbering positions from one. */
export function reorderedPathEntries(
  entries: ClassPathEntry[],
  orderedDocumentIds: string[],
): ClassPathEntry[] {
  const byDocument = new Map(entries.map((entry) => [entry.documentId, entry]))
  const ordered: ClassPathEntry[] = []

  for (const documentId of orderedDocumentIds) {
    const entry = byDocument.get(documentId)
    if (!entry) continue
    byDocument.delete(documentId)
    ordered.push(entry)
  }
  for (const entry of byDocument.values()) ordered.push(entry)

  return ordered.map((entry, index) => ({ ...entry, position: index + 1 }))
}

/** Document order after moving one document one step up or down. */
export function movedDocumentOrder(
  orderedDocumentIds: string[],
  documentId: string,
  direction: 'up' | 'down',
): string[] {
  const index = orderedDocumentIds.indexOf(documentId)
  const target = direction === 'up' ? index - 1 : index + 1
  if (index === -1 || target < 0 || target >= orderedDocumentIds.length) {
    return [...orderedDocumentIds]
  }
  const next = [...orderedDocumentIds]
  const current = next[index] as string
  next[index] = next[target] as string
  next[target] = current
  return next
}
