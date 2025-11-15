/**
 * Auth Event System
 * Event sourcing pattern for authentication events
 */

import { useEventBus } from '@vueuse/core'

/**
 * Authentication event types
 */
export enum AuthEventType {
  LOGIN = 'auth:login',
  LOGOUT = 'auth:logout',
  LOGIN_FAILED = 'auth:login-failed',
  LOGOUT_FAILED = 'auth:logout-failed',
  USER_CHANGED = 'auth:user-changed',
}

/**
 * Auth event payloads
 */
export interface AuthLoginEvent {
  type: AuthEventType.LOGIN
  user: import('../type').AuthUser
  isNewUser?: boolean
}

export interface AuthLogoutEvent {
  type: AuthEventType.LOGOUT
}

export interface AuthLoginFailedEvent {
  type: AuthEventType.LOGIN_FAILED
  error: string
}

export interface AuthLogoutFailedEvent {
  type: AuthEventType.LOGOUT_FAILED
  error: string
}

export interface AuthUserChangedEvent {
  type: AuthEventType.USER_CHANGED
  user: import('../type').AuthUser | null
}

export type AuthEvent =
  | AuthLoginEvent
  | AuthLogoutEvent
  | AuthLoginFailedEvent
  | AuthLogoutFailedEvent
  | AuthUserChangedEvent

/**
 * Auth event bus
 */
const authEventBus = useEventBus<AuthEvent>('auth:events')

/**
 * Emit an authentication event
 */
export function emitAuthEvent(event: AuthEvent): void {
  authEventBus.emit(event)
}

/**
 * Subscribe to authentication events
 * @param callback - Function to call when an event is emitted
 * @returns Unsubscribe function
 */
export function onAuthEvent(callback: (event: AuthEvent) => void): () => void {
  return authEventBus.on(callback)
}

/**
 * Subscribe to a specific authentication event type
 * @param eventType - The event type to listen for
 * @param callback - Function to call when the event is emitted
 * @returns Unsubscribe function
 */
export function onAuthEventType<T extends AuthEventType>(
  eventType: T,
  callback: (event: Extract<AuthEvent, { type: T }>) => void,
): () => void {
  return authEventBus.on((event) => {
    if (event.type === eventType) {
      callback(event as Extract<AuthEvent, { type: T }>)
    }
  })
}

/**
 * Convenience functions for specific event types
 */
export const onAuthLogin = (callback: (event: AuthLoginEvent) => void) =>
  onAuthEventType(AuthEventType.LOGIN, callback)

export const onAuthLogout = (callback: (event: AuthLogoutEvent) => void) =>
  onAuthEventType(AuthEventType.LOGOUT, callback)

export const onAuthUserChanged = (callback: (event: AuthUserChangedEvent) => void) =>
  onAuthEventType(AuthEventType.USER_CHANGED, callback)
