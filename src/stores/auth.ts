import { defineStore } from "pinia";
import { ref, computed, type Ref } from "vue";
import { useAuth } from "@/composables/useAuth";

export interface LoginCredentials { email: string; password: string }
export interface AuthUser { id: string; email: string; displayName?: string; photoURL?: string }

export const useAuthStore = defineStore("auth", () => {
  const user: Ref<AuthUser | null> = ref(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const { login, loginWithGoogle, logout, getCurrentUser } = useAuth();

  const isAuthenticated = computed(() => !!user.value);

  const initialize = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      const current = await getCurrentUser();
      if (current) user.value = current;
    } finally {
      isLoading.value = false;
    }
  };

  const loginUser = async (credentials: LoginCredentials) => {
    try {
      isLoading.value = true;
      error.value = null;
      const loggedIn = await login(credentials.email, credentials.password);
      user.value = loggedIn;
      return loggedIn;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Login failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const loginWithGoogleUser = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      const { user: loggedIn } = await loginWithGoogle();
      user.value = loggedIn;
      return loggedIn;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Login failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logoutUser = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      await logout();
      user.value = null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Logout failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const clearError = () => { error.value = null };

  return { user, isLoading, error, isAuthenticated, initialize, loginUser, loginWithGoogleUser, logoutUser, clearError };
});


