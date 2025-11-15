/**
 * Form Definition for Talent Onboarding Flow
 * Declarative form schema for talent profile setup
 */

import type { FormDefinition } from '@/lib/form'
import { useJobType } from '@/composables/useJobType'

/**
 * Generate talent onboarding form definition
 * Options are generated dynamically from composables
 */
export function createTalentOnboardingFormDefinition(): FormDefinition {
  const { availableJobTypes } = useJobType()

  // Convert job types to options format for voice types
  const voiceTypeOptions = availableJobTypes.value.map((type) => ({
    value: type.value,
    label: type.label,
  }))

  // Language options
  const languageOptions = [
    { value: 'English', label: 'English' },
    { value: 'Vietnamese', label: 'Vietnamese' },
    { value: 'German', label: 'German' },
  ]

  return {
    id: 'talent-onboarding',
    persistToStorage: true,
    excludeFromStorage: ['voiceSamples'], // Files can't be serialized
    initialStep: 1,
    steps: [
      {
        step: 1,
        title: 'Welcome',
        description: 'Welcome to VoiceTalents!',
        fields: [], // No fields, just content
      },
      {
        step: 2,
        title: 'Basic Info',
        description: "Let's get to know you",
        fields: [
          {
            name: 'displayName',
            type: 'text',
            label: 'What should we call you?',
            placeholder: 'Your professional name',
            required: true,
            validation: [
              { type: 'required', message: 'Display name is required' },
              { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' },
            ],
          },
          {
            name: 'location',
            type: 'text',
            label: 'Where do you call home?',
            placeholder: 'City, Country',
            required: true,
            validation: [
              { type: 'required', message: 'Location is required' },
              { type: 'minLength', value: 2, message: 'Location must be at least 2 characters' },
            ],
          },
          {
            name: 'bio',
            type: 'textarea',
            label: 'Describe your voice',
            placeholder: 'Describe your voice tone, range, style, characteristics...',
            required: true,
            validation: [
              { type: 'required', message: 'Bio is required' },
              { type: 'minLength', value: 10, message: 'Bio must be at least 10 characters' },
              { type: 'maxLength', value: 500, message: 'Bio must be no more than 500 characters' },
            ],
          },
        ],
      },
      {
        step: 3,
        title: 'Voice Types',
        description: 'What kind of voice work do you love?',
        fields: [
          {
            name: 'voiceTypes',
            type: 'multiselect',
            label: 'Select all the types of voice work you specialize in',
            required: true,
            options: voiceTypeOptions,
            validation: [
              {
                type: 'custom',
                validator: (value) => {
                  if (!Array.isArray(value) || value.length === 0) {
                    return 'Please select at least one voice type'
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
        title: 'Languages',
        description: 'What languages can you perform in?',
        fields: [
          {
            name: 'languages',
            type: 'multiselect',
            label: 'Select all languages you can perform in',
            required: true,
            options: languageOptions,
            validation: [
              {
                type: 'custom',
                validator: (value) => {
                  if (!Array.isArray(value) || value.length === 0) {
                    return 'Please select at least one language'
                  }
                  return true
                },
              },
            ],
          },
        ],
      },
      {
        step: 5,
        title: 'Upload Voice Samples',
        description: 'Upload voice samples for each voice type',
        fields: [], // File uploads handled separately
      },
      {
        step: 6,
        title: 'Pricing & Rates',
        description: 'Set your rates for different job types',
        fields: [], // Dynamic pricing fields handled separately
      },
      {
        step: 7,
        title: 'Payout Preferences',
        description: "Choose how you'd like to receive your earnings",
        fields: [
          {
            name: 'payoutFrequency',
            type: 'radio',
            label: 'Payout Frequency',
            required: true,
            options: [
              { value: 'monthly', label: 'Monthly Automatic Payout' },
              { value: 'threshold', label: 'Threshold-Based Payout' },
              { value: 'manual', label: 'Manual Payout (Request Anytime)' },
            ],
          },
          {
            name: 'thresholdAmount',
            type: 'number',
            label: 'Payout Threshold Amount',
            placeholder: '500',
            dependencies: [
              {
                field: 'payoutFrequency',
                operator: 'equals',
                value: 'threshold',
              },
            ],
            validation: [
              {
                type: 'custom',
                validator: (value, formData) => {
                  if (formData.payoutFrequency === 'threshold') {
                    if (!value || value < 5) {
                      return 'Minimum threshold is $5.00'
                    }
                  }
                  return true
                },
              },
            ],
          },
          {
            name: 'currency',
            type: 'select',
            label: 'Preferred Currency',
            defaultValue: 'USD',
            options: [
              { value: 'USD', label: 'USD - US Dollar' },
              { value: 'EUR', label: 'EUR - Euro' },
              { value: 'JPY', label: 'JPY - Japanese Yen' },
              { value: 'KRW', label: 'KRW - South Korean Won' },
              { value: 'CNY', label: 'CNY - Chinese Yuan' },
              { value: 'INR', label: 'INR - Indian Rupee' },
            ],
          },
        ],
      },
      {
        step: 8,
        title: 'Agreement & Legal Requirements',
        description: 'Please review and confirm the following',
        fields: [
          {
            name: 'isAgeVerified',
            type: 'checkbox',
            label: 'I confirm that I am at least 18 years old',
            required: true,
            validation: [
              {
                type: 'custom',
                validator: (value) => {
                  if (value !== true) {
                    return 'You must confirm your age to continue'
                  }
                  return true
                },
              },
            ],
          },
          {
            name: 'acceptedTerms',
            type: 'checkbox',
            label: 'I have read and agree to the Terms of Service',
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
          {
            name: 'acceptedPlatformAgreement',
            type: 'checkbox',
            label: 'I have read and agree to the Platform Agreement',
            required: true,
            validation: [
              {
                type: 'custom',
                validator: (value) => {
                  if (value !== true) {
                    return 'You must accept the platform agreement to continue'
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
