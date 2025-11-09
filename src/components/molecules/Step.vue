<template>
  <div v-if="isActive" class="onboarding-step">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, watch } from 'vue'

interface StepContext {
  currentStep: { value: number }
  totalSteps: { value: number }
  registerStep: (stepNumber: number) => void
  canProceed: { value: boolean }
  setStepValidation: (stepNumber: number, isValid: boolean) => void
}

interface Props {
  /** Step number (1-based) */
  step: number
  /** Whether this step is valid (for navigation) */
  valid?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  valid: true,
})

const emit = defineEmits<{
  (e: 'validation-change', isValid: boolean): void
}>()

const stepContext = inject<StepContext>('stepContainer')

if (!stepContext) {
  throw new Error('Step must be used within StepContainer')
}

// Create a computed that properly tracks the step context
// The stepContext.currentStep is a ComputedRef, we need to access its value
const currentStepValue = computed(() => {
  // Access the computed ref's value - Vue will track this
  const ref = stepContext.currentStep as { value: number }
  return ref.value
})

const isActive = computed(() => {
  const stepValue = currentStepValue.value
  return stepValue === props.step
})

// Register this step when mounted
onMounted(() => {
  stepContext.registerStep(props.step)
  stepContext.setStepValidation(props.step, props.valid)
  emit('validation-change', props.valid)
})

// Watch for validation changes
watch(
  () => props.valid,
  (isValid) => {
    stepContext.setStepValidation(props.step, isValid)
    emit('validation-change', isValid)
  },
)
</script>
