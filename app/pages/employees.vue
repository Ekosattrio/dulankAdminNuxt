<script setup lang="ts">
import EmployeesWorkspace from '~/components/Pages/Employees/EmployeesWorkspace.vue'

useLegacyPage({ title: 'Employees - Daftar Karyawan', sweetAlert: false })
</script>

<template>
  <div class="dulank-page dulank-page-employees">
    <EmployeesWorkspace />
  </div>
</template>
