<template>
  <div class="space-y-6">
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

    <div ref="sentinelRef" v-if="hasMore" class="h-10 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
      Loading more…
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface Props { data: any[]; config: { imageField?: string; titleField: string; descriptionField?: string; actions?: any[] }; hasMore?: boolean }
const props = defineProps<Props>()
const emit = defineEmits<{ action: [action:string, item?:any]; itemClick: [item:any]; loadMore: [] }>()

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
</script>


