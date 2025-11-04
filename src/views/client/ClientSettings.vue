<template>
  <div class="bg-background flex min-h-screen">
    <!-- Navigation Sidebar -->
    <ClientNavigation />

    <!-- Main Content -->
    <div :class="['flex-1', sidebarCollapsed ? 'lg:ml-16' : '']">
      <!-- Header with Stepper -->
      <AppBar :show-back="true" :show-menu="true" @back="goBack" @menu="toggleSidebar">
        <template #title>Client Settings</template>
        <template #subtitle>Manage your client account settings and preferences</template>
        <template #actions>
          <div class="flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="primary"
              size="md"
              @click="saveSettings"
              :disabled="isSaving"
              :loading="isSaving"
            >
              {{ isSaving ? 'Saving...' : 'Save' }}
            </Button>
          </div>
        </template>
      </AppBar>

      <!-- Main Content Area -->
      <div class="px-4 py-8 pt-20 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-4xl">
          <div class="space-y-8">
            <!-- Tab Navigation with Content -->
            <TabNavigation v-model="currentTab" variant="underline" size="md">
              <!-- Account Information Tab -->
              <Tab
                id="account"
                label="Account"
                :icon="AccountIcon"
                :badge="tabValidation.account ? '✓' : undefined"
              >
                <AccountInformation
                  v-model="accountData"
                  @validation-change="updateTabValidation('account', $event)"
                />
              </Tab>

              <!-- Job Preferences Tab -->
              <Tab
                id="preferences"
                label="Preferences"
                :icon="CogIcon"
                :badge="tabValidation.preferences ? '✓' : undefined"
              >
                <JobPreferences
                  v-model="jobPreferencesData"
                  @validation-change="updateTabValidation('preferences', $event)"
                />
              </Tab>

              <!-- Social Links Tab -->
              <Tab
                id="social"
                label="Social Links"
                :icon="ShareVariantIcon"
                :badge="tabValidation.social ? '✓' : undefined"
              >
                <SocialLinks
                  v-model="socialLinksData"
                  @validation-change="updateTabValidation('social', $event)"
                />
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
import { useRouter } from 'vue-router'
import type { VoiceClient } from '@/types/voice-client'
import { mockClientData } from '@/data/mock-voice-client-data'
import { useAuthStore } from '@/stores/auth'
import ClientNavigation from '@/components/organisms/ClientNavigation.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import Button from '@/components/atoms/Button.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import TabNavigation from '@/components/molecules/TabNavigation.vue'
import Tab from '@/components/molecules/Tab.vue'
import { useSidebar } from '@/composables/useSidebar'
import {
  AccountInformation,
  JobPreferences,
  SocialLinks,
} from '@/components/molecules/ClientSettings'
import AccountIcon from '~icons/mdi/account'
import CogIcon from '~icons/mdi/cog'
import ShareVariantIcon from '~icons/mdi/share-variant'

const router = useRouter()
const authStore = useAuthStore()
const { toggle: toggleSidebar, sidebarCollapsed } = useSidebar()

// State
const isSaving = ref(false)
const currentTab = ref('account')
const tabValidation = reactive<Record<string, boolean>>({})

// Component data structures
const accountData = reactive({
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  website: '',
  location: '',
  timezone: '',
  industry: '',
  companySize: 'small' as 'startup' | 'small' | 'medium' | 'large' | 'enterprise',
  description: '',
})

const jobPreferencesData = reactive({
  autoApprove: false,
  requireNDA: false,
  requirePortfolio: true,
  isPublic: false,
})

const socialLinksData = reactive({
  website: '',
  linkedin: '',
  facebook: '',
  twitter: '',
})

// Legacy settings object for compatibility
const settings = reactive<VoiceClient>({
  id: '',
  userId: '',
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  website: '',
  location: '',
  timezone: '',
  industry: '',
  companySize: 'small' as 'startup' | 'small' | 'medium' | 'large' | 'enterprise',
  description: '',
  logoUrl: '',
  isVerified: false,
  isPublic: false,
  totalJobs: 0,
  activeJobs: 0,
  completedJobs: 0,
  totalSpent: 0,
  averageRating: 0,
  joinedDate: '',
  lastActive: '',
  createdAt: '',
  updatedAt: '',
  socialLinks: {
    website: '',
    linkedin: '',
    facebook: '',
    twitter: '',
  },
  preferences: {
    defaultBudget: {
      min: 0,
      max: 0,
      currency: 'USD',
    },
    preferredLanguages: [],
    preferredVoiceTypes: [],
    autoApprove: false,
    requireNDA: false,
  },
})

// Methods
const updateTabValidation = (tabId: string, isValid: boolean) => {
  tabValidation[tabId] = isValid
}

const goBack = () => {
  router.back()
}

const loadSettings = () => {
  // Use authenticated user data instead of mock data
  const client = mockClientData.voiceClients[0] // Keep mock for other fields not available in auth

  // Load account information
  accountData.companyName = authStore.user?.displayName || client.companyName
  accountData.contactName = authStore.user?.displayName || client.contactName
  accountData.email = authStore.user?.email || client.email
  accountData.phone = client.phone || ''
  accountData.website = client.website || ''
  accountData.location = client.location
  accountData.timezone = client.timezone || 'UTC+0'
  accountData.industry = client.industry
  accountData.companySize = client.companySize || 'small'
  accountData.description = client.description || ''

  // Load job preferences
  jobPreferencesData.autoApprove = client.preferences.autoApprove
  jobPreferencesData.requireNDA = client.preferences.requireNDA
  jobPreferencesData.requirePortfolio =
    ((client.preferences as Record<string, unknown>).requirePortfolio as boolean) || true
  jobPreferencesData.isPublic = client.isPublic

  // Load social links
  socialLinksData.website = client.website || ''
  socialLinksData.linkedin = client.socialLinks.linkedin || ''
  socialLinksData.facebook = client.socialLinks.facebook || ''
  socialLinksData.twitter = client.socialLinks.twitter || ''

  // Update legacy settings for compatibility
  Object.assign(settings, {
    id: authStore.user?.id || client.id,
    userId: authStore.user?.id || client.id,
    ...accountData,
    logoUrl: client.logoUrl || '',
    isVerified: client.isVerified || false,
    totalJobs: client.totalJobs || 0,
    activeJobs: client.activeJobs,
    completedJobs: client.completedJobs,
    totalSpent: client.totalSpent,
    averageRating: client.averageRating,
    joinedDate: client.joinedDate,
    lastActive: client.lastActive,
    createdAt: client.createdAt || new Date().toISOString(),
    updatedAt: client.updatedAt || new Date().toISOString(),
    isPublic: jobPreferencesData.isPublic,
    socialLinks: socialLinksData,
    preferences: {
      autoApprove: jobPreferencesData.autoApprove,
      requireNDA: jobPreferencesData.requireNDA,
    },
  })
}

const saveSettings = async () => {
  isSaving.value = true

  try {
    // In real app, send settings to API
    console.log('Saving client settings:', settings)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('Failed to save settings. Please try again.')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadSettings()
})
</script>
