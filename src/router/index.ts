import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { genericRoutes } from "./generic";
import { customRoutes } from "./custom";
const routes: RouteRecordRaw[] = [
  ...genericRoutes,
  ...customRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  let titleSuffix = String(to.meta.title || "Admin");
  const authStore = useAuthStore();
  if (!authStore.user) {
    await authStore.initialize();
  }
  if (to.name === "Auth" && authStore.isAuthenticated) {
    const redirectPath = (to.query.redirect as string) || "/";
    next(redirectPath);
    return;
  }
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: "Auth", query: { redirect: to.fullPath } });
    return;
  }

  const maybeModule = to.params?.module as string | undefined;
  if (maybeModule) {
    // Avoid network calls in the guard; title will be refined in views.
    titleSuffix = to.meta.title
      ? `${maybeModule} - ${to.meta.title}`
      : maybeModule;
  }

  document.title = `${titleSuffix} - Admin UI`;
  next();
});

export default router;
