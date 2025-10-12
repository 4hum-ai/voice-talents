<template>
  <div class="mx-auto max-w-3xl">
    <div class="mb-8 text-center">
      <h1 class="text-foreground mb-4 text-3xl font-bold">Budget & Payment</h1>
      <p class="text-muted-foreground text-lg">Set your budget and payment preferences</p>
    </div>

    <div class="space-y-8">
      <!-- Budget Section -->
      <div class="bg-card border-border rounded-lg border p-6">
        <h3 class="text-foreground mb-4 text-lg font-semibold">Budget</h3>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label class="text-foreground mb-2 block text-sm font-medium">
              Maximum Budget ({{ getCurrencySymbol(localBudget.currency) }})
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
            <p class="text-muted-foreground mt-1 text-xs">
              This is the maximum amount you're willing to pay for this project
            </p>
          </div>

          <div>
            <label class="text-foreground mb-2 block text-sm font-medium"> Currency </label>
            <SelectInput
              v-model="localBudget.currency"
              :options="currencyOptions"
              placeholder="Select currency"
            />
          </div>
        </div>
      </div>

      <!-- Timeline Section -->
      <div class="bg-card border-border rounded-lg border p-6">
        <h3 class="text-foreground mb-4 text-lg font-semibold">Timeline</h3>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label class="text-foreground mb-2 block text-sm font-medium"> Project Deadline </label>
            <input
              v-model="localDeadline"
              type="date"
              class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
            />
            <p class="text-muted-foreground mt-1 text-xs">
              When do you need this project completed?
            </p>
          </div>

          <div>
            <label class="text-foreground mb-2 block text-sm font-medium"> Urgency Level </label>
            <SelectInput
              v-model="urgencyLevel"
              :options="urgencyOptions"
              placeholder="Select urgency"
            />
          </div>
        </div>
      </div>

      <!-- Payment Method -->
      <div class="bg-card border-border rounded-lg border p-6">
        <h3 class="text-foreground mb-4 text-lg font-semibold">Payment Method</h3>

        <div class="space-y-4">
          <div
            v-for="method in paymentMethods"
            :key="method.value"
            class="group relative cursor-pointer"
            @click="localPaymentDetails.method = method.value"
          >
            <input
              :id="method.value"
              v-model="localPaymentDetails.method"
              type="radio"
              :value="method.value"
              class="sr-only"
            />
            <label
              :for="method.value"
              class="flex cursor-pointer items-center rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md"
              :class="
                localPaymentDetails.method === method.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              "
            >
              <div class="flex items-center space-x-4">
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-lg"
                  :class="
                    localPaymentDetails.method === method.value
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  "
                >
                  <Icon :name="method.icon" class="h-6 w-6" />
                </div>
                <div class="flex-1">
                  <h4 class="text-foreground font-semibold">{{ method.label }}</h4>
                  <p class="text-muted-foreground text-sm">{{ method.description }}</p>
                </div>
                <div
                  v-if="method.badge"
                  class="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs"
                >
                  {{ method.badge }}
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Budget Summary -->
      <div
        class="from-primary/5 border-primary/20 rounded-lg border bg-gradient-to-r to-purple-500/5 p-6"
      >
        <h3 class="text-foreground mb-4 text-lg font-semibold">Budget Summary</h3>

        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-muted-foreground">Maximum Budget:</span>
            <span class="font-medium"
              >{{ getCurrencySymbol(localBudget.currency)
              }}{{ localBudget.max.toLocaleString() }}</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Payment Method:</span>
            <span class="font-medium">{{ getPaymentMethodLabel(localPaymentDetails.method) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Deadline:</span>
            <span class="font-medium">{{ formatDeadline(localDeadline) }}</span>
          </div>
          <div v-if="urgencyLevel" class="flex justify-between">
            <span class="text-muted-foreground">Urgency:</span>
            <span class="font-medium">{{ getUrgencyLabel(urgencyLevel) }}</span>
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

interface Budget {
  max: number
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'VND'
}

interface PaymentDetails {
  method: 'direct' | 'online'
}

interface Props {
  budget: Budget
  deadline: string
  paymentDetails: PaymentDetails
}

interface Emits {
  (e: 'update:budget', value: Budget): void
  (e: 'update:deadline', value: string): void
  (e: 'update:paymentDetails', value: PaymentDetails): void
  (e: 'next'): void
  (e: 'previous'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local reactive data
const localBudget = ref({ ...props.budget })
const localDeadline = ref(props.deadline)
const localPaymentDetails = ref({ ...props.paymentDetails })
const urgencyLevel = ref('normal')

// Options
const currencyOptions = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD (C$)' },
  { value: 'AUD', label: 'AUD (A$)' },
  { value: 'VND', label: 'VND (₫)' },
]

const urgencyOptions = [
  { value: 'low', label: 'Low - Flexible timeline' },
  { value: 'normal', label: 'Normal - Standard timeline' },
  { value: 'high', label: 'High - Rush job' },
  { value: 'urgent', label: 'Urgent - ASAP' },
]

const paymentMethods = [
  {
    value: 'direct',
    label: 'Direct Payment',
    description: 'Pay directly to the talent after completion',
    icon: 'mdi:handshake',
    badge: 'Recommended',
  },
  {
    value: 'online',
    label: 'Online Payment (Escrow)',
    description: 'Secure payment through platform with escrow protection',
    icon: 'mdi:shield-check',
    badge: 'Secure',
  },
]

// Validation
const isValid = computed(() => {
  return (
    localBudget.value.max > 0 && localDeadline.value.length > 0 && localPaymentDetails.value.method
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

const getPaymentMethodLabel = (method: string) => {
  const labels: Record<string, string> = {
    direct: 'Direct Payment',
    online: 'Online Payment (Escrow)',
  }
  return labels[method] || method
}

const getUrgencyLabel = (urgency: string) => {
  const labels: Record<string, string> = {
    low: 'Low Priority',
    normal: 'Normal Priority',
    high: 'High Priority',
    urgent: 'Urgent',
  }
  return labels[urgency] || urgency
}

const formatDeadline = (dateString: string) => {
  if (!dateString) return 'Not set'
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

watch(
  localPaymentDetails,
  (newValue) => {
    emit('update:paymentDetails', newValue)
  },
  { deep: true },
)
</script>
