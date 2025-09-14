<template>
  <div class="bg-background min-h-screen">
    <!-- AppBar with back button - full width above sidebar -->
    <AppBar show-back fixed @back="$router.push('/')">
      <template #title>Design System</template>
      <template #subtitle
        >Interactive component library for reviewing atomic and molecular components</template
      >
      <template #actions>
        <ActionsMenu
          title="Quick Actions"
          subtitle="Additional navigation options"
          :items="quickActionItems"
          :active-item-key="activeComponentId"
        />
        <ThemeToggle />
      </template>
    </AppBar>

    <!-- Main Layout with Sidebar -->
    <div class="flex pt-16">
      <!-- Sidebar -->
      <Sidebar
        title="Components"
        subtitle="Design System"
        :sections="sidebarSections"
        :active-item-id="activeComponentId"
        :fixed="true"
        :default-collapsed="false"
      />

      <!-- Main Content -->
      <main class="ml-72 flex-1 transition-all duration-300">
        <div class="container mx-auto px-4 py-8">
          <div class="space-y-12">
            <!-- Generic Component Tester -->
            <div
              v-for="componentConfig in componentConfigs"
              :key="componentConfig.id"
              :id="componentConfig.id"
              class="bg-card scroll-mt-24 rounded-lg border shadow-sm"
            >
              <!-- Header -->
              <div class="bg-muted/20 border-b p-6">
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="text-foreground text-xl font-semibold">
                      {{ componentConfig.title }}
                    </h3>
                    <p class="text-muted-foreground mt-1">{{ componentConfig.description }}</p>
                    <p class="text-muted-foreground mt-2 text-sm">
                      Component:
                      <code class="bg-muted rounded px-2 py-1 text-xs">{{
                        componentConfig.componentName
                      }}</code>
                      <span class="bg-primary/10 text-primary ml-2 rounded px-2 py-1 text-xs">
                        {{ componentConfig.section }}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="p-6">
                <!-- Props & Live Preview -->
                <div class="space-y-6">
                  <h4 class="text-foreground border-b pb-2 text-lg font-medium">
                    Props & Live Preview
                  </h4>

                  <!-- Split Layout: Controls on left, Live Preview on right -->
                  <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <!-- Left: Controls -->
                    <div class="space-y-6">
                      <!-- JSON Editor -->
                      <JsonInput
                        v-model="componentConfig.jsonProps"
                        label="Props (JSON)"
                        placeholder="Enter JSON props..."
                        :rows="8"
                        @blur="updatePropsFromJson(componentConfig)"
                      />

                      <!-- Individual Prop Controls -->
                      <Accordion
                        title="Individual Controls"
                        :count="Object.keys(componentConfig.props).length"
                        :default-open="true"
                      >
                        <div class="space-y-4">
                          <div
                            v-for="(prop, key) in componentConfig.props"
                            :key="key"
                            class="bg-muted/20 space-y-2 rounded-lg border p-3"
                          >
                            <label class="text-foreground block text-sm font-medium">{{
                              key
                            }}</label>

                            <!-- String input -->
                            <input
                              v-if="typeof prop === 'string'"
                              v-model="componentConfig.props[key]"
                              type="text"
                              class="bg-background w-full rounded-md border px-3 py-2 text-sm"
                              @input="updateJsonFromProps(componentConfig)"
                            />

                            <!-- Number input -->
                            <input
                              v-else-if="typeof prop === 'number'"
                              v-model.number="componentConfig.props[key]"
                              type="number"
                              class="bg-background w-full rounded-md border px-3 py-2 text-sm"
                              @input="updateJsonFromProps(componentConfig)"
                            />

                            <!-- Boolean input -->
                            <select
                              v-else-if="typeof prop === 'boolean'"
                              v-model="componentConfig.props[key]"
                              class="bg-background w-full rounded-md border px-3 py-2 text-sm"
                              @change="updateJsonFromProps(componentConfig)"
                            >
                              <option :value="true">true</option>
                              <option :value="false">false</option>
                            </select>

                            <!-- Select for preset values -->
                            <select
                              v-else-if="key === 'preset'"
                              v-model="componentConfig.props[key]"
                              class="bg-background w-full rounded-md border px-3 py-2 text-sm"
                              @change="updateJsonFromProps(componentConfig)"
                            >
                              <option value="custom">Custom</option>
                              <option value="thumbnail">Thumbnail</option>
                              <option value="card">Card</option>
                              <option value="hero">Hero</option>
                            </select>

                            <!-- Select for format values -->
                            <select
                              v-else-if="key === 'format'"
                              v-model="componentConfig.props[key]"
                              class="bg-background w-full rounded-md border px-3 py-2 text-sm"
                              @change="updateJsonFromProps(componentConfig)"
                            >
                              <option value="auto">Auto</option>
                              <option value="webp">WebP</option>
                              <option value="avif">AVIF</option>
                              <option value="jpeg">JPEG</option>
                              <option value="png">PNG</option>
                            </select>

                            <!-- Select for icon names -->
                            <select
                              v-else-if="key === 'name'"
                              v-model="componentConfig.props[key]"
                              class="bg-background w-full rounded-md border px-3 py-2 text-sm"
                              @change="updateJsonFromProps(componentConfig)"
                            >
                              <option value="mdi:heart">Heart</option>
                              <option value="mdi:star">Star</option>
                              <option value="mdi:home">Home</option>
                              <option value="mdi:magnify">Search</option>
                              <option value="mdi:plus">Plus</option>
                              <option value="mdi:close">Close</option>
                              <option value="mdi:play">Play</option>
                              <option value="mdi:pause">Pause</option>
                              <option value="mdi:cog">Settings</option>
                              <option value="mdi:account">User</option>
                              <option value="mdi:email">Email</option>
                              <option value="mdi:phone">Phone</option>
                              <option value="mdi:calendar">Calendar</option>
                              <option value="mdi:clock">Clock</option>
                              <option value="mdi:check">Check</option>
                              <option value="mdi:alert">Alert</option>
                              <option value="mdi:information">Information</option>
                              <option value="mdi:warning">Warning</option>
                              <option value="mdi:error">Error</option>
                              <option value="mdi:check-circle">Success</option>
                              <option value="mdi:download">Download</option>
                              <option value="mdi:upload">Upload</option>
                              <option value="mdi:edit">Edit</option>
                              <option value="mdi:delete">Delete</option>
                              <option value="mdi:save">Save</option>
                              <option value="mdi:refresh">Refresh</option>
                              <option value="mdi:menu">Menu</option>
                              <option value="mdi:dots-vertical">More</option>
                              <option value="mdi:share">Share</option>
                              <option value="mdi:bookmark">Bookmark</option>
                            </select>

                            <!-- Select for icon sizes -->
                            <select
                              v-else-if="key === 'size'"
                              v-model="componentConfig.props[key]"
                              class="bg-background w-full rounded-md border px-3 py-2 text-sm"
                              @change="updateJsonFromProps(componentConfig)"
                            >
                              <option value="1rem">Small (16px)</option>
                              <option value="1.25rem">Medium (20px)</option>
                              <option value="1.5rem">Large (24px)</option>
                              <option value="2rem">Extra Large (32px)</option>
                              <option value="2.5rem">2XL (40px)</option>
                              <option value="3rem">3XL (48px)</option>
                              <option value="4rem">4XL (64px)</option>
                              <!-- MetricCard and StatusBadge sizes -->
                              <option value="sm">Small</option>
                              <option value="md">Medium</option>
                              <option value="lg">Large</option>
                            </select>

                            <!-- Select for icon variants -->
                            <select
                              v-else-if="key === 'iconVariant'"
                              v-model="componentConfig.props[key]"
                              class="bg-background w-full rounded-md border px-3 py-2 text-sm"
                              @change="updateJsonFromProps(componentConfig)"
                            >
                              <option value="primary">Primary</option>
                              <option value="success">Success</option>
                              <option value="warning">Warning</option>
                              <option value="error">Error</option>
                              <option value="info">Info</option>
                            </select>

                            <!-- Select for status badge variants -->
                            <select
                              v-else-if="key === 'variant'"
                              v-model="componentConfig.props[key]"
                              class="bg-background w-full rounded-md border px-3 py-2 text-sm"
                              @change="updateJsonFromProps(componentConfig)"
                            >
                              <option value="solid">Solid</option>
                              <option value="outline">Outline</option>
                              <option value="soft">Soft</option>
                            </select>

                            <!-- Select for status types -->
                            <select
                              v-else-if="key === 'status'"
                              v-model="componentConfig.props[key]"
                              class="bg-background w-full rounded-md border px-3 py-2 text-sm"
                              @change="updateJsonFromProps(componentConfig)"
                            >
                              <option value="active">Active</option>
                              <option value="success">Success</option>
                              <option value="pending">Pending</option>
                              <option value="warning">Warning</option>
                              <option value="error">Error</option>
                              <option value="draft">Draft</option>
                              <option value="published">Published</option>
                              <option value="archived">Archived</option>
                              <option value="processing">Processing</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="needs_review">Needs Review</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </select>

                            <!-- Range for quality -->
                            <div v-else-if="key === 'quality'" class="space-y-2">
                              <input
                                v-model.number="componentConfig.props[key]"
                                type="range"
                                min="1"
                                max="100"
                                class="w-full"
                                @input="updateJsonFromProps(componentConfig)"
                              />
                              <span class="text-muted-foreground text-sm"
                                >{{ componentConfig.props[key] }}%</span
                              >
                            </div>

                            <!-- Array input for pageSizeOptions -->
                            <div v-else-if="Array.isArray(prop)" class="space-y-2">
                              <input
                                :value="prop.join(', ')"
                                type="text"
                                class="bg-background w-full rounded-md border px-3 py-2 text-sm"
                                :placeholder="'[' + prop.join(', ') + ']'"
                                @input="
                                  (e) =>
                                    updateArrayProp(
                                      componentConfig,
                                      key,
                                      (e.target as HTMLInputElement).value,
                                    )
                                "
                              />
                              <p class="text-muted-foreground text-xs">
                                Enter as comma-separated values
                              </p>
                            </div>

                            <!-- Object input for complex props -->
                            <div
                              v-else-if="typeof prop === 'object' && prop !== null"
                              class="space-y-2"
                            >
                              <JsonInput
                                v-model="componentConfig.jsonProps"
                                :rows="4"
                                readonly
                                hint="Edit in JSON tab above"
                              />
                            </div>

                            <!-- Default text input for other types -->
                            <input
                              v-else
                              v-model="componentConfig.props[key]"
                              type="text"
                              class="bg-background w-full rounded-md border px-3 py-2 text-sm"
                              @input="updateJsonFromProps(componentConfig)"
                            />
                          </div>
                        </div>
                      </Accordion>
                    </div>

                    <!-- Right: Live Preview -->
                    <div class="space-y-4">
                      <h5 class="text-foreground text-sm font-medium">Live Preview</h5>
                      <div
                        class="bg-muted/20 flex min-h-[300px] items-center justify-center rounded-lg border p-6"
                      >
                        <component
                          :is="componentConfig.component"
                          v-bind="componentConfig.props"
                          :open="
                            componentConfig.id === 'dynamic-form-sidebar'
                              ? showFormSidebar
                              : undefined
                          "
                          class="rounded-lg"
                          @page-change="handlePageChange"
                          @per-page-change="handlePerPageChange"
                          @confirm="handleConfirm"
                          @cancel="handleCancel"
                          @submit="handleFormSubmit"
                          @close="handleFormClose"
                        />
                      </div>

                      <!-- Show Modal Button for ConfirmModal -->
                      <div v-if="componentConfig.id === 'confirm-modal'" class="text-center">
                        <button
                          @click="showConfirmModal"
                          class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 shadow-sm transition-colors"
                        >
                          Show Modal
                        </button>
                      </div>

                      <!-- Show Video Player Button -->
                      <div
                        v-if="componentConfig.id === 'video-player'"
                        class="space-y-2 text-center"
                      >
                        <button
                          @click="showVideoPlayer()"
                          class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 shadow-sm transition-colors"
                        >
                          Show Video Player
                        </button>
                      </div>

                      <!-- Show DynamicFormSidebar Button -->
                      <div
                        v-if="componentConfig.id === 'dynamic-form-sidebar'"
                        class="space-y-2 text-center"
                      >
                        <button
                          @click="showDynamicFormSidebar()"
                          class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 shadow-sm transition-colors"
                        >
                          Show Form Sidebar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- DynamicFormSidebar for testing -->
    <DynamicFormSidebar
      v-if="showFormSidebar"
      title="Test Form"
      :form-config="{
        fields: [
          {
            key: 'name',
            type: 'text',
            label: 'Name',
            placeholder: 'Enter name',
            required: true,
          },
          {
            key: 'email',
            type: 'email',
            label: 'Email',
            placeholder: 'Enter email',
            required: true,
          },
        ],
      }"
      :initial-data="{}"
      submit-text="Submit"
      loading-text="Submitting..."
      @close="handleFormClose"
      @submit="handleFormSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, type Component } from 'vue'
import AppBar from '@/components/molecules/AppBar.vue'
import Image from '@/components/molecules/Image.vue'
import ToastMessage from '@/components/molecules/ToastMessage.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import Pagination from '@/components/molecules/Pagination.vue'
import ConfirmModal from '@/components/molecules/ConfirmModal.vue'
import JsonInput from '@/components/atoms/JsonInput.vue'
import Accordion from '@/components/atoms/Accordion.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import Sidebar from '@/components/atoms/Sidebar.vue'
import ActionsMenu from '@/components/atoms/ActionsMenu.vue'
import VideoPlayer from '@/components/organisms/VideoPlayer.vue'
import AudioPlayer from '@/components/organisms/AudioPlayer.vue'
import Icon from '@/components/atoms/Icon.vue'
import MetricCard from '@/components/molecules/MetricCard.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import DynamicFormSidebar from '@/components/molecules/DynamicFormSidebar.vue'

// Single source of truth for component definitions
interface ComponentDefinition {
  id: string
  title: string
  description: string
  componentName: string
  component: Component
  section: 'atoms' | 'molecules' | 'organisms' | 'templates'
  defaultProps: Record<string, unknown>
}

// Component definitions organized by atomic design sections
const componentDefinitions: ComponentDefinition[] = [
  {
    id: 'image',
    title: 'Image Component',
    description: 'Cloudflare-optimized image component with responsive support',
    componentName: 'Image',
    component: Image,
    section: 'molecules',
    defaultProps: {
      src: 'https://storage.googleapis.com/movie-dubie-studio-dev/media_1756790449590_z25zpstcg/hidden-truth.jpg',
      alt: 'Sample Image',
      width: 400,
      height: 300,
      preset: 'card',
      format: 'auto',
      quality: 85,
    },
  },
  {
    id: 'toast',
    title: 'Toast Message',
    description: 'Notification component for displaying success, error, warning, and info messages',
    componentName: 'ToastMessage',
    component: ToastMessage,
    section: 'molecules',
    defaultProps: {
      message: {
        id: '1',
        type: 'success',
        title: 'Success!',
        body: 'Your action was completed successfully.',
        timeout: 5000,
      },
    },
  },
  {
    id: 'empty-state',
    title: 'Empty State',
    description: 'Component for displaying empty states with customizable icon, title, and actions',
    componentName: 'EmptyState',
    component: EmptyState,
    section: 'molecules',
    defaultProps: {
      title: 'No items found',
      subtitle: 'Try adjusting your search or filter criteria',
      icon: true,
    },
  },
  {
    id: 'pagination',
    title: 'Pagination',
    description: 'Navigation component for paginated content with page size controls',
    componentName: 'Pagination',
    component: Pagination,
    section: 'molecules',
    defaultProps: {
      currentPage: 1,
      totalPages: 10,
      total: 100,
      perPage: 10,
      pageSizeOptions: [5, 10, 20, 50, 100],
    },
  },
  {
    id: 'confirm-modal',
    title: 'Confirm Modal',
    description: 'Modal dialog for confirming destructive actions',
    componentName: 'ConfirmModal',
    component: ConfirmModal,
    section: 'molecules',
    defaultProps: {
      open: false,
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    },
  },
  {
    id: 'json-input',
    title: 'JSON Input',
    description: 'Textarea component for editing JSON with validation',
    componentName: 'JsonInput',
    component: JsonInput,
    section: 'atoms',
    defaultProps: {
      label: 'JSON Input',
      placeholder: 'Enter JSON...',
      rows: 4,
      readonly: false,
    },
  },
  {
    id: 'video-player',
    title: 'Video Player',
    description:
      'Advanced video player with HLS support, subtitles, custom controls, and PiP support',
    componentName: 'VideoPlayer',
    component: VideoPlayer,
    section: 'organisms',
    defaultProps: {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      title: 'Sample Video',
      subtitleUrl: '',
    },
  },
  {
    id: 'audio-player',
    title: 'Audio Player',
    description: 'Professional audio player with progress controls, volume, and keyboard shortcuts',
    componentName: 'AudioPlayer',
    component: AudioPlayer,
    section: 'organisms',
    defaultProps: {
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      title: 'Sample Audio',
      mode: 'inline',
      autoplay: false,
      loop: false,
      preload: 'metadata',
    },
  },
  {
    id: 'accordion',
    title: 'Accordion',
    description: 'Collapsible content section with header',
    componentName: 'Accordion',
    component: Accordion,
    section: 'atoms',
    defaultProps: {
      title: 'Accordion Section',
      count: 3,
      defaultOpen: false,
    },
  },
  {
    id: 'icon',
    title: 'Icon',
    description: 'Dynamic icon component using Material Design Icons (MDI) loaded from server',
    componentName: 'Icon',
    component: Icon,
    section: 'atoms',
    defaultProps: {
      name: 'mdi:heart',
      size: '2rem',
    },
  },
  {
    id: 'metric-card',
    title: 'MetricCard (Enhanced)',
    description: 'Enhanced metric card component with comprehensive slot system for custom layouts',
    componentName: 'MetricCard',
    component: MetricCard,
    section: 'molecules',
    defaultProps: {
      title: 'Total Revenue',
      value: 125000,
      subtitle: 'Last 30 days',
      icon: 'mdi:currency-usd',
      iconVariant: 'primary',
      size: 'md',
      trend: {
        value: 12.5,
        direction: 'up',
        period: 'vs last month',
      },
    },
  },
  {
    id: 'status-badge',
    title: 'StatusBadge (Enhanced)',
    description: 'Enhanced status badge component with custom display slots and actions',
    componentName: 'StatusBadge',
    component: StatusBadge,
    section: 'atoms',
    defaultProps: {
      status: 'active',
      label: 'Active',
      size: 'md',
      variant: 'soft',
      showDot: false,
    },
  },
  {
    id: 'dynamic-form-sidebar',
    title: 'DynamicFormSidebar (Enhanced)',
    description: 'Enhanced form sidebar with advanced slot support for custom layouts and actions',
    componentName: 'DynamicFormSidebar',
    component: DynamicFormSidebar,
    section: 'molecules',
    defaultProps: {
      title: 'Create New Item',
      formConfig: {
        fields: [
          {
            key: 'name',
            type: 'text',
            label: 'Name',
            placeholder: 'Enter name',
            required: true,
          },
          {
            key: 'email',
            type: 'email',
            label: 'Email',
            placeholder: 'Enter email',
            required: true,
          },
        ],
      },
      initialData: {},
      loading: false,
      submitText: 'Submit',
      loadingText: 'Submitting...',
    },
  },
]

// Extended component config interface
interface ComponentConfig {
  id: string
  title: string
  description: string
  componentName: string
  component: Component
  section: 'atoms' | 'molecules' | 'organisms' | 'templates'
  defaultProps: Record<string, unknown>
  props: Record<string, unknown>
  jsonProps: string
}

// Generate component configs from definitions
const componentConfigs = reactive<ComponentConfig[]>(
  componentDefinitions.map((def) => ({
    ...def,
    props: { ...def.defaultProps },
    jsonProps: JSON.stringify(def.defaultProps, null, 2),
  })),
)

// Navigation functionality
const activeComponentId = ref('image')

// DynamicFormSidebar state
const showFormSidebar = ref(false)

// Generate sidebar sections from component definitions
const sidebarSections = computed(() => {
  const sections = new Map<
    string,
    {
      id: string
      title: string
      items: { id: string; title: string; description: string; action: () => void }[]
    }
  >()

  // Initialize sections
  sections.set('atoms', { id: 'atoms', title: 'Atoms', items: [] })
  sections.set('molecules', { id: 'molecules', title: 'Molecules', items: [] })
  sections.set('organisms', { id: 'organisms', title: 'Organisms', items: [] })
  sections.set('templates', { id: 'templates', title: 'Templates', items: [] })

  // Populate sections with components
  componentDefinitions.forEach((def) => {
    const section = sections.get(def.section)
    if (section) {
      section.items.push({
        id: def.id,
        title: def.title,
        description: def.description,
        action: () => navigateToComponent(def.id),
      })
    }
  })

  // Return only sections that have components
  return Array.from(sections.values()).filter((section) => section.items.length > 0)
})

// Create quick action menu items
const quickActionItems = computed(() => [
  {
    key: 'search',
    label: 'Search Components',
    description: 'Quick search through all components',
    value: 'Ctrl+K',
  },
  {
    key: 'favorites',
    label: 'Favorites',
    description: 'View your favorite components',
    value: '★',
  },
  {
    key: 'recent',
    label: 'Recently Viewed',
    description: "Components you've recently accessed",
    value: '🕒',
  },
])

// Navigate to a specific component section
const navigateToComponent = (componentId: string) => {
  activeComponentId.value = componentId
  const element = document.getElementById(componentId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}

// Update props from JSON input
const updatePropsFromJson = (config: ComponentConfig) => {
  try {
    const parsed = JSON.parse(config.jsonProps)
    Object.assign(config.props, parsed)
  } catch {
    // Invalid JSON, ignore
  }
}

// Update JSON from props changes
const updateJsonFromProps = (config: ComponentConfig) => {
  config.jsonProps = JSON.stringify(config.props, null, 2)
}

// Update array props from comma-separated string
const updateArrayProp = (config: ComponentConfig, key: string, value: string) => {
  try {
    const arrayValue = value.split(',').map((item) => {
      const trimmed = item.trim()
      // Try to convert to number if possible
      const num = Number(trimmed)
      return isNaN(num) ? trimmed : num
    })
    config.props[key] = arrayValue
    updateJsonFromProps(config)
  } catch {
    // Invalid input, ignore
  }
}

// Handle pagination events
const handlePageChange = (page: number) => {
  const paginationConfig = componentConfigs.find((c) => c.id === 'pagination')
  if (paginationConfig) {
    paginationConfig.props.currentPage = page
    updateJsonFromProps(paginationConfig)
  }
}

const handlePerPageChange = (perPage: number) => {
  const paginationConfig = componentConfigs.find((c) => c.id === 'pagination')
  if (paginationConfig) {
    paginationConfig.props.perPage = perPage
    paginationConfig.props.currentPage = 1
    updateJsonFromProps(paginationConfig)
  }
}

// Handle confirm modal events
const handleConfirm = () => {
  console.log('Confirm action triggered')
  // Close the modal by setting open to false
  const confirmModalConfig = componentConfigs.find((c) => c.id === 'confirm-modal')
  if (confirmModalConfig) {
    confirmModalConfig.props.open = false
    updateJsonFromProps(confirmModalConfig)
  }
}

const handleCancel = () => {
  console.log('Cancel action triggered')
  // Close the modal by setting open to false
  const confirmModalConfig = componentConfigs.find((c) => c.id === 'confirm-modal')
  if (confirmModalConfig) {
    confirmModalConfig.props.open = false
    updateJsonFromProps(confirmModalConfig)
  }
}

// Show confirm modal for testing
const showConfirmModal = () => {
  const confirmModalConfig = componentConfigs.find((c) => c.id === 'confirm-modal')
  if (confirmModalConfig) {
    confirmModalConfig.props.open = true
    updateJsonFromProps(confirmModalConfig)
  }
}

// Show video player for testing
const showVideoPlayer = () => {
  const videoPlayerConfig = componentConfigs.find((c) => c.id === 'video-player')
  if (videoPlayerConfig) {
    // VideoPlayer is always visible when rendered, no need to toggle
    console.log('Video player is now visible')
  }
}

// Show DynamicFormSidebar for testing
const showDynamicFormSidebar = () => {
  showFormSidebar.value = true
}

// Handle form sidebar events
const handleFormSubmit = (data: Record<string, unknown>) => {
  console.log('Form submitted:', data)
  showFormSidebar.value = false
}

const handleFormClose = () => {
  showFormSidebar.value = false
}
</script>
