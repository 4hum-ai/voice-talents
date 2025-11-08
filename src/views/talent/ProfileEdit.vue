<template>
  <div>
    <div class="mx-auto max-w-4xl">
      <!-- Tab Navigation with Content -->
      <div class="mb-8">
        <TabNavigation v-model="activeTab" variant="underline" size="lg">
          <!-- Basic Information Tab -->
          <Tab id="basic" label="Basic Info">
            <div class="space-y-8">
              <Card class="p-6">
                <BasicInfoStep :profile-data="profileData" @update="updateProfileData" />
              </Card>
            </div>
          </Tab>

          <!-- Voice Types Tab -->
          <Tab id="voice-types" label="Voice Types">
            <div class="space-y-8">
              <Card class="p-6">
                <VoiceTypesStep :profile-data="profileData" @update="updateProfileData" />
              </Card>
            </div>
          </Tab>

          <!-- Languages Tab -->
          <Tab id="languages" label="Languages">
            <div class="space-y-8">
              <Card class="p-6">
                <LanguagesStep :profile-data="profileData" @update="updateProfileData" />
              </Card>
            </div>
          </Tab>

          <!-- Voice Samples Tab -->
          <Tab id="voice-samples" label="Voice Samples">
            <div class="space-y-8">
              <Card class="p-6">
                <VoiceSamplesStep
                  :profile-data="profileData"
                  :voice-samples="voiceSamples"
                  @update="updateVoiceSamples"
                />
              </Card>
            </div>
          </Tab>

          <!-- Pricing & Rates Tab -->
          <Tab id="pricing" label="Pricing & Rates">
            <div class="space-y-8">
              <Card class="p-6">
                <PricingStep
                  :profile-data="profileData"
                  :pricing-data="pricingData"
                  @update="updatePricingData"
                />
              </Card>
            </div>
          </Tab>
        </TabNavigation>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Card from '@/components/atoms/Card.vue'
import TabNavigation from '@/components/molecules/TabNavigation.vue'
import Tab from '@/components/molecules/Tab.vue'
import BasicInfoStep from '@/components/molecules/TalentProfile/BasicInfoStep.vue'
import VoiceTypesStep from '@/components/molecules/TalentProfile/VoiceTypesStep.vue'
import LanguagesStep from '@/components/molecules/TalentProfile/LanguagesStep.vue'
import VoiceSamplesStep from '@/components/molecules/TalentProfile/VoiceSamplesStep.vue'
import PricingStep from '@/components/molecules/TalentProfile/PricingStep.vue'

// Tab management
const activeTab = ref('basic')

// Profile data structure (matching onboarding)
const profileData = reactive({
  displayName: '',
  bio: '',
  location: '',
  avatarUrl: '',
  voiceTypes: [] as string[],
  languages: [] as string[],
})

// Voice samples data - matching the onboarding structure
const voiceSamples = reactive<
  Record<
    string,
    {
      file: File
      name: string
      size: number
      previewUrl: string
      title: string
      description: string
    }
  >
>({})

// Pricing data - matching the onboarding structure
const pricingData = reactive({
  hourlyRate: '',
  perWordRate: '',
  notes: '',
  // Dynamic rates based on selected job types
  jobTypeRates: {} as Record<string, string>,
})

// Update methods for child components
const updateProfileData = (data: Partial<typeof profileData>) => {
  Object.assign(profileData, data)
}

const updateVoiceSamples = (data: Partial<typeof voiceSamples>) => {
  Object.assign(voiceSamples, data)
}

const updatePricingData = (data: Partial<typeof pricingData>) => {
  Object.assign(pricingData, data)
}

// Load existing data on mount
onMounted(() => {
  // Try to load from localStorage (from onboarding)
  const savedData = localStorage.getItem('voiceact-onboarding-data')
  if (savedData) {
    try {
      const data = JSON.parse(savedData)
      if (data.profileData) {
        Object.assign(profileData, data.profileData)
      }
      if (data.pricingData) {
        Object.assign(pricingData, data.pricingData)
      }
      if (data.voiceSamples) {
        Object.assign(voiceSamples, data.voiceSamples)
      }
    } catch (err) {
      console.error('Error loading saved data:', err)
    }
  }
})
</script>

<style scoped>
/* Upload area animations */
.upload-area {
  transition: all 0.3s ease;
}

.upload-area.drag-over {
  transform: scale(1.02);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Icon animations */
.icon-bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

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

/* Card hover effects */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Smooth transitions for all interactive elements */
* {
  transition: all 0.2s ease;
}

/* Focus states */
input:focus,
textarea:focus {
  transform: scale(1.02);
}

/* Checkbox and radio animations */
input[type='checkbox'],
input[type='radio'] {
  transition: all 0.2s ease;
}

input[type='checkbox']:checked,
input[type='radio']:checked {
  transform: scale(1.1);
}

/* Pulse animation for loading states */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

.pulse {
  animation: pulse 2s infinite;
}

/* Spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spin {
  animation: spin 1s linear infinite;
}

/* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* Scale in animation */
@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

.scale-in {
  animation: scaleIn 0.3s ease-out;
}
</style>
