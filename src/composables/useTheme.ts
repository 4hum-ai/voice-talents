import { computed, onMounted, watch, getCurrentInstance } from 'vue'
import { usePreference } from './usePreference'

export type ThemeMode = 'light' | 'dark'

const THEME_KEY = 'admin-theme'

export function useTheme() {
  const themePref = usePreference(THEME_KEY, 'light')
  const themeRef = themePref.value

  const mode = computed<ThemeMode>(() => (themeRef.value === 'dark' ? 'dark' : 'light'))

  const isDark = computed(() => mode.value === 'dark')

  function applyTheme(next?: ThemeMode) {
    const current = next ?? mode.value
    const isDarkMode = current === 'dark'
    document.documentElement.classList.toggle('dark', isDarkMode)
    document.body.classList.toggle('dark', isDarkMode)
  }

  function setTheme(next: ThemeMode) {
    themePref.set(next)
    applyTheme(next)
  }

  function toggleTheme() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  function initialize() {
    // Apply immediately using the stored preference
    applyTheme(mode.value)
  }

  // Keep DOM in sync when pref changes elsewhere
  watch(mode, (m) => applyTheme(m))

  // Convenience for components using onMounted (only if within a component setup)
  if (getCurrentInstance()) {
    onMounted(() => applyTheme())
  }

  return {
    mode,
    isDark,
    setTheme,
    toggleTheme,
    initialize,
  }
}


