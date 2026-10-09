<script setup lang="ts">
import CalculatorListingsPage from '~/components/pages/calculator/CalculatorListingsPage.vue'

definePageMeta({
  layout: 'default',
  alias: ['/mesin-cetak.html'],
})
</script>

<template>
  <CalculatorListingsPage category="offset" />
</template>
