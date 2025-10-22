/**
 * Onboarding and account setup interfaces
 */

export interface AccountInformationData {
  companyName: string
  contactName: string
  email: string
  phone: string
  website: string
  location: string
  timezone: string
  industry: string
  companySize: string
  description: string
}

export interface OnboardingData {
  [key: string]: unknown
}
