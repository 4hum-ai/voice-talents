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
    component: () => import('../views/voice-actor/ProfileView.vue'),
    meta: { title: 'My Profile', requiresAuth: true },
  },
  {
    path: '/profile/edit',
    component: () => import('../views/voice-actor/ProfileEdit.vue'),
    meta: { title: 'Edit Profile', requiresAuth: true },
  },
  
  // Voice Samples Management
  {
    path: '/samples',
    component: () => import('../views/voice-actor/SamplesView.vue'),
    meta: { title: 'Voice Samples', requiresAuth: true },
  },
  {
    path: '/samples/upload',
    component: () => import('../views/voice-actor/SampleUpload.vue'),
    meta: { title: 'Upload Sample', requiresAuth: true },
  },
  {
    path: '/samples/:id',
    component: () => import('../views/voice-actor/SampleDetail.vue'),
    meta: { title: 'Sample Details', requiresAuth: true },
  },
  {
    path: '/samples/:id/edit',
    component: () => import('../views/voice-actor/SampleEdit.vue'),
    meta: { title: 'Edit Sample', requiresAuth: true },
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
    meta: { title: 'Project Details', requiresAuth: true },
  },
  {
    path: '/projects/:id/assignment/:assignmentId',
    component: () => import('../views/voice-actor/AssignmentView.vue'),
    meta: { title: 'Assignment', requiresAuth: true },
  },
  
  // Studio Collaboration
  {
    path: '/studios',
    component: () => import('../views/voice-actor/StudiosView.vue'),
    meta: { title: 'Studios', requiresAuth: true },
  },
  {
    path: '/studios/:id',
    component: () => import('../views/voice-actor/StudioDetail.vue'),
    meta: { title: 'Studio Details', requiresAuth: true },
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
    meta: { title: 'Submit to Casting', requiresAuth: true },
  },
  
  // Earnings & Analytics
  {
    path: '/earnings',
    component: () => import('../views/voice-actor/EarningsView.vue'),
    meta: { title: 'Earnings', requiresAuth: true },
  },
  {
    path: '/analytics',
    component: () => import('../views/voice-actor/AnalyticsView.vue'),
    meta: { title: 'Analytics', requiresAuth: true },
  },
  
  // Notifications & Messages
  {
    path: '/notifications',
    component: () => import('../views/voice-actor/NotificationsView.vue'),
    meta: { title: 'Notifications', requiresAuth: true },
  },
  {
    path: '/messages',
    component: () => import('../views/voice-actor/MessagesView.vue'),
    meta: { title: 'Messages', requiresAuth: true },
  },
  {
    path: '/messages/:projectId',
    component: () => import('../views/voice-actor/ProjectMessages.vue'),
    meta: { title: 'Project Messages', requiresAuth: true },
  },
  
  // Settings & Preferences
  {
    path: '/settings',
    component: () => import('../views/voice-actor/SettingsView.vue'),
    meta: { title: 'Settings', requiresAuth: true },
  },
  {
    path: '/settings/preferences',
    component: () => import('../views/voice-actor/PreferencesView.vue'),
    meta: { title: 'Preferences', requiresAuth: true },
  },
  {
    path: '/settings/account',
    component: () => import('../views/voice-actor/AccountSettings.vue'),
    meta: { title: 'Account Settings', requiresAuth: true },
  },
  
  // Public Profile (for sharing)
  {
    path: '/public/:actorId',
    component: () => import('../views/voice-actor/PublicProfile.vue'),
    meta: { title: 'Voice Actor Profile', requiresAuth: false },
  },
  
  // Admin/Design System (keeping existing)
  {
    path: '/admin/design',
    component: () => import('../views/admin/Design.vue'),
    meta: { title: 'Design System', requiresAuth: true },
  },
]
