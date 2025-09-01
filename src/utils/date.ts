export type FirestoreTimestampLike = {
  _seconds?: number
  seconds?: number
  _nanoseconds?: number
  nanoseconds?: number
}

export function toDate(value: unknown): Date | null {
  if (!value) return null
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value)
    return isNaN(d.getTime()) ? null : d
  }
  if (typeof value === 'object' && value !== null) {
    const ts = value as FirestoreTimestampLike
    const seconds = ts._seconds ?? ts.seconds
    const nanos = ts._nanoseconds ?? ts.nanoseconds ?? 0
    if (typeof seconds === 'number') {
      const ms = seconds * 1000 + Math.floor(nanos / 1e6)
      const d = new Date(ms)
      return isNaN(d.getTime()) ? null : d
    }
  }
  return null
}

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function computeDateRange(
  preset?: string,
  from?: string,
  to?: string,
): { from?: string; to?: string } | undefined {
  const today = new Date()
  if (preset && preset !== 'all' && preset !== 'custom') {
    const d = new Date(today)
    const days = preset === '7d' ? 7 : preset === '30d' ? 30 : preset === '90d' ? 90 : 0
    d.setDate(d.getDate() - days)
    return { from: toISODate(d), to: toISODate(today) }
  }
  if (preset === 'custom' || (!preset && (from || to))) {
    return { from, to }
  }
  return undefined
}
