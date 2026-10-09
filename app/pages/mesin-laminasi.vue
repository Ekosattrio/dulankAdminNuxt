<script setup lang="ts">
import CalculatorListingsPage from '~/components/pages/calculator/CalculatorListingsPage.vue'

definePageMeta({
  layout: 'default',
  alias: ['/mesin-laminasi.html'],
})
</script>

<template>
  <CalculatorListingsPage category="laminate" />
</template>
