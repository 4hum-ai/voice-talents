import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuth } from '@/lib/auth'
import { genericRoutes } from './generic'
import { customRoutes } from './custom'
import { talentRoutes } from './talent'
import { clientRoutes } from './client'
const routes: RouteRecordRaw[] = [
  ...genericRoutes,
  ...customRoutes,
  ...talentRoutes,
  ...clientRoutes,
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, _from, next) => {
  let titleSuffix = String(to.meta.title || 'Admin')
  const { user, isLoading, isAuthenticated, initialize } = useAuth()

  // Try to initialize auth if not already done, but don't block navigation on failure
  if (!user.value && !isLoading.value) {
    try {
      await initialize()
    } catch (error) {
      console.warn('🔐 Router: Auth initialization failed in route guard:', error)
      // Continue with navigation - auth errors are handled in the composable
    }
  }

  if (to.name === 'Auth' && isAuthenticated.value) {
    const redirectPath = (to.query.redirect as string) || '/'
    next(redirectPath)
    return
  }
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'Auth', query: { redirect: to.fullPath } })
    return
  }
  // Ensure auth page always has a redirect parameter
  if (to.name === 'Auth' && !to.query.redirect) {
    next({ name: 'Auth', query: { redirect: '/' } })
    return
  }

  const maybeResource = to.params?.module as string | undefined
  if (maybeResource) {
    // Avoid network calls in the guard; title will be refined in views.
    titleSuffix = to.meta.title ? `${maybeResource} - ${to.meta.title}` : maybeResource
  }

  document.title = `${titleSuffix} - VoiceAct`
  next()
})

export default router
