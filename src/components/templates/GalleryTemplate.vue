<template>
  <div class="min-h-screen">
    <AppBar :loading="loading" :show-back="true" @back="router.back()">
      <template #left>
        <div class="min-w-0">
          <div class="truncate text-base font-semibold text-gray-900 dark:text-gray-100">
            {{ uiConfig?.displayName || resourceName }}
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
            @click="openCreate()"
          >
            + Add
          </button>
          <IconButton v-if="hasCreateAction" aria-label="Add" @click="openCreate()">
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
                  d="M3 5.25A2.25 2.25 0 015.25 3h4.5A2.25 2.25 0 0112 5.25v4.5A2.25 2.25 0 019.75 12h-4.5A2.25 2.25 0 013 9.75v-4.5zM12 14.25A2.25 2.25 0 0114.25 12h4.5A2.25 2.25 0 0121 14.25v4.5A2.25 2.25 0 0118.75 21h-4.5A2.25 2.25 0 0112 18.75v-4.5zM3 14.25A2.25 2.25 0 015.25 12h4.5A2.25 2.25 0 0112 14.25v4.5A2.25 2.25 0 019.75 21h-4.5A2.25 2.25 0 013 18.75v-4.5zM14.25 3A2.25 2.25 0 0012 5.25v4.5A2.25 2.25 0 0014.25 12h4.5A2.25 2.25 0 0021 9.75v-4.5A2.25 2.25 0 0018.75 3h-4.5z"
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
              :placeholder="`Search ${resourceName}...`"
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

    <main class="space-y-10 p-4">
      <div
        v-if="activeFilters && activeFilters.length > 0"
        class="mb-3 flex flex-wrap items-center gap-2"
      >
        <Chip
          v-for="chip in activeFilters"
          :key="chip.key"
          :label="chip.label"
          closable
          @close="() => emit('clear-filter', chip.key)"
        />
        <button
          class="rounded-full border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          @click="emit('clear-all-filters')"
        >
          Clear all
        </button>
      </div>

      <div class="flex items-center justify-between">
        <div class="inline-flex items-center gap-1.5 align-middle">
          <span class="text-xs leading-5 text-gray-500 dark:text-gray-400"
            >Total {{ totalCount }} records</span
          >
        </div>
        <SortDropdown
          v-model="sortValue"
          :label="'Sorted by'"
          :options="sortMenuItems"
          @update:model-value="handleSortChange"
        />
      </div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
        <div
          v-for="item in data"
          :key="item.id"
          class="cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-sm dark:border-gray-700 dark:bg-gray-900"
          @click="handleItemClick(item)"
        >
          <div
            class="relative flex aspect-square items-center justify-center bg-gray-100 dark:bg-gray-800"
          >
            <template v-if="mediaKind(mediaSrc(item)) === 'image' && mediaSrc(item)">
              <Image :src="mediaSrc(item) || ''" alt="" class="h-full w-full object-cover" />
            </template>

            <template v-else-if="mediaKind(primaryMediaValue(item)) === 'video'">
              <!-- Show video player if this item is active, otherwise show poster/thumbnail -->
              <template v-if="activeVideo && activeVideo.item.id === item.id">
                <div class="h-full w-full bg-black">
                  <VideoPlayer
                    :url="activeVideo.url"
                    :title="activeVideo.title"
                    subtitle-url=""
                    mode="inline"
                    @close="closeVideo"
                  />
                </div>
              </template>
              <template v-else>
                <template v-if="posterUrl(item)">
                  <Image :src="posterUrl(item) || ''" alt="" class="h-full w-full object-cover" />
                </template>
                <template v-else>
                  <div class="h-full w-full bg-gray-200 dark:bg-gray-700" />
                </template>
                <button
                  type="button"
                  class="absolute inset-0 grid place-items-center"
                  aria-label="Play video"
                  @click="handleVideoClick(item, $event)"
                >
                  <PlayIcon class="h-12 w-12 text-white/90 drop-shadow" aria-hidden="true" />
                </button>
                <span
                  class="absolute top-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-white uppercase"
                >
                  {{ mediaFormat(item) }}
                </span>
              </template>
            </template>

            <template v-else-if="mediaKind(primaryMediaValue(item)) === 'audio'">
              <div
                class="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700"
              >
                <MusicIcon class="h-10 w-10 text-gray-600 dark:text-gray-300" aria-hidden="true" />
              </div>
              <button
                type="button"
                class="absolute inset-0 grid place-items-center"
                aria-label="Play audio"
              >
                <PlayIcon class="h-12 w-12 text-white/90 drop-shadow" aria-hidden="true" />
              </button>
              <span
                class="absolute top-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-white uppercase"
              >
                {{ mediaFormat(item) }}
              </span>
            </template>

            <template v-else>
              <span class="text-4xl font-medium text-gray-400 dark:text-gray-500">
                {{ getInitials(item[titleField]) }}
              </span>
              <span
                v-if="mediaFormat(item)"
                class="absolute top-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-white uppercase"
              >
                {{ mediaFormat(item) }}
              </span>
            </template>
          </div>
          <div class="p-4">
            <h3 class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ item[titleField] }}
            </h3>
            <p v-if="config.descriptionField" class="text-xs text-gray-500 dark:text-gray-400">
              {{ item[config.descriptionField] }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="hasMore" class="flex flex-col items-center gap-2">
        <button
          class="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          @click="emit('load-more')"
        >
          Load more
        </button>
        <div
          ref="sentinelRef"
          class="flex h-8 w-full items-center justify-center text-xs text-gray-500 dark:text-gray-400"
          aria-hidden="true"
        >
          Loading more…
        </div>
      </div>
      <div v-else class="flex items-center justify-center py-6">
        <span
          class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/60 px-3 py-1 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-400"
        >
          <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7.28 9.22a.75.75 0 011.06 0L10 10.94l1.66-1.72a.75.75 0 111.08 1.04l-2.2 2.28a.75.75 0 01-1.08 0L7.28 10.26a.75.75 0 010-1.04z"
              clip-rule="evenodd"
            />
          </svg>
          End of results
        </span>
      </div>
    </main>

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

    <FilterSidebar
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
                :value="localFilterValues[f.field]?.min ?? ''"
                placeholder="Min"
                class="w-1/2 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                @input="onLocalNumberChange(f.field, 'min', $event)"
              />
              <input
                type="number"
                :value="localFilterValues[f.field]?.max ?? ''"
                placeholder="Max"
                class="w-1/2 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                @input="onLocalNumberChange(f.field, 'max', $event)"
              />
            </div>
          </template>
          <template v-else-if="f.type === 'select'">
            <select
              :value="localFilterValues[f.field]?.value ?? ''"
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
              :value="localFilterValues[f.field]?.value ?? ''"
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
              :from="localFilterValues[f.field]?.from ?? ''"
              :to="localFilterValues[f.field]?.to ?? ''"
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter, type LocationQuery } from 'vue-router'
import SortDropdown from '@/components/molecules/SortDropdown.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import Chip from '@/components/atoms/Chip.vue'
import SearchInput from '@/components/atoms/SearchInput.vue'
import DynamicFormSidebar from '@/components/molecules/DynamicFormSidebar.vue'
import FilterSidebar from '@/components/molecules/FilterSidebar.vue'
import TimeWindowPicker from '@/components/molecules/TimeWindowPicker.vue'
import ActionsMenu from '@/components/atoms/ActionsMenu.vue'
import IconButton from '@/components/atoms/IconButton.vue'
import DateRangeInput from '@/components/atoms/DateRangeInput.vue'
import PlayIcon from '~icons/mdi/play-circle-outline'
import MusicIcon from '~icons/mdi/music-note-outline'
import type { DataArray, DataItem, ActionArray, FilterPreset } from '@/types/common'
import type { UiConfig, ColumnConfig, FilterConfig } from '@/types/ui-config'
import Image from '@/components/molecules/Image.vue'
import VideoPlayer from '@/components/organisms/VideoPlayer.vue'

// props/emits

type Props = {
  data: DataArray
  config: {
    imageField?: string
    titleField?: string
    descriptionField?: string
    actions?: ActionArray
  }
  hasMore?: boolean
  resourceName?: string
  uiConfig?: UiConfig
  loading?: boolean
  activeFilters?: { key: string; label: string }[]
}
const props = defineProps<Props>()
const route = useRoute()
const router = useRouter()
const emit = defineEmits<{
  (e: 'action', action: string, item?: unknown): void
  (e: 'item-click', item: unknown): void
  (e: 'load-more'): void
  (e: 'sort', field: string, direction: 'asc' | 'desc'): void
  (e: 'clear-filter', key: string): void
  (e: 'clear-all-filters'): void
  (
    e: 'filters-change',
    payload: {
      preset?: string
      from?: string
      to?: string
      filters?: Record<string, unknown>
    },
  ): void
}>()

// search/layout/create UI state
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

const resourceName = computed(() => props.resourceName || '')
const uiConfig = computed(() => props.uiConfig)
const dateField = computed(() => uiConfig.value?.views?.calendar?.dateField || 'createdAt')
const loading = computed(() => !!props.loading)
const activeFilters = computed(() => props.activeFilters || [])

const hasCreateAction = computed(
  () =>
    Array.isArray(props.config?.actions) &&
    (props.config.actions as unknown[]).some((a) => (a as { name?: string })?.name === 'create'),
)
const searchableFieldOptions = computed<{ key: string; label: string }[]>(() => {
  const cfg = uiConfig.value
  if (!cfg?.views?.list) return []
  const explicit = cfg.views.list.searchableFields as string[] | undefined
  const columns = (cfg.views.list.columns || []) as ColumnConfig[]
  const fromColumns = columns
    .filter((c) => c?.type === 'text' || c?.type === 'url' || c?.searchable === true)
    .map((c) => ({ key: String(c.key), label: String(c.label || c.key) }))
  const fromExplicit = (explicit || []).map((k) => {
    const col = columns.find((c) => c.key === k)
    return { key: String(k), label: String(col?.label || k) }
  })
  const merged: Record<string, { key: string; label: string }> = {}
  for (const f of [...fromColumns, ...fromExplicit]) merged[f.key] = f
  return Object.values(merged)
})

// create form sidebar
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
  emit('action', 'create', data)
  closeFormSidebar()
}

// layout selector
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

// filters sidebar
const showFilterSidebar = ref(false)
const filterPreset = ref<FilterPreset>('all')
const filterFrom = ref<string | undefined>(undefined)
const filterTo = ref<string | undefined>(undefined)
function syncFiltersFromQuery() {
  try {
    const q = route.query
    // sync time window from URL
    const betweenKey = `filters[${dateField.value}][$between]`
    const gteKey = `filters[${dateField.value}][$gte]`
    const lteKey = `filters[${dateField.value}][$lte]`
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

    // sync default field filters from URL
    const next: Record<string, LocalFilterValue> = {}
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
          next[f.field] = { from: (gte as string) || '', to: (lte as string) || '' }
        }
      }
    }
    localFilterValues.value = next
  } catch {
    void 0
  }
}
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
function applyFilters() {
  const payload: Record<string, unknown> = {
    preset: filterPreset.value,
    from: filterFrom.value,
    to: filterTo.value,
  }
  // Translate localFilterValues into backend-friendly filters
  const filters: Record<string, unknown> = {}
  for (const f of listFilters.value as FilterConfig[]) {
    const v = localFilterValues.value[f.field]
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
  emit('filters-change', payload)
  closeFilters()
}

const listFilters = computed<FilterConfig[]>(
  () => uiConfig.value?.views?.list?.defaultFilters || [],
)
type LocalFilterValue = { min?: number; max?: number; value?: string; from?: string; to?: string }
const localFilterValues = ref<Record<string, LocalFilterValue>>({})
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

// existing gallery logic below (unchanged)

// Removed unused handleAction to satisfy type checks
const handleItemClick = (item: unknown) => emit('item-click', item)

// Video player state
const activeVideo = ref<{ item: DataItem; url: string; title: string; posterUrl?: string } | null>(
  null,
)

// Handle video item click
const handleVideoClick = (item: DataItem, event: Event) => {
  event.stopPropagation() // Prevent item-click emit

  const videoUrl = String(item?.fileUrl || item?.url || '')
  const title = String(item?.[titleField.value] || 'Video')
  const poster = posterUrl(item)

  if (videoUrl) {
    activeVideo.value = {
      item,
      url: videoUrl,
      title,
      posterUrl: poster || undefined,
    }
  }
}

// Close video player
const closeVideo = () => {
  activeVideo.value = null
}
const getInitials = (name: unknown) =>
  !name
    ? '?'
    : String(name)
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

const sentinelRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

function ensureObserver() {
  if (observer) return
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry && entry.isIntersecting && props.hasMore) {
        emit('load-more')
      }
    },
    { root: null, rootMargin: '0px', threshold: 0.1 },
  )
}

onMounted(() => {
  ensureObserver()
  if (observer && sentinelRef.value) observer.observe(sentinelRef.value)
  syncFiltersFromQuery()
  try {
    const initialSort = String(route.query.sort || '')
    if (initialSort && sortMenuItems.value.some((i) => i.key === initialSort)) {
      sortValue.value = initialSort
    }
  } catch {
    void 0
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})

watch(
  () => route.query,
  () => {
    syncFiltersFromQuery()
  },
)

watch(
  () => props.hasMore,
  (v) => {
    if (!observer) ensureObserver()
    if (observer) {
      observer.disconnect()
      if (v && sentinelRef.value) observer.observe(sentinelRef.value)
    }
  },
)

type Dir = 'asc' | 'desc'
const titleField = computed<string>(() => props.config.titleField || 'title')
const sortValue = ref<string>(`${titleField.value}:asc`)
const totalCount = computed(() => (Array.isArray(props.data) ? props.data.length : 0))
const sortOptions = computed<{ key: string; label: string }[]>(() => {
  const options: { key: string; label: string }[] = []
  if (titleField.value) options.push({ key: titleField.value, label: 'Title' })
  if (props.config.descriptionField)
    options.push({ key: props.config.descriptionField, label: 'Description' })
  return options
})
const sortMenuItems = computed(() => {
  const items: { key: string; label: string }[] = []
  for (const opt of sortOptions.value) {
    items.push({ key: `${opt.key}:asc`, label: `${opt.label} (A→Z)` })
    items.push({ key: `${opt.key}:desc`, label: `${opt.label} (Z→A)` })
  }
  return items
})
function handleSortChange(newValue: string) {
  const [field, dir] = newValue.split(':')
  const d = (dir === 'desc' ? 'desc' : 'asc') as Dir
  emit('sort', field, d)
}

// Media preview helpers
const previewUrl = (item: DataItem): string | null => {
  const key = props.config?.imageField || 'thumbnailUrl'
  const value = item?.[key]
  if (!value) return null
  return String(value)
}
const isImage = (url: string): boolean => {
  const u = url.toLowerCase()
  return (
    u.endsWith('.png') ||
    u.endsWith('.jpg') ||
    u.endsWith('.jpeg') ||
    u.endsWith('.webp') ||
    u.endsWith('.gif') ||
    u.includes('image=')
  )
}

// Media helpers for kind/format/source selection
type MediaKind = 'image' | 'video' | 'audio' | 'other'
const imageExts = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif'])
const videoExts = new Set(['mp4', 'avi', 'mov', 'mkv', 'webm', 'm3u8'])
const audioExts = new Set(['mp3', 'wav', 'aac', 'flac'])

const getFileExtension = (url: string | undefined): string => {
  if (!url) return ''
  const u = url.split('?')[0]
  const last = u.split('.').pop() || ''
  return last.toLowerCase()
}

const mediaFormat = (item: DataItem): string => {
  const fmt = String(item?.format || '').toLowerCase()
  if (fmt) return fmt.toUpperCase()
  const url = String(item?.fileUrl || item?.url || previewUrl(item as DataItem) || '')
  const ext = getFileExtension(url)
  return ext ? ext.toUpperCase() : ''
}

const mediaKind = (value: string | null | undefined): MediaKind => {
  const raw = (value ?? '').trim()
  if (!raw) return 'other'
  const lower = raw.toLowerCase()
  // Handle MIME-like content type strings
  if (lower.startsWith('image/')) return 'image'
  if (lower.startsWith('video/')) return 'video'
  if (lower.startsWith('audio/')) return 'audio'

  // Handle explicit format or URLs by extension
  const ext = getFileExtension(lower)
  if (imageExts.has(ext)) return 'image'
  if (videoExts.has(ext)) return 'video'
  if (audioExts.has(ext)) return 'audio'
  return 'other'
}

const primaryMediaValue = (item: DataItem): string | null => {
  const ct = String(item?.contentType || '')
  if (ct) return ct
  const fmt = String(item?.format || '')
  if (fmt) return fmt
  const url = String(item?.fileUrl || item?.url || previewUrl(item as DataItem) || '')
  return url || null
}

const mediaSrc = (item: DataItem): string | null => {
  // Prefer explicit preview/thumbnail for images, else fileUrl
  const p = previewUrl(item)
  if (p && isImage(p)) return p
  const thumb = String(item?.thumbnailUrl || '')
  if (thumb) return thumb
  const file = String(item?.fileUrl || '')
  if (file && (isImage(file) || mediaKind(file) === 'image')) return file
  return null
}

const posterUrl = (item: DataItem): string | null => {
  const thumb = String(item?.thumbnailUrl || '')
  if (thumb) return thumb
  const p = previewUrl(item)
  if (p && isImage(p)) return p
  return null
}

watch(
  () => route.query.sort,
  (nv) => {
    const val = String(nv || '')
    if (val && sortMenuItems.value.some((i) => i.key === val)) {
      sortValue.value = val
    }
  },
)
</script>
