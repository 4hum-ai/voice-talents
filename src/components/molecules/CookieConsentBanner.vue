<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 transform translate-y-full"
    enter-to-class="opacity-100 transform translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 transform translate-y-0"
    leave-to-class="opacity-0 transform translate-y-full"
  >
    <div
      v-if="!cookieStore.hasRequiredConsent"
      class="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
    >
      <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex-1">
            <h3 class="text-foreground mb-2 text-lg font-semibold">Cookie Consent</h3>
            <p class="text-muted-foreground text-sm">
              We use cookies to enhance your experience, analyze site usage, and assist in our
              marketing efforts. By clicking "Accept All", you consent to our use of cookies. You
              can manage your preferences or learn more in our
              <RouterLink to="/privacy" class="text-primary hover:text-primary/80 underline">
                Privacy Policy
              </RouterLink>
              .
            </p>
          </div>
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button variant="outline" size="md" @click="showSettings = true">
              <Icon name="mdi:cog" class="mr-2 h-4 w-4" />
              Customize
            </Button>
            <Button variant="ghost" size="md" @click="handleRejectAll"> Reject All </Button>
            <Button variant="primary" size="md" @click="handleAcceptAll"> Accept All </Button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Cookie Settings Modal -->
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="showSettings"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showSettings = false"
    >
      <Card class="w-full max-w-2xl">
        <div class="mb-6">
          <h2 class="text-foreground mb-2 text-2xl font-bold">Cookie Preferences</h2>
          <p class="text-muted-foreground text-sm">
            Manage your cookie preferences. You can enable or disable different types of cookies
            below.
          </p>
        </div>

        <div class="space-y-4">
          <!-- Necessary Cookies -->
          <div
            class="flex items-start justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
          >
            <div class="flex-1">
              <h3 class="text-foreground mb-1 font-semibold">Necessary Cookies</h3>
              <p class="text-muted-foreground text-sm">
                Essential for the website to function properly. These cannot be disabled.
              </p>
            </div>
            <div class="ml-4">
              <div class="flex h-6 w-11 items-center rounded-full bg-blue-600">
                <div class="mr-1 ml-auto h-4 w-4 rounded-full bg-white"></div>
              </div>
            </div>
          </div>

          <!-- Functional Cookies -->
          <div
            class="flex items-start justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
          >
            <div class="flex-1">
              <h3 class="text-foreground mb-1 font-semibold">Functional Cookies</h3>
              <p class="text-muted-foreground text-sm">
                Remember your preferences and settings to enhance your experience.
              </p>
            </div>
            <label class="relative ml-4 inline-flex cursor-pointer items-center">
              <input v-model="localPreferences.functional" type="checkbox" class="peer sr-only" />
              <div
                class="peer h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-blue-600 dark:bg-gray-700"
              >
                <div
                  class="absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5"
                ></div>
              </div>
            </label>
          </div>

          <!-- Analytics Cookies -->
          <div
            class="flex items-start justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
          >
            <div class="flex-1">
              <h3 class="text-foreground mb-1 font-semibold">Analytics Cookies</h3>
              <p class="text-muted-foreground text-sm">
                Help us understand how visitors interact with our website to improve performance.
              </p>
            </div>
            <label class="relative ml-4 inline-flex cursor-pointer items-center">
              <input v-model="localPreferences.analytics" type="checkbox" class="peer sr-only" />
              <div
                class="peer h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-blue-600 dark:bg-gray-700"
              >
                <div
                  class="absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5"
                ></div>
              </div>
            </label>
          </div>

          <!-- Marketing Cookies -->
          <div
            class="flex items-start justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
          >
            <div class="flex-1">
              <h3 class="text-foreground mb-1 font-semibold">Marketing Cookies</h3>
              <p class="text-muted-foreground text-sm">
                Used to deliver personalized advertisements and track campaign effectiveness.
              </p>
            </div>
            <label class="relative ml-4 inline-flex cursor-pointer items-center">
              <input v-model="localPreferences.marketing" type="checkbox" class="peer sr-only" />
              <div
                class="peer h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-blue-600 dark:bg-gray-700"
              >
                <div
                  class="absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5"
                ></div>
              </div>
            </label>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <Button variant="outline" @click="showSettings = false">Cancel</Button>
          <Button variant="primary" @click="handleSavePreferences">Save Preferences</Button>
        </div>
      </Card>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useCookieConsentStore } from '@/stores/cookieConsent'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import Card from '@/components/atoms/Card.vue'
import { useToast } from '@/lib/toast'

const cookieStore = useCookieConsentStore()
const { success } = useToast()
const showSettings = ref(false)

const localPreferences = reactive({
  functional: cookieStore.preferences.functional,
  analytics: cookieStore.preferences.analytics,
  marketing: cookieStore.preferences.marketing,
})

// Update local preferences when store changes
watch(
  () => cookieStore.preferences,
  (newPrefs) => {
    localPreferences.functional = newPrefs.functional
    localPreferences.analytics = newPrefs.analytics
    localPreferences.marketing = newPrefs.marketing
  },
  { deep: true },
)

const handleAcceptAll = () => {
  cookieStore.acceptAll()
  success('Cookie preferences saved')
}

const handleRejectAll = () => {
  cookieStore.rejectAll()
  success('Only necessary cookies enabled')
}

const handleSavePreferences = () => {
  cookieStore.saveConsent({
    functional: localPreferences.functional,
    analytics: localPreferences.analytics,
    marketing: localPreferences.marketing,
  })
  showSettings.value = false
  success('Cookie preferences saved')
}
</script>
