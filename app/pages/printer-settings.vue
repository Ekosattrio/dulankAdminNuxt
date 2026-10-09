<script setup lang="ts">
import PrinterSettingsWorkspace from '~/components/pages/setting/PrinterSettingsWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/printer-settings.html'],
})

useLegacyPage({
  title: 'Printer Settings',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-printer-settings">
    <PrinterSettingsWorkspace />
  </div>
</template>
