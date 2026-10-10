<script setup lang="ts">
import PayslipWorkspace from '~/components/Pages/Payslip/PayslipWorkspace.vue'

useLegacyPage({ title: 'Payslips - Penggajian Karyawan', sweetAlert: false })
</script>

<template>
  <div class="dulank-page dulank-page-payslip">
    <PayslipWorkspace />
  </div>
</template>
