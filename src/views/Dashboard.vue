<template>
  <main style="padding:24px">
    <h1>Admin Dashboard</h1>
    <p>Manage organizations, users, revenues, distributions, and payouts.</p>
    <nav style="display:flex; gap:12px; margin-top:16px">
      <router-link to="/organizations">
        Organizations
      </router-link>
      <router-link to="/users">
        Users
      </router-link>
      <router-link to="/revenues">
        Revenues
      </router-link>
      <router-link to="/payouts">
        Payouts
      </router-link>
    </nav>
  </main>
</template>

<script setup lang="ts">
</script>


