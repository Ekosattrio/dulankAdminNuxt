<script setup lang="ts">
import ProfitAndLossWorkspace from '~/components/Pages/Reports/ProfitAndLossWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Profit & Loss - Kacetak System',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-profit-and-loss p-4 md:p-6">
    <ProfitAndLossWorkspace />
  </div>
</template>
