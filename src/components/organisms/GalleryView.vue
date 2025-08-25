<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="inline-flex items-center gap-1.5 align-middle">
        <span class="text-xs leading-5 text-gray-500 dark:text-gray-400">Total {{ totalCount }} records</span>
      </div>
      <div class="inline-flex items-center gap-2">
        <span class="hidden sm:inline text-xs text-gray-500 dark:text-gray-400">Sorted by</span>

        <select v-model="sortValue" @change="handleSortChange" class="px-2 py-1.5 text-xs rounded-md border border-gray-300 dark:border-gray-700 bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200">
          <option v-for="opt in sortMenuItems" :key="opt.key" :value="opt.key">{{ opt.label }}</option>
        </select>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      <div v-for="item in data" :key="item.id" class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-sm transition-shadow" @click="handleItemClick(item)">
        <div class="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <span class="text-4xl text-gray-400 dark:text-gray-500 font-medium">{{ getInitials(item[config.titleField]) }}</span>
        </div>
        <div class="p-4">
          <h3 class="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1">{{ item[config.titleField] }}</h3>
          <p v-if="config.descriptionField" class="text-xs text-gray-500 dark:text-gray-400">{{ item[config.descriptionField] }}</p>
        </div>
      </div>
    </div>
    
    <div v-if="hasMore" class="flex flex-col items-center gap-2">
      <button @click="emit('loadMore')" class="px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
        Load more
      </button>
      <div ref="sentinelRef" class="h-8 w-full flex items-center justify-center text-xs text-gray-500 dark:text-gray-400" aria-hidden="true">
        Loading more…
      </div>
    </div>
    <div v-else class="py-6 flex items-center justify-center">
      <span class="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
        <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7.28 9.22a.75.75 0 011.06 0L10 10.94l1.66-1.72a.75.75 0 111.08 1.04l-2.2 2.28a.75.75 0 01-1.08 0L7.28 10.26a.75.75 0 010-1.04z" clip-rule="evenodd"/></svg>
        End of results
      </span>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface Props { data: any[]; config: { imageField?: string; titleField: string; descriptionField?: string; actions?: any[] }; hasMore?: boolean }
const props = defineProps<Props>()
const emit = defineEmits<{ action: [action:string, item?:any]; itemClick: [item:any]; loadMore: []; sort: [field:string, direction:'asc'|'desc'] }>()

// Removed unused handleAction to satisfy type checks
const handleItemClick = (item:any) => emit('itemClick', item)
const getInitials = (name:string) => !name ? '?' : name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)

const sentinelRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

function ensureObserver() {
  if (observer) return
  observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (entry && entry.isIntersecting && props.hasMore) {
      emit('loadMore')
    }
  }, { root: null, rootMargin: '0px', threshold: 0.1 })
}

onMounted(() => {
  ensureObserver()
  if (observer && sentinelRef.value) observer.observe(sentinelRef.value)
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})

watch(() => props.hasMore, (v) => {
  // Reconnect observer when hasMore toggles
  if (!observer) ensureObserver()
  if (observer) {
    observer.disconnect()
    if (v && sentinelRef.value) observer.observe(sentinelRef.value)
  }
})

// Sorting header logic
type Dir = 'asc' | 'desc'
const initialField = computed(() => props.config.titleField || 'title')
const sortKey = ref<string>(initialField.value)
const sortDir = ref<Dir>('asc')
const sortValue = ref<string>(`${initialField.value}:asc`)
const totalCount = computed(() => Array.isArray(props.data) ? props.data.length : 0)
const sortOptions = computed<{ key: string; label: string }[]>(() => {
  const options: { key: string; label: string }[] = []
  if (props.config.titleField) options.push({ key: props.config.titleField, label: 'Title' })
  if (props.config.descriptionField) options.push({ key: props.config.descriptionField, label: 'Description' })
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
function handleSortChange() {
  const [field, dir] = sortValue.value.split(':')
  const d = (dir === 'desc' ? 'desc' : 'asc') as Dir
  sortKey.value = field
  sortDir.value = d
  emit('sort', field, d)
}

const currentSortLabel = computed(() => {
  const [field, dir] = sortValue.value.split(':')
  const found = sortOptions.value.find(o => o.key === field)
  const base = found?.label || field
  return `${base} ${dir === 'asc' ? '(A→Z)' : '(Z→A)'}
  `
})
</script>


