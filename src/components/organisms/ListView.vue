<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="column in config.columns"
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors duration-150"
              :class="[
                column.sortable ? 'cursor-pointer hover:bg-gray-100' : '',
                column.align ? `text-${column.align}` : 'text-left'
              ]"
              @click="column.sortable ? handleSort(column.key) : null"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="item in sortedData"
            :key="item.id"
            class="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
            @click="handleRowClick(item)"
            :title="`Click to view ${item.name || item.title || 'details'}`"
          >
            <td
              v-for="column in config.columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap"
              :class="column.align ? `text-${column.align}` : ''"
            >
              <div v-if="column.key==='actions'" class="flex items-center justify-end space-x-2">
                <button
                  v-for="action in config.actions"
                  :key="action.name"
                  @click.stop="handleAction(action.name, item)"
                  class="px-2 py-1 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {{ action.label }}
                </button>
              </div>
              <div v-else>{{ formatCellValue(item[column.key], column) }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type Props = { data: any[]; config: { columns: any[]; actions: any[] } }
const props = defineProps<Props>()
const emit = defineEmits<{ action: [action:string, item?:any]; sort: [field:string, direction:'asc'|'desc']; itemClick: [item:any] }>()

const sortField = ref('')
const sortDirection = ref<'asc'|'desc'>('asc')

const sortedData = computed(() => {
  const d = [...props.data]
  if (sortField.value) {
    d.sort((a,b) => {
      const av = a[sortField.value]
      const bv = b[sortField.value]
      return sortDirection.value === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
    })
  }
  return d
})

const handleSort = (field:string) => {
  if (sortField.value === field) sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  else { sortField.value = field; sortDirection.value = 'asc' }
  emit('sort', field, sortDirection.value)
}

const handleAction = (action:string, item?:any) => emit('action', action, item)
const handleRowClick = (item:any) => emit('itemClick', item)

const toDate = (v: any): Date | null => {
  if (v instanceof Date) return v
  if (typeof v === 'string' || typeof v === 'number') {
    const d = new Date(v)
    return isNaN(d.getTime()) ? null : d
  }
  if (v && typeof v === 'object') {
    // Support Firestore-like timestamp
    const seconds = (v._seconds ?? v.seconds)
    const nanos = (v._nanoseconds ?? v.nanoseconds ?? 0)
    if (typeof seconds === 'number') {
      const ms = seconds * 1000 + Math.floor(nanos / 1e6)
      const d = new Date(ms)
      return isNaN(d.getTime()) ? null : d
    }
  }
  return null
}

const formatCellValue = (value:any, column:any) => {
  if (value === null || value === undefined) return '-'
  switch (column.type) {
    case 'date': {
      const d = toDate(value)
      if (!d) return '-'
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }
    case 'boolean': return value ? 'Yes' : 'No'
    case 'array': return Array.isArray(value) ? value.join(', ') : value
    case 'percentage': {
      const num = typeof value === 'string' ? parseFloat(value) : value
      if (isNaN(num)) return '-'
      const pct = num < 1 ? num * 100 : num
      return `${pct.toFixed(1)}%`
    }
    case 'currency': {
      const num = typeof value === 'string' ? parseFloat(value) : value
      if (isNaN(num)) return '-'
      return num.toLocaleString('en-US', { style:'currency', currency:'USD', minimumFractionDigits:2, maximumFractionDigits:2 })
    }
    case 'number': {
      const num = typeof value === 'string' ? parseFloat(value) : value
      if (isNaN(num)) return '-'
      return num.toLocaleString('en-US')
    }
    default: return String(value)
  }
}
</script>


