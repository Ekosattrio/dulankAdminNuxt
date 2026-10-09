<script setup lang="ts">
import PayslipWorkspace from '~/components/pages/payslip/PayslipWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/payslip.html']
})

useLegacyPage({ title: 'Payslips - Penggajian Karyawan', sweetAlert: false })
</script>

<template>
  <div class="dulank-page dulank-page-payslip">
    <PayslipWorkspace />
  </div>
</template>
