<script setup lang="ts">
import SecuritySettingsWorkspace from '~/components/Pages/Setting/SecuritySettingsWorkspace.vue'

useLegacyPage({
  title: 'Security Settings',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-security-settings">
    <SecuritySettingsWorkspace />
  </div>
</template>
