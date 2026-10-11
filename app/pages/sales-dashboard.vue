<script setup lang="ts">
import SalesDashboardWorkspace from '~/components/Pages/SalesDashboard/SalesDashboardWorkspace.vue'
definePageMeta({ layout: 'default' })
useLegacyPage({ title: 'Sales Dashboard', sweetAlert: false })
</script>

<template>
  <div class="dulank-page dulank-page-sales-dashboard"><SalesDashboardWorkspace /></div>
</template>
