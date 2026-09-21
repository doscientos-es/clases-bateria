import { describe, expect, it } from 'vitest'

import { dateKey, monthCells, scheduledDateKey } from './calendar'

describe('calendar helpers', () => {
  it('uses Monday as the first day of the month grid', () => {
    const cells = monthCells(new Date(2026, 8, 1))

    expect(cells[0]?.date).toBe('2026-08-31')
    expect(cells[1]?.date).toBe('2026-09-01')
    expect(cells).toHaveLength(42)
  })

  it('normalizes scheduled values to local calendar keys', () => {
    expect(scheduledDateKey('2026-09-22T17:30')).toBe('2026-09-22')
    expect(scheduledDateKey(null)).toBeNull()
    expect(dateKey(new Date(2026, 8, 22))).toBe('2026-09-22')
  })
})
