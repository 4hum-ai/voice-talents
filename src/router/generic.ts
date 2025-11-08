import type { RouteRecordRaw } from 'vue-router'

export const genericRoutes: RouteRecordRaw[] = [
  {
    path: '/:module',
    component: () => import('../views/ItemListView.vue'),
    meta: { title: 'Resource', requiresAuth: true, keepAlive: true, layout: 'none' },
  },
  {
    path: '/:module/:id',
    component: () => import('../views/ItemDetailView.vue'),
    meta: { title: 'Detail', requiresAuth: true, keepAlive: true, layout: 'none' },
  },
  // Auth
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/Auth.vue'),
    meta: { title: 'Sign In', layout: 'none' },
  },
  {
    path: '/not-found',
    component: () => import('../views/NotFound.vue'),
    meta: { title: 'Not Found', layout: 'none' },
  },
  // Content Pages (Legal, etc.)
  {
    path: '/content/:slug',
    component: () => import('../views/Content.vue'),
    meta: { requiresAuth: false, layout: 'none' },
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/NotFound.vue'),
    meta: { title: 'Not Found', layout: 'none' },
  },
]
