import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** Layout to use for this route */
    layout?: 'talent' | 'client' | 'default' | 'detail' | 'none'
    /** Page title */
    title?: string
    /** Page subtitle/description */
    subtitle?: string
    /** Whether authentication is required */
    requiresAuth?: boolean
    /** Whether to keep the component alive */
    keepAlive?: boolean
    /** User role required */
    role?: 'client' | 'talent'
    /** Module name for generic routes */
    module?: string
  }
}
