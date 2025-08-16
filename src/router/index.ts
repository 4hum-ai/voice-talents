import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../views/Dashboard.vue'),
    meta: { title: 'Admin Dashboard' }
  },
  {
    path: '/organizations',
    component: () => import('../views/Organizations.vue'),
    meta: { title: 'Organizations' }
  },
  {
    path: '/users',
    component: () => import('../views/Users.vue'),
    meta: { title: 'Users' }
  },
  {
    path: '/revenues',
    component: () => import('../views/Revenues.vue'),
    meta: { title: 'Revenues' }
  },
  {
    path: '/payouts',
    component: () => import('../views/Payouts.vue'),
    meta: { title: 'Payouts' }
  },
  {
    path: '/module',
    component: () => import('../views/ModuleView.vue'),
    meta: { title: 'Module' }
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

router.beforeEach((to, _from, next) => {
  document.title = `Movie Dubie Admin - ${to.meta.title || 'Admin'}`
  next()
})

export default router


