<script setup lang="ts">
import BankSettingsListWorkspace from '~/components/Pages/Setting/BankSettingsListWorkspace.vue'

useLegacyPage({
  title: 'Bank Settings List',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-bank-settings-list">
    <BankSettingsListWorkspace />
  </div>
</template>
