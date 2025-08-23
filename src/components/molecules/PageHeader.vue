<template>
  <div class="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
    <div>
      <h3 class="text-lg font-semibold text-gray-900">
        <slot name="title" />
      </h3>
      <p class="text-sm text-gray-600">
        <slot name="subtitle" />
      </p>
    </div>
    <div class="flex items-center space-x-4">
      <slot name="actions" />
    </div>
  </div>
  
</template>

<script setup lang="ts">
// No script needed for this simple layout component
</script>


