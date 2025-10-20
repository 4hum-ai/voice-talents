<template>
  <div class="space-y-8">
    <div class="mb-8 text-center">
      <div
        class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600"
      >
        <Icon name="mdi:cog" class="h-8 w-8 text-white" />
      </div>
      <h2 class="text-foreground mb-2 text-2xl font-bold">Job Preferences</h2>
      <p class="text-muted-foreground">Configure your workflow and approval settings</p>
    </div>

    <div class="bg-card border-border rounded-lg border p-8">
      <div class="space-y-6">
        <div class="border-border flex items-center justify-between rounded-lg border p-4">
          <div>
            <h3 class="text-foreground text-sm font-medium">Auto-approve Applications</h3>
            <p class="text-muted-foreground text-sm">
              Automatically approve applications that meet your criteria
            </p>
          </div>
          <input
            :checked="modelValue.autoApprove"
            @change="updateField('autoApprove', ($event.target as HTMLInputElement).checked)"
            type="checkbox"
            class="text-primary focus:ring-primary border-border h-4 w-4 rounded"
          />
        </div>

        <div class="border-border flex items-center justify-between rounded-lg border p-4">
          <div>
            <h3 class="text-foreground text-sm font-medium">Require NDA</h3>
            <p class="text-muted-foreground text-sm">
              Require voice actors to sign an NDA before starting work
            </p>
          </div>
          <input
            :checked="modelValue.requireNDA"
            @change="updateField('requireNDA', ($event.target as HTMLInputElement).checked)"
            type="checkbox"
            class="text-primary focus:ring-primary border-border h-4 w-4 rounded"
          />
        </div>

        <div class="border-border flex items-center justify-between rounded-lg border p-4">
          <div>
            <h3 class="text-foreground text-sm font-medium">Require Portfolio</h3>
            <p class="text-muted-foreground text-sm">
              Only allow voice actors with portfolios to apply
            </p>
          </div>
          <input
            :checked="modelValue.requirePortfolio"
            @change="updateField('requirePortfolio', ($event.target as HTMLInputElement).checked)"
            type="checkbox"
            class="text-primary focus:ring-primary border-border h-4 w-4 rounded"
          />
        </div>

        <div
          v-if="showPublicProfile"
          class="border-border flex items-center justify-between rounded-lg border p-4"
        >
          <div>
            <h3 class="text-foreground text-sm font-medium">Public Profile</h3>
            <p class="text-muted-foreground text-sm">
              Make your client profile visible to voice actors
            </p>
          </div>
          <input
            :checked="modelValue.isPublic"
            @change="updateField('isPublic', ($event.target as HTMLInputElement).checked)"
            type="checkbox"
            class="text-primary focus:ring-primary border-border h-4 w-4 rounded"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/atoms/Icon.vue'

interface JobPreferencesData {
  autoApprove: boolean
  requireNDA: boolean
  requirePortfolio: boolean
  isPublic?: boolean
}

interface Props {
  modelValue: JobPreferencesData
  showPublicProfile?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: JobPreferencesData): void
  (e: 'validation-change', isValid: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  showPublicProfile: true,
})

const emit = defineEmits<Emits>()

// Computed
const isValid = computed(() => {
  // Job preferences are always valid since they're all optional boolean fields
  return true
})

// Methods
const updateField = (field: keyof JobPreferencesData, value: boolean) => {
  const updated = { ...props.modelValue, [field]: value }
  emit('update:modelValue', updated)
  emit('validation-change', isValid.value)
}

// Emit initial validation state
emit('validation-change', isValid.value)
</script>
