<template>
  <div class="min-h-screen">
    <AppBar :loading="loading" :show-back="true" @back="goBack">
      <template #left>
        <template v-if="!isSearchOpen">
          <div class="min-w-0">
            <div class="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
              <slot name="title">{{ uiConfig?.displayName || moduleName }}</slot>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
              <slot name="subtitle">{{ uiConfig?.description }}</slot>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <SearchInput ref="searchInputRef" v-model="searchQuery" @update:modelValue="handleSearchInputDebounced" :placeholder="`Search ${moduleName}...`" />
            <div class="hidden sm:flex items-center gap-2">
              <div class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <label class="text-xs text-gray-500 dark:text-gray-400">Fields</label>
                <select v-model="selectedSearchField" @change="handleSearchInput" class="px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                  <option value="all">All fields</option>
                  <option v-for="f in searchableFieldOptions" :key="f.key" :value="f.key">{{ f.label }}</option>
                </select>
              </div>
              <button @click="openFilters" class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600 dark:focus:ring-offset-gray-900">Filters</button>
            </div>
          </div>
        </template>
      </template>
      <template #actions>
        <template v-if="!isSearchOpen">
          <button
            v-if="hasCreateAction"
            @click="handleAction('create')"
            class="hidden sm:inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            + Add
          </button>
          <button
            v-if="hasCreateAction"
            @click="handleAction('create')"
            class="sm:hidden inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 h-9 w-9 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Add"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 6.75a.75.75 0 01.75.75v3.75H16.5a.75.75 0 010 1.5h-3.75V16.5a.75.75 0 01-1.5 0v-3.75H7.5a.75.75 0 010-1.5h3.75V7.5A.75.75 0 0112 6.75z" />
            </svg>
          </button>
          <button @click="openSearch" class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 h-9 w-9 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700" aria-label="Search">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 104.243 11.93l3.788 3.789a.75.75 0 101.06-1.06l-3.788-3.79A6.75 6.75 0 0010.5 3.75zm-5.25 6.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0z" clip-rule="evenodd" />
            </svg>
          </button>
          <ActionsMenu :items="layoutMenuItems" size="md" @select="handleLayoutSelect">
            <template #label>
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 5.25A2.25 2.25 0 015.25 3h4.5A2.25 2.25 0 0112 5.25v4.5A2.25 2.25 0 019.75 12h-4.5A2.25 2.25 0 013 9.75v-4.5zM12 14.25A2.25 2.25 0 0114.25 12h4.5A2.25 2.25 0 0121 14.25v4.5A2.25 2.25 0 0118.75 21h-4.5A2.25 2.25 0 0112 18.75v-4.5zM3 14.25A2.25 2.25 0 015.25 12h4.5A2.25 2.25 0 0112 14.25v4.5A2.25 2.25 0 019.75 21h-4.5A2.25 2.25 0 013 18.75v-4.5zM14.25 3A2.25 2.25 0 0012 5.25v4.5A2.25 2.25 0 0014.25 12h4.5A2.25 2.25 0 0021 9.75v-4.5A2.25 2.25 0 0018.75 3h-4.5z" />
              </svg>
            </template>
          </ActionsMenu>
        </template>
        <template v-else>
          <button @click="closeSearch" class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 h-9 w-9 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700" aria-label="Close search">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M6.225 4.811a.75.75 0 011.06 0L12 9.525l4.715-4.714a.75.75 0 111.06 1.06L13.06 10.586l4.715 4.714a.75.75 0 11-1.06 1.06L12 11.646l-4.715 4.714a.75.75 0 11-1.06-1.06l4.714-4.714-4.714-4.715a.75.75 0 010-1.06z" clip-rule="evenodd" />
            </svg>
          </button>
        </template>
      </template>
    </AppBar>


    <main class="p-4">
      <!-- Selection toolbar (only when some are selected) -->
      <div v-if="currentView === 'list' && selectedIds.length > 0" class="mb-3 flex items-center gap-2 border-b border-gray-200 pb-2 dark:border-gray-700">
        <div class="text-xs text-gray-600 dark:text-gray-300">{{ selectedIds.length }} selected</div>
        <button @click="handleBulkDelete" class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Delete</button>
      </div>

      <StatsView v-if="uiConfig?.features?.stats" :stats="uiConfig.features.stats" :data="data" />

      <div :style="{ minHeight: contentMinHeight }">
        <div v-if="loading">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-900 dark:border-gray-700">
            <div class="animate-pulse">
              <div class="h-10 bg-gray-100 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"></div>
              <div class="divide-y divide-gray-200 dark:divide-gray-700">
                <div v-for="n in skeletonRows" :key="n" class="h-12 bg-gray-50 dark:bg-gray-800"></div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="error" class="text-sm text-error-600 dark:text-error-400">{{ error }}</div>
        <div v-else>
          <!-- Active filter chips -->
          <div v-if="activeFilters && activeFilters.length > 0" class="mb-3 flex flex-wrap items-center gap-2">
            <Chip v-for="chip in activeFilters" :key="chip.key" :label="chip.label" closable @close="$emit('clear-filter', chip.key)" />
            <button @click="$emit('clear-all-filters')" class="text-xs px-2 py-1 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">Clear all</button>
          </div>

          <TableView v-if="currentView === 'list' && uiConfig?.views?.list && filteredData.length > 0" :key="'view-list'" :data="filteredData" :config="uiConfig.views.list" :current-page="pagination.currentPage" :total-pages="pagination.totalPages" :total="pagination.total" :per-page="pagination.perPage" @page-change="handlePageChange" @action="handleAction" @sort="handleSort" @item-click="handleItemClick" @selection-change="onSelectionChange" />
          <KanbanView v-else-if="currentView === 'kanban' && uiConfig?.views?.kanban && filteredData.length > 0" :key="'view-kanban'" :data="filteredData" :config="uiConfig.views.kanban" @action="handleAction" @item-click="handleItemClick" @status-change="handleKanbanStatusChange" @filters-change="handleKanbanFiltersChange" @sort="handleSort" />
          <GalleryView v-else-if="currentView === 'gallery' && uiConfig?.views?.gallery && filteredData.length > 0" :key="'view-gallery'" :data="filteredData" :config="uiConfig.views.gallery" :has-more="hasMore" @action="handleAction" @item-click="handleItemClick" @load-more="handleLoadMore" @sort="handleSort" />
          <CalendarView v-else-if="currentView === 'calendar' && uiConfig?.views?.calendar && filteredData.length > 0" :key="'view-calendar'" :data="filteredData" :config="uiConfig.views.calendar" @action="handleAction" @item-click="handleItemClick" @filters-change="handleCalendarFiltersChange" />
          <EmptyState v-else-if="filteredData.length === 0" :title="emptyTitle" :subtitle="emptySubtitle">
            <template #actions>
              <button
                v-if="hasCreateAction && !searchQuery"
                @click="handleAction('create')"
                class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Add {{ uiConfig?.displayName }}
              </button>
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600 dark:focus:ring-offset-gray-900"
              >
                Clear search
              </button>
            </template>
          </EmptyState>
        </div>
      </div>

      
    </main>

    <DynamicFormSidebar v-if="showFormSidebar" :title="formSidebarTitle" :form-config="uiConfig?.formView" :initial-data="formSidebarData" :loading="formSidebarLoading" :submit-text="formSidebarSubmitText" :loading-text="formSidebarLoadingText" @close="closeFormSidebar" @submit="handleFormSubmit" />

    <FilterSidebar :show="showFilterSidebar" title="Filters" @close="closeFilters" @clear="clearFilters" @apply="applyFilters">
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Time window</label>
          <TimeWindowPicker :preset="filterPreset" :from="filterFrom" :to="filterTo" @change="onTimeWindowChange" />
        </div>
        <div v-for="f in listFilters" :key="f.field" class="space-y-1">
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">{{ f.label }}</label>
          <template v-if="f.type === 'number'">
            <div class="flex items-center gap-2">
              <input type="number" :value="localFilterValues[f.field]?.min ?? ''" @input="onLocalNumberChange(f.field, 'min', $event)" placeholder="Min" class="w-1/2 px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
              <input type="number" :value="localFilterValues[f.field]?.max ?? ''" @input="onLocalNumberChange(f.field, 'max', $event)" placeholder="Max" class="w-1/2 px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
            </div>
          </template>
          <template v-else-if="f.type === 'select'">
            <select :value="localFilterValues[f.field]?.value ?? ''" @change="onLocalValueChange(f.field, $event)" class="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
              <option value="">Any</option>
              <option v-for="opt in f.options || []" :key="String(opt.value)" :value="String(opt.value)">{{ opt.label }}</option>
            </select>
          </template>
          <template v-else-if="f.type === 'boolean'">
            <select :value="localFilterValues[f.field]?.value ?? ''" @change="onLocalValueChange(f.field, $event)" class="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
              <option value="">Any</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </template>
          <template v-else-if="f.type === 'date'">
            <div class="flex items-center gap-2">
              <input type="date" :value="localFilterValues[f.field]?.from ?? ''" @change="onLocalDateChange(f.field, 'from', $event)" class="w-1/2 px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
              <input type="date" :value="localFilterValues[f.field]?.to ?? ''" @change="onLocalDateChange(f.field, 'to', $event)" class="w-1/2 px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
            </div>
          </template>
        </div>
      </div>
    </FilterSidebar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, unref, nextTick, defineAsyncComponent, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import DynamicFormSidebar from '@/components/molecules/DynamicFormSidebar.vue'
const TableView = defineAsyncComponent(() => import('@/components/organisms/TableView.vue'))
import KanbanView from '@/components/organisms/KanbanView.vue'
import GalleryView from '@/components/organisms/GalleryView.vue'
import CalendarView from '@/components/organisms/CalendarView.vue'
import StatsView from '@/components/organisms/StatsView.vue'
import ActionsMenu from '@/components/atoms/ActionsMenu.vue'
import Chip from '@/components/atoms/Chip.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import SearchInput from '@/components/atoms/SearchInput.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import FilterSidebar from '@/components/molecules/FilterSidebar.vue'
import TimeWindowPicker from '@/components/molecules/TimeWindowPicker.vue'
import { useMovieService } from '@/composables/useMovieService'
import { useToast } from '@/composables/useToast'
import { usePreference } from '@/composables/usePreference'
import type { FilterConfig } from '@/types/ui-config'
const router = useRouter()

interface Props {
  moduleName: string
  uiConfig?: any
  data?: any[]
  loading?: boolean
  error?: string | null
  currentPage?: number
  totalPages?: number
  totalItems?: number
  perPage?: number
  customCreateHandler?: boolean
  activeFilters?: { key: string; label: string }[]
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  loading: false,
  activeFilters: () => []
})

const emit = defineEmits(['action', 'sort', 'page-change', 'create', 'bulk-delete', 'load-more', 'filters-change', 'clear-filter', 'clear-all-filters'])

const moduleName = computed(() => props.moduleName)
const viewPrefKey = computed(() => `${moduleName.value}-list-view`)
const viewPref = ref<ReturnType<typeof usePreference> | null>(null)
watch(viewPrefKey, (k) => {
  viewPref.value = usePreference(k)
}, { immediate: true })

const currentView = ref<'list' | 'gallery' | 'calendar' | 'kanban'>('list')
const searchQuery = ref('')
const selectedSearchField = ref<'all' | string>('all')
const isSearchOpen = ref(false)
const searchInputRef = ref<HTMLInputElement | null>(null)
const selectedIds = ref<(string|number)[]>([])
const showFormSidebar = ref(false)
const formSidebarTitle = ref('')
const formSidebarData = ref<Record<string, any>>({})
const formSidebarLoading = ref(false)
const formSidebarSubmitText = ref('Create')
const formSidebarLoadingText = ref('Creating...')

// Filters sidebar state
const showFilterSidebar = ref(false)
const filterPreset = ref<'all'|'7d'|'30d'|'90d'|'custom'>('all')
const filterFrom = ref<string | undefined>(undefined)
const filterTo = ref<string | undefined>(undefined)
const listFilters = computed<FilterConfig[]>(() => uiConfig.value?.views?.list?.defaultFilters || [])
const localFilterValues = ref<Record<string, any>>({})

// (Tabs removed in favor of layout menu)

const uiConfig = computed(() => unref(props.uiConfig))
const searchableFieldOptions = computed<{ key: string, label: string }[]>(() => {
  const cfg = uiConfig.value
  if (!cfg?.views?.list) return []
  const explicit = cfg.views.list.searchableFields as string[] | undefined
  const columns = (cfg.views.list.columns || []) as any[]
  const fromColumns = columns
    .filter(c => (c?.type === 'text' || c?.type === 'url' || c?.type === 'email' || c?.searchable === true))
    .map(c => ({ key: String(c.key), label: String(c.label || c.key) }))
  const fromExplicit = (explicit || [])
    .map(k => {
      const col = columns.find(c => c.key === k)
      return { key: String(k), label: String(col?.label || k) }
    })
  const merged: Record<string, { key: string, label: string }> = {}
  for (const f of [...fromColumns, ...fromExplicit]) merged[f.key] = f
  return Object.values(merged)
})
const data = computed(() => props.data || [])
const loading = computed(() => props.loading || false)
const error = computed(() => props.error || null)

const pagination = computed(() => {
  const perPage = Number(props.perPage ?? 10) || 10
  const providedTotal = Number(props.totalItems ?? 0) || 0
  const total = Math.max(providedTotal, data.value.length)
  const totalPages = props.totalPages ?? Math.max(1, Math.ceil((total || 0) / (perPage || 1)))
  return {
    currentPage: Number(props.currentPage ?? 1) || 1,
    totalPages,
    total,
    perPage
  }
})

const filteredData = computed(() => data.value)

const hasMore = computed(() => pagination.value.currentPage < pagination.value.totalPages)

const { updateModuleItem } = useMovieService()
const { push } = useToast()

onMounted(() => {
  const saved = viewPref.value?.get()
  if (saved === 'kanban' || saved === 'gallery' || saved === 'calendar' || saved === 'list') {
    currentView.value = saved as any
  }
  // Initialize local filter UI from current URL
  try {
    const q = (router as any).currentRoute?.value?.query || {}
    for (const f of listFilters.value as any[]) {
      const base = `filters[${f.field}]`
      const eq = q[base]
      const b = q[`${base}[$between]`]
      const gte = q[`${base}[$gte]`]
      const lte = q[`${base}[$lte]`]
      if (f.type === 'number') {
        if (b) {
          const [min, max] = String(b).split(',')
          localFilterValues.value[f.field] = { min, max }
        } else if (gte || lte) {
          localFilterValues.value[f.field] = { min: gte || '', max: lte || '' }
        }
      } else if (f.type === 'select' || f.type === 'boolean') {
        if (eq !== undefined) localFilterValues.value[f.field] = { value: String(eq) }
      } else if (f.type === 'date') {
        if (b) {
          const [from, to] = String(b).split(',')
          localFilterValues.value[f.field] = { from, to }
        } else if (gte || lte) {
          localFilterValues.value[f.field] = { from: gte || '', to: lte || '' }
        }
      }
    }
  } catch {}
})

watch(currentView, (v) => {
  const def = 'list'
  if (!v || v === def) viewPref.value?.remove()
  else viewPref.value?.set(v)
})

async function handleKanbanStatusChange(payload: { item: any; from: string; to: string }) {
  const groupByField = uiConfig.value?.views?.kanban?.groupByField
  const id = String(payload?.item?.id ?? '')
  if (!groupByField || !id) return
  try {
    await updateModuleItem(moduleName.value, id, { [groupByField]: payload.to })
    push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: 'success',
      position: 'tr',
      title: 'Status updated',
      body: `${groupByField} → ${payload.to}`,
      timeout: 3000,
    })
  } catch (error: any) {
    push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: 'error',
      position: 'tr',
      title: 'Failed to update status',
      body: error?.message || 'Unexpected error',
      timeout: 6000,
    })
  }
}

const handleAction = (actionName: string, item?: any) => {
  if (actionName === 'create') {
    if (props.customCreateHandler) {
      emit('create')
    } else {
      formSidebarTitle.value = `Add New ${uiConfig.value?.displayName?.slice(0, -1) || 'Item'}`
      formSidebarSubmitText.value = `Create ${uiConfig.value?.displayName?.slice(0, -1) || 'Item'}`
      formSidebarLoadingText.value = `Creating...`
      showFormSidebar.value = true
    }
  } else {
    emit('action', actionName, item)
  }
}

async function handleSwitchView(view: 'list' | 'gallery' | 'calendar' | 'kanban') {
  if (currentView.value === view) return
  currentView.value = view
  await nextTick()
}

// Layout ActionsMenu
type LayoutItem = { key: 'list' | 'gallery' | 'calendar' | 'kanban'; label: string }
const layoutMenuItems = computed<LayoutItem[]>(() => [
  { key: 'list', label: 'Table' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'kanban', label: 'Kanban' }
])
function handleLayoutSelect(key: string) {
  if (['list', 'gallery', 'calendar', 'kanban'].includes(key)) handleSwitchView(key as any)
}

function openSearch() {
  isSearchOpen.value = true
  // Autofocus shortly after opening
  setTimeout(() => searchInputRef.value?.focus(), 0)
}
function closeSearch() {
  isSearchOpen.value = false
}

function openFilters() {
  showFilterSidebar.value = true
}
function closeFilters() {
  showFilterSidebar.value = false
}
function clearFilters() {
  filterPreset.value = 'all'
  filterFrom.value = undefined
  filterTo.value = undefined
  localFilterValues.value = {}
}
function onTimeWindowChange(payload: { preset?: string; from?: string; to?: string }) {
  if (payload.preset) filterPreset.value = payload.preset as any
  if (payload.from !== undefined) filterFrom.value = payload.from
  if (payload.to !== undefined) filterTo.value = payload.to
}
function onLocalValueChange(field: string, e: Event) {
  const value = (e.target as HTMLSelectElement).value
  localFilterValues.value[field] = { ...(localFilterValues.value[field] || {}), value }
}
function onLocalNumberChange(field: string, key: 'min'|'max', e: Event) {
  const value = (e.target as HTMLInputElement).value
  localFilterValues.value[field] = { ...(localFilterValues.value[field] || {}), [key]: value }
}
function onLocalDateChange(field: string, key: 'from'|'to', e: Event) {
  const value = (e.target as HTMLInputElement).value
  localFilterValues.value[field] = { ...(localFilterValues.value[field] || {}), [key]: value }
}
function applyFilters() {
  // Emit up; parent view wires to useQueryBuilder.setTimeWindow and reloads via watcher
  const payload: Record<string, any> = { preset: filterPreset.value, from: filterFrom.value, to: filterTo.value }
  // Translate localFilterValues into backend-friendly filters
  const filters: Record<string, any> = {}
  for (const f of listFilters.value as any[]) {
    const v = localFilterValues.value[f.field]
    if (!v) continue
    if (f.type === 'number') {
      const min = v.min !== '' && v.min !== undefined ? Number(v.min) : undefined
      const max = v.max !== '' && v.max !== undefined ? Number(v.max) : undefined
      if (typeof min === 'number' && !isNaN(min) && typeof max === 'number' && !isNaN(max)) filters[f.field] = { $between: [min, max] }
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
  emit('filters-change', payload as any)
  closeFilters()
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push('/')
}

const handleSort = (field: string, direction: string) => emit('sort', field, direction)
const handlePageChange = (page: number) => emit('page-change', page)
const handleItemClick = (item: any) => emit('action', 'view', item)
const handleLoadMore = () => emit('load-more')
const handleKanbanFiltersChange = (payload: { from?: string; to?: string; preset?: string }) => emit('filters-change', payload)
const handleCalendarFiltersChange = (payload: { from?: string; to?: string; preset?: string }) => emit('filters-change', payload)

function onSelectionChange(ids: (string|number)[]) {
  selectedIds.value = ids
}

function handleBulkDelete() {
  if (selectedIds.value.length === 0) return
  // Emit up; parent view can show a confirmation modal for batch actions
  emit('bulk-delete', selectedIds.value)
}

function closeFormSidebar() {
  showFormSidebar.value = false
  formSidebarData.value = {}
}

function handleFormSubmit(data: Record<string, any>) {
  emit('action', 'create', data)
  closeFormSidebar()
}

function handleSearchInput() {
  const search = searchQuery.value?.trim() || ''
  const field = selectedSearchField.value !== 'all' ? selectedSearchField.value : undefined
  try {
    const url = new URL(window.location.href)
    if (search) url.searchParams.set('search', search); else url.searchParams.delete('search')
    if (field) url.searchParams.set('searchField', field); else url.searchParams.delete('searchField')
    // Reset page when search changes
    url.searchParams.set('page', '1')
    history.replaceState(null, '', url.toString())
  } catch {}
}

// Debounce for better UX
let searchDebounceTimer: number | undefined
function handleSearchInputDebounced() {
  if (searchDebounceTimer) window.clearTimeout(searchDebounceTimer)
  searchDebounceTimer = window.setTimeout(() => handleSearchInput(), 300)
}

function handleEscape() {
  closeSearch()
}

// Empty-state helpers
const hasCreateAction = computed(() => {
  const actions: any[] = uiConfig.value?.views?.list?.actions || []
  return actions.some((a: any) => a?.name === 'create')
})
const emptyTitle = computed(() => {
  if (searchQuery.value) return 'No results found'
  const plural = uiConfig.value?.displayName || moduleName.value
  return `No ${plural?.toLowerCase()} yet`
})
const emptySubtitle = computed(() => {
  if (searchQuery.value) return 'Try a different search or clear your query.'
  return `Get started by adding your first record.`
})
function clearSearch() {
  searchQuery.value = ''
}

// Skeleton and layout shift mitigation
const approximateRowHeight = 56 // px
const skeletonRows = computed(() => Math.max(4, Math.min(pagination.value.perPage || 10, 10)))
const contentMinHeight = computed(() => `${approximateRowHeight * (skeletonRows.value + 1)}px`)
</script>