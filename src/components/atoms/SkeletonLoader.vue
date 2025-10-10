<template>
  <div :class="skeletonClasses" :style="skeletonStyle">
    <div class="animate-pulse">
      <div v-if="variant === 'text'" class="space-y-2">
        <div
          v-for="i in lines"
          :key="i"
          :class="[
            'bg-gray-200 dark:bg-gray-700 rounded',
            i === lines ? 'w-3/4' : 'w-full'
          ]"
          :style="{ height: `${lineHeight}px` }"
        />
      </div>
      
      <div v-else-if="variant === 'avatar'" class="flex items-center space-x-3">
        <div
          class="bg-gray-200 dark:bg-gray-700 rounded-full"
          :style="{ width: `${size}px`, height: `${size}px` }"
        />
        <div class="space-y-2 flex-1">
          <div
            class="bg-gray-200 dark:bg-gray-700 rounded h-4 w-3/4"
          />
          <div
            class="bg-gray-200 dark:bg-gray-700 rounded h-3 w-1/2"
          />
        </div>
      </div>
      
      <div v-else-if="variant === 'card'" class="space-y-3">
        <div
          class="bg-gray-200 dark:bg-gray-700 rounded"
          :style="{ height: `${cardHeight}px` }"
        />
        <div class="space-y-2">
          <div class="bg-gray-200 dark:bg-gray-700 rounded h-4 w-3/4" />
          <div class="bg-gray-200 dark:bg-gray-700 rounded h-3 w-1/2" />
        </div>
      </div>
      
      <div v-else-if="variant === 'table'" class="space-y-3">
        <div
          v-for="i in rows"
          :key="i"
          class="flex space-x-4"
        >
          <div
            v-for="j in columns"
            :key="j"
            class="bg-gray-200 dark:bg-gray-700 rounded h-4 flex-1"
          />
        </div>
      </div>
      
      <div v-else-if="variant === 'list'" class="space-y-3">
        <div
          v-for="i in items"
          :key="i"
          class="flex items-center space-x-3"
        >
          <div class="bg-gray-200 dark:bg-gray-700 rounded-full w-8 h-8" />
          <div class="flex-1 space-y-2">
            <div class="bg-gray-200 dark:bg-gray-700 rounded h-4 w-3/4" />
            <div class="bg-gray-200 dark:bg-gray-700 rounded h-3 w-1/2" />
          </div>
        </div>
      </div>
      
      <div v-else-if="variant === 'waveform'" class="flex items-center justify-center space-x-1">
        <div
          v-for="i in 20"
          :key="i"
          class="bg-gray-200 dark:bg-gray-700 rounded-sm"
          :style="{
            height: `${Math.random() * 40 + 10}px`,
            width: '3px'
          }"
        />
      </div>
      
      <div v-else-if="variant === 'button'" class="space-y-2">
        <div
          class="bg-gray-200 dark:bg-gray-700 rounded h-10 w-24"
        />
      </div>
      
      <div v-else-if="variant === 'image'" class="space-y-2">
        <div
          class="bg-gray-200 dark:bg-gray-700 rounded"
          :style="{ height: `${imageHeight}px` }"
        />
      </div>
      
      <div v-else-if="variant === 'custom'" class="space-y-2">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'text' | 'avatar' | 'card' | 'table' | 'list' | 'waveform' | 'button' | 'image' | 'custom'
  lines?: number
  lineHeight?: number
  size?: number
  cardHeight?: number
  rows?: number
  columns?: number
  items?: number
  imageHeight?: number
  width?: string
  height?: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  lines: 3,
  lineHeight: 16,
  size: 40,
  cardHeight: 200,
  rows: 5,
  columns: 4,
  items: 5,
  imageHeight: 200,
})

const skeletonClasses = computed(() => {
  const base = 'overflow-hidden'
  return `${base} ${props.className || ''}`
})

const skeletonStyle = computed(() => {
  const style: Record<string, string> = {}
  
  if (props.width) {
    style.width = props.width
  }
  
  if (props.height) {
    style.height = props.height
  }
  
  return style
})
</script>