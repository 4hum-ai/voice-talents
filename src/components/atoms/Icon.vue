<template>
  <!-- Loaded icon content rendered within a sized SVG wrapper -->
  <svg
    v-if="svgContent"
    v-bind="$attrs"
    class="inline-block text-current"
    viewBox="0 0 24 24"
    :style="{ width: size, height: size }"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <!-- Injected paths from Iconify response -->
    <g v-html="svgContent" />
  </svg>
  <div
    v-else-if="isLoading"
    class="bg-muted inline-block animate-pulse rounded"
    :style="{ width: size, height: size }"
  />
  <svg
    v-else
    viewBox="0 0 24 24"
    class="text-muted-foreground inline-block"
    :style="{ width: size, height: size }"
  >
    <path
      fill="currentColor"
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
    />
  </svg>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

interface Props {
  name: string
  size?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: '1em',
})

const svgContent = ref<string>('')
const isLoading = ref(false)
const error = ref(false)

// Parse icon name to get collection and icon
const iconInfo = computed(() => {
  const iconName = props.name

  if (iconName.startsWith('mdi:')) {
    return {
      collection: 'mdi',
      icon: iconName.replace('mdi:', ''),
    }
  }

  // Default to mdi if no collection specified
  return {
    collection: 'mdi',
    icon: iconName,
  }
})

// Load icon from Iconify API
const loadIcon = async () => {
  if (!iconInfo.value.icon) return

  isLoading.value = true
  error.value = false

  try {
    const { collection, icon } = iconInfo.value
    const url = `https://api.iconify.design/${collection}/${icon}.svg`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to load icon: ${response.status}`)
    }

    const svg = await response.text()

    // Extract the path/content from the SVG
    const parser = new DOMParser()
    const doc = parser.parseFromString(svg, 'image/svg+xml')
    const svgElement = doc.querySelector('svg')

    if (svgElement) {
      // Get the inner content of the SVG
      svgContent.value = svgElement.innerHTML
    } else {
      throw new Error('Invalid SVG format')
    }
  } catch (err) {
    console.warn(`Failed to load icon: ${props.name}`, err)
    error.value = true
    svgContent.value = ''
  } finally {
    isLoading.value = false
  }
}

// Watch for changes in icon name
watch(() => props.name, loadIcon, { immediate: true })

// Load icon on mount
onMounted(loadIcon)
</script>
