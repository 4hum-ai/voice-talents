<template>
  <div class="space-y-8">
    <Card class="p-6">
      <div class="mb-8 text-center">
        <div
          class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500"
        >
          <Icon name="mdi:account-cog" class="h-8 w-8 text-white" />
        </div>
        <h2 class="text-foreground mb-2 text-2xl font-semibold">Account Settings</h2>
        <p class="text-muted-foreground">Manage your account information and security settings.</p>
      </div>

      <div class="mx-auto max-w-2xl space-y-6">
        <div>
          <label for="email" class="text-foreground mb-2 block text-sm font-medium">
            Email Address
          </label>
          <input
            id="email"
            v-model="localAccountSettings.email"
            type="email"
            required
            placeholder="your.email@example.com"
            class="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label for="currentPassword" class="text-foreground mb-2 block text-sm font-medium">
            Current Password
          </label>
          <input
            id="currentPassword"
            v-model="localAccountSettings.currentPassword"
            type="password"
            placeholder="Enter current password"
            class="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label for="newPassword" class="text-foreground mb-2 block text-sm font-medium">
            New Password
          </label>
          <input
            id="newPassword"
            v-model="localAccountSettings.newPassword"
            type="password"
            placeholder="Enter new password"
            class="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label for="confirmPassword" class="text-foreground mb-2 block text-sm font-medium">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            v-model="localAccountSettings.confirmPassword"
            type="password"
            placeholder="Confirm new password"
            class="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div class="flex justify-end">
          <Button variant="primary" @click="handleUpdate" class="onboarding-button">
            Update Account
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

interface AccountSettings {
  email: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface Props {
  modelValue: AccountSettings
}

interface Emits {
  (e: 'update:modelValue', value: AccountSettings): void
  (e: 'validation-change', isValid: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { success, error } = useToast()

// Local reactive copy
const localAccountSettings = reactive<AccountSettings>({ ...props.modelValue })

// Watch for external changes
watch(
  () => props.modelValue,
  (newValue) => {
    Object.assign(localAccountSettings, newValue)
  },
  { deep: true },
)

// Watch for local changes and emit
watch(
  localAccountSettings,
  (newValue) => {
    emit('update:modelValue', { ...newValue })

    // Basic validation
    const isValid =
      newValue.email.length > 0 &&
      (newValue.newPassword === '' || newValue.newPassword === newValue.confirmPassword)
    emit('validation-change', isValid)
  },
  { deep: true },
)

const handleUpdate = () => {
  if (localAccountSettings.newPassword !== localAccountSettings.confirmPassword) {
    error('New passwords do not match')
    return
  }

  // In a real app, this would make an API call
  success('Account settings updated successfully')

  // Clear password fields
  localAccountSettings.currentPassword = ''
  localAccountSettings.newPassword = ''
  localAccountSettings.confirmPassword = ''
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

/* Focus states */
input:focus {
  transform: scale(1.02);
}
</style>
