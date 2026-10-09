<script setup lang="ts">
import SecuritySettingsWorkspace from '~/components/pages/setting/SecuritySettingsWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/security-settings.html'],
})

useLegacyPage({
  title: 'Security Settings',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-security-settings">
    <SecuritySettingsWorkspace />
  </div>
</template>
