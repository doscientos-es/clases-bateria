import { useQuery } from '@tanstack/react-query'

import {
  useDemoCommand,
  useDemoRepositories,
  type CreateTeacherInput,
  type Teacher,
  type UpdateTeacherInput,
} from '@/features/demo-data'

export function useTeachers() {
  const repositories = useDemoRepositories()
  return useQuery<Teacher[]>({
    queryKey: ['teachers'],
    queryFn: () => repositories.teachers.list(),
  })
}

export function useTeacher(teacherId: string) {
  const repositories = useDemoRepositories()
  return useQuery<Teacher | null>({
    queryKey: ['teacher', teacherId],
    queryFn: () => repositories.teachers.getById(teacherId),
  })
}

export function useCreateTeacher() {
  return useDemoCommand<CreateTeacherInput, Teacher>((repositories, input) =>
    repositories.teachers.create(input),
  )
}

export function useUpdateTeacher(teacherId: string) {
  return useDemoCommand<UpdateTeacherInput, Teacher>((repositories, input) =>
    repositories.teachers.update(teacherId, input),
  )
}

export function useArchiveTeacher() {
  return useDemoCommand<string, void>((repositories, teacherId) =>
    repositories.teachers.archive(teacherId),
  )
}

export function useRestoreTeacher() {
  return useDemoCommand<string, void>((repositories, teacherId) =>
    repositories.teachers.restore(teacherId),
  )
}
