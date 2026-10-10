<script setup lang="ts">
import EmployeeSalaryWorkspace from '~/components/Pages/EmployeeSalary/EmployeeSalaryWorkspace.vue'

useLegacyPage({ title: 'Employee Salary - Penggajian Karyawan', sweetAlert: false })
</script>

<template>
  <div class="dulank-page dulank-page-employee-salary">
    <EmployeeSalaryWorkspace />
  </div>
</template>
