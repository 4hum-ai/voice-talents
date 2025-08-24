<template>
  <div class="flex items-center justify-between px-4 py-3 border border-gray-200 dark:border-gray-700 border-t-0 bg-white dark:bg-gray-900 rounded-b-lg">
    <div class="text-sm text-gray-700 dark:text-gray-300">
      Showing <span class="font-medium">{{ startItem }}</span> to <span class="font-medium">{{ endItem }}</span> of <span class="font-medium">{{ safeTotal }}</span> results
    </div>
    <div class="flex items-center gap-1">
      <button
        class="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="safeCurrentPage<=1"
        @click="goToPage(1)">
        First
      </button>
      <button
        class="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="safeCurrentPage<=1"
        @click="goToPage(safeCurrentPage-1)">
        Prev
      </button>

      <button
        v-for="p in pages"
        :key="`page-${p.key}`"
        class="px-3 py-1 text-sm rounded border transition-colors"
        :class="p.isEllipsis
          ? 'border-transparent text-gray-400 dark:text-gray-500 cursor-default'
          : (p.value===safeCurrentPage
              ? 'border-primary-600 bg-primary-50 text-primary-700'
              : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700')"
        :disabled="p.isEllipsis"
        @click="!p.isEllipsis && goToPage(p.value)">
        {{ p.label }}
      </button>

      <button
        class="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="safeCurrentPage>=safeTotalPages"
        @click="goToPage(safeCurrentPage+1)">
        Next
      </button>
      <button
        class="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="safeCurrentPage>=safeTotalPages"
        @click="goToPage(safeTotalPages)">
        Last
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  currentPage: number
  totalPages: number
  total: number
  perPage: number
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e:'page-change', page:number): void }>()

const safeTotal = computed(() => Number(props.total) || 0)
const safePerPage = computed(() => Math.max(1, Number(props.perPage) || 10))
const safeCurrentPage = computed(() => Math.max(1, Number(props.currentPage) || 1))
const safeTotalPages = computed(() => Number(props.totalPages) || Math.max(1, Math.ceil(safeTotal.value / safePerPage.value)))

const startItem = computed(() => {
  if (safeTotal.value === 0) return 0
  return (safeCurrentPage.value - 1) * safePerPage.value + 1
})
const endItem = computed(() => Math.min(safeCurrentPage.value * safePerPage.value, safeTotal.value))

const pages = computed(() => {
  const total = safeTotalPages.value
  const current = safeCurrentPage.value
  const windowSize = 1
  const items: Array<{ key: string; label: string; value: number; isEllipsis?: boolean }> = []
  const pushPage = (p:number) => items.push({ key: String(p), label: String(p), value: p })
  const pushEllipsis = (key:string) => items.push({ key, label: '…', value: -1, isEllipsis: true })

  if (total <= 7) {
    for (let p = 1; p <= total; p++) pushPage(p)
    return items
  }

  pushPage(1)
  if (current > 2 + windowSize) pushEllipsis('start')

  const start = Math.max(2, current - windowSize)
  const end = Math.min(total - 1, current + windowSize)
  for (let p = start; p <= end; p++) pushPage(p)

  if (current < total - (1 + windowSize)) pushEllipsis('end')
  pushPage(total)
  return items
})

const goToPage = (page:number) => {
  if (page >= 1 && page <= safeTotalPages.value && page !== safeCurrentPage.value) emit('page-change', page)
}
</script>


