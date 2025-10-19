import { computed, onMounted, watch, getCurrentInstance } from 'vue'
import { usePreference } from './usePreference'

/**
 * Available theme modes
 */
export type ThemeMode = 'light' | 'dark'

/** Local storage key for theme preference */
const THEME_KEY = 'admin-theme'

export function useTheme() {
  const themePref = usePreference(THEME_KEY, 'light')
  const themeRef = themePref.value

  /**
   * Computed theme mode (light or dark)
   */
  const mode = computed<ThemeMode>(() => (themeRef.value === 'dark' ? 'dark' : 'light'))

  /**
   * Computed boolean indicating if dark mode is active
   */
  const isDark = computed(() => mode.value === 'dark')

  function applyTheme(next?: ThemeMode) {
    const current = next ?? mode.value
    const isDarkMode = current === 'dark'

    // Force remove and add classes to ensure proper application
    document.documentElement.classList.remove('light', 'dark')
    document.body.classList.remove('light', 'dark')

    // Apply to documentElement (html) for Tailwind dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
    } else {
      document.documentElement.classList.add('light')
      document.body.classList.add('light')
    }

    // Force a style recalculation
    document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light'

    // Debug logging
    console.log('🎨 Theme applied:', {
      current,
      isDarkMode,
      htmlClasses: document.documentElement.className,
      bodyClasses: document.body.className,
      colorScheme: document.documentElement.style.colorScheme,
    })
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
    applyTheme,
  }
}
