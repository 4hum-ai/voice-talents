<template>
  <div class="space-y-4">
    <!-- Search Input with Filters Toggle -->
    <div class="flex items-center space-x-3">
      <div class="relative flex-1">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon name="mdi:magnify" class="h-5 w-5 text-gray-400" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="placeholder"
          class="block w-full rounded-lg border border-gray-300 bg-white py-3 pr-12 pl-10 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          @input="handleSearch"
          @keydown.enter="handleSearch"
        />
        <div class="absolute inset-y-0 right-0 flex items-center pr-3">
          <Button v-if="searchQuery" variant="ghost" size="sm" @click="clearSearch" class="p-1">
            <Icon name="mdi:close" class="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        @click="toggleFilters"
        :class="{ 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900': showFilters }"
      >
        <Icon name="mdi:filter" class="h-4 w-4" />
        Filters
        <span
          v-if="activeFiltersCount > 0"
          class="ml-2 rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white"
        >
          {{ activeFiltersCount }}
        </span>
      </Button>

      <Button
        v-if="showSaveSearch"
        variant="ghost"
        size="sm"
        @click="saveSearch"
        :disabled="!searchQuery && activeFiltersCount === 0"
      >
        <Icon name="mdi:bookmark-outline" class="h-4 w-4" />
        Save
      </Button>
    </div>

    <!-- Advanced Filters Panel -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 transform -translate-y-2"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform -translate-y-2"
    >
      <div
        v-if="showFilters"
        class="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <!-- Category Filter -->
          <div v-if="filters.category">
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <SelectInput
              v-model="selectedFilters.category"
              :options="categoryOptions"
              placeholder="All Categories"
              @update:model-value="handleFilterChange"
            />
          </div>

          <!-- Type Filter -->
          <div v-if="filters.type">
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Type
            </label>
            <SelectInput
              v-model="selectedFilters.type"
              :options="typeOptions"
              placeholder="All Types"
              @update:model-value="handleFilterChange"
            />
          </div>

          <!-- Status Filter -->
          <div v-if="filters.status">
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <SelectInput
              v-model="selectedFilters.status"
              :options="statusOptions"
              placeholder="All Statuses"
              @update:model-value="handleFilterChange"
            />
          </div>

          <!-- Date Range Filter -->
          <div v-if="filters.dateRange" class="md:col-span-2">
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date Range
            </label>
            <div class="flex items-center space-x-2">
              <input
                v-model="selectedFilters.dateFrom"
                type="date"
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                @change="handleFilterChange"
              />
              <span class="text-gray-500 dark:text-gray-400">to</span>
              <input
                v-model="selectedFilters.dateTo"
                type="date"
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                @change="handleFilterChange"
              />
            </div>
          </div>

          <!-- Tags Filter -->
          <div v-if="filters.tags" class="md:col-span-2 lg:col-span-3">
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tags
            </label>
            <div class="flex flex-wrap gap-2">
              <Chip
                v-for="tag in availableTags"
                :key="tag"
                :variant="selectedFilters.tags?.includes(tag) ? 'primary' : 'outline'"
                size="sm"
                @click="toggleTag(tag)"
                class="cursor-pointer"
              >
                {{ tag }}
              </Chip>
            </div>
          </div>
        </div>

        <!-- Filter Actions -->
        <div
          class="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700"
        >
          <Button
            variant="ghost"
            size="sm"
            @click="clearAllFilters"
            :disabled="activeFiltersCount === 0"
          >
            <Icon name="mdi:close" class="h-4 w-4" />
            Clear All
          </Button>

          <div class="flex items-center space-x-2">
            <Button variant="outline" size="sm" @click="applyFilters"> Apply Filters </Button>
            <Button variant="primary" size="sm" @click="searchWithFilters"> Search </Button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Search Results Summary -->
    <div
      v-if="showResultsSummary && (searchQuery || activeFiltersCount > 0)"
      class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400"
    >
      <div class="flex items-center space-x-4">
        <span> {{ resultsCount }} results found </span>
        <span v-if="searchQuery" class="flex items-center">
          for "<span class="font-medium text-gray-900 dark:text-white">{{ searchQuery }}</span
          >"
        </span>
      </div>

      <div class="flex items-center space-x-2">
        <Button variant="ghost" size="sm" @click="exportResults" v-if="showExport">
          <Icon name="mdi:download" class="h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import Chip from '@/components/atoms/Chip.vue'

interface FilterOptions {
  category?: boolean
  type?: boolean
  status?: boolean
  dateRange?: boolean
  tags?: boolean
}

interface SearchFilters {
  category?: string
  type?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  tags?: string[]
}

interface Props {
  placeholder?: string
  filters?: FilterOptions
  showSaveSearch?: boolean
  showResultsSummary?: boolean
  showExport?: boolean
  resultsCount?: number
  categoryOptions?: Array<{ value: string; label: string }>
  typeOptions?: Array<{ value: string; label: string }>
  statusOptions?: Array<{ value: string; label: string }>
  availableTags?: string[]
}

withDefaults(defineProps<Props>(), {
  placeholder: 'Search...',
  filters: () => ({
    category: true,
    type: true,
    status: true,
    dateRange: true,
    tags: true,
  }),
  showSaveSearch: true,
  showResultsSummary: true,
  showExport: false,
  resultsCount: 0,
  categoryOptions: () => [
    { value: '', label: 'All Categories' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'audiobook', label: 'Audiobook' },
    { value: 'animation', label: 'Animation' },
    { value: 'video_game', label: 'Video Game' },
  ],
  typeOptions: () => [
    { value: '', label: 'All Types' },
    { value: 'voice_sample', label: 'Voice Sample' },
    { value: 'project', label: 'Project' },
    { value: 'casting', label: 'Casting Call' },
  ],
  statusOptions: () => [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
  ],
  availableTags: () => ['English', 'Spanish', 'Male', 'Female', 'Commercial', 'Narration'],
})

const emit = defineEmits<{
  search: [query: string, filters: SearchFilters]
  filterChange: [filters: SearchFilters]
  saveSearch: [query: string, filters: SearchFilters]
  exportResults: []
}>()

// State
const searchQuery = ref('')
const showFilters = ref(false)
const selectedFilters = ref<SearchFilters>({
  category: '',
  type: '',
  status: '',
  dateFrom: '',
  dateTo: '',
  tags: [],
})

// Computed
const activeFiltersCount = computed(() => {
  let count = 0
  if (selectedFilters.value.category) count++
  if (selectedFilters.value.type) count++
  if (selectedFilters.value.status) count++
  if (selectedFilters.value.dateFrom || selectedFilters.value.dateTo) count++
  if (selectedFilters.value.tags && selectedFilters.value.tags.length > 0) count++
  return count
})

// Methods
const handleSearch = () => {
  emit('search', searchQuery.value, selectedFilters.value)
}

const handleFilterChange = () => {
  emit('filterChange', selectedFilters.value)
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const clearSearch = () => {
  searchQuery.value = ''
  handleSearch()
}

const clearAllFilters = () => {
  selectedFilters.value = {
    category: '',
    type: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    tags: [],
  }
  handleFilterChange()
}

const toggleTag = (tag: string) => {
  if (!selectedFilters.value.tags) {
    selectedFilters.value.tags = []
  }

  const index = selectedFilters.value.tags.indexOf(tag)
  if (index > -1) {
    selectedFilters.value.tags.splice(index, 1)
  } else {
    selectedFilters.value.tags.push(tag)
  }

  handleFilterChange()
}

const applyFilters = () => {
  handleFilterChange()
}

const searchWithFilters = () => {
  handleSearch()
}

const saveSearch = () => {
  emit('saveSearch', searchQuery.value, selectedFilters.value)
}

const exportResults = () => {
  emit('exportResults')
}

// Watch for external filter changes
watch(
  () => selectedFilters.value,
  () => {
    handleFilterChange()
  },
  { deep: true },
)
</script>
