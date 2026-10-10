<script setup lang="ts">
import SystemSettingWorkspace from '~/components/Pages/Setting/SystemSettingWorkspace.vue'

useLegacyPage({
  title: 'System Settings',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-system-setting">
    <SystemSettingWorkspace />
  </div>
</template>
