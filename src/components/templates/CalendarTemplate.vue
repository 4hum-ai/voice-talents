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
          <button
            v-if="hasCreateAction"
            class="focus:ring-primary-500 inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 focus:ring-2 focus:outline-none sm:hidden dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Add"
            @click="openCreate()"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                d="M12 6.75a.75.75 0 01.75.75v3.75H16.5a.75.75 0 010 1.5h-3.75V16.5a.75.75 0 01-1.5 0v-3.75H7.5a.75.75 0 010-1.5h3.75V7.5A.75.75 0 0112 6.75z"
              />
            </svg>
          </button>
          <button
            class="focus:ring-primary-500 inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 focus:ring-2 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Search"
            @click="openSearch"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 104.243 11.93l3.788 3.789a.75.75 0 101.06-1.06l-3.788-3.79A6.75 6.75 0 0010.5 3.75zm-5.25 6.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
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
            </div>
          </div>
          <button
            class="focus:ring-primary-500 inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 focus:ring-2 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Close search"
            @click="closeSearch"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M6.225 4.811a.75.75 0 011.06 0L12 9.525l4.715-4.714a.75.75 0 111.06 1.06L13.06 10.586l4.715 4.714a.75.75 0 11-1.06 1.06L12 11.646l-4.715 4.714a.75.75 0 11-1.06-1.06l4.714-4.714-4.714-4.715a.75.75 0 010-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </template>
      </template>
    </AppBar>

    <main class="p-4">
      <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div class="sx-vue-calendar-wrapper h-[720px] w-full max-w-full">
          <ScheduleXCalendar :calendar-app="calendarApp">
            <template #monthGridEvent="{ calendarEvent }">
              <button
                class="m-1 w-full truncate rounded bg-blue-50 px-2 py-1 text-left text-xs text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                :title="String(calendarEvent.title)"
                @click.stop="handleItemClick(calendarEvent.__raw)"
              >
                {{ String(calendarEvent.title) }}
              </button>
            </template>
          </ScheduleXCalendar>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, shallowRef, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toDate, toISODate } from '@/utils/date'
import { ScheduleXCalendar } from '@schedule-x/vue'
import { createCalendar, createViewMonthGrid } from '@schedule-x/calendar'
import 'temporal-polyfill/global'
import AppBar from '@/components/molecules/AppBar.vue'
import ActionsMenu from '@/components/atoms/ActionsMenu.vue'
import SearchInput from '@/components/atoms/SearchInput.vue'

// calendar core

type Props = {
  data: any[]
  config: {
    titleField?: string
    dateField?: string
    endDateField?: string
    actions?: any[]
  }
  resourceName?: string
  uiConfig?: any
  loading?: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'action', action: string, item?: any): void
  (e: 'item-click', item: any): void
  (e: 'filters-change', payload: { from?: string; to?: string; preset?: string }): void
}>()

const route = useRoute()
const router = useRouter()

const viewMonth = createViewMonthGrid()

const selectedDate = ref<Date>(new Date())
const currentMonth = computed<number>(() => selectedDate.value.getMonth())
const currentYear = computed<number>(() => selectedDate.value.getFullYear())

function toTemporalDate(d: Date) {
  return (globalThis as any).Temporal.PlainDate.from({
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
  })
}

const mappedEvents = computed(() => {
  const dateField = props.config.dateField || 'date'
  const endField = (props.config as any).endDateField || dateField
  return (props.data || [])
    .map((item: any, idx: number) => {
      const startD = toDate(item?.[dateField])
      if (!startD) return null
      const endD = toDate(item?.[endField]) || startD
      return {
        id: String(item?.id ?? item?._id ?? idx),
        title: String(item?.[props.config.titleField || 'title'] ?? ''),
        start: toTemporalDate(startD),
        end: toTemporalDate(endD),
        __raw: item,
      }
    })
    .filter(Boolean) as any[]
})

function buildApp() {
  return createCalendar({
    selectedDate: toTemporalDate(selectedDate.value),
    views: [viewMonth],
    defaultView: viewMonth.name,
    events: mappedEvents.value,
  })
}

const calendarApp = shallowRef(buildApp())

watch(mappedEvents, () => {
  calendarApp.value = buildApp()
})

const emitVisibleRange = () => {
  const start = new Date(currentYear.value, currentMonth.value, 1)
  const end = new Date(currentYear.value, currentMonth.value + 1, 0)
  emit('filters-change', {
    preset: 'custom',
    from: toISODate(start),
    to: toISODate(end),
  })
}

// Only emit initial range if no date filters exist in URL to avoid duplicate query updates
try {
  const q = route.query as Record<string, any>
  const df = (props.uiConfig?.views?.calendar?.dateField || 'createdAt') as string
  const hasDateFilter = Boolean(
    q[`filters[${df}][$between]`] || q[`filters[${df}][$gte]`] || q[`filters[${df}][$lte]`],
  )
  if (!hasDateFilter) emitVisibleRange()
} catch {
  void 0
}

function handleItemClick(item: any) {
  if (item) emit('item-click', item)
}

// appbar aux state
const resourceName = computed(() => props.resourceName || '')
const uiConfig = computed(() => props.uiConfig)
const loading = computed(() => !!props.loading)
const hasCreateAction = computed(
  () =>
    Array.isArray(props.config?.actions) &&
    (props.config.actions as any[]).some((a) => a?.name === 'create'),
)
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
  const nextQuery: Record<string, any> = { ...route.query, page: '1' }
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

const layoutMenuItems = computed(() => [
  { key: 'list', label: 'Table' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'kanban', label: 'Kanban' },
])
function handleLayoutSelect(key: string) {
  if (!['list', 'gallery', 'calendar', 'kanban'].includes(key)) return
  const nextQuery: Record<string, any> = { view: key }
  router.replace({ query: nextQuery }).catch(() => {})
}

// duplicate removed
function openCreate() {
  /* stub to satisfy template; calendar may not use form directly */
}

const searchableFieldOptions = computed<{ key: string; label: string }[]>(() => {
  const cfg = uiConfig.value
  if (!cfg?.views?.list) return []
  const explicit = cfg.views.list.searchableFields as string[] | undefined
  const columns = (cfg.views.list.columns || []) as any[]
  const fromColumns = columns
    .filter(
      (c) =>
        c?.type === 'text' || c?.type === 'url' || c?.type === 'email' || c?.searchable === true,
    )
    .map((c) => ({ key: String(c.key), label: String(c.label || c.key) }))
  const fromExplicit = (explicit || []).map((k) => {
    const col = columns.find((c) => c.key === k)
    return { key: String(k), label: String(col?.label || k) }
  })
  const merged: Record<string, { key: string; label: string }> = {}
  for (const f of [...fromColumns, ...fromExplicit]) merged[f.key] = f
  return Object.values(merged)
})

// Sync time window from route so reopening filters reflects current state
const dateField = computed(() => uiConfig.value?.views?.calendar?.dateField || 'createdAt')
function syncTimeWindowFromQuery() {
  try {
    const q = route.query
    const betweenKey = `filters[${dateField.value}][$between]`
    const gteKey = `filters[${dateField.value}][$gte]`
    const lteKey = `filters[${dateField.value}][$lte]`
    if (q[betweenKey]) {
      // no-op: calendar emits filters-change; kept for parity
    } else {
      if (q[gteKey]) {
        /* no-op */
      }
      if (q[lteKey]) {
        /* no-op */
      }
    }
    // The calendar emits filters-change rather than showing sidebar fields,
    // but keeping this for parity if a sidebar is shown in future.
  } catch {
    void 0
  }
}

onMounted(() => {
  syncTimeWindowFromQuery()
})
watch(
  () => route.query,
  () => {
    syncTimeWindowFromQuery()
  },
)
</script>
