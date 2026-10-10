<script setup lang="ts">
import PrinterSettingsWorkspace from '~/components/Pages/Setting/PrinterSettingsWorkspace.vue'

useLegacyPage({
  title: 'Printer Settings',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-printer-settings">
    <PrinterSettingsWorkspace />
  </div>
</template>
