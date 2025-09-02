<template>
  <div class="flex items-center space-x-2">
    <!-- Language Flag (if enabled) -->
    <CountryFlag v-if="showFlag" :country-code="countryCode" :size="flagSize" class="shrink-0" />

    <!-- Language Content -->
    <div v-if="!flagOnly" class="flex flex-col">
      <!-- Language Name -->
      <span :class="['font-medium text-gray-900 dark:text-gray-100', sizeClasses.text]">
        {{ languageName }}
      </span>

      <!-- Language Code (if enabled) -->
      <span v-if="showCode" :class="['text-gray-500 dark:text-gray-400', sizeClasses.code]">
        {{ languageCode.toUpperCase() }}
      </span>
    </div>

    <!-- Flag Only Mode -->
    <CountryFlag
      v-else-if="flagOnly"
      :country-code="countryCode"
      :size="flagSize"
      class="shrink-0"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CountryFlag from './CountryFlag.vue'

interface Props {
  /** Language code (e.g., 'en', 'es', 'fr') */
  value: string
  /** Show language code below name */
  showCode?: boolean
  /** Display format */
  format?: 'name' | 'code' | 'both'
  /** Show only flag, no text */
  flagOnly?: boolean
  /** Show flag alongside text */
  showFlag?: boolean
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Display variant */
  variant?: 'default' | 'compact' | 'detailed'
}

const props = withDefaults(defineProps<Props>(), {
  showCode: false,
  format: 'name',
  flagOnly: false,
  showFlag: false,
  size: 'md',
  variant: 'default',
})

// Language to country code mapping for flags
const languageToCountryMap: Record<string, string> = {
  en: 'gb', // English - UK flag
  es: 'es', // Spanish - Spain flag
  fr: 'fr', // French - France flag
  de: 'de', // German - Germany flag
  it: 'it', // Italian - Italy flag
  pt: 'pt', // Portuguese - Portugal flag
  ru: 'ru', // Russian - Russia flag
  ja: 'jp', // Japanese - Japan flag
  ko: 'kr', // Korean - South Korea flag
  zh: 'cn', // Chinese - China flag
  ar: 'sa', // Arabic - Saudi Arabia flag
  hi: 'in', // Hindi - India flag
  nl: 'nl', // Dutch - Netherlands flag
  sv: 'se', // Swedish - Sweden flag
  no: 'no', // Norwegian - Norway flag
  da: 'dk', // Danish - Denmark flag
  fi: 'fi', // Finnish - Finland flag
  pl: 'pl', // Polish - Poland flag
  tr: 'tr', // Turkish - Turkey flag
  he: 'il', // Hebrew - Israel flag
  th: 'th', // Thai - Thailand flag
  vi: 'vn', // Vietnamese - Vietnam flag
  id: 'id', // Indonesian - Indonesia flag
  ms: 'my', // Malay - Malaysia flag
  tl: 'ph', // Filipino - Philippines flag
}

const languageCode = computed(() => {
  if (!props.value) return 'en'
  return props.value.toLowerCase()
})

const countryCode = computed(() => {
  return languageToCountryMap[languageCode.value] || 'gb'
})

const languageName = computed(() => {
  if (!props.value) return 'English'

  const languageNames: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ru: 'Russian',
    ja: 'Japanese',
    ko: 'Korean',
    zh: 'Chinese',
    ar: 'Arabic',
    hi: 'Hindi',
    nl: 'Dutch',
    sv: 'Swedish',
    no: 'Norwegian',
    da: 'Danish',
    fi: 'Finnish',
    pl: 'Polish',
    tr: 'Turkish',
    he: 'Hebrew',
    th: 'Thai',
    vi: 'Vietnamese',
    id: 'Indonesian',
    ms: 'Malay',
    tl: 'Filipino',
  }

  return languageNames[languageCode.value] || props.value
})

const flagSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'sm'
    case 'lg':
      return 'md'
    default:
      return 'sm'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        text: 'text-xs',
        code: 'text-xs',
      }
    case 'lg':
      return {
        text: 'text-base',
        code: 'text-sm',
      }
    default:
      return {
        text: 'text-sm',
        code: 'text-xs',
      }
  }
})
</script>
