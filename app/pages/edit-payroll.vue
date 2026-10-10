<script setup lang="ts">
import PayrollPageForm from '~/components/Pages/EmployeeSalary/PayrollPageForm.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Edit Payroll',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-edit-payroll">
    <PayrollPageForm mode="edit" />
  </div>
</template>
