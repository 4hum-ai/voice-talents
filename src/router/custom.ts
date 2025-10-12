import type { RouteRecordRaw } from 'vue-router'

// VoiceAct - Voice Actor Management App Routes
export const customRoutes: RouteRecordRaw[] = [
  // Main Dashboard
  {
    path: '/',
    component: () => import('../views/voice-actor/Dashboard.vue'),
    meta: { title: 'VoiceAct Dashboard', requiresAuth: true, keepAlive: true },
  },

  // Voice Actor Profile Management
  {
    path: '/profile',
    redirect: '/profile/edit',
  },
  {
    path: '/profile/edit',
    component: () => import('../views/voice-actor/ProfileEdit.vue'),
    meta: { title: 'My Profile', requiresAuth: true },
  },

  // Project Management
  {
    path: '/projects',
    component: () => import('../views/voice-actor/ProjectsView.vue'),
    meta: { title: 'My Projects', requiresAuth: true },
  },
  {
    path: '/projects/:id',
    component: () => import('../views/voice-actor/ProjectDetail.vue'),
    meta: { title: 'Audio Studio', requiresAuth: true },
  },

  // Casting & Opportunities
  {
    path: '/casting',
    component: () => import('../views/voice-actor/CastingView.vue'),
    meta: { title: 'Casting Opportunities', requiresAuth: true },
  },
  {
    path: '/casting/:id',
    component: () => import('../views/voice-actor/CastingDetail.vue'),
    meta: { title: 'Casting Details', requiresAuth: true },
  },
  {
    path: '/casting/:id/submit',
    component: () => import('../views/voice-actor/CastingSubmit.vue'),
    meta: { title: 'Submit Proposal', requiresAuth: true },
  },
  {
    path: '/casting/:id/proposal',
    component: () => import('../views/voice-actor/CastingProposal.vue'),
    meta: { title: 'View Proposal', requiresAuth: true },
  },

  // Settings
  {
    path: '/settings',
    component: () => import('../views/voice-actor/SettingsView.vue'),
    meta: { title: 'Settings', requiresAuth: true },
  },

  // Voice Client Routes
  {
    path: '/client',
    redirect: '/client/dashboard',
  },
  {
    path: '/client/dashboard',
    component: () => import('../views/voice-client/ClientDashboard.vue'),
    meta: { title: 'Client Dashboard', requiresAuth: true, role: 'client' },
  },
  {
    path: '/client/jobs',
    component: () => import('../views/voice-client/JobManagement.vue'),
    meta: { title: 'Job Management', requiresAuth: true, role: 'client' },
  },
  {
    path: '/client/jobs/:id',
    component: () => import('../views/voice-client/JobDetail.vue'),
    meta: { title: 'Job Details', requiresAuth: true, role: 'client' },
  },
  {
    path: '/client/talents',
    component: () => import('../views/voice-client/TalentManagement.vue'),
    meta: { title: 'Talent Management', requiresAuth: true, role: 'client' },
  },
  {
    path: '/client/talents/:id',
    component: () => import('../views/voice-client/TalentProfile.vue'),
    meta: { title: 'Talent Profile', requiresAuth: true, role: 'client' },
  },
  {
    path: '/client/settings',
    component: () => import('../views/voice-client/ClientSettings.vue'),
    meta: { title: 'Client Settings', requiresAuth: true, role: 'client' },
  },

  // Admin/Design System (keeping existing)
  {
    path: '/admin/design',
    component: () => import('../views/admin/Design.vue'),
    meta: { title: 'Design System', requiresAuth: true },
  },
]
