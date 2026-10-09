<script setup lang="ts">
import CalculatorListingsPage from '~/components/pages/calculator/CalculatorListingsPage.vue'

definePageMeta({
  layout: 'default',
  alias: ['/kertas-jenis.html'],
})
</script>

<template>
  <CalculatorListingsPage category="paper_type" />
</template>

