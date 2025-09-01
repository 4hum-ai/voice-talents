interface Props { value: unknown type?: | 'text' | 'number' | 'date' | 'boolean' | 'image' | 'video'
| 'url' | 'array' | 'object' | 'color' formatter?: 'rating' | 'status' | 'date' | 'currency' |
'badge' | 'country' | 'number' currencyCode?: string fieldKey?: string } const toDate = (v:
unknown): Date | null => { if (v instanceof Date) return v if (typeof v === 'string' || typeof v ===
'number') { const d = new Date(v) return isNaN(d.getTime()) ? null : d } if (v && typeof v ===
'object') { const maybeTs = v as { _seconds?: number; seconds?: number; _nanoseconds?: number;
nanoseconds?: number } const seconds = maybeTs._seconds ?? maybeTs.seconds const nanos =
maybeTs._nanoseconds ?? maybeTs.nanoseconds ?? 0 if (typeof seconds === 'number') { const ms =
seconds * 1000 + Math.floor(nanos / 1e6) const d = new Date(ms) return isNaN(d.getTime()) ? null : d
} } return null } const objectValue = computed(() => { try { return JSON.stringify(props.value) }
catch { return String(props.value ?? '') } })
