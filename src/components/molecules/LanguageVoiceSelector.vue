<template>
  <div class="space-y-4">
    <!-- Label -->
    <label v-if="label" class="text-foreground block text-sm font-medium">
      {{ label }}
      <span v-if="required" class="ml-1 text-red-500">*</span>
    </label>

    <!-- Description -->
    <p v-if="description" class="text-muted-foreground text-sm">
      {{ description }}
    </p>

    <!-- Search Input -->
    <div v-if="searchable" class="relative">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="searchPlaceholder"
        class="border-border bg-input text-foreground focus:border-primary focus:ring-primary w-full rounded-md border px-3 py-2 pl-10 text-sm focus:ring-2 focus:outline-none"
      />
      <div class="absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon name="mdi:magnify" class="text-muted-foreground h-4 w-4" />
      </div>
    </div>

    <!-- Selection Type Toggle -->
    <div v-if="showTypeToggle" class="flex space-x-4">
      <button
        :class="[
          'rounded-md px-3 py-1 text-sm font-medium transition-colors',
          selectionType === 'languages'
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:text-foreground',
        ]"
        @click="selectionType = 'languages'"
      >
        Languages
      </button>
      <button
        :class="[
          'rounded-md px-3 py-1 text-sm font-medium transition-colors',
          selectionType === 'voice-types'
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:text-foreground',
        ]"
        @click="selectionType = 'voice-types'"
      >
        Voice Types
      </button>
    </div>

    <!-- Options Grid -->
    <div class="max-h-64 overflow-y-auto">
      <div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
        <button
          v-for="option in filteredOptions"
          :key="option.value"
          :class="[
            'flex items-center space-x-2 rounded-lg border p-3 text-left transition-colors',
            isSelected(option.value)
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border hover:border-primary/50 hover:bg-muted',
          ]"
          @click="toggleSelection(option.value)"
        >
          <input
            :checked="isSelected(option.value)"
            type="checkbox"
            class="border-border text-primary focus:ring-primary h-4 w-4 rounded"
            readonly
          />
          <div class="min-w-0 flex-1">
            <div class="truncate text-sm font-medium">{{ option.label }}</div>
            <div v-if="option.description" class="truncate text-xs text-gray-500">
              {{ option.description }}
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Selected Items Summary -->
    <div v-if="selectedItems.length > 0" class="space-y-2">
      <div class="text-muted-foreground text-sm">
        {{ selectedItems.length }} item{{ selectedItems.length !== 1 ? 's' : '' }} selected
      </div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="item in selectedItems"
          :key="item.value"
          class="bg-primary/10 text-primary inline-flex items-center space-x-1 rounded-full px-2 py-1 text-xs"
        >
          <span>{{ item.label }}</span>
          <button @click="removeSelection(item.value)" class="hover:text-primary/80 ml-1">
            <Icon name="mdi:close" class="h-3 w-3" />
          </button>
        </span>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="errorMessage" class="text-sm text-red-600 dark:text-red-400">
      {{ errorMessage }}
    </p>

    <!-- Help Text -->
    <p v-if="helpText" class="text-muted-foreground text-xs">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Icon from '@/components/atoms/Icon.vue'

interface Option {
  value: string
  label: string
  description?: string
  category?: string
}

interface Props {
  modelValue?: string[]
  label?: string
  description?: string
  required?: boolean
  searchable?: boolean
  showTypeToggle?: boolean
  searchPlaceholder?: string
  helpText?: string
  languages?: Option[]
  voiceTypes?: Option[]
  maxSelections?: number
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  searchable: true,
  showTypeToggle: false,
  searchPlaceholder: 'Search options...',
  languages: () => [
    { value: 'en', label: 'English', description: 'Native English' },
    { value: 'es', label: 'Spanish', description: 'Español' },
    { value: 'fr', label: 'French', description: 'Français' },
    { value: 'de', label: 'German', description: 'Deutsch' },
    { value: 'it', label: 'Italian', description: 'Italiano' },
    { value: 'pt', label: 'Portuguese', description: 'Português' },
    { value: 'ru', label: 'Russian', description: 'Русский' },
    { value: 'ja', label: 'Japanese', description: '日本語' },
    { value: 'ko', label: 'Korean', description: '한국어' },
    { value: 'zh', label: 'Chinese', description: '中文' },
  ],
  voiceTypes: () => [
    { value: 'narrator', label: 'Narrator', description: 'Documentary, audiobook' },
    { value: 'character', label: 'Character', description: 'Animation, video games' },
    { value: 'announcer', label: 'Announcer', description: 'Commercial, radio' },
    { value: 'commercial', label: 'Commercial', description: 'TV, radio ads' },
    { value: 'audiobook', label: 'Audiobook', description: 'Book narration' },
    { value: 'podcast', label: 'Podcast', description: 'Podcast hosting' },
    { value: 'animation', label: 'Animation', description: 'Cartoon, anime' },
    { value: 'video_game', label: 'Video Game', description: 'Game characters' },
    { value: 'documentary', label: 'Documentary', description: 'Educational content' },
    { value: 'e-learning', label: 'E-Learning', description: 'Training materials' },
  ],
  maxSelections: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  change: [value: string[]]
}>()

// Local state
const selectedValues = ref<string[]>([...(props.modelValue || [])])
const searchQuery = ref('')
const selectionType = ref<'languages' | 'voice-types'>('languages')
const errorMessage = ref('')

// Computed
const currentOptions = computed(() => {
  return selectionType.value === 'languages' ? props.languages : props.voiceTypes
})

const filteredOptions = computed(() => {
  if (!searchQuery.value) return currentOptions.value

  const query = searchQuery.value.toLowerCase()
  return currentOptions.value.filter(
    (option) =>
      option.label.toLowerCase().includes(query) ||
      option.description?.toLowerCase().includes(query) ||
      option.value.toLowerCase().includes(query),
  )
})

const selectedItems = computed(() => {
  return currentOptions.value.filter((option) => selectedValues.value.includes(option.value))
})

// Methods
const isSelected = (value: string) => {
  return selectedValues.value.includes(value)
}

const toggleSelection = (value: string) => {
  if (isSelected(value)) {
    removeSelection(value)
  } else {
    addSelection(value)
  }
}

const addSelection = (value: string) => {
  if (props.maxSelections && selectedValues.value.length >= props.maxSelections) {
    errorMessage.value = `Maximum ${props.maxSelections} selections allowed`
    return
  }

  selectedValues.value.push(value)
  errorMessage.value = ''
  emitChanges()
}

const removeSelection = (value: string) => {
  const index = selectedValues.value.indexOf(value)
  if (index > -1) {
    selectedValues.value.splice(index, 1)
    errorMessage.value = ''
    emitChanges()
  }
}

const emitChanges = () => {
  emit('update:modelValue', [...selectedValues.value])
  emit('change', [...selectedValues.value])
}

// Watch for external changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      selectedValues.value = [...newValue]
    }
  },
  { deep: true },
)

// Watch for selection type changes
watch(selectionType, () => {
  searchQuery.value = ''
})
</script>
