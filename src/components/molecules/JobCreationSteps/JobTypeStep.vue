<template>
  <div class="mx-auto max-w-full px-8">
    <!-- Header Section -->
    <div class="mb-12 text-center">
      <h1
        class="text-foreground from-foreground to-foreground/80 mb-4 bg-gradient-to-r bg-clip-text text-4xl font-bold"
      >
        Step 1: Choose Your Voice Approach
      </h1>
      <p class="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed">
        Select the perfect approach for your voice content creation needs
      </p>
    </div>

    <!-- Cards Grid -->
    <div class="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div v-for="type in jobTypes" :key="type.value" class="group relative">
        <input
          :id="type.value"
          v-model="localJobType"
          type="radio"
          :value="type.value"
          class="sr-only"
        />
        <label
          :for="type.value"
          class="relative flex h-full cursor-pointer flex-col rounded-2xl border-2 p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl overflow-visible"
          :class="
            localJobType === type.value
              ? 'border-primary from-primary/10 via-primary/5 shadow-primary/20 bg-gradient-to-br to-transparent shadow-xl'
              : 'border-border hover:border-primary/50 bg-card/50 hover:bg-card/80'
          "
        >
          <!-- Selection Indicator -->
          <div
            v-if="localJobType === type.value"
            class="bg-primary absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full z-10"
          >
            <Icon name="mdi:check" class="h-5 w-5 text-white" />
          </div>

          <!-- Icon Container -->
          <div class="mb-6">
            <div
              class="flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300"
              :class="
                localJobType === type.value
                  ? 'from-primary to-primary/80 shadow-primary/30 bg-gradient-to-br text-white shadow-lg'
                  : 'from-muted to-muted/80 text-muted-foreground group-hover:from-primary/20 group-hover:to-primary/10 group-hover:text-primary bg-gradient-to-br'
              "
            >
              <component :is="type.icon" class="h-8 w-8" />
            </div>
          </div>

          <!-- Title and Description -->
          <div class="mb-6">
            <h3 class="text-foreground mb-3 text-2xl font-bold">{{ type.label }}</h3>
            <p class="text-muted-foreground leading-relaxed">{{ type.description }}</p>
          </div>

          <!-- Pricing -->
          <div class="border-border/50 mt-auto border-t pt-6">
            <div>
              <span class="text-muted-foreground text-sm font-medium">Starting from</span>
              <div class="text-foreground text-2xl font-bold">{{ type.pricing }}</div>
              <div v-if="type.value === 'ai_synthesis'" class="mt-2">
                <div class="text-xs font-medium text-green-600">✓ Includes talent fees</div>
              </div>
            </div>
          </div>

          <!-- Hover Effect Overlay -->
          <div
            class="from-primary/5 pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          ></div>
        </label>
      </div>
    </div>

    <!-- Continue Button -->
    <div class="flex justify-center">
      <Button
        variant="primary"
        size="lg"
        @click="handleNext"
        :disabled="!localJobType"
        class="rounded-xl px-12 py-4 text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
      >
        Continue to Next Step
        <Icon name="mdi:arrow-right" class="ml-2 h-5 w-5" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import AccountIcon from '~icons/mdi/account'
import RobotIcon from '~icons/mdi/robot'
import AccountGroupIcon from '~icons/mdi/account-group'

interface Props {
  jobType: 'talent_only' | 'ai_synthesis' | 'hybrid_approach'
}

interface Emits {
  (e: 'update:jobType', value: 'talent_only' | 'ai_synthesis' | 'hybrid_approach'): void
  (e: 'next'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localJobType = ref(props.jobType || 'hybrid_approach')

// Voice Approach Types with enhanced descriptions and features
const jobTypes = [
  {
    value: 'talent_only',
    label: 'Professional Talent',
    description:
      'Work directly with skilled voice actors for authentic, personalized performances that bring your content to life',
    icon: AccountIcon,
    pricing: '$15/hr',
  },
  {
    value: 'hybrid_approach',
    label: 'Hybrid Approach',
    description:
      'Combine AI efficiency with human expertise for the perfect balance of speed, quality, and cost-effectiveness',
    icon: AccountGroupIcon,
    pricing: '$10/hr',
  },
  {
    value: 'ai_synthesis',
    label: 'AI Voice',
    description:
      'Leverage cutting-edge AI technology powered by licensed talent voices, ensuring creators are fairly compensated',
    icon: RobotIcon,
    pricing: '$5/hr',
  },
]

const handleNext = () => {
  if (localJobType.value) {
    // Ensure the selection is emitted before proceeding
    emit('update:jobType', localJobType.value)
    emit('next')
  }
}

// Note: We only emit updates when Continue is clicked, not on selection change
</script>
