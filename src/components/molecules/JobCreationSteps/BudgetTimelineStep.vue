<template>
  <div class="max-w-3xl mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-4">Budget & Timeline</h1>
      <p class="text-lg text-muted-foreground">
        Set your budget range and project timeline
      </p>
    </div>

    <div class="space-y-8">
      <!-- Budget Section -->
      <div class="bg-card rounded-lg border border-border p-6">
        <h3 class="text-lg font-semibold text-foreground mb-4">Budget Range</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Currency
            </label>
            <SelectInput
              v-model="localBudget.currency"
              :options="currencyOptions"
              placeholder="Select currency"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Minimum Budget *
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                {{ getCurrencySymbol(localBudget.currency) }}
              </span>
              <input
                v-model.number="localBudget.min"
                type="number"
                min="0"
                step="1"
                required
                class="w-full pl-8 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Maximum Budget *
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                {{ getCurrencySymbol(localBudget.currency) }}
              </span>
              <input
                v-model.number="localBudget.max"
                type="number"
                min="0"
                step="1"
                required
                class="w-full pl-8 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0"
              />
            </div>
          </div>
        </div>
        
        <!-- Budget Range Display -->
        <div v-if="localBudget.min > 0 && localBudget.max > 0" class="mt-4 p-3 bg-muted/50 rounded-lg">
          <div class="flex items-center justify-between text-sm">
            <span class="text-muted-foreground">Budget Range:</span>
            <span class="font-medium text-foreground">
              {{ getCurrencySymbol(localBudget.currency) }}{{ localBudget.min.toLocaleString() }} - 
              {{ getCurrencySymbol(localBudget.currency) }}{{ localBudget.max.toLocaleString() }}
            </span>
          </div>
          <div class="flex items-center justify-between text-sm mt-1">
            <span class="text-muted-foreground">Average:</span>
            <span class="font-medium text-foreground">
              {{ getCurrencySymbol(localBudget.currency) }}{{ Math.round((localBudget.min + localBudget.max) / 2).toLocaleString() }}
            </span>
          </div>
        </div>
      </div>

      <!-- Timeline Section -->
      <div class="bg-card rounded-lg border border-border p-6">
        <h3 class="text-lg font-semibold text-foreground mb-4">Project Timeline</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Project Deadline *
            </label>
            <input
              v-model="localDeadline"
              type="date"
              required
              :min="minDate"
              class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p class="text-sm text-muted-foreground mt-1">
              When do you need the final deliverables?
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Estimated Duration
            </label>
            <SelectInput
              v-model="localEstimatedDuration"
              :options="durationOptions"
              placeholder="Select duration"
            />
            <p class="text-sm text-muted-foreground mt-1">
              How long will the project take to complete?
            </p>
          </div>
        </div>
      </div>

      <!-- Quality Requirements -->
      <div class="bg-card rounded-lg border border-border p-6">
        <h3 class="text-lg font-semibold text-foreground mb-4">Quality Requirements</h3>
        
        <div class="space-y-4">
          <div 
            v-for="quality in qualityOptions" 
            :key="quality.value"
            class="relative"
          >
            <input
              :id="quality.value"
              v-model="localQuality"
              type="radio"
              :value="quality.value"
              class="sr-only"
            />
            <label
              :for="quality.value"
              class="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all"
              :class="localQuality === quality.value 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'"
            >
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <Icon :name="quality.icon" class="h-5 w-5 text-primary" />
                  <h4 class="font-medium text-foreground">{{ quality.label }}</h4>
                </div>
                <p class="text-sm text-muted-foreground">{{ quality.description }}</p>
                <div class="mt-2 text-xs text-muted-foreground">
                  <strong>Typical use:</strong> {{ quality.useCase }}
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Timeline Summary -->
      <div v-if="hasTimeline" class="bg-muted/50 rounded-lg p-4">
        <h4 class="font-medium text-foreground mb-2">Timeline Summary</h4>
        <div class="space-y-1 text-sm text-muted-foreground">
          <div v-if="localDeadline">
            <strong>Deadline:</strong> {{ formatDate(localDeadline) }}
          </div>
          <div v-if="localEstimatedDuration">
            <strong>Duration:</strong> {{ localEstimatedDuration }}
          </div>
          <div v-if="localQuality">
            <strong>Quality Level:</strong> {{ getQualityLabel(localQuality) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between mt-8">
      <Button variant="outline" size="lg" @click="handlePrevious">
        <Icon name="mdi:arrow-left" class="h-4 w-4 mr-2" />
        Previous
      </Button>
      
      <Button 
        variant="primary" 
        size="lg" 
        @click="handleNext"
        :disabled="!isValid"
        class="px-8"
      >
        Continue
        <Icon name="mdi:arrow-right" class="h-4 w-4 ml-2" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'

interface Budget {
  min: number
  max: number
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'VND'
}

interface Props {
  budget: Budget
  deadline: string
  estimatedDuration: string
  quality: 'standard' | 'professional' | 'broadcast'
}

interface Emits {
  (e: 'update:budget', value: Budget): void
  (e: 'update:deadline', value: string): void
  (e: 'update:estimatedDuration', value: string): void
  (e: 'update:quality', value: 'standard' | 'professional' | 'broadcast'): void
  (e: 'next'): void
  (e: 'previous'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localBudget = ref({ ...props.budget })
const localDeadline = ref(props.deadline)
const localEstimatedDuration = ref(props.estimatedDuration)
const localQuality = ref(props.quality)

// Options
const currencyOptions = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD (C$)' },
  { value: 'AUD', label: 'AUD (A$)' },
  { value: 'VND', label: 'VND (₫)' }
]

const durationOptions = [
  { value: '1-2 days', label: '1-2 days' },
  { value: '3-5 days', label: '3-5 days' },
  { value: '1 week', label: '1 week' },
  { value: '2 weeks', label: '2 weeks' },
  { value: '3-4 weeks', label: '3-4 weeks' },
  { value: '1 month', label: '1 month' },
  { value: '2-3 months', label: '2-3 months' },
  { value: 'Ongoing', label: 'Ongoing' }
]

const qualityOptions = [
  {
    value: 'standard',
    label: 'Standard Quality',
    description: 'Good quality suitable for most projects',
    icon: 'mdi:check-circle',
    useCase: 'Podcasts, e-learning, internal presentations'
  },
  {
    value: 'professional',
    label: 'Professional Quality',
    description: 'High-quality production suitable for commercial use',
    icon: 'mdi:star',
    useCase: 'Commercials, audiobooks, corporate videos'
  },
  {
    value: 'broadcast',
    label: 'Broadcast Quality',
    description: 'Highest quality for broadcast and premium content',
    icon: 'mdi:star-circle',
    useCase: 'TV commercials, film, premium streaming content'
  }
]

// Computed properties
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const isValid = computed(() => {
  return localBudget.value.min > 0 && 
         localBudget.value.max >= localBudget.value.min &&
         localDeadline.value.length > 0
})

const hasTimeline = computed(() => {
  return localDeadline.value || localEstimatedDuration.value || localQuality.value
})

// Methods
const getCurrencySymbol = (currency: string) => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    VND: '₫'
  }
  return symbols[currency] || '$'
}

const getQualityLabel = (quality: string) => {
  const option = qualityOptions.find(q => q.value === quality)
  return option?.label || quality
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
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
watch(localBudget, (newValue) => emit('update:budget', newValue), { deep: true })
watch(localDeadline, (newValue) => emit('update:deadline', newValue))
watch(localEstimatedDuration, (newValue) => emit('update:estimatedDuration', newValue))
watch(localQuality, (newValue) => emit('update:quality', newValue))
</script>
