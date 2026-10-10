<script setup lang="ts">
import KalkulatorDashboardWorkspace from '~/components/Pages/Calculator/KalkulatorDashboardWorkspace.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Kalkulator Dashboard',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-kalkulator-dashboard">
    <KalkulatorDashboardWorkspace />
  </div>
</template>
