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

          <!-- Payments Tab -->
          <Tab id="payments" label="Payments">
            <PayoutSettings @validation-change="updateTabValidation('payments', $event)" />
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
import { ref, reactive, onMounted, h } from 'vue'
import { useLayoutSlots } from '@/composables/useLayoutSlots'
import TabNavigation from '@/components/molecules/TabNavigation.vue'
import Tab from '@/components/molecules/Tab.vue'
import Button from '@/components/atoms/Button.vue'
import { useToast } from '@/lib/toast'
import {
  AccountInformation,
  NotificationPreferences,
  PrivacySettings,
  PayoutSettings,
  DataExport,
} from '@/components/molecules/TalentSettings'

const { setActions } = useLayoutSlots()
const { success } = useToast()

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

// Save settings function
const saveSettings = () => {
  // In real app, this would save to backend
  const settingsToSave = {
    account: accountSettings,
    notifications: notificationSettings,
    privacy: privacySettings,
  }
  localStorage.setItem('voiceact-settings', JSON.stringify(settingsToSave))
  success('Settings saved successfully!')
}

// Load settings from localStorage
onMounted(() => {
  // Set actions (title/subtitle come from route meta)
  setActions(
    h(
      Button,
      {
        variant: 'primary',
        size: 'sm',
        onClick: saveSettings,
      },
      () => 'Save',
    ),
  )

  const savedSettings = localStorage.getItem('voiceact-settings')
  if (savedSettings) {
    const settings = JSON.parse(savedSettings)
    Object.assign(accountSettings, settings.account || {})
    Object.assign(notificationSettings, settings.notifications || {})
    Object.assign(privacySettings, settings.privacy || {})
  }
})
</script>
