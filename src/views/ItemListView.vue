<template>
  <ItemListTemplate
    v-if="uiConfig"
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
    @page-change="onPageChange"
    @load-more="onLoadMore"
    @filters-change="onFiltersChange"
    @clear-filter="onClearFilter"
    @clear-all-filters="onClearAllFilters"
    @sort="onSort"
    @action="onAction"
    @bulk-delete="onBulkDelete"
  />
  <div v-else class="p-6 text-sm text-gray-600 dark:text-gray-300">UI configuration not available.</div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ItemListView' })
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import ItemListTemplate from '@/components/templates/ItemListTemplate.vue'
import { useMovieService, type PaginatedResponse } from '@/composables/useMovieService'
import { useUiConfig } from '@/composables/useUiConfig'
import { useQueryBuilder } from '@/composables/useQueryBuilder'
import type { UiConfig } from '@/types/ui-config'
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

const { get: getUiConfig } = useUiConfig()
const uiConfig = ref<UiConfig | null>(null)

const items = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const pagination = ref({ page: 1, limit: 20, total: 0, totalPages: 1 })
let currentAbort: AbortController | null = null

// Debounced reload when canonical query changes

// Query builder (search, sort, pagination, date filters)
const qb = useQueryBuilder({ module: () => String(module.value), uiConfig: () => uiConfig.value, defaultLimit: 20 })
const filterChips = computed<{ key:string; label:string }[]>(() => {
  const chips: { key:string; label:string }[] = []
  const q = route.query
  const search = (q.search as string) || ''
  const searchField = (q.searchField as string) || (q.searchFields as string) || ''
  if (search) chips.push({ key: 'search', label: searchField ? `Search ${searchField}: ${search}` : `Search: ${search}` })
  const dateField = uiConfig.value?.views?.calendar?.dateField || 'createdAt'
  const betweenKey = `filters[${dateField}][$between]`
  const gteKey = `filters[${dateField}][$gte]`
  const lteKey = `filters[${dateField}][$lte]`
  if (q[betweenKey]) chips.push({ key: betweenKey, label: `${dateField} between ${String(q[betweenKey])}` })
  else {
    if (q[gteKey]) chips.push({ key: gteKey, label: `${dateField} ≥ ${String(q[gteKey])}` })
    if (q[lteKey]) chips.push({ key: lteKey, label: `${dateField} ≤ ${String(q[lteKey])}` })
  }
  // Generic default filters from uiConfig
  const filters = uiConfig.value?.views?.list?.defaultFilters || []
  for (const f of filters) {
    const base = `filters[${f.field}]`
    const eq = q[base]
    const b = q[`${base}[$between]`]
    const gte = q[`${base}[$gte]`]
    const lte = q[`${base}[$lte]`]
    if (eq !== undefined) {
      let valLabel = String(eq)
      if ((f as any).options && Array.isArray((f as any).options)) {
        const found = (f as any).options.find((o: any) => String(o.value) === String(eq))
        if (found) valLabel = String(found.label)
      }
      chips.push({ key: base, label: `${f.label}: ${valLabel}` })
      continue
    }
    if (b) {
      chips.push({ key: `${base}[$between]`, label: `${f.label} between ${String(b)}` })
      continue
    }
    if (gte) chips.push({ key: `${base}[$gte]`, label: `${f.label} ≥ ${String(gte)}` })
    if (lte) chips.push({ key: `${base}[$lte]`, label: `${f.label} ≤ ${String(lte)}` })
  }
  return chips
})

async function loadUiConfig() {
  try {
    loading.value = true
    error.value = null
    currentAbort?.abort()
    currentAbort = new AbortController()
    // Use composable to resolve from store -> local -> backend
    uiConfig.value = await getUiConfig(module.value, { signal: currentAbort.signal })
    if (!uiConfig.value) {
      throw new Error('UI configuration not available')
    }
    const pageSize = uiConfig.value?.views?.list?.pageSize
    if (pageSize && typeof pageSize === 'number') {
      pagination.value.limit = pageSize
    }
  } catch (e: any) {
    error.value = e?.message || 'Failed to load UI configuration'
    // Do not rethrow to avoid breaking navigation/view rendering
  } finally {
    loading.value = false
    console.log('uiConfig', uiConfig.value)
  }
}

async function load(page = 1) {
  loading.value = true
  error.value = null
  try {
    if (!uiConfig.value) {
      await loadUiConfig()
    }
    const qs = qb.queryState.value
    const params: Record<string, any> = { page, limit: qs.limit || qb.limit.value }
    if (qs.search) params.search = qs.search
    if (qs.searchField) params.searchFields = qs.searchField
    if (qs.sort) params.sort = qs.sort
    if (qs.filters) params.filters = qs.filters
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
function onSort(field: string, direction: string) { qb.setSort(field, direction) }

function onPageChange(page: number) { qb.setPage(page) }

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
    const qs = qb.queryState.value
    const params: Record<string, any> = { page: nextPage, limit: qs.limit || qb.limit.value }
    if (qs.search) params.search = qs.search
    if (qs.searchField) params.searchFields = qs.searchField
    if (qs.sort) params.sort = qs.sort
    if (qs.filters) params.filters = qs.filters
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

function onFiltersChange(payload: { preset?: string; from?: string; to?: string; filters?: Record<string, any> }) {
  if (payload && payload.filters) qb.setFilters(payload.filters)
  qb.setTimeWindow(payload)
}

function onClearFilter(key: string) { qb.clearFilter(key) }

function onClearAllFilters() { qb.clearAllFilters() }

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
  qb.initTimeWindowFromUrl()
  await load(1)
})

// Canonical query watcher (single source of truth)
const canonicalQueryString = qb.canonicalQueryString

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


