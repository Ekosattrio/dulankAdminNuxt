<script setup lang="ts">
import StorageSettingsWorkspace from '~/components/pages/setting/StorageSettingsWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/storage-settings.html'],
})

useLegacyPage({
  title: 'Storage Settings',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-storage-settings">
    <StorageSettingsWorkspace />
  </div>
</template>
