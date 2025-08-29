<template>
  <div
    class="relative mx-auto flex max-w-[32rem] flex-col justify-center px-4 py-12"
  >
    <div
      class="bg-primary-500/10 pointer-events-none absolute inset-x-0 top-6 mx-auto h-32 w-32 rounded-full blur-3xl"
    />

    <div
      class="relative rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-2xl backdrop-blur dark:border-gray-800 dark:bg-gray-900/60"
    >
      <div class="absolute top-4 right-4">
        <ThemeToggle :is-dark="isDark" @toggle="toggleTheme()" />
      </div>
      <div class="mb-6 flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white shadow"
        >
          <span aria-hidden="true">🎬</span>
        </div>
        <div>
          <h1
            class="text-xl leading-6 font-semibold text-gray-900 dark:text-gray-100"
          >
            Sign in to Admin
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Access your workspace and tools
          </p>
        </div>
      </div>

      <form class="space-y-4" @submit.prevent="handleEmailLogin">
        <div class="relative">
          <span
            class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-5 w-5"
            >
              <path
                d="M1.5 8.67v6.66A3.17 3.17 0 0 0 4.67 18.5h14.66a3.17 3.17 0 0 0 3.17-3.17V8.67a3.16 3.16 0 0 0-.53-1.75l-8.32 5.2a2.25 2.25 0 0 1-2.39 0L2.03 6.92a3.16 3.16 0 0 0-.53 1.75Z"
              />
              <path
                d="M22.5 6.75a3.17 3.17 0 0 0-3.17-3.17H4.67A3.17 3.17 0 0 0 1.5 6.75l9.01 5.63a.75.75 0 0 0 .78 0l9.21-5.63Z"
              />
            </svg>
          </span>
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-600 dark:focus:ring-primary-600 w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-3 pl-10 text-gray-900 placeholder-gray-400 focus:ring-1 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
            required
          />
        </div>

        <div class="relative">
          <span
            class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-5 w-5"
            >
              <path
                d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3h-.75A2.25 2.25 0 0 0 3.75 12v7.5A2.25 2.25 0 0 0 6 21.75h12A2.25 2.25 0 0 0 20.25 19.5V12A2.25 2.25 0 0 0 18 9.75h-.75v-3A5.25 5.25 0 0 0 12 1.5Zm-3.75 8.25v-3a3.75 3.75 0 1 1 7.5 0v3h-7.5Z"
              />
            </svg>
          </span>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            class="focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-600 dark:focus:ring-primary-600 w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-10 pl-10 text-gray-900 placeholder-gray-400 focus:ring-1 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
            required
          />
          <button
            type="button"
            class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
            @click="showPassword = !showPassword"
          >
            <svg
              v-if="!showPassword"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-5 w-5"
            >
              <path
                d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"
              />
              <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-5 w-5"
            >
              <path
                d="M3.28 2.22a.75.75 0 0 0-1.06 1.06L4.6 5.66C3.01 6.64 1.67 8.08 1 9.99 2.73 13.88 7 17 12 17c1.46 0 2.86-.25 4.15-.71l2.57 2.57a.75.75 0 1 0 1.06-1.06L3.28 2.22Z"
              />
              <path
                d="M8.53 7.95 10 9.41a3 3 0 0 0 4.17 4.17l1.46 1.46A6.98 6.98 0 0 1 12 15c-3.97 0-7.42-2.4-9-6 1-2.25 2.8-3.93 4.88-5.02l.65.97ZM12 7.5c.55 0 1.06.12 1.52.33l-1.69-1.69c.06 0 .11-.01.17-.01Z"
              />
            </svg>
          </button>
        </div>

        <div class="flex items-center justify-between text-sm">
          <label
            class="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400"
          >
            <input
              v-model="remember"
              type="checkbox"
              class="text-primary-600 focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
            />
            <span>Remember me</span>
          </label>
          <a
            href="#"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >Forgot password?</a
          >
        </div>

        <button
          :disabled="isLoading"
          class="btn-primary h-11 w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span v-if="!isLoading">Sign In</span>
          <span v-else class="inline-flex items-center justify-center gap-2">
            <span
              class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent dark:border-gray-500"
            />
            Signing in...
          </span>
        </button>
      </form>

      <div class="relative my-6">
        <hr class="border-gray-200 dark:border-gray-800" />
        <span
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 px-2 text-xs tracking-wide text-gray-500 uppercase dark:bg-gray-900/60 dark:text-gray-400"
          >Or</span
        >
      </div>

      <button
        class="btn-secondary flex h-11 w-full items-center justify-center gap-2"
        :disabled="isLoading"
        @click="handleProvider('google')"
      >
        <span
          aria-hidden="true"
          class="inline-flex h-5 w-5 items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            class="h-5 w-5"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.643,6.053,29.083,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.643,6.053,29.083,4,24,4C16.318,4,9.656,8.256,6.306,14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24,44c5.162,0,9.755-1.977,13.261-5.189l-6.104-5.148C29.989,35.091,27.138,36,24,36c-5.202,0-9.619-3.319-11.275-7.952l-6.5,5.01C9.618,39.556,16.279,44,24,44z"
            />
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-3.997,5.614c0.001-0.001,0.002-0.001,0.003-0.002l6.104,5.148C36.871,39.523,44,35,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
        </span>
        <span class="font-medium">Continue with Google</span>
      </button>

      <p v-if="error" class="text-error-600 dark:text-error-300 mt-4 text-sm">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useTheme } from "@/composables/useTheme";
import ThemeToggle from "@/components/atoms/ThemeToggle.vue";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const isLoading = ref(false);
const error = ref("");
const showPassword = ref(false);
const { toggleTheme, isDark } = useTheme();
const remember = ref(true);

const handleProvider = async (
  provider: "google" | "github" | "microsoft" | "apple",
) => {
  try {
    isLoading.value = true;
    error.value = "";
    await authStore.loginWithProvider(provider);
    const redirectPath = (route.query.redirect as string) || "/";
    router.push(redirectPath);
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Login failed";
  } finally {
    isLoading.value = false;
  }
};

const handleEmailLogin = async () => {
  try {
    isLoading.value = true;
    error.value = "";
    await authStore.initialize();
    await authStore.clearError();
    // switch persistence based on remember
    try {
      (await import("@/composables/useAuth"))
        .useAuth()
        .setPersistenceMode(remember.value ? "local" : "session");
    } catch {
      void 0;
    }
    await authStore.loginUser({ email: email.value, password: password.value });
    const redirectPath = (route.query.redirect as string) || "/";
    router.push(redirectPath);
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Login failed";
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await authStore.initialize();
  if (authStore.isAuthenticated) {
    const redirectPath = (route.query.redirect as string) || "/";
    router.push(redirectPath);
  }
});
</script>
