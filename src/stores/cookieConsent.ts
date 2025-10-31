import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CookiePreferences {
  necessary: boolean // Always true, cannot be disabled
  functional: boolean
  analytics: boolean
  marketing: boolean
}

const STORAGE_KEY = 'cookie-consent'
const CONSENT_VERSION = '1.0'

interface StoredConsent {
  version: string
  preferences: CookiePreferences
  timestamp: string
}

export const useCookieConsentStore = defineStore('cookieConsent', () => {
  const hasConsent = ref<boolean>(false)
  const preferences = ref<CookiePreferences>({
    necessary: true, // Always true
    functional: false,
    analytics: false,
    marketing: false,
  })

  // Initialize from localStorage
  const initialize = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data: StoredConsent = JSON.parse(stored)
        if (data.version === CONSENT_VERSION && data.preferences) {
          preferences.value = { ...data.preferences, necessary: true }
          hasConsent.value = true
          return
        }
      }
    } catch (error) {
      console.error('Failed to load cookie consent:', error)
    }
    hasConsent.value = false
  }

  // Save consent preferences
  const saveConsent = (newPreferences: Partial<CookiePreferences>) => {
    preferences.value = {
      ...preferences.value,
      ...newPreferences,
      necessary: true, // Always keep necessary cookies enabled
    }
    hasConsent.value = true

    const data: StoredConsent = {
      version: CONSENT_VERSION,
      preferences: preferences.value,
      timestamp: new Date().toISOString(),
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      // Trigger consent event for other parts of the app
      window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: preferences.value }))
    } catch (error) {
      console.error('Failed to save cookie consent:', error)
    }
  }

  // Accept all cookies
  const acceptAll = () => {
    saveConsent({
      functional: true,
      analytics: true,
      marketing: true,
    })
  }

  // Reject all optional cookies
  const rejectAll = () => {
    saveConsent({
      functional: false,
      analytics: false,
      marketing: false,
    })
  }

  // Check if specific cookie type is allowed
  const isAllowed = (type: keyof CookiePreferences) => {
    if (type === 'necessary') return true
    return hasConsent.value && preferences.value[type] === true
  }

  // Withdraw consent (reset)
  const withdrawConsent = () => {
    hasConsent.value = false
    preferences.value = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    }
    try {
      localStorage.removeItem(STORAGE_KEY)
      window.dispatchEvent(new CustomEvent('cookie-consent-withdrawn'))
    } catch (error) {
      console.error('Failed to withdraw consent:', error)
    }
  }

  // Computed properties
  const hasRequiredConsent = computed(() => hasConsent.value)

  // Initialize on store creation
  initialize()

  return {
    hasConsent,
    preferences,
    hasRequiredConsent,
    initialize,
    saveConsent,
    acceptAll,
    rejectAll,
    isAllowed,
    withdrawConsent,
  }
})
