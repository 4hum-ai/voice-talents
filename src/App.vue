<template>
  <ToastContainer />
  <router-view v-slot="{ Component, route }">
    <KeepAlive :include="cachedViews">
      <component :is="Component" :key="route.fullPath" />
    </KeepAlive>
  </router-view>
</template>

<script setup lang="ts">
import ToastContainer from '@/components/organisms/ToastContainer.vue';
const cachedViews = ['Dashboard', 'ItemListView', 'ItemDetailView']

</script>

<!-- <script lang="ts">
export default {
  name: 'AppRoot'
}
</script>
 -->

