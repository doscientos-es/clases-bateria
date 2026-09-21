import { describe, expect, it } from 'vitest'

import type { DemoStore } from './local-store'
import { createMockPaymentRepository } from './mock-payment-repository'
import { loadSeed } from './seed-loader'

describe('mock payment repository', () => {
  it('records and removes manual payments for a student', async () => {
    let data = loadSeed()
    const store: DemoStore = {
      read: () => data,
      write: (next) => {
        data = next
      },
      reset: () => data,
    }
    const repository = createMockPaymentRepository(store)

    const payment = await repository.create({
      studentId: 'student-lucia',
      amount: 32.5,
      paidOn: '2026-09-21',
      method: 'cash',
      note: 'Clase individual',
    })

    expect(payment.amount).toBe(32.5)
    expect(await repository.listByStudent('student-lucia')).toContainEqual(payment)

    await repository.remove(payment.id)
    expect(await repository.listByStudent('student-lucia')).not.toContainEqual(payment)
  })
})
