<script setup lang="ts">
import PosSettingsWorkspace from '~/components/pages/setting/PosSettingsWorkspace.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'POS Settings - Konfigurasi Kasir & Thermal Printer',
  sweetAlert: false
})
</script>

<template>
  <div class="dulank-page dulank-page-pos-settings">
    <PosSettingsWorkspace />
  </div>
</template>
