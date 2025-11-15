/**
 * Auth Library
 * Centralized authentication system with provider abstraction
 *
 * Usage:
 * ```ts
 * import { useAuth, onAuthLogout } from '@/lib/auth'
 * import type { AuthUser, AuthProvider } from '@/lib/auth'
 * ```
 */

// Re-export composables
export { useAuth } from './composable'
export type { AuthUser, AuthProvider, AuthConfig, AuthProviderType } from './type'

// Re-export providers (for advanced usage)
export {
  createAuthProvider,
  getAuthConfigFromEnv,
  createDefaultAuthProvider,
  FirebaseAuthProvider,
  GisAuthProvider,
} from './provider'

// Re-export event system
export {
  emitAuthEvent,
  onAuthEvent,
  onAuthEventType,
  onAuthLogin,
  onAuthLogout,
  onAuthUserChanged,
  AuthEventType,
} from './event'
export type {
  AuthEvent,
  AuthLoginEvent,
  AuthLogoutEvent,
  AuthLoginFailedEvent,
  AuthLogoutFailedEvent,
  AuthUserChangedEvent,
} from './event'

// Re-export views (optional - for convenience)
export { AuthView } from './view'
