import type { RouteRecordRaw } from 'vue-router'

// VoiceAct - Voice Actor Management App Routes
export const customRoutes: RouteRecordRaw[] = [
  // Landing Page
  {
    path: '/',
    component: () => import('../views/LandingPage.vue'),
    meta: { title: 'VoiceAct - Voice Talent Platform', requiresAuth: false },
  },

  // Voice Actor Dashboard
  {
    path: '/talent',
    redirect: '/talent/dashboard',
  },
  {
    path: '/talent/dashboard',
    component: () => import('../views/talent/Dashboard.vue'),
    meta: { title: 'VoiceAct Dashboard', requiresAuth: true, keepAlive: true },
  },

  // Voice Actor Profile Management
  {
    path: '/talent/profile',
    redirect: '/talent/profile/edit',
  },
  {
    path: '/talent/profile/edit',
    component: () => import('../views/talent/ProfileEdit.vue'),
    meta: { title: 'My Profile', requiresAuth: true },
  },


  // Casting & Opportunities
  {
    path: '/talent/casting',
    component: () => import('../views/talent/CastingView.vue'),
    meta: { title: 'Casting Opportunities', requiresAuth: true },
  },
  {
    path: '/talent/casting/:id',
    component: () => import('../views/talent/CastingDetail.vue'),
    meta: { title: 'Casting Details', requiresAuth: true },
  },
  {
    path: '/talent/casting/:id/submit',
    component: () => import('../views/talent/CastingSubmit.vue'),
    meta: { title: 'Submit Proposal', requiresAuth: true },
  },
  {
    path: '/talent/casting/:id/proposal',
    component: () => import('../views/talent/CastingProposal.vue'),
    meta: { title: 'View Proposal', requiresAuth: true },
  },

  // Job Management (Assigned Jobs)
  {
    path: '/talent/jobs',
    component: () => import('../views/talent/JobManagement.vue'),
    meta: { title: 'My Jobs', requiresAuth: true },
  },
  {
    path: '/talent/jobs/:id',
    component: () => import('../views/talent/TalentJobDetail.vue'),
    meta: { title: 'Job Details', requiresAuth: true },
  },
  {
    path: '/talent/jobs/:id/studio',
    component: () => import('../views/talent/TalentAudioStudio.vue'),
    meta: { title: 'Audio Studio', requiresAuth: true },
  },

  // Settings
  {
    path: '/talent/settings',
    component: () => import('../views/talent/SettingsView.vue'),
    meta: { title: 'Settings', requiresAuth: true },
  },

  // Voice Client Routes
  {
    path: '/client',
    redirect: '/client/dashboard',
  },
  {
    path: '/client/dashboard',
    component: () => import('../views/client/ClientDashboard.vue'),
    meta: { title: 'Client Dashboard', requiresAuth: true, role: 'client' },
  },
  {
    path: '/client/jobs',
    component: () => import('../views/client/JobManagement.vue'),
    meta: { title: 'Job Management', requiresAuth: true, role: 'client' },
  },
  {
    path: '/client/jobs/:id',
    component: () => import('../views/client/JobDetail.vue'),
    meta: { title: 'Job Details', requiresAuth: true, role: 'client' },
  },
  {
    path: '/client/talents',
    component: () => import('../views/client/TalentManagement.vue'),
    meta: { title: 'Talent Management', requiresAuth: true, role: 'client' },
  },
  {
    path: '/client/talents/:id',
    component: () => import('../views/client/TalentProfile.vue'),
    meta: { title: 'Talent Profile', requiresAuth: true, role: 'client' },
  },
  {
    path: '/client/settings',
    component: () => import('../views/client/ClientSettings.vue'),
    meta: { title: 'Client Settings', requiresAuth: true, role: 'client' },
  },

  // Admin/Design System (keeping existing)
  {
    path: '/admin/design',
    component: () => import('../views/admin/Design.vue'),
    meta: { title: 'Design System', requiresAuth: true },
  },
]
