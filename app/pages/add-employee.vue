<script setup lang="ts">
import EmployeePageForm from '~/components/pages/employees/EmployeePageForm.vue'

definePageMeta({
  layout: 'default',
  alias: ['/add-employee.html']
})

useLegacyPage({
  title: 'New Employee',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-add-employee">
    <EmployeePageForm mode="add" />
  </div>
</template>
