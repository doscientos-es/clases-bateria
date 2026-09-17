import { useQuery } from '@tanstack/react-query'

import {
  useDemoCommand,
  useDemoRepositories,
  type CreateStudentInput,
  type Student,
  type StudentFilters,
  type UpdateStudentInput,
} from '@/features/demo-data'

export function useStudents(filters: StudentFilters) {
  const repositories = useDemoRepositories()
  return useQuery<Student[]>({
    queryKey: ['students', filters],
    queryFn: () => repositories.students.list(filters),
  })
}

export function useStudent(studentId: string) {
  const repositories = useDemoRepositories()
  return useQuery<Student | null>({
    queryKey: ['student', studentId],
    queryFn: () => repositories.students.getById(studentId),
  })
}

export function useCreateStudent() {
  return useDemoCommand<CreateStudentInput, Student>((repositories, input) =>
    repositories.students.create(input),
  )
}

export function useUpdateStudent(studentId: string) {
  return useDemoCommand<UpdateStudentInput, Student>((repositories, input) =>
    repositories.students.update(studentId, input),
  )
}

export function useArchiveStudent() {
  return useDemoCommand<string, void>((repositories, studentId) =>
    repositories.students.archive(studentId),
  )
}

export function useRestoreStudent() {
  return useDemoCommand<string, void>((repositories, studentId) =>
    repositories.students.restore(studentId),
  )
}
