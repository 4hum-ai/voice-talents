import { ref, watch } from 'vue'

/**
 * Safely get a value from localStorage, handling errors gracefully
 * @param key - Storage key to retrieve
 * @returns Stored value or null if not found or error occurs
 */
function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

/**
 * Safely set a value in localStorage, handling errors gracefully
 * @param key - Storage key to set
 * @param value - Value to store
 */
function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    void 0
  }
}

/**
 * Safely remove a value from localStorage, handling errors gracefully
 * @param key - Storage key to remove
 */
function safeRemove(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
    void 0
  }
}

/**
 * Persistent preference management composable with localStorage integration
 *
 * @param key - Unique key for the preference in localStorage
 * @param defaultValue - Default value if no preference is stored
 * @returns Preference service with reactive value and management methods
 *
 * @example
 * ```typescript
 * // Basic usage
 * const theme = usePreference('user-theme', 'light');
 *
 * // Get current value
 * console.log(theme.value.value); // 'light' or stored value
 *
 * // Set new value
 * theme.set('dark');
 *
 * // Get value using getter
 * console.log(theme.get()); // 'dark'
 *
 * // Remove preference (resets to default)
 * theme.remove();
 * ```
 *
 * @example
 * ```typescript
 * // With reactive value
 * const sidebarCollapsed = usePreference('sidebar-collapsed', 'false');
 *
 * // Watch for changes
 * watch(sidebarCollapsed.value, (newValue) => {
 *   console.log('Sidebar preference changed:', newValue);
 * });
 *
 * // Toggle boolean preference
 * function toggleSidebar() {
 *   sidebarCollapsed.set(sidebarCollapsed.get() === 'true' ? 'false' : 'true');
 * }
 * ```
 */
export function usePreference(key: string, defaultValue?: string) {
  const valueRef = ref<string | null>(safeGet(key))
  if (valueRef.value == null && defaultValue !== undefined) {
    valueRef.value = defaultValue
  }

  // Watch for changes and sync with localStorage
  watch(valueRef, (v) => {
    if (v == null || v === '' || (defaultValue !== undefined && v === defaultValue)) {
      safeRemove(key)
    } else {
      safeSet(key, String(v))
    }
  })

  /**
   * Set the preference value
   * @param v - Value to set (null/undefined removes the preference)
   *
   * @example
   * ```typescript
   * preference.set('new-value');
   * preference.set(null); // Remove preference
   * ```
   */
  const set = (v: string | null | undefined) => {
    valueRef.value = v == null ? null : String(v)
  }

  /**
   * Get the current preference value
   * @returns Current preference value
   *
   * @example
   * ```typescript
   * const currentValue = preference.get();
   * ```
   */
  const get = () => valueRef.value

  /**
   * Remove the preference (resets to default value)
   *
   * @example
   * ```typescript
   * preference.remove();
   * ```
   */
  const remove = () => set(null)

  return {
    /** Get current preference value */
    get,
    /** Set preference value */
    set,
    /** Remove preference (reset to default) */
    remove,
    /** Reactive preference value */
    value: valueRef,
  }
}
