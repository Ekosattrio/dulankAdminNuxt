<script setup lang="ts">
import CurrencySettingsWorkspace from '~/components/pages/setting/CurrencySettingsWorkspace.vue'

useLegacyPage({
  title: 'Currency Settings',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-currency-settings">
    <CurrencySettingsWorkspace />
  </div>
</template>
