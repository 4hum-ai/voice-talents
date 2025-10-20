<template>
  <div
    class="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
  >
    <!-- Table Header with Actions -->
    <div
      v-if="showHeader"
      class="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-700"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ title }}
          </h3>
          <span v-if="showCount" class="text-sm text-gray-500 dark:text-gray-400">
            {{ totalItems }} items
          </span>
        </div>

        <div class="flex items-center space-x-3">
          <!-- Bulk Actions -->
          <div v-if="selectedItems.length > 0" class="flex items-center space-x-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ selectedItems.length }} selected
            </span>
            <Button variant="outline" size="sm" @click="bulkAction('delete')">
              <Icon name="mdi:delete" class="h-4 w-4" />
              Delete
            </Button>
            <Button variant="outline" size="sm" @click="bulkAction('export')">
              <Icon name="mdi:download" class="h-4 w-4" />
              Export
            </Button>
          </div>

          <!-- View Toggle -->
          <div class="flex items-center rounded-md border border-gray-300 dark:border-gray-600">
            <Button
              variant="ghost"
              size="sm"
              :class="{ 'bg-white shadow-sm dark:bg-gray-800': viewMode === 'table' }"
              @click="viewMode = 'table'"
            >
              <Icon name="mdi:view-list" class="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              :class="{ 'bg-white shadow-sm dark:bg-gray-800': viewMode === 'grid' }"
              @click="viewMode = 'grid'"
            >
              <Icon name="mdi:view-grid" class="h-4 w-4" />
            </Button>
          </div>

          <!-- Refresh Button -->
          <Button variant="ghost" size="sm" @click="refresh" :loading="loading">
            <Icon name="mdi:refresh" class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-8">
      <SkeletonLoader variant="table" :rows="5" :columns="columns.length" />
    </div>

    <!-- Table View -->
    <div v-else-if="viewMode === 'table'" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <!-- Select All Checkbox -->
            <th v-if="selectable" class="px-6 py-3 text-left">
              <input
                type="checkbox"
                :checked="allSelected"
                :indeterminate="someSelected"
                @change="toggleSelectAll"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
              />
            </th>

            <!-- Column Headers -->
            <th
              v-for="column in columns"
              :key="column.key"
              class="cursor-pointer px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
              @click="sort(column.key)"
            >
              <div class="flex items-center space-x-1">
                <span>{{ column.label }}</span>
                <div class="flex flex-col">
                  <Icon
                    name="mdi:chevron-up"
                    :class="[
                      'h-3 w-3',
                      sortKey === column.key && sortDirection === 'asc'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-400',
                    ]"
                  />
                  <Icon
                    name="mdi:chevron-down"
                    :class="[
                      '-mt-1 h-3 w-3',
                      sortKey === column.key && sortDirection === 'desc'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-400',
                    ]"
                  />
                </div>
              </div>
            </th>

            <!-- Actions Column -->
            <th
              v-if="showActions"
              class="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          <tr
            v-for="(item, index) in paginatedData"
            :key="getItemKey(item, index)"
            class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <!-- Select Checkbox -->
            <td v-if="selectable" class="px-6 py-4 whitespace-nowrap">
              <input
                type="checkbox"
                :checked="isSelected(item)"
                @change="toggleSelect(item)"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
              />
            </td>

            <!-- Data Cells -->
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap"
              :class="column.className"
            >
              <slot
                :name="`cell-${column.key}`"
                :item="item"
                :value="getNestedValue(item, column.key)"
                :column="column"
              >
                <span class="text-sm text-gray-900 dark:text-white">
                  {{ formatCellValue(getNestedValue(item, column.key), column) }}
                </span>
              </slot>
            </td>

            <!-- Actions Cell -->
            <td
              v-if="showActions"
              class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap"
            >
              <div class="flex items-center justify-end space-x-2">
                <slot name="actions" :item="item" :index="index">
                  <Button variant="ghost" size="sm" @click="editItem(item)">
                    <Icon name="mdi:pencil" class="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" @click="deleteItem(item)">
                    <Icon name="mdi:delete" class="h-4 w-4" />
                  </Button>
                </slot>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Grid View -->
    <div v-else class="p-6">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(item, index) in paginatedData"
          :key="getItemKey(item, index)"
          class="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <slot name="grid-item" :item="item" :index="index">
            <div class="space-y-2">
              <h4 class="font-medium text-gray-900 dark:text-white">
                {{ getNestedValue(item, 'title') || 'Item' }}
              </h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ getNestedValue(item, 'description') || 'No description' }}
              </p>
            </div>
          </slot>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="showPagination && totalPages > 1"
      class="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-700"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center text-sm text-gray-700 dark:text-gray-300">
          <span>
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
            {{ Math.min(currentPage * itemsPerPage, totalItems) }} of {{ totalItems }} results
          </span>
        </div>

        <div class="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
          >
            <Icon name="mdi:chevron-left" class="h-4 w-4" />
          </Button>

          <div class="flex items-center space-x-1">
            <Button
              v-for="page in visiblePages"
              :key="page"
              :variant="page === currentPage ? 'primary' : 'outline'"
              size="sm"
              @click="goToPage(page)"
              class="h-8 w-8 p-0"
            >
              {{ page }}
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
          >
            <Icon name="mdi:chevron-right" class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import SkeletonLoader from '@/components/atoms/SkeletonLoader.vue'

interface Column {
  key: string
  label: string
  sortable?: boolean
  className?: string
  formatter?: (value: any) => string
}

interface Props {
  data: any[]
  columns: Column[]
  title?: string
  loading?: boolean
  selectable?: boolean
  showActions?: boolean
  showHeader?: boolean
  showCount?: boolean
  showPagination?: boolean
  itemsPerPage?: number
  keyField?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  selectable: false,
  showActions: true,
  showHeader: true,
  showCount: true,
  showPagination: true,
  itemsPerPage: 10,
  keyField: 'id',
})

const emit = defineEmits<{
  sort: [key: string, direction: 'asc' | 'desc']
  select: [items: any[]]
  edit: [item: any]
  delete: [item: any]
  refresh: []
  bulkAction: [action: string, items: any[]]
}>()

// State
const currentPage = ref(1)
const sortKey = ref('')
const sortDirection = ref<'asc' | 'desc'>('asc')
const selectedItems = ref<any[]>([])
const viewMode = ref<'table' | 'grid'>('table')

// Computed
const totalItems = computed(() => props.data.length)
const totalPages = computed(() => Math.ceil(totalItems.value / props.itemsPerPage))

const sortedData = computed(() => {
  if (!sortKey.value) return props.data

  return [...props.data].sort((a, b) => {
    const aVal = getNestedValue(a, sortKey.value)
    const bVal = getNestedValue(b, sortKey.value)

    if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return sortedData.value.slice(start, end)
})

const allSelected = computed(() => {
  return selectedItems.value.length === paginatedData.value.length && paginatedData.value.length > 0
})

const someSelected = computed(() => {
  return selectedItems.value.length > 0 && selectedItems.value.length < paginatedData.value.length
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
const getItemKey = (item: any, index: number) => {
  return item[props.keyField] || index
}

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

const formatCellValue = (value: any, column: Column) => {
  if (column.formatter) {
    return column.formatter(value)
  }

  if (value === null || value === undefined) {
    return '-'
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  return String(value)
}

const sort = (key: string) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }

  emit('sort', key, sortDirection.value)
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedItems.value = []
  } else {
    selectedItems.value = [...paginatedData.value]
  }

  emit('select', selectedItems.value)
}

const toggleSelect = (item: any) => {
  const index = selectedItems.value.findIndex(
    (selected) => getItemKey(selected, 0) === getItemKey(item, 0),
  )

  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(item)
  }

  emit('select', selectedItems.value)
}

const isSelected = (item: any) => {
  return selectedItems.value.some((selected) => getItemKey(selected, 0) === getItemKey(item, 0))
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const editItem = (item: any) => {
  emit('edit', item)
}

const deleteItem = (item: any) => {
  emit('delete', item)
}

const refresh = () => {
  emit('refresh')
}

const bulkAction = (action: string) => {
  emit('bulkAction', action, selectedItems.value)
}

// Watch for data changes
watch(
  () => props.data,
  () => {
    currentPage.value = 1
    selectedItems.value = []
  },
)
</script>
