<template>
  <div class="min-h-screen">
    <!-- Fixed App Bar -->
    <div class="fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
      <div class="px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3 min-w-0">
          <button v-if="onBack" @click="onBack" class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 h-9 w-9" aria-label="Go back">
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.78 15.53a.75.75 0 01-1.06 0l-5-5a.75.75 0 010-1.06l5-5a.75.75 0 111.06 1.06L8.31 10l4.47 4.47a.75.75 0 010 1.06z" clip-rule="evenodd" />
            </svg>
          </button>
          <div class="min-w-0">
            <div class="text-base font-semibold text-gray-900 truncate">
              <slot name="title">{{ title }}</slot>
            </div>
            <div class="text-xs text-gray-500 truncate">
              <slot name="subtitle">{{ subtitle }}</slot>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button v-if="enableEdit" @click="handleEdit" class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">Edit</button>
          <ActionsMenu :items="actionMenuItems" size="md" @select="handleActionMenuSelect" />
        </div>
      </div>
    </div>

    <!-- Spacer to offset the fixed app bar height -->
    <div class="h-16"></div>

    <!-- Breadcrumbs under the app bar -->
    <div class="px-4 py-2">
      <Breadcrumbs :items="breadcrumbs" />
    </div>

    <main class="p-4">
      <div v-if="loading" class="text-sm text-gray-600">Loading...</div>
      <div v-else-if="error" class="text-sm text-red-600">{{ error }}</div>
      <div v-else>
        <slot name="details" :item="item">
          <!-- Use configured detailView when available -->
          <div v-if="detailSections && detailSections.length" class="space-y-6">
            <section v-for="(section, sIdx) in detailSections" :key="`sec-${sIdx}`" class="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div v-if="section.title" class="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <h3 class="text-sm font-semibold text-gray-900">{{ section.title }}</h3>
              </div>
              <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="field in section.fields || []" :key="field.key" class="flex flex-col">
                  <span class="text-xs text-gray-500">{{ field.label || formatKey(String(field.key)) }}</span>
                  <FieldValue :value="item?.[field.key]" :type="field.type" :formatter="field.formatter" :currency-code="currencyCode(item)" :field-key="field.key" />
                </div>
              </div>
            </section>
          </div>
          <!-- Fallback to naive key/value rendering in a single card -->
          <div v-else class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(value, key) in displayPairs" :key="String(key)" class="flex flex-col">
                <span class="text-xs text-gray-500">{{ formatKey(String(key)) }}</span>
                <span class="text-sm text-gray-900 break-all">{{ formatValue(value) }}</span>
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
const subtitle = computed(() => `${props.moduleName} details`)

const displayPairs = computed(() => props.item || {})

const breadcrumbs = computed(() => [
  { label: 'Dashboard', to: '/' },
  { label: props.moduleName, to: `/${props.moduleName}` },
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


