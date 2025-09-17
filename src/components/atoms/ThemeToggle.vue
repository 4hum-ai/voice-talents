<template>
  <button
    @click="toggleTheme"
    class="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-2 transition-colors"
    :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
  >
    <!-- Sun icon for light mode -->
    <IconWeatherSunny v-if="isDark" class="h-5 w-5" aria-hidden="true" />

    <!-- Moon icon for dark mode -->
    <IconWeatherNight v-else class="h-5 w-5" aria-hidden="true" />
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import IconWeatherSunny from '~icons/mdi/weather-sunny'
import IconWeatherNight from '~icons/mdi/weather-night'

const { isDark, toggleTheme } = useTheme()
</script>
