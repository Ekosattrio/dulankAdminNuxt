<script setup lang="ts">
import LocalizationWorkspace from '~/components/pages/setting/LocalizationWorkspace.vue'

useLegacyPage({
  title: 'Localization Settings',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-localization">
    <LocalizationWorkspace />
  </div>
</template>
