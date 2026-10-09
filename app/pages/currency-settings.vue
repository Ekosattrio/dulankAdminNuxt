<script setup lang="ts">
import CurrencySettingsWorkspace from '~/components/pages/setting/CurrencySettingsWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/currency-settings.html'],
})

useLegacyPage({
  title: 'Currency Settings',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-currency-settings">
    <CurrencySettingsWorkspace />
  </div>
</template>
