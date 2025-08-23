import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import '@fontsource-variable/inter'
import './assets/styles/main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
// Initialize auth store before mount so guards have state
import { useAuthStore } from './stores/auth'
const authStore = useAuthStore()
authStore.initialize().finally(() => {
  app.mount('#app')
})


