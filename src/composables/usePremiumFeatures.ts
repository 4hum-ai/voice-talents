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
  stripePriceId: string // Stripe Price ID (e.g., price_1234)
  availableFor: JobApproach[]
}

const premiumFeaturesConfig: PremiumFeature[] = [
  {
    id: 'talentOutreach',
    label: 'Talent Outreach',
    description:
      'Our casting manager will reach out to top talent on your behalf and handle initial negotiations',
    price: 25,
    stripePriceId: 'price_1SRZVSKSR3BkeOV58eFFFWZy',
    availableFor: ['talent_only'],
  },
  {
    id: 'autoPrompts',
    label: 'Auto Prompts',
    description:
      'Automatically generate optimized prompts and tags for your transcripts to improve AI voice generation quality',
    price: 10,
    stripePriceId: 'price_1SRZXDKSR3BkeOV5NuHyHt5G',
    availableFor: ['ai_synthesis'],
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
