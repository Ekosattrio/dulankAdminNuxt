<script setup lang="ts">
import CustomFieldWorkspace from '~/components/Pages/Setting/CustomFieldWorkspace.vue'

useLegacyPage({
  title: 'Custom Fields',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-custom-field">
    <CustomFieldWorkspace />
  </div>
</template>
