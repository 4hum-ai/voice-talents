import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

import "@fontsource-variable/inter";
import "@/style.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);
// Initialize auth store before mount so guards have state
import { useAuthStore } from "./stores/auth";
import { useTheme } from "./composables/useTheme";
import { useUiConfig } from "./composables/useUiConfig";
import { useActivity } from "./composables/useActivity";
const authStore = useAuthStore();
// Initialize theme before mounting to prevent FOUC
const { initialize: initTheme } = useTheme();
initTheme();
app.mount("#app");

authStore.initialize().then(() => {
  // Mount first so the UI can show the boot overlay
  // Kick off UI config initialization in the background
  const { init } = useUiConfig();
  init().catch(() => void 0);
  try {
    const { start } = useActivity();
    start();
  } catch {
    /* ignore */
  }
});
