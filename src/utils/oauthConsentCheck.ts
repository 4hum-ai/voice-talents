/**
 * OAuth Consent Screen Checker
 * Helps verify OAuth consent screen configuration
 */

export function checkOAuthConsentScreen() {
  console.group('🔍 OAuth Consent Screen Check')
  
  // Check if we can access the consent screen
  const consentScreenUrl = `https://console.cloud.google.com/apis/credentials/consent?project=${import.meta.env.VITE_GOOGLE_CLIENT_ID?.split('-')[0] || 'unknown'}`
  
  console.log('📋 OAuth Consent Screen URL:', consentScreenUrl)
  console.log('⚠️  Please verify the following in your OAuth consent screen:')
  console.log('   1. Publishing status: "In production" or "Testing"')
  console.log('   2. User type: "External" or "Internal"')
  console.log('   3. Authorized domains include: localhost, 127.0.0.1, 4hum.ai')
  console.log('   4. Test users (if in testing mode) include your email')
  
  console.groupEnd()
  
  return {
    consentScreenUrl,
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  }
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).checkOAuthConsentScreen = checkOAuthConsentScreen
}
