<template>
  <div class="mx-auto max-w-3xl">
    <div class="mb-8 text-center">
      <h1 class="text-foreground mb-4 text-3xl font-bold">AI Voice Settings</h1>
      <p class="text-muted-foreground text-lg">Configure your AI voice synthesis parameters</p>
    </div>

    <div class="space-y-8">
      <!-- Voice Model Selection -->
      <div class="bg-card border-border rounded-lg border p-6">
        <h3 class="text-foreground mb-4 text-lg font-semibold">Voice Model</h3>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div
            v-for="model in voiceModels"
            :key="model.id"
            class="group relative cursor-pointer"
            @click="localAISettings.voiceModel = model.id"
          >
            <input
              :id="model.id"
              v-model="localAISettings.voiceModel"
              type="radio"
              :value="model.id"
              class="sr-only"
            />
            <label
              :for="model.id"
              class="flex cursor-pointer flex-col rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md"
              :class="
                localAISettings.voiceModel === model.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              "
            >
              <div class="mb-2 flex items-center space-x-3">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-lg"
                  :class="
                    localAISettings.voiceModel === model.id
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  "
                >
                  <Icon :name="model.icon" class="h-5 w-5" />
                </div>
                <div class="flex-1">
                  <h4 class="text-foreground font-semibold">{{ model.name }}</h4>
                  <p class="text-muted-foreground text-sm">{{ model.description }}</p>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-primary text-sm font-medium">{{ model.price }}</span>
                <div class="flex items-center space-x-1">
                  <Icon name="mdi:star" class="h-4 w-4 text-yellow-500" />
                  <span class="text-muted-foreground text-sm">{{ model.rating }}</span>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Voice Style & Emotion -->
      <div class="bg-card border-border rounded-lg border p-6">
        <h3 class="text-foreground mb-4 text-lg font-semibold">Voice Characteristics</h3>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label class="text-foreground mb-2 block text-sm font-medium"> Voice Style </label>
            <SelectInput
              v-model="localAISettings.voiceStyle"
              :options="voiceStyleOptions"
              placeholder="Select voice style"
            />
          </div>

          <div>
            <label class="text-foreground mb-2 block text-sm font-medium"> Emotion </label>
            <SelectInput
              v-model="localAISettings.emotion"
              :options="emotionOptions"
              placeholder="Select emotion"
            />
          </div>
        </div>
      </div>

      <!-- Voice Parameters -->
      <div class="bg-card border-border rounded-lg border p-6">
        <h3 class="text-foreground mb-4 text-lg font-semibold">Voice Parameters</h3>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label class="text-foreground mb-2 block text-sm font-medium"> Speed </label>
            <SelectInput
              v-model="localAISettings.speed"
              :options="speedOptions"
              placeholder="Select speed"
            />
          </div>

          <div>
            <label class="text-foreground mb-2 block text-sm font-medium"> Pitch </label>
            <SelectInput
              v-model="localAISettings.pitch"
              :options="pitchOptions"
              placeholder="Select pitch"
            />
          </div>
        </div>
      </div>

      <!-- File Upload -->
      <div class="bg-card border-border rounded-lg border p-6">
        <h3 class="text-foreground mb-4 text-lg font-semibold">Project Files</h3>

        <div class="space-y-4">
          <div>
            <label class="text-foreground mb-2 block text-sm font-medium"> Script File </label>
            <FileUpload
              v-model="localFiles.script"
              accept=".pdf,.doc,.docx,.txt"
              :max-size="10"
              @upload="
                (file: File | File[]) => handleScriptUpload(Array.isArray(file) ? file[0] : file)
              "
            />
          </div>
        </div>
      </div>

      <!-- Budget & Timeline -->
      <div class="bg-card border-border rounded-lg border p-6">
        <h3 class="text-foreground mb-4 text-lg font-semibold">Budget & Timeline</h3>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label class="text-foreground mb-2 block text-sm font-medium">
              Budget ({{ getCurrencySymbol(localBudget.currency) }})
            </label>
            <div class="relative">
              <input
                v-model.number="localBudget.max"
                type="number"
                min="0"
                step="1"
                class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                placeholder="Enter maximum budget"
              />
            </div>
          </div>

          <div>
            <label class="text-foreground mb-2 block text-sm font-medium"> Deadline </label>
            <input
              v-model="localDeadline"
              type="date"
              class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="mt-8 flex justify-between">
      <Button variant="outline" size="lg" @click="handlePrevious" class="px-8">
        <Icon name="mdi:arrow-left" class="mr-2 h-4 w-4" />
        Previous
      </Button>

      <Button variant="primary" size="lg" @click="handleNext" :disabled="!isValid" class="px-8">
        Continue
        <Icon name="mdi:arrow-right" class="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import FileUpload from '@/components/atoms/FileUpload.vue'

interface AISettings {
  voiceModel: string
  voiceStyle: string
  emotion: string
  speed: 'slow' | 'normal' | 'fast'
  pitch: 'low' | 'normal' | 'high'
}

interface ProjectFiles {
  script?: File
  referenceAudio?: File
  additional?: File[]
}

interface Budget {
  max: number
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'VND'
}

interface Props {
  aiSettings: AISettings
  files: ProjectFiles
  budget: Budget
  deadline: string
}

interface Emits {
  (e: 'update:aiSettings', value: AISettings): void
  (e: 'update:files', value: ProjectFiles): void
  (e: 'update:budget', value: Budget): void
  (e: 'update:deadline', value: string): void
  (e: 'next'): void
  (e: 'previous'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local reactive data
const localAISettings = ref({ ...props.aiSettings })
const localFiles = ref({ ...props.files })
const localBudget = ref({ ...props.budget })
const localDeadline = ref(props.deadline)

// Voice models
const voiceModels = [
  {
    id: 'natural_female',
    name: 'Natural Female',
    description: 'Warm, professional female voice',
    icon: 'mdi:account',
    price: '$0.10/min',
    rating: '4.8',
  },
  {
    id: 'natural_male',
    name: 'Natural Male',
    description: 'Deep, authoritative male voice',
    icon: 'mdi:account',
    price: '$0.10/min',
    rating: '4.7',
  },
  {
    id: 'youthful_female',
    name: 'Youthful Female',
    description: 'Energetic, young female voice',
    icon: 'mdi:account-heart',
    price: '$0.12/min',
    rating: '4.6',
  },
  {
    id: 'mature_male',
    name: 'Mature Male',
    description: 'Experienced, wise male voice',
    icon: 'mdi:account-tie',
    price: '$0.12/min',
    rating: '4.9',
  },
]

// Options
const voiceStyleOptions = [
  { value: 'conversational', label: 'Conversational' },
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'authoritative', label: 'Authoritative' },
  { value: 'casual', label: 'Casual' },
]

const emotionOptions = [
  { value: 'neutral', label: 'Neutral' },
  { value: 'happy', label: 'Happy' },
  { value: 'serious', label: 'Serious' },
  { value: 'excited', label: 'Excited' },
  { value: 'calm', label: 'Calm' },
]

const speedOptions = [
  { value: 'slow', label: 'Slow' },
  { value: 'normal', label: 'Normal' },
  { value: 'fast', label: 'Fast' },
]

const pitchOptions = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
]

// Validation
const isValid = computed(() => {
  return (
    !!localAISettings.value.voiceModel &&
    !!localAISettings.value.voiceStyle &&
    localBudget.value.max > 0 &&
    localDeadline.value.length > 0
  )
})

// Methods
const getCurrencySymbol = (currency: string) => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    VND: '₫',
  }
  return symbols[currency] || '$'
}

const handleScriptUpload = (file: File) => {
  localFiles.value.script = file
}

const handleNext = () => {
  if (isValid.value) {
    emit('next')
  }
}

const handlePrevious = () => {
  emit('previous')
}

// Watch for changes and emit updates
watch(
  localAISettings,
  (newValue) => {
    emit('update:aiSettings', newValue)
  },
  { deep: true },
)

watch(
  localFiles,
  (newValue) => {
    emit('update:files', newValue)
  },
  { deep: true },
)

watch(
  localBudget,
  (newValue) => {
    emit('update:budget', newValue)
  },
  { deep: true },
)

watch(localDeadline, (newValue) => {
  emit('update:deadline', newValue)
})
</script>
