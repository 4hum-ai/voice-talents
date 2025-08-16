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
        <div v-if="availableViews.length > 1" style="display:flex; gap:4px">
          <button v-for="view in availableViews" :key="view" @click="currentView = view">{{ viewLabels[view] || view }}</button>
        </div>
        <div>
          <input v-model="searchQuery" :placeholder="`Search ${moduleName}...`" />
        </div>
        <button v-if="uiConfig?.views?.list?.actions?.find((a: any) => a.name === 'create')" @click="handleAction('create')">Add {{ uiConfig?.displayName?.slice(0, -1) || 'Item' }}</button>
      </template>
    </PageHeader>

    <main style="padding:16px">
      <StatsView v-if="uiConfig?.features?.stats" :stats="uiConfig.features.stats" :data="data" />

      <div>
        <div v-if="loading">Loading {{ uiConfig?.displayName || moduleName }}...</div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else>
          <ListView v-if="currentView === 'list' && uiConfig?.views?.list" :data="filteredData" :config="uiConfig.views.list" @action="handleAction" @sort="handleSort" @item-click="handleItemClick" />
          <KanbanView v-else-if="currentView === 'kanban' && uiConfig?.views?.kanban" :data="filteredData" :config="uiConfig.views.kanban" @action="handleAction" @item-click="handleItemClick" />
          <GalleryView v-else-if="currentView === 'gallery' && uiConfig?.views?.gallery" :data="filteredData" :config="uiConfig.views.gallery" @action="handleAction" @item-click="handleItemClick" />
          <CalendarView v-else-if="currentView === 'calendar' && uiConfig?.views?.calendar" :data="filteredData" :config="uiConfig.views.calendar" @action="handleAction" @item-click="handleItemClick" />
          <div v-else-if="filteredData.length === 0">No items found</div>
        </div>
      </div>

      <div v-if="pagination.totalPages > 1" style="margin-top:16px">
        <Pagination :current-page="pagination.currentPage" :total-pages="pagination.totalPages" :total="pagination.total" :per-page="pagination.perPage" @page-change="handlePageChange" />
      </div>
    </main>

    <DynamicFormSidebar v-if="showFormSidebar" :title="formSidebarTitle" :form-config="uiConfig?.formView" :initial-data="formSidebarData" :loading="formSidebarLoading" :submit-text="formSidebarSubmitText" :loading-text="formSidebarLoadingText" @close="closeFormSidebar" @submit="handleFormSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Pagination from '@/components/molecules/Pagination.vue'
import DynamicFormSidebar from '@/components/molecules/DynamicFormSidebar.vue'
import ListView from '@/components/organisms/ListView.vue'
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

const emit = defineEmits(['action', 'sort', 'page-change', 'create'])

const currentView = ref('list')
const searchQuery = ref('')
const showFormSidebar = ref(false)
const formSidebarTitle = ref('')
const formSidebarData = ref<Record<string, any>>({})
const formSidebarLoading = ref(false)
const formSidebarSubmitText = ref('Create')
const formSidebarLoadingText = ref('Creating...')

const availableViews = computed(() => Object.keys(uiConfig.value?.views || {}))
const viewLabels: Record<string, string> = { list: 'List', kanban: 'Kanban', gallery: 'Gallery', calendar: 'Calendar' }

const uiConfig = computed(() => props.uiConfig)
const moduleName = computed(() => props.moduleName)
const data = computed(() => props.data || [])
const loading = computed(() => props.loading || false)
const error = computed(() => props.error || null)

const pagination = computed(() => ({
  currentPage: props.currentPage || 1,
  totalPages: props.totalPages || 1,
  total: props.totalItems || 0,
  perPage: props.perPage || 10
}))

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

const handleSort = (field: string, direction: string) => emit('sort', field, direction)
const handlePageChange = (page: number) => emit('page-change', page)
const handleItemClick = (_item: any) => {}

function closeFormSidebar() {
  showFormSidebar.value = false
  formSidebarData.value = {}
}

function handleFormSubmit(data: Record<string, any>) {
  emit('action', 'create', data)
  closeFormSidebar()
}
</script>


