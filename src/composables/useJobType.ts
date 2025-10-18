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
    required: string[]
    optional: string[]
    maxSize: number // in MB
    acceptedFormats: string[]
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
        required: ['script', 'reference_audio'],
        optional: ['brand_guidelines', 'target_demographic'],
        maxSize: 50,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.mp3', '.wav']
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
        required: ['character_script', 'character_reference', 'voice_direction'],
        optional: ['original_actor_sample', 'character_backstory', 'timing_sheets'],
        maxSize: 100,
        acceptedFormats: ['.pdf', '.doc', '.mp3', '.wav', '.mp4']
      },
      description: 'Character voice work for film dubbing projects - individual character roles',
      useCases: ['Character replacement', 'Voice matching', 'Character consistency', 'Actor substitution']
    },

    movie_trailer: {
      id: 'movie_trailer',
      label: 'Movie Trailer Voice',
      category: 'entertainment',
      pricing: {
        model: 'per_project',
        baseRate: 800,
        currency: 'USD',
        minimumAmount: 500,
        volumeDiscount: false,
        rushFee: 2.0
      },
      delivery: {
        formats: ['mp3_44khz'],
        quality: 'broadcast',
        timeline: '2-5 days',
        revisionRounds: 2,
        specialRequirements: ['dramatic_delivery', 'timing_precision', 'emotion_impact']
      },
      studio: {
        equipment: ['professional_microphone', 'acoustic_treatment', 'video_monitor'],
        environment: 'professional_studio',
        direction: 'client_directed',
        postProduction: true,
        mixing: false
      },
      files: {
        required: ['trailer_script', 'video_reference', 'timing_cues'],
        optional: ['music_reference', 'style_guide', 'director_notes'],
        maxSize: 200,
        acceptedFormats: ['.pdf', '.doc', '.mp4', '.mov', '.wav']
      },
      description: 'Voice-over work for movie trailers and promotional content',
      useCases: ['Theatrical trailers', 'TV spots', 'Online promotion', 'Film festivals']
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
        required: ['script', 'learning_objectives'],
        optional: ['glossary', 'pronunciation_guide'],
        maxSize: 100,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.txt']
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
        required: ['script'],
        optional: ['show_notes', 'brand_guidelines'],
        maxSize: 50,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.txt']
      },
      description: 'Voice work for podcasts, including intros, outros, and episode content',
      useCases: ['Podcast intros', 'Episode narration', 'Advertisements', 'Sponsor reads']
    },

    // Animation & Gaming
    animation: {
      id: 'animation',
      label: 'Animation Voice',
      category: 'entertainment',
      pricing: {
        model: 'per_character',
        baseRate: 400,
        currency: 'USD',
        minimumAmount: 600,
        volumeDiscount: true,
        rushFee: 1.5
      },
      delivery: {
        formats: ['mp3_44khz'],
        quality: 'professional',
        timeline: '1-2 weeks',
        revisionRounds: 3,
        specialRequirements: ['character_voice', 'emotion_range', 'timing_precision']
      },
      studio: {
        equipment: ['professional_microphone', 'acoustic_treatment', 'video_monitor'],
        environment: 'professional_studio',
        direction: 'studio_directed',
        postProduction: true,
        mixing: false
      },
      files: {
        required: ['character_script', 'character_design', 'voice_direction'],
        optional: ['animation_reference', 'character_backstory'],
        maxSize: 200,
        acceptedFormats: ['.pdf', '.doc', '.mp4', '.mov', '.wav']
      },
      description: 'Character voice work for animated films, TV shows, and web series',
      useCases: ['Animated films', 'TV cartoons', 'Web series', 'Character voices']
    },

    video_game: {
      id: 'video_game',
      label: 'Video Game Voice',
      category: 'entertainment',
      pricing: {
        model: 'per_character',
        baseRate: 350,
        currency: 'USD',
        minimumAmount: 500,
        volumeDiscount: true,
        rushFee: 1.4
      },
      delivery: {
        formats: ['mp3_44khz'],
        quality: 'professional',
        timeline: '1-3 weeks',
        revisionRounds: 2,
        specialRequirements: ['character_consistency', 'emotion_range', 'combat_sounds']
      },
      studio: {
        equipment: ['professional_microphone', 'acoustic_treatment', 'motion_capture'],
        environment: 'professional_studio',
        direction: 'studio_directed',
        postProduction: true,
        mixing: true
      },
      files: {
        required: ['character_script', 'game_context', 'voice_direction'],
        optional: ['character_concept', 'gameplay_footage'],
        maxSize: 300,
        acceptedFormats: ['.pdf', '.doc', '.mp4', '.mov', '.wav']
      },
      description: 'Voice acting for video game characters, including dialogue, combat sounds, and interactive elements',
      useCases: ['Character dialogue', 'Combat sounds', 'Interactive responses', 'Cutscenes']
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
        required: ['book_manuscript', 'pronunciation_guide'],
        optional: ['character_notes', 'author_guidelines'],
        maxSize: 100,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.txt']
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
        required: ['narration_script', 'video_reference'],
        optional: ['music_reference', 'style_guide', 'director_notes'],
        maxSize: 200,
        acceptedFormats: ['.pdf', '.doc', '.mp4', '.mov', '.wav']
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
        required: ['documentary_script', 'fact_checking_notes'],
        optional: ['visual_reference', 'expert_interviews'],
        maxSize: 150,
        acceptedFormats: ['.pdf', '.doc', '.mp4', '.mov']
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
        required: ['character_script', 'character_design', 'voice_direction'],
        optional: ['character_backstory', 'reference_audio', 'style_guide'],
        maxSize: 100,
        acceptedFormats: ['.pdf', '.doc', '.mp3', '.wav', '.mp4']
      },
      description: 'Character voice work for various media including animation, games, and interactive content',
      useCases: ['Animation characters', 'Game characters', 'Interactive media', 'Character development']
    },

    announcer: {
      id: 'announcer',
      label: 'Announcer Voice',
      category: 'commercial',
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
        timeline: '2-3 days',
        revisionRounds: 1,
        specialRequirements: ['authoritative_delivery', 'clear_pronunciation', 'broadcast_ready']
      },
      studio: {
        equipment: ['professional_microphone', 'acoustic_treatment'],
        environment: 'professional_studio',
        direction: 'client_directed',
        postProduction: true,
        mixing: false
      },
      files: {
        required: ['announcement_script'],
        optional: ['brand_guidelines', 'reference_audio', 'style_guide'],
        maxSize: 50,
        acceptedFormats: ['.pdf', '.doc', '.mp3', '.wav']
      },
      description: 'Professional announcement voice work for events, broadcasts, and public communications',
      useCases: ['Event announcements', 'Broadcast intros', 'Public announcements', 'Corporate communications']
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
        required: ['phone_script', 'menu_structure'],
        optional: ['brand_guidelines', 'pronunciation_guide', 'reference_audio'],
        maxSize: 25,
        acceptedFormats: ['.pdf', '.doc', '.txt', '.mp3']
      },
      description: 'Voice work for phone systems, IVR menus, and automated phone services',
      useCases: ['IVR systems', 'Phone menus', 'Automated messages', 'Customer service lines']
    },

    app_voice: {
      id: 'app_voice',
      label: 'App Voice Interface',
      category: 'corporate',
      pricing: {
        model: 'per_project',
        baseRate: 500,
        currency: 'USD',
        minimumAmount: 400,
        volumeDiscount: true,
        rushFee: 1.4
      },
      delivery: {
        formats: ['mp3_44khz'],
        quality: 'professional',
        timeline: '1-2 weeks',
        revisionRounds: 2,
        specialRequirements: ['friendly_tone', 'clear_pronunciation', 'consistent_delivery']
      },
      studio: {
        equipment: ['professional_microphone', 'acoustic_treatment'],
        environment: 'professional_studio',
        direction: 'client_directed',
        postProduction: true,
        mixing: false
      },
      files: {
        required: ['app_script', 'interface_guidelines'],
        optional: ['brand_guidelines', 'user_flow', 'reference_audio'],
        maxSize: 50,
        acceptedFormats: ['.pdf', '.doc', '.txt', '.mp3']
      },
      description: 'Voice interface work for mobile apps, smart devices, and digital assistants',
      useCases: ['Mobile apps', 'Smart devices', 'Digital assistants', 'Voice interfaces']
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
