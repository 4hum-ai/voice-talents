<template>
  <div class="min-h-screen">
    <PageHeader>
      <template #title>
        <slot name="title">{{ uiConfig?.displayName || moduleName }} Management</slot>
      </template>
      <template #subtitle>
        <slot name="subtitle">Manage {{ moduleName }}</slot>
      </template>
      <template #actions>
        <div class="flex items-center gap-3">
          <div v-if="availableViews.length > 1" class="flex items-center gap-1 bg-gray-100 p-1 rounded-md">
            <button
              v-for="view in availableViews"
              :key="`tab-${view}`"
              @click="handleSwitchView(view)"
              class="px-3 py-1 text-sm rounded-md transition-colors"
              :class="currentView === view ? 'bg-white shadow-sm border border-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            >
              {{ viewLabels[view] || view }}
            </button>
          </div>
          <div>
            <input
              v-model="searchQuery"
              :placeholder="`Search ${moduleName}...`"
              class="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button
            v-if="uiConfig?.views?.list?.actions?.find((a: any) => a.name === 'create')"
            @click="handleAction('create')"
            class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Add {{ uiConfig?.displayName?.slice(0, -1) || 'Item' }}
          </button>
          <button
            v-if="currentView === 'list' && selectedIds.length > 0"
            @click="handleBulkDelete"
            class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete ({{ selectedIds.length }})
          </button>
        </div>
      </template>
    </PageHeader>

    <main class="p-4">
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
import Pagination from '@/components/molecules/Pagination.vue'
import DynamicFormSidebar from '@/components/molecules/DynamicFormSidebar.vue'
// @ts-expect-error Vue SFC typing resolved by Vite
const TableView = defineAsyncComponent(() => import('@/components/organisms/TableView.vue'))
import KanbanView from '@/components/organisms/KanbanView.vue'
import GalleryView from '@/components/organisms/GalleryView.vue'
import CalendarView from '@/components/organisms/CalendarView.vue'
import StatsView from '@/components/organisms/StatsView.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'

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
const selectedIds = ref<(string|number)[]>([])
const showFormSidebar = ref(false)
const formSidebarTitle = ref('')
const formSidebarData = ref<Record<string, any>>({})
const formSidebarLoading = ref(false)
const formSidebarSubmitText = ref('Create')
const formSidebarLoadingText = ref('Creating...')

const availableViews = computed(() => Object.keys(uiConfig.value?.views || {}))
const viewLabels: Record<string, string> = { list: 'List', kanban: 'Kanban', gallery: 'Gallery', calendar: 'Calendar' }

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


