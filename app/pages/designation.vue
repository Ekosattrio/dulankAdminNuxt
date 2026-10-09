<script setup lang="ts">
import DesignationWorkspace from '~/components/designation/DesignationWorkspace.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Designation - Jabatan Karyawan',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-designation">
    <DesignationWorkspace />
  </div>
</template>
