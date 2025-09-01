<template>
  <main class="p-6">
    <div
      class="mx-auto max-w-lg rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900"
    >
      <div class="text-6xl font-bold text-gray-900 dark:text-gray-100">404</div>
      <h2 class="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Page not found</h2>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        The page you are looking for does not exist.
      </p>
      <router-link
        to="/"
        class="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 mt-4 inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none"
      >
        Go home
      </router-link>
    </div>
  </main>
</template>

<script setup lang="ts"></script>
