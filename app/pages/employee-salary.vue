<script setup lang="ts">
import EmployeeSalaryWorkspace from '~/components/pages/employee-salary/EmployeeSalaryWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/employee-salary.html']
})

useLegacyPage({ title: 'Employee Salary - Penggajian Karyawan', sweetAlert: false })
</script>

<template>
  <div class="dulank-page dulank-page-employee-salary">
    <EmployeeSalaryWorkspace />
  </div>
</template>
