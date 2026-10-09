<script setup lang="ts">
import CalculatorListingsPage from '~/components/pages/calculator/CalculatorListingsPage.vue'

definePageMeta({
  layout: 'default',
  alias: ['/mesin-poli.html'],
})
</script>

<template>
  <CalculatorListingsPage category="hot_print" />
</template>
