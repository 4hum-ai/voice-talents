<template>
  <div class="mx-auto max-w-3xl">
    <div class="mb-8 text-center">
      <h1 class="text-foreground mb-4 text-3xl font-bold">Step 3: Talent Selection</h1>
      <p class="text-muted-foreground text-lg">
        Choose how you want to select {{ getVoiceTypeLabel() }} talent
      </p>
    </div>

    <div class="space-y-6">
      <!-- Public Listing Option -->
      <div class="bg-card border-border rounded-lg border p-6">
        <h3 class="text-foreground mb-4 text-lg font-semibold">Project Visibility</h3>

        <label
          class="border-border hover:bg-muted/50 flex cursor-pointer items-start space-x-3 rounded-lg border p-4 transition-colors"
        >
          <input
            v-model="localTalentOptions.isPublic"
            type="checkbox"
            class="text-primary focus:ring-primary border-border mt-1 h-4 w-4 rounded"
          />
          <div class="flex-1">
            <div class="flex items-center space-x-3">
              <div
                class="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg"
              >
                <Icon name="mdi:account-group" class="h-5 w-5" />
              </div>
              <div>
                <h4 class="text-foreground font-medium">Public Listing</h4>
                <p class="text-muted-foreground text-sm">Open to all talent</p>
              </div>
            </div>
            <p class="text-muted-foreground mt-2 text-sm">
              Post publicly and let talent apply to your project. Uncheck for private invitation
              only.
            </p>
          </div>
        </label>
      </div>

      <!-- Pick Your Own Talent -->
      <div class="bg-card border-border rounded-lg border p-6">
        <h3 class="text-foreground mb-4 text-lg font-semibold">Select Specific Talent</h3>

        <label
          class="border-border hover:bg-muted/50 mb-4 flex cursor-pointer items-start space-x-3 rounded-lg border p-4 transition-colors"
        >
          <input
            v-model="localTalentOptions.pickOwn"
            type="checkbox"
            class="text-primary focus:ring-primary border-border mt-1 h-4 w-4 rounded"
          />
          <div class="flex-1">
            <div class="flex items-center space-x-3">
              <div
                class="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg"
              >
                <Icon name="mdi:account-search" class="h-5 w-5" />
              </div>
              <div>
                <h4 class="text-foreground font-medium">Pick Your Own</h4>
                <p class="text-muted-foreground text-sm">Invite specific talent to bid</p>
              </div>
            </div>
            <p class="text-muted-foreground mt-2 text-sm">
              Select specific voice actors from our talent pool to invite for bidding
            </p>
          </div>
        </label>

        <!-- Talent Selection List -->
        <div v-if="localTalentOptions.pickOwn" class="mt-4">
          <h4 class="text-md text-foreground mb-4 font-medium">Available Talents</h4>
          <div class="grid max-h-96 grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2">
            <div
              v-for="talent in mockTalentList"
              :key="talent.id"
              class="border-border hover:bg-muted/30 flex items-center space-x-3 rounded-lg border p-3 transition-colors"
            >
              <input
                :id="`talent-${talent.id}`"
                v-model="localTalentOptions.selectedTalents"
                type="checkbox"
                :value="talent.id"
                class="text-primary focus:ring-primary border-border h-4 w-4 rounded"
              />
              <label :for="`talent-${talent.id}`" class="flex-1 cursor-pointer">
                <div class="flex items-center space-x-3">
                  <div
                    class="from-primary/20 to-primary/10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br"
                  >
                    <span class="text-primary text-sm font-medium">{{
                      talent.name.charAt(0)
                    }}</span>
                  </div>
                  <div class="flex-1">
                    <h5 class="text-foreground font-medium">{{ talent.name }}</h5>
                    <p class="text-muted-foreground text-sm">{{ talent.specialty }}</p>
                    <div class="mt-1 flex items-center space-x-2">
                      <div class="flex items-center space-x-1">
                        <IconMdiStar class="h-4 w-4 text-yellow-500" />
                        <span class="text-muted-foreground text-xs">{{ talent.rating }}</span>
                      </div>
                      <span class="text-muted-foreground text-xs">•</span>
                      <span class="text-muted-foreground text-xs"
                        >{{ talent.projects }} projects</span
                      >
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div
            v-if="localTalentOptions.selectedTalents.length > 0"
            class="bg-primary/10 mt-4 rounded-lg p-3"
          >
            <p class="text-primary text-sm font-medium">
              {{ localTalentOptions.selectedTalents.length }} talent(s) selected for invitation
            </p>
          </div>
        </div>
      </div>

      <!-- Premium Features -->
      <div class="bg-card border-border rounded-lg border p-6">
        <h3 class="text-foreground mb-4 text-lg font-semibold">Premium Features</h3>

        <div class="space-y-4">
          <!-- Talent Outreach -->
          <label
            class="border-border hover:bg-muted/50 flex cursor-pointer items-start space-x-3 rounded-lg border p-4 transition-colors"
          >
            <input
              v-model="localPremiumFeatures.talentOutreach"
              type="checkbox"
              class="text-primary focus:ring-primary border-border mt-1 h-4 w-4 rounded"
            />
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h4 class="text-foreground font-medium">Talent Outreach</h4>
                <span class="text-primary text-sm font-semibold">+$25</span>
              </div>
              <p class="text-muted-foreground mt-1 text-sm">
                Our casting manager will reach out to top talent on your behalf and handle initial
                negotiations
              </p>
            </div>
          </label>

          <!-- AI Matching -->
          <label
            class="border-border hover:bg-muted/50 flex cursor-pointer items-start space-x-3 rounded-lg border p-4 transition-colors"
          >
            <input
              v-model="localPremiumFeatures.aiMatching"
              type="checkbox"
              class="text-primary focus:ring-primary border-border mt-1 h-4 w-4 rounded"
            />
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h4 class="text-foreground font-medium">AI Matching</h4>
                <span class="text-primary text-sm font-semibold">+$15</span>
              </div>
              <p class="text-muted-foreground mt-1 text-sm">
                Use AI to automatically match your project with the most suitable talent based on
                voice characteristics and experience
              </p>
            </div>
          </label>

          <!-- Auto Prompts -->
          <label
            v-if="voiceType === 'ai_synthesis' || voiceType === 'hybrid_approach'"
            class="border-border hover:bg-muted/50 flex cursor-pointer items-start space-x-3 rounded-lg border p-4 transition-colors"
          >
            <input
              v-model="localPremiumFeatures.autoPrompts"
              type="checkbox"
              class="text-primary focus:ring-primary border-border mt-1 h-4 w-4 rounded"
            />
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h4 class="text-foreground font-medium">Auto Prompts</h4>
                <span class="text-primary text-sm font-semibold">+$10</span>
              </div>
              <p class="text-muted-foreground mt-1 text-sm">
                Automatically generate optimized prompts and tags for your transcripts to improve AI
                voice generation quality
              </p>
            </div>
          </label>
        </div>

        <!-- Total Premium Cost -->
        <div v-if="totalPremiumCost > 0" class="bg-primary/10 mt-4 rounded-lg p-3">
          <div class="flex items-center justify-between">
            <span class="text-foreground text-sm font-medium">Total Premium Features:</span>
            <span class="text-primary text-lg font-bold">+${{ totalPremiumCost }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-between">
      <Button variant="outline" size="lg" @click="emit('previous')">
        <IconMdiArrowLeft class="mr-2 h-4 w-4" />
        Previous
      </Button>
      <Button variant="primary" size="lg" @click="emit('next')">
        Continue
        <IconMdiArrowRight class="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Button from '@/components/atoms/Button.vue'
import IconMdiStar from '~icons/mdi/star'
import IconMdiArrowLeft from '~icons/mdi/arrow-left'
import IconMdiArrowRight from '~icons/mdi/arrow-right'

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

interface Props {
  talentOptions: TalentOptions
  aiSettings: AISettings
  premiumFeatures: PremiumFeatures
  voiceType?: 'talent_only' | 'ai_synthesis' | 'hybrid_approach'
}

interface Emits {
  (e: 'update:talentOptions', value: TalentOptions): void
  (e: 'update:aiSettings', value: AISettings): void
  (e: 'update:premiumFeatures', value: PremiumFeatures): void
  (e: 'next'): void
  (e: 'previous'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localTalentOptions = ref<TalentOptions>({ ...props.talentOptions })
const localAISettings = ref<AISettings>({ ...props.aiSettings })
const localPremiumFeatures = ref<PremiumFeatures>({ ...props.premiumFeatures })

// Options

// Mock talent list
const mockTalentList = [
  {
    id: 'talent-1',
    name: 'Sarah Johnson',
    specialty: 'Commercial Voice-Over',
    rating: '4.9',
    projects: 156,
  },
  {
    id: 'talent-2',
    name: 'Michael Chen',
    specialty: 'Character Voice',
    rating: '4.8',
    projects: 89,
  },
  {
    id: 'talent-3',
    name: 'Emma Rodriguez',
    specialty: 'Audiobook Narration',
    rating: '4.9',
    projects: 203,
  },
  {
    id: 'talent-4',
    name: 'David Thompson',
    specialty: 'Animation Voice',
    rating: '4.7',
    projects: 67,
  },
  {
    id: 'talent-5',
    name: 'Lisa Park',
    specialty: 'E-Learning Narration',
    rating: '4.8',
    projects: 134,
  },
  {
    id: 'talent-6',
    name: 'James Wilson',
    specialty: 'Podcast Voice',
    rating: '4.6',
    projects: 92,
  },
  {
    id: 'talent-7',
    name: 'Maria Garcia',
    specialty: 'Video Game Voice',
    rating: '4.9',
    projects: 78,
  },
  {
    id: 'talent-8',
    name: 'Alex Kim',
    specialty: 'Presentation Voice',
    rating: '4.7',
    projects: 145,
  },
  {
    id: 'talent-9',
    name: 'Rachel Brown',
    specialty: 'Phone System Voice',
    rating: '4.8',
    projects: 112,
  },
  {
    id: 'talent-10',
    name: 'Tom Anderson',
    specialty: 'Storytelling Voice',
    rating: '4.9',
    projects: 98,
  },
]

// Voice type label helper
const getVoiceTypeLabel = () => {
  switch (props.voiceType) {
    case 'talent_only':
      return 'voice acting'
    case 'ai_synthesis':
      return 'AI voice'
    case 'hybrid_approach':
      return 'hybrid voice'
    default:
      return 'voice'
  }
}

// Premium features cost calculation
const totalPremiumCost = computed(() => {
  let cost = 0
  if (localPremiumFeatures.value.talentOutreach) cost += 25
  if (localPremiumFeatures.value.aiMatching) cost += 15
  if (localPremiumFeatures.value.autoPrompts) cost += 10
  return cost
})

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
