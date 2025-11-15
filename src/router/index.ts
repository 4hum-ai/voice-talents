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

  console.log(
    '🔐 Router: Guard triggered for',
    to.name,
    'isAuthenticated:',
    isAuthenticated.value,
    'user:',
    user.value?.email,
  )

  // Try to initialize auth if not already done, but don't block navigation on failure
  if (!user.value && !isLoading.value) {
    try {
      await initialize()
      console.log('🔐 Router: Auth initialized, isAuthenticated:', isAuthenticated.value)
    } catch (error) {
      console.warn('🔐 Router: Auth initialization failed in route guard:', error)
      // Continue with navigation - auth errors are handled in the composable
    }
  }

  if (to.name === 'Auth' && isAuthenticated.value) {
    const redirectPath = (to.query.redirect as string) || '/'
    console.log('🔐 Router: User already authenticated, redirecting from Auth to:', redirectPath)
    next(redirectPath)
    return
  }
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    console.log('🔐 Router: Route requires auth but user not authenticated, redirecting to Auth')
    next({ name: 'Auth', query: { redirect: to.fullPath } })
    return
  }
  // Ensure auth page always has a redirect parameter
  if (to.name === 'Auth' && !to.query.redirect) {
    console.log('🔐 Router: Auth page without redirect, adding default')
    next({ name: 'Auth', query: { redirect: '/' } })
    return
  }

  const maybeResource = to.params?.module as string | undefined
  if (maybeResource) {
    // Avoid network calls in the guard; title will be refined in views.
    titleSuffix = to.meta.title ? `${maybeResource} - ${to.meta.title}` : maybeResource
  }

  document.title = `${titleSuffix} - VoiceAct`
  console.log('🔐 Router: Allowing navigation to', to.name)
  next()
})

export default router
