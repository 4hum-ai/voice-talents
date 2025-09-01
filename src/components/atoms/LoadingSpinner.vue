<template>
  <svg :class="spinnerClasses" viewBox="0 0 24 24" fill="none">
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    />
    <path
      class="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  size?: "sm" | "md" | "lg";
  color?: "gray" | "primary" | "white";
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  color: "gray",
});

const spinnerClasses = computed(() => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };
  const colors = {
    gray: "text-gray-600 dark:text-gray-300",
    primary: "text-primary-600 dark:text-primary-400",
    white: "text-white",
  };
  return `${sizes[props.size]} animate-spin ${colors[props.color]}`;
});
</script>
