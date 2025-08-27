export function toDate(value: any): Date | null {
  if (!value) return null
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value)
    return isNaN(d.getTime()) ? null : d
  }
  if (typeof value === 'object') {
    const seconds = (value as any)._seconds ?? (value as any).seconds
    const nanos = (value as any)._nanoseconds ?? (value as any).nanoseconds ?? 0
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

export function computeDateRange(preset?: string, from?: string, to?: string): { from?: string; to?: string } | undefined {
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
