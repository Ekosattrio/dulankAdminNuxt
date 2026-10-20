<script setup lang="ts">
import DownloadFilesWorkspace from '~/components/Pages/DownloadFiles/DownloadFilesWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Download Files - Manage your files',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-download-files">
    <DownloadFilesWorkspace />
  </div>
</template>
