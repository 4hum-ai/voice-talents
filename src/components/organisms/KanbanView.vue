<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div class="text-sm text-gray-600 dark:text-gray-300">Time window</div>
      <div class="flex items-center gap-2">
        <select v-model="selectedPreset" @change="emitFilters" class="px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
          <option value="all">All time</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="custom">Custom…</option>
        </select>
        <input v-if="selectedPreset==='custom'" type="date" v-model="fromDate" @change="emitFilters" class="px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
        <input v-if="selectedPreset==='custom'" type="date" v-model="toDate" @change="emitFilters" class="px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      <div
        v-for="column in config.columns"
        :key="column.value"
        class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-[300px] border border-gray-200 dark:border-gray-700"
        :ref="el => setColumnRef(column.value, el as HTMLElement)"
      >
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: column.color || '#6b7280' }"></div>
            <h3 class="font-medium text-gray-900 dark:text-gray-100">{{ column.label }}</h3>
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-full">{{ getKanbanCount(column.value) }}</span>
        </div>
        <div class="space-y-3">
          <template v-for="item in getKanbanItems(column.value)" :key="item.id">
            <div
              class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md cursor-grab active:cursor-grabbing select-none transition-all duration-200 touch-none will-change-transform"
              :class="{ 'z-50 shadow-lg': draggingItemId === item.id }"
              :ref="el => setCardRef(item.id, el as HTMLElement)"
              :style="[baseDragStyleRefs[item.id], cardStyleRefs[item.id]]"
              @click="handleItemClick(item)"
            >
              <div class="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1">{{ item[config.cardTitleField] }}</div>
              <div v-if="config.cardDescriptionField" class="text-xs text-gray-500 dark:text-gray-400">{{ item[config.cardDescriptionField] }}</div>
            </div>
            <div v-if="draggingItemId === item.id" :style="getPlaceholderStyle(item.id)"></div>
          </template>
          <div v-if="getKanbanItems(column.value).length === 0" class="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">No items</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { useDraggable } from '@vueuse/core'

interface Props {
  data: any[]
  config: { columns: any[]; groupByField: string; cardTitleField: string; cardDescriptionField?: string; actions?: any[] }
}
const props = defineProps<Props>()
const emit = defineEmits<{ action: [action:string, item?:any]; itemClick: [item:any]; statusChange: [payload:{ item:any; from:string; to:string }]; filtersChange: [payload:{ from?: string; to?: string; preset?: string }] }>()

const items = ref<any[]>([])
watch(
  () => props.data,
  (newData) => {
    items.value = Array.isArray(newData) ? newData.map((d) => ({ ...d })) : []
  },
  { immediate: true }
)

const getKanbanCount = (columnValue: string) => items.value.filter(item => item[props.config.groupByField] === columnValue).length
const getKanbanItems = (columnValue: string) => items.value.filter(item => item[props.config.groupByField] === columnValue)

const handleItemClick = (item:any) => emit('itemClick', item)

// Time window filters
const selectedPreset = ref<'all' | '7d' | '30d' | '90d' | 'custom'>('all')
const fromDate = ref<string>('')
const toDate = ref<string>('')
function emitFilters() {
  if (selectedPreset.value !== 'custom') {
    emit('filtersChange', { preset: selectedPreset.value })
    return
  }
  const from = fromDate.value ? new Date(fromDate.value).toISOString() : undefined
  const to = toDate.value ? new Date(toDate.value).toISOString() : undefined
  emit('filtersChange', { from, to, preset: 'custom' })
}

// Column refs for hit-testing
const columnRefs = reactive<Record<string, HTMLElement | null>>({})
const setColumnRef = (value: string, el: HTMLElement | null) => {
  columnRefs[value] = el
}

// Card refs and draggables per item id
const cardElRefs = reactive<Record<string, { el: HTMLElement | null }>>({})
const draggableMap = new Map<string, ReturnType<typeof useDraggable>>()
const cardStyleRefs = reactive<Record<string, any>>({})
const baseDragStyleRefs = reactive<Record<string, any>>({})
const draggingItemId = ref<string | null>(null)
const placeholderId = ref<string | null>(null)
const lastPointer = ref<{ x: number; y: number } | null>(null)
const dragMeta = reactive<Record<string, { width: number; height: number }>>({})

const setCardRef = (id: string, el: HTMLElement | null) => {
  if (!cardElRefs[id]) cardElRefs[id] = { el: null }
  cardElRefs[id].el = el

  if (el && !draggableMap.has(id)) {
    const targetRef = ref<HTMLElement | null>(el)
    const instance = useDraggable(targetRef, {
      preventDefault: true,
      pointerTypes: ['mouse', 'touch', 'pen'],
      onStart: () => {
        const rect = el.getBoundingClientRect()
        dragMeta[id] = { width: rect.width, height: rect.height }
        baseDragStyleRefs[id] = { position: 'fixed', left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, pointerEvents: 'none' }
        draggingItemId.value = id
        placeholderId.value = id
      },
      onMove: (_evPos, ev: PointerEvent | MouseEvent | TouchEvent) => {
        if ('clientX' in ev && 'clientY' in ev) {
          lastPointer.value = { x: (ev as PointerEvent).clientX, y: (ev as PointerEvent).clientY }
        }
      },
      onEnd: () => {
        handleDropFromDraggable(id)
        baseDragStyleRefs[id] = undefined as any
        placeholderId.value = null
      },
    })
    draggableMap.set(id, instance)
    cardStyleRefs[id] = instance.style
  }
}

const getPlaceholderStyle = (id: string) => {
  const meta = dragMeta[id]
  if (!meta) return {}
  return { height: `${meta.height}px` }
}

const handleDropFromDraggable = (id: string) => {
  const item = items.value.find(i => i.id === id)
  const groupBy = props.config.groupByField
  if (!item) return

  // Determine drop point: prefer last pointer; fallback to card center
  let cx: number | null = lastPointer.value?.x ?? null
  let cy: number | null = lastPointer.value?.y ?? null

  if (cx == null || cy == null) {
    const cardEl = cardElRefs[id]?.el
    if (cardEl) {
      const rect = cardEl.getBoundingClientRect()
      cx = rect.left + rect.width / 2
      cy = rect.top + rect.height / 2
    }
  }

  // Reset the draggable transform regardless of drop result
  const inst = draggableMap.get(id)
  if (inst) {
    inst.x.value = 0
    inst.y.value = 0
  }

  if (cx == null || cy == null) {
    draggingItemId.value = null
    lastPointer.value = null
    return
  }

  let targetColumnValue: string | null = null
  for (const [value, el] of Object.entries(columnRefs)) {
    if (!el) continue
    const r = el.getBoundingClientRect()
    if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) {
      targetColumnValue = value
      break
    }
  }

  const from = String(item[groupBy])
  const to = targetColumnValue != null ? String(targetColumnValue) : from

  if (!targetColumnValue || from === to) {
    draggingItemId.value = null
    lastPointer.value = null
    return
  }

  // Update local state for instant UI feedback
  const idx = items.value.findIndex((i) => i.id === id)
  if (idx !== -1) items.value[idx] = { ...items.value[idx], [groupBy]: to }

  emit('statusChange', { item: { ...item }, from, to })
  draggingItemId.value = null
  lastPointer.value = null
}
</script>


