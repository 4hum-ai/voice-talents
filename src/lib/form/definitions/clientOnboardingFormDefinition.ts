/**
 * Form Definition for Client Onboarding Flow
 * Declarative form schema for client account setup
 */

import type { FormDefinition } from '../composable/useFormDefinition'
import { useJobType } from '@/composables/useJobType'

/**
 * Generate client onboarding form definition
 * Options are generated dynamically from composables
 */
export function createClientOnboardingFormDefinition(): FormDefinition {
  const { availableJobTypes } = useJobType()

  // Convert job types to options format
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
