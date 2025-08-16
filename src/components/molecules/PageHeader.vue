<template>
  <div style="margin-bottom:16px; padding:16px; background:#111318; border:1px solid #1e2130; border-radius:8px; display:flex; align-items:center; justify-content:space-between">
    <div>
      <h3 style="margin:0; font-weight:600;"> <slot name="title" /> </h3>
      <p style="margin:4px 0 0; color:#a0a0a7"><slot name="subtitle" /></p>
    </div>
    <div style="display:flex; gap:12px; align-items:center">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>


