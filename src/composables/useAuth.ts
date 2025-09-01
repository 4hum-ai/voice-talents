import { ref, readonly, computed } from "vue";
import { initializeApp, type FirebaseApp } from "firebase/app";
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
} from "firebase/auth";

/**
 * Represents an authenticated user in the application
 */
export interface AuthUser {
  /** Unique user identifier */
  id: string;
  /** User's email address */
  email: string;
  /** User's display name (optional) */
  displayName?: string;
  /** URL to user's profile photo (optional) */
  photoURL?: string;
}

/**
 * Firebase configuration object
 */
const firebaseConfig = {
  apiKey: (import.meta as { env?: Record<string, unknown> }).env
    ?.VITE_FIREBASE_API_KEY as string,
  authDomain: (import.meta as { env?: Record<string, unknown> }).env
    ?.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: (import.meta as { env?: Record<string, unknown> }).env
    ?.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: (import.meta as { env?: Record<string, unknown> }).env
    ?.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: (import.meta as { env?: Record<string, unknown> }).env
    ?.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: (import.meta as { env?: Record<string, unknown> }).env
    ?.VITE_FIREBASE_APP_ID as string,
};

let app: FirebaseApp | null = null;
let authInstance: ReturnType<typeof getAuth> | null = null;

/**
 * Ensures Firebase Auth is properly initialized
 * @returns Firebase Auth instance
 */
function ensureAuthInitialized() {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  if (!authInstance) {
    authInstance = getAuth(app);
    void setPersistence(authInstance, browserLocalPersistence).catch(() => {});
  }
  return authInstance;
}

/**
 * Authentication composable providing Firebase Auth integration with reactive state management
 *
 * @returns Authentication service with user management, login/logout, and reactive state
 *
 * @example
 * ```typescript
 * const auth = useAuth();
 *
 * // Check authentication status
 * if (auth.isAuthenticated.value) {
 *   console.log('User is logged in:', auth.user.value);
 * }
 *
 * // Login with email/password
 * try {
 *   await auth.login('user@example.com', 'password');
 * } catch (error) {
 *   console.error('Login failed:', auth.error.value);
 * }
 *
 * // Login with Google
 * try {
 *   const result = await auth.loginWithGoogle();
 *   if (result.newUser) {
 *     console.log('New user signed up');
 *   }
 * } catch (error) {
 *   console.error('Google login failed:', auth.error.value);
 * }
 * ```
 */
export function useAuth() {
  const isLoading = ref(true);
  const error = ref<string | null>(null);
  const user = ref<AuthUser | null>(null);

  /**
   * Converts Firebase user object to application AuthUser interface
   * @param firebaseUser - Firebase user object
   * @returns Application AuthUser object
   */
  const convertFirebaseUser = (firebaseUser: FirebaseUser): AuthUser => {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      displayName: firebaseUser.displayName || undefined,
      photoURL: firebaseUser.photoURL || undefined,
    };
  };

  /**
   * Get the current authenticated user
   * @returns Promise resolving to current user or null if not authenticated
   *
   * @example
   * ```typescript
   * const currentUser = await auth.getCurrentUser();
   * if (currentUser) {
   *   console.log('Current user:', currentUser.email);
   * }
   * ```
   */
  const getCurrentUser = async (): Promise<AuthUser | null> => {
    const auth = ensureAuthInitialized();
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const converted = convertFirebaseUser(firebaseUser);
          user.value = converted;
          resolve(converted);
        } else {
          user.value = null;
          resolve(null);
        }
        isLoading.value = false;
        unsubscribe();
      });
    });
  };

  /**
   * Subscribe to authentication state changes
   * @param cb - Callback function called when auth state changes
   * @returns Unsubscribe function to stop listening to auth changes
   *
   * @example
   * ```typescript
   * const unsubscribe = auth.subscribe((user) => {
   *   if (user) {
   *     console.log('User logged in:', user.email);
   *   } else {
   *     console.log('User logged out');
   *   }
   * });
   *
   * // Later, to stop listening
   * unsubscribe();
   * ```
   */
  const subscribe = (cb: (u: AuthUser | null) => void): (() => void) => {
    const auth = ensureAuthInitialized();
    const off = onAuthStateChanged(auth, (firebaseUser) => {
      const converted = firebaseUser ? convertFirebaseUser(firebaseUser) : null;
      user.value = converted;
      cb(converted);
      isLoading.value = false;
    });
    return off;
  };

  /**
   * Login with email and password
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise resolving to authenticated user
   * @throws {Error} When login fails
   *
   * @example
   * ```typescript
   * try {
   *   const user = await auth.login('user@example.com', 'password123');
   *   console.log('Logged in as:', user.email);
   * } catch (error) {
   *   console.error('Login failed:', auth.error.value);
   * }
   * ```
   */
  const login = async (email: string, password: string): Promise<AuthUser> => {
    try {
      error.value = null;
      const auth = ensureAuthInitialized();
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const converted = convertFirebaseUser(cred.user);
      user.value = converted;
      return converted;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      error.value = message;
      throw new Error(message);
    }
  };

  /**
   * Login with Google OAuth
   * @returns Promise resolving to user and new user flag
   * @throws {Error} When Google login fails
   *
   * @example
   * ```typescript
   * try {
   *   const result = await auth.loginWithGoogle();
   *   console.log('Logged in as:', result.user.email);
   *   if (result.newUser) {
   *     console.log('This is a new user');
   *   }
   * } catch (error) {
   *   console.error('Google login failed:', auth.error.value);
   * }
   * ```
   */
  const loginWithGoogle = async (): Promise<{
    user: AuthUser;
    newUser?: boolean;
  }> => {
    try {
      error.value = null;
      const auth = ensureAuthInitialized();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const converted = convertFirebaseUser(result.user);
      const info = getAdditionalUserInfo(result);
      user.value = converted;
      return { user: converted, newUser: info?.isNewUser };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Google login failed";
      error.value = message;
      throw new Error(message);
    }
  };

  /**
   * Login with OAuth provider (Google, GitHub, Microsoft, Apple)
   * @param providerName - Name of the OAuth provider
   * @returns Promise resolving to user and new user flag
   * @throws {Error} When OAuth login fails
   *
   * @example
   * ```typescript
   * try {
   *   const result = await auth.loginWithOAuth('github');
   *   console.log('Logged in with GitHub:', result.user.email);
   * } catch (error) {
   *   console.error('OAuth login failed:', auth.error.value);
   * }
   * ```
   */
  const loginWithOAuth = async (
    providerName: "google" | "github" | "microsoft" | "apple",
  ): Promise<{ user: AuthUser; newUser?: boolean }> => {
    try {
      error.value = null;
      const auth = ensureAuthInitialized();
      let providerInstance:
        | GoogleAuthProvider
        | GithubAuthProvider
        | OAuthProvider;
      switch (providerName) {
        case "google":
          providerInstance = new GoogleAuthProvider();
          break;
        case "github":
          providerInstance = new GithubAuthProvider();
          break;
        case "microsoft":
          providerInstance = new OAuthProvider("microsoft.com");
          break;
        case "apple":
          providerInstance = new OAuthProvider("apple.com");
          break;
      }
      const result = await signInWithPopup(
        auth,
        providerInstance as AuthProvider,
      );
      const converted = convertFirebaseUser(result.user);
      const info = getAdditionalUserInfo(result);
      user.value = converted;
      return { user: converted, newUser: info?.isNewUser };
    } catch (err) {
      const message = err instanceof Error ? err.message : "OAuth login failed";
      error.value = message;
      throw new Error(message);
    }
  };

  /**
   * Logout the current user
   * @returns Promise that resolves when logout is complete
   * @throws {Error} When logout fails
   *
   * @example
   * ```typescript
   * try {
   *   await auth.logout();
   *   console.log('User logged out successfully');
   * } catch (error) {
   *   console.error('Logout failed:', auth.error.value);
   * }
   * ```
   */
  const logout = async (): Promise<void> => {
    try {
      error.value = null;
      const auth = ensureAuthInitialized();
      await signOut(auth);
      user.value = null;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed";
      error.value = message;
      throw new Error(message);
    }
  };

  /**
   * Computed property indicating if user is authenticated
   */
  const isAuthenticated = computed(() => !!user.value);

  /**
   * Set authentication persistence mode
   * @param mode - Persistence mode: 'local' (persists across browser sessions) or 'session' (cleared when browser closes)
   *
   * @example
   * ```typescript
   * // Keep user logged in across browser sessions
   * await auth.setPersistenceMode('local');
   *
   * // Clear session when browser closes
   * await auth.setPersistenceMode('session');
   * ```
   */
  const setPersistenceMode = async (mode: "local" | "session") => {
    const auth = ensureAuthInitialized();
    const persistence =
      mode === "local" ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence).catch(() => {});
  };

  return {
    /** Current authenticated user (readonly) */
    user: readonly(user),
    /** Loading state (readonly) */
    isLoading: readonly(isLoading),
    /** Current error message (readonly) */
    error: readonly(error),
    /** Computed boolean indicating if user is authenticated */
    isAuthenticated,
    /** Get current user */
    getCurrentUser,
    /** Subscribe to auth state changes */
    subscribe,
    /** Login with email/password */
    login,
    /** Login with Google OAuth */
    loginWithGoogle,
    /** Login with OAuth provider */
    loginWithOAuth,
    /** Logout current user */
    logout,
    /** Set persistence mode */
    setPersistenceMode,
  };
}
