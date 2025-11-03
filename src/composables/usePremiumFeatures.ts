/**
 * Premium Features Composable
 * Defines which premium features are available for each job approach and their pricing
 */

export type JobApproach = 'talent_only' | 'ai_synthesis' | 'hybrid_approach'

export interface PremiumFeature {
  id: string
  label: string
  description: string
  price: number
  availableFor: JobApproach[]
}

const premiumFeaturesConfig: PremiumFeature[] = [
  {
    id: 'talentOutreach',
    label: 'Talent Outreach',
    description:
      'Our casting manager will reach out to top talent on your behalf and handle initial negotiations',
    price: 25,
    availableFor: ['talent_only', 'hybrid_approach'], // Not available for AI
  },
  {
    id: 'aiMatching',
    label: 'AI Matching',
    description:
      'Use AI to automatically match your project with the most suitable talent based on voice characteristics and experience',
    price: 15,
    availableFor: ['talent_only', 'ai_synthesis', 'hybrid_approach'], // Available for all
  },
  {
    id: 'autoPrompts',
    label: 'Auto Prompts',
    description:
      'Automatically generate optimized prompts and tags for your transcripts to improve AI voice generation quality',
    price: 10,
    availableFor: ['ai_synthesis', 'hybrid_approach'], // Only for AI-based approaches
  },
]

/**
 * Get available premium features for a specific job approach
 */
export function getAvailablePremiumFeatures(approach: JobApproach): PremiumFeature[] {
  return premiumFeaturesConfig.filter((feature) => feature.availableFor.includes(approach))
}

/**
 * Get premium feature by ID
 */
export function getPremiumFeatureById(id: string): PremiumFeature | undefined {
  return premiumFeaturesConfig.find((feature) => feature.id === id)
}

/**
 * Get all premium features configuration
 */
export function getAllPremiumFeatures(): PremiumFeature[] {
  return premiumFeaturesConfig
}

/**
 * Composable for premium features functionality
 */
export function usePremiumFeatures() {
  return {
    getAvailablePremiumFeatures,
    getPremiumFeatureById,
    getAllPremiumFeatures,
    premiumFeaturesConfig,
  }
}
