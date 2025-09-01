<template>
  <div v-if="!uiConfig" class="p-6 text-sm text-gray-600 dark:text-gray-300">
    UI configuration not available.
  </div>
  <div v-else>
    <TableTemplate
      v-if="currentView === 'list' && uiConfig?.views?.list"
      :data="items"
      :config="uiConfig.views.list"
      :current-page="pagination.page"
      :total-pages="pagination.totalPages"
      :total="pagination.total"
      :per-page="pagination.limit"
      :resource-name="resource"
      :ui-config="uiConfig"
      :loading="loading"
      :active-filters="filterChips"
      @page-change="onPageChange"
      @per-page-change="onPerPageChange"
      @sort="onSort"
      @item-click="(item: unknown) => onAction('view', item)"
      @filters-change="onFiltersChange"
      @clear-filter="onClearFilter"
      @clear-all-filters="onClearAllFilters"
    />
    <GalleryTemplate
      v-else-if="currentView === 'gallery' && uiConfig?.views?.gallery"
      :data="items"
      :config="uiConfig.views.gallery"
      :has-more="hasMore"
      :resource-name="resource"
      :ui-config="uiConfig"
      :loading="loading"
      :active-filters="filterChips"
      @load-more="onLoadMore"
      @sort="onSort"
      @item-click="(item: unknown) => onAction('view', item)"
      @filters-change="onFiltersChange"
      @clear-filter="onClearFilter"
      @clear-all-filters="onClearAllFilters"
    />
    <KanbanTemplate
      v-else-if="currentView === 'kanban' && uiConfig?.views?.kanban"
      :data="items"
      :config="uiConfig.views.kanban"
      :resource-name="resource"
      :ui-config="uiConfig"
      :loading="loading"
      :active-filters="filterChips"
      @item-click="(item: unknown) => onAction('view', item)"
      @status-change="(payload) => onKanbanStatusChange(payload as any)"
      @filters-change="onFiltersChange"
      @clear-filter="onClearFilter"
      @clear-all-filters="onClearAllFilters"
    />
    <CalendarTemplate
      v-else-if="currentView === 'calendar' && uiConfig?.views?.calendar"
      :data="items"
      :config="uiConfig.views.calendar"
      :resource-name="resource"
      :ui-config="uiConfig"
      :loading="loading"
      @item-click="(item: unknown) => onAction('view', item)"
      @filters-change="onFiltersChange"
    />
    <div v-else class="p-6 text-sm text-gray-600 dark:text-gray-300">
      Selected view not available for this resource.
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ItemListView' })
import { ref, onMounted, computed, watch, onBeforeUnmount, onActivated } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import TableTemplate from '@/components/templates/TableTemplate.vue'
import GalleryTemplate from '@/components/templates/GalleryTemplate.vue'
import KanbanTemplate from '@/components/templates/KanbanTemplate.vue'
import CalendarTemplate from '@/components/templates/CalendarTemplate.vue'
import { useResourceService, type PaginatedResult } from '@/composables/useResourceService'
import { useUiConfig } from '@/composables/useUiConfig'
import { useQueryBuilder } from '@/composables/useQueryBuilder'
import type { FilterConfig, UiConfig } from '@/types/ui-config'
import { usePreference } from '@/composables/usePreference'
import { useStaleStore } from '@/stores/stale'
import { DataItem } from '@/types/common'

type ViewType = 'list' | 'gallery' | 'kanban' | 'calendar'

const api = useResourceService()

const route = useRoute()
const router = useRouter()
const stale = useStaleStore()
const resource = computed(() => {
  const metaResource = route.meta?.module as string | undefined
  if (metaResource) return metaResource
  const paramResource = route.params?.module as string | undefined
  if (paramResource) return paramResource
  const queryResource = route.query.module as string | undefined
  return queryResource ? String(queryResource) : ''
})
const viewPrefKey = computed(() => `${resource.value}-list-view`)
const viewPref = computed(() => usePreference(viewPrefKey.value))

const { get: getUiConfig } = useUiConfig()
const uiConfig = ref<UiConfig | null>(null)

const items = ref<DataItem[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const pagination = ref({ page: 1, limit: 20, total: 0, totalPages: 1 })
let currentAbort: AbortController | null = null

// View selection (from query ?view=list|gallery|kanban|calendar)
const currentView = computed<ViewType>(() => {
  let v = String(route.query.view || '').toLowerCase()
  if (!v) {
    const saved = viewPref.value.get()
    if (saved === 'gallery' || saved === 'kanban' || saved === 'calendar') v = saved
  }
  if (!v) v = 'list'
  return v === 'gallery' || v === 'kanban' || v === 'calendar'
    ? (v as 'gallery' | 'kanban' | 'calendar')
    : 'list'
})
const hasMore = computed(() => pagination.value.page < pagination.value.totalPages)

// Debounced reload when canonical query changes

// Query builder (search, sort, pagination, date filters)
const qb = useQueryBuilder({
  resource: () => String(resource.value),
  uiConfig: () => uiConfig.value,
  defaultLimit: 20,
})
const filterChips = computed<{ key: string; label: string }[]>(() => {
  const chips: { key: string; label: string }[] = []
  const q = route.query
  const search = (q.search as string) || ''
  const searchField = (q.searchField as string) || (q.searchFields as string) || ''
  if (search)
    chips.push({
      key: 'search',
      label: searchField ? `Search ${searchField}: ${search}` : `Search: ${search}`,
    })
  const dateField = uiConfig.value?.views?.calendar?.dateField || 'createdAt'
  const betweenKey = `filters[${dateField}][$between]`
  const gteKey = `filters[${dateField}][$gte]`
  const lteKey = `filters[${dateField}][$lte]`
  if (q[betweenKey])
    chips.push({
      key: betweenKey,
      label: `${dateField} between ${String(q[betweenKey])}`,
    })
  else {
    if (q[gteKey]) chips.push({ key: gteKey, label: `${dateField} ≥ ${String(q[gteKey])}` })
    if (q[lteKey]) chips.push({ key: lteKey, label: `${dateField} ≤ ${String(q[lteKey])}` })
  }
  // Generic default filters from uiConfig
  const filters = uiConfig.value?.views?.list?.defaultFilters || []
  for (const f of filters as FilterConfig[]) {
    const filterConfig = f
    const base = `filters[${filterConfig.field}]`
    const eq = q[base]
    const b = q[`${base}[$between]`]
    const gte = q[`${base}[$gte]`]
    const lte = q[`${base}[$lte]`]
    if (eq !== undefined) {
      let valLabel = String(eq)
      if (f.options && Array.isArray(f.options)) {
        const found = f.options?.find(
          (o: unknown) => String((o as { value?: unknown })?.value) === String(eq),
        )
        if (found) valLabel = String(found.label)
      }
      chips.push({ key: base, label: `${filterConfig.label}: ${valLabel}` })
      continue
    }
    if (b) {
      chips.push({
        key: `${base}[$between]`,
        label: `${filterConfig.label} between ${String(b)}`,
      })
      continue
    }
    if (gte)
      chips.push({
        key: `${base}[$gte]`,
        label: `${filterConfig.label} ≥ ${String(gte)}`,
      })
    if (lte)
      chips.push({
        key: `${base}[$lte]`,
        label: `${filterConfig.label} ≤ ${String(lte)}`,
      })
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
    if (!resource.value) return
    uiConfig.value = await getUiConfig(resource.value, {
      signal: currentAbort.signal,
    })
    if (!uiConfig.value) {
      throw new Error('UI configuration not available')
    }
    const pageSize = uiConfig.value?.views?.list?.pageSize
    if (pageSize && typeof pageSize === 'number') {
      pagination.value.limit = pageSize
    }
  } catch (e: unknown) {
    error.value = (e as Error)?.message || 'Failed to load UI configuration'
    // Do not rethrow to avoid breaking navigation/view rendering
  } finally {
    loading.value = false
  }
}

async function load(page = 1) {
  loading.value = true
  error.value = null
  try {
    if (!resource.value) return
    if (!uiConfig.value) {
      await loadUiConfig()
    }
    const qs = qb.queryState.value
    const params: Record<string, unknown> = {
      page,
      limit: qs.limit || qb.limit.value,
    }
    if (qs.search) params.search = qs.search
    if (qs.searchField) params.searchFields = qs.searchField
    if (qs.sort) params.sort = qs.sort
    if (qs.filters) params.filters = qs.filters
    currentAbort?.abort()
    currentAbort = new AbortController()
    const res: PaginatedResult<DataItem> = await api.list(
      resource.value,
      params,
      currentAbort.signal,
    )
    items.value = res.data
    const p = res.pagination
    pagination.value = {
      page: Number(p.page) || 1,
      limit: Number(p.limit) || 20,
      total: Number(p.total) || 0,
      totalPages:
        Number(p.totalPages) ||
        Math.max(1, Math.ceil((Number(p.total) || 0) / (Number(p.limit) || 1))),
    }
  } catch (e: unknown) {
    error.value = (e as Error)?.message || 'Failed to load data'
  } finally {
    loading.value = false
  }
}
function onSort(field: string, direction: string) {
  const current = String((route.query.sort as string) || '')
  const next = `${field}:${direction}`
  if (current === next) return
  qb.setSort(field, direction)
}

function onPageChange(page: number) {
  qb.setPage(page)
}

function onPerPageChange(perPage: number) {
  qb.setLimit(perPage)
}

function onAction(action: string, payload?: unknown) {
  if (action === 'create') {
    api
      .create(resource.value, payload)
      .then(() => load(pagination.value.page))
      .catch((e: unknown) => (error.value = (e as Error)?.message || 'Create failed'))
    return
  }
  if (action === 'view' && payload) {
    const id = String(
      (payload as { id?: unknown; _id?: unknown }).id ?? (payload as { _id?: unknown })._id,
    )
    if (id) router.push({ path: `/${resource.value}/${id}` })
  }
}

async function onKanbanStatusChange(payload: { item: DataItem; from: string; to: string }) {
  try {
    const groupByField = uiConfig.value?.views?.kanban?.groupByField
    const id = String(payload?.item?.id ?? '')
    if (!groupByField || !id) return
    await api.update(resource.value, id, {
      [groupByField]: payload.to,
    })
    await load(pagination.value.page)
  } catch {
    // ignore; error surfaced by caller via existing error handling if needed
  }
}

async function onLoadMore() {
  if (loading.value) return
  if (pagination.value.page >= pagination.value.totalPages) return
  const nextPage = pagination.value.page + 1
  loading.value = true
  try {
    const qs = qb.queryState.value
    const params: Record<string, unknown> = {
      page: nextPage,
      limit: qs.limit || qb.limit.value,
    }
    if (qs.search) params.search = qs.search
    if (qs.searchField) params.searchFields = qs.searchField
    if (qs.sort) params.sort = qs.sort
    if (qs.filters) params.filters = qs.filters
    currentAbort?.abort()
    currentAbort = new AbortController()
    const res: PaginatedResult<DataItem> = await api.list(
      resource.value,
      params,
      currentAbort.signal,
    )
    items.value = items.value.concat(res.data)
    const p = res.pagination
    pagination.value = {
      page: Number(p.page) || nextPage,
      limit: Number(p.limit) || pagination.value.limit,
      total: Number(p.total) || pagination.value.total,
      totalPages: Number(p.totalPages) || pagination.value.totalPages,
    }
  } catch (e: unknown) {
    error.value = (e as Error)?.message || 'Failed to load more'
  } finally {
    loading.value = false
  }
}

function onFiltersChange(payload: {
  preset?: string
  from?: string
  to?: string
  filters?: Record<string, unknown>
}) {
  qb.applyFilters(payload)
}

function onClearFilter(key: string) {
  qb.clearFilter(key)
}

function onClearAllFilters() {
  qb.clearAllFilters()
}

// bulk delete not used in this view currently; remove to satisfy type-check

onMounted(async () => {
  if (!resource.value) return
  await loadUiConfig()
  qb.initTimeWindowFromUrl()
  // For calendar view, let the template emit initial filters which will update the route
  // and trigger the watcher-driven load. Avoid duplicate initial fetch.
  if (currentView.value === 'calendar') {
    // Ensure the route reflects the chosen view for consistency
    if (String(route.query.view || '') !== 'calendar') {
      router.replace({ query: { ...route.query, view: 'calendar' } }).catch(() => {})
    }
    return
  }
  await load(1)
})

// Canonical query watcher (single source of truth)
const canonicalQueryString = qb.canonicalQueryString

watchDebounced(
  canonicalQueryString,
  () => {
    if (uiConfig.value) load(Number(route.query.page || 1) || 1)
  },
  { debounce: 120, maxWait: 300 },
)

watch(resource, async () => {
  uiConfig.value = null
  items.value = []
  pagination.value = { page: 1, limit: 20, total: 0, totalPages: 1 }
  await loadUiConfig()
  qb.initTimeWindowFromUrl()
  if (currentView.value === 'calendar') {
    if (String(route.query.view || '') !== 'calendar') {
      router.replace({ query: { ...route.query, view: 'calendar' } }).catch(() => {})
    }
    return
  }
  await load(1)
})

watch(currentView, (v) => {
  const pref = viewPref.value
  const def = 'list'
  if (!v || v === def) pref.remove()
  else pref.set(v)
})

onBeforeUnmount(() => {
  currentAbort?.abort()
})

// Refresh hook for keep-alive: when returning from detail after delete/update
onActivated(async () => {
  const targetKey = `path:/${resource.value}`
  const isStale = stale.isStale(targetKey)
  if (!isStale) return
  try {
    if (!uiConfig.value) await loadUiConfig()
    await load(Number(route.query.page || 1) || 1)
  } finally {
    stale.consume(targetKey)
  }
})
</script>
