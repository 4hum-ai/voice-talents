<template>
  <ItemListTemplate
    :module-name="module"
    :ui-config="uiConfig"
    :data="items"
    :loading="loading"
    :error="error"
    :current-page="pagination.page"
    :total-pages="pagination.totalPages"
    :total-items="pagination.total"
    :per-page="pagination.limit"
    :active-filters="filterChips"
    @page-change="load"
    @load-more="onLoadMore"
    @filters-change="onFiltersChange"
    @clear-filter="onClearFilter"
    @clear-all-filters="onClearAllFilters"
    @sort="onSort"
    @action="onAction"
    @bulk-delete="onBulkDelete"
  />
</template>

<script setup lang="ts">
defineOptions({ name: 'ItemListView' })
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import ItemListTemplate from '@/components/templates/ItemListTemplate.vue'
import { useMovieService, type PaginatedResponse } from '@/composables/useMovieService'
import { computeDateRange } from '@/utils/date'
const movie = useMovieService()

const route = useRoute()
const router = useRouter()
const module = computed(() => {
  const metaModule = route.meta?.module as string | undefined
  if (metaModule) return metaModule
  const paramModule = route.params?.module as string | undefined
  if (paramModule) return paramModule
  return String(route.query.module)
})

const uiConfig = ref<any | null>(null)

const items = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const pagination = ref({ page: 1, limit: 20, total: 0, totalPages: 1 })
const timeWindow = ref<{ preset?: string; from?: string; to?: string }>({})
let currentAbort: AbortController | null = null

// Debounced reload when canonical query changes

const filterChips = computed<{ key:string; label:string }[]>(() => {
  const chips: { key:string; label:string }[] = []
  const q = route.query
  // Search
  const search = (q.search as string) || ''
  const searchField = (q.searchField as string) || (q.searchFields as string) || ''
  if (search) chips.push({ key: 'search', label: searchField ? `Search ${searchField}: ${search}` : `Search: ${search}` })
  // Date filters from backend-style
  const dateField = uiConfig.value?.views?.calendar?.dateField || 'createdAt'
  const betweenKey = `filters[${dateField}][$between]`
  const gteKey = `filters[${dateField}][$gte]`
  const lteKey = `filters[${dateField}][$lte]`
  if (q[betweenKey]) chips.push({ key: betweenKey, label: `${dateField} between ${String(q[betweenKey])}` })
  else {
    if (q[gteKey]) chips.push({ key: gteKey, label: `${dateField} ≥ ${String(q[gteKey])}` })
    if (q[lteKey]) chips.push({ key: lteKey, label: `${dateField} ≤ ${String(q[lteKey])}` })
  }
  return chips
})

async function loadUiConfig() {
  try {
    loading.value = true
    error.value = null
    currentAbort?.abort()
    currentAbort = new AbortController()
    const res = await movie.getModuleUiConfig(module.value, { signal: currentAbort.signal })
    uiConfig.value = res?.config ?? res ?? null
    if (!uiConfig.value) {
      throw new Error('UI configuration not available')
    }
    const pageSize = uiConfig.value?.views?.list?.pageSize
    if (pageSize && typeof pageSize === 'number') {
      pagination.value.limit = pageSize
    }
  } catch (e: any) {
    error.value = e?.message || 'Failed to load UI configuration'
    throw e
  } finally {
    loading.value = false
  }
}

async function load(page = 1) {
  loading.value = true
  error.value = null
  try {
    if (!uiConfig.value) {
      await loadUiConfig()
    }
    const q = route.query
    const search = (q.search as string) || undefined
    const searchField = (q.searchFields as string) || (q.searchField as string) || undefined
    const sortParam = (q.sort as string) || undefined
    const params: Record<string, any> = { page, limit: pagination.value.limit }
    if (search) params.search = search
    if (searchField) params.searchFields = searchField
    if (sortParam) params.sort = sortParam
    // Map time window (preset/from/to) to bracketed date filters
    const { preset, from, to } = timeWindow.value || {}
    const dateField = uiConfig.value?.views?.calendar?.dateField || 'createdAt'
    const range = computeDateRange(preset, from, to)
    if (range) {
      params.filters = params.filters || {}
      if (range.from && range.to) params.filters[dateField] = { $between: [range.from, range.to] }
      else if (range.from) params.filters[dateField] = { $gte: range.from }
      else if (range.to) params.filters[dateField] = { $lte: range.to }
    }
    currentAbort?.abort()
    currentAbort = new AbortController()
    const res: PaginatedResponse<any> = await movie.listModuleItems(module.value, params, currentAbort.signal)
    items.value = res.data
    const p = res.pagination
    pagination.value = {
      page: Number(p.page) || 1,
      limit: Number(p.limit) || 20,
      total: Number(p.total) || 0,
      totalPages: Number(p.totalPages) || Math.max(1, Math.ceil((Number(p.total) || 0) / (Number(p.limit) || 1)))
    }
  } catch (e: any) {
    error.value = e?.message || 'Failed to load data'
  } finally {
    loading.value = false
  }
}
function onSort(field: string, direction: string) {
  try {
    router.replace({ query: { ...route.query, sort: `${field}:${direction}`, page: '1' } })
  } catch {}
}

function onAction(action: string, payload?: any) {
  if (action === 'create') {
    movie.createModuleItem(module.value, payload)
      .then(() => load(pagination.value.page))
      .catch((e: any) => error.value = e?.message || 'Create failed')
    return
  }
  if (action === 'view' && payload) {
    const id = String(payload.id ?? payload._id)
    if (id) router.push({ path: `/${module.value}/${id}` })
  }
}

async function onLoadMore() {
  if (loading.value) return
  if (pagination.value.page >= pagination.value.totalPages) return
  const nextPage = pagination.value.page + 1
  loading.value = true
  try {
    const q = route.query
    const search = (q.search as string) || undefined
    const searchField = (q.searchFields as string) || (q.searchField as string) || undefined
    const sortParam = (q.sort as string) || undefined
    const params: Record<string, any> = { page: nextPage, limit: pagination.value.limit }
    if (search) params.search = search
    if (searchField) params.searchFields = searchField
    if (sortParam) params.sort = sortParam
    // Map time window (preset/from/to) to bracketed date filters
    const { preset, from, to } = timeWindow.value || {}
    const dateField = uiConfig.value?.views?.calendar?.dateField || 'createdAt'
    const range = computeDateRange(preset, from, to)
    if (range) {
      params.filters = params.filters || {}
      if (range.from && range.to) params.filters[dateField] = { $between: [range.from, range.to] }
      else if (range.from) params.filters[dateField] = { $gte: range.from }
      else if (range.to) params.filters[dateField] = { $lte: range.to }
    }
    currentAbort?.abort()
    currentAbort = new AbortController()
    const res: PaginatedResponse<any> = await movie.listModuleItems(module.value, params, currentAbort.signal)
    items.value = items.value.concat(res.data)
    const p = res.pagination
    pagination.value = {
      page: Number(p.page) || nextPage,
      limit: Number(p.limit) || pagination.value.limit,
      total: Number(p.total) || pagination.value.total,
      totalPages: Number(p.totalPages) || pagination.value.totalPages
    }
  } catch (e: any) {
    error.value = e?.message || 'Failed to load more'
  } finally {
    loading.value = false
  }
}

function onFiltersChange(payload: { preset?: string; from?: string; to?: string }) {
  timeWindow.value = { ...payload }
  // Sync to URL for shareable state
  try {
    const nextQuery: Record<string, any> = { ...route.query }
    // Remove legacy params
    delete nextQuery.preset; delete nextQuery.from; delete nextQuery.to
    // Remove previous date filter keys for the target field
    const dateField = uiConfig.value?.views?.calendar?.dateField || 'createdAt'
    const keysToRemove: string[] = []
    for (const k of Object.keys(nextQuery)) {
      if (k === `filters[${dateField}][$between]` || k === `filters[${dateField}][$gte]` || k === `filters[${dateField}][$lte]`) keysToRemove.push(k)
    }
    for (const k of keysToRemove) delete nextQuery[k]
    // Compute range and write backend-style filters into URL
    const range = computeDateRange(payload.preset, payload.from, payload.to)
    if (range?.from && range?.to) nextQuery[`filters[${dateField}][$between]`] = `${range.from},${range.to}`
    else if (range?.from) nextQuery[`filters[${dateField}][$gte]`] = range.from
    else if (range?.to) nextQuery[`filters[${dateField}][$lte]`] = range.to
    router.replace({ query: nextQuery })
  } catch {}
  load(1)
}

function onClearFilter(key: string) {
  const nextQuery: Record<string, any> = { ...route.query }
  delete nextQuery[key]
  router.replace({ query: nextQuery })
}

function onClearAllFilters() {
  const nextQuery: Record<string, any> = { ...route.query }
  // Remove search and backend date filters
  delete nextQuery.search; delete nextQuery.searchField; delete nextQuery.searchFields
  const dateField = uiConfig.value?.views?.calendar?.dateField || 'createdAt'
  delete nextQuery[`filters[${dateField}][$between]`]
  delete nextQuery[`filters[${dateField}][$gte]`]
  delete nextQuery[`filters[${dateField}][$lte]`]
  router.replace({ query: nextQuery })
}

async function onBulkDelete(ids: (string|number)[]) {
  if (!ids || ids.length === 0) return
  loading.value = true
  error.value = null
  try {
    await Promise.all(ids.map((id) => movie.deleteModuleItem(module.value, String(id))))
    await load(pagination.value.page)
  } catch (e: any) {
    error.value = e?.message || 'Delete failed'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadUiConfig()
  // Initialize time window from URL if present
  try {
    const q = route.query
    const dateField = uiConfig.value?.views?.calendar?.dateField || 'createdAt'
    const betweenKey = `filters[${dateField}][$between]`
    const gteKey = `filters[${dateField}][$gte]`
    const lteKey = `filters[${dateField}][$lte]`
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
  await load(1)
})

// Canonical query watcher (single source of truth)
const canonicalQueryString = computed(() => {
  const q = route.query
  const sort = String(q.sort || '')
  const search = String(q.search || '')
  const searchField = String(q.searchField || q.searchFields || '')
  const dateField = uiConfig.value?.views?.calendar?.dateField || 'createdAt'
  const betweenKey = `filters[${dateField}][$between]`
  const gteKey = `filters[${dateField}][$gte]`
  const lteKey = `filters[${dateField}][$lte]`
  const between = q[betweenKey] ? String(q[betweenKey]) : ''
  const gte = q[gteKey] ? String(q[gteKey]) : ''
  const lte = q[lteKey] ? String(q[lteKey]) : ''
  const mod = String(module.value)
  return JSON.stringify({ mod, sort, search, searchField, between, gte, lte })
})

watchDebounced(
  canonicalQueryString,
  () => { if (uiConfig.value) load(1) },
  { debounce: 120, maxWait: 300 }
)

watch(module, async () => {
  uiConfig.value = null
  items.value = []
  pagination.value = { page: 1, limit: 20, total: 0, totalPages: 1 }
  await loadUiConfig()
  await load(1)
})

onBeforeUnmount(() => { currentAbort?.abort(); })
</script>


