<script setup lang="ts">
import TaxRatesWorkspace from '~/components/Pages/Setting/TaxRatesWorkspace.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Tax Rates',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-tax-rates">
    <TaxRatesWorkspace />
  </div>
</template>
