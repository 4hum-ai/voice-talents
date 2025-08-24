<template>
  <div class="min-h-screen">
    <AppBar :loading="loading" :show-back="Boolean(onBack)" @back="onBack && onBack()">
      <template #title>
        <slot name="title">{{ title }}</slot>
      </template>
      <template #subtitle>
        <slot name="subtitle">{{ subtitle }}</slot>
      </template>
      <template #actions>
        <button v-if="enableEdit" @click="handleEdit" class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">Edit</button>
        <ActionsMenu :items="actionMenuItems" size="md" @select="handleActionMenuSelect" />
      </template>
    </AppBar>

    <!-- Spacer to offset the fixed app bar height -->
    <div class="h-4"></div>

    <!-- Breadcrumbs under the app bar -->
    <div class="px-4 py-2">
      <Breadcrumbs :items="breadcrumbs" />
    </div>

    <main class="p-4">
      <div v-if="loading" class="space-y-6">
        <div v-if="detailSections && detailSections.length" class="space-y-6">
          <section
            v-for="(section, sIdx) in detailSections"
            :key="`skeleton-sec-${sIdx}`"
            class="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <div v-if="section.title" class="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg dark:border-gray-700 dark:bg-gray-800">
              <div class="h-4 w-32 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
            </div>
            <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="i in (section.fields?.length || 4)"
                :key="`skeleton-field-${sIdx}-${i}`"
                class="flex flex-col gap-2"
              >
                <div class="h-3 w-24 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
                <div class="h-4 w-full bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
              </div>
            </div>
          </section>
        </div>
        <div v-else class="bg-white border border-gray-200 rounded-lg p-4 dark:bg-gray-900 dark:border-gray-700">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="i in 8" :key="`skeleton-kv-${i}`" class="flex flex-col gap-2">
              <div class="h-3 w-24 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
              <div class="h-4 w-full bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="error" class="text-sm text-error-600 dark:text-error-400">{{ error }}</div>
      <div v-else>
        <slot name="details" :item="item">
          <!-- Use configured detailView when available -->
          <div v-if="detailSections && detailSections.length" class="space-y-6">
            <section v-for="(section, sIdx) in detailSections" :key="`sec-${sIdx}`" class="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div v-if="section.title" class="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg dark:border-gray-700 dark:bg-gray-800">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ section.title }}</h3>
              </div>
              <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="field in section.fields || []" :key="field.key" class="flex flex-col">
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ field.label || formatKey(String(field.key)) }}</span>
                  <FieldValue :value="item?.[field.key]" :type="field.type" :formatter="field.formatter" :currency-code="currencyCode(item)" :field-key="field.key" />
                </div>
              </div>
            </section>
          </div>
          <!-- Fallback to naive key/value rendering in a single card -->
          <div v-else class="bg-white border border-gray-200 rounded-lg p-4 dark:bg-gray-900 dark:border-gray-700">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(value, key) in displayPairs" :key="String(key)" class="flex flex-col">
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatKey(String(key)) }}</span>
                <span class="text-sm text-gray-900 dark:text-gray-100 break-all">{{ formatValue(value) }}</span>
              </div>
            </div>
          </div>
        </slot>
      </div>
    </main>
    <DynamicFormSidebar
      v-if="showFormSidebar"
      :title="formSidebarTitle"
      :form-config="uiConfig?.formView"
      :initial-data="formSidebarData"
      :loading="formSidebarLoading"
      :submit-text="formSidebarSubmitText"
      :loading-text="formSidebarLoadingText"
      @close="closeFormSidebar"
      @submit="handleFormSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Breadcrumbs from '@/components/molecules/Breadcrumbs.vue'
import FieldValue from '@/components/atoms/FieldValue.vue'
import DynamicFormSidebar from '@/components/molecules/DynamicFormSidebar.vue'
import ActionsMenu from '@/components/atoms/ActionsMenu.vue'
import AppBar from '@/components/molecules/AppBar.vue'

interface Props {
  moduleName: string
  item?: Record<string, any> | null
  loading?: boolean
  error?: string | null
  enableEdit?: boolean
  enableDelete?: boolean
  onBack?: () => void
  uiConfig?: any
  customEditHandler?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  item: null,
  loading: false,
  error: null,
  enableEdit: true,
  enableDelete: true
})

const emit = defineEmits(['edit', 'delete', 'update'])

const title = computed(() => props.item?.name || props.item?.title || 'Details')
const subtitle = computed(() => props.item?.id)

const displayPairs = computed(() => props.item || {})

const breadcrumbs = computed(() => [
  { label: 'Dashboard', to: '/' },
  { label: props.uiConfig?.displayName, to: `/${props.moduleName}` },
  { label: String(title.value) }
])

const formatKey = (k: string) => k.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, s => s.toUpperCase())
const formatValue = (v: any) => {
  if (v === null || v === undefined) return '-'
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}

const detailSections = computed(() => props.uiConfig?.detailView?.sections || [])
const currencyCode = (obj: any): string | undefined => {
  const code = obj?.currency
  return typeof code === 'string' && code.length >= 3 ? code : undefined
}

// Actions menu items (e.g., Delete lives here now)
type ActionMenuItem = { key: string; label: string; description?: string }
const actionMenuItems = computed<ActionMenuItem[]>(() => {
  const items: ActionMenuItem[] = []
  if (props.enableDelete) items.push({ key: 'delete', label: 'Delete' })
  return items
})

// Edit sidebar state
const showFormSidebar = ref(false)
const formSidebarTitle = ref('')
const formSidebarData = ref<Record<string, any>>({})
const formSidebarLoading = ref(false)
const formSidebarSubmitText = ref('Save changes')
const formSidebarLoadingText = ref('Saving...')

function handleEdit() {
  if (props.customEditHandler) {
    emit('edit')
    return
  }
  formSidebarTitle.value = `Edit ${props.uiConfig?.displayName?.slice(0, -1) || 'Item'}`
  formSidebarSubmitText.value = 'Save changes'
  formSidebarLoadingText.value = 'Saving...'
  formSidebarData.value = { ...(props.item || {}) }
  showFormSidebar.value = true
}

function closeFormSidebar() {
  showFormSidebar.value = false
  formSidebarData.value = {}
}

function handleFormSubmit(data: Record<string, any>) {
  emit('update', data)
  closeFormSidebar()
}

function handleActionMenuSelect(key: string) {
  if (key === 'delete') emit('delete')
}
</script>
