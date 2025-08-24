<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th v-if="selectable" class="px-6 py-3">
              <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
            </th>
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
            <td v-if="selectable" class="px-6 py-4 whitespace-nowrap" @click.stop>
              <input type="checkbox" :checked="isSelected(item)" @change="toggleSelectRow(item)" />
            </td>
            <td
              v-for="column in config.columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap"
              :class="column.align ? `text-${column.align}` : ''"
            >
              <div v-if="column.key==='actions'" class="flex items-center justify-end">
                <ActionsMenu
                  :items="config.actions.map(a => ({ key: a.name, label: a.label }))"
                  size="sm"
                  @select="key => handleAction(key, item)"
                />
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
import ActionsMenu from '@/components/atoms/ActionsMenu.vue'

type Props = { data: any[]; config: { columns: any[]; actions: any[] }; selectable?: boolean; rowIdKey?: string }
const props = withDefaults(defineProps<Props>(), { selectable: true, rowIdKey: 'id' })
const emit = defineEmits<{ action: [action:string, item?:any]; sort: [field:string, direction:'asc'|'desc']; itemClick: [item:any]; 'selection-change': [ids:(string|number)[]] }>()

const sortField = ref('')
const sortDirection = ref<'asc'|'desc'>('asc')
const selectedIds = ref<Set<string|number>>(new Set())

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

const getRowId = (item:any): string|number => item?.[props.rowIdKey as string]
const isSelected = (item:any): boolean => selectedIds.value.has(getRowId(item))
const allSelected = computed(() => sortedData.value.length > 0 && sortedData.value.every(it => selectedIds.value.has(getRowId(it))))
const toggleSelectRow = (item:any) => {
  const id = getRowId(item)
  if (selectedIds.value.has(id)) selectedIds.value.delete(id)
  else selectedIds.value.add(id)
  emit('selection-change', Array.from(selectedIds.value))
}
const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedIds.value.clear()
  } else {
    sortedData.value.forEach(it => selectedIds.value.add(getRowId(it)))
  }
  emit('selection-change', Array.from(selectedIds.value))
}

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


