import type { RouteRecordRaw } from 'vue-router'

export const customRoutes: RouteRecordRaw[] = [
  // Landing Page
  {
    path: '/',
    component: () => import('../views/LandingPage.vue'),
    meta: { title: 'Voice Talent Platform', requiresAuth: false, layout: 'none' },
  },

  // Admin/Design System
  {
    path: '/admin/design',
    component: () => import('../views/admin/Design.vue'),
    meta: { title: 'Design System', requiresAuth: true, layout: 'default' },
  },
]
