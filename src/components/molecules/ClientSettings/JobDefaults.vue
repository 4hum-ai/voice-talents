<template>
  <div class="space-y-8">
    <div class="mb-8 text-center">
      <div
        class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-600"
      >
        <Icon name="mdi:target" class="h-8 w-8 text-white" />
      </div>
      <h2 class="text-foreground mb-2 text-2xl font-bold">Job Defaults</h2>
      <p class="text-muted-foreground">Set your default preferences for job postings</p>
    </div>

    <div class="bg-card border-border rounded-lg border p-8">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label class="text-foreground mb-2 block text-sm font-medium">
            Default Budget Range
          </label>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <input
                :value="modelValue.defaultBudget.min"
                @input="updateBudgetField('min', Number(($event.target as HTMLInputElement).value))"
                type="number"
                min="0"
                class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                placeholder="Min"
              />
            </div>
            <div>
              <input
                :value="modelValue.defaultBudget.max"
                @input="updateBudgetField('max', Number(($event.target as HTMLInputElement).value))"
                type="number"
                min="0"
                class="border-border focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        <div>
          <label class="text-foreground mb-2 block text-sm font-medium"> Default Currency </label>
          <SelectInput
            :model-value="modelValue.defaultBudget.currency"
            @update:model-value="updateBudgetField('currency', $event)"
            :options="currencyOptions"
            placeholder="Select currency"
          />
        </div>

        <div class="lg:col-span-2">
          <label class="text-foreground mb-2 block text-sm font-medium">
            Preferred Languages
          </label>
          <SelectInput
            :model-value="modelValue.preferredLanguages"
            @update:model-value="updateField('preferredLanguages', $event)"
            :options="languageOptions"
            placeholder="Select preferred languages"
            multiple
          />
        </div>

        <div class="lg:col-span-2">
          <label class="text-foreground mb-2 block text-sm font-medium">
            Preferred Voice Types
          </label>
          <SelectInput
            :model-value="modelValue.preferredVoiceTypes"
            @update:model-value="updateField('preferredVoiceTypes', $event)"
            :options="voiceTypeOptions"
            placeholder="Select preferred voice types"
            multiple
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/atoms/Icon.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'

interface BudgetRange {
  min: number
  max: number
  currency: string
}

interface JobDefaultsData {
  defaultBudget: BudgetRange
  preferredLanguages: string[]
  preferredVoiceTypes: string[]
}

interface Props {
  modelValue: JobDefaultsData
  requiredFields?: string[]
}

interface Emits {
  (e: 'update:modelValue', value: JobDefaultsData): void
  (e: 'validation-change', isValid: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  requiredFields: () => ['preferredLanguages', 'preferredVoiceTypes'],
})

const emit = defineEmits<Emits>()

// Options
const currencyOptions = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD (C$)' },
  { value: 'AUD', label: 'AUD (A$)' },
  { value: 'VND', label: 'VND (₫)' },
]

const languageOptions = [
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Italian', label: 'Italian' },
  { value: 'Portuguese', label: 'Portuguese' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Korean', label: 'Korean' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Arabic', label: 'Arabic' },
  { value: 'Russian', label: 'Russian' },
  { value: 'Dutch', label: 'Dutch' },
]

const voiceTypeOptions = [
  { value: 'narrator', label: 'Narrator' },
  { value: 'character', label: 'Character' },
  { value: 'announcer', label: 'Announcer' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'audiobook', label: 'Audiobook' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'animation', label: 'Animation' },
  { value: 'video_game', label: 'Video Game' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'e-learning', label: 'E-Learning' },
]

// Computed
const isValid = computed(() => {
  return props.requiredFields.every((field) => {
    const value = props.modelValue[field as keyof JobDefaultsData]
    if (field === 'preferredLanguages' || field === 'preferredVoiceTypes') {
      return Array.isArray(value) && value.length > 0
    }
    return value && value.toString().trim() !== ''
  })
})

// Methods
const updateField = (field: keyof JobDefaultsData, value: string | number | boolean) => {
  const updated = { ...props.modelValue, [field]: value }
  emit('update:modelValue', updated)
  emit('validation-change', isValid.value)
}

const updateBudgetField = (field: keyof BudgetRange, value: number) => {
  const updated = {
    ...props.modelValue,
    defaultBudget: {
      ...props.modelValue.defaultBudget,
      [field]: value,
    },
  }
  emit('update:modelValue', updated)
  emit('validation-change', isValid.value)
}

// Emit initial validation state
emit('validation-change', isValid.value)
</script>
