<template>
  <div v-if="showOnboarding" class="fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-hidden">
    <!-- Top Navigation Bar -->
    <div class="absolute top-0 left-0 right-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between px-6 py-4">
        <!-- Left: Previous Button -->
        <Button v-if="currentStep > 1" variant="outline" size="md" @click="previousStep">
          <div class="flex items-center gap-2">
            <Icon name="mdi:chevron-left" class="h-4 w-4" />
            <span>Previous</span>
          </div>
        </Button>
        <div v-else class="w-20" />

        <!-- Center: Progress -->
        <div class="flex items-center space-x-4">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Step {{ currentStep }} of {{ totalSteps }}
          </div>
          <div class="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              :style="{ width: `${(currentStep / totalSteps) * 100}%` }" />
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ Math.round((currentStep / totalSteps) * 100) }}%
          </div>
        </div>

        <!-- Right: Close and Next/Skip -->
        <div class="flex items-center space-x-3">
          <Button v-if="currentStep < totalSteps" variant="primary" :disabled="!canProceedToNext" @click="nextStep">
            Next
            <Icon name="mdi:chevron-right" class="h-4 w-4 ml-2" />
          </Button>
          <Button v-else variant="primary" @click="completeOnboarding">
            Get Started
            <Icon name="mdi:rocket-launch" class="h-4 w-4 ml-2" />
          </Button>
          <Button variant="ghost" size="sm" @click="closeOnboarding">
            <Icon name="mdi:close" class="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="pt-20 h-full overflow-y-auto">
      <div class="max-w-4xl mx-auto px-6 py-8">
        <!-- Step 1: Welcome & Company Info -->
        <div v-if="currentStep === 1" class="space-y-8">
          <div class="text-center">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="mdi:briefcase" class="h-10 w-10 text-white" />
            </div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to VoiceAct.AI
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Let's set up your client account to start finding amazing voice talent
            </p>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Company Information</h2>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Name *
                </label>
                <input
                  v-model="onboardingData.companyName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Company Name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  v-model="onboardingData.contactName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Full Name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  v-model="onboardingData.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Industry
                </label>
                <SelectInput
                  v-model="onboardingData.industry"
                  :options="industryOptions"
                  placeholder="Select your industry"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Job Preferences -->
        <div v-if="currentStep === 2" class="space-y-8">
          <div class="text-center">
            <div class="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="mdi:target" class="h-10 w-10 text-white" />
            </div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Set Your Preferences
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Tell us about your typical voice over needs
            </p>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Job Defaults</h2>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Typical Budget Range
                </label>
                <div class="grid grid-cols-2 gap-3">
                  <input
                    v-model.number="onboardingData.defaultBudget.min"
                    type="number"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Min"
                  />
                  <input
                    v-model.number="onboardingData.defaultBudget.max"
                    type="number"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Max"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Currency
                </label>
                <SelectInput
                  v-model="onboardingData.defaultBudget.currency"
                  :options="currencyOptions"
                  placeholder="Select currency"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Languages
                </label>
                <SelectInput
                  v-model="onboardingData.preferredLanguages"
                  :options="languageOptions"
                  placeholder="Select languages"
                  multiple
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Voice Types
                </label>
                <SelectInput
                  v-model="onboardingData.preferredVoiceTypes"
                  :options="voiceTypeOptions"
                  placeholder="Select voice types"
                  multiple
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Workflow Preferences -->
        <div v-if="currentStep === 3" class="space-y-8">
          <div class="text-center">
            <div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="mdi:cog" class="h-10 w-10 text-white" />
            </div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Workflow Preferences
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
              How would you like to work with voice actors?
            </p>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Job Preferences</h2>
            
            <div class="space-y-6">
              <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div>
                  <h3 class="text-sm font-medium text-gray-900 dark:text-white">Auto-approve Applications</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Automatically approve applications that meet your criteria</p>
                </div>
                <input
                  v-model="onboardingData.autoApprove"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div>
                  <h3 class="text-sm font-medium text-gray-900 dark:text-white">Require NDA</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Require voice actors to sign an NDA before starting work</p>
                </div>
                <input
                  v-model="onboardingData.requireNDA"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div>
                  <h3 class="text-sm font-medium text-gray-900 dark:text-white">Require Portfolio</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Only allow voice actors with portfolios to apply</p>
                </div>
                <input
                  v-model="onboardingData.requirePortfolio"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Complete Setup -->
        <div v-if="currentStep === 4" class="space-y-8">
          <div class="text-center">
            <div class="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="mdi:check-circle" class="h-10 w-10 text-white" />
            </div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              You're All Set!
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Your client account is ready. Start posting jobs and finding amazing voice talent.
            </p>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">What's Next?</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center p-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                <Icon name="mdi:plus-circle" class="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 class="font-medium text-gray-900 dark:text-white mb-2">Post Your First Job</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Create a job posting to find voice actors</p>
              </div>
              
              <div class="text-center p-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                <Icon name="mdi:account-group" class="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 class="font-medium text-gray-900 dark:text-white mb-2">Browse Talent</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Discover voice actors in our talent pool</p>
              </div>
              
              <div class="text-center p-6 border border-gray-200 dark:border-gray-600 rounded-lg">
                <Icon name="mdi:email" class="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 class="font-medium text-gray-900 dark:text-white mb-2">Send Invitations</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Invite specific voice actors to your projects</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboarding } from '@/composables/useOnboarding'
import Button from '@/components/atoms/Button.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import Icon from '@/components/atoms/Icon.vue'

const router = useRouter()
const { 
  shouldShowOnboarding, 
  currentMode, 
  isClientMode,
  setOnboardingSteps,
  updateOnboardingStep,
  completeCurrentOnboarding,
  startClientOnboarding
} = useOnboarding()

// State
const showOnboarding = ref(false)
const currentStep = ref(1)
const totalSteps = ref(4)

// Onboarding data
const onboardingData = ref({
  companyName: '',
  contactName: '',
  email: '',
  industry: '',
  defaultBudget: {
    min: 0,
    max: 0,
    currency: 'USD'
  },
  preferredLanguages: [] as string[],
  preferredVoiceTypes: [] as string[],
  autoApprove: false,
  requireNDA: false,
  requirePortfolio: true
})

// Options
const industryOptions = [
  { value: 'technology', label: 'Technology' },
  { value: 'advertising', label: 'Advertising & Marketing' },
  { value: 'education', label: 'Education' },
  { value: 'entertainment', label: 'Entertainment & Media' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'nonprofit', label: 'Non-profit' },
  { value: 'other', label: 'Other' }
]

const currencyOptions = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD (C$)' },
  { value: 'AUD', label: 'AUD (A$)' },
  { value: 'VND', label: 'VND (₫)' }
]

const languageOptions = [
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Italian', label: 'Italian' },
  { value: 'Portuguese', label: 'Portuguese' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Korean', label: 'Korean' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Arabic', label: 'Arabic' },
  { value: 'Russian', label: 'Russian' },
  { value: 'Dutch', label: 'Dutch' }
]

const voiceTypeOptions = [
  { value: 'narrator', label: 'Narrator' },
  { value: 'character', label: 'Character' },
  { value: 'announcer', label: 'Announcer' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'audiobook', label: 'Audiobook' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'animation', label: 'Animation' },
  { value: 'video_game', label: 'Video Game' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'e-learning', label: 'E-Learning' }
]

// Computed
const canProceedToNext = computed(() => {
  switch (currentStep.value) {
    case 1:
      return onboardingData.value.companyName && 
             onboardingData.value.contactName && 
             onboardingData.value.email
    case 2:
      return onboardingData.value.preferredLanguages.length > 0 &&
             onboardingData.value.preferredVoiceTypes.length > 0
    case 3:
      return true // All optional preferences
    case 4:
      return true // Completion step
    default:
      return false
  }
})

// Methods
const nextStep = () => {
  if (currentStep.value < totalSteps.value) {
    currentStep.value++
    updateOnboardingStep(currentStep.value)
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    updateOnboardingStep(currentStep.value)
  }
}

const completeOnboarding = () => {
  // Save onboarding data
  completeCurrentOnboarding(onboardingData.value)
  
  // Hide onboarding
  showOnboarding.value = false
  
  // Navigate to client dashboard
  router.push('/client/dashboard')
}

const closeOnboarding = () => {
  showOnboarding.value = false
}

// Initialize
onMounted(() => {
  // Check if we should show client onboarding
  if (isClientMode.value && shouldShowOnboarding.value) {
    showOnboarding.value = true
    setOnboardingSteps(currentStep.value, totalSteps.value)
  }
})

// Watch for mode changes
watch(() => currentMode.value, (newMode) => {
  if (newMode === 'client' && shouldShowOnboarding.value) {
    showOnboarding.value = true
    setOnboardingSteps(currentStep.value, totalSteps.value)
  } else {
    showOnboarding.value = false
  }
})
</script>
