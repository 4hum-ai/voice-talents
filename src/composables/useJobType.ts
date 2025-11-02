/**
 * Job Type Configuration Composable
 * Provides pricing, delivery, and studio configuration for different voice-over job types
 */

import { computed } from 'vue'

export interface JobType {
  id: string
  label: string
  category: 'commercial' | 'entertainment' | 'educational' | 'corporate' | 'media'
  pricing: {
    model: 'per_hour' | 'per_minute' | 'per_character' | 'per_scene' | 'per_project' | 'per_word'
    baseRate: number
    currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD'
    minimumAmount?: number
    volumeDiscount?: boolean
    rushFee?: number
  }
  delivery: {
    formats: string[]
    quality: 'standard' | 'professional' | 'broadcast'
    timeline: string
    revisionRounds: number
    specialRequirements?: string[]
  }
  studio: {
    equipment: string[]
    environment: 'home' | 'studio' | 'professional_studio'
    direction: 'self_directed' | 'client_directed' | 'studio_directed'
    postProduction: boolean
    mixing: boolean
  }
  files: {
    required: Array<{
      id: string
      label: string
      description: string
      acceptedFormats: string[]
      maxSize: number // in MB
      multiple?: boolean
    }>
    optional: Array<{
      id: string
      label: string
      description: string
      acceptedFormats: string[]
      maxSize: number // in MB
      multiple?: boolean
    }>
  }
  description: string
  useCases: string[]
}

export function useJobType() {
  const projectTypeConfigs: Record<string, JobType> = {
    // Commercial & Advertising
    commercial: {
      id: 'commercial',
      label: 'Commercial Voice-Over',
      category: 'commercial',
      pricing: {
        model: 'per_project',
        baseRate: 500,
        currency: 'USD',
        minimumAmount: 200,
        volumeDiscount: true,
        rushFee: 1.5,
      },
      delivery: {
        formats: ['mp3_44khz'],
        quality: 'professional',
        timeline: '3-5 business days',
        revisionRounds: 2,
        specialRequirements: ['broadcast_ready', 'multiple_versions'],
      },
      studio: {
        equipment: ['professional_microphone', 'acoustic_treatment', 'audio_interface'],
        environment: 'professional_studio',
        direction: 'client_directed',
        postProduction: true,
        mixing: true,
      },
      files: {
        required: [
          {
            id: 'script',
            label: 'Script',
            description: 'The commercial script or copy to be read',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 10,
          },
          {
            id: 'reference_audio',
            label: 'Reference Audio',
            description: 'Sample audio for voice matching or style reference',
            acceptedFormats: ['.mp3', '.wav', '.m4a'],
            maxSize: 25,
          },
        ],
        optional: [
          {
            id: 'brand_guidelines',
            label: 'Brand Guidelines',
            description: 'Brand voice and style guidelines',
            acceptedFormats: ['.pdf', '.doc', '.docx'],
            maxSize: 10,
          },
          {
            id: 'target_demographic',
            label: 'Target Demographic Info',
            description: 'Information about the target audience',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5,
          },
        ],
      },
      description:
        'Professional commercial voice-over for advertising, marketing, and promotional content',
      useCases: [
        'TV commercials',
        'Radio ads',
        'Online advertising',
        'Social media content',
        'Product demos',
      ],
    },

    // Film & Entertainment Categories
    film_character_dubbing: {
      id: 'film_character_dubbing',
      label: 'Film Character Dubbing',
      category: 'entertainment',
      pricing: {
        model: 'per_character',
        baseRate: 250,
        currency: 'USD',
        minimumAmount: 400,
        volumeDiscount: false,
        rushFee: 1.8,
      },
      delivery: {
        formats: ['mp3_44khz'],
        quality: 'professional',
        timeline: '1-2 weeks',
        revisionRounds: 2,
        specialRequirements: ['character_consistency', 'voice_matching', 'lip_sync'],
      },
      studio: {
        equipment: ['professional_microphone', 'acoustic_treatment', 'video_monitor'],
        environment: 'professional_studio',
        direction: 'studio_directed',
        postProduction: true,
        mixing: false,
      },
      files: {
        required: [
          {
            id: 'character_script',
            label: 'Character Script',
            description: "Script containing the character's dialogue lines",
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 10,
          },
          {
            id: 'character_reference',
            label: 'Character Reference',
            description: 'Visual reference or description of the character',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.jpg', '.png', '.mp4'],
            maxSize: 50,
          },
          {
            id: 'voice_direction',
            label: 'Voice Direction',
            description: 'Instructions for character voice and delivery style',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5,
          },
        ],
        optional: [
          {
            id: 'original_actor_sample',
            label: 'Original Actor Sample',
            description: 'Audio sample of the original actor for voice matching',
            acceptedFormats: ['.mp3', '.wav', '.m4a'],
            maxSize: 25,
          },
          {
            id: 'character_backstory',
            label: 'Character Backstory',
            description: 'Background information about the character',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5,
          },
          {
            id: 'timing_sheets',
            label: 'Timing Sheets',
            description: 'Synchronization timing information',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5,
          },
        ],
      },
      description: 'Character voice work for film dubbing projects - individual character roles',
      useCases: [
        'Character replacement',
        'Voice matching',
        'Character consistency',
        'Actor substitution',
      ],
    },

    // Media & Broadcasting
    podcast: {
      id: 'podcast',
      label: 'Podcast Voice',
      category: 'media',
      pricing: {
        model: 'per_hour',
        baseRate: 200,
        currency: 'USD',
        minimumAmount: 150,
        volumeDiscount: true,
        rushFee: 1.2,
      },
      delivery: {
        formats: ['mp3_44khz'],
        quality: 'professional',
        timeline: '2-3 business days',
        revisionRounds: 1,
        specialRequirements: ['conversational_tone', 'natural_delivery'],
      },
      studio: {
        equipment: ['professional_microphone', 'acoustic_treatment'],
        environment: 'professional_studio',
        direction: 'self_directed',
        postProduction: true,
        mixing: true,
      },
      files: {
        required: [
          {
            id: 'script',
            label: 'Podcast Script',
            description: 'The podcast episode script or outline',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 10,
          },
        ],
        optional: [
          {
            id: 'show_notes',
            label: 'Show Notes',
            description: 'Additional notes and information for the episode',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5,
          },
          {
            id: 'brand_guidelines',
            label: 'Brand Guidelines',
            description: 'Podcast brand voice and style guidelines',
            acceptedFormats: ['.pdf', '.doc', '.docx'],
            maxSize: 5,
          },
          {
            id: 'reference_audio',
            label: 'Reference Audio',
            description: 'Previous episodes or style reference audio',
            acceptedFormats: ['.mp3', '.wav', '.m4a'],
            maxSize: 25,
          },
          {
            id: 'intro_outro',
            label: 'Intro/Outro Scripts',
            description: 'Podcast intro and outro scripts',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 2,
          },
        ],
      },
      description: 'Voice work for podcasts, including intros, outros, and episode content',
      useCases: ['Podcast intros', 'Episode narration', 'Advertisements', 'Sponsor reads'],
    },

    audiobook_narrator: {
      id: 'audiobook_narrator',
      label: 'Audiobook Narration',
      category: 'educational',
      pricing: {
        model: 'per_hour',
        baseRate: 300,
        currency: 'USD',
        minimumAmount: 500,
        volumeDiscount: true,
        rushFee: 1.3,
      },
      delivery: {
        formats: ['mp3_44khz'],
        quality: 'professional',
        timeline: '2-4 weeks',
        revisionRounds: 1,
        specialRequirements: ['consistent_pacing', 'character_voices', 'pronunciation_accuracy'],
      },
      studio: {
        equipment: ['professional_microphone', 'acoustic_treatment', 'comfortable_setup'],
        environment: 'professional_studio',
        direction: 'self_directed',
        postProduction: true,
        mixing: false,
      },
      files: {
        required: [
          {
            id: 'book_manuscript',
            label: 'Book Manuscript',
            description: 'Complete book text in digital format',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 50,
          },
          {
            id: 'pronunciation_guide',
            label: 'Pronunciation Guide',
            description: 'Guide for proper pronunciation of names, places, and terms',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5,
          },
        ],
        optional: [
          {
            id: 'character_notes',
            label: 'Character Notes',
            description: 'Character descriptions and voice guidelines',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5,
          },
          {
            id: 'author_guidelines',
            label: 'Author Guidelines',
            description: 'Specific instructions from the author',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5,
          },
          {
            id: 'reference_audio',
            label: 'Reference Audio',
            description: 'Sample audio for style and tone reference',
            acceptedFormats: ['.mp3', '.wav', '.m4a'],
            maxSize: 25,
          },
        ],
      },
      description: 'Professional audiobook narration with character voices and consistent pacing',
      useCases: ['Fiction books', 'Non-fiction', 'Educational content', "Children's books"],
    },

    // Film narration for individual talent
    film_narration: {
      id: 'film_narration',
      label: 'Film Narration',
      category: 'entertainment',
      pricing: {
        model: 'per_minute',
        baseRate: 80,
        currency: 'USD',
        minimumAmount: 200,
        volumeDiscount: true,
        rushFee: 1.5,
      },
      delivery: {
        formats: ['mp3_44khz'],
        quality: 'professional',
        timeline: '1-2 weeks',
        revisionRounds: 2,
        specialRequirements: ['dramatic_delivery', 'timing_precision', 'emotion_matching'],
      },
      studio: {
        equipment: ['professional_microphone', 'acoustic_treatment', 'video_monitor'],
        environment: 'professional_studio',
        direction: 'client_directed',
        postProduction: true,
        mixing: false,
      },
      files: {
        required: [
          {
            id: 'subtitles',
            label: 'Captions/Subtitles',
            description: 'Captions/Subtitles in VTT or SRT format',
            acceptedFormats: ['.vtt', '.srt'],
            maxSize: 10,
          },
          {
            id: 'movie_file',
            label: 'Movie File',
            description: 'The movie file in MP4 format for reference and timing',
            acceptedFormats: ['.mp4'],
            maxSize: 500,
          },
        ],
        optional: [
          {
            id: 'reference_audio',
            label: 'Reference Audio',
            description: 'Sample audio for voice style and tone reference',
            acceptedFormats: ['.mp3', '.wav', '.m4a'],
            maxSize: 5,
          },
        ],
      },
      description: 'Narrative voice-over work for films, documentaries, and cinematic content',
      useCases: [
        'Documentary narration',
        'Film narration',
        'Cinematic storytelling',
        'Historical content',
      ],
    },

    // Generic "Other" job type
    other: {
      id: 'other',
      label: 'Other Voice Work',
      category: 'corporate',
      pricing: {
        model: 'per_project',
        baseRate: 300,
        currency: 'USD',
        minimumAmount: 200,
        volumeDiscount: true,
        rushFee: 1.3,
      },
      delivery: {
        formats: ['mp3_44khz'],
        quality: 'professional',
        timeline: '3-5 business days',
        revisionRounds: 2,
        specialRequirements: ['custom_requirements'],
      },
      studio: {
        equipment: ['professional_microphone', 'acoustic_treatment'],
        environment: 'professional_studio',
        direction: 'client_directed',
        postProduction: true,
        mixing: false,
      },
      files: {
        required: [
          {
            id: 'script',
            label: 'Script/Content',
            description: 'The content or script to be voiced',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 25,
          },
        ],
        optional: [
          {
            id: 'reference_audio',
            label: 'Reference Audio',
            description: 'Sample audio for style and tone reference',
            acceptedFormats: ['.mp3', '.wav', '.m4a'],
            maxSize: 25,
          },
          {
            id: 'project_guidelines',
            label: 'Project Guidelines',
            description: 'Specific requirements and guidelines for the project',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 10,
          },
          {
            id: 'additional_materials',
            label: 'Additional Materials',
            description: 'Any other relevant materials for the project',
            acceptedFormats: [
              '.pdf',
              '.doc',
              '.docx',
              '.txt',
              '.mp3',
              '.wav',
              '.mp4',
              '.jpg',
              '.png',
            ],
            maxSize: 100,
          },
        ],
      },
      description: 'Custom voice work for various projects and applications',
      useCases: [
        'Custom projects',
        'Specialized applications',
        'Unique requirements',
        'Experimental work',
      ],
    },
  }

  // Computed properties for easy access
  const getConfig = (projectType: string): JobType | null => {
    return projectTypeConfigs[projectType] || null
  }

  const getConfigsByCategory = (category: string): JobType[] => {
    return Object.values(projectTypeConfigs).filter((config) => config.category === category)
  }

  // Helper functions for job type display
  const getJobTypeIcon = (jobTypeId: string): string => {
    const iconMap: Record<string, string> = {
      commercial: 'mdi:tv',
      film_character_dubbing: 'mdi:account-voice',
      e_learning: 'mdi:school',
      podcast: 'mdi:podcast',
      audiobook_narrator: 'mdi:book-music',
      film_narration: 'mdi:filmstrip',
      documentary_voice: 'mdi:document-text',
      character_voice: 'mdi:animation',
      phone_system: 'mdi:phone',
      other: 'mdi:microphone',
    }
    return iconMap[jobTypeId] || 'mdi:microphone'
  }

  const getJobTypeColor = (jobTypeId: string): string => {
    const colorMap: Record<string, string> = {
      commercial: 'bg-green-500',
      film_character_dubbing: 'bg-purple-500',
      e_learning: 'bg-blue-500',
      podcast: 'bg-pink-500',
      audiobook_narrator: 'bg-indigo-500',
      film_narration: 'bg-orange-500',
      documentary_voice: 'bg-teal-500',
      character_voice: 'bg-red-500',
      phone_system: 'bg-gray-500',
      other: 'bg-yellow-500',
    }
    return colorMap[jobTypeId] || 'bg-gray-500'
  }

  // Computed variable for available job types (for onboarding)
  const availableJobTypes = computed(() => {
    return Object.values(projectTypeConfigs).map((config) => ({
      value: config.id,
      label: config.label,
      category: config.category,
      description: config.description,
      icon: getJobTypeIcon(config.id),
      color: getJobTypeColor(config.id),
    }))
  })

  const getAllConfigs = computed(() => Object.values(projectTypeConfigs))

  const getPricingInfo = (projectType: string) => {
    const config = getConfig(projectType)
    return config?.pricing || null
  }

  const getDeliveryInfo = (projectType: string) => {
    const config = getConfig(projectType)
    return config?.delivery || null
  }

  const getStudioInfo = (projectType: string) => {
    const config = getConfig(projectType)
    return config?.studio || null
  }

  const getFileRequirements = (projectType: string) => {
    const config = getConfig(projectType)
    return config?.files || null
  }

  // Helper function to calculate estimated cost
  const calculateEstimatedCost = (
    projectType: string,
    quantity: number,
    isRush: boolean = false,
  ): number => {
    const config = getConfig(projectType)
    if (!config) return 0

    const { baseRate, minimumAmount, rushFee } = config.pricing
    let cost = baseRate * quantity

    if (minimumAmount && cost < minimumAmount) {
      cost = minimumAmount
    }

    if (isRush && rushFee) {
      cost *= rushFee
    }

    return Math.round(cost)
  }

  return {
    // Data
    projectTypeConfigs,
    getAllConfigs,
    availableJobTypes,

    // Getters
    getConfig,
    getConfigsByCategory,
    getPricingInfo,
    getDeliveryInfo,
    getStudioInfo,
    getFileRequirements,

    // Utilities
    calculateEstimatedCost,
  }
}
