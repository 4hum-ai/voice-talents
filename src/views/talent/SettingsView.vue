<template>
  <div class="bg-background flex min-h-screen">
    <VoiceActNavigation />
    <div class="flex-1">
      <AppBar :show-back="true" @back="$router.back()">
        <template #title>Settings</template>
        <template #subtitle>Manage your account and preferences</template>
        <template #actions>
          <div class="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              @click="saveSettings"
              :disabled="isSaving"
              :loading="isSaving"
            >
              {{ isSaving ? 'Saving...' : 'Save' }}
            </Button>
            <ThemeToggle />
          </div>
        </template>
      </AppBar>

      <div class="px-4 py-8 pt-24 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-4xl">
          <!-- Tab Navigation with Content -->
          <div class="mb-8">
            <TabNavigation v-model="activeTab" variant="underline" size="lg">
              <!-- Account Settings Tab -->
              <Tab id="account" label="Account">
                <AccountInformation
                  v-model="accountSettings"
                  @validation-change="updateTabValidation('account', $event)"
                />
              </Tab>

              <!-- Notification Preferences Tab -->
              <Tab id="notifications" label="Notifications">
                <NotificationPreferences
                  v-model="notificationSettings"
                  @validation-change="updateTabValidation('notifications', $event)"
                />
              </Tab>

              <!-- Privacy Settings Tab -->
              <Tab id="privacy" label="Privacy">
                <PrivacySettings
                  v-model="privacySettings"
                  @validation-change="updateTabValidation('privacy', $event)"
                />
              </Tab>

              <!-- Data & Export Tab -->
              <Tab id="data" label="Data & Export">
                <DataExport @validation-change="updateTabValidation('data', $event)" />
              </Tab>
            </TabNavigation>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import TabNavigation from '@/components/molecules/TabNavigation.vue'
import Tab from '@/components/molecules/Tab.vue'
import Button from '@/components/atoms/Button.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import {
  AccountInformation,
  NotificationPreferences,
  PrivacySettings,
  DataExport,
} from '@/components/molecules/TalentSettings'

// Tab management
const activeTab = ref('account')
const tabValidation = reactive<Record<string, boolean>>({})

// Save state
const isSaving = ref(false)

// Account settings
const accountSettings = reactive({
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// Notification settings
const notificationSettings = reactive({
  newProjects: true,
  messages: true,
  payments: true,
  marketing: false,
})

// Privacy settings
const privacySettings = reactive({
  isPublic: true,
  showContact: false,
  showEarnings: false,
})

// Tab validation handler
const updateTabValidation = (tabId: string, isValid: boolean) => {
  tabValidation[tabId] = isValid
}

// Save settings method
const saveSettings = async () => {
  isSaving.value = true

  try {
    // Save all settings to localStorage
    const settings = {
      account: accountSettings,
      notifications: notificationSettings,
      privacy: privacySettings,
    }

    localStorage.setItem('voiceact-settings', JSON.stringify(settings))

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log('Settings saved successfully')
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('Failed to save settings. Please try again.')
  } finally {
    isSaving.value = false
  }
}

// Load settings from localStorage
onMounted(() => {
  const savedSettings = localStorage.getItem('voiceact-settings')
  if (savedSettings) {
    const settings = JSON.parse(savedSettings)
    Object.assign(accountSettings, settings.account || {})
    Object.assign(notificationSettings, settings.notifications || {})
    Object.assign(privacySettings, settings.privacy || {})
  }
})
</script>
