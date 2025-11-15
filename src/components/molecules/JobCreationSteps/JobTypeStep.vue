<template>
  <div class="mx-auto max-w-4xl px-4 sm:px-6">
    <!-- Header Section -->
    <div class="mb-8 text-center sm:mb-12">
      <h1 class="text-foreground mb-3 text-2xl font-bold sm:text-3xl">
        How Do You Want to Involve Voice Talent?
      </h1>
      <p class="text-muted-foreground mx-auto max-w-xl text-base leading-relaxed sm:text-lg">
        Choose how you want to work with voice talent
      </p>
    </div>

    <!-- Cards Grid -->
    <div class="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
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
          class="relative flex h-full cursor-pointer flex-col rounded-lg border-2 p-6 transition-all duration-200 sm:p-8"
          :class="
            localJobType === type.value
              ? 'border-primary bg-primary/5 shadow-md'
              : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
          "
        >
          <!-- Selection Indicator -->
          <div
            v-if="localJobType === type.value"
            class="bg-primary absolute -top-2 -right-2 z-10 flex h-5 w-5 items-center justify-center rounded-full sm:h-6 sm:w-6"
          >
            <Icon name="mdi:check" class="h-4 w-4 text-white sm:h-5 sm:w-5" />
          </div>

          <!-- Icon Container -->
          <div class="mb-4 sm:mb-6">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-lg transition-colors sm:h-14 sm:w-14"
              :class="
                localJobType === type.value
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
              "
            >
              <component :is="type.icon" class="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
          </div>

          <!-- Title and Description -->
          <div>
            <h3 class="text-foreground mb-2 text-xl font-bold sm:text-2xl">{{ type.label }}</h3>
            <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
              {{ type.description }}
            </p>
          </div>
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

// Voice Approach Types - simplified
const jobTypes = [
  {
    value: 'talent_only',
    label: 'Professional Service',
    description: 'Work directly with skilled voice actors for authentic, personalized performances',
    icon: AccountIcon,
  },
  {
    value: 'ai_synthesis',
    label: 'Licensed AI Voice',
    description:
      'License AI voices trained on licensed talent voices, ensuring fair compensation for creators',
    icon: CopyrightIcon,
  },
]

// Track if we're syncing from props to avoid emitting during sync
const isSyncingFromProps = ref(false)

// Sync localJobType when prop changes (e.g., when loading from localStorage)
watch(
  () => props.jobType,
  (newValue) => {
    if (newValue !== localJobType.value) {
      isSyncingFromProps.value = true
      localJobType.value = newValue || undefined
      // Reset flag after next tick to allow reactive updates
      setTimeout(() => {
        isSyncingFromProps.value = false
      }, 0)
    }
  },
  { immediate: true },
)

// Emit updates when selection changes (only if a value is selected and not syncing from props)
watch(localJobType, (newValue) => {
  if (
    !isSyncingFromProps.value &&
    newValue &&
    (newValue === 'talent_only' || newValue === 'ai_synthesis')
  ) {
    emit('update:jobType', newValue)
  }
})
</script>
