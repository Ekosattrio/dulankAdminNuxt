<script setup lang="ts">
import InvoiceSettingWorkspace from '~/components/Pages/Setting/InvoiceSettingWorkspace.vue'

definePageMeta({
  layout: 'default'
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
