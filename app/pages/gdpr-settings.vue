<script setup lang="ts">
import GdprSettingsWorkspace from '~/components/Pages/Setting/GdprSettingsWorkspace.vue'

useLegacyPage({
  title: 'GDPR Settings',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-gdpr-settings">
    <GdprSettingsWorkspace />
  </div>
</template>
