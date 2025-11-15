<template>
  <div class="bg-background fixed inset-0 z-50 overflow-hidden">
    <!-- Navigation Bar - Mobile: Bottom, Desktop: Top -->
    <div
      class="border-border bg-card/95 fixed right-0 bottom-0 left-0 z-10 border-t backdrop-blur-sm sm:top-0 sm:bottom-auto sm:border-t-0 sm:border-b"
    >
      <!-- Mobile Layout: Single-row compact bottom navigation -->
      <div class="flex items-center gap-2 px-3 py-2.5 sm:hidden">
        <!-- Close Button (icon only) - Far left -->
        <Button
          variant="ghost"
          size="xs"
          class="text-muted-foreground hover:text-foreground h-9 w-9 flex-shrink-0 p-0"
          @click="$emit('close')"
        >
          <Icon name="mdi:close" class="h-4 w-4" />
        </Button>

        <!-- Previous Button (icon only on mobile) -->
        <Button
          v-if="currentStep > 1"
          variant="outline"
          size="sm"
          class="h-9 w-9 flex-shrink-0 p-0"
          @click="goToPrevious"
        >
          <Icon name="mdi:chevron-left" class="h-5 w-5" />
        </Button>
        <div v-else class="w-9 flex-shrink-0" />

        <!-- Progress Bar (compact) -->
        <div class="flex min-w-0 flex-1 items-center gap-1.5">
          <div class="text-muted-foreground text-[10px] font-medium">
            {{ currentStep }}/{{ totalSteps }}
          </div>
          <div class="min-w-0 flex-1">
            <div class="bg-muted h-1.5 w-full rounded-full">
              <div
                class="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
                :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
              />
            </div>
          </div>
        </div>

        <!-- Next/Complete Button (compact) -->
        <Button
          v-if="currentStep < totalSteps"
          variant="primary"
          size="sm"
          class="h-9 flex-shrink-0 px-3"
          :disabled="!canProceed"
          @click="goToNext"
        >
          <span class="text-xs font-medium">Next</span>
          <Icon name="mdi:chevron-right" class="ml-1 h-4 w-4" />
        </Button>
        <Button
          v-else
          variant="primary"
          size="sm"
          class="h-9 flex-shrink-0 px-3"
          :disabled="completeButtonDisabled"
          @click="$emit('complete')"
        >
          <Icon name="mdi:rocket-launch" class="h-4 w-4" />
          <span class="ml-1 text-xs font-medium">{{ completeButtonText }}</span>
        </Button>
      </div>

      <!-- Desktop Layout: Full top navigation -->
      <div class="hidden items-center justify-between px-6 py-4 sm:flex">
        <!-- Left: Previous Button -->
        <Button v-if="currentStep > 1" variant="outline" size="md" @click="goToPrevious">
          <div class="flex items-center gap-2">
            <Icon name="mdi:chevron-left" class="h-4 w-4" />
            <span>Previous</span>
          </div>
        </Button>
        <div v-else class="w-20" />

        <!-- Center: Progress -->
        <div class="flex-none">
          <div class="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <div class="text-muted-foreground text-center text-xs sm:text-left sm:text-sm">
              Step {{ currentStep }} of {{ totalSteps }}
            </div>
            <div class="bg-muted h-2 w-full max-w-32 rounded-full sm:w-32">
              <div
                class="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
                :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
                role="progressbar"
                :aria-valuenow="currentStep"
                :aria-valuemin="1"
                :aria-valuemax="totalSteps"
                :aria-label="`Step ${currentStep} of ${totalSteps}`"
              />
            </div>
            <div class="text-muted-foreground hidden text-sm sm:block">
              {{ Math.round((currentStep / totalSteps) * 100) }}%
            </div>
          </div>
        </div>

        <!-- Right: Close and Next/Complete -->
        <div class="flex items-center space-x-3">
          <!-- Custom header slot for extra content (e.g., auto-save indicator) -->
          <slot name="header-extra" />
          <Button
            v-if="currentStep < totalSteps"
            variant="primary"
            size="md"
            :disabled="!canProceed"
            @click="goToNext"
          >
            <span>Next</span>
            <Icon name="mdi:chevron-right" class="ml-2 h-4 w-4" />
          </Button>
          <Button
            v-else
            variant="primary"
            size="md"
            :disabled="completeButtonDisabled"
            @click="$emit('complete')"
          >
            <span>{{ completeButtonText }}</span>
            <Icon name="mdi:rocket-launch" class="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            class="text-muted-foreground hover:text-foreground"
            @click="$emit('close')"
          >
            <Icon name="mdi:close" class="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Main Content - Mobile: padding-bottom for bottom nav, Desktop: padding-top for top nav -->
    <div class="h-full overflow-y-auto pt-4 pb-16 sm:pt-20 sm:pb-0">
      <div class="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-8">
        <!-- Step Content -->
        <div class="space-y-6 sm:space-y-8">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'

interface StepContext {
  currentStep: { value: number }
  totalSteps: { value: number }
  registerStep: (stepNumber: number) => void
  canProceed: { value: boolean }
  setStepValidation: (stepNumber: number, isValid: boolean) => void
}

interface Props {
  /** Current step number (1-based) */
  modelValue?: number
  /** Total number of steps */
  totalSteps?: number
  /** Whether current step can proceed */
  canProceed?: boolean
  /** Custom text for complete button (default: "Get Started") */
  completeButtonText?: string
  /** Whether complete button is disabled */
  completeButtonDisabled?: boolean
  /** Query parameter name for step (default: "step") */
  stepQueryParam?: string
  /** Whether to sync step with query params (default: true) */
  syncWithQuery?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canProceed: true,
  completeButtonText: 'Get Started',
  completeButtonDisabled: false,
  stepQueryParam: 'step',
  syncWithQuery: true,
})

const route = useRoute()
const router = useRouter()

const emit = defineEmits<{
  (e: 'update:modelValue', step: number): void
  (e: 'next'): void
  (e: 'previous'): void
  (e: 'complete'): void
  (e: 'close'): void
}>()

// Step management
const getInitialStep = (): number => {
  // Priority: 1. Query param, 2. Prop, 3. Default to 1
  if (props.syncWithQuery) {
    const queryStep = route.query[props.stepQueryParam]
    if (queryStep) {
      const step = parseInt(String(queryStep), 10)
      if (!isNaN(step) && step >= 1) {
        return step
      }
    }
  }
  return props.modelValue || 1
}

const internalCurrentStep = ref(getInitialStep())
const internalTotalSteps = ref(props.totalSteps || 1)
const stepValidation = ref<Record<number, boolean>>({})
const canProceedInternal = ref(props.canProceed)

// Computed current step (use prop if provided, otherwise internal state)
const currentStep = computed(() => props.modelValue ?? internalCurrentStep.value)

// Update query param when step changes
const updateQueryParam = (step: number) => {
  if (props.syncWithQuery) {
    router.replace({
      query: {
        ...route.query, // Preserve all existing query params including 'modal'
        [props.stepQueryParam]: step.toString(),
      },
    })
  }
}
const totalSteps = computed(() => props.totalSteps ?? internalTotalSteps.value)
const canProceed = computed(() => {
  // Check if prop is provided, otherwise use internal validation
  if (props.canProceed !== undefined && props.canProceed !== true) {
    return props.canProceed
  }
  return stepValidation.value[currentStep.value] ?? canProceedInternal.value
})

// Watch for prop changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== undefined) {
      internalCurrentStep.value = newValue
    }
  },
)

watch(
  () => props.totalSteps,
  (newValue) => {
    if (newValue !== undefined) {
      internalTotalSteps.value = newValue
    }
  },
)

watch(
  () => props.canProceed,
  (newValue) => {
    if (newValue !== undefined) {
      canProceedInternal.value = newValue
    }
  },
)

// Step registration and management
const registerStep = (stepNumber: number) => {
  if (stepNumber > internalTotalSteps.value) {
    internalTotalSteps.value = stepNumber
  }
}

const setStepValidation = (stepNumber: number, isValid: boolean) => {
  stepValidation.value[stepNumber] = isValid
}

const goToNext = () => {
  if (currentStep.value < totalSteps.value && canProceed.value) {
    const nextStep = currentStep.value + 1
    internalCurrentStep.value = nextStep
    updateQueryParam(nextStep)
    emit('update:modelValue', nextStep)
    emit('next')
  }
}

const goToPrevious = () => {
  if (currentStep.value > 1) {
    const prevStep = currentStep.value - 1
    internalCurrentStep.value = prevStep
    updateQueryParam(prevStep)
    emit('update:modelValue', prevStep)
    emit('previous')
  }
}

// Watch for query param changes (e.g., browser back/forward)
watch(
  () => route.query[props.stepQueryParam],
  (queryStep) => {
    if (props.syncWithQuery && queryStep) {
      const step = parseInt(String(queryStep), 10)
      if (!isNaN(step) && step >= 1 && step !== currentStep.value) {
        internalCurrentStep.value = step
        emit('update:modelValue', step)
      }
    }
  },
)

// Initialize from query param on mount
onMounted(() => {
  if (props.syncWithQuery) {
    const queryStep = route.query[props.stepQueryParam]
    if (queryStep) {
      const step = parseInt(String(queryStep), 10)
      if (!isNaN(step) && step >= 1) {
        internalCurrentStep.value = step
        emit('update:modelValue', step)
      }
    } else {
      // Set initial step in query if not present, preserving ALL existing query params (including 'modal')
      // Use nextTick to ensure any pending route updates are applied first
      nextTick(() => {
        updateQueryParam(internalCurrentStep.value)
      })
    }
  }
})

// Provide context to child Step components
// Use computed refs wrapped in objects for reactivity
provide<StepContext>('stepContainer', {
  currentStep: computed(() => currentStep.value),
  totalSteps: computed(() => totalSteps.value),
  registerStep,
  canProceed: computed(() => canProceed.value),
  setStepValidation,
})
</script>
