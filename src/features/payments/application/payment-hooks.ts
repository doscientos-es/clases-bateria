import { useQuery } from '@tanstack/react-query'

import {
  useDemoCommand,
  useDemoRepositories,
  type CreatePaymentInput,
  type StudentPayment,
} from '@/features/demo-data'

export function useStudentPayments(studentId: string) {
  const repositories = useDemoRepositories()
  return useQuery<StudentPayment[]>({
    queryKey: ['student-payments', studentId],
    queryFn: () => repositories.payments.listByStudent(studentId),
    enabled: Boolean(studentId),
  })
}

export function useCreatePayment() {
  return useDemoCommand<CreatePaymentInput, StudentPayment>((repositories, input) =>
    repositories.payments.create(input),
  )
}

export function useRemovePayment() {
  return useDemoCommand<string, void>((repositories, paymentId) =>
    repositories.payments.remove(paymentId),
  )
}