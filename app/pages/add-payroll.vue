<script setup lang="ts">
import PayrollPageForm from '~/components/pages/employee-salary/PayrollPageForm.vue'

definePageMeta({
  layout: 'default',
  alias: ['/add-payroll.html']
})

useLegacyPage({
  title: 'Add Payroll',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-add-payroll">
    <PayrollPageForm mode="add" />
  </div>
</template>
