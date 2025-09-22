/**
 * Google Identity Services Authentication Provider
 * Implements OAuth2 authentication using Google Identity Services
 */

import type { AuthUser, AuthProvider } from '@/types/auth'

interface GoogleCredentialResponse {
  credential: string
}

interface GoogleJwtPayload {
  sub: string
  email: string
  name: string
  picture: string
}

export class GisAuthProvider implements AuthProvider {
  private config: { clientId: string }
  private initialized = false
  private currentUser: AuthUser | null = null
  private currentToken: string | null = null
  private authStateCallbacks: Array<(user: AuthUser | null) => void> = []
  private pendingLoginPromise: { resolve: (value: { user: AuthUser; newUser?: boolean }) => void; reject: (reason?: unknown) => void } | null = null

  constructor(config: { clientId: string }) {
    this.config = config
  }

  async initialize(): Promise<void> {
    if (this.initialized) return

    // Load Google Identity Services script
    await this.loadGoogleScript()
    
    // Initialize Google Identity Services with minimal configuration
    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: this.config.clientId,
        callback: this.handleCredentialResponse.bind(this),
      })
      
      this.initialized = true
    } else {
      throw new Error('Failed to load Google Identity Services')
    }
  }

  private async loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.id) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'))
      document.head.appendChild(script)
    })
  }

  private handleCredentialResponse(response: GoogleCredentialResponse): void {
    console.log('🔐 GIS Provider: handleCredentialResponse called with:', response)
    
    // Store the credential token
    this.currentToken = response.credential
    
    // Try to decode the JWT token
    const payload = this.decodeJwtPayload(response.credential)
    console.log('🔐 GIS Provider: Decoded JWT payload:', payload)
    
    if (payload) {
      const user: AuthUser = {
        id: payload.sub,
        email: payload.email,
        displayName: payload.name,
        photoURL: payload.picture,
      }
      console.log('🔐 GIS Provider: Created user object:', user)
      this.currentUser = user
      console.log('🔐 GIS Provider: Set currentUser to:', this.currentUser)
      this.notifyAuthStateChange(user)
      console.log('✅ GIS Provider: User authentication successful!')
      
      // If there's a pending Promise, resolve it
      if (this.pendingLoginPromise) {
        console.log('🔄 GIS Provider: Resolving pending Promise with user:', user)
        this.pendingLoginPromise.resolve({ user, newUser: false })
        this.pendingLoginPromise = null
      }
    } else {
      console.error('❌ GIS Provider: Failed to decode JWT payload')
      if (this.pendingLoginPromise) {
        this.pendingLoginPromise.reject(new Error('Failed to decode JWT payload'))
        this.pendingLoginPromise = null
      }
    }
  }

  private decodeJwtPayload(token: string): GoogleJwtPayload | null {
    try {
      console.log('🔍 Attempting to decode JWT token...')
      console.log('Token length:', token.length)
      console.log('Token preview:', token.substring(0, 50) + '...')
      
      if (!token || typeof token !== 'string') {
        console.error('❌ Invalid token provided')
        return null
      }
      
      const parts = token.split('.')
      console.log('JWT parts count:', parts.length)
      
      if (parts.length !== 3) {
        console.error('❌ Invalid JWT format - expected 3 parts, got', parts.length)
        return null
      }
      
      const base64Url = parts[1]
      console.log('Base64 URL part length:', base64Url.length)
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      
      console.log('Decoded JSON payload:', jsonPayload)
      const parsed = JSON.parse(jsonPayload) as GoogleJwtPayload
      console.log('✅ JWT decoded successfully:', parsed)
      return parsed
    } catch (error) {
      console.error('❌ Failed to decode JWT payload:', error)
      return null
    }
  }

  private notifyAuthStateChange(user: AuthUser | null): void {
    this.authStateCallbacks.forEach(callback => callback(user))
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return this.currentUser
  }

  subscribe(callback: (user: AuthUser | null) => void): () => void {
    this.authStateCallbacks.push(callback)
    return () => {
      const index = this.authStateCallbacks.indexOf(callback)
      if (index > -1) {
        this.authStateCallbacks.splice(index, 1)
      }
    }
  }

  async login(): Promise<AuthUser> {
    throw new Error('Email/password login not supported with Google Identity Services. Use OAuth providers instead.')
  }

  async loginWithGoogle(): Promise<{ user: AuthUser; newUser?: boolean }> {
    await this.initialize()
    
    return new Promise((resolve, reject) => {
      if (!window.google?.accounts?.id) {
        reject(new Error('Google Identity Services not loaded'))
        return
      }

      // Store the Promise resolvers
      this.pendingLoginPromise = { resolve, reject }

      // Set up a one-time callback
      const originalCallback = window.google.accounts.id.callback
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.google.accounts.id.callback = (response: any) => {
        try {
          console.log('🔄 GIS Provider: Callback triggered with response:', response)
          this.handleCredentialResponse(response)
        } catch (error) {
          console.error('❌ GIS Provider: Error in callback:', error)
          if (this.pendingLoginPromise) {
            this.pendingLoginPromise.reject(error)
            this.pendingLoginPromise = null
          }
        } finally {
          // Restore original callback
          if (window.google?.accounts?.id) {
            window.google.accounts.id.callback = originalCallback
          }
        }
      }

      // Try One Tap first for immediate login
      try {
        console.log('🔄 GIS Provider: Attempting Google One Tap...')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.google.accounts.id.prompt((notification: any) => {
          console.log('🔄 GIS Provider: One Tap notification:', notification)
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('🔄 GIS Provider: One Tap not available, trying popup...')
            // If One Tap is not available, try popup
            this.tryPopupLogin()
          }
        })
      } catch {
        console.log('🔄 GIS Provider: One Tap failed, trying popup...')
        this.tryPopupLogin()
      }
    })
  }

  private tryPopupLogin(): void {
    try {
      if (!window.google?.accounts?.oauth2) {
        console.error('❌ GIS Provider: Google OAuth2 not available for popup')
        if (this.pendingLoginPromise) {
          this.pendingLoginPromise.reject(new Error('Google OAuth2 not available'))
          this.pendingLoginPromise = null
        }
        return
      }

      console.log('🔄 GIS Provider: Starting popup login...')
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = (window.google.accounts.oauth2 as any).initTokenClient({
        client_id: this.config.clientId,
        scope: 'openid email profile',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback: (response: any) => {
          console.log('🔄 GIS Provider: Popup callback received:', response)
          if (response.access_token) {
            // Use the access token directly to get user info
            this.fetchUserInfoWithToken(response.access_token)
          } else if (response.error) {
            console.error('❌ GIS Provider: OAuth error:', response.error)
            if (this.pendingLoginPromise) {
              this.pendingLoginPromise.reject(new Error('OAuth error: ' + response.error))
              this.pendingLoginPromise = null
            }
          } else {
            console.error('❌ GIS Provider: No access token received from popup')
            if (this.pendingLoginPromise) {
              this.pendingLoginPromise.reject(new Error('No access token received'))
              this.pendingLoginPromise = null
            }
          }
        },
      })

      client.requestAccessToken()
    } catch (error) {
      console.error('❌ GIS Provider: Popup login failed:', error)
      if (this.pendingLoginPromise) {
        this.pendingLoginPromise.reject(new Error('Popup login failed: ' + error))
        this.pendingLoginPromise = null
      }
    }
  }

  private async fetchUserInfoWithToken(accessToken: string): Promise<void> {
    try {
      console.log('🔄 GIS Provider: Fetching user info with access token...')
      
      // Use the access token to get user info from Google's userinfo endpoint
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!userInfoResponse.ok) {
        throw new Error(`Failed to fetch user info: ${userInfoResponse.statusText}`)
      }

      const userInfo = await userInfoResponse.json()
      console.log('🔄 GIS Provider: User info received:', userInfo)

      const user: AuthUser = {
        id: userInfo.id,
        email: userInfo.email,
        displayName: userInfo.name,
        photoURL: userInfo.picture,
      }

      this.currentUser = user
      this.currentToken = accessToken
      this.notifyAuthStateChange(user)
      
      console.log('✅ GIS Provider: Popup authentication successful!')
      
      // Resolve the pending Promise
      if (this.pendingLoginPromise) {
        this.pendingLoginPromise.resolve({ user, newUser: false })
        this.pendingLoginPromise = null
      }
      
    } catch (error) {
      console.error('❌ GIS Provider: Failed to fetch user info:', error)
      if (this.pendingLoginPromise) {
        this.pendingLoginPromise.reject(new Error('Failed to fetch user info: ' + error))
        this.pendingLoginPromise = null
      }
    }
  }

  async loginWithOAuth(provider: 'google' | 'github' | 'microsoft' | 'apple'): Promise<{ user: AuthUser; newUser?: boolean }> {
    if (provider === 'google') {
      return this.loginWithGoogle()
    }
    throw new Error(`OAuth provider ${provider} not supported`)
  }

  async logout(): Promise<void> {
    await this.initialize()
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect()
    }
    this.currentUser = null
    this.currentToken = null
    this.notifyAuthStateChange(null)
  }

  async setPersistenceMode(): Promise<void> {
    // Not applicable for Google Identity Services
  }

  async getIdToken(): Promise<string | null> {
    return this.currentToken
  }
}
