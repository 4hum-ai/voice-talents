<template>
  <div class="mx-auto max-w-full px-8">
    <!-- Header Section -->
    <div class="mb-12 text-center">
      <h1
        class="text-foreground from-foreground to-foreground/80 mb-4 bg-gradient-to-r bg-clip-text text-4xl font-bold"
      >
        Step 1: How Do You Want to Involve Voice Talent?
      </h1>
      <p class="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed">
        Choose how you want to work with voice talent - license with AI for instant delivery or
        professional service for personalized quality
      </p>
    </div>

    <!-- Cards Grid -->
    <div class="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
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
          class="relative flex h-full cursor-pointer flex-col overflow-visible rounded-2xl border-2 p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
          :class="
            localJobType === type.value
              ? 'border-primary from-primary/10 via-primary/5 shadow-primary/20 bg-gradient-to-br to-transparent shadow-xl'
              : 'border-border hover:border-primary/50 bg-card/50 hover:bg-card/80'
          "
        >
          <!-- Selection Indicator -->
          <div
            v-if="localJobType === type.value"
            class="bg-primary absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full"
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
            <p class="text-muted-foreground mb-4 leading-relaxed">{{ type.description }}</p>

            <!-- Benefits -->
            <div v-if="type.benefits" class="flex flex-wrap gap-2">
              <span
                v-for="benefit in type.benefits"
                :key="benefit"
                class="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium"
                :class="
                  localJobType === type.value
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted/50 text-muted-foreground'
                "
              >
                {{ benefit }}
              </span>
            </div>
          </div>

          <!-- Hover Effect Overlay -->
          <div
            class="from-primary/5 pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          ></div>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Icon from '@/components/atoms/Icon.vue'
import AccountIcon from '~icons/mdi/account'
import CopyrightIcon from '~icons/mdi/copyright'

interface Props {
  jobType?: 'talent_only' | 'ai_synthesis' | 'hybrid_approach'
}

interface Emits {
  (e: 'update:jobType', value: 'talent_only' | 'ai_synthesis' | 'hybrid_approach'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localJobType = ref<'talent_only' | 'ai_synthesis' | 'hybrid_approach' | undefined>(
  props.jobType || undefined,
)

// Voice Approach Types with enhanced descriptions and benefits
const jobTypes = [
  {
    value: 'talent_only',
    label: 'Professional Service',
    description: 'Work directly with skilled voice actors for authentic, personalized performances',
    icon: AccountIcon,
    benefits: [
      'High Quality',
      'Emotional Depth',
      'Personalized Performance',
      'Creative Collaboration',
    ],
  },
  {
    value: 'ai_synthesis',
    label: 'Licensed AI Voice',
    description:
      'License AI voices trained on licensed talent voices, ensuring fair compensation for creators',
    icon: CopyrightIcon,
    benefits: ['Instant Creation', '24/7 Availability', 'Cost Effective', 'Consistent Quality'],
  },
]

// Emit updates when selection changes (only if a value is selected)
watch(localJobType, (newValue) => {
  if (newValue && (newValue === 'talent_only' || newValue === 'ai_synthesis')) {
    emit('update:jobType', newValue)
  }
})
</script>
