<script setup lang="ts">
import BankSettingsListWorkspace from '~/components/pages/setting/BankSettingsListWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/bank-settings-list.html'],
})

useLegacyPage({
  title: 'Bank Settings List',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-bank-settings-list">
    <BankSettingsListWorkspace />
  </div>
</template>
