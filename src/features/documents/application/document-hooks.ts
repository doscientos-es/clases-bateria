import { useQuery } from '@tanstack/react-query'

import {
  useDemoCommand,
  useDemoRepositories,
  type CreateDocumentInput,
  type DocumentFilters,
  type DocumentItem,
  type ShareResult,
  type UpdateDocumentInput,
} from '@/features/demo-data'

export function useDocuments(filters: DocumentFilters) {
  const repositories = useDemoRepositories()
  return useQuery<DocumentItem[]>({
    queryKey: ['documents', filters],
    queryFn: () => repositories.documents.list(filters),
  })
}

export function useCreateDocument() {
  return useDemoCommand<CreateDocumentInput, DocumentItem>((repositories, input) =>
    repositories.documents.create(input),
  )
}

export function useUpdateDocument(documentId: string) {
  return useDemoCommand<UpdateDocumentInput, DocumentItem>((repositories, input) =>
    repositories.documents.update(documentId, input),
  )
}

export function useArchiveDocument() {
  return useDemoCommand<string, void>((repositories, documentId) =>
    repositories.documents.archive(documentId),
  )
}

/** Multiple share executed as a single application operation. */
export function useShareDocumentsWithStudents() {
  return useDemoCommand<{ documentIds: string[]; studentIds: string[] }, ShareResult>(
    (repositories, input) =>
      repositories.documents.shareWithStudents(input.documentIds, input.studentIds),
  )
}

export function useUnshareDocumentWithStudent() {
  return useDemoCommand<{ documentId: string; studentId: string }, void>((repositories, input) =>
    repositories.documents.unshareWithStudent(input.documentId, input.studentId),
  )
}
