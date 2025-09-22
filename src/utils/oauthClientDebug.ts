/**
 * OAuth Client Debug Tool
 * Helps verify OAuth client configuration and provides direct links
 */

export function debugOAuthClient() {
  console.group('🔍 OAuth Client Debug Tool')
  
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const currentOrigin = window.location.origin
  
  console.log('📍 Current Origin:', currentOrigin)
  console.log('🆔 Client ID:', clientId)
  
  if (clientId) {
    // Extract project ID from client ID (first part before the dash)
    const projectId = clientId.split('-')[0]
    
    console.log('🏗️ Project ID:', projectId)
    
    // Generate direct links
    const credentialsUrl = `https://console.cloud.google.com/apis/credentials?project=${projectId}`
    const consentScreenUrl = `https://console.cloud.google.com/apis/credentials/consent?project=${projectId}`
    
    console.log('🔗 Direct Links:')
    console.log('  - OAuth Credentials:', credentialsUrl)
    console.log('  - Consent Screen:', consentScreenUrl)
    
    console.log('📋 Required Origins to Add:')
    console.log('  -', currentOrigin)
    console.log('  -', currentOrigin + '/')
    console.log('  -', currentOrigin + '/auth')
    console.log('  - http://localhost:5173')
    console.log('  - http://localhost:5173/')
    console.log('  - http://localhost:5173/auth')
    console.log('  - http://127.0.0.1:5173')
    console.log('  - http://127.0.0.1:5173/')
    console.log('  - http://127.0.0.1:5173/auth')
    
    console.log('📋 Required Redirect URIs to Add:')
    console.log('  -', currentOrigin)
    console.log('  -', currentOrigin + '/')
    console.log('  -', currentOrigin + '/auth')
    console.log('  - http://localhost:5173')
    console.log('  - http://localhost:5173/')
    console.log('  - http://localhost:5173/auth')
    console.log('  - http://127.0.0.1:5173')
    console.log('  - http://127.0.0.1:5173/')
    console.log('  - http://127.0.0.1:5173/auth')
    
    console.log('⚠️  Important Notes:')
    console.log('  1. Make sure your OAuth consent screen is published or in testing mode')
    console.log('  2. Add your email as a test user if in testing mode')
    console.log('  3. Wait 1-2 minutes after making changes for them to propagate')
    console.log('  4. Clear browser cache after making changes')
    
    // Return the URLs for easy copying
    return {
      currentOrigin,
      clientId,
      projectId,
      credentialsUrl,
      consentScreenUrl,
    }
  } else {
    console.error('❌ No Google Client ID configured')
    return null
  }
  
  console.groupEnd()
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).debugOAuthClient = debugOAuthClient
}
