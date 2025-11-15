import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import '@fontsource-variable/inter'
import '@/style.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
// Initialize auth before mount so guards have state
import { useAuth } from './lib/auth'
import { useTheme } from './composables/useTheme'
import { useUiConfig } from './composables/useUiConfig'
import { useActivity } from './composables/useActivity'
const { initialize: initAuth } = useAuth()
// Initialize theme before mounting to prevent FOUC
const { initialize: initTheme } = useTheme()
initTheme()

// Force theme application after a short delay to ensure DOM is ready
setTimeout(() => {
  const { initialize: initThemeAgain, applyTheme, mode } = useTheme()
  initThemeAgain()
  // Force apply the current theme mode
  applyTheme(mode.value)
  console.log('🔄 Theme re-initialized after DOM ready, current mode:', mode.value)
}, 100)
app.mount('#app')

// Initialize auth (non-blocking)
initAuth()
  .then(() => {
    console.log('🔐 Main: Auth initialization completed')
    // Kick off UI config initialization in the background
    const { init } = useUiConfig()
    init().catch(() => void 0)
    try {
      const { start } = useActivity()
      start()
    } catch {
      /* ignore */
    }
  })
  .catch((error) => {
    console.error('🔐 Main: Auth initialization failed, but app will continue:', error)
    // Still initialize UI config and activity even if auth fails
    const { init } = useUiConfig()
    init().catch(() => void 0)
    try {
      const { start } = useActivity()
      start()
    } catch {
      /* ignore */
    }
  })
