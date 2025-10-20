<template>
  <div class="bg-background flex min-h-screen">
    <!-- Navigation Sidebar -->
    <ClientNavigation />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header with Stepper -->
      <AppBar :show-back="true" @back="goBack">
        <template #title>Client Settings</template>
        <template #subtitle>Manage your client account settings and preferences</template>
        <template #actions>
          <ThemeToggle />
          <Button variant="outline" size="sm" @click="resetSettings">
            <RefreshIcon class="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
        </template>
      </AppBar>

      <div class="bg-card border-border border-b shadow-sm">
        <div class="px-4 sm:px-6 lg:px-8">
          <!-- Stepper Navigation -->
          <div class="border-border border-t py-4">
            <div class="flex items-center justify-between">
              <!-- Previous Button -->
              <Button
                v-if="currentStep > 1"
                variant="outline"
                size="sm"
                @click="previousStep"
                :disabled="!canGoBack"
              >
                <ArrowLeftIcon class="mr-2 h-4 w-4" />
                Previous
              </Button>
              <div v-else class="w-20" />

              <!-- Progress Indicator -->
              <div class="flex items-center space-x-4">
                <div class="text-muted-foreground text-sm">
                  Step {{ currentStep }} of {{ totalSteps }}
                </div>
                <div class="bg-muted h-2 w-32 rounded-full">
                  <div
                    class="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                    :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
                  />
                </div>
                <div class="text-muted-foreground text-sm">
                  {{ Math.round((currentStep / totalSteps) * 100) }}%
                </div>
              </div>

              <!-- Next Button -->
              <Button
                v-if="currentStep < totalSteps"
                variant="primary"
                size="sm"
                @click="nextStep"
                :disabled="!canProceedToNext"
              >
                Next
                <ArrowRightIcon class="ml-2 h-4 w-4" />
              </Button>
              <Button
                v-else
                variant="primary"
                size="sm"
                @click="saveSettings"
                :disabled="isSaving"
                :loading="isSaving"
              >
                <SaveIcon class="mr-2 h-4 w-4" />
                {{ isSaving ? 'Saving...' : 'Save Settings' }}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="px-4 py-8 pt-24 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-4xl">
          <form @submit.prevent="saveSettings" class="space-y-8">
            <!-- Step 1: Account Information -->
            <AccountInformation
              v-if="currentStep === 1"
              v-model="accountData"
              @validation-change="updateStepValidation(1, $event)"
            />

            <!-- Step 2: Job Defaults -->
            <JobDefaults
              v-if="currentStep === 2"
              v-model="jobDefaultsData"
              @validation-change="updateStepValidation(2, $event)"
            />

            <!-- Step 3: Job Preferences -->
            <JobPreferences
              v-if="currentStep === 3"
              v-model="jobPreferencesData"
              @validation-change="updateStepValidation(3, $event)"
            />

            <!-- Step 4: Social Links -->
            <SocialLinks
              v-if="currentStep === 4"
              v-model="socialLinksData"
              @validation-change="updateStepValidation(4, $event)"
            />

            <!-- Step 5: Review & Save -->
            <ReviewAndSave
              v-if="currentStep === 5"
              :model-value="reviewData"
            />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { VoiceClient } from '@/types/voice-client'
import { mockClientData } from '@/data/mock-voice-client-data'
import { useAuthStore } from '@/stores/auth'
import ClientNavigation from '@/components/organisms/ClientNavigation.vue'
import AppBar from '@/components/molecules/AppBar.vue'
import Button from '@/components/atoms/Button.vue'
import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
import {
  AccountInformation,
  JobDefaults,
  JobPreferences,
  SocialLinks,
  ReviewAndSave
} from '@/components/molecules/ClientSettings'
import ArrowRightIcon from '~icons/mdi/arrow-right'
import SaveIcon from '~icons/mdi/content-save'
import RefreshIcon from '~icons/mdi/refresh'

const router = useRouter()
const authStore = useAuthStore()

// State
const isSaving = ref(false)
const currentStep = ref(1)
const totalSteps = ref(5)
const stepValidation = reactive<Record<number, boolean>>({})

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

const jobDefaultsData = reactive({
  defaultBudget: {
    min: 0,
    max: 0,
    currency: 'USD',
  },
  preferredLanguages: [] as string[],
  preferredVoiceTypes: [] as string[],
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

// Computed for review data
const reviewData = computed(() => ({
  ...accountData,
  preferences: {
    ...jobDefaultsData,
    ...jobPreferencesData,
  },
  isPublic: jobPreferencesData.isPublic,
  socialLinks: socialLinksData,
}))

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
const updateStepValidation = (step: number, isValid: boolean) => {
  stepValidation[step] = isValid
}

// Computed
const canGoBack = computed(() => currentStep.value > 1)

const canProceedToNext = computed(() => {
  return stepValidation[currentStep.value] ?? false
})

// Methods
const goBack = () => {
  router.back()
}

const nextStep = () => {
  if (currentStep.value < totalSteps.value && canProceedToNext.value) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
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

  // Load job defaults
  jobDefaultsData.defaultBudget.min = client.preferences.defaultBudget.min
  jobDefaultsData.defaultBudget.max = client.preferences.defaultBudget.max
  jobDefaultsData.defaultBudget.currency = client.preferences.defaultBudget.currency
  jobDefaultsData.preferredLanguages = [...client.preferences.preferredLanguages]
  jobDefaultsData.preferredVoiceTypes = [...client.preferences.preferredVoiceTypes]

  // Load job preferences
  jobPreferencesData.autoApprove = client.preferences.autoApprove
  jobPreferencesData.requireNDA = client.preferences.requireNDA
  jobPreferencesData.requirePortfolio = (client.preferences as any).requirePortfolio || true
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
      ...jobDefaultsData,
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

    // Show success message
    alert('Settings saved successfully!')

    // Navigate back or to dashboard
    router.push('/client/dashboard')
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('Failed to save settings. Please try again.')
  } finally {
    isSaving.value = false
  }
}

const resetSettings = () => {
  loadSettings()
  currentStep.value = 1
  alert('Settings reset to default values.')
}

onMounted(() => {
  loadSettings()
})
</script>
