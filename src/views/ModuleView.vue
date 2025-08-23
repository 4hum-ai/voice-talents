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
    @bulk-delete="onBulkDelete"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import ResourceViewTemplate from '@/components/templates/ResourceViewTemplate.vue'
import { useMovieService, type PaginatedResponse } from '@/composables/useMovieService'
const movie = useMovieService()

const route = useRoute()
const module = computed(() => {
  // Prefer module from route meta if provided by resource routes
  const metaModule = route.meta?.module as string | undefined
  if (metaModule) return metaModule
  // Fallback to query param to allow ad-hoc module access
  return String(route.query.module || 'organizations')
})

const uiConfig = ref<any | null>(null)

const items = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const pagination = ref({ page: 1, limit: 20, total: 0, totalPages: 1 })

async function loadUiConfig() {
  try {
    loading.value = true
    error.value = null
    const res = await movie.getModuleUiConfig(module.value)
    // API returns { module, config } – use config
    uiConfig.value = res?.config ?? res ?? null
    if (!uiConfig.value) {
      throw new Error('UI configuration not available')
    }
    // Apply page size from config if provided
    const pageSize = uiConfig.value?.views?.list?.pageSize
    if (pageSize && typeof pageSize === 'number') {
      pagination.value.limit = pageSize
    }
  } catch (e: any) {
    error.value = e?.message || 'Failed to load UI configuration'
    throw e
  } finally {
    loading.value = false
  }
}

async function load(page = 1) {
  loading.value = true
  error.value = null
  try {
    // Ensure UI config is loaded first
    if (!uiConfig.value) {
      await loadUiConfig()
    }
    const res: PaginatedResponse<any> = await movie.listModuleItems(module.value, { page, limit: pagination.value.limit })
    items.value = res.data
    const p = res.pagination
    pagination.value = {
      page: Number(p.page) || 1,
      limit: Number(p.limit) || 20,
      total: Number(p.total) || 0,
      totalPages: Number(p.totalPages) || Math.max(1, Math.ceil((Number(p.total) || 0) / (Number(p.limit) || 1)))
    }
  } catch (e: any) {
    error.value = e?.message || 'Failed to load data'
  } finally {
    loading.value = false
  }
}

function onAction(action: string, payload?: any) {
  if (action === 'create') {
    // Quick create path; can be replaced with form mapping
    movie.createModuleItem(module.value, payload)
      .then(() => load(pagination.value.page))
      .catch((e: any) => error.value = e?.message || 'Create failed')
  }
}

async function onBulkDelete(ids: (string|number)[]) {
  if (!ids || ids.length === 0) return
  loading.value = true
  error.value = null
  try {
    await Promise.all(ids.map((id) => movie.deleteModuleItem(module.value, String(id))))
    await load(pagination.value.page)
  } catch (e: any) {
    error.value = e?.message || 'Delete failed'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadUiConfig()
  await load(1)
})

watch(module, async () => {
  // Reset when switching modules
  uiConfig.value = null
  items.value = []
  pagination.value = { page: 1, limit: 20, total: 0, totalPages: 1 }
  await loadUiConfig()
  await load(1)
})

// Removed local fallback; UI config must come from API
</script>


