import type { RouteRecordRaw } from 'vue-router'

export const clientRoutes: RouteRecordRaw[] = [
  // Voice Client Routes
  {
    path: '/client',
    redirect: '/client/dashboard',
  },
  {
    path: '/client/dashboard',
    component: () => import('../views/client/ClientDashboard.vue'),
    meta: {
      title: 'Client Dashboard',
      subtitle: 'Welcome back!', // Will be dynamically set with user name in view
      requiresAuth: true,
      role: 'client',
      layout: 'client',
    },
  },
  {
    path: '/client/jobs',
    component: () => import('../views/client/JobManagement.vue'),
    meta: {
      title: 'Job Management',
      subtitle: 'Create and manage your voice acting job postings',
      requiresAuth: true,
      role: 'client',
      layout: 'client',
    },
  },
  {
    path: '/client/jobs/:id',
    component: () => import('../views/client/JobDetail.vue'),
    meta: { title: 'Job Details', requiresAuth: true, role: 'client', layout: 'detail' },
  },
  {
    path: '/client/jobs/:id/talent-selection',
    component: () => import('../views/client/TalentSelectionView.vue'),
    meta: { title: 'Talent Selection', requiresAuth: true, role: 'client', layout: 'detail' },
  },
  {
    path: '/client/talents',
    component: () => import('../views/client/TalentManagement.vue'),
    meta: {
      title: 'Talent Management',
      subtitle: 'Browse and manage voice talents for your projects',
      requiresAuth: true,
      role: 'client',
      layout: 'client',
    },
  },
  {
    path: '/client/talents/:id',
    component: () => import('../views/client/TalentProfile.vue'),
    meta: { title: 'Talent Profile', requiresAuth: true, role: 'client', layout: 'detail' },
  },
  {
    path: '/client/settings',
    component: () => import('../views/client/ClientSettings.vue'),
    meta: {
      title: 'Settings',
      subtitle: 'Manage your account settings, job preferences, and social links',
      requiresAuth: true,
      role: 'client',
      layout: 'client',
    },
  },
]
