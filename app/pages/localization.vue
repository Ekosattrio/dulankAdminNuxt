<script setup lang="ts">
import LocalizationWorkspace from '~/components/pages/setting/LocalizationWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/localization.html'],
})

useLegacyPage({
  title: 'Localization Settings',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-localization">
    <LocalizationWorkspace />
  </div>
</template>
