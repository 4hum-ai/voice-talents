# Auth Library

A centralized authentication system with provider abstraction and event sourcing pattern.

## Overview

The auth library provides a unified authentication interface that supports multiple authentication providers (Firebase, Google Identity Services, etc.) through a provider pattern. It also implements an event sourcing pattern to decouple authentication from domain-specific concerns.

## Structure

```
lib/auth/
├── composable/        # Vue composables (useAuth)
├── provider/          # Auth provider implementations
│   ├── firebaseAuthProvider.ts
│   ├── gisAuthProvider.ts
│   └── authProviderFactory.ts
├── type/              # TypeScript types and interfaces
├── event/             # Event sourcing system
└── index.ts           # Main entry point
```

## Usage

### Basic Authentication

```typescript
import { useAuth } from '@/lib/auth'

const { user, isLoading, isAuthenticated, login, logout } = useAuth()

// Login
await login('user@example.com', 'password')

// Logout
await logout()

// Check authentication status
if (isAuthenticated.value) {
  console.log('User:', user.value)
}
```

### OAuth Login

```typescript
import { useAuth } from '@/lib/auth'

const { loginWithGoogle, loginWithOAuth } = useAuth()

// Google login
const { user, newUser } = await loginWithGoogle()

// Other OAuth providers
const { user } = await loginWithOAuth('github')
const { user } = await loginWithOAuth('microsoft')
const { user } = await loginWithOAuth('apple')
```

### Event Subscription

The auth library emits events for authentication state changes. This allows other parts of the application to react to auth events without direct coupling.

```typescript
import { onAuthLogout, onAuthLogin, onAuthUserChanged } from '@/lib/auth'

// Subscribe to logout events
onAuthLogout(() => {
  // Clear user data, reset state, etc.
  console.log('User logged out')
})

// Subscribe to login events
onAuthLogin((event) => {
  console.log('User logged in:', event.user)
  if (event.isNewUser) {
    console.log('New user!')
  }
})

// Subscribe to user changes
onAuthUserChanged((event) => {
  console.log('User changed:', event.user)
})
```

### Advanced: Custom Event Handling

```typescript
import { onAuthEvent, AuthEventType } from '@/lib/auth'

// Subscribe to all auth events
onAuthEvent((event) => {
  switch (event.type) {
    case AuthEventType.LOGIN:
      console.log('Login:', event.user)
      break
    case AuthEventType.LOGOUT:
      console.log('Logout')
      break
    case AuthEventType.LOGIN_FAILED:
      console.error('Login failed:', event.error)
      break
    // ... other event types
  }
})
```

## Event Types

- `AuthEventType.LOGIN` - User successfully logged in
- `AuthEventType.LOGOUT` - User successfully logged out
- `AuthEventType.LOGIN_FAILED` - Login attempt failed
- `AuthEventType.LOGOUT_FAILED` - Logout attempt failed
- `AuthEventType.USER_CHANGED` - User state changed (login/logout/switch)

## Provider Pattern

The library uses a provider pattern to support multiple authentication backends:

- **Firebase Auth** - Full-featured authentication with email/password and OAuth
- **Google Identity Services (GIS)** - OAuth-only authentication using Google's new identity services

The provider is selected via environment variables:

```env
VITE_AUTH_PROVIDER=firebase  # or 'gis'
```

## Configuration

### Firebase Configuration

```env
VITE_AUTH_PROVIDER=firebase
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Google Identity Services Configuration

```env
VITE_AUTH_PROVIDER=gis
VITE_GOOGLE_CLIENT_ID=your-client-id
VITE_GOOGLE_SCOPES=openid email profile
```

## Architecture Benefits

1. **Decoupling**: Auth library doesn't depend on domain-specific code (e.g., activity tracking)
2. **Event Sourcing**: Other systems can react to auth events without direct dependencies
3. **Provider Abstraction**: Easy to switch or add new authentication providers
4. **Type Safety**: Full TypeScript support with proper types
5. **Reusability**: Can be used across different applications

## Example: Activity Tracking Integration

The activity tracking system subscribes to logout events to clear user activity:

```typescript
// In useActivity composable
import { onAuthLogout } from '@/lib/auth'

onAuthLogout(() => {
  clearAll()
  stop()
})
```

This decouples the auth library from activity tracking - the auth library doesn't need to know about activity tracking, and activity tracking can react to auth events independently.
