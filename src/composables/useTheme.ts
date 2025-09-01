import { computed, onMounted, watch, getCurrentInstance } from "vue";
import { usePreference } from "./usePreference";

/**
 * Available theme modes
 */
export type ThemeMode = "light" | "dark";

/** Local storage key for theme preference */
const THEME_KEY = "admin-theme";

/**
 * Theme management composable for handling light/dark mode with persistent preferences
 *
 * @returns Theme service with reactive theme state and theme management methods
 *
 * @example
 * ```typescript
 * const theme = useTheme();
 *
 * // Check current theme
 * console.log('Current theme:', theme.mode.value);
 * console.log('Is dark mode:', theme.isDark.value);
 *
 * // Change theme
 * theme.setTheme('dark');
 *
 * // Toggle between themes
 * theme.toggleTheme();
 *
 * // Initialize theme (applies stored preference)
 * theme.initialize();
 * ```
 *
 * @example
 * ```vue
 * <template>
 *   <button @click="theme.toggleTheme()">
 *     {{ theme.isDark ? '🌞 Light' : '🌙 Dark' }}
 *   </button>
 * </template>
 *
 * <script setup lang="ts">
 * import { useTheme } from '@/composables/useTheme';
 *
 * const theme = useTheme();
 * </script>
 * ```
 */
export function useTheme() {
  const themePref = usePreference(THEME_KEY, "light");
  const themeRef = themePref.value;

  /**
   * Computed theme mode (light or dark)
   */
  const mode = computed<ThemeMode>(() =>
    themeRef.value === "dark" ? "dark" : "light",
  );

  /**
   * Computed boolean indicating if dark mode is active
   */
  const isDark = computed(() => mode.value === "dark");

  /**
   * Apply theme to the document by toggling CSS classes
   * @param next - Theme to apply (optional, uses current mode if not provided)
   *
   * @example
   * ```typescript
   * // Apply current theme
   * theme.applyTheme();
   *
   * // Apply specific theme
   * theme.applyTheme('dark');
   * ```
   */
  function applyTheme(next?: ThemeMode) {
    const current = next ?? mode.value;
    const isDarkMode = current === "dark";
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.body.classList.toggle("dark", isDarkMode);
  }

  /**
   * Set and apply a new theme
   * @param next - Theme mode to set
   *
   * @example
   * ```typescript
   * theme.setTheme('dark');
   * theme.setTheme('light');
   * ```
   */
  function setTheme(next: ThemeMode) {
    themePref.set(next);
    applyTheme(next);
  }

  /**
   * Toggle between light and dark themes
   *
   * @example
   * ```typescript
   * // Toggle from current theme to opposite
   * theme.toggleTheme();
   * ```
   */
  function toggleTheme() {
    setTheme(isDark.value ? "light" : "dark");
  }

  /**
   * Initialize theme by applying the stored preference
   * Useful for initial setup or when you want to force theme application
   *
   * @example
   * ```typescript
   * // Apply stored theme preference
   * theme.initialize();
   * ```
   */
  function initialize() {
    // Apply immediately using the stored preference
    applyTheme(mode.value);
  }

  // Keep DOM in sync when pref changes elsewhere
  watch(mode, (m) => applyTheme(m));

  // Convenience for components using onMounted (only if within a component setup)
  if (getCurrentInstance()) {
    onMounted(() => applyTheme());
  }

  return {
    /** Current theme mode (light or dark) */
    mode,
    /** Boolean indicating if dark mode is active */
    isDark,
    /** Set and apply a new theme */
    setTheme,
    /** Toggle between light and dark themes */
    toggleTheme,
    /** Initialize theme by applying stored preference */
    initialize,
  };
}
