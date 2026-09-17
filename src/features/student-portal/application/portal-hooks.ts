import { useDemoCommand } from '@/features/demo-data'

export function useMarkDocumentViewed() {
  return useDemoCommand<{ documentId: string; studentId: string }, void>((repositories, input) =>
    repositories.documents.markDocumentViewed(input.documentId, input.studentId),
  )
}

export function useMarkDocumentCompleted() {
  return useDemoCommand<{ documentId: string; studentId: string; completed: boolean }, void>(
    (repositories, input) =>
      repositories.documents.markDocumentCompleted(
        input.documentId,
        input.studentId,
        input.completed,
      ),
  )
}
