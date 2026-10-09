<script setup lang="ts">
import GdprSettingsWorkspace from '~/components/pages/setting/GdprSettingsWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/gdpr-settings.html'],
})

useLegacyPage({
  title: 'GDPR Settings',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-gdpr-settings">
    <GdprSettingsWorkspace />
  </div>
</template>
