<template>
  <div v-if="!uiConfig" class="p-6 text-sm text-gray-600 dark:text-gray-300">
    UI configuration not available.
  </div>
  <div v-else class="min-h-screen">
    <!-- Shared AppBar with search, layout switching, and create actions -->
    <AppBar :loading="loading" :show-back="true" @back="router.back()">
      <template #left>
        <div class="min-w-0">
          <div class="truncate text-base font-semibold text-gray-900 dark:text-gray-100">
            {{ uiConfig?.displayName || resource }}
          </div>
          <div class="truncate text-xs text-gray-500 dark:text-gray-400">
            {{ uiConfig?.description }}
          </div>
        </div>
      </template>
      <template #actions>
        <template v-if="!isSearchOpen">
          <button
            v-if="hasCreateAction"
            class="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 hidden items-center rounded-md px-3 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none sm:inline-flex"
            @click="openCreate"
          >
            + Add
          </button>
          <IconButton v-if="hasCreateAction" aria-label="Add" @click="openCreate">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                d="M12 6.75a.75.75 0 01.75.75v3.75H16.5a.75.75 0 010 1.5h-3.75V16.5a.75.75 0 01-1.5 0v-3.75H7.5a.75.75 0 010-1.5h3.75V7.5A.75.75 0 0112 6.75z"
              />
            </svg>
          </IconButton>
          <IconButton aria-label="Search" @click="openSearch">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 104.243 11.93l3.788 3.789a.75.75 0 101.06-1.06l-3.788-3.79A6.75 6.75 0 0010.5 3.75zm-5.25 6.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0z"
                clip-rule="evenodd"
              />
            </svg>
          </IconButton>
          <ActionsMenu :items="layoutMenuItems" size="md" @select="handleLayoutSelect">
            <template #label>
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path
                  d="M3 5.25A2.25 2.25 0 015.25 3h4.5A2.25 2.25 0 0112 5.25v4.5A2.25 2.25 0 019.75 12h-4.5A2.25 2.25 0 013 9.75v-4.5zM12 14.25A2.25 2.25 0 0114.25 12h4.5A2.25 2.25 0 0121 14.25v4.5A2.25 2.25 0 0118.75 21h-4.5A2.25 2.25 0 013 18.75v-4.5zM3 14.25A2.25 2.25 0 015.25 12h4.5A2.25 2.25 0 0121 14.25v4.5A2.25 2.25 0 019.75 21h-4.5A2.25 2.25 0 013 18.75v-4.5zM14.25 3A2.25 2.25 0 0012 5.25v4.5A2.25 2.25 0 0014.25 12h4.5A2.25 2.25 0 0121 9.75v-4.5A2.25 2.25 0 0018.75 3h-4.5z"
                />
              </svg>
            </template>
          </ActionsMenu>
        </template>
        <template v-else>
          <div class="flex min-w-0 flex-1 items-center gap-2">
            <SearchInput
              ref="searchInputRef"
              v-model="searchQuery"
              :placeholder="`Search ${resource}...`"
              @update:model-value="handleSearchInputDebounced"
            />
            <div class="hidden items-center gap-2 sm:flex">
              <div class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <label class="text-xs text-gray-500 dark:text-gray-400">Fields</label>
                <select
                  v-model="selectedSearchField"
                  class="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  @change="handleSearchInput"
                >
                  <option value="all">All fields</option>
                  <option v-for="f in searchableFieldOptions" :key="f.key" :value="f.key">
                    {{ f.label }}
                  </option>
                </select>
              </div>
              <button
                v-if="currentView !== 'calendar'"
                class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-600 dark:focus:ring-offset-gray-900"
                @click="openFilters"
              >
                Filters
              </button>
            </div>
          </div>
          <IconButton aria-label="Close search" @click="closeSearch">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M6.225 4.811a.75.75 0 011.06 0L12 9.525l4.715-4.714a.75.75 0 111.06 1.06L13.06 10.586l4.715 4.714a.75.75 0 11-1.06 1.06L12 11.646l-4.715 4.714a.75.75 0 11-1.06-1.06l4.714-4.714-4.714-4.715a.75.75 0 010-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </IconButton>
        </template>
      </template>
    </AppBar>

    <!-- Spacer to offset the fixed app bar height -->
    <div class="h-16" />

    <main class="space-y-10 p-4">
      <!-- Active filters display -->
      <div
        v-if="filterChips && filterChips.length > 0"
        class="mb-3 flex flex-wrap items-center gap-2"
      >
        <Chip
          v-for="chip in filterChips"
          :key="chip.key"
          :label="chip.label"
          closable
          @close="() => onClearFilter(chip.key)"
        />
        <button
          class="rounded-full border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          @click="onClearAllFilters"
        >
          Clear all
        </button>
      </div>

      <!-- View-specific content -->
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
        @page-change="onPageChange"
        @per-page-change="onPerPageChange"
        @sort="onSort"
        @item-click="(item: unknown) => onAction('view', item)"
      />
      <GalleryTemplate
        v-else-if="currentView === 'gallery' && uiConfig?.views?.gallery"
        :data="items"
        :config="uiConfig.views.gallery"
        :has-more="hasMore"
        :resource-name="resource"
        :ui-config="uiConfig"
        :loading="loading"
        @load-more="onLoadMore"
        @sort="onSort"
        @item-click="(item: unknown) => onAction('view', item)"
      />
      <KanbanTemplate
        v-else-if="currentView === 'kanban' && uiConfig?.views?.kanban"
        :data="items"
        :config="uiConfig.views.kanban"
        :resource-name="resource"
        :ui-config="uiConfig"
        :loading="loading"
        @item-click="(item: unknown) => onAction('view', item)"
        @status-change="
          (payload: { item: DataItem; from: string; to: string }) => onKanbanStatusChange(payload)
        "
      />
      <CalendarTemplate
        v-else-if="currentView === 'calendar' && uiConfig?.views?.calendar"
        :data="items"
        :config="uiConfig.views.calendar"
        :resource-name="resource"
        :ui-config="uiConfig"
        :loading="loading"
        @item-click="(item: unknown) => onAction('view', item)"
      />
      <div v-else class="p-6 text-sm text-gray-600 dark:text-gray-300">
        Selected view not available for this resource.
      </div>
    </main>

    <!-- Shared Form Sidebar -->
    <DynamicFormSidebar
      v-if="showFormSidebar"
      :title="formSidebarTitle"
      :form-config="uiConfig?.formView"
      :initial-data="formSidebarData"
      :loading="formSidebarLoading"
      :submit-text="formSidebarSubmitText"
      :loading-text="formSidebarLoadingText"
      @close="closeFormSidebar"
      @submit="handleFormSubmit"
    />

    <!-- Shared Filter Sidebar -->
    <FilterSidebar
      v-if="currentView !== 'calendar'"
      :show="showFilterSidebar"
      title="Filters"
      @close="closeFilters"
      @clear="clearFilters"
      @apply="applyFilters"
    >
      <div class="space-y-4">
        <div>
          <label class="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400"
            >Time window</label
          >
          <TimeWindowPicker
            :preset="filterPreset"
            :from="filterFrom"
            :to="filterTo"
            @change="onTimeWindowChange"
          />
        </div>
        <div v-for="f in listFilters" :key="f.field" class="space-y-1">
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">{{
            f.label
          }}</label>
          <template v-if="f.type === 'number'">
            <div class="flex items-center gap-2">
              <input
                type="number"
                :value="(localFilterValues[f.field] as { min?: number })?.min ?? ''"
                placeholder="Min"
                class="w-1/2 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                @input="onLocalNumberChange(f.field, 'min', $event)"
              />
              <input
                type="number"
                :value="(localFilterValues[f.field] as { max?: number })?.max ?? ''"
                placeholder="Max"
                class="w-1/2 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                @input="onLocalNumberChange(f.field, 'max', $event)"
              />
            </div>
          </template>
          <template v-else-if="f.type === 'select'">
            <select
              :value="(localFilterValues[f.field] as { value?: string })?.value ?? ''"
              class="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              @change="onLocalValueChange(f.field, $event)"
            >
              <option value="">Any</option>
              <option
                v-for="opt in f.options || []"
                :key="String(opt.value)"
                :value="String(opt.value)"
              >
                {{ opt.label }}
              </option>
            </select>
          </template>
          <template v-else-if="f.type === 'boolean'">
            <select
              :value="(localFilterValues[f.field] as { value?: string })?.value ?? ''"
              class="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              @change="onLocalValueChange(f.field, $event)"
            >
              <option value="">Any</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </template>
          <template v-else-if="f.type === 'date'">
            <DateRangeInput
              :from="(localFilterValues[f.field] as { from?: string })?.from ?? ''"
              :to="(localFilterValues[f.field] as { to?: string })?.to ?? ''"
              @update:from="(value) => onLocalDateChange(f.field, 'from', value)"
              @update:to="(value) => onLocalDateChange(f.field, 'to', value)"
            />
          </template>
        </div>
      </div>
    </FilterSidebar>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ItemListView' })
import { ref, onMounted, computed, watch, onBeforeUnmount, onActivated } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { useRoute, useRouter, type LocationQuery } from 'vue-router'
import TableTemplate from '@/components/templates/TableTemplate.vue'
import GalleryTemplate from '@/components/templates/GalleryTemplate.vue'
import KanbanTemplate from '@/components/templates/KanbanTemplate.vue'
import CalendarTemplate from '@/components/templates/CalendarTemplate.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import ActionsMenu from '@/components/atoms/ActionsMenu.vue'
import SearchInput from '@/components/atoms/SearchInput.vue'
import IconButton from '@/components/atoms/IconButton.vue'
import Chip from '@/components/atoms/Chip.vue'
import DynamicFormSidebar from '@/components/molecules/DynamicFormSidebar.vue'
import FilterSidebar from '@/components/molecules/FilterSidebar.vue'
import TimeWindowPicker from '@/components/molecules/TimeWindowPicker.vue'
import DateRangeInput from '@/components/atoms/DateRangeInput.vue'
import { useResourceService, type PaginatedResult } from '@/composables/useResourceService'
import { useUiConfig } from '@/composables/useUiConfig'
import { useQueryBuilder } from '@/composables/useQueryBuilder'
import type { FilterConfig, UiConfig, ColumnConfig } from '@/types/ui-config'
import { usePreference } from '@/composables/usePreference'
import { useStaleStore } from '@/stores/stale'
import { DataItem, ActionArray, FilterPreset } from '@/types/common'

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

// Shared search functionality
const isSearchOpen = ref(false)
const searchQuery = ref('')
const selectedSearchField = ref<'all' | string>('all')
const searchInputRef = ref<HTMLInputElement | null>(null)

function openSearch() {
  isSearchOpen.value = true
  setTimeout(() => searchInputRef.value?.focus(), 0)
}

function closeSearch() {
  isSearchOpen.value = false
}

function handleSearchInput() {
  const search = searchQuery.value?.trim() || ''
  const field = selectedSearchField.value !== 'all' ? selectedSearchField.value : undefined
  const nextQuery: LocationQuery = { ...route.query, page: '1' }
  if (search) nextQuery.search = search
  else delete nextQuery.search
  if (field) nextQuery.searchField = field
  else delete nextQuery.searchField
  router.replace({ query: nextQuery }).catch(() => {})
}

let searchDebounceTimer: number | undefined
function handleSearchInputDebounced() {
  if (searchDebounceTimer) window.clearTimeout(searchDebounceTimer)
  searchDebounceTimer = window.setTimeout(() => handleSearchInput(), 300)
}

// Shared layout switching
const layoutMenuItems = computed(() => [
  { key: 'list', label: 'Table' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'kanban', label: 'Kanban' },
])

function handleLayoutSelect(key: string) {
  if (!['list', 'gallery', 'calendar', 'kanban'].includes(key)) return
  const nextQuery: LocationQuery = { view: key }
  router.replace({ query: nextQuery }).catch(() => {})
}

// Shared searchable field options
const searchableFieldOptions = computed<{ key: string; label: string }[]>(() => {
  const cfg = uiConfig.value
  if (!cfg?.views?.list) return []
  const explicit = cfg.views.list.searchableFields as string[] | undefined
  const columns = (cfg.views.list.columns || []) as ColumnConfig[]
  const fromColumns = columns
    .filter((c: ColumnConfig) => c?.type === 'text' || c?.type === 'url' || c?.searchable === true)
    .map((c) => ({ key: String(c.key), label: String(c.label || c.key) }))
  const fromExplicit = (explicit || []).map((k) => {
    const col = columns.find((c) => c.key === k)
    return { key: String(k), label: String(col?.label || k) }
  })
  const merged: Record<string, { key: string; label: string }> = {}
  for (const f of [...fromColumns, ...fromExplicit]) merged[f.key] = f
  return Object.values(merged)
})

// Shared create action logic
const hasCreateAction = computed(() => {
  const actions = uiConfig.value?.views?.list?.actions as ActionArray | undefined
  return Array.isArray(actions) && actions.some((a) => (a as { name?: string })?.name === 'create')
})

// Shared form sidebar
const showFormSidebar = ref(false)
const formSidebarTitle = ref('Add New')
const formSidebarData = ref<Record<string, unknown>>({})
const formSidebarLoading = ref(false)
const formSidebarSubmitText = ref('Create')
const formSidebarLoadingText = ref('Creating...')

function openCreate() {
  showFormSidebar.value = true
}

function closeFormSidebar() {
  showFormSidebar.value = false
  formSidebarData.value = {}
}

function handleFormSubmit(data: Record<string, unknown>) {
  onAction('create', data)
  closeFormSidebar()
}

// Shared filter sidebar
const showFilterSidebar = ref(false)
const filterPreset = ref<FilterPreset>('all')
const filterFrom = ref<string | undefined>(undefined)
const filterTo = ref<string | undefined>(undefined)
const listFilters = computed<FilterConfig[]>(
  () => uiConfig.value?.views?.list?.defaultFilters || [],
)
const localFilterValues = ref<Record<string, unknown>>({})

function openFilters() {
  syncFiltersFromQuery()
  showFilterSidebar.value = true
}

function closeFilters() {
  showFilterSidebar.value = false
}

function clearFilters() {
  filterPreset.value = 'all'
  filterFrom.value = undefined
  filterTo.value = undefined
}

function onTimeWindowChange(payload: { preset?: FilterPreset; from?: string; to?: string }) {
  if (payload.preset) filterPreset.value = payload.preset
  if (payload.from !== undefined) filterFrom.value = payload.from
  if (payload.to !== undefined) filterTo.value = payload.to
}

function onLocalValueChange(field: string, e: Event) {
  const value = (e.target as HTMLSelectElement).value
  localFilterValues.value[field] = {
    ...(localFilterValues.value[field] || {}),
    value,
  }
}

function onLocalNumberChange(field: string, key: 'min' | 'max', e: Event) {
  const raw = (e.target as HTMLInputElement).value
  const value = raw === '' ? undefined : Number(raw)
  localFilterValues.value[field] = {
    ...(localFilterValues.value[field] || {}),
    [key]: value,
  }
}

function onLocalDateChange(field: string, key: 'from' | 'to', value: string) {
  localFilterValues.value[field] = {
    ...(localFilterValues.value[field] || {}),
    [key]: value,
  }
}

function syncFiltersFromQuery() {
  try {
    const q = route.query
    // Time window
    const dateField = uiConfig.value?.views?.calendar?.dateField || 'createdAt'
    const betweenKey = `filters[${dateField}][$between]`
    const gteKey = `filters[${dateField}][$gte]`
    const lteKey = `filters[${dateField}][$lte]`
    let from: string | undefined
    let to: string | undefined
    if (q[betweenKey]) {
      const val = String(q[betweenKey])
      const [a, b] = val.split(',').map((s) => s.trim())
      from = a || undefined
      to = b || undefined
    } else {
      if (q[gteKey]) from = String(q[gteKey])
      if (q[lteKey]) to = String(q[lteKey])
    }
    filterPreset.value = from || to ? 'custom' : 'all'
    filterFrom.value = from
    filterTo.value = to
    // Field filters
    const next: Record<string, unknown> = {}
    for (const f of listFilters.value as FilterConfig[]) {
      const base = `filters[${f.field}]`
      const eq = q[base]
      const b = q[`${base}[$between]`]
      const gte = q[`${base}[$gte]`]
      const lte = q[`${base}[$lte]`]
      if (f.type === 'number') {
        if (b) {
          const [min, max] = String(b).split(',')
          next[f.field] = {
            min: min !== undefined ? Number(min) : undefined,
            max: max !== undefined ? Number(max) : undefined,
          }
        } else if (gte || lte) {
          next[f.field] = {
            min: gte !== undefined ? Number(gte) : undefined,
            max: lte !== undefined ? Number(lte) : undefined,
          }
        }
      } else if (f.type === 'select' || f.type === 'boolean') {
        if (eq !== undefined) next[f.field] = { value: String(eq) }
      } else if (f.type === 'date') {
        if (b) {
          const [fromD, toD] = String(b).split(',')
          next[f.field] = { from: fromD, to: toD }
        } else if (gte || lte) {
          next[f.field] = { from: gte || '', to: lte || '' }
        }
      }
    }
    localFilterValues.value = next
  } catch {
    void 0
  }
}

function applyFilters() {
  const payload: Record<string, unknown> = {
    preset: filterPreset.value,
    from: filterFrom.value,
    to: filterTo.value,
  }
  const filters: Record<string, unknown> = {}
  for (const f of listFilters.value as FilterConfig[]) {
    const v = localFilterValues.value[f.field] as Record<string, unknown>
    if (!v) continue
    if (f.type === 'number') {
      const min = v.min
      const max = v.max
      if (typeof min === 'number' && !isNaN(min) && typeof max === 'number' && !isNaN(max))
        filters[f.field] = { $between: [min, max] }
      else if (typeof min === 'number' && !isNaN(min)) filters[f.field] = { $gte: min }
      else if (typeof max === 'number' && !isNaN(max)) filters[f.field] = { $lte: max }
    } else if (f.type === 'select') {
      const value = v.value
      if (value !== '' && value !== undefined) filters[f.field] = value
    } else if (f.type === 'boolean') {
      const value = v.value
      if (value === 'true') filters[f.field] = true
      if (value === 'false') filters[f.field] = false
    } else if (f.type === 'date') {
      const from = v.from || undefined
      const to = v.to || undefined
      if (from && to) filters[f.field] = { $between: [from, to] }
      else if (from) filters[f.field] = { $gte: from }
      else if (to) filters[f.field] = { $lte: to }
    }
  }
  if (Object.keys(filters).length > 0) payload.filters = filters
  onFiltersChange(payload)
  closeFilters()
}

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

async function onKanbanStatusChange(payload: { item: unknown; from: string; to: string }) {
  try {
    const groupByField = uiConfig.value?.views?.kanban?.groupByField
    const id = String((payload?.item as DataItem)?.id ?? '')
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
  syncFiltersFromQuery()
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
  syncFiltersFromQuery()
  if (currentView.value === 'calendar') {
    if (String(route.query.view || '') !== 'calendar') {
      router.replace({ query: { ...route.query, view: 'calendar' } }).catch(() => {})
    }
    return
  }
  await load(1)
})

watch(
  () => route.query,
  () => {
    syncFiltersFromQuery()
  },
)

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
