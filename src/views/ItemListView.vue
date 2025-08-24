<template>
  <ItemListTemplate
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
    @sort="onSort"
    @action="onAction"
    @bulk-delete="onBulkDelete"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ItemListTemplate from '@/components/templates/ItemListTemplate.vue'
import { useMovieService, type PaginatedResponse } from '@/composables/useMovieService'
const movie = useMovieService()

const route = useRoute()
const router = useRouter()
const module = computed(() => {
  const metaModule = route.meta?.module as string | undefined
  if (metaModule) return metaModule
  const paramModule = route.params?.module as string | undefined
  if (paramModule) return paramModule
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
    uiConfig.value = res?.config ?? res ?? null
    if (!uiConfig.value) {
      throw new Error('UI configuration not available')
    }
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
    if (!uiConfig.value) {
      await loadUiConfig()
    }
    const url = new URL(window.location.href)
    const search = url.searchParams.get('search') || undefined
    const searchField = url.searchParams.get('searchField') || undefined
    const sortParam = url.searchParams.get('sort') || undefined
    const params: Record<string, any> = { page, limit: pagination.value.limit }
    if (search) params.search = search
    if (searchField) params.searchFields = searchField
    if (sortParam) params.sort = sortParam
    const res: PaginatedResponse<any> = await movie.listModuleItems(module.value, params)
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
function onSort(field: string, direction: string) {
  try {
    const url = new URL(window.location.href)
    url.searchParams.set('sort', `${field}:${direction}`)
    history.replaceState(null, '', url.toString())
  } catch {}
  load(1)
}

function onAction(action: string, payload?: any) {
  if (action === 'create') {
    movie.createModuleItem(module.value, payload)
      .then(() => load(pagination.value.page))
      .catch((e: any) => error.value = e?.message || 'Create failed')
    return
  }
  if (action === 'view' && payload) {
    const id = String(payload.id ?? payload._id)
    if (id) router.push({ path: `/${module.value}/${id}` })
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
  uiConfig.value = null
  items.value = []
  pagination.value = { page: 1, limit: 20, total: 0, totalPages: 1 }
  await loadUiConfig()
  await load(1)
})
</script>


