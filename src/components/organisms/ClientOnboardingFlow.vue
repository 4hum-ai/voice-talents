<template>
  <StepContainer
    v-if="showOnboarding"
    v-model="currentStep"
    :total-steps="totalSteps"
    :can-proceed="canProceedToNext"
    @next="nextStep"
    @previous="previousStep"
    @complete="completeOnboarding"
    @close="closeOnboarding"
  >
    <!-- Step 1: About Your Company -->
    <Step :step="1" :valid="form.isStepValid.value">
      <AccountInformation
        :model-value="{
          companyName: form.getField('companyName') || '',
          website: form.getField('website') || '',
          description: form.getField('description') || '',
          contactName: '',
          email: '',
          phone: '',
          location: '',
          timezone: '',
          industry: '',
          companySize: 'small',
        }"
        :required-fields="['companyName']"
        mode="company"
        @update:modelValue="
          (data) => {
            form.setField('companyName', data.companyName)
            form.setField('website', data.website)
            form.setField('description', data.description)
          }
        "
      />
    </Step>

    <!-- Step 2: About You -->
    <Step :step="2" :valid="form.isStepValid.value">
      <AccountInformation
        :model-value="{
          contactName: form.getField('contactName') || '',
          email: form.getField('email') || '',
          phone: form.getField('phone') || '',
          companyName: '',
          website: '',
          location: '',
          timezone: '',
          industry: '',
          companySize: 'small',
          description: '',
        }"
        :required-fields="['contactName', 'email']"
        mode="personal"
        @update:modelValue="
          (data) => {
            form.setField('contactName', data.contactName)
            form.setField('email', data.email)
            form.setField('phone', data.phone)
          }
        "
      />
    </Step>

    <!-- Step 3: Project Types -->
    <Step :step="3" :valid="form.isStepValid.value">
      <ClientProjectTypesStep
        :model-value="(form.getField('projectTypes') as string[]) || []"
        @update:model-value="(types) => form.setField('projectTypes', types)"
      />
    </Step>

    <!-- Step 4: Agreement & Legal Requirements (Final Step) -->
    <Step :step="4" :valid="form.isStepValid.value">
      <ClientAgreementStep
        :model-value="{
          acceptedTerms: form.getField('acceptedTerms') || false,
        }"
        @update:model-value="(data) => form.setField('acceptedTerms', data.acceptedTerms)"
      />
    </Step>
  </StepContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboarding } from '@/composables/useOnboarding'
import { useJobType } from '@/composables/useJobType'
import { useForm, type FormDefinition } from '@/lib/form'
import StepContainer from '@/components/molecules/StepContainer.vue'
import Step from '@/components/molecules/Step.vue'
import {
  AccountInformation,
  ClientAgreementStep,
  ClientProjectTypesStep,
} from '@/components/molecules/ClientSettings'

const router = useRouter()
const {
  shouldShowOnboarding,
  currentMode,
  isClientMode,
  setOnboardingSteps,
  updateOnboardingStep,
  completeCurrentOnboarding,
} = useOnboarding()

const { availableJobTypes } = useJobType()

// Create form definition - update when job types are available
const createFormDefinition = (): FormDefinition => {
  const projectTypeOptions = availableJobTypes.value.map((type) => ({
    value: type.value,
    label: type.label,
  }))

  return {
    id: 'client-onboarding',
    persistToStorage: true,
    initialStep: 1,
    steps: [
      {
        step: 1,
        title: 'About Your Company',
        description: 'Tell us about your company so we can help you find the perfect voice talent',
        fields: [
          {
            name: 'companyName',
            type: 'text',
            label: "What's your company name?",
            placeholder: 'Your Company Name',
            required: true,
            validation: [
              { type: 'required', message: 'Company name is required' },
              {
                type: 'minLength',
                value: 2,
                message: 'Company name must be at least 2 characters',
              },
            ],
          },
          {
            name: 'website',
            type: 'url',
            label: 'Website',
            placeholder: 'https://yourcompany.com',
            validation: [{ type: 'url', message: 'Please enter a valid URL' }],
          },
          {
            name: 'description',
            type: 'textarea',
            label: 'Tell us about your company',
            placeholder: 'Brief description of your company and what you do...',
            validation: [
              {
                type: 'maxLength',
                value: 1000,
                message: 'Description must be no more than 1000 characters',
              },
            ],
          },
        ],
      },
      {
        step: 2,
        title: 'About You',
        description: 'Let us know how to reach you and who you are',
        fields: [
          {
            name: 'contactName',
            type: 'text',
            label: 'What should we call you?',
            placeholder: 'Your Full Name',
            required: true,
            validation: [
              { type: 'required', message: 'Contact name is required' },
              { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' },
            ],
          },
          {
            name: 'email',
            type: 'email',
            label: "What's your email address?",
            placeholder: 'your@email.com',
            required: true,
            validation: [
              { type: 'required', message: 'Email is required' },
              { type: 'email', message: 'Please enter a valid email address' },
            ],
          },
          {
            name: 'phone',
            type: 'tel',
            label: 'Phone Number',
            placeholder: '+1 (555) 123-4567',
          },
        ],
      },
      {
        step: 3,
        title: 'Project Types',
        description: 'Select the types of voice projects you typically create',
        fields: [
          {
            name: 'projectTypes',
            type: 'multiselect',
            label: 'What Types of Voice Work Do You Need?',
            required: true,
            options: projectTypeOptions,
            validation: [
              {
                type: 'custom',
                validator: (value) => {
                  if (!Array.isArray(value) || value.length === 0) {
                    return 'Please select at least one project type'
                  }
                  return true
                },
              },
            ],
          },
        ],
      },
      {
        step: 4,
        title: 'Agreement & Legal Requirements',
        description: 'Please review and confirm the following to complete your account setup',
        fields: [
          {
            name: 'acceptedTerms',
            type: 'checkbox',
            label: 'I have read and agree to the Terms of Service and Privacy Policy',
            required: true,
            validation: [
              {
                type: 'custom',
                validator: (value) => {
                  if (value !== true) {
                    return 'You must accept the terms and conditions to continue'
                  }
                  return true
                },
              },
            ],
          },
        ],
      },
    ],
  }
}

// Initialize form with definition
const form = useForm({
  definition: createFormDefinition(),
  persistToStorage: true,
})

// Sync form.currentStep with StepContainer
const currentStep = computed({
  get: () => form.currentStep.value,
  set: (value: number) => form.goToStep(value),
})

const totalSteps = computed(() => form.totalSteps.value)
const showOnboarding = ref(false)

// Computed - use form's built-in validation
const canProceedToNext = computed(() => form.isStepValid.value)

// Methods
const nextStep = () => {
  if (form.nextStep()) {
    updateOnboardingStep(form.currentStep.value)
  }
}

const previousStep = () => {
  if (form.previousStep()) {
    updateOnboardingStep(form.currentStep.value)
  }
}

const completeOnboarding = () => {
  // Get form data
  const formData = form.getFormData()

  // Update legacy data for compatibility
  const onboardingData = {
    companyName: formData.companyName || '',
    contactName: formData.contactName || '',
    email: formData.email || '',
    industry: '',
    autoApprove: false,
    requireNDA: false,
    requirePortfolio: true,
    projectTypes: (formData.projectTypes as string[]) || [],
  }

  // Save onboarding data
  completeCurrentOnboarding(onboardingData)

  // Clear form storage
  form.clear()

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
    setOnboardingSteps(form.currentStep.value, form.totalSteps.value)
  }
})

// Watch for mode changes
watch(
  () => currentMode.value,
  (newMode) => {
    if (newMode === 'client' && shouldShowOnboarding.value) {
      showOnboarding.value = true
      setOnboardingSteps(form.currentStep.value, form.totalSteps.value)
    } else {
      showOnboarding.value = false
    }
  },
)
</script>
