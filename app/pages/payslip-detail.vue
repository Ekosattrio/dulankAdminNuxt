<script setup lang="ts">
import PayslipDetailWorkspace from '~/components/Pages/Payslip/PayslipDetailWorkspace.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Payslip Detail',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-payslip-detail">
    <PayslipDetailWorkspace />
  </div>
</template>
