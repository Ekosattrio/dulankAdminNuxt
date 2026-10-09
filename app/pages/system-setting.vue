<script setup lang="ts">
import SystemSettingWorkspace from '~/components/pages/setting/SystemSettingWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/system-setting.html'],
})

useLegacyPage({
  title: 'System Settings',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-system-setting">
    <SystemSettingWorkspace />
  </div>
</template>
