<template>
  <div style="background:#0f1116; border:1px solid #1e2130; border-radius:8px; overflow:hidden">
    <div style="overflow:auto">
      <table style="width:100%; border-collapse:collapse">
        <thead>
          <tr style="background:#111318; color:#a0a0a7">
            <th v-for="column in config.columns" :key="column.key" @click="column.sortable ? handleSort(column.key) : null" style="text-align:left; font-size:12px; padding:12px; cursor:pointer">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in sortedData" :key="item.id" @click="handleRowClick(item)" style="border-top:1px solid #1e2130; cursor:pointer" title="Click to view details">
            <td v-for="column in config.columns" :key="column.key" style="padding:12px;">
              <div v-if="column.key==='actions'" style="display:flex; gap:8px; justify-content:flex-end">
                <button v-for="action in config.actions" :key="action.name" @click.stop="handleAction(action.name, item)">{{ action.label }}</button>
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

interface Props { data: any[]; config: { columns: any[]; actions: any[] } }
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

const formatCellValue = (value:any, column:any) => {
  if (value === null || value === undefined) return '-'
  switch (column.type) {
    case 'date': {
      const dateValue = typeof value === 'string' ? new Date(value) : value
      if (isNaN(dateValue.getTime())) return '-'
      return dateValue.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
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


