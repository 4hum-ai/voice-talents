/**
 * Form data and validation interfaces
 */

import type { Media } from './models'

export interface FormData {
  [key: string]: string | number | boolean | string[] | File | undefined
}

export interface VoiceSampleFormData {
  [voiceType: string]: Media
}

export interface OnboardingData {
  [key: string]: unknown
}
