<script setup lang="ts">
import BankSettingsGridWorkspace from '~/components/pages/setting/BankSettingsGridWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/bank-settings-grid.html'],
})

useLegacyPage({
  title: 'Bank Settings Grid',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-bank-settings-grid">
    <BankSettingsGridWorkspace />
  </div>
</template>
