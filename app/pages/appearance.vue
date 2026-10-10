<script setup lang="ts">
import AppearanceWorkspace from '~/components/Pages/Setting/AppearanceWorkspace.vue'

useLegacyPage({
  title: 'Appearance Settings',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-appearance">
    <AppearanceWorkspace />
  </div>
</template>
