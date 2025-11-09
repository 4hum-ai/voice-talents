<template>
  <Teleport to="body">
    <!-- Overlay -->
    <Transition name="fade">
      <div v-if="open" class="fixed inset-0 z-50 bg-black/60" @click="handleOverlayClick" />
    </Transition>

    <!-- Content Viewer -->
    <Transition :name="isMobile ? 'slide-up' : 'slide-in'">
      <div v-if="open" ref="containerRef" :class="containerClasses">
        <!-- Header -->
        <div
          ref="headerRef"
          class="border-border bg-background sticky top-0 z-10 flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-6"
        >
          <h2 class="text-foreground min-w-0 flex-1 truncate text-lg font-semibold">
            {{ title || 'Content' }}
          </h2>
          <div class="flex items-center gap-2">
            <RouterLink
              :to="`/content/${slug}`"
              target="_blank"
              class="text-primary hover:text-primary/80 flex items-center transition-colors"
              aria-label="Open in new tab"
              @click.stop
            >
              <Icon name="mdi:open-in-new" size="20px" />
            </RouterLink>
            <Button
              variant="ghost"
              size="sm"
              icon="mdi:close"
              aria-label="Close"
              shortcut="Escape"
              @click="handleClose"
            />
          </div>
        </div>

        <!-- Content -->
        <div ref="contentRef" :class="contentClasses" @scroll="handleScroll">
          <div v-if="loading" class="flex items-center justify-center py-12">
            <LoadingSpinner size="md" />
          </div>
          <div
            v-else-if="error"
            class="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
          >
            <p class="text-red-700 dark:text-red-400">{{ error }}</p>
          </div>
          <article
            v-else
            ref="articleRef"
            class="text-foreground [&>a]:text-primary [&>a]:hover:text-primary/80 [&_a]:text-primary [&_a]:hover:text-primary/80 [&>code]:bg-muted [&_code]:bg-muted [&>pre]:bg-muted [&_pre]:bg-muted [&>blockquote]:border-primary [&_blockquote]:border-primary [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:px-2 [&_code]:py-1 [&_code]:font-mono [&_code]:text-sm [&_li]:mb-2 [&_ol]:mb-4 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:p-4 [&_strong]:font-semibold [&_ul]:mb-4 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:pl-6 [&>a]:underline [&>blockquote]:my-4 [&>blockquote]:border-l-4 [&>blockquote]:pl-4 [&>blockquote]:italic [&>code]:rounded [&>code]:px-2 [&>code]:py-1 [&>code]:font-mono [&>code]:text-sm [&>h1]:mt-8 [&>h1]:mb-4 [&>h1]:text-3xl [&>h1]:font-bold [&>h2]:mt-6 [&>h2]:mb-3 [&>h2]:text-2xl [&>h2]:font-semibold [&>h3]:mt-4 [&>h3]:mb-2 [&>h3]:text-xl [&>h3]:font-semibold [&>p]:mb-4 [&>p]:leading-relaxed [&>pre]:mb-4 [&>pre]:overflow-x-auto [&>pre]:rounded-lg [&>pre]:p-4 [&>strong]:font-semibold"
            v-html="renderedContent"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { marked } from 'marked'
import Button from '@/components/atoms/Button.vue'
import Icon from '@/components/atoms/Icon.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner.vue'

interface Props {
  open: boolean
  slug: string
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Refs
const containerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const articleRef = ref<HTMLElement | null>(null)

// State
const loading = ref(true)
const error = ref<string | null>(null)
const renderedContent = ref('')
const title = ref<string>('')
const isMobile = ref(false)
const isExpanded = ref(false)
const lastScrollTop = ref(0)
const scrollThreshold = 50 // Pixels to scroll before expanding/collapsing

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
})

// Computed classes
const containerClasses = computed(() => {
  const base = 'fixed z-50 bg-background shadow-xl transition-all duration-300 ease-out'

  if (isMobile.value) {
    // Mobile: Bottom sheet
    const height = isExpanded.value ? 'h-full' : 'h-3/4'
    return `${base} inset-x-0 bottom-0 ${height} rounded-t-2xl overflow-hidden flex flex-col`
  } else {
    // Desktop: Sidebar from right
    return `${base} top-0 right-0 h-full w-full max-w-2xl flex flex-col`
  }
})

const contentClasses = computed(() => {
  return 'flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8'
})

// Check if mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024 // lg breakpoint
}

// Load content
const loadContent = async () => {
  if (!props.slug) return

  loading.value = true
  error.value = null

  try {
    const response = await fetch(`/content/${props.slug}.md`, {
      cache: 'no-cache',
    })

    if (!response.ok) {
      throw new Error(`Failed to load content`)
    }

    const markdown = await response.text()
    const parsedHtml = marked.parse(markdown) as string
    renderedContent.value = parsedHtml

    // Extract H1 from parsed HTML string directly
    const parser = new DOMParser()
    const doc = parser.parseFromString(parsedHtml, 'text/html')
    const h1 = doc.querySelector('h1')
    if (h1) {
      title.value = h1.textContent || ''
      // Remove the H1 from the content since we show it in the header
      h1.remove()
      renderedContent.value = doc.body.innerHTML
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load content'
  } finally {
    loading.value = false
  }
}

// Handle scroll for mobile bottom sheet expansion
const handleScroll = () => {
  if (!isMobile.value || !contentRef.value) return

  const scrollTop = contentRef.value.scrollTop

  // Expand to full screen when scrolling down
  if (scrollTop > lastScrollTop.value && scrollTop > scrollThreshold && !isExpanded.value) {
    isExpanded.value = true
  }
  // Collapse to 3/4 when scrolling up near the top
  else if (scrollTop < lastScrollTop.value && scrollTop < scrollThreshold && isExpanded.value) {
    isExpanded.value = false
  }

  lastScrollTop.value = scrollTop
}

// Handle overlay click
const handleOverlayClick = () => {
  if (!isMobile.value) {
    handleClose()
  }
}

// Handle close
const handleClose = () => {
  emit('update:open', false)
  emit('close')
}

// Lock body scroll when open
const lockBodyScroll = () => {
  document.body.style.overflow = 'hidden'
}

const unlockBodyScroll = () => {
  document.body.style.overflow = ''
}

// Watch for open changes
watch(
  () => props.open,
  (newValue) => {
    if (newValue) {
      loadContent()
      lockBodyScroll()
      // Reset scroll state
      isExpanded.value = false
      lastScrollTop.value = 0
      if (contentRef.value) {
        contentRef.value.scrollTop = 0
      }
    } else {
      unlockBodyScroll()
    }
  },
)

// Watch for slug changes
watch(
  () => props.slug,
  () => {
    if (props.open) {
      loadContent()
    }
  },
)

// Handle escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.open) {
    handleClose()
  }
}

// Lifecycle
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  window.addEventListener('keydown', handleEscape)

  if (props.open) {
    loadContent()
    lockBodyScroll()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('keydown', handleEscape)
  unlockBodyScroll()
})
</script>

<style scoped>
/* Fade transition for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide up transition for mobile bottom sheet */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-up-enter-from {
  transform: translateY(100%);
}

.slide-up-leave-to {
  transform: translateY(100%);
}

/* Slide in transition for desktop sidebar */
.slide-in-enter-active,
.slide-in-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-in-enter-from {
  transform: translateX(100%);
}

.slide-in-leave-to {
  transform: translateX(100%);
}
</style>
