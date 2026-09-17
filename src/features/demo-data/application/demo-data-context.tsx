import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createContext, use, useMemo, type ReactNode } from 'react'

import type { DemoData, VisibleDocument } from '../domain/entities'
import { createDemoRepositories } from '../infrastructure/create-demo-repositories'
import type { DemoRepositories } from './repositories'

const DemoRepositoriesContext = createContext<DemoRepositories | null>(null)

export const demoDataQueryKey = ['demo-data'] as const

/** Injects the persistence once for the whole application. */
export function DemoDataProvider({
  children,
  repositories,
}: {
  children: ReactNode
  repositories?: DemoRepositories
}) {
  const value = useMemo(() => repositories ?? createDemoRepositories(), [repositories])
  return <DemoRepositoriesContext value={value}>{children}</DemoRepositoriesContext>
}

export function useDemoRepositories(): DemoRepositories {
  const repositories = use(DemoRepositoriesContext)
  if (!repositories) throw new Error('DemoDataProvider no está montado.')
  return repositories
}

/** Whole dataset of the demo. Screens derive their views from this snapshot. */
export function useDemoSnapshot() {
  const repositories = useDemoRepositories()
  return useQuery<DemoData>({
    queryKey: demoDataQueryKey,
    queryFn: () => repositories.demoData.load(),
  })
}

/** Runs a repository command and refreshes every demo query afterwards. */
export function useDemoCommand<Variables, Result>(
  command: (repositories: DemoRepositories, variables: Variables) => Promise<Result>,
) {
  const repositories = useDemoRepositories()
  const queryClient = useQueryClient()
  return useMutation<Result, Error, Variables>({
    mutationFn: (variables) => command(repositories, variables),
    onSettled: () => queryClient.invalidateQueries(),
  })
}

/** Effective library of a student, resolved by the repository contract. */
export function useStudentLibrary(studentId: string) {
  const repositories = useDemoRepositories()
  return useQuery<VisibleDocument[]>({
    queryKey: ['student-library', studentId],
    queryFn: () => repositories.documents.getStudentLibrary(studentId),
  })
}
