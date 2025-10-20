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

    <!-- Budget Inputs -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <!-- Min Budget -->
      <div>
        <label for="minBudget" class="text-muted-foreground mb-1 block text-xs font-medium">
          Minimum
        </label>
        <div class="relative">
          <input
            id="minBudget"
            v-model.number="localMin"
            type="number"
            :min="0"
            :step="step"
            :placeholder="minPlaceholder"
            :disabled="disabled"
            :class="inputClasses"
            @input="updateValues"
            @blur="validateRange"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <span class="text-muted-foreground text-sm">{{ currency }}</span>
          </div>
        </div>
      </div>

      <!-- Max Budget -->
      <div>
        <label for="maxBudget" class="text-muted-foreground mb-1 block text-xs font-medium">
          Maximum
        </label>
        <div class="relative">
          <input
            id="maxBudget"
            v-model.number="localMax"
            type="number"
            :min="0"
            :step="step"
            :placeholder="maxPlaceholder"
            :disabled="disabled"
            :class="inputClasses"
            @input="updateValues"
            @blur="validateRange"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <span class="text-muted-foreground text-sm">{{ currency }}</span>
          </div>
        </div>
      </div>

      <!-- Currency Selector -->
      <div>
        <label for="currency" class="text-muted-foreground mb-1 block text-xs font-medium">
          Currency
        </label>
        <select
          id="currency"
          v-model="localCurrency"
          :disabled="disabled"
          :class="selectClasses"
          @change="updateValues"
        >
          <option v-for="curr in currencyOptions" :key="curr.value" :value="curr.value">
            {{ curr.label }}
          </option>
        </select>
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

    <!-- Budget Display -->
    <div v-if="showSummary && (localMin || localMax)" class="bg-muted/50 rounded-lg p-3">
      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">Budget Range:</span>
        <span class="text-foreground font-medium">
          {{ formatBudgetRange() }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface BudgetRange {
  min: number
  max: number
  currency: string
}

interface Props {
  modelValue?: BudgetRange
  label?: string
  description?: string
  required?: boolean
  disabled?: boolean
  step?: number
  minPlaceholder?: string
  maxPlaceholder?: string
  helpText?: string
  showSummary?: boolean
  currencyOptions?: Array<{ value: string; label: string }>
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  step: 100,
  minPlaceholder: 'Min amount',
  maxPlaceholder: 'Max amount',
  showSummary: true,
  currencyOptions: () => [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'CAD', label: 'CAD (C$)' },
    { value: 'AUD', label: 'AUD (A$)' },
    { value: 'VND', label: 'VND (₫)' },
  ],
})

const emit = defineEmits<{
  'update:modelValue': [value: BudgetRange]
  change: [value: BudgetRange]
}>()

// Local state
const localMin = ref(props.modelValue?.min || 0)
const localMax = ref(props.modelValue?.max || 0)
const localCurrency = ref(props.modelValue?.currency || 'USD')
const errorMessage = ref('')

// Computed
const currency = computed(() => localCurrency.value)

const inputClasses = computed(() => {
  const base =
    'block w-full rounded-md border px-3 py-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors'
  const error = errorMessage.value ? 'border-red-300 dark:border-red-600' : 'border-border'
  const disabled = props.disabled ? 'bg-muted text-muted-foreground' : 'bg-input text-foreground'

  return [base, error, disabled].join(' ')
})

const selectClasses = computed(() => {
  const base =
    'block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors'
  const error = errorMessage.value ? 'border-red-300 dark:border-red-600' : 'border-border'
  const disabled = props.disabled ? 'bg-muted text-muted-foreground' : 'bg-input text-foreground'

  return [base, error, disabled].join(' ')
})

// Methods
const updateValues = () => {
  const newValue: BudgetRange = {
    min: localMin.value || 0,
    max: localMax.value || 0,
    currency: localCurrency.value,
  }

  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const validateRange = () => {
  errorMessage.value = ''

  if (props.required && !localMin.value && !localMax.value) {
    errorMessage.value = 'Budget range is required'
    return
  }

  if (localMin.value && localMax.value && localMin.value > localMax.value) {
    errorMessage.value = 'Minimum cannot be greater than maximum'
    return
  }

  if (localMin.value < 0 || localMax.value < 0) {
    errorMessage.value = 'Budget values cannot be negative'
    return
  }
}

const formatBudgetRange = () => {
  const min = localMin.value ? formatCurrency(localMin.value) : 'Any'
  const max = localMax.value ? formatCurrency(localMax.value) : 'Any'

  if (min === 'Any' && max === 'Any') return 'Any amount'
  if (min === 'Any') return `Up to ${max}`
  if (max === 'Any') return `From ${min}`
  if (localMin.value === localMax.value) return min

  return `${min} - ${max}`
}

const formatCurrency = (amount: number) => {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    VND: '₫',
  }

  const symbol = currencySymbols[localCurrency.value] || localCurrency.value
  return `${symbol}${amount.toLocaleString()}`
}

// Watch for external changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      localMin.value = newValue.min || 0
      localMax.value = newValue.max || 0
      localCurrency.value = newValue.currency || 'USD'
    }
  },
  { deep: true },
)
</script>
