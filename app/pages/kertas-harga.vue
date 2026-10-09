<script setup lang="ts">
import CalculatorListingsPage from '~/components/pages/calculator/CalculatorListingsPage.vue'

definePageMeta({
  layout: 'default',
  alias: ['/kertas-harga.html'],
})
</script>

<template>
  <CalculatorListingsPage category="paper_price" />
</template>

