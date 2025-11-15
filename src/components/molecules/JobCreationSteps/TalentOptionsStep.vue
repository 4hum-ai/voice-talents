<template>
  <div class="mx-auto max-w-2xl">
    <div class="mb-6 text-center sm:mb-8">
      <h1 class="text-foreground mb-3 text-2xl font-bold sm:text-3xl">Additional Options</h1>
      <p class="text-muted-foreground text-base sm:text-lg">Customize your project (optional)</p>
    </div>

    <div class="space-y-6">
      <!-- Public Listing Option (only for talent_only) -->
      <div
        v-if="props.voiceType === 'talent_only'"
        class="bg-card border-border rounded-lg border p-6"
      >
        <label
          class="flex cursor-pointer items-start space-x-3"
          :class="isVisibilityDisabled ? 'cursor-not-allowed opacity-50' : ''"
        >
          <input
            v-model="localTalentOptions.isPublic"
            type="checkbox"
            :disabled="isVisibilityDisabled"
            class="text-primary focus:ring-primary border-border mt-1 h-4 w-4 rounded disabled:cursor-not-allowed"
          />
          <div class="flex-1">
            <h4 class="text-foreground font-medium">Public Listing</h4>
            <p class="text-muted-foreground mt-1 text-sm">
              Post publicly and let talent apply to your project
            </p>
          </div>
        </label>
      </div>

      <!-- Premium Features -->
      <div class="bg-card border-border rounded-lg border p-6">
        <h3 class="text-foreground mb-4 text-base font-semibold">Premium Features (Optional)</h3>

        <div v-if="availablePremiumFeatures.length === 0" class="bg-muted/50 rounded-lg p-4">
          <p class="text-muted-foreground text-sm">
            No premium features available for this project type
          </p>
        </div>

        <div v-else class="space-y-3">
          <label
            v-for="feature in availablePremiumFeatures"
            :key="feature.id"
            class="border-border hover:bg-muted/50 flex cursor-pointer items-start space-x-3 rounded-lg border p-3 transition-colors"
          >
            <input
              v-model="localPremiumFeatures[feature.id as keyof PremiumFeatures]"
              type="checkbox"
              class="text-primary focus:ring-primary border-border mt-1 h-4 w-4 rounded"
            />
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h4 class="text-foreground text-sm font-medium">{{ feature.label }}</h4>
                <span class="text-primary text-sm font-semibold">+${{ feature.price }}</span>
              </div>
              <p class="text-muted-foreground mt-1 text-xs">{{ feature.description }}</p>
            </div>
          </label>

          <!-- Total Premium Cost -->
          <div v-if="totalPremiumCost > 0" class="bg-primary/10 mt-3 rounded-lg p-3">
            <div class="flex items-center justify-between">
              <span class="text-foreground text-sm font-medium">Total Premium Features:</span>
              <span class="text-primary font-bold">+${{ totalPremiumCost }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { getAvailablePremiumFeatures } from '@/composables/usePremiumFeatures'
import type { VoiceType } from '@/types/voice-talent'

interface TalentOptions {
  isPublic: boolean
  pickOwn: boolean
  selectedTalents: string[]
}

interface AISettings {
  voiceModel: string
  voiceStyle: string
  emotion: string
  speed: 'slow' | 'normal' | 'fast'
  pitch: 'low' | 'normal' | 'high'
}

interface PremiumFeatures {
  talentOutreach: boolean
  aiMatching: boolean
  autoPrompts: boolean
}

interface Requirements {
  language: string
  voiceType: VoiceType
  gender: 'male' | 'female' | 'non-binary' | 'any'
  ageRange?: string
  specialInstructions: string
  deliveryFormat: string
  deliveryTimeline: string
  revisionRounds: string
}

interface Props {
  talentOptions: TalentOptions
  aiSettings: AISettings
  premiumFeatures: PremiumFeatures
  voiceType?: 'talent_only' | 'ai_synthesis' | 'hybrid_approach'
  requirements?: Requirements
}

interface Emits {
  (e: 'update:talentOptions', value: TalentOptions): void
  (e: 'update:aiSettings', value: AISettings): void
  (e: 'update:premiumFeatures', value: PremiumFeatures): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localTalentOptions = ref<TalentOptions>({ ...props.talentOptions })
const localAISettings = ref<AISettings>({ ...props.aiSettings })
const localPremiumFeatures = ref<PremiumFeatures>({ ...props.premiumFeatures })

// Computed: Is visibility disabled for AI
const isVisibilityDisabled = computed(() => {
  return props.voiceType === 'ai_synthesis'
})

// Computed: Get available premium features based on voice type
const availablePremiumFeatures = computed(() => {
  if (!props.voiceType) return []
  return getAvailablePremiumFeatures(props.voiceType)
})

// Removed complex talent selection UI - keeping it simple
// Talent selection can be done after job creation if needed

// Premium features cost calculation using config
const totalPremiumCost = computed(() => {
  let cost = 0
  availablePremiumFeatures.value.forEach((feature) => {
    if (localPremiumFeatures.value[feature.id as keyof PremiumFeatures]) {
      cost += feature.price
    }
  })
  return cost
})

// Watch for voice type changes and disable/enable features accordingly
watch(
  () => props.voiceType,
  (newType) => {
    // Disable visibility for AI
    if (newType === 'ai_synthesis') {
      localTalentOptions.value.isPublic = false
    }

    // Disable premium features that aren't available for this approach
    availablePremiumFeatures.value.forEach((feature) => {
      const isAvailable = feature.availableFor.includes(newType || 'talent_only')
      if (!isAvailable) {
        localPremiumFeatures.value[feature.id as keyof PremiumFeatures] = false
      }
    })
  },
  { immediate: true },
)

// Watch for changes and emit updates
watch(
  localTalentOptions,
  (newValue) => {
    emit('update:talentOptions', newValue)
  },
  { deep: true },
)

watch(
  localAISettings,
  (newValue) => {
    emit('update:aiSettings', newValue)
  },
  { deep: true },
)

watch(
  localPremiumFeatures,
  (newValue) => {
    emit('update:premiumFeatures', newValue)
  },
  { deep: true },
)
</script>
