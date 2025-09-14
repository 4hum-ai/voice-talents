<template>
  <ItemDetailTemplate
    :resource-name="resource"
    :item="item"
    :loading="loading"
    :error="error"
    :ui-config="uiConfig"
    :on-back="goBack"
    :hide-default-sections="['related-items']"
    @update="onUpdate"
    @edit="onEdit"
    @delete="onDelete"
    @reference-click="onReferenceClick"
    @related-item-click="onRelatedItemClick"
  >
    <!-- Custom app bar title with status indicator -->
    <template #app-bar-title="{ item, title }">
      <div class="flex items-center gap-3">
        <div class="h-3 w-3 rounded-full" :class="getStatusColor(item?.status as string)" />
        <span>{{ title }}</span>
      </div>
    </template>

    <!-- Custom app bar actions -->
    <template #app-bar-actions="{ item, enableEdit, handlers }">
      <div class="flex items-center gap-2">
        <button
          v-if="item?.status === 'draft'"
          class="rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
          @click="handlePublish"
        >
          Publish
        </button>
        <button
          v-if="enableEdit"
          class="bg-primary-600 hover:bg-primary-700 rounded-md px-3 py-2 text-sm font-medium text-white"
          @click="handlers.edit"
        >
          Edit
        </button>
        <button
          class="rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
          @click="handleShare"
        >
          Share
        </button>
      </div>
    </template>

    <!-- Custom breadcrumbs with additional context -->
    <template #breadcrumbs="{ items }">
      <nav class="flex" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li v-for="(item, index) in items" :key="index" class="flex items-center">
            <router-link
              v-if="item.to"
              :to="item.to"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {{ item.label }}
            </router-link>
            <span v-else class="font-medium text-gray-900 dark:text-gray-100">
              {{ item.label }}
            </span>
            <svg
              v-if="index < items.length - 1"
              class="mx-2 h-4 w-4 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </li>
        </ol>
      </nav>
    </template>

    <!-- Custom loading state -->
    <template #loading="{ loading }">
      <div v-if="loading" class="space-y-6">
        <div class="animate-pulse">
          <div class="mb-4 h-8 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="space-y-3">
            <div class="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-4 w-4/6 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    </template>

    <!-- Custom details header with action buttons -->
    <template #details-header="{ item, handlers }">
      <div
        class="mb-6 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:border-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ item?.name || item?.title || 'Item Details' }}
            </h2>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Last updated: {{ formatDate(item?.updatedAt as string) }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              @click="handleExport"
            >
              Export
            </button>
            <button
              class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              @click="handlers.edit"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Custom details content with enhanced layout -->
    <template #details="{ item, detailSections, handlers }">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Main content -->
        <div class="space-y-6 lg:col-span-2">
          <div v-if="detailSections && detailSections.length" class="space-y-6">
            <Card v-for="(section, sIdx) in detailSections" :key="`sec-${sIdx}`" variant="elevated">
              <div
                v-if="section.title"
                class="rounded-t-lg border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
              >
                <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {{ section.title }}
                </h3>
              </div>
              <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                <div v-for="field in section.fields || []" :key="field.key" class="flex flex-col">
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{
                    field.label || formatKey(String(field.key))
                  }}</span>
                  <FieldValue
                    :value="item?.[field.key]"
                    :type="field.type"
                    :formatter="field.formatter"
                    :currency-code="currencyCode(item || {})"
                    :field-key="field.key"
                    :ref-to="field.refTo"
                    @reference-click="handlers.referenceClick"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Status card -->
          <Card variant="elevated">
            <div class="p-4">
              <h3 class="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Status</h3>
              <div class="flex items-center gap-2">
                <div class="h-3 w-3 rounded-full" :class="getStatusColor(item?.status as string)" />
                <span class="text-sm font-medium capitalize">{{ item?.status || 'Unknown' }}</span>
              </div>
            </div>
          </Card>

          <!-- Quick actions -->
          <Card variant="elevated">
            <div class="p-4">
              <h3 class="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                Quick Actions
              </h3>
              <div class="space-y-2">
                <button
                  class="w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  @click="handleDuplicate"
                >
                  Duplicate
                </button>
                <button
                  class="w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  @click="handleArchive"
                >
                  Archive
                </button>
                <button
                  class="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  @click="onDelete"
                >
                  Delete
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </template>

    <!-- Custom metadata section -->
    <template #metadata="{ item }">
      <div class="mt-8">
        <Card variant="elevated">
          <div class="p-4">
            <h3 class="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Metadata</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500 dark:text-gray-400">Created:</span>
                <span class="ml-2 text-gray-900 dark:text-gray-100">{{
                  formatDate(item?.createdAt as string)
                }}</span>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">Updated:</span>
                <span class="ml-2 text-gray-900 dark:text-gray-100">{{
                  formatDate(item?.updatedAt as string)
                }}</span>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">ID:</span>
                <span class="ml-2 font-mono text-xs text-gray-900 dark:text-gray-100">{{
                  item?.id
                }}</span>
              </div>
              <div>
                <span class="text-gray-500 dark:text-gray-400">Version:</span>
                <span class="ml-2 text-gray-900 dark:text-gray-100">{{
                  item?.version || '1.0'
                }}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </template>

    <!-- Custom related items with enhanced display -->
    <template #related-items="{ relatedItems, handlers }">
      <div class="mt-8">
        <Card variant="elevated">
          <div class="p-4">
            <h3 class="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
              Related Items
            </h3>
            <div
              v-if="relatedItems.length === 0"
              class="py-8 text-center text-gray-500 dark:text-gray-400"
            >
              No related items found
            </div>
            <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div
                v-for="relatedItem in relatedItems"
                :key="`${relatedItem.resourceType}-${relatedItem.id}`"
                class="cursor-pointer rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                @click="handlers.relatedItemClick(relatedItem.resourceType, relatedItem.id)"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="bg-primary-100 dark:bg-primary-900 flex h-10 w-10 items-center justify-center rounded-lg"
                  >
                    <span class="text-primary-600 dark:text-primary-400 text-sm font-medium">
                      {{ relatedItem.title.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ relatedItem.title }}
                    </p>
                    <p class="truncate text-xs text-gray-500 dark:text-gray-400">
                      {{ formatResourceType(relatedItem.resourceType) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </template>
  </ItemDetailTemplate>

  <ConfirmModal
    :open="confirmOpen"
    title="Delete item"
    message="Delete this item? This cannot be undone."
    confirm-label="Delete"
    @confirm="confirmDelete"
    @cancel="confirmOpen = false"
  />
</template>

<script setup lang="ts">
defineOptions({ name: 'CustomItemDetailView' })
import { ref, computed, watch, onBeforeUnmount, onActivated, onDeactivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ItemDetailTemplate from '@/components/templates/ItemDetailTemplate.vue'
import Card from '@/components/atoms/Card.vue'
import FieldValue from '@/components/atoms/FieldValue.vue'
import ConfirmModal from '@/components/molecules/ConfirmModal.vue'
import { useResourceService } from '@/composables/useResourceService'
import { useUiConfig } from '@/composables/useUiConfig'
import { useActivity } from '@/composables/useActivity'
import { useStaleStore } from '@/stores/stale'
import { UiConfig } from '@/types/ui-config'

interface ItemData extends Record<string, unknown> {
  id?: string | number
  _id?: string | number
  status?: string
  createdAt?: string
  updatedAt?: string
  version?: string
}

const api = useResourceService()
const activity = useActivity()
const route = useRoute()
const router = useRouter()
const stale = useStaleStore()

const resource = computed(() =>
  String(route.meta?.module || route.params.module || route.path.split('/')[1] || 'organizations'),
)
const id = computed(() => {
  const raw = route.params.id as string | undefined
  return raw ? String(raw) : ''
})

const item = ref<Record<string, unknown> | null>(null)
const { get: getUiConfig } = useUiConfig()
const uiConfig = ref<UiConfig | null>(null)
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
    // Ensure UI config present using composable priority
    if (!uiConfig.value) {
      currentAbort?.abort()
      currentAbort = new AbortController()
      uiConfig.value = await getUiConfig(resource.value, {
        signal: currentAbort.signal,
      })
    }
    currentAbort?.abort()
    currentAbort = new AbortController()
    const res = await api.getById(resource.value, id.value, currentAbort.signal)
    item.value = res as ItemData
    lastLoadedId.value = id.value
    try {
      activity.recordVisit({
        resource: resource.value,
        id: id.value,
        data: res,
      })
    } catch {
      /* ignore */
    }
  } catch (e: unknown) {
    error.value = (e as Error)?.message || 'Failed to load item'
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.back()
}

function onEdit() {
  /* no-op: handled by parent template */
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
    await api.remove(resource.value, id.value, currentAbort.signal)
    // mark the list route as stale so keep-alive list refreshes on activation
    stale.mark(`path:/${resource.value}`)
    router.push({ path: `/${resource.value}` })
  } catch (e: unknown) {
    error.value = (e as Error)?.message || 'Delete failed'
  } finally {
    loading.value = false
    confirmOpen.value = false
  }
}

async function onUpdate(data: Record<string, unknown>) {
  if (!id.value) return
  loading.value = true
  error.value = null
  try {
    currentAbort?.abort()
    currentAbort = new AbortController()
    await api.update(resource.value, id.value, data, currentAbort.signal)
    // mark the list route as stale so it refreshes on activation
    stale.mark(`path:/${resource.value}`)
    await load()
  } catch (e: unknown) {
    error.value = (e as Error)?.message || 'Update failed'
  } finally {
    loading.value = false
  }
}

function onReferenceClick(referenceType: string, referenceId: string) {
  router.push(`/${referenceType}/${referenceId}`)
}

function onRelatedItemClick(resourceType: string, itemId: string) {
  router.push(`/${resourceType}/${itemId}`)
}

// Custom action handlers
function handlePublish() {
  console.log('Publishing item:', item.value?.id)
  // Implement publish logic
}

function handleShare() {
  console.log('Sharing item:', item.value?.id)
  // Implement share logic
}

function handleExport() {
  console.log('Exporting item:', item.value?.id)
  // Implement export logic
}

function handleDuplicate() {
  console.log('Duplicating item:', item.value?.id)
  // Implement duplicate logic
}

function handleArchive() {
  console.log('Archiving item:', item.value?.id)
  // Implement archive logic
}

// Utility functions
function getStatusColor(status?: string): string {
  switch (status) {
    case 'published':
      return 'bg-green-500'
    case 'draft':
      return 'bg-yellow-500'
    case 'archived':
      return 'bg-gray-500'
    case 'error':
      return 'bg-red-500'
    default:
      return 'bg-gray-400'
  }
}

function formatDate(date?: string): string {
  if (!date) return 'Unknown'
  return new Date(date).toLocaleDateString()
}

function formatKey(k: string): string {
  return k
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (s) => s.toUpperCase())
}

function formatResourceType(type: string): string {
  return type
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

function currencyCode(obj: Record<string, unknown>): string | undefined {
  const code = obj?.currency
  return typeof code === 'string' && code.length >= 3 ? code : undefined
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

watch([resource, id], () => {
  if (!isActive.value) return
  if (!id.value) return
  load()
})

onBeforeUnmount(() => {
  currentAbort?.abort()
})
</script>
