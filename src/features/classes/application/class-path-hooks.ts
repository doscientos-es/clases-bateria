import { useDemoCommand } from '@/features/demo-data'

export function useAddDocumentToClassPath() {
  return useDemoCommand<{ classId: string; documentId: string }, void>((repositories, input) =>
    repositories.documents.addToClassPath(input.classId, input.documentId),
  )
}

export function useRemoveDocumentFromClassPath() {
  return useDemoCommand<{ classId: string; documentId: string }, void>((repositories, input) =>
    repositories.documents.removeFromClassPath(input.classId, input.documentId),
  )
}

export function useShareDocumentWithClass() {
  return useDemoCommand<{ classId: string; documentId: string; shared: boolean }, void>(
    (repositories, input) =>
      repositories.documents.shareWithClass(input.classId, input.documentId, input.shared),
  )
}

export function useMoveClassDocument() {
  return useDemoCommand<{ classId: string; documentId: string; direction: 'up' | 'down' }, void>(
    async (repositories, input) => {
      const detail = await repositories.classes.getDetail(input.classId)
      if (!detail) return
      const ids = detail.path.map((item) => item.document.id)
      const index = ids.indexOf(input.documentId)
      const target = input.direction === 'up' ? index - 1 : index + 1
      if (index < 0 || target < 0 || target >= ids.length) return
      const current = ids[index] as string
      ids[index] = ids[target] as string
      ids[target] = current
      await repositories.documents.reorderClassPath(input.classId, ids)
    },
  )
}
