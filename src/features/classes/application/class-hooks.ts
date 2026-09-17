import { useQuery } from '@tanstack/react-query'

import {
  useDemoCommand,
  useDemoRepositories,
  type ClassDetail,
  type CreateClassInput,
  type SchoolClass,
  type UpdateClassInput,
} from '@/features/demo-data'

export function useClasses() {
  const repositories = useDemoRepositories()
  return useQuery<SchoolClass[]>({
    queryKey: ['classes'],
    queryFn: () => repositories.classes.list(),
  })
}

export function useClassDetail(classId: string) {
  const repositories = useDemoRepositories()
  return useQuery<ClassDetail | null>({
    queryKey: ['class-detail', classId],
    queryFn: () => repositories.classes.getDetail(classId),
  })
}

export function useCreateClass() {
  return useDemoCommand<CreateClassInput, SchoolClass>((repositories, input) =>
    repositories.classes.create(input),
  )
}

export function useUpdateClass(classId: string) {
  return useDemoCommand<UpdateClassInput, SchoolClass>((repositories, input) =>
    repositories.classes.update(classId, input),
  )
}

export function useAddStudentToClass() {
  return useDemoCommand<{ classId: string; studentId: string }, void>((repositories, input) =>
    repositories.classes.addStudent(input.classId, input.studentId),
  )
}

export function useRemoveStudentFromClass() {
  return useDemoCommand<{ classId: string; studentId: string }, void>((repositories, input) =>
    repositories.classes.removeStudent(input.classId, input.studentId),
  )
}
