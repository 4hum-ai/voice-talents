/**
 * Sidebar State Management Composable
 * Handles responsive sidebar state for mobile and desktop
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'

// Global state for sidebar
const isOpen = ref(false)
const isCollapsed = ref(false)

export function useSidebar() {
  // Computed properties
  const sidebarOpen = computed({
    get: () => isOpen.value,
    set: (value: boolean) => {
      isOpen.value = value
    },
  })

  const sidebarCollapsed = computed({
    get: () => isCollapsed.value,
    set: (value: boolean) => {
      isCollapsed.value = value
    },
  })

  // Actions
  const open = () => {
    isOpen.value = true
    // Prevent body scroll when sidebar is open on mobile
    if (window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden'
    }
  }

  const close = () => {
    isOpen.value = false
    document.body.style.overflow = ''
  }

  const toggle = () => {
    if (isOpen.value) {
      close()
    } else {
      open()
    }
  }

  // Handle window resize - close sidebar on mobile if window becomes desktop size
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      // Desktop: always show sidebar, reset body overflow
      document.body.style.overflow = ''
      // Don't force close on desktop, but reset overflow
    } else {
      // Mobile: if sidebar is open, keep overflow hidden
      if (!isOpen.value) {
        document.body.style.overflow = ''
      }
    }
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
    handleResize() // Initial check
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    document.body.style.overflow = '' // Cleanup
  })

  return {
    sidebarOpen,
    sidebarCollapsed,
    open,
    close,
    toggle,
  }
}

