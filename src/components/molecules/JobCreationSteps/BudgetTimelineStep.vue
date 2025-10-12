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
        <h3 class="text-lg font-semibold text-foreground mb-4">Budget</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <p class="text-sm text-muted-foreground mt-1">
              The maximum amount you're willing to pay for this project
            </p>
          </div>
        </div>
        
        <!-- Budget Display -->
        <div v-if="localBudget.max > 0" class="mt-4 p-3 bg-muted/50 rounded-lg">
          <div class="flex items-center justify-between text-sm">
            <span class="text-muted-foreground">Maximum Budget:</span>
            <span class="font-medium text-foreground">
              {{ getCurrencySymbol(localBudget.currency) }}{{ localBudget.max.toLocaleString() }}
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
  max: number
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'VND'
}

interface Props {
  budget: Budget
  deadline: string
  estimatedDuration: string
}

interface Emits {
  (e: 'update:budget', value: Budget): void
  (e: 'update:deadline', value: string): void
  (e: 'update:estimatedDuration', value: string): void
  (e: 'next'): void
  (e: 'previous'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localBudget = ref({ ...props.budget })
const localDeadline = ref(props.deadline)
const localEstimatedDuration = ref(props.estimatedDuration)

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


// Computed properties
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const isValid = computed(() => {
  return localBudget.value.max > 0 && localDeadline.value.length > 0
})

const hasTimeline = computed(() => {
  return localDeadline.value || localEstimatedDuration.value
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
</script>
