import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Declare resource-driven routes for scalability
const resourceModules = [
  'organizations', 
  'users', 
  'revenues', 
  'payouts', 
  'titles', 
  'media', 
  'media-relationships'
] as const

const resourceRoutes: RouteRecordRaw[] = resourceModules.map((mod) => ({
  path: `/${mod}`,
  component: () => import('../views/ModuleView.vue'),
  meta: { title: mod.charAt(0).toUpperCase() + mod.slice(1), requiresAuth: true, module: mod }
}))

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../views/Dashboard.vue'),
    meta: { title: 'Admin Dashboard', requiresAuth: true }
  },
  ...resourceRoutes,
  {
    path: '/module',
    component: () => import('../views/ModuleView.vue'),
    meta: { title: 'Module', requiresAuth: true }
  },
  // Auth
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/Auth.vue'),
    meta: { title: 'Sign In' }
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/NotFound.vue'),
    meta: { title: 'Not Found' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, _from, next) => {
  document.title = `Movie Dubie Admin - ${to.meta.title || 'Admin'}`
  const authStore = useAuthStore()
  if (!authStore.user) {
    await authStore.initialize()
  }
  if (to.name === 'Auth' && authStore.isAuthenticated) {
    const redirectPath = (to.query.redirect as string) || '/'
    next(redirectPath)
    return
  }
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Auth', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router


