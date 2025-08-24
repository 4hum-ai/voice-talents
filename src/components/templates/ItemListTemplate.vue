<template>
  <div class="min-h-screen">
    <!-- Fixed App Bar -->
    <div class="fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
      <div class="px-4 py-3">
        <div class="flex items-center gap-2">
          <button @click="goBack" class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 h-9 w-9" aria-label="Go back">
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.78 15.53a.75.75 0 01-1.06 0l-5-5a.75.75 0 010-1.06l5-5a.75.75 0 111.06 1.06L8.31 10l4.47 4.47a.75.75 0 010 1.06z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- Normal state -->
          <template v-if="!isSearchOpen">
            <div class="min-w-0 flex-1">
              <div class="text-base font-semibold text-gray-900 truncate">
                <slot name="title">{{ uiConfig?.displayName || moduleName }}</slot>
              </div>
              <div class="text-xs text-gray-500 truncate">
                <slot name="subtitle">{{ uiConfig?.description }}</slot>
              </div>
            </div>
            <div class="ml-auto flex items-center gap-2">
              <button
                v-if="hasCreateAction"
                @click="handleAction('create')"
                class="hidden sm:inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                + Add {{ displayNameSingular }}
              </button>
              <button
                v-if="hasCreateAction"
                @click="handleAction('create')"
                class="sm:hidden inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 h-9 w-9"
                aria-label="Add"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 6.75a.75.75 0 01.75.75v3.75H16.5a.75.75 0 010 1.5h-3.75V16.5a.75.75 0 01-1.5 0v-3.75H7.5a.75.75 0 010-1.5h3.75V7.5A.75.75 0 0112 6.75z" />
                </svg>
              </button>
              <button @click="openSearch" class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 h-9 w-9" aria-label="Search">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 104.243 11.93l3.788 3.789a.75.75 0 101.06-1.06l-3.788-3.79A6.75 6.75 0 0010.5 3.75zm-5.25 6.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <ActionsMenu :items="layoutMenuItems" size="md" @select="handleLayoutSelect">
                <template #label>
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M3 5.25A2.25 2.25 0 015.25 3h4.5A2.25 2.25 0 0112 5.25v4.5A2.25 2.25 0 019.75 12h-4.5A2.25 2.25 0 013 9.75v-4.5zM12 14.25A2.25 2.25 0 0114.25 12h4.5A2.25 2.25 0 0121 14.25v4.5A2.25 2.25 0 0118.75 21h-4.5A2.25 2.25 0 0112 18.75v-4.5zM3 14.25A2.25 2.25 0 015.25 12h4.5A2.25 2.25 0 0112 14.25v4.5A2.25 2.25 0 019.75 21h-4.5A2.25 2.25 0 013 18.75v-4.5zM14.25 3A2.25 2.25 0 0012 5.25v4.5A2.25 2.25 0 0014.25 12h4.5A2.25 2.25 0 0021 9.75v-4.5A2.25 2.25 0 0018.75 3h-4.5z" />
                  </svg>
                </template>
              </ActionsMenu>
            </div>
          </template>

          <!-- Search state -->
          <template v-else>
            <div class="min-w-0 flex-1">
              <input v-model="searchQuery" :placeholder="`Search ${moduleName}...`" class="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div class="hidden sm:flex items-center gap-2">
              <div class="inline-flex items-center gap-2 text-sm text-gray-600">
                <label class="text-xs text-gray-500">Fields</label>
                <select class="px-2 py-1.5 border border-gray-300 rounded-md text-sm">
                  <option value="all">All fields</option>
                </select>
              </div>
              <button class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300">Filters</button>
            </div>
            <button @click="closeSearch" class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 h-9 w-9" aria-label="Close search">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M6.225 4.811a.75.75 0 011.06 0L12 9.525l4.715-4.714a.75.75 0 111.06 1.06L13.06 10.586l4.715 4.714a.75.75 0 11-1.06 1.06L12 11.646l-4.715 4.714a.75.75 0 11-1.06-1.06l4.714-4.714-4.714-4.715a.75.75 0 010-1.06z" clip-rule="evenodd" />
              </svg>
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Spacer for fixed header -->
    <div class="h-16"></div>

    <main class="p-4">
      <!-- Selection toolbar (only when some are selected) -->
      <div v-if="currentView === 'list' && selectedIds.length > 0" class="mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
        <div class="text-xs text-gray-600">{{ selectedIds.length }} selected</div>
        <button @click="handleBulkDelete" class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Delete</button>
      </div>

      <StatsView v-if="uiConfig?.features?.stats" :stats="uiConfig.features.stats" :data="data" />

      <div :style="{ minHeight: contentMinHeight }">
        <div v-if="loading">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div class="animate-pulse">
              <div class="h-10 bg-gray-100 border-b border-gray-200"></div>
              <div class="divide-y divide-gray-200">
                <div v-for="n in skeletonRows" :key="n" class="h-12 bg-gray-50"></div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="error" class="text-sm text-red-600">{{ error }}</div>
        <div v-else>
          <TableView v-if="currentView === 'list' && uiConfig?.views?.list && filteredData.length > 0" :key="'view-list'" :data="filteredData" :config="uiConfig.views.list" @action="handleAction" @sort="handleSort" @item-click="handleItemClick" @selection-change="onSelectionChange" />
          <KanbanView v-else-if="currentView === 'kanban' && uiConfig?.views?.kanban && filteredData.length > 0" :key="'view-kanban'" :data="filteredData" :config="uiConfig.views.kanban" @action="handleAction" @item-click="handleItemClick" />
          <GalleryView v-else-if="currentView === 'gallery' && uiConfig?.views?.gallery && filteredData.length > 0" :key="'view-gallery'" :data="filteredData" :config="uiConfig.views.gallery" @action="handleAction" @item-click="handleItemClick" />
          <CalendarView v-else-if="currentView === 'calendar' && uiConfig?.views?.calendar && filteredData.length > 0" :key="'view-calendar'" :data="filteredData" :config="uiConfig.views.calendar" @action="handleAction" @item-click="handleItemClick" />
          <div v-else-if="filteredData.length === 0" class="py-16 text-center border border-dashed border-gray-200 rounded-lg bg-white">
            <div class="mx-auto h-12 w-12 text-gray-400" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-12 w-12 mx-auto">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h3 class="mt-4 text-sm font-semibold text-gray-900">{{ emptyTitle }}</h3>
            <p class="mt-1 text-sm text-gray-500">{{ emptySubtitle }}</p>
            <div class="mt-6 flex items-center justify-center gap-3">
              <button
                v-if="hasCreateAction && !searchQuery"
                @click="handleAction('create')"
                class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Add {{ displayNameSingular }}
              </button>
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
              >
                Clear search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <Pagination :current-page="pagination.currentPage" :total-pages="pagination.totalPages" :total="pagination.total" :per-page="pagination.perPage" @page-change="handlePageChange" />
      </div>
    </main>

    <DynamicFormSidebar v-if="showFormSidebar" :title="formSidebarTitle" :form-config="uiConfig?.formView" :initial-data="formSidebarData" :loading="formSidebarLoading" :submit-text="formSidebarSubmitText" :loading-text="formSidebarLoadingText" @close="closeFormSidebar" @submit="handleFormSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, unref, nextTick, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import Pagination from '@/components/molecules/Pagination.vue'
import DynamicFormSidebar from '@/components/molecules/DynamicFormSidebar.vue'
const TableView = defineAsyncComponent(() => import('@/components/organisms/TableView.vue'))
import KanbanView from '@/components/organisms/KanbanView.vue'
import GalleryView from '@/components/organisms/GalleryView.vue'
import CalendarView from '@/components/organisms/CalendarView.vue'
import StatsView from '@/components/organisms/StatsView.vue'
import ActionsMenu from '@/components/atoms/ActionsMenu.vue'
const router = useRouter()

interface Props {
  moduleName: string
  uiConfig?: any
  data?: any[]
  loading?: boolean
  error?: string | null
  currentPage?: number
  totalPages?: number
  totalItems?: number
  perPage?: number
  customCreateHandler?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  loading: false
})

const emit = defineEmits(['action', 'sort', 'page-change', 'create', 'bulk-delete'])

const currentView = ref('list')
const searchQuery = ref('')
const isSearchOpen = ref(false)
const selectedIds = ref<(string|number)[]>([])
const showFormSidebar = ref(false)
const formSidebarTitle = ref('')
const formSidebarData = ref<Record<string, any>>({})
const formSidebarLoading = ref(false)
const formSidebarSubmitText = ref('Create')
const formSidebarLoadingText = ref('Creating...')

// (Tabs removed in favor of layout menu)

const uiConfig = computed(() => unref(props.uiConfig))
const moduleName = computed(() => props.moduleName)
const data = computed(() => props.data || [])
const loading = computed(() => props.loading || false)
const error = computed(() => props.error || null)

const pagination = computed(() => {
  const perPage = Number(props.perPage ?? 10) || 10
  const providedTotal = Number(props.totalItems ?? 0) || 0
  const total = Math.max(providedTotal, data.value.length)
  const totalPages = props.totalPages ?? Math.max(1, Math.ceil((total || 0) / (perPage || 1)))
  return {
    currentPage: Number(props.currentPage ?? 1) || 1,
    totalPages,
    total,
    perPage
  }
})

const filteredData = computed(() => {
  let f = data.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    f = f.filter(item => Object.values(item).some(v => typeof v === 'string' && v.toLowerCase().includes(q)))
  }
  return f
})

const handleAction = (actionName: string, item?: any) => {
  if (actionName === 'create') {
    if (props.customCreateHandler) {
      emit('create')
    } else {
      formSidebarTitle.value = `Add New ${uiConfig.value?.displayName?.slice(0, -1) || 'Item'}`
      formSidebarSubmitText.value = `Create ${uiConfig.value?.displayName?.slice(0, -1) || 'Item'}`
      formSidebarLoadingText.value = `Creating...`
      showFormSidebar.value = true
    }
  } else {
    emit('action', actionName, item)
  }
}

async function handleSwitchView(view: string) {
  if (currentView.value === view) return
  currentView.value = view
  await nextTick()
}

// Layout ActionsMenu
type LayoutItem = { key: string; label: string }
const layoutMenuItems = computed<LayoutItem[]>(() => [
  { key: 'list', label: 'Table' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'kanban', label: 'Kanban' }
])
function handleLayoutSelect(key: string) {
  if (['list', 'gallery', 'calendar', 'kanban'].includes(key)) handleSwitchView(key)
}

function openSearch() {
  isSearchOpen.value = true
}
function closeSearch() {
  isSearchOpen.value = false
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push('/')
}

const handleSort = (field: string, direction: string) => emit('sort', field, direction)
const handlePageChange = (page: number) => emit('page-change', page)
const handleItemClick = (item: any) => emit('action', 'view', item)

function onSelectionChange(ids: (string|number)[]) {
  selectedIds.value = ids
}

function handleBulkDelete() {
  if (selectedIds.value.length === 0) return
  const ok = window.confirm(`Delete ${selectedIds.value.length} selected item(s)? This cannot be undone.`)
  if (!ok) return
  emit('bulk-delete', selectedIds.value)
}

function closeFormSidebar() {
  showFormSidebar.value = false
  formSidebarData.value = {}
}

function handleFormSubmit(data: Record<string, any>) {
  emit('action', 'create', data)
  closeFormSidebar()
}

// Empty-state helpers
const displayNameSingular = computed(() => uiConfig.value?.displayName?.slice(0, -1) || 'Item')
const hasCreateAction = computed(() => {
  const actions: any[] = uiConfig.value?.views?.list?.actions || []
  return actions.some((a: any) => a?.name === 'create')
})
const emptyTitle = computed(() => {
  if (searchQuery.value) return 'No results found'
  const plural = uiConfig.value?.displayName || moduleName.value
  return `No ${plural?.toLowerCase()} yet`
})
const emptySubtitle = computed(() => {
  if (searchQuery.value) return 'Try a different search or clear your query.'
  return `Get started by adding your first ${displayNameSingular.value.toLowerCase()}.`
})
function clearSearch() {
  searchQuery.value = ''
}

// Skeleton and layout shift mitigation
const approximateRowHeight = 56 // px
const skeletonRows = computed(() => Math.max(4, Math.min(pagination.value.perPage || 10, 10)))
const contentMinHeight = computed(() => `${approximateRowHeight * (skeletonRows.value + 1)}px`)
</script>


