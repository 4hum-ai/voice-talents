<template>
  <div class="min-h-screen bg-background flex">
    <VoiceActNavigation />
    <div class="flex-1">
      <div class="bg-card shadow-sm border-b border-border">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
              <Button variant="ghost" size="sm" @click="$router.back()" class="mr-4">
                <ArrowLeftIcon class="h-4 w-4" />
              </Button>
              <div>
                <h1 class="text-2xl font-bold text-foreground">
                  Settings
                </h1>
                <p class="text-sm text-muted-foreground">
                  Manage your account and preferences
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
      
      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-4xl mx-auto">
          
          <!-- Tab Navigation -->
          <div class="mb-8">
            <TabNavigation 
              v-model="activeTab" 
              :tabs="settingsTabs" 
              variant="underline"
              size="lg"
            />
          </div>

          <!-- Tab Content -->
          <div class="min-h-[600px]">
            
            <!-- Account Settings Tab -->
            <div v-if="activeTab === 'account'" class="space-y-8">
              <Card class="p-6">
                <div class="text-center mb-8">
                  <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="mdi:account-cog" class="h-8 w-8 text-white" />
                  </div>
                  <h2 class="text-2xl font-semibold text-foreground mb-2">
                    Account Settings
                  </h2>
                  <p class="text-muted-foreground">
                    Manage your account information and security settings.
                  </p>
                </div>
                
                <div class="max-w-2xl mx-auto space-y-6">
                  <div>
                    <label for="email" class="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <input id="email" v-model="accountSettings.email" type="email" required
                      placeholder="your.email@example.com"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-lg" />
                  </div>

                  <div>
                    <label for="currentPassword" class="block text-sm font-medium text-foreground mb-2">
                      Current Password
                    </label>
                    <input id="currentPassword" v-model="accountSettings.currentPassword" type="password"
                      placeholder="Enter current password"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-lg" />
                  </div>

                  <div>
                    <label for="newPassword" class="block text-sm font-medium text-foreground mb-2">
                      New Password
                    </label>
                    <input id="newPassword" v-model="accountSettings.newPassword" type="password"
                      placeholder="Enter new password"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-lg" />
                  </div>

                  <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-foreground mb-2">
                      Confirm New Password
                    </label>
                    <input id="confirmPassword" v-model="accountSettings.confirmPassword" type="password"
                      placeholder="Confirm new password"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-lg" />
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
                <div class="text-center mb-8">
                  <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="mdi:bell" class="h-8 w-8 text-white" />
                  </div>
                  <h2 class="text-2xl font-semibold text-foreground mb-2">
                    Notification Preferences
                  </h2>
                  <p class="text-muted-foreground">
                    Choose how you want to be notified about new opportunities and updates.
                  </p>
                </div>
                
                <div class="max-w-2xl mx-auto space-y-6">
                  <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <h3 class="text-sm font-medium text-foreground">New Project Notifications</h3>
                      <p class="text-sm text-muted-foreground">Get notified when new projects match your profile</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input v-model="notificationSettings.newProjects" type="checkbox" class="sr-only peer" />
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <h3 class="text-sm font-medium text-foreground">Message Notifications</h3>
                      <p class="text-sm text-muted-foreground">Get notified when clients send you messages</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input v-model="notificationSettings.messages" type="checkbox" class="sr-only peer" />
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <h3 class="text-sm font-medium text-foreground">Payment Notifications</h3>
                      <p class="text-sm text-muted-foreground">Get notified about payments and invoices</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input v-model="notificationSettings.payments" type="checkbox" class="sr-only peer" />
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <h3 class="text-sm font-medium text-foreground">Marketing Updates</h3>
                      <p class="text-sm text-muted-foreground">Receive tips, industry news, and platform updates</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input v-model="notificationSettings.marketing" type="checkbox" class="sr-only peer" />
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div class="flex justify-end">
                    <Button variant="primary" @click="updateNotifications" class="onboarding-button">
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <!-- Privacy Settings Tab -->
            <div v-if="activeTab === 'privacy'" class="space-y-8">
              <Card class="p-6">
                <div class="text-center mb-8">
                  <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="mdi:shield-account" class="h-8 w-8 text-white" />
                  </div>
                  <h2 class="text-2xl font-semibold text-foreground mb-2">
                    Privacy Settings
                  </h2>
                  <p class="text-muted-foreground">
                    Control who can see your profile and contact information.
                  </p>
                </div>
                
                <div class="max-w-2xl mx-auto space-y-6">
                  <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <h3 class="text-sm font-medium text-foreground">Public Profile</h3>
                      <p class="text-sm text-muted-foreground">Make your profile visible to clients and casting directors</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input v-model="privacySettings.isPublic" type="checkbox" class="sr-only peer" />
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <h3 class="text-sm font-medium text-foreground">Show Contact Information</h3>
                      <p class="text-sm text-muted-foreground">Display your email and phone number on your profile</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input v-model="privacySettings.showContact" type="checkbox" class="sr-only peer" />
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <h3 class="text-sm font-medium text-foreground">Show Earnings</h3>
                      <p class="text-sm text-muted-foreground">Display your earnings statistics on your profile</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input v-model="privacySettings.showEarnings" type="checkbox" class="sr-only peer" />
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
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
                <div class="text-center mb-8">
                  <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="mdi:database" class="h-8 w-8 text-white" />
                  </div>
                  <h2 class="text-2xl font-semibold text-foreground mb-2">
                    Data & Export
              </h2>
              <p class="text-muted-foreground">
                    Manage your data and export your profile information.
                  </p>
                </div>
                
                <div class="max-w-2xl mx-auto space-y-6">
                  <div class="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div class="flex items-center justify-between">
                      <div>
                        <h3 class="text-sm font-medium text-foreground">Export Profile Data</h3>
                        <p class="text-sm text-muted-foreground">Download a copy of your profile and voice samples</p>
                      </div>
                      <Button variant="outline" @click="exportData" class="onboarding-button">
                        <Icon name="mdi:download" class="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>

                  <div class="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div class="flex items-center justify-between">
                      <div>
                        <h3 class="text-sm font-medium text-foreground">Delete Account</h3>
                        <p class="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                      </div>
                      <Button variant="outline" @click="deleteAccount" class="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400">
                        <Icon name="mdi:delete" class="h-4 w-4 mr-2" />
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
  { id: 'data', label: 'Data & Export' }
]

// Account settings
const accountSettings = reactive({
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Notification settings
const notificationSettings = reactive({
  newProjects: true,
  messages: true,
  payments: true,
  marketing: false
})

// Privacy settings
const privacySettings = reactive({
  isPublic: true,
  showContact: false,
  showEarnings: false
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
    privacy: { ...privacySettings }
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
    privacy: { ...privacySettings }
  }
  
  localStorage.setItem('voiceact-settings', JSON.stringify(settings))
  success('Notification preferences updated successfully')
}

// Update privacy settings
const updatePrivacy = () => {
  const settings = {
    account: { ...accountSettings },
    notifications: { ...notificationSettings },
    privacy: { ...privacySettings }
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
    voiceSamples: localStorage.getItem('voiceact-voice-samples')
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
input[type="checkbox"] {
  transition: all 0.2s ease;
}

input[type="checkbox"]:checked {
  transform: scale(1.1);
}
</style>

