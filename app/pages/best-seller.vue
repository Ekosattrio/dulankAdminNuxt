<script setup lang="ts">
import BestSellerWorkspace from '~/components/pages/reports/BestSellerWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/best-seller.html'],
})

useLegacyPage({
  title: 'Bestseller Products Report',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-best-seller">
    <BestSellerWorkspace />
  </div>
</template>
