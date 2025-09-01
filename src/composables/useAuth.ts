import { ref, readonly, computed } from 'vue'
import { initializeApp, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  type User as FirebaseUser,
} from 'firebase/auth'

export interface AuthUser {
  id: string
  email: string
  displayName?: string
  photoURL?: string
}

const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY,
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID,
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID,
}

let app: FirebaseApp | null = null
let authInstance: ReturnType<typeof getAuth> | null = null

function ensureAuthInitialized() {
  if (!app) {
    app = initializeApp(firebaseConfig)
  }
  if (!authInstance) {
    authInstance = getAuth(app)
    void setPersistence(authInstance, browserLocalPersistence).catch(() => {})
  }
  return authInstance
}

export function useAuth() {
  const isLoading = ref(true)
  const error = ref<string | null>(null)
  const user = ref<AuthUser | null>(null)

  const convertFirebaseUser = (firebaseUser: FirebaseUser): AuthUser => {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || undefined,
      photoURL: firebaseUser.photoURL || undefined,
    }
  }

  const getCurrentUser = async (): Promise<AuthUser | null> => {
    const auth = ensureAuthInitialized()
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const converted = convertFirebaseUser(firebaseUser)
          user.value = converted
          resolve(converted)
        } else {
          user.value = null
          resolve(null)
        }
        isLoading.value = false
        unsubscribe()
      })
    })
  }

  const subscribe = (cb: (u: AuthUser | null) => void): (() => void) => {
    const auth = ensureAuthInitialized()
    const off = onAuthStateChanged(auth, (firebaseUser) => {
      const converted = firebaseUser ? convertFirebaseUser(firebaseUser) : null
      user.value = converted
      cb(converted)
      isLoading.value = false
    })
    return off
  }

  const login = async (email: string, password: string): Promise<AuthUser> => {
    try {
      error.value = null
      const auth = ensureAuthInitialized()
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const converted = convertFirebaseUser(cred.user)
      user.value = converted
      return converted
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      error.value = message
      throw new Error(message)
    }
  }

  const loginWithGoogle = async (): Promise<{
    user: AuthUser
    newUser?: boolean
  }> => {
    try {
      error.value = null
      const auth = ensureAuthInitialized()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const converted = convertFirebaseUser(result.user)
      const info = getAdditionalUserInfo(result)
      user.value = converted
      return { user: converted, newUser: info?.isNewUser }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google login failed'
      error.value = message
      throw new Error(message)
    }
  }

  const loginWithOAuth = async (
    providerName: 'google' | 'github' | 'microsoft' | 'apple',
  ): Promise<{ user: AuthUser; newUser?: boolean }> => {
    try {
      error.value = null
      const auth = ensureAuthInitialized()
      let providerInstance: GoogleAuthProvider | GithubAuthProvider | OAuthProvider
      switch (providerName) {
        case 'google':
          providerInstance = new GoogleAuthProvider()
          break
        case 'github':
          providerInstance = new GithubAuthProvider()
          break
        case 'microsoft':
          providerInstance = new OAuthProvider('microsoft.com')
          break
        case 'apple':
          providerInstance = new OAuthProvider('apple.com')
          break
      }
      const result = await signInWithPopup(auth, providerInstance as any)
      const converted = convertFirebaseUser(result.user)
      const info = getAdditionalUserInfo(result)
      user.value = converted
      return { user: converted, newUser: info?.isNewUser }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'OAuth login failed'
      error.value = message
      throw new Error(message)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      error.value = null
      const auth = ensureAuthInitialized()
      await signOut(auth)
      user.value = null
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed'
      error.value = message
      throw new Error(message)
    }
  }

  const isAuthenticated = computed(() => !!user.value)

  const setPersistenceMode = async (mode: 'local' | 'session') => {
    const auth = ensureAuthInitialized()
    const persistence = mode === 'local' ? browserLocalPersistence : browserSessionPersistence
    await setPersistence(auth, persistence).catch(() => {})
  }

  return {
    user: readonly(user),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isAuthenticated,
    getCurrentUser,
    subscribe,
    login,
    loginWithGoogle,
    loginWithOAuth,
    logout,
    setPersistenceMode,
  }
}
