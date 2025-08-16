<template>
  <ResourceViewTemplate
    module-name="organizations"
    :ui-config="uiConfig"
    :data="items"
    :loading="loading"
    :error="error"
    :current-page="pagination.page"
    :total-pages="pagination.totalPages"
    :total-items="pagination.total"
    :per-page="pagination.limit"
    @page-change="load"
    @action="onAction"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ResourceViewTemplate from '@/components/templates/ResourceViewTemplate.vue'
import { api, type PaginatedResponse } from '@/utils/api'

const items = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const pagination = ref({ page: 1, limit: 20, total: 0, totalPages: 1 })

const uiConfig = {
  displayName: 'Organizations',
  views: {
    list: {
      columns: [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'country', label: 'Country' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
      ],
      actions: [
        { name: 'view', label: 'View', icon: 'eye' },
        { name: 'edit', label: 'Edit', icon: 'edit' },
        { name: 'delete', label: 'Delete', icon: 'trash' },
        { name: 'create', label: 'Create', icon: 'plus' }
      ]
    },
    kanban: {
      groupByField: 'status',
      columns: [
        { value: 'active', label: 'Active', color: '#16a34a' },
        { value: 'pending', label: 'Pending', color: '#f59e0b' },
        { value: 'suspended', label: 'Suspended', color: '#ef4444' }
      ],
      cardTitleField: 'name',
      cardDescriptionField: 'country',
      actions: [
        { name: 'view', label: 'View', icon: 'eye' },
        { name: 'edit', label: 'Edit', icon: 'edit' },
        { name: 'delete', label: 'Delete', icon: 'trash' }
      ]
    },
    gallery: { titleField: 'name', descriptionField: 'country', actions: [ { name:'view', label:'View', icon:'eye' } ] },
    calendar: { titleField: 'name', dateField: 'createdAt', actions: [ { name:'view', label:'View', icon:'eye' } ] }
  },
  formView: {
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'country', label: 'Country', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: [
        { value: 'active', label: 'Active' },
        { value: 'pending', label: 'Pending' },
        { value: 'suspended', label: 'Suspended' }
      ]}
    ]
  },
  features: { stats: [] }
}

async function load(page = 1) {
  loading.value = true
  error.value = null
  try {
    const res: PaginatedResponse<any> = await api.listModuleItems('organizations', { page, limit: pagination.value.limit })
    items.value = res.data
    pagination.value = { page: res.pagination.page, limit: res.pagination.limit, total: res.pagination.total, totalPages: res.pagination.totalPages }
  } catch (e: any) {
    error.value = e?.message || 'Failed to load organizations. Ensure VITE_PUBLIC_API_URL is set and reachable.'
  } finally {
    loading.value = false
  }
}

function onAction(action: string, payload?: any) {
  if (action === 'create') {
    api.createModuleItem('organizations', payload)
      .then(() => load(pagination.value.page))
      .catch((e: any) => error.value = e?.message || 'Create failed')
  }
}

onMounted(() => load())
</script>


