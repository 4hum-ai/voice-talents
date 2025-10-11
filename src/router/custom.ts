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
    redirect: '/profile/edit'
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
  
  
  
  // Settings
  {
    path: '/settings',
    component: () => import('../views/voice-actor/SettingsView.vue'),
    meta: { title: 'Settings', requiresAuth: true },
  },
  
  // Admin/Design System (keeping existing)
  {
    path: '/admin/design',
    component: () => import('../views/admin/Design.vue'),
    meta: { title: 'Design System', requiresAuth: true },
  },
]
