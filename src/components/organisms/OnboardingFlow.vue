<template>
  <div v-if="showOnboarding" class="fixed inset-0 z-50 overflow-hidden">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeOnboarding" />
    
    <!-- Onboarding Container -->
    <div class="relative flex items-center justify-center min-h-screen p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome to VoiceAct! 🎙️
              </h2>
              <p class="text-gray-600 dark:text-gray-400 mt-1">
                Let's get you set up for success
              </p>
            </div>
            <Button variant="ghost" size="sm" @click="closeOnboarding">
              <Icon name="mdi:close" class="h-5 w-5" />
            </Button>
          </div>
          
          <!-- Progress Bar -->
          <div class="mt-6">
            <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Step {{ currentStep }} of {{ totalSteps }}</span>
              <span>{{ Math.round((currentStep / totalSteps) * 100) }}% Complete</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
              />
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="px-8 py-6 max-h-[60vh] overflow-y-auto">
          <Transition
            :name="transitionName"
            mode="out-in"
          >
            <div :key="currentStep" class="space-y-6">
              <!-- Step 1: Welcome -->
              <div v-if="currentStep === 1" class="text-center space-y-6">
                <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <Icon name="mdi:microphone" class="h-12 w-12 text-white" />
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Welcome to VoiceAct!
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    Your comprehensive platform for managing your voice acting career. 
                    From showcasing your talent to managing projects, we've got you covered.
                  </p>
                </div>
                <div class="grid grid-cols-2 gap-4 text-left">
                  <div class="flex items-start space-x-3">
                    <Icon name="mdi:upload" class="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-white">Upload Samples</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Showcase your voice talent</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <Icon name="mdi:briefcase" class="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-white">Manage Projects</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Track your work and earnings</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <Icon name="mdi:account-search" class="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-white">Find Opportunities</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Discover casting calls</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3">
                    <Icon name="mdi:chart-line" class="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-white">Track Progress</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Monitor your career growth</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 2: Profile Setup -->
              <div v-if="currentStep === 2" class="space-y-6">
                <div class="text-center">
                  <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="mdi:account" class="h-8 w-8 text-white" />
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Complete Your Profile
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    A complete profile helps clients find and trust you. Let's set up the basics.
                  </p>
                </div>
                
                <div class="space-y-4">
                  <div class="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Icon name="mdi:check-circle" class="h-5 w-5 text-green-500" />
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-white">Profile Photo</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Add a professional headshot</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <Icon name="mdi:clock" class="h-5 w-5 text-yellow-500" />
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-white">Bio & Experience</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Tell clients about your background</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <Icon name="mdi:clock" class="h-5 w-5 text-yellow-500" />
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-white">Skills & Languages</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Highlight your voice acting skills</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 3: Upload First Sample -->
              <div v-if="currentStep === 3" class="space-y-6">
                <div class="text-center">
                  <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="mdi:upload" class="h-8 w-8 text-white" />
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Upload Your First Voice Sample
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    Showcase your talent with a high-quality voice sample. This is your first impression!
                  </p>
                </div>
                
                <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer">
                  <Icon name="mdi:cloud-upload" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Drop your audio file here
                  </h4>
                  <p class="text-gray-600 dark:text-gray-400 mb-4">
                    or click to browse files
                  </p>
                  <Button variant="outline">
                    <Icon name="mdi:folder-open" class="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
                
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  <p>Supported formats: MP3, WAV, OGG</p>
                  <p>Maximum file size: 50MB</p>
                </div>
              </div>

              <!-- Step 4: Explore Features -->
              <div v-if="currentStep === 4" class="space-y-6">
                <div class="text-center">
                  <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="mdi:compass" class="h-8 w-8 text-white" />
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Explore VoiceAct Features
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    Here are the key areas you'll use most often.
                  </p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    v-for="feature in features"
                    :key="feature.name"
                    class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer"
                    @click="navigateToFeature(feature.route)"
                  >
                    <div class="flex items-start space-x-3">
                      <div :class="`w-10 h-10 rounded-lg flex items-center justify-center ${feature.bgColor}`">
                        <Icon :name="feature.icon" class="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 class="font-medium text-gray-900 dark:text-white">{{ feature.name }}</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400">{{ feature.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 5: Get Started -->
              <div v-if="currentStep === 5" class="text-center space-y-6">
                <div class="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <Icon name="mdi:check" class="h-10 w-10 text-white" />
                </div>
                <div>
                  <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    You're All Set! 🎉
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    You're ready to start your voice acting journey with VoiceAct. 
                    Remember, you can always revisit this tour from the help menu.
                  </p>
                </div>
                
                <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 class="font-medium text-blue-900 dark:text-blue-100 mb-2">Quick Tips:</h4>
                  <ul class="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
                    <li>• Upload diverse voice samples to showcase your range</li>
                    <li>• Keep your profile updated with recent work</li>
                    <li>• Check casting calls regularly for new opportunities</li>
                    <li>• Use analytics to track your career progress</li>
                  </ul>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Footer -->
        <div class="px-8 py-6 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <Button
              v-if="currentStep > 1"
              variant="outline"
              @click="previousStep"
            >
              <Icon name="mdi:chevron-left" class="h-4 w-4 mr-2" />
              Previous
            </Button>
            <div v-else />
            
            <div class="flex items-center space-x-2">
              <Button
                variant="ghost"
                @click="skipOnboarding"
              >
                Skip Tour
              </Button>
              <Button
                v-if="currentStep < totalSteps"
                variant="primary"
                @click="nextStep"
              >
                Next
                <Icon name="mdi:chevron-right" class="h-4 w-4 ml-2" />
              </Button>
              <Button
                v-else
                variant="primary"
                @click="completeOnboarding"
              >
                Get Started
                <Icon name="mdi:rocket-launch" class="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'

interface Props {
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
})

const emit = defineEmits<{
  complete: []
  skip: []
  close: []
}>()

const router = useRouter()

// State
const currentStep = ref(1)
const totalSteps = 5
const transitionName = ref('slide-left')

// Features to explore
const features = [
  {
    name: 'Dashboard',
    description: 'Overview of your career and recent activity',
    icon: 'mdi:view-dashboard',
    bgColor: 'bg-blue-500',
    route: '/dashboard'
  },
  {
    name: 'Voice Samples',
    description: 'Upload and manage your voice portfolio',
    icon: 'mdi:microphone',
    bgColor: 'bg-purple-500',
    route: '/samples'
  },
  {
    name: 'Projects',
    description: 'Track your active and completed projects',
    icon: 'mdi:briefcase',
    bgColor: 'bg-green-500',
    route: '/projects'
  },
  {
    name: 'Casting Calls',
    description: 'Discover new voice acting opportunities',
    icon: 'mdi:account-search',
    bgColor: 'bg-orange-500',
    route: '/casting'
  }
]

// Computed
const showOnboarding = computed(() => props.show)

// Methods
const nextStep = () => {
  if (currentStep.value < totalSteps) {
    transitionName.value = 'slide-left'
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    transitionName.value = 'slide-right'
    currentStep.value--
  }
}

const completeOnboarding = () => {
  // Mark onboarding as completed in localStorage
  localStorage.setItem('voiceact-onboarding-completed', 'true')
  emit('complete')
}

const skipOnboarding = () => {
  localStorage.setItem('voiceact-onboarding-completed', 'true')
  emit('skip')
}

const closeOnboarding = () => {
  emit('close')
}

const navigateToFeature = (route: string) => {
  router.push(route)
}
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
