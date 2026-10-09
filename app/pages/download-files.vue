<script setup lang="ts">
import DownloadFilesWorkspace from '~/components/pages/download-files/DownloadFilesWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/download-files.html'],
})

useLegacyPage({
  title: 'Download Files - Manage your files',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-download-files p-4 md:p-6">
    <DownloadFilesWorkspace />
  </div>
</template>
