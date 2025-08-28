import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { computeDateRange } from '@/utils/date'
import type { UiConfig } from '@/types/ui-config'

export interface QueryState {
  page: number
  limit: number
  search?: string
  searchField?: string
  sort?: string
  filters?: Record<string, any>
}

export function useQueryBuilder(options: { module: () => string; uiConfig: () => UiConfig | null | undefined; defaultLimit?: number }) {
  const route = useRoute()
  const router = useRouter()

  const limit = ref<number>(options.defaultLimit || 20)
  const timeWindow = ref<{ preset?: string; from?: string; to?: string }>({})

  const dateField = computed(() => options.uiConfig()?.views?.calendar?.dateField || 'createdAt')

  const queryState = computed<QueryState>(() => {
    const q = route.query
    const page = Number(q.page || 1) || 1
    const search = (q.search as string) || undefined
    const searchField = (q.searchFields as string) || (q.searchField as string) || undefined
    const sort = (q.sort as string) || undefined
    const params: QueryState = { page, limit: limit.value }
    if (search) params.search = search
    if (searchField) params.searchField = searchField
    if (sort) params.sort = sort

    // Parse generic filters from URL query (filters[<field>] and filters[<field>][$op])
    const parsedFilters: Record<string, any> = {}
    Object.keys(q).forEach((key) => {
      if (!key.startsWith('filters[')) return
      // patterns: filters[field] or filters[field][$op]
      const match = key.match(/^filters\[(.+?)\](?:\[(\$\w+)\])?$/)
      if (!match) return
      const field = match[1]
      const op = match[2]
      const raw = q[key]
      if (!field) return
      if (op) {
        parsedFilters[field] = parsedFilters[field] || {}
        const value = String(raw)
        if (op === '$between') {
          const [a, b] = value.split(',').map(s => s.trim()).filter(Boolean)
          if (a && b) parsedFilters[field]['$between'] = [a, b]
        } else if (op === '$gte' || op === '$lte') {
          parsedFilters[field][op] = value
        }
      } else {
        // direct equality
        parsedFilters[field] = String(raw)
      }
    })
    if (Object.keys(parsedFilters).length > 0) {
      params.filters = { ...(params.filters || {}), ...parsedFilters }
    }

    // Merge time window into filters for the configured dateField
    const range = computeDateRange(timeWindow.value.preset, timeWindow.value.from, timeWindow.value.to)
    if (range && (range.from || range.to)) {
      params.filters = params.filters || {}
      if (range.from && range.to) params.filters[dateField.value] = { $between: [range.from, range.to] }
      else if (range.from) params.filters[dateField.value] = { $gte: range.from }
      else if (range.to) params.filters[dateField.value] = { $lte: range.to }
    }
    return params
  })

  // Note: chips are a presentation detail; compute them in views instead

  function setLimit(next: number) {
    limit.value = next
  }

  function setTimeWindow(payload: { preset?: string; from?: string; to?: string }) {
    timeWindow.value = { ...payload }
    try {
      const nextQuery: Record<string, any> = { ...route.query }
      delete nextQuery.preset; delete nextQuery.from; delete nextQuery.to
      const keysToRemove: string[] = []
      const betweenKey = `filters[${dateField.value}][$between]`
      const gteKey = `filters[${dateField.value}][$gte]`
      const lteKey = `filters[${dateField.value}][$lte]`
      for (const k of Object.keys(nextQuery)) {
        if (k === betweenKey || k === gteKey || k === lteKey) keysToRemove.push(k)
      }
      for (const k of keysToRemove) delete nextQuery[k]
      const range = computeDateRange(payload.preset, payload.from, payload.to)
      if (range?.from && range?.to) nextQuery[betweenKey] = `${range.from},${range.to}`
      else if (range?.from) nextQuery[gteKey] = range.from
      else if (range?.to) nextQuery[lteKey] = range.to
      nextQuery.page = '1'
      router.replace({ query: nextQuery })
    } catch {}
  }

  function setFilters(nextFilters: Record<string, any>) {
    try {
      const nextQuery: Record<string, any> = { ...route.query }
      // Remove existing defaultFilters for this module from URL
      const cfg = options.uiConfig()
      const fields = (cfg?.views?.list?.defaultFilters || []).map((f: any) => f.field)
      for (const k of Object.keys(nextQuery)) {
        const m = k.match(/^filters\[(.+?)\]/)
        if (m && fields.includes(m[1])) delete nextQuery[k]
      }
      // Add new filters
      for (const [field, value] of Object.entries(nextFilters || {})) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          if ('$between' in value && Array.isArray((value as any)['$between'])) {
            const arr = (value as any)['$between'] as any[]
            const asString = arr.map(v => String(v)).join(',')
            nextQuery[`filters[${field}][$between]`] = asString
          }
          if ('$gte' in value) nextQuery[`filters[${field}][$gte]`] = String((value as any)['$gte'])
          if ('$lte' in value) nextQuery[`filters[${field}][$lte]`] = String((value as any)['$lte'])
        } else if (value !== undefined && value !== null && value !== '') {
          nextQuery[`filters[${field}]`] = String(value)
        }
      }
      nextQuery.page = '1'
      router.replace({ query: nextQuery })
    } catch {}
  }

  function clearFilter(key: string) {
    const nextQuery: Record<string, any> = { ...route.query }
    delete nextQuery[key]
    if (key === 'search') {
      delete nextQuery.searchField
      delete nextQuery.searchFields
    }
    const betweenKey = `filters[${dateField.value}][$between]`
    const gteKey = `filters[${dateField.value}][$gte]`
    const lteKey = `filters[${dateField.value}][$lte]`
    if (key === betweenKey || key === gteKey || key === lteKey) {
      delete nextQuery[betweenKey]
      delete nextQuery[gteKey]
      delete nextQuery[lteKey]
      timeWindow.value = {}
    }
    nextQuery.page = '1'
    router.replace({ query: nextQuery })
  }

  function clearAllFilters() {
    const nextQuery: Record<string, any> = { ...route.query }
    delete nextQuery.search; delete nextQuery.searchField; delete nextQuery.searchFields
    // Remove all filters[*] keys
    for (const k of Object.keys(nextQuery)) {
      if (k.startsWith('filters[')) delete nextQuery[k]
    }
    timeWindow.value = {}
    nextQuery.page = '1'
    router.replace({ query: nextQuery })
  }

  function setSort(field: string, direction: string) {
    try {
      router.replace({ query: { ...route.query, sort: `${field}:${direction}`, page: '1' } })
    } catch {}
  }

  function setPage(page: number) {
    try {
      router.replace({ query: { ...route.query, page: String(page) } })
    } catch {}
  }

  const canonicalQueryString = computed(() => {
    const q = route.query
    const sort = String(q.sort || '')
    const search = String(q.search || '')
    const searchField = String(q.searchField || q.searchFields || '')
    // Include all filters[*] params to trigger reloads when filters change
    const filterEntries = Object.keys(q)
      .filter(k => k.startsWith('filters['))
      .sort()
      .reduce<Record<string, string>>((acc, k) => { acc[k] = String(q[k]); return acc }, {})
    const mod = String(options.module())
    return JSON.stringify({ mod, sort, search, searchField, filters: filterEntries })
  })

  function initTimeWindowFromUrl() {
    try {
      const q = route.query
      const betweenKey = `filters[${dateField.value}][$between]`
      const gteKey = `filters[${dateField.value}][$gte]`
      const lteKey = `filters[${dateField.value}][$lte]`
      let from: string | undefined
      let to: string | undefined
      if (q[betweenKey]) {
        const val = String(q[betweenKey])
        const [a, b] = val.split(',').map(s => s.trim())
        from = a || undefined
        to = b || undefined
      } else {
        if (q[gteKey]) from = String(q[gteKey])
        if (q[lteKey]) to = String(q[lteKey])
      }
      timeWindow.value = { preset: 'custom', from, to }
    } catch {}
  }

  watch(() => options.uiConfig(), (cfg) => {
    const pageSize = cfg?.views?.list?.pageSize
    if (pageSize && typeof pageSize === 'number') limit.value = pageSize
  }, { immediate: true })

  return {
    // state
    limit,
    timeWindow,
    dateField,
    queryState,
    canonicalQueryString,
    // actions
    setLimit,
    setTimeWindow,
    setFilters,
    clearFilter,
    clearAllFilters,
    setSort,
    setPage,
    initTimeWindowFromUrl
  }
}



