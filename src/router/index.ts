import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMovieService } from '@/composables/useMovieService'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../views/Dashboard.vue'),
    meta: { title: 'Admin Dashboard', requiresAuth: true }
  },
  {
    path: '/:module',
    component: () => import('../views/ItemListView.vue'),
    meta: { title: 'Module', requiresAuth: true }
  },
  {
    path: '/:module/:id',
    component: () => import('../views/ItemDetailView.vue'),
    meta: { title: 'Detail', requiresAuth: true }
  },
  {
    path: '/module',
    component: () => import('../views/ItemListView.vue'),
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
    try {
      const modules = await movie.listAdminModules()
      const match = modules.find(m => m.name === maybeModule)
      if (!match) {
        next('/not-found')
        return
      }
      titleSuffix = to.meta.title ? `${match.displayName} - ${to.meta.title}` : match.displayName
    } catch (_) {
      // Ignore and proceed; view layer will surface any errors
    }
  }

  document.title = `${titleSuffix} - Movie Dubie Admin`
  next()
})

export default router


