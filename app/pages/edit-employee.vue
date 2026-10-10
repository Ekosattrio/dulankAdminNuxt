<script setup lang="ts">
import EmployeePageForm from '~/components/Pages/Employees/EmployeePageForm.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Edit Employee',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-edit-employee">
    <EmployeePageForm mode="edit" />
  </div>
</template>
