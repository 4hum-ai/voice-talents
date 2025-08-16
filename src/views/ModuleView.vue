<template>
  <ResourceViewTemplate
    :module-name="module"
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
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import ResourceViewTemplate from '@/components/templates/ResourceViewTemplate.vue'
import { api, type PaginatedResponse } from '@/utils/api'

const route = useRoute()
const module = computed(() => String(route.query.module || 'organizations'))

const uiConfig = computed(() => getUiConfig(module.value))

const items = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const pagination = ref({ page: 1, limit: 20, total: 0, totalPages: 1 })

async function load(page = 1) {
  loading.value = true
  error.value = null
  try {
    const res: PaginatedResponse<any> = await api.listModuleItems(module.value, { page, limit: pagination.value.limit })
    items.value = res.data
    pagination.value = { page: res.pagination.page, limit: res.pagination.limit, total: res.pagination.total, totalPages: res.pagination.totalPages }
  } catch (e: any) {
    error.value = e?.message || 'Failed to load data'
  } finally {
    loading.value = false
  }
}

function onAction(action: string, payload?: any) {
  if (action === 'create') {
    // Quick create path; can be replaced with form mapping
    api.createModuleItem(module.value, payload)
      .then(() => load(pagination.value.page))
      .catch((e: any) => error.value = e?.message || 'Create failed')
  }
}

onMounted(() => load())

function getUiConfig(mod: string) {
  const baseActions = [
    { name: 'view', label: 'View', icon: 'eye' },
    { name: 'edit', label: 'Edit', icon: 'edit' },
    { name: 'delete', label: 'Delete', icon: 'trash' },
    { name: 'create', label: 'Create', icon: 'plus' }
  ]
  if (mod === 'organizations') {
    return {
      displayName: 'Organizations',
      views: {
        list: {
          columns: [
            { key: 'name', label: 'Name', sortable: true },
            { key: 'country', label: 'Country' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Actions' }
          ],
          actions: baseActions
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
          actions: baseActions
        },
        gallery: { titleField: 'name', descriptionField: 'country', actions: baseActions },
        calendar: { titleField: 'name', dateField: 'createdAt', actions: baseActions }
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
  }
  // default generic config
  return {
    displayName: mod,
    views: {
      list: { columns: [ { key: 'id', label: 'ID' }, { key: 'name', label: 'Name' }, { key: 'actions', label: 'Actions' } ], actions: baseActions }
    },
    formView: { fields: [ { key: 'name', label: 'Name', type: 'text', required: true } ] },
    features: { stats: [] }
  }
}
</script>


