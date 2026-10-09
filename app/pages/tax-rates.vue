<script setup lang="ts">
import TaxRatesWorkspace from '~/components/pages/setting/TaxRatesWorkspace.vue'

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
  <div class="page-wrapper mt-3 dulank-page dulank-page-tax-rates">
    <TaxRatesWorkspace />
  </div>
</template>
