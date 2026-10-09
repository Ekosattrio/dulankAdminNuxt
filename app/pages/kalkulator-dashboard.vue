<script setup lang="ts">
import KalkulatorDashboardWorkspace from '~/components/pages/calculator/KalkulatorDashboardWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/kalkulator-dashboard.html'],
})

useLegacyPage({
  title: 'Kalkulator Dashboard',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-kalkulator-dashboard">
    <KalkulatorDashboardWorkspace />
  </div>
</template>
