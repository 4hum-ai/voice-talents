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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ItemDetailTemplate from '@/components/templates/ItemDetailTemplate.vue'
import { useMovieService } from '@/composables/useMovieService'

const movie = useMovieService()
const route = useRoute()
const router = useRouter()

const module = computed(() => String(route.meta?.module || route.params.module || route.path.split('/')[1] || 'organizations'))
const id = computed(() => String(route.params.id))

const item = ref<Record<string, any> | null>(null)
const uiConfig = ref<any | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
let currentAbort: AbortController | null = null

async function load() {
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
  const ok = window.confirm('Delete this item? This cannot be undone.')
  if (!ok) return
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

onMounted(load)
watch([module, id], () => { uiConfig.value = null; load() })
onBeforeUnmount(() => { currentAbort?.abort(); })
</script>


