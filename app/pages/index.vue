<script setup lang="ts">
import AdminDashboardWorkspace from '~/components/Pages/AdminDashboard/AdminDashboardWorkspace.vue'

definePageMeta({ layout: 'default' })

useLegacyPage({
  title: 'Dashboard Admin',
  sweetAlert: true,
})
</script>

<template>
  <div class="dulank-page dulank-page-index">
    <AdminDashboardWorkspace />
  </div>
</template>