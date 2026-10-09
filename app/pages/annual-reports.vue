<script setup lang="ts">
import AnnualReportsWorkspace from '~/components/pages/reports/AnnualReportsWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/annual-reports.html'],
})

useLegacyPage({
  title: 'Annual Report (Laporan Rekapitulasi Tahunan) - Kacetak System',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-annual-reports">
    <AnnualReportsWorkspace />
  </div>
</template>
