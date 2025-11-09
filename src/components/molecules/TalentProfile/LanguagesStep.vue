<template>
  <div class="space-y-8">
    <div class="text-center">
      <div
        class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500"
      >
        <Icon name="mdi:translate" class="h-8 w-8 text-white" />
      </div>
      <h3 class="text-foreground mb-2 text-2xl font-semibold">
        What Languages Can You Perform In?
      </h3>
    </div>

    <div class="mx-auto max-w-4xl">
      <!-- Language Grid -->
      <div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        <div
          v-for="language in languageOptions"
          :key="language.value"
          class="cursor-pointer rounded-lg border-2 border-gray-200 bg-white p-4 text-center transition-all hover:border-gray-300"
          :class="{
            'border-indigo-500 bg-indigo-50': profileData.languages.includes(language.value),
            'border-gray-200 bg-white': !profileData.languages.includes(language.value),
          }"
          @click="toggleLanguage(language.value)"
        >
          <!-- Flag as full background -->
          <div class="mb-3 h-16 w-full overflow-hidden rounded-lg">
            <CountryFlag
              :country-code="language.countryCode"
              size="lg"
              variant="rounded"
              class="h-full w-full"
              :class="{
                grayscale: !profileData.languages.includes(language.value),
                'grayscale-0': profileData.languages.includes(language.value),
              }"
            />
          </div>

          <!-- Language Label -->
          <span
            class="text-sm font-medium"
            :class="{
              'text-indigo-700': profileData.languages.includes(language.value),
              'text-gray-700': !profileData.languages.includes(language.value),
            }"
          >
            {{ language.label }}
          </span>
        </div>
      </div>

      <div
        v-if="profileData.languages.length > 0"
        class="mt-6 rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20"
      >
        <p class="text-sm text-indigo-700 dark:text-indigo-300">
          <Icon name="mdi:check-circle" class="mr-1 inline h-4 w-4" />
          You can perform in {{ profileData.languages.length }} language{{
            profileData.languages.length > 1 ? 's' : ''
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/atoms/Icon.vue'
import CountryFlag from '@/components/atoms/CountryFlag.vue'

interface Props {
  profileData: {
    languages: string[]
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [data: Partial<Props['profileData']>]
}>()

const languageOptions = [
  // English variants
  { value: 'English', label: 'English', countryCode: 'gb', color: 'bg-blue-500' },

  // ASEAN Countries
  { value: 'Vietnamese', label: 'Vietnamese', countryCode: 'vn', color: 'bg-red-500' },

  // Other major languages
  { value: 'German', label: 'German', countryCode: 'de', color: 'bg-yellow-500' },
]

const toggleLanguage = (languageValue: string) => {
  const index = props.profileData.languages.indexOf(languageValue)
  if (index > -1) {
    const newLanguages = [...props.profileData.languages]
    newLanguages.splice(index, 1)
    emit('update', { languages: newLanguages })
  } else {
    const newLanguages = [...props.profileData.languages, languageValue]
    emit('update', { languages: newLanguages })
  }
}
</script>
