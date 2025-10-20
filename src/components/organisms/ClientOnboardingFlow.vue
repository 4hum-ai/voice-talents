<template>
  <div v-if="showOnboarding" class="bg-background fixed inset-0 z-50 overflow-hidden">
    <!-- Top Navigation Bar -->
    <div
      class="border-border bg-card/95 absolute top-0 right-0 left-0 z-10 border-b backdrop-blur-sm"
    >
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
          <div class="text-muted-foreground text-sm">
            Step {{ currentStep }} of {{ totalSteps }}
          </div>
          <div class="bg-muted h-2 w-32 rounded-full">
            <div
              class="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
              :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
            />
          </div>
          <div class="text-muted-foreground text-sm">
            {{ Math.round((currentStep / totalSteps) * 100) }}%
          </div>
        </div>

        <!-- Right: Close and Next/Skip -->
        <div class="flex items-center space-x-3">
          <Button
            v-if="currentStep < totalSteps"
            variant="primary"
            :disabled="!canProceedToNext"
            @click="nextStep"
          >
            Next
            <Icon name="mdi:chevron-right" class="ml-2 h-4 w-4" />
          </Button>
          <Button v-else variant="primary" @click="completeOnboarding">
            Get Started
            <Icon name="mdi:rocket-launch" class="ml-2 h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" @click="closeOnboarding">
            <Icon name="mdi:close" class="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="h-full overflow-y-auto pt-20">
      <div class="mx-auto max-w-4xl px-6 py-8">
        <!-- Step 1: Welcome & Company Info -->
        <div v-if="currentStep === 1" class="space-y-8">
          <div class="text-center">
            <div
              class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600"
            >
              <Icon name="mdi:briefcase" class="h-10 w-10 text-white" />
            </div>
            <h1 class="text-foreground mb-4 text-3xl font-bold">Welcome to VoiceAct.AI</h1>
            <p class="text-muted-foreground mb-8 text-lg">
              Let's set up your client account to start finding amazing voice talent
            </p>
          </div>

          <div class="bg-card rounded-lg p-8 shadow-lg">
            <h2 class="text-foreground mb-6 text-xl font-semibold">Company Information</h2>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <label class="text-foreground mb-2 block text-sm font-medium">
                  Company Name *
                </label>
                <input
                  v-model="onboardingData.companyName"
                  type="text"
                  required
                  class="border-border bg-input text-foreground placeholder-muted-foreground focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  placeholder="Your Company Name"
                />
              </div>
              <div>
                <label class="text-foreground mb-2 block text-sm font-medium"> Your Name * </label>
                <input
                  v-model="onboardingData.contactName"
                  type="text"
                  required
                  class="border-border bg-input text-foreground placeholder-muted-foreground focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  placeholder="Your Full Name"
                />
              </div>
              <div>
                <label class="text-foreground mb-2 block text-sm font-medium">
                  Email Address *
                </label>
                <input
                  v-model="onboardingData.email"
                  type="email"
                  required
                  class="border-border bg-input text-foreground placeholder-muted-foreground focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label class="text-foreground mb-2 block text-sm font-medium"> Industry </label>
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
            <div
              class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-600"
            >
              <Icon name="mdi:target" class="h-10 w-10 text-white" />
            </div>
            <h1 class="text-foreground mb-4 text-3xl font-bold">Set Your Preferences</h1>
            <p class="text-muted-foreground mb-8 text-lg">
              Tell us about your typical voice over needs
            </p>
          </div>

          <div class="bg-card rounded-lg p-8 shadow-lg">
            <h2 class="text-foreground mb-6 text-xl font-semibold">Job Defaults</h2>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <label class="text-foreground mb-2 block text-sm font-medium">
                  Typical Budget Range
                </label>
                <div class="grid grid-cols-2 gap-3">
                  <input
                    v-model.number="onboardingData.defaultBudget.min"
                    type="number"
                    min="0"
                    class="border-border bg-input text-foreground placeholder-muted-foreground focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    placeholder="Min"
                  />
                  <input
                    v-model.number="onboardingData.defaultBudget.max"
                    type="number"
                    min="0"
                    class="border-border bg-input text-foreground placeholder-muted-foreground focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                    placeholder="Max"
                  />
                </div>
              </div>
              <div>
                <label class="text-foreground mb-2 block text-sm font-medium">
                  Preferred Currency
                </label>
                <SelectInput
                  v-model="onboardingData.defaultBudget.currency"
                  :options="currencyOptions"
                  placeholder="Select currency"
                />
              </div>
              <div>
                <label class="text-foreground mb-2 block text-sm font-medium">
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
                <label class="text-foreground mb-2 block text-sm font-medium">
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
            <div
              class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600"
            >
              <Icon name="mdi:cog" class="h-10 w-10 text-white" />
            </div>
            <h1 class="text-foreground mb-4 text-3xl font-bold">Workflow Preferences</h1>
            <p class="text-muted-foreground mb-8 text-lg">
              How would you like to work with voice actors?
            </p>
          </div>

          <div class="bg-card rounded-lg p-8 shadow-lg">
            <h2 class="text-foreground mb-6 text-xl font-semibold">Job Preferences</h2>

            <div class="space-y-6">
              <div class="border-border flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h3 class="text-foreground text-sm font-medium">Auto-approve Applications</h3>
                  <p class="text-muted-foreground text-sm">
                    Automatically approve applications that meet your criteria
                  </p>
                </div>
                <input
                  v-model="onboardingData.autoApprove"
                  type="checkbox"
                  class="border-border text-primary focus:ring-primary h-4 w-4 rounded"
                />
              </div>

              <div class="border-border flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h3 class="text-foreground text-sm font-medium">Require NDA</h3>
                  <p class="text-muted-foreground text-sm">
                    Require voice actors to sign an NDA before starting work
                  </p>
                </div>
                <input
                  v-model="onboardingData.requireNDA"
                  type="checkbox"
                  class="border-border text-primary focus:ring-primary h-4 w-4 rounded"
                />
              </div>

              <div class="border-border flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h3 class="text-foreground text-sm font-medium">Require Portfolio</h3>
                  <p class="text-muted-foreground text-sm">
                    Only allow voice actors with portfolios to apply
                  </p>
                </div>
                <input
                  v-model="onboardingData.requirePortfolio"
                  type="checkbox"
                  class="border-border text-primary focus:ring-primary h-4 w-4 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Complete Setup -->
        <div v-if="currentStep === 4" class="space-y-8">
          <div class="text-center">
            <div
              class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600"
            >
              <Icon name="mdi:check-circle" class="h-10 w-10 text-white" />
            </div>
            <h1 class="text-foreground mb-4 text-3xl font-bold">You're All Set!</h1>
            <p class="text-muted-foreground mb-8 text-lg">
              Your client account is ready. Start posting jobs and finding amazing voice talent.
            </p>
          </div>

          <div class="bg-card rounded-lg p-8 shadow-lg">
            <h2 class="text-foreground mb-6 text-xl font-semibold">What's Next?</h2>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div class="rounded-lg border border-gray-200 p-6 text-center dark:border-gray-600">
                <Icon name="mdi:plus-circle" class="mx-auto mb-3 h-8 w-8 text-blue-600" />
                <h3 class="text-foreground mb-2 font-medium">Post Your First Job</h3>
                <p class="text-muted-foreground text-sm">
                  Create a job posting to find voice actors
                </p>
              </div>

              <div class="rounded-lg border border-gray-200 p-6 text-center dark:border-gray-600">
                <Icon name="mdi:account-group" class="mx-auto mb-3 h-8 w-8 text-green-600" />
                <h3 class="text-foreground mb-2 font-medium">Browse Talent</h3>
                <p class="text-muted-foreground text-sm">
                  Discover voice actors in our talent pool
                </p>
              </div>

              <div class="rounded-lg border border-gray-200 p-6 text-center dark:border-gray-600">
                <Icon name="mdi:email" class="mx-auto mb-3 h-8 w-8 text-purple-600" />
                <h3 class="text-foreground mb-2 font-medium">Send Invitations</h3>
                <p class="text-muted-foreground text-sm">
                  Invite specific voice actors to your projects
                </p>
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
    currency: 'USD',
  },
  preferredLanguages: [] as string[],
  preferredVoiceTypes: [] as string[],
  autoApprove: false,
  requireNDA: false,
  requirePortfolio: true,
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
  { value: 'other', label: 'Other' },
]

const currencyOptions = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD (C$)' },
  { value: 'AUD', label: 'AUD (A$)' },
  { value: 'VND', label: 'VND (₫)' },
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
  { value: 'Dutch', label: 'Dutch' },
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
  { value: 'e-learning', label: 'E-Learning' },
]

// Computed
const canProceedToNext = computed(() => {
  switch (currentStep.value) {
    case 1:
      return (
        onboardingData.value.companyName &&
        onboardingData.value.contactName &&
        onboardingData.value.email
      )
    case 2:
      return (
        onboardingData.value.preferredLanguages.length > 0 &&
        onboardingData.value.preferredVoiceTypes.length > 0
      )
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
watch(
  () => currentMode.value,
  (newMode) => {
    if (newMode === 'client' && shouldShowOnboarding.value) {
      showOnboarding.value = true
      setOnboardingSteps(currentStep.value, totalSteps.value)
    } else {
      showOnboarding.value = false
    }
  },
)
</script>
