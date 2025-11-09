<template>
  <div class="space-y-8">
    <div class="text-center">
      <h3 class="text-foreground mb-2 text-2xl font-semibold">Let's Talk About Your Rates</h3>
      <p class="text-muted-foreground">Share your rates for different types of voice work.</p>
    </div>

    <div class="space-y-8">
      <!-- Dynamic Voice Job Type Rates -->
      <div v-if="pricingFields.length > 0" class="rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
        <h4 class="text-foreground mb-4 text-lg font-semibold">Work Type Rates</h4>
        <p class="text-muted-foreground mb-4 text-sm">
          Set your rates for the voice work types you selected. These will help clients understand
          your pricing.
        </p>
        <div class="space-y-4">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div v-for="field in pricingFields" :key="field.id" class="space-y-2">
              <label :for="`rate-${field.id}`" class="text-foreground block text-sm font-medium">
                {{ field.label }}
                <span class="text-muted-foreground text-xs">
                  ({{ field.pricingModel.replace('_', ' ') }})
                </span>
              </label>
              <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span class="dark:text-muted-foreground text-sm text-gray-500">$</span>
                </div>
                <input
                  :id="`rate-${field.id}`"
                  :value="props.pricingData.jobTypeRates[field.id] || ''"
                  type="number"
                  min="0"
                  step="25"
                  :placeholder="field.placeholder"
                  class="w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-8 text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  @input="updateJobTypeRate(field.id, ($event.target as HTMLInputElement).value)"
                />
              </div>
              <p class="text-muted-foreground text-xs">
                {{ field.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useJobType } from '@/composables/useJobType'

interface Props {
  profileData: {
    voiceTypes: string[]
  }
  pricingData: {
    jobTypeRates: Record<string, string>
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [data: Partial<Props['pricingData']>]
}>()

const { availableJobTypes, getConfig } = useJobType()

// Method to update job type rates
const updateJobTypeRate = (jobTypeId: string, value: string) => {
  const updatedJobTypeRates = { ...props.pricingData.jobTypeRates }
  updatedJobTypeRates[jobTypeId] = value
  emit('update', { jobTypeRates: updatedJobTypeRates })
}

// Computed property for pricing fields based on selected job types
const pricingFields = computed(() => {
  const selectedVoiceTypes = availableJobTypes.value.filter((option) =>
    props.profileData.voiceTypes.includes(option.value),
  )

  return selectedVoiceTypes.map((jobType) => {
    const config = getConfig(jobType.value)
    return {
      id: jobType.value,
      label: jobType.label,
      description: jobType.description,
      pricingModel: config?.pricing.model || 'per_project',
      baseRate: config?.pricing.baseRate || 0,
      currency: config?.pricing.currency || 'USD',
      placeholder: config?.pricing.baseRate?.toString() || '0',
    }
  })
})
</script>
