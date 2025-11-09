import type { RouteRecordRaw } from 'vue-router'

export const talentRoutes: RouteRecordRaw[] = [
  // Voice Talent
  {
    path: '/talent',
    redirect: '/talent/dashboard',
  },
  {
    path: '/talent/dashboard',
    component: () => import('../views/talent/TalentDashboard.vue'),
    meta: {
      title: 'Dashboard',
      subtitle: "Welcome back! Here's what's happening with your voice acting career today.",
      requiresAuth: true,
      keepAlive: true,
      layout: 'talent',
    },
  },
  {
    path: '/talent/profile',
    redirect: '/talent/profile/edit',
  },
  {
    path: '/talent/profile/edit',
    component: () => import('../views/talent/ProfileEdit.vue'),
    meta: {
      title: 'Edit Profile',
      subtitle: 'Update your profile information, voice samples, and pricing',
      requiresAuth: true,
      layout: 'talent',
    },
  },
  {
    path: '/talent/casting',
    component: () => import('../views/talent/CastingView.vue'),
    meta: {
      title: 'Casting Opportunities',
      subtitle: 'Discover new voice acting projects and apply to casting calls',
      requiresAuth: true,
      layout: 'talent',
    },
  },
  {
    path: '/talent/jobs/:id/casting',
    component: () => import('../views/talent/TalentJobDetail.vue'),
    meta: { title: 'Job Details', requiresAuth: true, layout: 'detail' },
  },
  {
    path: '/talent/jobs/:id/casting/proposal',
    component: () => import('../views/talent/CastingProposal.vue'),
    meta: { title: 'View Proposal', requiresAuth: true, layout: 'detail' },
  },
  {
    path: '/talent/jobs',
    component: () => import('../views/talent/JobManagement.vue'),
    meta: {
      title: 'My Jobs',
      subtitle: 'Manage your assigned voice acting projects',
      requiresAuth: true,
      layout: 'talent',
    },
  },
  {
    path: '/talent/jobs/:id',
    component: () => import('../views/talent/TalentJobDetail.vue'),
    meta: { title: 'Job Details', requiresAuth: true, layout: 'detail' },
  },
  {
    path: '/talent/jobs/:id/studio',
    component: () => import('../views/talent/TalentAudioStudio.vue'),
    meta: { title: 'Audio Studio', requiresAuth: true, layout: 'detail' },
  },
  {
    path: '/talent/settings',
    component: () => import('../views/talent/SettingsView.vue'),
    meta: {
      title: 'Settings',
      subtitle: 'Manage your account settings, notifications, and privacy preferences',
      requiresAuth: true,
      layout: 'talent',
    },
  },
]
