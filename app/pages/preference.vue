<script setup lang="ts">
import PreferenceWorkspace from '~/components/pages/setting/PreferenceWorkspace.vue'

useLegacyPage({
  title: 'Preferences',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-preference">
    <PreferenceWorkspace />
  </div>
</template>
