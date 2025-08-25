<template>
  <div class="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th v-if="selectable" class="px-6 py-3">
              <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
            </th>
            <th
              v-for="column in visibleColumns"
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-150"
              :class="[
                column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : '',
                column.align ? `text-${column.align}` : 'text-left'
              ]"
              :style="{ width: column.width || undefined }"
              @click="column.sortable ? handleSort(column.key) : null"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="item in sortedData"
            :key="item.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-150"
            @click="handleRowClick(item)"
            :title="`Click to view ${item.name || item.title || 'details'}`"
          >
            <td v-if="selectable" class="px-6 py-4 whitespace-nowrap" @click.stop>
              <input type="checkbox" :checked="isSelected(item)" @change="toggleSelectRow(item)" />
            </td>
            <td
              v-for="column in visibleColumns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100"
              :class="column.align ? `text-${column.align}` : ''"
              :style="{ width: column.width || undefined }"
            >
              <div v-if="column.key==='actions'" class="flex items-center justify-end">
                <ActionsMenu
                  :items="config.actions.map(a => ({ key: a.name, label: a.label }))"
                  size="sm"
                  @select="key => handleAction(key, item)"
                />
              </div>
              <div v-else>
                <!-- Title/Subtitle rendering if configured -->
                <div v-if="column.titleField" class="flex items-center gap-3">
                  <div class="min-w-0">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ getTitle(item, column) }}</div>
                    <div v-if="getSubtitle(item, column)" class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ getSubtitle(item, column) }}</div>
                  </div>
                </div>
                <!-- Country formatter with flag -->
                <div v-else-if="column.formatter==='country'" class="flex items-center gap-2">
                  <div v-if="countryCode(item[column.key])" class="shrink-0">
                    <picture>
                      <source :srcset="`https://flagcdn.com/${countryCode(item[column.key])}.svg`" type="image/svg+xml" />
                      <img :src="`https://flagcdn.com/24x18/${countryCode(item[column.key])}.png`" alt="" width="24" height="18" class="rounded-sm" />
                    </picture>
                  </div>
                  <span class="text-sm text-gray-900 dark:text-gray-100">{{ countryName(item[column.key]) || item[column.key] || '-' }}</span>
                </div>
                <!-- Image type -->
                <div v-else-if="column.type==='image'" class="flex items-center">
                  <img :src="item[column.key]" alt="" class="h-8 w-8 rounded object-cover bg-gray-100 dark:bg-gray-800" />
                </div>
                <!-- URL type -->
                <div v-else-if="column.type==='url'">
                  <a :href="item[column.key]" target="_blank" rel="noopener" class="text-primary-600 dark:text-primary-400 hover:underline">{{ item[column.key] }}</a>
                </div>
                <!-- Color type -->
                <div v-else-if="column.type==='color'" class="flex items-center gap-2">
                  <span class="inline-block h-4 w-4 rounded border border-gray-300 dark:border-gray-700" :style="{ backgroundColor: String(item[column.key] || '#ffffff') }"></span>
                  <span class="text-sm text-gray-900 dark:text-gray-100">{{ String(item[column.key] || '-') }}</span>
                </div>
                <!-- Badge formatter -->
                <div v-else-if="column.formatter==='badge'">
                  <span :class="['inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', badgeClass(item[column.key])]">{{ item[column.key] ?? '-' }}</span>
                </div>
                <!-- Status formatter -->
                <div v-else-if="column.formatter==='status'" class="inline-flex items-center gap-2">
                  <span :class="['h-2 w-2 rounded-full', statusDotClass(item[column.key])]" />
                  <span :class="['text-xs font-medium px-2 py-0.5 rounded', statusBadgeClass(item[column.key])]">{{ item[column.key] ?? '-' }}</span>
                </div>
                <!-- Date/Number/Currency/Boolean/Text fallback via formatter utility -->
                <div v-else class="text-gray-900 dark:text-gray-100">{{ formatCellValue(item[column.key], column, item) }}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="hasPagination" class="border-t border-gray-200 dark:border-gray-700">
      <Pagination
        :current-page="Number(currentPage) || 1"
        :total-pages="Number(totalPages) || 1"
        :total="Number(total) || 0"
        :per-page="Number(perPage) || 10"
        @page-change="onPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Pagination from '@/components/molecules/Pagination.vue'
import ActionsMenu from '@/components/atoms/ActionsMenu.vue'
import { getCountryByCode } from '@/utils/countries'

type Props = { data: any[]; config: { columns: any[]; actions: any[] }; selectable?: boolean; rowIdKey?: string; currentPage?: number; totalPages?: number; total?: number; perPage?: number }
const props = withDefaults(defineProps<Props>(), { selectable: true, rowIdKey: 'id' })
const emit = defineEmits<{ action: [action:string, item?:any]; sort: [field:string, direction:'asc'|'desc']; itemClick: [item:any]; 'selection-change': [ids:(string|number)[]]; 'page-change': [page:number] }>()

const sortField = ref('')
const sortDirection = ref<'asc'|'desc'>('asc')
const selectedIds = ref<Set<string|number>>(new Set())

const visibleColumns = computed(() => (props.config?.columns || []).filter((c: any) => !c.hidden))

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

const hasPagination = computed(() => {
  const total = Number(props.total)
  const totalPages = Number(props.totalPages)
  return !isNaN(total) && total > 0 && !isNaN(totalPages) && totalPages >= 1
})
const onPageChange = (page:number) => emit('page-change', page)

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

const formatCellValue = (value:any, column:any, item?: any) => {
  if (value === null || value === undefined) return '-'
  // Prefer formatter when provided
  switch (column.formatter) {
    case 'date': {
      const d = toDate(value); if (!d) return '-'
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }
    case 'currency': {
      const num = typeof value === 'string' ? parseFloat(value) : value
      if (isNaN(num)) return '-'
      return num.toLocaleString('en-US', { style:'currency', currency: (item?.currency || 'USD'), minimumFractionDigits:2, maximumFractionDigits:2 })
    }
    case 'number': {
      const num = typeof value === 'string' ? parseFloat(value) : value
      if (isNaN(num)) return '-'
      return num.toLocaleString('en-US')
    }
    case 'rating': {
      const num = typeof value === 'string' ? parseFloat(value) : value
      if (isNaN(num)) return '-'
      return `${num.toFixed(1)} / 5`
    }
    case 'badge': // handled in template
    case 'status': // handled in template
    case 'country': // handled in template
      return String(value ?? '-')
  }
  // Fallback to type-based formatting
  switch (column.type) {
    case 'date': {
      const d = toDate(value); if (!d) return '-'
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }
    case 'number': {
      const num = typeof value === 'string' ? parseFloat(value) : value
      if (isNaN(num)) return '-'
      return num.toLocaleString('en-US')
    }
    case 'boolean': return value ? 'Yes' : 'No'
    case 'array': return Array.isArray(value) ? value.join(', ') : String(value)
    case 'object': return JSON.stringify(value)
    default: return String(value)
  }
}

const getTitle = (item:any, column:any): string => {
  const key = column.titleField || column.key
  const val = item?.[key]
  if (val === null || val === undefined) return '-'
  return String(val)
}

const getSubtitle = (item:any, column:any): string => {
  const key = column.subtitleField
  if (!key) return ''
  const val = item?.[key]
  if (val === null || val === undefined) return ''
  return String(val)
}

const badgeClass = (value:any): string => {
  const v = String(value || '').toLowerCase()
  if (['active','success','paid','publisher','large','enterprise'].includes(v)) return 'bg-green-100 text-green-800'
  if (['pending','warning','medium'].includes(v)) return 'bg-yellow-100 text-yellow-800'
  if (['inactive','secondary','small','startup'].includes(v)) return 'bg-gray-100 text-gray-800'
  if (['suspended','error','failed'].includes(v)) return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

const statusDotClass = (value:any): string => {
  const v = String(value || '').toLowerCase()
  if (['active','success','paid','online'].includes(v)) return 'bg-green-500'
  if (['pending','warning'].includes(v)) return 'bg-yellow-500'
  if (['inactive','offline'].includes(v)) return 'bg-gray-400'
  if (['suspended','error','failed'].includes(v)) return 'bg-red-500'
  return 'bg-gray-400'
}

const statusBadgeClass = (value:any): string => {
  const v = String(value || '').toLowerCase()
  if (['active','success','paid','online'].includes(v)) return 'bg-green-50 text-green-700 border border-green-200'
  if (['pending','warning'].includes(v)) return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
  if (['inactive','offline'].includes(v)) return 'bg-gray-50 text-gray-700 border border-gray-200'
  if (['suspended','error','failed'].includes(v)) return 'bg-red-50 text-red-700 border border-red-200'
  return 'bg-gray-50 text-gray-700 border border-gray-200'
}

const countryCode = (raw:any): string | '' => {
  if (!raw) return ''
  const val = String(raw).trim()
  if (val.length === 2) return val.toLowerCase()
  const c = getCountryByCode(val)
  if (c) return c.code.toLowerCase()
  return ''
}

const countryName = (raw:any): string => {
  if (!raw) return ''
  const val = String(raw).trim()
  const c = getCountryByCode(val)
  return c?.name || val
}
</script>


