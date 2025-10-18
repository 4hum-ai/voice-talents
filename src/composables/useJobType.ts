/**
 * Job Type Configuration Composable
 * Provides pricing, delivery, and studio configuration for different voice-over job types
 */

import { computed } from 'vue'

export interface ProjectTypeConfig {
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
  const projectTypeConfigs: Record<string, ProjectTypeConfig> = {
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
        rushFee: 1.5
      },
      delivery: {
        formats: ['mp3_44khz'],
        quality: 'professional',
        timeline: '3-5 business days',
        revisionRounds: 2,
        specialRequirements: ['broadcast_ready', 'multiple_versions']
      },
      studio: {
        equipment: ['professional_microphone', 'acoustic_treatment', 'audio_interface'],
        environment: 'professional_studio',
        direction: 'client_directed',
        postProduction: true,
        mixing: true
      },
      files: {
        required: [
          {
            id: 'script',
            label: 'Script',
            description: 'The commercial script or copy to be read',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 10
          },
          {
            id: 'reference_audio',
            label: 'Reference Audio',
            description: 'Sample audio for voice matching or style reference',
            acceptedFormats: ['.mp3', '.wav', '.m4a'],
            maxSize: 25
          }
        ],
        optional: [
          {
            id: 'brand_guidelines',
            label: 'Brand Guidelines',
            description: 'Brand voice and style guidelines',
            acceptedFormats: ['.pdf', '.doc', '.docx'],
            maxSize: 10
          },
          {
            id: 'target_demographic',
            label: 'Target Demographic Info',
            description: 'Information about the target audience',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5
          }
        ]
      },
      description: 'Professional commercial voice-over for advertising, marketing, and promotional content',
      useCases: ['TV commercials', 'Radio ads', 'Online advertising', 'Social media content', 'Product demos']
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
        rushFee: 1.8
      },
      delivery: {
        formats: ['mp3_44khz'],
        quality: 'professional',
        timeline: '1-2 weeks',
        revisionRounds: 2,
        specialRequirements: ['character_consistency', 'voice_matching', 'lip_sync']
      },
      studio: {
        equipment: ['professional_microphone', 'acoustic_treatment', 'video_monitor'],
        environment: 'professional_studio',
        direction: 'studio_directed',
        postProduction: true,
        mixing: false
      },
      files: {
        required: [
          {
            id: 'character_script',
            label: 'Character Script',
            description: 'Script containing the character\'s dialogue lines',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 10
          },
          {
            id: 'character_reference',
            label: 'Character Reference',
            description: 'Visual reference or description of the character',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.jpg', '.png', '.mp4'],
            maxSize: 50
          },
          {
            id: 'voice_direction',
            label: 'Voice Direction',
            description: 'Instructions for character voice and delivery style',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5
          }
        ],
        optional: [
          {
            id: 'original_actor_sample',
            label: 'Original Actor Sample',
            description: 'Audio sample of the original actor for voice matching',
            acceptedFormats: ['.mp3', '.wav', '.m4a'],
            maxSize: 25
          },
          {
            id: 'character_backstory',
            label: 'Character Backstory',
            description: 'Background information about the character',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5
          },
          {
            id: 'timing_sheets',
            label: 'Timing Sheets',
            description: 'Synchronization timing information',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5
          }
        ]
      },
      description: 'Character voice work for film dubbing projects - individual character roles',
      useCases: ['Character replacement', 'Voice matching', 'Character consistency', 'Actor substitution']
    },

    // Educational & Corporate
    e_learning: {
      id: 'e_learning',
      label: 'E-Learning Narration',
      category: 'educational',
      pricing: {
        model: 'per_minute',
        baseRate: 50,
        currency: 'USD',
        minimumAmount: 200,
        volumeDiscount: true,
        rushFee: 1.3
      },
      delivery: {
        formats: ['mp3_44khz'],
        quality: 'professional',
        timeline: '5-7 business days',
        revisionRounds: 2,
        specialRequirements: ['clear_pronunciation', 'consistent_pacing', 'educational_tone']
      },
      studio: {
        equipment: ['professional_microphone', 'acoustic_treatment'],
        environment: 'professional_studio',
        direction: 'self_directed',
        postProduction: true,
        mixing: false
      },
      files: {
        required: [
          {
            id: 'script',
            label: 'E-Learning Script',
            description: 'The educational content script to be narrated',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 25
          },
          {
            id: 'learning_objectives',
            label: 'Learning Objectives',
            description: 'Educational goals and learning outcomes',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5
          }
        ],
        optional: [
          {
            id: 'glossary',
            label: 'Glossary',
            description: 'Technical terms and definitions',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5
          },
          {
            id: 'pronunciation_guide',
            label: 'Pronunciation Guide',
            description: 'Guide for technical terms and proper pronunciation',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5
          },
          {
            id: 'visual_slides',
            label: 'Visual Slides',
            description: 'Presentation slides or visual materials',
            acceptedFormats: ['.pdf', '.ppt', '.pptx', '.jpg', '.png'],
            maxSize: 50
          },
          {
            id: 'reference_audio',
            label: 'Reference Audio',
            description: 'Sample audio for style and tone reference',
            acceptedFormats: ['.mp3', '.wav', '.m4a'],
            maxSize: 25
          }
        ]
      },
      description: 'Educational narration for online courses, training materials, and learning content',
      useCases: ['Online courses', 'Corporate training', 'Educational videos', 'Tutorials']
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
        rushFee: 1.2
      },
      delivery: {
        formats: ['mp3_44khz'],
        quality: 'professional',
        timeline: '2-3 business days',
        revisionRounds: 1,
        specialRequirements: ['conversational_tone', 'natural_delivery']
      },
      studio: {
        equipment: ['professional_microphone', 'acoustic_treatment'],
        environment: 'professional_studio',
        direction: 'self_directed',
        postProduction: true,
        mixing: true
      },
      files: {
        required: [
          {
            id: 'script',
            label: 'Podcast Script',
            description: 'The podcast episode script or outline',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 10
          }
        ],
        optional: [
          {
            id: 'show_notes',
            label: 'Show Notes',
            description: 'Additional notes and information for the episode',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5
          },
          {
            id: 'brand_guidelines',
            label: 'Brand Guidelines',
            description: 'Podcast brand voice and style guidelines',
            acceptedFormats: ['.pdf', '.doc', '.docx'],
            maxSize: 5
          },
          {
            id: 'reference_audio',
            label: 'Reference Audio',
            description: 'Previous episodes or style reference audio',
            acceptedFormats: ['.mp3', '.wav', '.m4a'],
            maxSize: 25
          },
          {
            id: 'intro_outro',
            label: 'Intro/Outro Scripts',
            description: 'Podcast intro and outro scripts',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 2
          }
        ]
      },
      description: 'Voice work for podcasts, including intros, outros, and episode content',
      useCases: ['Podcast intros', 'Episode narration', 'Advertisements', 'Sponsor reads']
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
        rushFee: 1.3
      },
      delivery: {
        formats: ['mp3_44khz'],
        quality: 'professional',
        timeline: '2-4 weeks',
        revisionRounds: 1,
        specialRequirements: ['consistent_pacing', 'character_voices', 'pronunciation_accuracy']
      },
      studio: {
        equipment: ['professional_microphone', 'acoustic_treatment', 'comfortable_setup'],
        environment: 'professional_studio',
        direction: 'self_directed',
        postProduction: true,
        mixing: false
      },
      files: {
        required: [
          {
            id: 'book_manuscript',
            label: 'Book Manuscript',
            description: 'Complete book text in digital format',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 50
          },
          {
            id: 'pronunciation_guide',
            label: 'Pronunciation Guide',
            description: 'Guide for proper pronunciation of names, places, and terms',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5
          }
        ],
        optional: [
          {
            id: 'character_notes',
            label: 'Character Notes',
            description: 'Character descriptions and voice guidelines',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5
          },
          {
            id: 'author_guidelines',
            label: 'Author Guidelines',
            description: 'Specific instructions from the author',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5
          },
          {
            id: 'reference_audio',
            label: 'Reference Audio',
            description: 'Sample audio for style and tone reference',
            acceptedFormats: ['.mp3', '.wav', '.m4a'],
            maxSize: 25
          }
        ]
      },
      description: 'Professional audiobook narration with character voices and consistent pacing',
      useCases: ['Fiction books', 'Non-fiction', 'Educational content', 'Children\'s books']
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
        rushFee: 1.5
      },
      delivery: {
        formats: ['mp3_44khz'],
        quality: 'professional',
        timeline: '1-2 weeks',
        revisionRounds: 2,
        specialRequirements: ['dramatic_delivery', 'timing_precision', 'emotion_matching']
      },
      studio: {
        equipment: ['professional_microphone', 'acoustic_treatment', 'video_monitor'],
        environment: 'professional_studio',
        direction: 'client_directed',
        postProduction: true,
        mixing: false
      },
      files: {
        required: [
          {
            id: 'subtitles',
            label: 'Captions/Subtitles',
            description: 'Captions/Subtitles in VTT or SRT format',
            acceptedFormats: ['.vtt', '.srt'],
            maxSize: 10
          },
          {
            id: 'movie_file',
            label: 'Movie File',
            description: 'The movie file in MP4 format for reference and timing',
            acceptedFormats: ['.mp4'],
            maxSize: 500
          }
        ],
        optional: [
          {
            id: 'reference_audio',
            label: 'Reference Audio',
            description: 'Sample audio for voice style and tone reference',
            acceptedFormats: ['.mp3', '.wav', '.m4a'],
            maxSize: 5
          }
        ]
      },
      description: 'Narrative voice-over work for films, documentaries, and cinematic content',
      useCases: ['Documentary narration', 'Film narration', 'Cinematic storytelling', 'Historical content']
    },

    documentary_voice: {
      id: 'documentary_voice',
      label: 'Documentary Voice-Over',
      category: 'educational',
      pricing: {
        model: 'per_minute',
        baseRate: 60,
        currency: 'USD',
        minimumAmount: 200,
        volumeDiscount: true,
        rushFee: 1.4
      },
      delivery: {
        formats: ['mp3_44khz'],
        quality: 'professional',
        timeline: '1-2 weeks',
        revisionRounds: 2,
        specialRequirements: ['authoritative_tone', 'clear_pronunciation', 'educational_delivery']
      },
      studio: {
        equipment: ['professional_microphone', 'acoustic_treatment'],
        environment: 'professional_studio',
        direction: 'client_directed',
        postProduction: true,
        mixing: false
      },
      files: {
        required: [
          {
            id: 'documentary_script',
            label: 'Documentary Script',
            description: 'Complete documentary narration script',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 25
          },
          {
            id: 'fact_checking_notes',
            label: 'Fact-Checking Notes',
            description: 'Verified facts and information for accuracy',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 10
          }
        ],
        optional: [
          {
            id: 'visual_reference',
            label: 'Visual Reference',
            description: 'Documentary footage or visual materials',
            acceptedFormats: ['.mp4', '.mov', '.avi', '.jpg', '.png'],
            maxSize: 200
          },
          {
            id: 'expert_interviews',
            label: 'Expert Interviews',
            description: 'Audio or transcripts of expert interviews',
            acceptedFormats: ['.mp3', '.wav', '.pdf', '.doc', '.docx', '.txt'],
            maxSize: 100
          },
          {
            id: 'reference_audio',
            label: 'Reference Audio',
            description: 'Sample audio for style and tone reference',
            acceptedFormats: ['.mp3', '.wav', '.m4a'],
            maxSize: 25
          },
          {
            id: 'research_materials',
            label: 'Research Materials',
            description: 'Additional research and background information',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 50
          }
        ]
      },
      description: 'Educational and informative voice-over for documentary films and educational content',
      useCases: ['Educational documentaries', 'Nature films', 'Historical content', 'Scientific explanations']
    },

    // Additional individual talent job types
    character_voice: {
      id: 'character_voice',
      label: 'Character Voice',
      category: 'entertainment',
      pricing: {
        model: 'per_character',
        baseRate: 200,
        currency: 'USD',
        minimumAmount: 300,
        volumeDiscount: true,
        rushFee: 1.5
      },
      delivery: {
        formats: ['mp3_44khz'],
        quality: 'professional',
        timeline: '1-2 weeks',
        revisionRounds: 3,
        specialRequirements: ['character_development', 'voice_acting', 'emotion_range']
      },
      studio: {
        equipment: ['professional_microphone', 'acoustic_treatment', 'video_monitor'],
        environment: 'professional_studio',
        direction: 'studio_directed',
        postProduction: true,
        mixing: false
      },
      files: {
        required: [
          {
            id: 'character_script',
            label: 'Character Script',
            description: 'Script containing the character\'s dialogue and lines',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 10
          },
          {
            id: 'character_design',
            label: 'Character Design',
            description: 'Visual character design and reference materials',
            acceptedFormats: ['.pdf', '.jpg', '.png', '.mp4', '.mov'],
            maxSize: 50
          },
          {
            id: 'voice_direction',
            label: 'Voice Direction',
            description: 'Instructions for character voice and delivery style',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5
          }
        ],
        optional: [
          {
            id: 'character_backstory',
            label: 'Character Backstory',
            description: 'Background information about the character',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5
          },
          {
            id: 'reference_audio',
            label: 'Reference Audio',
            description: 'Sample audio for voice style and tone reference',
            acceptedFormats: ['.mp3', '.wav', '.m4a'],
            maxSize: 25
          },
          {
            id: 'style_guide',
            label: 'Style Guide',
            description: 'Character voice style and tone guidelines',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5
          }
        ]
      },
      description: 'Character voice work for various media including animation, games, and interactive content',
      useCases: ['Animation characters', 'Game characters', 'Interactive media', 'Character development']
    },

    phone_system: {
      id: 'phone_system',
      label: 'Phone System Voice',
      category: 'corporate',
      pricing: {
        model: 'per_project',
        baseRate: 400,
        currency: 'USD',
        minimumAmount: 300,
        volumeDiscount: true,
        rushFee: 1.2
      },
      delivery: {
        formats: ['mp3_44khz'],
        quality: 'professional',
        timeline: '3-5 days',
        revisionRounds: 2,
        specialRequirements: ['clear_pronunciation', 'consistent_tone', 'professional_delivery']
      },
      studio: {
        equipment: ['professional_microphone', 'acoustic_treatment'],
        environment: 'professional_studio',
        direction: 'client_directed',
        postProduction: true,
        mixing: false
      },
      files: {
        required: [
          {
            id: 'phone_script',
            label: 'Phone System Script',
            description: 'Complete script for all phone system messages',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 10
          },
          {
            id: 'menu_structure',
            label: 'Menu Structure',
            description: 'IVR menu flow and structure documentation',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5
          }
        ],
        optional: [
          {
            id: 'brand_guidelines',
            label: 'Brand Guidelines',
            description: 'Company voice and tone guidelines',
            acceptedFormats: ['.pdf', '.doc', '.docx'],
            maxSize: 5
          },
          {
            id: 'pronunciation_guide',
            label: 'Pronunciation Guide',
            description: 'Guide for company names, products, and technical terms',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 5
          },
          {
            id: 'reference_audio',
            label: 'Reference Audio',
            description: 'Existing phone system audio for style reference',
            acceptedFormats: ['.mp3', '.wav', '.m4a'],
            maxSize: 25
          },
          {
            id: 'call_flows',
            label: 'Call Flow Diagrams',
            description: 'Visual diagrams of call routing and menu flows',
            acceptedFormats: ['.pdf', '.jpg', '.png', '.doc', '.docx'],
            maxSize: 10
          }
        ]
      },
      description: 'Voice work for phone systems, IVR menus, and automated phone services',
      useCases: ['IVR systems', 'Phone menus', 'Automated messages', 'Customer service lines']
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
        rushFee: 1.3
      },
      delivery: {
        formats: ['mp3_44khz'],
        quality: 'professional',
        timeline: '3-5 business days',
        revisionRounds: 2,
        specialRequirements: ['custom_requirements']
      },
      studio: {
        equipment: ['professional_microphone', 'acoustic_treatment'],
        environment: 'professional_studio',
        direction: 'client_directed',
        postProduction: true,
        mixing: false
      },
      files: {
        required: [
          {
            id: 'script',
            label: 'Script/Content',
            description: 'The content or script to be voiced',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 25
          }
        ],
        optional: [
          {
            id: 'reference_audio',
            label: 'Reference Audio',
            description: 'Sample audio for style and tone reference',
            acceptedFormats: ['.mp3', '.wav', '.m4a'],
            maxSize: 25
          },
          {
            id: 'project_guidelines',
            label: 'Project Guidelines',
            description: 'Specific requirements and guidelines for the project',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'],
            maxSize: 10
          },
          {
            id: 'additional_materials',
            label: 'Additional Materials',
            description: 'Any other relevant materials for the project',
            acceptedFormats: ['.pdf', '.doc', '.docx', '.txt', '.mp3', '.wav', '.mp4', '.jpg', '.png'],
            maxSize: 100
          }
        ]
      },
      description: 'Custom voice work for various projects and applications',
      useCases: ['Custom projects', 'Specialized applications', 'Unique requirements', 'Experimental work']
    }
  }

  // Computed properties for easy access
  const getConfig = (projectType: string): ProjectTypeConfig | null => {
    return projectTypeConfigs[projectType] || null
  }

  const getConfigsByCategory = (category: string): ProjectTypeConfig[] => {
    return Object.values(projectTypeConfigs).filter(config => config.category === category)
  }

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
    isRush: boolean = false
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
    
    // Getters
    getConfig,
    getConfigsByCategory,
    getPricingInfo,
    getDeliveryInfo,
    getStudioInfo,
    getFileRequirements,
    
    // Utilities
    calculateEstimatedCost
  }
}
