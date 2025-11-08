<template>
  <div>
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
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import TabNavigation from '@/components/molecules/TabNavigation.vue'
import Tab from '@/components/molecules/Tab.vue'
import {
  AccountInformation,
  NotificationPreferences,
  PrivacySettings,
  DataExport,
} from '@/components/molecules/TalentSettings'

// Tab management
const activeTab = ref('account')
const tabValidation = reactive<Record<string, boolean>>({})

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
