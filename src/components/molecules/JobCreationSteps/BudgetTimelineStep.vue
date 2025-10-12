<template>
  <div class="mx-auto max-w-3xl">
    <div class="mb-8 text-center">
      <h1 class="text-foreground mb-4 text-3xl font-bold">Budget & Timeline</h1>
      <p class="text-muted-foreground text-lg">Set your budget range and project timeline</p>
    </div>

    <div class="space-y-8">
      <!-- Budget Section -->
      <div class="bg-card border-border rounded-lg border p-6">
        <h3 class="text-foreground mb-4 text-lg font-semibold">Budget</h3>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label class="text-foreground mb-2 block text-sm font-medium"> Currency </label>
            <SelectInput
              v-model="localBudget.currency"
              :options="currencyOptions"
              placeholder="Select currency"
            />
          </div>

          <div>
            <label class="text-foreground mb-2 block text-sm font-medium"> Maximum Budget * </label>
            <div class="relative">
              <span
                class="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform"
              >
                {{ getCurrencySymbol(localBudget.currency) }}
              </span>
              <input
                v-model.number="localBudget.max"
                type="number"
                min="0"
                step="1"
                required
                class="border-border focus:ring-primary w-full rounded-md border py-2 pr-3 pl-8 focus:ring-2 focus:outline-none"
                placeholder="0"
              />
            </div>
            <p class="text-muted-foreground mt-1 text-sm">
              The maximum amount you're willing to pay for this project
            </p>
          </div>
        </div>

        <!-- Budget Display -->
        <div v-if="localBudget.max > 0" class="bg-muted/50 mt-4 rounded-lg p-3">
          <div class="flex items-center justify-between text-sm">
            <span class="text-muted-foreground">Maximum Budget:</span>
            <span class="text-foreground font-medium">
              {{ getCurrencySymbol(localBudget.currency) }}{{ localBudget.max.toLocaleString() }}
            </span>
          </div>
        </div>
      </div>

      <!-- Timeline Section -->
      <div class="bg-card border-border rounded-lg border p-6">
        <h3 class="text-foreground mb-4 text-lg font-semibold">Project Timeline</h3>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label class="text-foreground mb-2 block text-sm font-medium">
              Project Deadline *
            </label>
            <input
              v-model="localDeadline"
              type="date"
              required
              :min="minDate"
              class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
            />
            <p class="text-muted-foreground mt-1 text-sm">
              When do you need the final deliverables?
            </p>
          </div>

          <div>
            <label class="text-foreground mb-2 block text-sm font-medium">
              Estimated Duration
            </label>
            <SelectInput
              v-model="localEstimatedDuration"
              :options="durationOptions"
              placeholder="Select duration"
            />
            <p class="text-muted-foreground mt-1 text-sm">
              How long will the project take to complete?
            </p>
          </div>
        </div>
      </div>

      <!-- Timeline Summary -->
      <div v-if="hasTimeline" class="bg-muted/50 rounded-lg p-4">
        <h4 class="text-foreground mb-2 font-medium">Timeline Summary</h4>
        <div class="text-muted-foreground space-y-1 text-sm">
          <div v-if="localDeadline"><strong>Deadline:</strong> {{ formatDate(localDeadline) }}</div>
          <div v-if="localEstimatedDuration">
            <strong>Duration:</strong> {{ localEstimatedDuration }}
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="mt-8 flex justify-between">
      <Button variant="outline" size="lg" @click="handlePrevious">
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
  { value: 'VND', label: 'VND (₫)' },
]

const durationOptions = [
  { value: '1-2 days', label: '1-2 days' },
  { value: '3-5 days', label: '3-5 days' },
  { value: '1 week', label: '1 week' },
  { value: '2 weeks', label: '2 weeks' },
  { value: '3-4 weeks', label: '3-4 weeks' },
  { value: '1 month', label: '1 month' },
  { value: '2-3 months', label: '2-3 months' },
  { value: 'Ongoing', label: 'Ongoing' },
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
    VND: '₫',
  }
  return symbols[currency] || '$'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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
