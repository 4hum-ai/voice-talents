/**
 * Form Definition for Job Creation Flow
 * Declarative form schema for job posting
 */

import type { FormDefinition } from '@/lib/form'
import { useJobType } from '@/composables/useJobType'

/**
 * Generate job creation form definition
 * Options are generated dynamically from composables
 */
export function createJobCreationFormDefinition(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _voiceType: 'talent_only' | 'ai_synthesis' | 'hybrid_approach',
): FormDefinition {
  const { getAllConfigs } = useJobType()

  // Project type options
  const projectTypeOptions = getAllConfigs.value.map((config) => ({
    value: config.id,
    label: config.label,
  }))

  // Language options
  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'vietnamese', label: 'Vietnamese' },
  ]

  // Gender options
  const genderOptions = [
    { value: 'any', label: 'Any' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non-binary', label: 'Non-binary' },
  ]

  // Age range options
  const ageRangeOptions = [
    { value: '18-25', label: '18-25' },
    { value: '26-35', label: '26-35' },
    { value: '36-45', label: '36-45' },
    { value: '46-55', label: '46-55' },
    { value: '56+', label: '56+' },
  ]

  // Delivery format options
  const deliveryFormatOptions = [
    { value: 'mp3_44khz', label: 'MP3 44kHz' },
    { value: 'wav_48khz', label: 'WAV 48kHz' },
    { value: 'wav_96khz', label: 'WAV 96kHz' },
  ]

  // Revision rounds options
  const revisionRoundsOptions = [
    { value: '1', label: '1 round' },
    { value: '2', label: '2 rounds' },
    { value: '3', label: '3 rounds' },
    { value: 'unlimited', label: 'Unlimited' },
  ]

  // Get date 7 days from now for default deadline
  const getDateIn7Days = () => {
    const date = new Date()
    date.setDate(date.getDate() + 7)
    return date.toISOString().split('T')[0]
  }

  return {
    id: 'job-creation',
    persistToStorage: true,
    excludeFromStorage: ['files'], // Files can't be serialized
    initialStep: 1,
    steps: [
      {
        step: 1,
        title: 'Voice Type Selection',
        fields: [], // Voice type is selected before form, handled separately
      },
      {
        step: 2,
        title: 'Basic Information & Requirements',
        fields: [
          {
            name: 'title',
            type: 'text',
            label: 'Job Title',
            placeholder: 'e.g., Commercial Voice-Over for Tech Startup',
            required: true,
            validation: [
              { type: 'required', message: 'Job title is required' },
              { type: 'minLength', value: 5, message: 'Title must be at least 5 characters' },
              {
                type: 'maxLength',
                value: 100,
                message: 'Title must be no more than 100 characters',
              },
            ],
          },
          {
            name: 'description',
            type: 'textarea',
            label: 'Project Description',
            placeholder: 'Describe your project, target audience, and any specific requirements...',
            validation: [
              {
                type: 'maxLength',
                value: 2000,
                message: 'Description must be no more than 2000 characters',
              },
            ],
          },
          {
            name: 'projectType',
            type: 'select',
            label: 'Project Type',
            required: true,
            options: projectTypeOptions,
            validation: [{ type: 'required', message: 'Project type is required' }],
          },
          {
            name: 'requirements.language',
            type: 'select',
            label: 'Language',
            required: true,
            options: languageOptions,
            validation: [{ type: 'required', message: 'Language is required' }],
          },
          {
            name: 'requirements.gender',
            type: 'select',
            label: 'Gender Preference',
            options: genderOptions,
            defaultValue: 'any',
          },
          {
            name: 'requirements.ageRange',
            type: 'select',
            label: 'Age Range',
            options: ageRangeOptions,
          },
          {
            name: 'requirements.specialInstructions',
            type: 'textarea',
            label: 'Special Instructions',
            placeholder: 'Any additional requirements or notes...',
          },
          {
            name: 'requirements.deliveryFormat',
            type: 'select',
            label: 'Delivery Format',
            options: deliveryFormatOptions,
            defaultValue: 'mp3_44khz',
          },
          {
            name: 'requirements.revisionRounds',
            type: 'select',
            label: 'Revision Rounds',
            options: revisionRoundsOptions,
            defaultValue: '1',
          },
          {
            name: 'deadline',
            type: 'date',
            label: 'Project Deadline',
            required: true,
            defaultValue: getDateIn7Days(),
            validation: [
              {
                type: 'custom',
                validator: (value) => {
                  const deadline = new Date(value)
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  if (deadline < today) {
                    return 'Deadline must be in the future'
                  }
                  return true
                },
              },
            ],
          },
        ],
      },
      {
        step: 3,
        title: 'Talent Options',
        fields: [
          {
            name: 'talentOptions.isPublic',
            type: 'checkbox',
            label: 'Public Listing',
            defaultValue: true,
          },
          {
            name: 'premiumFeatures.talentOutreach',
            type: 'checkbox',
            label: 'Talent Outreach',
            defaultValue: false,
          },
          {
            name: 'premiumFeatures.aiMatching',
            type: 'checkbox',
            label: 'AI Matching',
            defaultValue: false,
          },
          {
            name: 'premiumFeatures.autoPrompts',
            type: 'checkbox',
            label: 'Auto Prompts',
            defaultValue: false,
          },
        ],
      },
      {
        step: 4,
        title: 'Review & Payment',
        fields: [], // Review step, no form fields
      },
    ],
  }
}
