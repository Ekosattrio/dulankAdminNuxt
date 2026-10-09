<script setup lang="ts">
import BankSettingsGridWorkspace from '~/components/pages/setting/BankSettingsGridWorkspace.vue'

useLegacyPage({
  title: 'Bank Settings Grid',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-bank-settings-grid">
    <BankSettingsGridWorkspace />
  </div>
</template>
