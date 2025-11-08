import type { RouteRecordRaw } from 'vue-router'

export const customRoutes: RouteRecordRaw[] = [
  // Landing Page
  {
    path: '/',
    component: () => import('../views/LandingPage.vue'),
    meta: { title: 'Voice Talent Platform', requiresAuth: false, layout: 'none' },
  },

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
    meta: { title: 'Job Details', requiresAuth: true, layout: 'talent' },
  },
  {
    path: '/talent/jobs/:id/casting/proposal',
    component: () => import('../views/talent/CastingProposal.vue'),
    meta: { title: 'View Proposal', requiresAuth: true, layout: 'talent' },
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
    meta: { title: 'Job Details', requiresAuth: true, layout: 'talent' },
  },
  {
    path: '/talent/jobs/:id/studio',
    component: () => import('../views/talent/TalentAudioStudio.vue'),
    meta: { title: 'Audio Studio', requiresAuth: true, layout: 'talent' },
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
    meta: { title: 'Job Details', requiresAuth: true, role: 'client', layout: 'client' },
  },
  {
    path: '/client/jobs/:id/talent-selection',
    component: () => import('../views/client/TalentSelectionView.vue'),
    meta: { title: 'Talent Selection', requiresAuth: true, role: 'client', layout: 'client' },
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
    meta: { title: 'Talent Profile', requiresAuth: true, role: 'client', layout: 'client' },
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

  // Admin/Design System (keeping existing)
  {
    path: '/admin/design',
    component: () => import('../views/admin/Design.vue'),
    meta: { title: 'Design System', requiresAuth: true, layout: 'default' },
  },
]
