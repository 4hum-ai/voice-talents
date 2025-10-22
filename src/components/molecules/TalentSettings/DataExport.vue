<template>
  <div class="space-y-8">
    <Card class="p-6">
      <div class="mb-8 text-center">
        <div
          class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500"
        >
          <Icon name="mdi:database" class="h-8 w-8 text-white" />
        </div>
        <h2 class="text-foreground mb-2 text-2xl font-semibold">Data & Export</h2>
        <p class="text-muted-foreground">Manage your data and export your profile information.</p>
      </div>

      <div class="mx-auto max-w-2xl space-y-6">
        <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-foreground text-sm font-medium">Export Profile Data</h3>
              <p class="text-muted-foreground text-sm">
                Download a copy of your profile and voice samples
              </p>
            </div>
            <Button variant="outline" @click="handleExportData" class="onboarding-button">
              <Icon name="mdi:download" class="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-foreground text-sm font-medium">Delete Account</h3>
              <p class="text-muted-foreground text-sm">
                Permanently delete your account and all data
              </p>
            </div>
            <Button
              variant="outline"
              @click="handleDeleteAccount"
              class="border-red-300 text-red-600 hover:border-red-400 hover:text-red-700"
            >
              <Icon name="mdi:delete" class="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import { useToast } from '@/composables/useToast'

interface Emits {
  (e: 'validation-change', isValid: boolean): void
}

const router = useRouter()
const { success } = useToast()
const emit = defineEmits<Emits>()

// Always valid - no validation needed for data export
emit('validation-change', true)

const handleExportData = () => {
  const data = {
    onboarding: localStorage.getItem('voiceact-onboarding-data'),
    profile: localStorage.getItem('voiceact-profile-data'),
    settings: localStorage.getItem('voiceact-settings'),
    voiceSamples: localStorage.getItem('voiceact-voice-samples'),
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'voice-actor-profile-data.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  success('Profile data exported successfully')
}

const handleDeleteAccount = () => {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    // Clear all localStorage data
    localStorage.removeItem('voiceact-onboarding-data')
    localStorage.removeItem('voiceact-profile-data')
    localStorage.removeItem('voiceact-settings')
    localStorage.removeItem('voiceact-voice-samples')
    localStorage.removeItem('voiceact-onboarding-completed')

    success('Account deleted successfully')
    router.push('/')
  }
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
</style>
