import { describe, it, expect, vi, afterEach } from 'vitest'
import { toDate, toISODate, computeDateRange } from '../../src/utils/date'

afterEach(() => {
  vi.useRealTimers()
})

describe('date utils', () => {
  it('toDate parses valid ISO string and toISODate formats correctly', () => {
    const d = toDate('2020-01-02T00:00:00.000Z')
    expect(d).toBeInstanceOf(Date)
    expect(toISODate(d as Date)).toBe('2020-01-02')
  })

  it('toDate returns null for invalid input', () => {
    expect(toDate('not-a-date')).toBeNull()
    expect(toDate(undefined)).toBeNull()
  })

  it('computeDateRange handles custom preset passthrough', () => {
    const r = computeDateRange('custom', '2024-01-01', '2024-02-01')
    expect(r).toEqual({ from: '2024-01-01', to: '2024-02-01' })
  })

  it('computeDateRange returns undefined for all/empty', () => {
    expect(computeDateRange('all')).toBeUndefined()
    expect(computeDateRange()).toBeUndefined()
  })

  it('computeDateRange computes 7d window relative to today', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-10T12:00:00.000Z'))
    const r = computeDateRange('7d')
    expect(r).toEqual({ from: '2024-01-03', to: '2024-01-10' })
  })
})


