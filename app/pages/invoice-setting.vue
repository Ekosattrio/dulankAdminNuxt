<script setup lang="ts">
import InvoiceSettingWorkspace from '~/components/pages/setting/InvoiceSettingWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/invoice-setting.html'],
})

useLegacyPage({
  title: 'Invoice Settings - Konfigurasi & Preview Faktur',
  sweetAlert: false
})
</script>

<template>
  <div class="dulank-page dulank-page-invoice-setting">
    <InvoiceSettingWorkspace />
  </div>
</template>
