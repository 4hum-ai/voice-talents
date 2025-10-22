<template>
  <div class="space-y-8">
    <Card class="p-6">
      <div class="mb-8 text-center">
        <div
          class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
        >
          <Icon name="mdi:shield-account" class="h-8 w-8 text-white" />
        </div>
        <h2 class="text-foreground mb-2 text-2xl font-semibold">Privacy Settings</h2>
        <p class="text-muted-foreground">
          Control who can see your profile and contact information.
        </p>
      </div>

      <div class="mx-auto max-w-2xl space-y-6">
        <div
          class="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-600"
        >
          <div>
            <h3 class="text-foreground text-sm font-medium">Public Profile</h3>
            <p class="text-muted-foreground text-sm">
              Make your profile visible to clients and casting directors
            </p>
          </div>
          <label class="relative inline-flex cursor-pointer items-center">
            <input v-model="localPrivacySettings.isPublic" type="checkbox" class="peer sr-only" />
            <div
              class="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
            ></div>
          </label>
        </div>

        <div
          class="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-600"
        >
          <div>
            <h3 class="text-foreground text-sm font-medium">Show Contact Information</h3>
            <p class="text-muted-foreground text-sm">
              Display your email and phone number on your profile
            </p>
          </div>
          <label class="relative inline-flex cursor-pointer items-center">
            <input
              v-model="localPrivacySettings.showContact"
              type="checkbox"
              class="peer sr-only"
            />
            <div
              class="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
            ></div>
          </label>
        </div>

        <div
          class="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-600"
        >
          <div>
            <h3 class="text-foreground text-sm font-medium">Show Earnings</h3>
            <p class="text-muted-foreground text-sm">
              Display your earnings statistics on your profile
            </p>
          </div>
          <label class="relative inline-flex cursor-pointer items-center">
            <input
              v-model="localPrivacySettings.showEarnings"
              type="checkbox"
              class="peer sr-only"
            />
            <div
              class="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
            ></div>
          </label>
        </div>

        <div class="flex justify-end">
          <Button variant="primary" @click="handleUpdate" class="onboarding-button">
            Save Privacy Settings
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import { useToast } from '@/composables/useToast'

interface PrivacySettings {
  isPublic: boolean
  showContact: boolean
  showEarnings: boolean
}

interface Props {
  modelValue: PrivacySettings
}

interface Emits {
  (e: 'update:modelValue', value: PrivacySettings): void
  (e: 'validation-change', isValid: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { success } = useToast()

// Local reactive copy
const localPrivacySettings = reactive<PrivacySettings>({ ...props.modelValue })

// Watch for external changes
watch(
  () => props.modelValue,
  (newValue) => {
    Object.assign(localPrivacySettings, newValue)
  },
  { deep: true },
)

// Watch for local changes and emit
watch(
  localPrivacySettings,
  (newValue) => {
    emit('update:modelValue', { ...newValue })
    emit('validation-change', true) // Privacy settings are always valid
  },
  { deep: true },
)

const handleUpdate = () => {
  // In a real app, this would make an API call
  success('Privacy settings updated successfully')
}
</script>

<style scoped>
/* Button animations */
.onboarding-button {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.onboarding-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.onboarding-button:active {
  transform: translateY(0);
}

/* Smooth transitions for all interactive elements */
* {
  transition: all 0.2s ease;
}

/* Toggle switch animations */
input[type='checkbox'] {
  transition: all 0.2s ease;
}

input[type='checkbox']:checked {
  transform: scale(1.1);
}
</style>
