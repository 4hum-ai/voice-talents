import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMovieService } from '@/composables/useMovieService'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../views/Dashboard.vue'),
    meta: { title: 'Admin Dashboard', requiresAuth: true, keepAlive: true }
  },
  {
    path: '/:module',
    component: () => import('../views/ItemListView.vue'),
    meta: { title: 'Module', requiresAuth: true, keepAlive: true }
  },
  {
    path: '/:module/:id',
    component: () => import('../views/ItemDetailView.vue'),
    meta: { title: 'Detail', requiresAuth: true, keepAlive: true }
  },
  // Auth
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/Auth.vue'),
    meta: { title: 'Sign In' }
  },
  {
    path: '/not-found',
    component: () => import('../views/NotFound.vue'),
    meta: { title: 'Not Found' }
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
  const movie = useMovieService()
  let titleSuffix = String(to.meta.title || 'Admin')
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
    return
  }

  const maybeModule = to.params?.module as string | undefined
  if (maybeModule) {
    // Avoid network calls in the guard; title will be refined in views.
    titleSuffix = to.meta.title ? `${maybeModule} - ${to.meta.title}` : maybeModule
  }

  document.title = `${titleSuffix} - Admin UI`
  next()
})

export default router


