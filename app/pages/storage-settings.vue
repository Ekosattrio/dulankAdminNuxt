<script setup lang="ts">
import StorageSettingsWorkspace from '~/components/pages/setting/StorageSettingsWorkspace.vue'

useLegacyPage({
  title: 'Storage Settings',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-storage-settings">
    <StorageSettingsWorkspace />
  </div>
</template>
