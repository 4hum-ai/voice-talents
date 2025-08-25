<template>
  <ItemDetailTemplate
    :module-name="module"
    :item="item"
    :loading="loading"
    :error="error"
    :ui-config="uiConfig"
    @update="onUpdate"
    :on-back="goBack"
    @edit="onEdit"
    @delete="onDelete"
  />
  <ConfirmModal :open="confirmOpen" title="Delete item" message="Delete this item? This cannot be undone." confirm-label="Delete" @confirm="confirmDelete" @cancel="confirmOpen=false" />
</template>

<script setup lang="ts">
defineOptions({ name: 'ItemDetailView' })
import { ref, computed, watch, onBeforeUnmount, onActivated, onDeactivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ItemDetailTemplate from '@/components/templates/ItemDetailTemplate.vue'
import { useMovieService } from '@/composables/useMovieService'
import ConfirmModal from '@/components/molecules/ConfirmModal.vue'

const movie = useMovieService()
const route = useRoute()
const router = useRouter()

const module = computed(() => String(route.meta?.module || route.params.module || route.path.split('/')[1] || 'organizations'))
const id = computed(() => {
  const raw = route.params.id as string | undefined
  return raw ? String(raw) : ''
})

const item = ref<Record<string, any> | null>(null)
const uiConfig = ref<any | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
let currentAbort: AbortController | null = null
const confirmOpen = ref(false)
const isActive = ref(false)
const lastLoadedId = ref<string | null>(null)

async function load() {
  if (!id.value) return
  loading.value = true
  error.value = null
  try {
    if (!uiConfig.value) {
      currentAbort?.abort()
      currentAbort = new AbortController()
      const cfg = await movie.getModuleUiConfig(module.value, { signal: currentAbort.signal })
      uiConfig.value = cfg?.config ?? cfg ?? null
    }
    currentAbort?.abort()
    currentAbort = new AbortController()
    const res = await movie.getModuleItem(module.value, id.value, currentAbort.signal)
    item.value = res
    lastLoadedId.value = id.value
  } catch (e: any) {
    error.value = e?.message || 'Failed to load item'
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.back()
}

function onEdit() {
}

async function onDelete() {
  if (!id.value) return
  confirmOpen.value = true
}

async function confirmDelete() {
  if (!id.value) return
  loading.value = true
  error.value = null
  try {
    currentAbort?.abort()
    currentAbort = new AbortController()
    await movie.deleteModuleItem(module.value, id.value, currentAbort.signal)
    router.push({ path: `/${module.value}` })
  } catch (e: any) {
    error.value = e?.message || 'Delete failed'
  } finally {
    loading.value = false
    confirmOpen.value = false
  }
}

async function onUpdate(data: Record<string, any>) {
  if (!id.value) return
  loading.value = true
  error.value = null
  try {
    currentAbort?.abort()
    currentAbort = new AbortController()
    await movie.updateModuleItem(module.value, id.value, data, currentAbort.signal)
    await load()
  } catch (e: any) {
    error.value = e?.message || 'Update failed'
  } finally {
    loading.value = false
  }
}

onActivated(() => {
  isActive.value = true
  if (!id.value) return
  if (lastLoadedId.value !== id.value || !item.value) {
    load()
  }
})

onDeactivated(() => {
  isActive.value = false
})

watch([module, id], ([newModule], [oldModule]) => {
  if (!isActive.value) return
  if (!id.value) return
  if (newModule !== oldModule) uiConfig.value = null
  load()
})

onBeforeUnmount(() => { currentAbort?.abort(); })
</script>


