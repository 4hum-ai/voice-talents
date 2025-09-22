import { describe, it, expect } from 'vitest'
import { createAuthProvider } from '../authProviderFactory'
import { FirebaseAuthProvider } from '../firebaseAuthProvider'
import { GisAuthProvider } from '../gisAuthProvider'

describe('authProviderFactory', () => {
  describe('createAuthProvider', () => {
    it('should create FirebaseAuthProvider for Firebase config', () => {
      const config = {
        provider: 'firebase' as const,
        firebase: {
          apiKey: 'test-api-key',
          authDomain: 'test-project.firebaseapp.com',
          projectId: 'test-project',
          storageBucket: 'test-project.appspot.com',
          messagingSenderId: '123456789',
          appId: '1:123456789:web:abcdef',
        },
      }

      const provider = createAuthProvider(config)
      expect(provider).toBeInstanceOf(FirebaseAuthProvider)
    })

    it('should create GisAuthProvider for GIS config', () => {
      const config = {
        provider: 'gis' as const,
        gis: {
          clientId: 'test-client-id.googleusercontent.com',
        },
      }

      const provider = createAuthProvider(config)
      expect(provider).toBeInstanceOf(GisAuthProvider)
    })

    it('should throw error for unsupported provider', () => {
      const config = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        provider: 'unsupported' as any,
      }

      expect(() => createAuthProvider(config)).toThrow('Unsupported authentication provider')
    })

    it('should throw error when Firebase config is missing', () => {
      const config = {
        provider: 'firebase' as const,
      }

      expect(() => createAuthProvider(config)).toThrow('Firebase configuration is required')
    })

    it('should throw error when GIS config is missing', () => {
      const config = {
        provider: 'gis' as const,
      }

      expect(() => createAuthProvider(config)).toThrow('Google Identity Services configuration is required')
    })
  })
})