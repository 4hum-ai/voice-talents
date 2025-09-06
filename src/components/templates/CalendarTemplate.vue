<template>
  <div class="px-4 py-6">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, shallowRef, ref } from 'vue'
import { toDate, toISODate } from '@/utils/date'
import { createCalendar, createViewMonthGrid } from '@schedule-x/calendar'
type PlainDate = unknown
import 'temporal-polyfill/global'
import type { DataArray, DataItem } from '@/types/common'

type Props = {
  data: DataArray
  config: {
    titleField?: string
    dateField?: string
    endDateField?: string
    actions?: unknown[]
  }
  resourceName?: string
  uiConfig?: unknown
  loading?: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'action', action: string, item?: unknown): void
  (e: 'item-click', item: unknown): void
  (e: 'filters-change', payload: { from?: string; to?: string; preset?: string }): void
}>()

const viewMonth = createViewMonthGrid()

const selectedDate = ref<Date>(new Date())
const currentMonth = computed<number>(() => selectedDate.value.getMonth())
const currentYear = computed<number>(() => selectedDate.value.getFullYear())

function toTemporalDate(d: Date): PlainDate {
  return (
    globalThis as {
      Temporal: {
        PlainDate: {
          from: (date: { year: number; month: number; day: number }) => unknown
        }
      }
    }
  ).Temporal.PlainDate.from({
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
  }) as unknown as PlainDate
}

type CalendarEvent = {
  id: string
  title: string
  start: PlainDate
  end: PlainDate
  __raw: DataItem
}

const mappedEvents = computed<CalendarEvent[]>(() => {
  const dateField = props.config.dateField || 'date'
  const endField = (props.config as { endDateField?: string }).endDateField || dateField
  return (props.data || [])
    .map((item: DataItem, idx: number) => {
      const startD = toDate(item?.[dateField] as unknown)
      if (!startD) return null
      const endD = toDate(item?.[endField] as unknown) || startD
      return {
        id: String(item?.id ?? item?._id ?? idx),
        title: String(item?.[props.config.titleField || 'title'] ?? ''),
        start: toTemporalDate(startD),
        end: toTemporalDate(endD),
        __raw: item,
      }
    })
    .filter(Boolean) as CalendarEvent[]
})

function buildApp() {
  const cfg = {
    selectedDate: toTemporalDate(selectedDate.value),
    views: [viewMonth],
    defaultView: viewMonth.name,
    events: mappedEvents.value,
  } as unknown as Parameters<typeof createCalendar>[0]
  return createCalendar(cfg)
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
  // Note: We can't access route here since this is a simplified component
  // The parent ItemListView will handle the initial filter emission
  emitVisibleRange()
} catch {
  void 0
}
</script>
