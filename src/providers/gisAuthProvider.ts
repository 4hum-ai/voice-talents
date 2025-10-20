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
  exp?: number
  iat?: number
}

export class GisAuthProvider implements AuthProvider {
  private config: { clientId: string; scopes?: string }
  private initialized = false
  private currentUser: AuthUser | null = null
  private currentToken: string | null = null
  private authStateCallbacks: Array<(user: AuthUser | null) => void> = []
  private pendingLoginPromise: {
    resolve: (value: { user: AuthUser; newUser?: boolean }) => void
    reject: (reason?: unknown) => void
  } | null = null
  private persistenceMode: 'local' | 'session' = 'local'
  private readonly STORAGE_KEY_USER = 'gis_auth_user'
  private readonly STORAGE_KEY_TOKEN = 'gis_auth_token'
  private readonly STORAGE_KEY_PERSISTENCE = 'gis_auth_persistence'
  private readonly STORAGE_KEY_TOKEN_EXPIRES = 'gis_auth_token_expires'

  constructor(config: { clientId: string; scopes?: string }) {
    this.config = config

    // Log configuration for debugging
    console.log('🔐 GIS: Initializing with config:', {
      clientId: config.clientId ? `${config.clientId.substring(0, 20)}...` : 'missing',
      scopes: config.scopes || 'default',
    })

    // Immediately try to restore auth state from storage (synchronous)
    this.restoreAuthStateSync()
  }

  async initialize(): Promise<void> {
    if (this.initialized) return

    // First, try to restore auth state from storage (this doesn't require Google script)
    await this.restoreAuthState()

    // Check network connectivity and environment
    await this.performDiagnostics()

    // Try to load Google Identity Services script with retry logic
    let lastError: Error | null = null
    const maxRetries = 3

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(
          `🔐 GIS: Attempting to load Google Identity Services (attempt ${attempt}/${maxRetries})`,
        )
        await this.loadGoogleScript()

        // Initialize Google Identity Services with minimal configuration
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: this.config.clientId,
            callback: this.handleCredentialResponse.bind(this),
          })

          this.initialized = true
          console.log('🔐 GIS: Successfully initialized Google Identity Services')
          return
        } else {
          throw new Error('Google Identity Services API not available after script load')
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')
        console.warn(`🔐 GIS: Attempt ${attempt} failed:`, lastError.message)

        if (attempt < maxRetries) {
          // Wait before retrying (exponential backoff)
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
          console.log(`🔐 GIS: Retrying in ${delay}ms...`)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    // If we get here, all attempts failed
    const errorMessage = `Failed to initialize Google Identity Services after ${maxRetries} attempts. Last error: ${lastError?.message || 'Unknown error'}`
    console.error('🔐 GIS:', errorMessage)
    throw new Error(errorMessage)
  }

  private async performDiagnostics(): Promise<void> {
    console.log('🔐 GIS: Running diagnostics...')

    const diagnostics = {
      online: navigator.onLine,
      userAgent: navigator.userAgent,
      location: window.location.href,
      protocol: window.location.protocol,
      host: window.location.host,
      cookiesEnabled: navigator.cookieEnabled,
      language: navigator.language,
      timestamp: new Date().toISOString(),
    }

    console.log('🔐 GIS: Environment diagnostics:', diagnostics)

    // Test basic network connectivity
    if (!navigator.onLine) {
      console.warn('🔐 GIS: Browser reports offline status')
    }

    // Check if we're in a secure context (required for some Google services)
    if (!window.isSecureContext) {
      console.warn('🔐 GIS: Not in secure context (HTTPS required for production)')
    }

    // Check for existing Google scripts or APIs
    const existingGoogleScripts = document.querySelectorAll('script[src*="google"]')
    if (existingGoogleScripts.length > 0) {
      console.log(
        '🔐 GIS: Found existing Google scripts:',
        Array.from(existingGoogleScripts).map((s) => s.getAttribute('src')),
      )
    }
  }

  private async loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.id) {
        console.log('🔐 GIS: Google Identity Services already loaded')
        resolve()
        return
      }

      // Check if script is already loading
      const existingScript = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]',
      )
      if (existingScript) {
        console.log('🔐 GIS: Google script already loading, waiting...')
        // Script is already loading, wait for it
        const checkGoogleLoaded = () => {
          if (window.google?.accounts?.id) {
            console.log('🔐 GIS: Google Identity Services loaded via existing script')
            resolve()
          } else {
            setTimeout(checkGoogleLoaded, 100)
          }
        }
        checkGoogleLoaded()
        return
      }

      console.log('🔐 GIS: Creating new Google Identity Services script')
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true

      let timeoutId: number | null = null

      script.onload = () => {
        console.log('🔐 GIS: Google script loaded, checking API availability...')
        if (timeoutId) clearTimeout(timeoutId)

        // Give Google script time to initialize
        setTimeout(() => {
          if (window.google?.accounts?.id) {
            console.log('🔐 GIS: Google Identity Services API is available')
            resolve()
          } else {
            console.error('🔐 GIS: Google script loaded but API not available')
            reject(new Error('Google Identity Services script loaded but API not available'))
          }
        }, 200) // Increased timeout for API initialization
      }

      script.onerror = (error) => {
        if (timeoutId) clearTimeout(timeoutId)
        console.error('🔐 GIS: Failed to load Google Identity Services script:', error)

        // Provide more detailed error information
        const errorDetails = {
          type: 'script_load_error',
          url: script.src,
          userAgent: navigator.userAgent,
          online: navigator.onLine,
          timestamp: new Date().toISOString(),
        }
        console.error('🔐 GIS: Error details:', errorDetails)

        reject(
          new Error(
            `Failed to load Google Identity Services script. This could be due to network issues, ad blockers, or corporate firewall restrictions.`,
          ),
        )
      }

      // Set a timeout for script loading
      timeoutId = setTimeout(() => {
        console.error('🔐 GIS: Google Identity Services script loading timed out')
        reject(new Error('Google Identity Services script loading timed out after 15 seconds'))
      }, 15000) // Increased timeout to 15 seconds

      console.log('🔐 GIS: Appending Google script to document head')
      document.head.appendChild(script)
    })
  }

  private getStorage(): Storage {
    return this.persistenceMode === 'local' ? localStorage : sessionStorage
  }

  private saveAuthState(user: AuthUser, token: string, expiresIn?: number): void {
    try {
      const storage = this.getStorage()
      const userJson = JSON.stringify(user)

      // Calculate expiration time (default to 1 hour for OAuth tokens)
      const expirationTime = expiresIn ? Date.now() + expiresIn * 1000 : Date.now() + 3600 * 1000

      storage.setItem(this.STORAGE_KEY_USER, userJson)
      storage.setItem(this.STORAGE_KEY_TOKEN, token)
      storage.setItem(this.STORAGE_KEY_PERSISTENCE, this.persistenceMode)
      storage.setItem(this.STORAGE_KEY_TOKEN_EXPIRES, expirationTime.toString())
    } catch (error) {
      console.error('Failed to save auth state:', error)
    }
  }

  private clearAuthState(): void {
    try {
      // Clear from both storage types to be safe
      localStorage.removeItem(this.STORAGE_KEY_USER)
      localStorage.removeItem(this.STORAGE_KEY_TOKEN)
      localStorage.removeItem(this.STORAGE_KEY_PERSISTENCE)
      localStorage.removeItem(this.STORAGE_KEY_TOKEN_EXPIRES)
      sessionStorage.removeItem(this.STORAGE_KEY_USER)
      sessionStorage.removeItem(this.STORAGE_KEY_TOKEN)
      sessionStorage.removeItem(this.STORAGE_KEY_PERSISTENCE)
      sessionStorage.removeItem(this.STORAGE_KEY_TOKEN_EXPIRES)
    } catch (error) {
      console.error('Failed to clear auth state:', error)
    }
  }

  private restoreAuthStateSync(): void {
    try {
      // Try to restore from localStorage first, then sessionStorage
      let storage = localStorage
      let userData = storage.getItem(this.STORAGE_KEY_USER)
      let token = storage.getItem(this.STORAGE_KEY_TOKEN)
      let persistence = storage.getItem(this.STORAGE_KEY_PERSISTENCE)

      // If not found in localStorage, try sessionStorage
      if (!userData || !token) {
        storage = sessionStorage
        userData = storage.getItem(this.STORAGE_KEY_USER)
        token = storage.getItem(this.STORAGE_KEY_TOKEN)
        persistence = storage.getItem(this.STORAGE_KEY_PERSISTENCE)
      }

      if (userData && token) {
        const user: AuthUser = JSON.parse(userData)

        // Use the same token validation logic
        if (this.isTokenValid(token)) {
          this.currentUser = user
          this.currentToken = token
          this.persistenceMode = (persistence as 'local' | 'session') || 'local'
        } else {
          this.clearAuthState()
        }
      }
    } catch (error) {
      console.error('Failed to restore auth state:', error)
      this.clearAuthState()
    }
  }

  private async restoreAuthState(): Promise<void> {
    try {
      // Try to restore from localStorage first, then sessionStorage
      let storage = localStorage
      let userData = storage.getItem(this.STORAGE_KEY_USER)
      let token = storage.getItem(this.STORAGE_KEY_TOKEN)
      let persistence = storage.getItem(this.STORAGE_KEY_PERSISTENCE)

      // If not found in localStorage, try sessionStorage
      if (!userData || !token) {
        storage = sessionStorage
        userData = storage.getItem(this.STORAGE_KEY_USER)
        token = storage.getItem(this.STORAGE_KEY_TOKEN)
        persistence = storage.getItem(this.STORAGE_KEY_PERSISTENCE)
      }

      if (userData && token) {
        const user: AuthUser = JSON.parse(userData)

        // Validate the token by checking if it's expired
        if (this.isTokenValid(token)) {
          this.currentUser = user
          this.currentToken = token
          this.persistenceMode = (persistence as 'local' | 'session') || 'local'
          this.notifyAuthStateChange(user)
        } else {
          this.clearAuthState()
        }
      }
    } catch (error) {
      console.error('Failed to restore auth state:', error)
      this.clearAuthState()
    }
  }

  private isTokenValid(token: string): boolean {
    try {
      // Check if it's a JWT token (has 3 parts separated by dots)
      const parts = token.split('.')
      if (parts.length === 3) {
        // It's a JWT token, validate it
        const payload = this.decodeJwtPayload(token)
        if (!payload) {
          return false
        }

        // If token has exp claim, check if it's not expired
        if (payload.exp) {
          const now = Math.floor(Date.now() / 1000)
          const exp = payload.exp
          const isValid = exp > now + 300 // Add 5 minute buffer to account for clock skew

          if (!isValid) {
            return false
          }
        }

        return true
      } else if (
        token.startsWith('ya29.') ||
        token.startsWith('ya30.') ||
        token.startsWith('ya31.')
      ) {
        // It's an OAuth access token (starts with ya29, ya30, ya31, etc.)
        // Check if we have stored expiration time
        const storage = this.getStorage()
        const expirationTime = storage.getItem(this.STORAGE_KEY_TOKEN_EXPIRES)

        if (expirationTime) {
          const now = Date.now()
          const exp = parseInt(expirationTime, 10)
          const isValid = exp > now

          if (!isValid) {
            return false
          }
        }

        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Error validating token:', error)
      return false
    }
  }

  private handleCredentialResponse(response: GoogleCredentialResponse): void {
    // Store the credential token
    this.currentToken = response.credential

    // Try to decode the JWT token
    const payload = this.decodeJwtPayload(response.credential)

    if (payload) {
      const user: AuthUser = {
        id: payload.sub,
        email: payload.email,
        displayName: payload.name,
        photoURL: payload.picture,
      }
      this.currentUser = user

      // Save auth state to storage
      this.saveAuthState(user, response.credential)

      this.notifyAuthStateChange(user)

      // If there's a pending Promise, resolve it
      if (this.pendingLoginPromise) {
        this.pendingLoginPromise.resolve({ user, newUser: false })
        this.pendingLoginPromise = null
      }
    } else {
      if (this.pendingLoginPromise) {
        this.pendingLoginPromise.reject(new Error('Failed to decode JWT payload'))
        this.pendingLoginPromise = null
      }
    }
  }

  private decodeJwtPayload(token: string): GoogleJwtPayload | null {
    try {
      if (!token || typeof token !== 'string') {
        return null
      }

      const parts = token.split('.')

      if (parts.length !== 3) {
        return null
      }

      const base64Url = parts[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      )

      const parsed = JSON.parse(jsonPayload) as GoogleJwtPayload
      return parsed
    } catch {
      return null
    }
  }

  private notifyAuthStateChange(user: AuthUser | null): void {
    this.authStateCallbacks.forEach((callback) => callback(user))
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    // If not initialized yet, initialize first (which will restore auth state)
    if (!this.initialized) {
      await this.initialize()
    }

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
    throw new Error(
      'Email/password login not supported with Google Identity Services. Use OAuth providers instead.',
    )
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
          this.handleCredentialResponse(response)
        } catch (error) {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // If One Tap is not available, try popup
            this.tryPopupLogin()
          }
        })
      } catch {
        this.tryPopupLogin()
      }
    })
  }

  private tryPopupLogin(): void {
    try {
      if (!window.google?.accounts?.oauth2) {
        if (this.pendingLoginPromise) {
          this.pendingLoginPromise.reject(new Error('Google OAuth2 not available'))
          this.pendingLoginPromise = null
        }
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = (window.google.accounts.oauth2 as any).initTokenClient({
        client_id: this.config.clientId,
        scope: this.config.scopes || 'openid email profile',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback: (response: any) => {
          if (response.access_token) {
            // Use the access token directly to get user info
            this.fetchUserInfoWithToken(response.access_token)
          } else if (response.error) {
            if (this.pendingLoginPromise) {
              this.pendingLoginPromise.reject(new Error('OAuth error: ' + response.error))
              this.pendingLoginPromise = null
            }
          } else {
            if (this.pendingLoginPromise) {
              this.pendingLoginPromise.reject(new Error('No access token received'))
              this.pendingLoginPromise = null
            }
          }
        },
      })

      client.requestAccessToken()
    } catch (error) {
      if (this.pendingLoginPromise) {
        this.pendingLoginPromise.reject(new Error('Popup login failed: ' + error))
        this.pendingLoginPromise = null
      }
    }
  }

  private async fetchUserInfoWithToken(accessToken: string): Promise<void> {
    try {
      // Use the access token to get user info from Google's userinfo endpoint
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!userInfoResponse.ok) {
        throw new Error(`Failed to fetch user info: ${userInfoResponse.statusText}`)
      }

      const userInfo = await userInfoResponse.json()

      const user: AuthUser = {
        id: userInfo.id,
        email: userInfo.email,
        displayName: userInfo.name,
        photoURL: userInfo.picture,
      }

      this.currentUser = user
      this.currentToken = accessToken

      // Save auth state to storage with expiration time (OAuth tokens typically expire in 1 hour)
      this.saveAuthState(user, accessToken, 3600) // 3600 seconds = 1 hour

      this.notifyAuthStateChange(user)

      // Resolve the pending Promise
      if (this.pendingLoginPromise) {
        this.pendingLoginPromise.resolve({ user, newUser: false })
        this.pendingLoginPromise = null
      }
    } catch (error) {
      if (this.pendingLoginPromise) {
        this.pendingLoginPromise.reject(new Error('Failed to fetch user info: ' + error))
        this.pendingLoginPromise = null
      }
    }
  }

  async loginWithOAuth(
    provider: 'google' | 'github' | 'microsoft' | 'apple',
  ): Promise<{ user: AuthUser; newUser?: boolean }> {
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

    // Clear persisted auth state
    this.clearAuthState()

    this.notifyAuthStateChange(null)
  }

  async setPersistenceMode(mode: 'local' | 'session'): Promise<void> {
    const previousMode = this.persistenceMode
    this.persistenceMode = mode

    // If user is currently logged in and persistence mode changed, migrate the data
    if (this.currentUser && this.currentToken && previousMode !== mode) {
      // Clear old storage
      const oldStorage = previousMode === 'local' ? localStorage : sessionStorage
      oldStorage.removeItem(this.STORAGE_KEY_USER)
      oldStorage.removeItem(this.STORAGE_KEY_TOKEN)
      oldStorage.removeItem(this.STORAGE_KEY_PERSISTENCE)
      oldStorage.removeItem(this.STORAGE_KEY_TOKEN_EXPIRES)

      // Save to new storage
      this.saveAuthState(this.currentUser, this.currentToken)
    }
  }

  async getIdToken(): Promise<string | null> {
    return this.currentToken
  }
}
