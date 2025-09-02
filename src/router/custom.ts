import type { RouteRecordRaw } from 'vue-router'

// Place any app-specific routes here. Keep generic routes in generic.ts.
export const customRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/design',
    component: () => import('../views/admin/Design.vue'),
    meta: { title: 'Design System', requiresAuth: true },
  },
]
