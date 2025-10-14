<template>
  <div class="bg-background flex min-h-screen">
    <VoiceActNavigation />
    <div class="flex-1">
      <AppBar :show-back="true" @back="$router.back()">
        <template #title>Settings</template>
        <template #subtitle>Manage your account and preferences</template>
        <template #actions>
          <ThemeToggle />
        </template>
      </AppBar>

      <div class="px-4 py-8 pt-24 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-4xl">
          <!-- Tab Navigation -->
          <div class="mb-8">
            <TabNavigation v-model="activeTab" :tabs="settingsTabs" variant="underline" size="lg" />
          </div>

          <!-- Tab Content -->
          <div class="min-h-[600px]">
            <!-- Account Settings Tab -->
            <div v-if="activeTab === 'account'" class="space-y-8">
              <Card class="p-6">
                <div class="mb-8 text-center">
                  <div
                    class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500"
                  >
                    <Icon name="mdi:account-cog" class="h-8 w-8 text-white" />
                  </div>
                  <h2 class="text-foreground mb-2 text-2xl font-semibold">Account Settings</h2>
                  <p class="text-muted-foreground">
                    Manage your account information and security settings.
                  </p>
                </div>

                <div class="mx-auto max-w-2xl space-y-6">
                  <div>
                    <label for="email" class="text-foreground mb-2 block text-sm font-medium">
                      Email Address
                    </label>
                    <input
                      id="email"
                      v-model="accountSettings.email"
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      class="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label
                      for="currentPassword"
                      class="text-foreground mb-2 block text-sm font-medium"
                    >
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      v-model="accountSettings.currentPassword"
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
                      v-model="accountSettings.newPassword"
                      type="password"
                      placeholder="Enter new password"
                      class="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label
                      for="confirmPassword"
                      class="text-foreground mb-2 block text-sm font-medium"
                    >
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      v-model="accountSettings.confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      class="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div class="flex justify-end">
                    <Button variant="primary" @click="updateAccount" class="onboarding-button">
                      Update Account
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <!-- Notification Preferences Tab -->
            <div v-if="activeTab === 'notifications'" class="space-y-8">
              <Card class="p-6">
                <div class="mb-8 text-center">
                  <div
                    class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-teal-500"
                  >
                    <Icon name="mdi:bell" class="h-8 w-8 text-white" />
                  </div>
                  <h2 class="text-foreground mb-2 text-2xl font-semibold">
                    Notification Preferences
                  </h2>
                  <p class="text-muted-foreground">
                    Choose how you want to be notified about new opportunities and updates.
                  </p>
                </div>

                <div class="mx-auto max-w-2xl space-y-6">
                  <div
                    class="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-600"
                  >
                    <div>
                      <h3 class="text-foreground text-sm font-medium">New Project Notifications</h3>
                      <p class="text-muted-foreground text-sm">
                        Get notified when new projects match your profile
                      </p>
                    </div>
                    <label class="relative inline-flex cursor-pointer items-center">
                      <input
                        v-model="notificationSettings.newProjects"
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
                      <h3 class="text-foreground text-sm font-medium">Message Notifications</h3>
                      <p class="text-muted-foreground text-sm">
                        Get notified when clients send you messages
                      </p>
                    </div>
                    <label class="relative inline-flex cursor-pointer items-center">
                      <input
                        v-model="notificationSettings.messages"
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
                      <h3 class="text-foreground text-sm font-medium">Payment Notifications</h3>
                      <p class="text-muted-foreground text-sm">
                        Get notified about payments and invoices
                      </p>
                    </div>
                    <label class="relative inline-flex cursor-pointer items-center">
                      <input
                        v-model="notificationSettings.payments"
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
                      <h3 class="text-foreground text-sm font-medium">Marketing Updates</h3>
                      <p class="text-muted-foreground text-sm">
                        Receive tips, industry news, and platform updates
                      </p>
                    </div>
                    <label class="relative inline-flex cursor-pointer items-center">
                      <input
                        v-model="notificationSettings.marketing"
                        type="checkbox"
                        class="peer sr-only"
                      />
                      <div
                        class="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
                      ></div>
                    </label>
                  </div>

                  <div class="flex justify-end">
                    <Button
                      variant="primary"
                      @click="updateNotifications"
                      class="onboarding-button"
                    >
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <!-- Privacy Settings Tab -->
            <div v-if="activeTab === 'privacy'" class="space-y-8">
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
                      <input
                        v-model="privacySettings.isPublic"
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
                      <h3 class="text-foreground text-sm font-medium">Show Contact Information</h3>
                      <p class="text-muted-foreground text-sm">
                        Display your email and phone number on your profile
                      </p>
                    </div>
                    <label class="relative inline-flex cursor-pointer items-center">
                      <input
                        v-model="privacySettings.showContact"
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
                        v-model="privacySettings.showEarnings"
                        type="checkbox"
                        class="peer sr-only"
                      />
                      <div
                        class="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
                      ></div>
                    </label>
                  </div>

                  <div class="flex justify-end">
                    <Button variant="primary" @click="updatePrivacy" class="onboarding-button">
                      Save Privacy Settings
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <!-- Data & Export Tab -->
            <div v-if="activeTab === 'data'" class="space-y-8">
              <Card class="p-6">
                <div class="mb-8 text-center">
                  <div
                    class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500"
                  >
                    <Icon name="mdi:database" class="h-8 w-8 text-white" />
                  </div>
                  <h2 class="text-foreground mb-2 text-2xl font-semibold">Data & Export</h2>
                  <p class="text-muted-foreground">
                    Manage your data and export your profile information.
                  </p>
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
                      <Button variant="outline" @click="exportData" class="onboarding-button">
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
                        @click="deleteAccount"
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import VoiceActNavigation from '@/components/organisms/VoiceActNavigation.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import Card from '@/components/atoms/Card.vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import TabNavigation from '@/components/molecules/TabNavigation.vue'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { success, error } = useToast()

// Tab management
const activeTab = ref('account')

const settingsTabs = [
  { id: 'account', label: 'Account' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'data', label: 'Data & Export' },
]

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

// Update account settings
const updateAccount = () => {
  if (accountSettings.newPassword !== accountSettings.confirmPassword) {
    error('New passwords do not match')
    return
  }

  const settings = {
    account: { ...accountSettings },
    notifications: { ...notificationSettings },
    privacy: { ...privacySettings },
  }

  localStorage.setItem('voiceact-settings', JSON.stringify(settings))
  success('Account settings updated successfully')

  // Clear password fields
  accountSettings.currentPassword = ''
  accountSettings.newPassword = ''
  accountSettings.confirmPassword = ''
}

// Update notification settings
const updateNotifications = () => {
  const settings = {
    account: { ...accountSettings },
    notifications: { ...notificationSettings },
    privacy: { ...privacySettings },
  }

  localStorage.setItem('voiceact-settings', JSON.stringify(settings))
  success('Notification preferences updated successfully')
}

// Update privacy settings
const updatePrivacy = () => {
  const settings = {
    account: { ...accountSettings },
    notifications: { ...notificationSettings },
    privacy: { ...privacySettings },
  }

  localStorage.setItem('voiceact-settings', JSON.stringify(settings))
  success('Privacy settings updated successfully')
}

// Export all data
const exportData = () => {
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

// Delete account
const deleteAccount = () => {
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

/* Focus states */
input:focus {
  transform: scale(1.02);
}

/* Toggle switch animations */
input[type='checkbox'] {
  transition: all 0.2s ease;
}

input[type='checkbox']:checked {
  transform: scale(1.1);
}
</style>
